use std::borrow::Borrow;

use crate::config::RenderConfig;
use crate::content::{render_double_brace, render_triple_brace};
use crate::context::{resolve_value, LoopVars, State};
use crate::directive::{
    build_custom_element_child_root, build_element_open_tag, build_loop_vars,
    merge_template_host_attrs, Directive,
};
use crate::error::{template_context, RenderError};
use crate::expression::evaluate;
use crate::hydration::HydrationScope;
use crate::json::JsonValue;
use crate::locator::Locator;
use crate::node::{render_binding, render_tag};
use crate::plan::{Body, Element, Instruction, InstructionCursor, RenderPlan, Repeat, When};

pub(crate) fn stream_node(
    template: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<Vec<String>, RenderError> {
    stream_instructions(
        InstructionCursor::new(template, locator),
        template,
        root,
        loop_vars,
        locator,
        hydration,
        is_entry,
        config,
    )
}

pub(crate) fn stream_plan(
    plan: &RenderPlan,
    template: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<Vec<String>, RenderError> {
    stream_instructions(
        &plan.instructions,
        template,
        root,
        loop_vars,
        locator,
        hydration,
        is_entry,
        config,
    )
}

fn stream_instructions<I>(
    instructions: I,
    template: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    mut hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<Vec<String>, RenderError>
where
    I: IntoIterator,
    I::Item: Borrow<Instruction>,
{
    let mut chunks = Vec::new();
    let mut current = String::new();
    append_stream_instructions(
        instructions,
        template,
        root,
        loop_vars,
        locator,
        hydration.as_deref_mut(),
        is_entry,
        config,
        &mut chunks,
        &mut current,
    )?;
    push_non_empty(&mut chunks, current);
    Ok(chunks)
}

fn append_stream_instructions<I>(
    instructions: I,
    template: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    mut hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
    chunks: &mut Vec<String>,
    current: &mut String,
) -> Result<(), RenderError>
where
    I: IntoIterator,
    I::Item: Borrow<Instruction>,
{
    for instruction in instructions {
        let instruction = instruction.borrow();
        let scope = hydration.as_deref_mut();
        if let Instruction::Deferred(Directive::CustomElement(at)) = instruction {
            if crate::attribute::read_tag_name_slice(template, *at)
                .is_some_and(|name| !config.dsd_selection.includes(name))
            {
                current.push_str(&template[*at..]);
                continue;
            }
        }
        if let Instruction::Element(element) = instruction {
            if !config.dsd_selection.includes(&element.name) {
                render_tag(
                    &element.opening,
                    template,
                    root,
                    loop_vars,
                    hydration.as_deref_mut(),
                    current,
                );
                let body = element
                    .children
                    .as_ref()
                    .or(element.unclosed_children.as_ref())
                    .expect("element has authored content");
                append_stream_instructions(
                    &body.plan(template, locator).instructions,
                    &template[body.range.clone()],
                    root,
                    loop_vars,
                    locator,
                    hydration.as_deref_mut(),
                    is_entry,
                    config,
                    chunks,
                    current,
                )
                .map_err(|error| error.rebase(template, body.range.start))?;
                current.push_str(&template[body.range.end..element.after]);
                continue;
            }
        }
        let directive = match instruction {
            Instruction::Literal(range) => {
                current.push_str(&template[range.clone()]);
                continue;
            }
            Instruction::Tag(tag) => {
                render_tag(tag, template, root, loop_vars, scope, current);
                continue;
            }
            Instruction::Binding {
                expression,
                escaped,
            } => {
                push_non_empty(chunks, std::mem::take(current));
                push_non_empty(
                    chunks,
                    render_binding(
                        &template[expression.clone()],
                        *escaped,
                        root,
                        loop_vars,
                        scope,
                    ),
                );
                continue;
            }
            Instruction::When(when) => Directive::When(when.at),
            Instruction::Repeat(repeat) => Directive::Repeat(repeat.at),
            Instruction::Element(element) => Directive::CustomElement(element.at),
            Instruction::Deferred(directive) => *directive,
        };
        push_non_empty(chunks, std::mem::take(current));
        let (dir_chunks, _) = stream_directive(
            directive,
            instruction,
            template,
            root,
            loop_vars,
            locator,
            scope,
            is_entry,
            config,
        )?;
        extend_non_empty(chunks, dir_chunks);
    }
    Ok(())
}

fn stream_directive(
    dir_chunk: Directive,
    prepared: &Instruction,
    template: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
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
        Directive::When(p) => {
            let when = match prepared {
                Instruction::When(when) => Some(when),
                _ => None,
            };
            stream_when(template, p, root, loop_vars, locator, hydration, config, when)
        }
        Directive::Repeat(p) => {
            let repeat = match prepared {
                Instruction::Repeat(repeat) => Some(repeat),
                _ => None,
            };
            stream_repeat(template, p, root, loop_vars, locator, hydration, config, repeat)
        }
        Directive::CustomElement(p) => {
            let element = match prepared {
                Instruction::Element(element) => Some(element),
                _ => None,
            };
            stream_custom_element(
                template,
                p,
                root,
                loop_vars,
                locator.expect("locator is required to render a CustomElement directive"),
                hydration,
                is_entry,
                config,
                element,
            )
        }
    }
}

fn stream_when(
    template: &str,
    at: usize,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
    prepared: Option<&When>,
) -> Result<(Vec<String>, usize), RenderError> {
    let owned;
    let prepared = match prepared {
        Some(prepared) => prepared,
        None => {
            owned = When::parse(template, at)?;
            &owned
        }
    };
    let inner_range = &prepared.body.range;
    let inner = &template[inner_range.clone()];
    let expr = &prepared.expression;

    let chunks = if let Some(hy) = hydration {
        let index = hy.next_binding();
        let inner_chunks = if evaluate(expr, root, loop_vars) {
            let mut child_scope = HydrationScope::new(config.markers_v2);
            stream_plan(
                prepared.body.plan(template, locator),
                inner,
                root,
                loop_vars,
                locator,
                Some(&mut child_scope),
                false,
                config,
            ).map_err(|error| error.rebase(template, inner_range.start))?
        } else {
            Vec::new()
        };
        wrap_chunks_with_markers(
            inner_chunks,
            &hy.content_start_marker(index),
            &hy.content_end_marker(index),
        )
    } else if evaluate(expr, root, loop_vars) {
        stream_plan(
            prepared.body.plan(template, locator), inner, root, loop_vars,
            locator, None, false, config,
        ).map_err(|error| error.rebase(template, inner_range.start))?
    } else {
        Vec::new()
    };

    Ok((chunks, prepared.after))
}

fn stream_repeat(
    template: &str,
    at: usize,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
    prepared: Option<&Repeat>,
) -> Result<(Vec<String>, usize), RenderError> {
    let owned;
    let prepared = match prepared {
        Some(prepared) => prepared,
        None => {
            owned = Repeat::parse(template, at)?;
            &owned
        }
    };
    let inner_range = &prepared.body.range;
    let var_name = &prepared.variable;
    let list_expr = &prepared.collection;

    let items = resolve_value(list_expr, root, loop_vars);
    let chunks = match items.as_deref() {
        None => stream_repeat_items(
            &prepared.body,
            template,
            &[],
            var_name,
            root,
            loop_vars,
            locator,
            hydration,
            config,
        ).map_err(|error| error.rebase(template, inner_range.start))?,
        Some(JsonValue::Array(items)) => stream_repeat_items(
            &prepared.body, template, items, var_name, root, loop_vars, locator, hydration, config,
        ).map_err(|error| error.rebase(template, inner_range.start))?,
        Some(_) => {
            return Err(RenderError::NotAnArray {
                binding: list_expr.clone(),
                context: template_context(template, at),
            });
        }
    };

    Ok((chunks, prepared.after))
}

fn stream_repeat_items(
    body: &Body,
    template: &str,
    items: &[JsonValue],
    var_name: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
) -> Result<Vec<String>, RenderError> {
    let inner = &template[body.range.clone()];
    match hydration {
        Some(hy) => {
            let binding_index = hy.next_binding();
            let mut chunks = Vec::new();

            for (i, item) in items.iter().enumerate() {
                let new_vars = build_loop_vars(loop_vars, var_name, item, i);
                let mut item_scope = HydrationScope::new(config.markers_v2);
                let item_chunks = stream_plan(
                    body.plan(template, locator),
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
                    wrap_chunks_with_markers(
                        item_chunks,
                        &hy.repeat_start_marker(i),
                        &hy.repeat_end_marker(i),
                    ),
                );
            }

            Ok(wrap_chunks_with_markers(
                chunks,
                &hy.content_start_marker(binding_index),
                &hy.content_end_marker(binding_index),
            ))
        }
        None => {
            let mut chunks = Vec::new();
            for (i, item) in items.iter().enumerate() {
                let new_vars = build_loop_vars(loop_vars, var_name, item, i);
                extend_non_empty(
                    &mut chunks,
                    stream_plan(
                        body.plan(template, locator), inner, root, &new_vars,
                        locator, None, false, config,
                    )?,
                );
            }
            Ok(chunks)
        }
    }
}

fn stream_custom_element(
    template: &str,
    at: usize,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: &Locator,
    mut parent_hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
    prepared: Option<&Element>,
) -> Result<(Vec<String>, usize), RenderError> {
    let owned;
    let prepared = match prepared {
        Some(prepared) => prepared,
        None => {
            owned = Element::parse(template, at)?;
            &owned
        }
    };
    let tag_end = prepared.tag_end;
    let tag_name = &prepared.name;
    let open_tag_base = &prepared.base;
    let attrs = &prepared.attrs;
    let child_root_owned =
        build_custom_element_child_root(attrs, root, loop_vars, config.attribute_name_strategy);
    let child_root: &dyn State = match child_root_owned.as_ref() {
        Some(state) => state,
        None => root,
    };

    let rendered_shadow = crate::directive::render_shadow_content(
        tag_name, child_root, locator, config,
    )?;
    let shadowroot_attributes = locator.shadowroot_markup(tag_name);

    let element_open = build_element_open_tag(
        open_tag_base,
        root,
        loop_vars,
        parent_hydration.as_mut().map(|h| &mut **h),
        is_entry,
        prepared.binding_count,
    );
    let element_open = merge_template_host_attrs(
        element_open,
        locator.get_host_attributes(tag_name),
        child_root,
        attrs,
    );

    let children = prepared.children.as_ref().ok_or_else(|| RenderError::UnclosedDirective {
        tag: tag_name.clone(),
        context: template_context(template, at),
    })?;

    let mut chunks = Vec::new();
    let mut opening_chunk = format!(
        "{}<template{}>{}</template>",
        element_open, shadowroot_attributes, rendered_shadow
    );
    let close_tag = format!("</{}>", tag_name);

    if children.range.is_empty() {
        opening_chunk.push_str(&close_tag);
        push_non_empty(&mut chunks, opening_chunk);
        return Ok((chunks, prepared.after));
    }

    push_non_empty(&mut chunks, opening_chunk);
    let mut light_chunks = stream_plan(
        children.plan(template, Some(locator)),
        &template[children.range.clone()],
        root,
        loop_vars,
        Some(locator),
        parent_hydration.as_mut().map(|h| &mut **h),
        false,
        config,
    ).map_err(|error| error.rebase(template, tag_end))?;

    if let Some(last) = light_chunks.last_mut() {
        last.push_str(&close_tag);
        extend_non_empty(&mut chunks, light_chunks);
    } else if let Some(last) = chunks.last_mut() {
        last.push_str(&close_tag);
    }

    Ok((chunks, prepared.after))
}

fn wrap_content_binding(out: String, hydration: Option<&mut HydrationScope>) -> String {
    match hydration {
        None => out,
        Some(hy) => {
            let index = hy.next_binding();
            format!(
                "{}{}{}",
                hy.content_start_marker(index),
                out,
                hy.content_end_marker(index)
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
