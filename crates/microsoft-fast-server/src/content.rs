use crate::json::JsonValue;
use crate::context::resolve_value;
use crate::attribute::find_str;

/// Render a `{{{ expr }}}` unescaped HTML binding.
pub fn render_triple_brace(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
) -> (String, usize) {
    let start = at + 3;
    let Some(end) = find_str(template, "}}}", start) else {
        return ("{{{".to_string(), at + 3);
    };
    let output = resolve_value(template[start..end].trim(), root, loop_vars)
        .map(|v| v.to_display_string())
        .unwrap_or_default();
    (output, end + 3)
}

/// Render a `{{ expr }}` HTML-escaped content binding.
pub fn render_double_brace(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
) -> (String, usize) {
    let start = at + 2;
    let Some(end) = find_str(template, "}}", start) else {
        return ("{{".to_string(), at + 2);
    };
    let output = resolve_value(template[start..end].trim(), root, loop_vars)
        .map(|v| html_escape(&v.to_display_string()))
        .unwrap_or_default();
    (output, end + 2)
}

/// Escape special HTML characters in a string.
pub fn html_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '&' => out.push_str("&amp;"),
            '<' => out.push_str("&lt;"),
            '>' => out.push_str("&gt;"),
            '"' => out.push_str("&quot;"),
            '\'' => out.push_str("&#39;"),
            c => out.push(c),
        }
    }
    out
}
