use crate::json::JsonValue;
use crate::context::resolve_value;
use crate::expression::evaluate;

pub fn render(template: &str, root: &JsonValue) -> String {
    render_node(template, root, &[])
}

enum Directive {
    TripleBrace(usize),
    DoubleBrace(usize),
    When(usize),
    Repeat(usize),
}

impl Directive {
    fn position(&self) -> usize {
        match self {
            Directive::TripleBrace(p) | Directive::DoubleBrace(p)
            | Directive::When(p) | Directive::Repeat(p) => *p,
        }
    }
}

fn next_directive(template: &str, from: usize) -> Option<Directive> {
    let triple = find_str(template, "{{{", from).map(Directive::TripleBrace);
    // Suppress double-brace when it coincides with a triple-brace
    let double = find_str(template, "{{", from).and_then(|d| {
        let shadowed = triple.as_ref().map(|t| t.position() == d).unwrap_or(false);
        if shadowed { None } else { Some(Directive::DoubleBrace(d)) }
    });
    let when = find_directive(template, "<f-when", from).map(Directive::When);
    let repeat = find_directive(template, "<f-repeat", from).map(Directive::Repeat);

    [triple, double, when, repeat]
        .into_iter()
        .flatten()
        .min_by_key(|d| d.position())
}

fn render_node(template: &str, root: &JsonValue, loop_vars: &[(String, JsonValue)]) -> String {
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
            Directive::TripleBrace(p) => render_triple_brace(template, p, root, loop_vars),
            Directive::DoubleBrace(p) => render_double_brace(template, p, root, loop_vars),
            Directive::When(p)        => render_when(template, p, root, loop_vars),
            Directive::Repeat(p)      => render_repeat(template, p, root, loop_vars),
        };

        result.push_str(&chunk);
        pos = next_pos;
    }

    result
}

fn render_triple_brace(template: &str, at: usize, root: &JsonValue, loop_vars: &[(String, JsonValue)]) -> (String, usize) {
    let start = at + 3;
    let Some(end) = find_str(template, "}}}", start) else {
        return ("{{{".to_string(), at + 3);
    };
    let output = resolve_value(template[start..end].trim(), root, loop_vars)
        .map(|v| v.to_display_string())
        .unwrap_or_default();
    (output, end + 3)
}

fn render_double_brace(template: &str, at: usize, root: &JsonValue, loop_vars: &[(String, JsonValue)]) -> (String, usize) {
    let start = at + 2;
    let Some(end) = find_str(template, "}}", start) else {
        return ("{{".to_string(), at + 2);
    };
    let output = resolve_value(template[start..end].trim(), root, loop_vars)
        .map(|v| html_escape(&v.to_display_string()))
        .unwrap_or_default();
    (output, end + 2)
}

fn render_when(template: &str, at: usize, root: &JsonValue, loop_vars: &[(String, JsonValue)]) -> (String, usize) {
    let Some((inner, after)) = extract_directive_content(template, at, "f-when") else {
        return ("<f-when".to_string(), at + 7);
    };
    let Some(expr) = extract_directive_expr(template, at) else {
        return (String::new(), after);
    };
    let output = if evaluate(&expr, root, loop_vars) {
        render_node(&inner, root, loop_vars)
    } else {
        String::new()
    };
    (output, after)
}

fn render_repeat(template: &str, at: usize, root: &JsonValue, loop_vars: &[(String, JsonValue)]) -> (String, usize) {
    let Some((inner, after)) = extract_directive_content(template, at, "f-repeat") else {
        return ("<f-repeat".to_string(), at + 9);
    };
    let Some(expr) = extract_directive_expr(template, at) else {
        return (String::new(), after);
    };
    let Some((var_name, list_expr)) = parse_repeat_expr(&expr) else {
        return (String::new(), after);
    };
    let Some(JsonValue::Array(items)) = resolve_value(&list_expr, root, loop_vars) else {
        return (String::new(), after);
    };
    let output = items.iter().map(|item| {
        let mut new_vars = loop_vars.to_vec();
        new_vars.push((var_name.clone(), item.clone()));
        render_node(&inner, root, &new_vars)
    }).collect();
    (output, after)
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
fn extract_directive_expr(template: &str, tag_start: usize) -> Option<String> {
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
