use crate::json::JsonValue;
use crate::context::resolve_value;
use crate::expression::evaluate;

pub fn render(template: &str, root: &JsonValue) -> String {
    render_node(template, root, &[])
}

fn render_node(template: &str, root: &JsonValue, loop_vars: &[(String, JsonValue)]) -> String {
    let mut result = String::new();
    let mut pos = 0;
    let bytes = template.as_bytes();

    while pos < template.len() {
        // Find earliest of: {{{, {{, <f-when, <f-repeat
        let triple = find_str(template, "{{{", pos);
        let double = find_str(template, "{{", pos);
        // Prefer triple over double if at same position
        let brace_pos = match (triple, double) {
            (Some(t), Some(d)) => if t <= d { Some((t, true)) } else { Some((d, false)) },
            (Some(t), None) => Some((t, true)),
            (None, Some(d)) => Some((d, false)),
            (None, None) => None,
        };
        let when_pos = find_directive(template, "<f-when", pos);
        let repeat_pos = find_directive(template, "<f-repeat", pos);

        // Find earliest position overall
        let earliest = [
            brace_pos.map(|(p, _)| p),
            when_pos,
            repeat_pos,
        ]
        .iter()
        .filter_map(|&x| x)
        .min();

        match earliest {
            None => {
                result.push_str(&template[pos..]);
                break;
            }
            Some(ep) => {
                result.push_str(&template[pos..ep]);
                // Determine which one is earliest
                let is_brace = brace_pos.map(|(p, _)| p == ep).unwrap_or(false);
                let is_when = when_pos.map(|p| p == ep).unwrap_or(false);
                let is_repeat = repeat_pos.map(|p| p == ep).unwrap_or(false);

                if is_brace {
                    let (p, is_triple) = brace_pos.unwrap();
                    if is_triple {
                        // {{{ ... }}}
                        let start = p + 3;
                        if let Some(end) = find_str(template, "}}}", start) {
                            let expr = template[start..end].trim();
                            let val = resolve_value(expr, root, loop_vars);
                            result.push_str(&val.map(|v| v.to_display_string()).unwrap_or_default());
                            pos = end + 3;
                        } else {
                            result.push_str("{{{");
                            pos = p + 3;
                        }
                    } else {
                        // {{ ... }}
                        let start = p + 2;
                        if let Some(end) = find_str(template, "}}", start) {
                            let expr = template[start..end].trim();
                            let val = resolve_value(expr, root, loop_vars);
                            result.push_str(&html_escape(&val.map(|v| v.to_display_string()).unwrap_or_default()));
                            pos = end + 2;
                        } else {
                            result.push_str("{{");
                            pos = p + 2;
                        }
                    }
                } else if is_when && (!is_repeat || when_pos.unwrap() <= repeat_pos.unwrap()) {
                    let tag_start = ep;
                    if let Some((inner, after)) = extract_directive_content(template, tag_start, "f-when") {
                        if let Some(expr) = extract_directive_expr(template, tag_start, "f-when") {
                            if evaluate(&expr, root, loop_vars) {
                                result.push_str(&render_node(&inner, root, loop_vars));
                            }
                        }
                        pos = after;
                    } else {
                        result.push_str("<f-when");
                        pos = tag_start + 7;
                    }
                } else if is_repeat {
                    let tag_start = ep;
                    if let Some((inner, after)) = extract_directive_content(template, tag_start, "f-repeat") {
                        if let Some(expr) = extract_directive_expr(template, tag_start, "f-repeat") {
                            // Parse "item in list"
                            if let Some((var_name, list_expr)) = parse_repeat_expr(&expr) {
                                let list = resolve_value(&list_expr, root, loop_vars);
                                if let Some(JsonValue::Array(items)) = list {
                                    for item in &items {
                                        let mut new_vars = loop_vars.to_vec();
                                        new_vars.push((var_name.clone(), item.clone()));
                                        result.push_str(&render_node(&inner, root, &new_vars));
                                    }
                                }
                            }
                        }
                        pos = after;
                    } else {
                        result.push_str("<f-repeat");
                        pos = tag_start + 9;
                    }
                } else {
                    // Shouldn't happen, advance
                    result.push(bytes[pos] as char);
                    pos += 1;
                }
            }
        }
    }
    result
}

fn find_str(s: &str, pat: &str, from: usize) -> Option<usize> {
    s[from..].find(pat).map(|i| i + from)
}

fn find_directive(template: &str, tag: &str, from: usize) -> Option<usize> {
    let mut pos = from;
    while let Some(idx) = find_str(template, tag, pos) {
        let after = idx + tag.len();
        if after < template.len() {
            let next = template.as_bytes()[after];
            if next == b' ' || next == b'>' || next == b'\n' || next == b'\t' || next == b'\r' {
                return Some(idx);
            }
        }
        pos = idx + 1;
    }
    None
}

/// Extract the `value="{{...}}"` expression from a directive tag.
fn extract_directive_expr(template: &str, tag_start: usize, _tag_name: &str) -> Option<String> {
    let tag_end = find_tag_end(template, tag_start)?;
    let tag_content = &template[tag_start..tag_end];
    let search = "value=\"{{";
    let start = tag_content.find(search)? + search.len();
    let rest = &tag_content[start..];
    let end = rest.find("}}\"")?;
    Some(rest[..end].trim().to_string())
}

/// Find the position just after the closing `>` of an opening tag.
/// Skips `>` inside quoted attribute values.
fn find_tag_end(template: &str, from: usize) -> Option<usize> {
    let bytes = template.as_bytes();
    let mut i = from;
    let mut in_quote = false;
    let mut quote_char = b'"';
    while i < bytes.len() {
        let c = bytes[i];
        if in_quote {
            if c == quote_char {
                in_quote = false;
            }
        } else {
            if c == b'"' || c == b'\'' {
                in_quote = true;
                quote_char = c;
            } else if c == b'>' {
                return Some(i + 1);
            }
        }
        i += 1;
    }
    None
}

/// Extract inner content between opening and matching closing tag.
/// Returns (inner_content, position_after_close_tag).
fn extract_directive_content(template: &str, tag_start: usize, tag_name: &str) -> Option<(String, usize)> {
    let tag_end = find_tag_end(template, tag_start)?;
    let open_tag = format!("<{}", tag_name);
    let close_tag = format!("</{}>", tag_name);

    // Find matching close tag, handling nesting
    let mut depth = 1usize;
    let mut pos = tag_end;
    loop {
        let next_open = find_directive(template, &open_tag, pos);
        let next_close = find_str(template, &close_tag, pos);

        match (next_open, next_close) {
            (_, None) => return None, // No close tag
            (Some(o), Some(c)) if o < c => {
                depth += 1;
                pos = o + open_tag.len();
            }
            (_, Some(c)) => {
                depth -= 1;
                if depth == 0 {
                    let inner = template[tag_end..c].to_string();
                    let after = c + close_tag.len();
                    return Some((inner, after));
                }
                pos = c + close_tag.len();
            }
        }
    }
}

fn parse_repeat_expr(expr: &str) -> Option<(String, String)> {
    let expr = expr.trim();
    let parts: Vec<&str> = expr.splitn(3, ' ').collect();
    if parts.len() == 3 && parts[1] == "in" {
        Some((parts[0].to_string(), parts[2].to_string()))
    } else {
        None
    }
}

fn html_escape(s: &str) -> String {
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
