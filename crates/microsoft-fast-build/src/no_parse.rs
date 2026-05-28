//! Preprocessing for the `f-no-parse` opt-out attribute.
//!
//! When an HTML element bears the `f-no-parse` attribute, the FAST template
//! parser and the server-side renderer must skip *all* template processing for
//! that element and its descendants — no data bindings (`{{}}`, `{{{}}}`,
//! `{}`) and no template directives (`<f-when>`, `<f-repeat>`) are emitted.
//! This preprocessing pass walks the input HTML, finds every `f-no-parse`
//! subtree, strips the attribute itself, and replaces FAST syntax characters
//! inside the subtree with HTML numeric character references so the regular
//! parser does not detect them. The browser later decodes those entities
//! when rendering the page, so the literal characters reach the user as
//! intended.
//!
//! The pass is a no-op for input that does not contain `f-no-parse`, and it
//! is idempotent: a second pass on already-preprocessed HTML produces the
//! same output.

const NO_PARSE_ATTR: &str = "f-no-parse";

/// HTML void elements that have no content and therefore no matching close
/// tag. `f-no-parse` on a void element is a no-op (no subtree to neutralize)
/// but the attribute itself is still stripped from the output.
const VOID_ELEMENTS: &[&str] = &[
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
    "param", "source", "track", "wbr",
];

/// Apply `f-no-parse` preprocessing to an HTML string. Returns a new string
/// with the attribute stripped from every element that bears it and with
/// FAST syntax characters/sequences neutralized inside those subtrees.
pub fn apply_no_parse_directive(html: &str) -> String {
    if !html.contains(NO_PARSE_ATTR) {
        return html.to_string();
    }

    let bytes = html.as_bytes();
    let mut result = String::with_capacity(html.len());
    let mut pos = 0;

    while pos < bytes.len() {
        let lt = match find_byte(bytes, pos, b'<') {
            Some(p) => p,
            None => {
                result.push_str(&html[pos..]);
                break;
            }
        };

        if html[lt..].starts_with("<!--") {
            let end = html[lt + 4..]
                .find("-->")
                .map(|e| lt + 4 + e + 3)
                .unwrap_or(html.len());
            result.push_str(&html[pos..end]);
            pos = end;
            continue;
        }

        let opening = match parse_opening_tag(html, lt) {
            Some(o) => o,
            None => {
                result.push_str(&html[pos..lt + 1]);
                pos = lt + 1;
                continue;
            }
        };

        result.push_str(&html[pos..opening.tag_start]);

        if !opening.has_no_parse {
            result.push_str(&html[opening.tag_start..opening.tag_end]);
            pos = opening.tag_end;
            continue;
        }

        let mut stripped =
            html[opening.tag_start..opening.no_parse_attr_start].to_string();
        while stripped.ends_with(|c: char| c.is_ascii_whitespace()) {
            stripped.pop();
        }
        stripped.push_str(&html[opening.no_parse_attr_end..opening.tag_end]);
        result.push_str(&stripped);

        if opening.is_self_closing {
            pos = opening.tag_end;
            continue;
        }

        let close_start =
            find_matching_close_tag(html, opening.content_start, &opening.tag_name);
        let inner = &html[opening.content_start..close_start];
        result.push_str(&neutralize_no_parse_content(inner));
        pos = close_start;
    }

    result
}

struct OpeningTag {
    tag_name: String,
    tag_start: usize,
    tag_end: usize,
    content_start: usize,
    is_self_closing: bool,
    has_no_parse: bool,
    no_parse_attr_start: usize,
    no_parse_attr_end: usize,
}

fn find_byte(bytes: &[u8], start: usize, needle: u8) -> Option<usize> {
    bytes[start..]
        .iter()
        .position(|&b| b == needle)
        .map(|p| p + start)
}

fn is_attr_name_byte(b: u8) -> bool {
    !matches!(
        b,
        b' ' | b'\t' | b'\n' | b'\r' | b'\x0C' | b'=' | b'>' | b'/'
    )
}

fn parse_opening_tag(html: &str, pos: usize) -> Option<OpeningTag> {
    let bytes = html.as_bytes();
    if pos >= bytes.len() || bytes[pos] != b'<' {
        return None;
    }
    let next = bytes.get(pos + 1).copied().unwrap_or(0);
    if next == b'/' || next == b'!' || next == b'?' {
        return None;
    }
    if !next.is_ascii_alphabetic() {
        return None;
    }

    let mut name_end = pos + 1;
    while name_end < bytes.len() {
        let b = bytes[name_end];
        if b.is_ascii_alphanumeric() || b == b'-' {
            name_end += 1;
        } else {
            break;
        }
    }
    let tag_name = html[pos + 1..name_end].to_ascii_lowercase();
    if tag_name.is_empty() {
        return None;
    }

    let mut cursor = name_end;
    let mut has_no_parse = false;
    let mut no_parse_attr_start = 0;
    let mut no_parse_attr_end = 0;

    while cursor < bytes.len() {
        while cursor < bytes.len() && bytes[cursor].is_ascii_whitespace() {
            cursor += 1;
        }
        if cursor >= bytes.len() {
            return None;
        }
        let b = bytes[cursor];
        if b == b'>' {
            break;
        }
        if b == b'/' && bytes.get(cursor + 1).copied() == Some(b'>') {
            break;
        }
        let attr_start = cursor;
        while cursor < bytes.len() && is_attr_name_byte(bytes[cursor]) {
            cursor += 1;
        }
        let attr_name = html[attr_start..cursor].to_ascii_lowercase();
        let mut after = cursor;
        while after < bytes.len() && bytes[after].is_ascii_whitespace() {
            after += 1;
        }
        if bytes.get(after).copied() == Some(b'=') {
            cursor = after + 1;
            while cursor < bytes.len() && bytes[cursor].is_ascii_whitespace() {
                cursor += 1;
            }
            let quote = bytes.get(cursor).copied().unwrap_or(0);
            if quote == b'"' || quote == b'\'' {
                let q_end = find_byte(bytes, cursor + 1, quote);
                cursor = q_end.map(|e| e + 1).unwrap_or(bytes.len());
            } else {
                while cursor < bytes.len()
                    && !bytes[cursor].is_ascii_whitespace()
                    && bytes[cursor] != b'>'
                {
                    cursor += 1;
                }
            }
            if attr_name == NO_PARSE_ATTR {
                has_no_parse = true;
                no_parse_attr_start = attr_start;
                no_parse_attr_end = cursor;
            }
        } else {
            if attr_name == NO_PARSE_ATTR {
                has_no_parse = true;
                no_parse_attr_start = attr_start;
                no_parse_attr_end = cursor;
            }
        }
    }

    let mut is_self_closing = false;
    if bytes.get(cursor).copied() == Some(b'/') && bytes.get(cursor + 1).copied() == Some(b'>') {
        is_self_closing = true;
        cursor += 2;
    } else if bytes.get(cursor).copied() == Some(b'>') {
        cursor += 1;
    } else {
        return None;
    }

    if VOID_ELEMENTS.iter().any(|v| *v == tag_name) {
        is_self_closing = true;
    }

    Some(OpeningTag {
        tag_name,
        tag_start: pos,
        tag_end: cursor,
        content_start: cursor,
        is_self_closing,
        has_no_parse,
        no_parse_attr_start,
        no_parse_attr_end,
    })
}

fn find_matching_close_tag(html: &str, content_start: usize, tag_name: &str) -> usize {
    let bytes = html.as_bytes();
    let mut depth = 1usize;
    let mut pos = content_start;
    let close_needle = format!("</{}", tag_name);

    while pos < bytes.len() {
        let lt = match find_byte(bytes, pos, b'<') {
            Some(p) => p,
            None => return html.len(),
        };

        if html[lt..].len() >= close_needle.len() {
            let slice_lower = html[lt..lt + close_needle.len()].to_ascii_lowercase();
            if slice_lower == close_needle {
                let after = bytes.get(lt + close_needle.len()).copied().unwrap_or(0);
                if after == b'>' || after.is_ascii_whitespace() {
                    depth -= 1;
                    if depth == 0 {
                        return lt;
                    }
                    let gt = find_byte(bytes, lt, b'>');
                    pos = gt.map(|e| e + 1).unwrap_or(html.len());
                    continue;
                }
            }
        }

        if html[lt..].starts_with("<!--") {
            let end = html[lt + 4..]
                .find("-->")
                .map(|e| lt + 4 + e + 3)
                .unwrap_or(html.len());
            pos = end;
            continue;
        }
        let nb = bytes.get(lt + 1).copied().unwrap_or(0);
        if nb == b'!' || nb == b'?' || nb == b'/' {
            let gt = find_byte(bytes, lt, b'>');
            pos = gt.map(|e| e + 1).unwrap_or(html.len());
            continue;
        }

        match parse_opening_tag(html, lt) {
            Some(opening) => {
                if opening.tag_name == tag_name && !opening.is_self_closing {
                    depth += 1;
                }
                pos = opening.tag_end;
            }
            None => {
                pos = lt + 1;
            }
        }
    }

    html.len()
}

/// Escape FAST syntax characters and directive tags inside an `f-no-parse`
/// subtree so the parser does not detect them as bindings or directives.
/// Curly braces are escaped with numeric character references (`&#123;`,
/// `&#125;`) and `<f-when` / `<f-repeat` are escaped with `&lt;`. The
/// browser decodes these entities when rendering, so the literal characters
/// still appear in the final output.
fn neutralize_no_parse_content(content: &str) -> String {
    let mut out = String::with_capacity(content.len());
    let mut chars = content.char_indices().peekable();
    while let Some((i, ch)) = chars.next() {
        match ch {
            '{' => out.push_str("&#123;"),
            '}' => out.push_str("&#125;"),
            '<' => {
                let rest = &content[i + 1..];
                if starts_with_ignore_ascii_case(rest, "f-when")
                    && !next_char_is_name_char(rest, 6)
                {
                    out.push_str("&lt;");
                } else if starts_with_ignore_ascii_case(rest, "f-repeat")
                    && !next_char_is_name_char(rest, 8)
                {
                    out.push_str("&lt;");
                } else {
                    out.push('<');
                }
            }
            _ => out.push(ch),
        }
    }
    out
}

fn starts_with_ignore_ascii_case(s: &str, prefix: &str) -> bool {
    s.len() >= prefix.len() && s[..prefix.len()].eq_ignore_ascii_case(prefix)
}

fn next_char_is_name_char(s: &str, offset: usize) -> bool {
    s.as_bytes()
        .get(offset)
        .map(|&b| b.is_ascii_alphanumeric() || b == b'-')
        .unwrap_or(false)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn passthrough_when_no_attribute() {
        let input = "<div>{{foo}}</div>";
        assert_eq!(apply_no_parse_directive(input), input);
    }

    #[test]
    fn strips_attribute_and_neutralizes_braces() {
        let input = "<code f-no-parse>{{greeting}}</code>";
        let expected = "<code>&#123;&#123;greeting&#125;&#125;</code>";
        assert_eq!(apply_no_parse_directive(input), expected);
    }

    #[test]
    fn strips_attribute_with_value() {
        let input = "<code f-no-parse=\"\">{{x}}</code>";
        let expected = "<code>&#123;&#123;x&#125;&#125;</code>";
        assert_eq!(apply_no_parse_directive(input), expected);
    }

    #[test]
    fn preserves_outer_bindings() {
        let input = "<h1>{{a}}</h1><code f-no-parse>{{b}}</code><p>{{c}}</p>";
        let expected =
            "<h1>{{a}}</h1><code>&#123;&#123;b&#125;&#125;</code><p>{{c}}</p>";
        assert_eq!(apply_no_parse_directive(input), expected);
    }

    #[test]
    fn neutralizes_f_when_and_f_repeat() {
        let input = "<code f-no-parse><f-when>x</f-when><f-repeat>y</f-repeat></code>";
        let result = apply_no_parse_directive(input);
        assert!(result.contains("&lt;f-when>"));
        assert!(result.contains("&lt;f-repeat>"));
    }

    #[test]
    fn handles_nested_same_tag() {
        let input = "<div f-no-parse><div>{{x}}</div></div><div>{{y}}</div>";
        let expected =
            "<div><div>&#123;&#123;x&#125;&#125;</div></div><div>{{y}}</div>";
        assert_eq!(apply_no_parse_directive(input), expected);
    }

    #[test]
    fn idempotent() {
        let input = "<code f-no-parse>{{x}}</code>";
        let once = apply_no_parse_directive(input);
        let twice = apply_no_parse_directive(&once);
        assert_eq!(once, twice);
    }

    #[test]
    fn void_element_with_attribute() {
        let input = "<br f-no-parse><p>{{x}}</p>";
        let expected = "<br><p>{{x}}</p>";
        assert_eq!(apply_no_parse_directive(input), expected);
    }

    #[test]
    fn attribute_in_middle_of_attrs() {
        let input = "<code class=\"a\" f-no-parse id=\"b\">{{x}}</code>";
        let result = apply_no_parse_directive(input);
        assert!(result.starts_with("<code class=\"a\" id=\"b\">"));
        assert!(result.contains("&#123;&#123;x&#125;&#125;"));
    }
}
