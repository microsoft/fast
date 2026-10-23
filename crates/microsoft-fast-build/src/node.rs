use crate::json::JsonValue;
use crate::error::RenderError;
use crate::config::RenderConfig;
use crate::content::{render_triple_brace, render_double_brace};
use crate::directive::{Directive, RenderEvent, next_event, render_when, render_repeat, render_custom_element};
use crate::locator::Locator;
use crate::hydration::HydrationScope;
use crate::attribute::{
    count_tag_attribute_bindings,
    resolve_attribute_bindings_in_tag, strip_client_only_attrs, inject_hydration_marker, find_tag_end,
};

/// Recursively render a template fragment against root state and loop variables.
/// When `hydration` is `Some`, binding markers and `data-fe` attribute count markers are emitted.
/// When `is_entry` is `true`, custom elements found in this fragment are treated as root
/// elements for opening-tag attribute handling. Child state always starts from the current
/// root state, with any state-relevant attributes overlaid on top.
pub fn render_node(
    template: &str,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    mut hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<String, RenderError> {
    let mut result = String::new();
    let mut pos = 0;
    loop {
        let dir_chunk = match next_event(template, pos, locator) {
            None => { result.push_str(&template[pos..]); break; }
            Some(RenderEvent::PlainTag(tag_pos)) => {
                pos = process_plain_html_tag(
                    template, pos, tag_pos, root, loop_vars,
                    hydration.as_mut().map(|h| &mut **h), &mut result,
                );
                continue;
            }
            Some(RenderEvent::Directive(d)) => d,
        };
        result.push_str(&template[pos..dir_chunk.position()]);
        let (chunk, next_pos) = process_directive(
            dir_chunk, template, root, loop_vars, locator,
            hydration.as_mut().map(|h| &mut **h),
            is_entry,
            config,
        )?;
        result.push_str(&chunk);
        pos = next_pos;
    }
    Ok(result)
}

pub(crate) fn process_plain_html_tag(
    template: &str,
    pos: usize,
    tag_pos: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    hydration: Option<&mut HydrationScope>,
    result: &mut String,
) -> usize {
    result.push_str(&template[pos..tag_pos]);

    let tag_end = match find_tag_end(template, tag_pos) {
        Some(e) => e,
        None => {
            // Preserve malformed tags verbatim.
            result.push_str(&template[tag_pos..]);
            return template.len();
        }
    };
    let tag_str = &template[tag_pos..tag_end];

    let (db, sb) = count_tag_attribute_bindings(tag_str);
    let total = db + sb;
    match hydration {
        Some(hy) => {
            if total > 0 {
                let resolved = resolve_attribute_bindings_in_tag(tag_str, root, loop_vars);
                let stripped = strip_client_only_attrs(&resolved);
                let marker = hy.attribute_marker(total);
                result.push_str(&inject_hydration_marker(&stripped, &marker));
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
    if let Some(end) = crate::attribute::style_element_end(template, tag_pos) {
        result.push_str(&template[tag_end..end]);
        end
    } else {
        tag_end
    }
}

fn process_directive(
    dir_chunk: Directive,
    template: &str,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<(String, usize), RenderError> {
    match dir_chunk {
        Directive::TripleBrace(p) => {
            let (out, end) = render_triple_brace(template, p, root, loop_vars)?;
            let final_out = wrap_content_binding(out, template, p, "{{{", "}}}", hydration);
            Ok((final_out, end))
        }
        Directive::DoubleBrace(p) => {
            let (out, end) = render_double_brace(template, p, root, loop_vars)?;
            let final_out = wrap_content_binding(out, template, p, "{{", "}}", hydration);
            Ok((final_out, end))
        }
        Directive::When(p) => render_when(template, p, root, loop_vars, locator, hydration, config),
        Directive::Repeat(p) => render_repeat(template, p, root, loop_vars, locator, hydration, config),
        Directive::CustomElement(p) => {
            render_custom_element(template, p, root, loop_vars, locator.expect("locator is required to render a CustomElement directive"), hydration, is_entry, config)
        }
    }
}

fn wrap_content_binding(
    out: String,
    _template: &str,
    _p: usize,
    _open: &str,
    _close: &str,
    hydration: Option<&mut HydrationScope>,
) -> String {
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
