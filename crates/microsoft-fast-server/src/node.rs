use crate::json::JsonValue;
use crate::error::RenderError;
use crate::content::{render_triple_brace, render_double_brace};
use crate::directive::{Directive, next_directive, render_when, render_repeat};

/// Recursively render a template fragment against root state and loop variables.
pub fn render_node(
    template: &str,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
) -> Result<String, RenderError> {
    let mut result = String::new();
    let mut pos = 0;

    loop {
        let directive = match next_directive(template, pos) {
            None => {
                result.push_str(&template[pos..]);
                break;
            }
            Some(d) => d,
        };

        result.push_str(&template[pos..directive.position()]);

        let (chunk, next_pos) = match directive {
            Directive::TripleBrace(p) => render_triple_brace(template, p, root, loop_vars)?,
            Directive::DoubleBrace(p) => render_double_brace(template, p, root, loop_vars)?,
            Directive::When(p)        => render_when(template, p, root, loop_vars)?,
            Directive::Repeat(p)      => render_repeat(template, p, root, loop_vars)?,
        };

        result.push_str(&chunk);
        pos = next_pos;
    }

    Ok(result)
}
