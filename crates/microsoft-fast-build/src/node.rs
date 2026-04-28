use crate::json::JsonValue;
use crate::error::RenderError;
use crate::config::RenderConfig;
use crate::content::{render_triple_brace, render_double_brace};
use crate::directive::{Directive, next_directive, render_when, render_repeat, render_custom_element};
use crate::locator::Locator;
use crate::hydration::HydrationScope;
use crate::attribute::{
    find_next_plain_html_tag, count_tag_attribute_bindings,
    resolve_attribute_bindings_in_tag, strip_client_only_attrs, inject_compact_marker, find_tag_end,
};

/// Recursively render a template fragment against root state and loop variables.
/// When `hydration` is `Some`, binding markers and attribute compact markers are emitted.
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
        pos = process_plain_html_tags(
            template,
            pos,
            root,
            loop_vars,
            locator,
            hydration.as_mut().map(|h| &mut **h),
            &mut result,
        );
        let dir_chunk = match next_directive(template, pos, locator) {
            None => { result.push_str(&template[pos..]); break; }
            Some(d) => d,
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
        // Find where the next directive starts so we don't scan past it.
        let dir_pos = next_directive(template, pos, locator)
            .map(|d| d.position())
            .unwrap_or(template.len());

        // Find the next plain HTML opening tag that precedes the directive.
        // Plain = not a closing tag, not <!…>, not an f-* directive, and not a
        // custom element that has a template in the locator (those are handled
        // as CustomElement directives by the main loop).
        let tag_pos = match find_next_plain_html_tag(template, pos, locator) {
            Some(p) if p < dir_pos => p,
            // No plain tag before the next directive — hand control back to the main loop.
            _ => break,
        };

        // Emit literal text that precedes this tag.
        result.push_str(&template[pos..tag_pos]);

        let tag_end = match find_tag_end(template, tag_pos) {
            Some(e) => e,
            None => {
                // Malformed tag with no closing `>` — emit the rest verbatim and stop.
                result.push_str(&template[tag_pos..]);
                return template.len();
            }
        };
        let tag_str = &template[tag_pos..tag_end];

        // Count {{expr}} and {expr} attribute bindings on this tag.
        let (db, sb) = count_tag_attribute_bindings(tag_str);
        let total = db + sb;
        match hydration.as_mut() {
            Some(hy) => {
                if total > 0 {
                    // Allocate binding indices for this tag's bindings, resolve {{expr}}
                    // attribute values, strip client-only attrs, then inject the compact
                    // hydration marker `data-fe-c-{start}-{count}`.
                    let start_idx = hy.binding_idx;
                    hy.binding_idx += total;
                    let resolved = resolve_attribute_bindings_in_tag(tag_str, root, loop_vars);
                    let stripped = strip_client_only_attrs(&resolved);
                    result.push_str(&inject_compact_marker(&stripped, start_idx, total));
                } else {
                    // No bindings — still strip client-only attrs but no marker needed.
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
