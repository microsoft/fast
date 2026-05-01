use crate::json::JsonValue;
use crate::context::resolve_value;
use crate::attribute::find_str;
use crate::error::{RenderError, template_context, truncate};

/// Render a `{{{ expr }}}` unescaped HTML binding.
/// Missing values render as an empty string.
pub fn render_triple_brace(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
) -> Result<(String, usize), RenderError> {
    let start = at + 3;
    let end = find_str(template, "}}}", start).ok_or_else(|| RenderError::UnclosedUnescapedBinding {
        expr: truncate(&template[start..], 30),
        context: template_context(template, at),
    })?;
    let expr = template[start..end].trim();
    if expr.is_empty() {
        return Err(RenderError::EmptyBinding { context: template_context(template, at) });
    }
    let output = resolve_value(expr, root, loop_vars)
        .map(|v| v.to_display_string())
        .unwrap_or_default();
    Ok((output, end + 3))
}

/// Render a `{{ expr }}` HTML-escaped content binding.
/// Missing values render as an empty string.
pub fn render_double_brace(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
) -> Result<(String, usize), RenderError> {
    let start = at + 2;
    let end = find_str(template, "}}", start).ok_or_else(|| RenderError::UnclosedBinding {
        expr: truncate(&template[start..], 30),
        context: template_context(template, at),
    })?;
    let expr = template[start..end].trim();
    if expr.is_empty() {
        return Err(RenderError::EmptyBinding { context: template_context(template, at) });
    }
    let output = resolve_value(expr, root, loop_vars)
        .map(|v| html_escape(&v.to_display_string()))
        .unwrap_or_default();
    Ok((output, end + 2))
}

/// Escape special HTML characters in a string.
pub fn html_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '&'  => out.push_str("&amp;"),
            '<'  => out.push_str("&lt;"),
            '>'  => out.push_str("&gt;"),
            '"'  => out.push_str("&quot;"),
            '\'' => out.push_str("&#39;"),
            c    => out.push(c),
        }
    }
    out
}
