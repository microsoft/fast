use crate::attribute::{
    count_tag_attribute_bindings, extract_directive_content, extract_directive_expr,
    find_next_plain_html_tag, find_tag_end, inject_count_marker, parse_element_attributes,
    read_tag_name, resolve_attribute_bindings_in_tag, strip_client_only_attrs,
};
use crate::config::RenderConfig;
use crate::content::{render_double_brace, render_triple_brace};
use crate::context::resolve_value;
use crate::directive::{
    build_custom_element_child_root, build_element_open_tag, build_loop_vars,
    build_shadowroot_template_attrs, next_directive, parse_repeat_expr, Directive,
};
use crate::error::{template_context, RenderError};
use crate::expression::evaluate;
use crate::hydration::HydrationScope;
use crate::json::JsonValue;
use crate::locator::Locator;
use crate::node::render_node;

pub(crate) fn stream_node(
    template: &str,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    mut hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<Vec<String>, RenderError> {
    let mut chunks = Vec::new();
    let mut current = String::new();
    let mut pos = 0;

    loop {
        pos = process_plain_html_tags(
            template,
            pos,
            root,
            loop_vars,
            locator,
            hydration.as_mut().map(|h| &mut **h),
            &mut current,
        );

        let dir_chunk = match next_directive(template, pos, locator) {
            None => {
                current.push_str(&template[pos..]);
                push_non_empty(&mut chunks, current);
                break;
            }
            Some(d) => d,
        };

        current.push_str(&template[pos..dir_chunk.position()]);
        push_non_empty(&mut chunks, std::mem::take(&mut current));

        let (dir_chunks, next_pos) = stream_directive(
            dir_chunk,
            template,
            root,
            loop_vars,
            locator,
            hydration.as_mut().map(|h| &mut **h),
            is_entry,
            config,
        )?;
        extend_non_empty(&mut chunks, dir_chunks);
        pos = next_pos;
    }

    Ok(chunks)
}

fn process_plain_html_tags(
    template: &str,
    mut pos: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    mut hydration: Option<&mut HydrationScope>,
    result: &mut String,
) -> usize {
    loop {
        let dir_pos = next_directive(template, pos, locator)
            .map(|d| d.position())
            .unwrap_or(template.len());

        let tag_pos = match find_next_plain_html_tag(template, pos, locator) {
            Some(p) if p < dir_pos => p,
            _ => break,
        };

        result.push_str(&template[pos..tag_pos]);

        let tag_end = match find_tag_end(template, tag_pos) {
            Some(e) => e,
            None => {
                result.push_str(&template[tag_pos..]);
                return template.len();
            }
        };
        let tag_str = &template[tag_pos..tag_end];
        let (db, sb) = count_tag_attribute_bindings(tag_str);
        let total = db + sb;

        match hydration.as_mut() {
            Some(hy) => {
                if total > 0 {
                    hy.binding_idx += total;
                    let resolved = resolve_attribute_bindings_in_tag(tag_str, root, loop_vars);
                    let stripped = strip_client_only_attrs(&resolved);
                    result.push_str(&inject_count_marker(&stripped, total));
                } else {
                    result.push_str(&strip_client_only_attrs(tag_str));
                }
            }
            None => {
                if db > 0 {
                    result.push_str(&resolve_attribute_bindings_in_tag(tag_str, root, loop_vars));
                } else {
                    result.push_str(tag_str);
                }
            }
        }

        pos = tag_end;
    }

    pos
}

fn stream_directive(
    dir_chunk: Directive,
    template: &str,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<(Vec<String>, usize), RenderError> {
    match dir_chunk {
        Directive::TripleBrace(p) => {
            let (out, end) = render_triple_brace(template, p, root, loop_vars)?;
            Ok((chunk_vec(wrap_content_binding(out, hydration)), end))
        }
        Directive::DoubleBrace(p) => {
            let (out, end) = render_double_brace(template, p, root, loop_vars)?;
            Ok((chunk_vec(wrap_content_binding(out, hydration)), end))
        }
        Directive::When(p) => stream_when(template, p, root, loop_vars, locator, hydration, config),
        Directive::Repeat(p) => {
            stream_repeat(template, p, root, loop_vars, locator, hydration, config)
        }
        Directive::CustomElement(p) => stream_custom_element(
            template,
            p,
            root,
            loop_vars,
            locator.expect("locator is required to render a CustomElement directive"),
            hydration,
            is_entry,
            config,
        ),
    }
}

fn stream_when(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
) -> Result<(Vec<String>, usize), RenderError> {
    let (inner, after) = extract_directive_content(template, at, "f-when").ok_or_else(|| {
        RenderError::UnclosedDirective {
            tag: "f-when".to_string(),
            context: template_context(template, at),
        }
    })?;
    let expr =
        extract_directive_expr(template, at).ok_or_else(|| RenderError::MissingValueAttribute {
            tag: "f-when".to_string(),
            context: template_context(template, at),
        })?;

    let chunks = if let Some(hy) = hydration {
        hy.next_binding();
        let inner_chunks = if evaluate(&expr, root, loop_vars) {
            let mut child_scope = HydrationScope::new();
            stream_node(
                &inner,
                root,
                loop_vars,
                locator,
                Some(&mut child_scope),
                false,
                config,
            )?
        } else {
            Vec::new()
        };
        wrap_chunks_with_markers(
            inner_chunks,
            hy.content_start_marker(),
            hy.content_end_marker(),
        )
    } else if evaluate(&expr, root, loop_vars) {
        stream_node(&inner, root, loop_vars, locator, None, false, config)?
    } else {
        Vec::new()
    };

    Ok((chunks, after))
}

fn stream_repeat(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
) -> Result<(Vec<String>, usize), RenderError> {
    let (inner, after) = extract_directive_content(template, at, "f-repeat").ok_or_else(|| {
        RenderError::UnclosedDirective {
            tag: "f-repeat".to_string(),
            context: template_context(template, at),
        }
    })?;
    let expr =
        extract_directive_expr(template, at).ok_or_else(|| RenderError::MissingValueAttribute {
            tag: "f-repeat".to_string(),
            context: template_context(template, at),
        })?;
    let (var_name, list_expr) =
        parse_repeat_expr(&expr).ok_or_else(|| RenderError::InvalidRepeatExpression {
            expr: expr.clone(),
            context: template_context(template, at),
        })?;

    let chunks = match resolve_value(&list_expr, root, loop_vars) {
        None => stream_repeat_items(
            &inner,
            &[],
            &var_name,
            root,
            loop_vars,
            locator,
            hydration,
            config,
        )?,
        Some(JsonValue::Array(items)) => stream_repeat_items(
            &inner, &items, &var_name, root, loop_vars, locator, hydration, config,
        )?,
        Some(_) => {
            return Err(RenderError::NotAnArray {
                binding: list_expr,
                context: template_context(template, at),
            });
        }
    };

    Ok((chunks, after))
}

fn stream_repeat_items(
    inner: &str,
    items: &[JsonValue],
    var_name: &str,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
) -> Result<Vec<String>, RenderError> {
    match hydration {
        Some(hy) => {
            hy.next_binding();
            let mut chunks = Vec::new();
            let repeat_start = hy.repeat_start_marker();
            let repeat_end = hy.repeat_end_marker();

            for (i, item) in items.iter().enumerate() {
                let new_vars = build_loop_vars(loop_vars, var_name, item, i);
                let mut item_scope = HydrationScope::new();
                let item_chunks = stream_node(
                    inner,
                    root,
                    &new_vars,
                    locator,
                    Some(&mut item_scope),
                    false,
                    config,
                )?;
                extend_non_empty(
                    &mut chunks,
                    wrap_chunks_with_markers(item_chunks, repeat_start, repeat_end),
                );
            }

            Ok(wrap_chunks_with_markers(
                chunks,
                hy.content_start_marker(),
                hy.content_end_marker(),
            ))
        }
        None => {
            let mut chunks = Vec::new();
            for (i, item) in items.iter().enumerate() {
                let new_vars = build_loop_vars(loop_vars, var_name, item, i);
                extend_non_empty(
                    &mut chunks,
                    stream_node(inner, root, &new_vars, locator, None, false, config)?,
                );
            }
            Ok(chunks)
        }
    }
}

fn stream_custom_element(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: &Locator,
    mut parent_hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<(Vec<String>, usize), RenderError> {
    let tag_end = find_tag_end(template, at).ok_or_else(|| RenderError::UnclosedDirective {
        tag: "custom element".to_string(),
        context: template_context(template, at),
    })?;

    let tag_name = read_tag_name(template, at).unwrap_or_default();
    let open_tag_content = &template[at..tag_end];
    let before_gt = open_tag_content[..open_tag_content.len() - 1].trim_end();
    let is_self_closing = before_gt.ends_with('/');
    let open_tag_base = if is_self_closing {
        before_gt[..before_gt.len() - 1].trim_end().to_string()
    } else {
        open_tag_content[..open_tag_content.len() - 1].to_string()
    };

    let attrs = parse_element_attributes(open_tag_content);
    let child_root_owned =
        build_custom_element_child_root(&attrs, root, loop_vars, config.attribute_name_strategy);
    let child_root = child_root_owned.as_ref().unwrap_or(root);

    let mut shadow_scope = HydrationScope::new();
    let element_template = locator.get_template(&tag_name).unwrap_or_default();
    let rendered_shadow = render_node(
        element_template,
        child_root,
        &[],
        Some(locator),
        Some(&mut shadow_scope),
        false,
        config,
    )?;
    let shadowroot_attributes =
        build_shadowroot_template_attrs(locator.get_shadowroot_attributes(&tag_name));

    let element_open = build_element_open_tag(
        &open_tag_base,
        open_tag_content,
        root,
        loop_vars,
        parent_hydration.as_mut().map(|h| &mut **h),
        is_entry,
    );

    let (children, after) = if is_self_closing {
        (String::new(), tag_end)
    } else {
        extract_directive_content(template, at, &tag_name).ok_or_else(|| {
            RenderError::UnclosedDirective {
                tag: tag_name.clone(),
                context: template_context(template, at),
            }
        })?
    };

    let mut chunks = Vec::new();
    let mut opening_chunk = format!(
        "{}<template{}>{}</template>",
        element_open, shadowroot_attributes, rendered_shadow
    );
    let close_tag = format!("</{}>", tag_name);

    if is_self_closing || children.is_empty() {
        opening_chunk.push_str(&close_tag);
        push_non_empty(&mut chunks, opening_chunk);
        return Ok((chunks, after));
    }

    push_non_empty(&mut chunks, opening_chunk);
    let mut light_chunks = stream_node(
        &children,
        root,
        loop_vars,
        Some(locator),
        parent_hydration.as_mut().map(|h| &mut **h),
        false,
        config,
    )?;

    if let Some(last) = light_chunks.last_mut() {
        last.push_str(&close_tag);
        extend_non_empty(&mut chunks, light_chunks);
    } else if let Some(last) = chunks.last_mut() {
        last.push_str(&close_tag);
    }

    Ok((chunks, after))
}

fn wrap_content_binding(out: String, hydration: Option<&mut HydrationScope>) -> String {
    match hydration {
        None => out,
        Some(hy) => {
            hy.next_binding();
            format!(
                "{}{}{}",
                hy.content_start_marker(),
                out,
                hy.content_end_marker()
            )
        }
    }
}

fn wrap_chunks_with_markers(
    mut chunks: Vec<String>,
    start_marker: &str,
    end_marker: &str,
) -> Vec<String> {
    if chunks.is_empty() {
        return chunk_vec(format!("{}{}", start_marker, end_marker));
    }

    chunks[0].insert_str(0, start_marker);
    let last = chunks
        .last_mut()
        .expect("non-empty chunks should have a last item");
    last.push_str(end_marker);
    chunks
}

fn chunk_vec(chunk: String) -> Vec<String> {
    if chunk.is_empty() {
        Vec::new()
    } else {
        vec![chunk]
    }
}

fn extend_non_empty(chunks: &mut Vec<String>, new_chunks: Vec<String>) {
    for chunk in new_chunks {
        push_non_empty(chunks, chunk);
    }
}

fn push_non_empty(chunks: &mut Vec<String>, chunk: String) {
    if !chunk.is_empty() {
        chunks.push(chunk);
    }
}
