use crate::json::JsonValue;
use crate::error::RenderError;
use crate::content::{render_triple_brace, render_double_brace};
use crate::directive::{Directive, next_directive, render_when, render_repeat, render_custom_element};
use crate::locator::Locator;
use crate::hydration::HydrationScope;
use crate::attribute::{
    find_next_plain_html_tag, count_tag_attribute_bindings,
    resolve_attribute_bindings_in_tag, inject_compact_marker, find_tag_end,
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
        // When hydration is active, process plain HTML tags with attribute bindings
        // that appear in the literal region before the next directive.
        if let Some(ref mut hy) = hydration {
            loop {
                // Compute dir_pos fresh each tag iteration since pos changes.
                let dir_pos = next_directive(template, pos, locator)
                    .map(|d| d.position())
                    .unwrap_or(template.len());

                match find_next_plain_html_tag(template, pos, locator) {
                    Some(tag_pos) if tag_pos < dir_pos => {
                        result.push_str(&template[pos..tag_pos]);
                        let tag_end = match find_tag_end(template, tag_pos) {
                            Some(e) => e,
                            None => {
                                result.push_str(&template[tag_pos..]);
                                pos = template.len();
                                break;
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
                            result.push_str(tag_str);
                        }
                        pos = tag_end;
                    }
                    _ => break,
                }
            }
        }

        let dir_chunk = match next_directive(template, pos, locator) {
            None => {
                result.push_str(&template[pos..]);
                break;
            }
            Some(d) => d,
        };

        result.push_str(&template[pos..dir_chunk.position()]);

        let (chunk, next_pos) = match dir_chunk {
            Directive::TripleBrace(p) => {
                let (out, end) = render_triple_brace(template, p, root, loop_vars)?;
                let final_out = if let Some(ref mut hy) = hydration {
                    let idx = hy.next_binding();
                    let name = format!("{}-{}", binding_expr(template, p, "{{{", "}}}"), idx);
                    format!("{}{}{}", hy.start_marker(idx, &name), out, hy.end_marker(idx, &name))
                } else {
                    out
                };
                (final_out, end)
            }
            Directive::DoubleBrace(p) => {
                let (out, end) = render_double_brace(template, p, root, loop_vars)?;
                let final_out = if let Some(ref mut hy) = hydration {
                    let idx = hy.next_binding();
                    let name = format!("{}-{}", binding_expr(template, p, "{{", "}}"), idx);
                    format!("{}{}{}", hy.start_marker(idx, &name), out, hy.end_marker(idx, &name))
                } else {
                    out
                };
                (final_out, end)
            }
            Directive::When(p) => render_when(
                template, p, root, loop_vars, locator,
                hydration.as_mut().map(|h| &mut **h),
            )?,
            Directive::Repeat(p) => render_repeat(
                template, p, root, loop_vars, locator,
                hydration.as_mut().map(|h| &mut **h),
            )?,
            Directive::CustomElement(p) => {
                let loc = locator.unwrap();
                render_custom_element(
                    template, p, root, loop_vars, loc,
                    hydration.as_mut().map(|h| &mut **h),
                )?
            }
        };

        result.push_str(&chunk);
        pos = next_pos;
    }

    Ok(result)
}

/// Extract the trimmed expression text from a `{{expr}}` or `{{{expr}}}` binding.
fn binding_expr<'a>(template: &'a str, at: usize, open: &str, close: &str) -> &'a str {
    let inner = &template[at + open.len()..];
    inner.find(close).map(|e| inner[..e].trim()).unwrap_or("")
}
