/// Find the first occurrence of `pat` in `s[from..]`, returning the absolute index.
pub fn find_str(s: &str, pat: &str, from: usize) -> Option<usize> {
    s[from..].find(pat).map(|i| i + from)
}

/// Find a directive tag (e.g. `<f-when`, `<f-repeat`), ensuring the character
/// immediately after the tag name is whitespace or `>` to avoid false matches.
pub fn find_directive(template: &str, tag: &str, from: usize) -> Option<usize> {
    let mut pos = from;
    while let Some(idx) = find_str(template, tag, pos) {
        let after = idx + tag.len();
        if after >= template.len() {
            pos = idx + 1;
            continue;
        }
        match template.as_bytes()[after] {
            b' ' | b'>' | b'\n' | b'\t' | b'\r' => return Some(idx),
            _ => pos = idx + 1,
        }
    }
    None
}

/// Find the position just after the closing `>` of an opening tag, skipping
/// `>` characters that appear inside quoted attribute values.
pub fn find_tag_end(template: &str, from: usize) -> Option<usize> {
    let bytes = template.as_bytes();
    let mut i = from;
    let mut in_quote = false;
    let mut quote_char = b'"';
    while i < bytes.len() {
        match bytes[i] {
            c if in_quote && c == quote_char => in_quote = false,
            b'"' | b'\'' if !in_quote => {
                in_quote = true;
                quote_char = bytes[i];
            }
            b'>' if !in_quote => return Some(i + 1),
            _ => {}
        }
        i += 1;
    }
    None
}

/// Extract the expression from `value="{{...}}"` inside a directive opening tag.
pub fn extract_directive_expr(template: &str, tag_start: usize) -> Option<String> {
    let tag_end = find_tag_end(template, tag_start)?;
    let tag_content = &template[tag_start..tag_end];
    let search = "value=\"{{";
    let start = tag_content.find(search)? + search.len();
    let rest = &tag_content[start..];
    let end = rest.find("}}\"")?;
    Some(rest[..end].trim().to_string())
}

/// Extract the inner content between an opening directive tag and its matching
/// closing tag, handling nested directives of the same name.
/// Returns `(inner_content, position_after_close_tag)`.
pub fn extract_directive_content(
    template: &str,
    tag_start: usize,
    tag_name: &str,
) -> Option<(String, usize)> {
    let tag_end = find_tag_end(template, tag_start)?;
    let open_tag = format!("<{}", tag_name);
    let close_tag = format!("</{}>", tag_name);

    let mut depth = 1usize;
    let mut pos = tag_end;
    loop {
        let next_open = find_directive(template, &open_tag, pos);
        let next_close = find_str(template, &close_tag, pos);

        match (next_open, next_close) {
            (_, None) => return None,
            (Some(o), Some(c)) if o < c => {
                depth += 1;
                pos = o + open_tag.len();
            }
            (_, Some(c)) => {
                depth -= 1;
                if depth == 0 {
                    return Some((template[tag_end..c].to_string(), c + close_tag.len()));
                }
                pos = c + close_tag.len();
            }
        }
    }
}
