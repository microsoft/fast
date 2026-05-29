//! Auto-escape FAST brace characters inside `<code>` elements.
//!
//! FAST templates that include code samples often contain literal text
//! such as `{{greeting}}` that the template parser would otherwise
//! interpret as data bindings. Mirroring the approach taken by
//! Microsoft WebUI's `webui-press` markdown renderer
//! (`crates/webui-press/src/markdown.rs`), this preprocessing pass
//! walks the input HTML, finds every `<code>` element, and replaces
//! `{` / `}` inside the element's content with their HTML numeric
//! character references (`&#123;` / `&#125;`). The FAST parser then
//! sees no brace pairs and emits no bindings inside the code sample;
//! the browser decodes the entities when rendering so the literal
//! characters still appear in the final output.
//!
//! Only the brace characters are neutralised — directive tags such as
//! `<f-when>` and `<f-repeat>` must be escaped by the author using the
//! standard HTML escapes (`&lt;` / `&gt;`) just as they would in any
//! other code-block content. The pass is a no-op for input that does
//! not contain a `<code` substring, and is idempotent: a second pass
//! over already-preprocessed HTML produces the same output (no
//! unescaped `{` / `}` remain inside any `<code>` element).

/// HTML void elements that have no content and therefore no matching
/// close tag. Included for completeness in `parse_opening_tag` so a
/// `<code />` style self-closing form is handled correctly even though
/// the parser also recognises the explicit XHTML-style self-close.
const VOID_ELEMENTS: &[&str] = &[
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
    "param", "source", "track", "wbr",
];

const CODE_ELEMENT: &str = "code";

/// Apply `<code>` brace-escape preprocessing to an HTML string. Returns a
/// new string with `{` and `}` inside every `<code>` element replaced by
/// `&#123;` / `&#125;` so the FAST parser does not detect them as
/// bindings. Content outside `<code>` is left untouched.
pub fn escape_braces_in_code_elements(html: &str) -> String {
    if !html.contains("<code") {
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

        if opening.tag_name != CODE_ELEMENT {
            result.push_str(&html[pos..opening.tag_end]);
            pos = opening.tag_end;
            continue;
        }

        result.push_str(&html[pos..opening.tag_end]);

        if opening.is_self_closing {
            pos = opening.tag_end;
            continue;
        }

        let close_start =
            find_matching_close_tag(html, opening.content_start, CODE_ELEMENT);
        let inner = &html[opening.content_start..close_start];
        result.push_str(&escape_braces(inner));
        pos = close_start;
    }

    result
}

struct OpeningTag {
    tag_name: String,
    tag_end: usize,
    content_start: usize,
    is_self_closing: bool,
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
        while cursor < bytes.len() && is_attr_name_byte(bytes[cursor]) {
            cursor += 1;
        }
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
        tag_end: cursor,
        content_start: cursor,
        is_self_closing,
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

/// Byte-scan: find the next `{` or `}`, bulk-copy the rest. Mirrors the
/// `emit_escaped` helper in `webui-press` (modulo the additional HTML
/// entity escaping that WebUI applies to `&`/`<`/`>` — those are the
/// caller's responsibility here because the input to this function is
/// raw HTML in which `<` is significant markup).
fn escape_braces(s: &str) -> String {
    let bytes = s.as_bytes();
    let mut out = String::with_capacity(s.len());
    let mut start = 0;
    for (i, &b) in bytes.iter().enumerate() {
        let esc = match b {
            b'{' => "&#123;",
            b'}' => "&#125;",
            _ => continue,
        };
        out.push_str(&s[start..i]);
        out.push_str(esc);
        start = i + 1;
    }
    out.push_str(&s[start..]);
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn passthrough_when_no_code_element() {
        let input = "<div>{{foo}}</div>";
        assert_eq!(escape_braces_in_code_elements(input), input);
    }

    #[test]
    fn escapes_braces_inside_code() {
        let input = "<code>{{greeting}}</code>";
        let expected = "<code>&#123;&#123;greeting&#125;&#125;</code>";
        assert_eq!(escape_braces_in_code_elements(input), expected);
    }

    #[test]
    fn preserves_bindings_outside_code() {
        let input = "<h1>{{a}}</h1><code>{{b}}</code><p>{{c}}</p>";
        let expected =
            "<h1>{{a}}</h1><code>&#123;&#123;b&#125;&#125;</code><p>{{c}}</p>";
        assert_eq!(escape_braces_in_code_elements(input), expected);
    }

    #[test]
    fn directive_tags_inside_code_are_not_neutralised() {
        // Author must escape `<` / `>` themselves for directive tags to render
        // as literal text. We only neutralise braces, mirroring webui-press.
        let input = "<code>&lt;f-when value=\"{{flag}}\"&gt;wrapped&lt;/f-when&gt;</code>";
        let expected =
            "<code>&lt;f-when value=\"&#123;&#123;flag&#125;&#125;\"&gt;wrapped&lt;/f-when&gt;</code>";
        assert_eq!(escape_braces_in_code_elements(input), expected);
    }

    #[test]
    fn handles_nested_code() {
        // Outer `<code>` content includes the inner `<code>` text — all
        // braces inside the outer scope are escaped in a single pass.
        let input = "<code>outer {{x}} <code>inner {{y}}</code> tail</code>";
        let expected = "<code>outer &#123;&#123;x&#125;&#125; <code>inner &#123;&#123;y&#125;&#125;</code> tail</code>";
        assert_eq!(escape_braces_in_code_elements(input), expected);
    }

    #[test]
    fn idempotent() {
        let input = "<code>{{x}}</code>";
        let once = escape_braces_in_code_elements(input);
        let twice = escape_braces_in_code_elements(&once);
        assert_eq!(once, twice);
    }

    #[test]
    fn code_with_attributes() {
        let input = "<code class=\"hl\" lang=\"html\">{{x}}</code>";
        let expected =
            "<code class=\"hl\" lang=\"html\">&#123;&#123;x&#125;&#125;</code>";
        assert_eq!(escape_braces_in_code_elements(input), expected);
    }

    #[test]
    fn self_closing_code_is_left_alone() {
        // `<code />` has no content to escape; the opening tag is emitted as-is.
        let input = "<code /><p>{{x}}</p>";
        let expected = "<code /><p>{{x}}</p>";
        assert_eq!(escape_braces_in_code_elements(input), expected);
    }

    #[test]
    fn does_not_match_codepoint_tag() {
        // A tag whose name *starts* with "code" but is something else must
        // not be mistaken for `<code>`.
        let input = "<codepoint>{{x}}</codepoint>";
        assert_eq!(escape_braces_in_code_elements(input), input);
    }

    #[test]
    fn escapes_braces_in_descendant_attribute_values() {
        // Braces anywhere inside the `<code>` subtree are neutralised,
        // including in attribute values of descendant elements.
        let input = "<code><span class=\"{{cls}}\">value</span></code>";
        let expected =
            "<code><span class=\"&#123;&#123;cls&#125;&#125;\">value</span></code>";
        assert_eq!(escape_braces_in_code_elements(input), expected);
    }
}
