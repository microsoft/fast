use crate::json::JsonValue;
use crate::error::RenderError;
use crate::content::{render_triple_brace, render_double_brace};
use crate::directive::{Directive, next_directive, render_when, render_repeat, render_custom_element};
use crate::locator::Locator;
use crate::hydration::HydrationScope;
use crate::attribute::{
    find_next_plain_html_tag, count_tag_attribute_bindings,
    resolve_attribute_bindings_in_tag, inject_compact_marker, find_tag_end,
    normalize_dataset_attribute_names,
};

/// Recursively render a template fragment against root state and loop variables.
/// When `hydration` is `Some`, binding markers and attribute compact markers are emitted.
pub fn render_node(
    template: &str,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    mut hydration: Option<&mut HydrationScope>,
) -> Result<String, RenderError> {
    let mut result = String::new();
    let mut pos = 0;
    loop {
        if let Some(ref mut hy) = hydration {
            pos = process_hydration_tags(template, pos, root, loop_vars, locator, hy, &mut result);
        }
        let dir_chunk = match next_directive(template, pos, locator) {
            None => { result.push_str(&template[pos..]); break; }
            Some(d) => d,
        };
        result.push_str(&template[pos..dir_chunk.position()]);
        let (chunk, next_pos) = process_directive(
            dir_chunk, template, root, loop_vars, locator,
            hydration.as_mut().map(|h| &mut **h),
        )?;
        result.push_str(&chunk);
        pos = next_pos;
    }
    Ok(result)
}

fn process_hydration_tags(
    template: &str,
    mut pos: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    hy: &mut HydrationScope,
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
        if total > 0 {
            let start_idx = hy.binding_idx;
            hy.binding_idx += total;
            let resolved = resolve_attribute_bindings_in_tag(tag_str, root, loop_vars);
            result.push_str(&inject_compact_marker(&resolved, start_idx, total));
        } else {
            result.push_str(&normalize_dataset_attribute_names(tag_str));
        }
        pos = tag_end;
    }
    pos
}

fn process_directive(
    dir_chunk: Directive,
    template: &str,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
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
        Directive::When(p) => render_when(template, p, root, loop_vars, locator, hydration),
        Directive::Repeat(p) => render_repeat(template, p, root, loop_vars, locator, hydration),
        Directive::CustomElement(p) => {
            render_custom_element(template, p, root, loop_vars, locator.unwrap(), hydration)
        }
    }
}

fn wrap_content_binding(
    out: String,
    template: &str,
    p: usize,
    open: &str,
    close: &str,
    hydration: Option<&mut HydrationScope>,
) -> String {
    match hydration {
        None => out,
        Some(hy) => {
            let idx = hy.next_binding();
            let name = format!("{}-{}", binding_expr(template, p, open, close), idx);
            format!("{}{}{}", hy.start_marker(idx, &name), out, hy.end_marker(idx, &name))
        }
    }
}

/// Extract the trimmed expression text from a `{{expr}}` or `{{{expr}}}` binding.
fn binding_expr<'a>(template: &'a str, at: usize, open: &str, close: &str) -> &'a str {
    let inner = &template[at + open.len()..];
    inner.find(close).map(|e| inner[..e].trim()).unwrap_or("")
}
