//! Auto-escape FAST template syntax inside `<code>` elements so that
//! code samples render as literal text without disabling real DOM
//! elements that happen to live inside the sample.
//!
//! FAST templates that include code samples often contain literal text
//! such as `{{greeting}}` or `<f-when value="…">…</f-when>` that the
//! template parser would otherwise interpret as data bindings or
//! directives. Mirroring the approach taken by Microsoft WebUI's
//! `webui-press` markdown renderer (`crates/webui-press/src/markdown.rs`),
//! this preprocessing pass walks the input HTML, finds every `<code>`
//! element, and rewrites its content as follows:
//!
//! - Every `{` becomes `&#123;` and every `}` becomes `&#125;`, in
//!   text *and* in attribute values of any descendant element. This
//!   neutralises both the text-binding (`{{x}}`, `{{{x}}}`) and the
//!   attribute-binding (`{x}`) delimiters everywhere inside the code
//!   sample.
//! - The `<` and `>` of every `<f-when>` / `</f-when>` /
//!   `<f-repeat>` / `</f-repeat>` tag (open, close, or self-closing)
//!   are rewritten as `&lt;` / `&gt;` so the FAST parser does not
//!   match the directive substring. Non-directive elements — real
//!   HTML elements (`<button>`, `<span>`) and custom elements
//!   (`<my-widget>`) — are left intact so they continue to render
//!   as real DOM elements inside the code sample.
//!
//! Existing `&`-prefixed entity references (`&amp;`, `&lt;`,
//! `&#123;`, …) are deliberately **not** re-encoded so previously
//! escaped content is preserved verbatim. The pass is a no-op for
//! input that does not contain a `<code` substring, and is
//! idempotent: a second pass over already-preprocessed HTML produces
//! the same output (no unescaped braces remain, and no raw directive
//! tags remain, inside any `<code>` element).
//!
//! ## Division of responsibility with the client-side parser
//!
//! The client-side `<f-template>` parser also applies a brace-only
//! escape (`escapeBracesInCodeElements` in `@microsoft/fast-html`).
//! That client pass is required because `&#123;` / `&#125;` entity
//! references are *decoded* into literal `{` / `}` characters by the
//! browser's HTML parser when the page is loaded, and the DOM
//! serializer used by `.innerHTML` does not re-encode them — so a
//! server-side brace escape alone would be undone by the time the
//! client parses the template. `<` and `>`, by contrast, *are*
//! re-encoded by the serializer (they're "must-escape" characters
//! for text-node content), so escaping them server-side is
//! sufficient — the client never sees a raw `<f-when>` tag inside
//! `<code>` regardless of what the author originally wrote. The
//! Rust crate is therefore solely responsible for directive-tag
//! neutralisation; the JS pass only re-applies the brace escape.

/// HTML void elements that have no content and therefore no matching
/// close tag. Included for completeness in `parse_opening_tag` so a
/// `<code />` style self-closing form is handled correctly even though
/// the parser also recognises the explicit XHTML-style self-close.
const VOID_ELEMENTS: &[&str] = &[
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
    "param", "source", "track", "wbr",
];

const CODE_ELEMENT: &str = "code";

/// FAST directive tag names whose `<` / `>` are rewritten when they
/// appear inside a `<code>` element. The set is deliberately narrow:
/// it must mirror the literal-substring patterns the `@microsoft/fast-html`
/// runtime parser scans for (`syntax.ts` → `repeatDirectiveOpen` /
/// `whenDirectiveOpen` etc.) so that no FAST directive can survive
/// inside a code sample, while leaving every non-directive element
/// (including user-authored custom elements) functional as part of
/// the rendered sample.
const DIRECTIVE_TAGS: &[&str] = &["f-when", "f-repeat"];

/// Apply `<code>` code-sample escape preprocessing to an HTML string.
/// Returns a new string with `{` / `}` characters replaced by their
/// HTML numeric character references (`&#123;` / `&#125;`) inside every
/// `<code>` element, and with the `<` / `>` of every FAST directive
/// tag (`<f-when>`, `</f-when>`, `<f-repeat>`, `</f-repeat>`) inside
/// `<code>` rewritten as `&lt;` / `&gt;`. Non-directive elements
/// inside `<code>` keep their angle brackets so they render as real
/// DOM elements. Content outside `<code>` is left untouched.
pub fn escape_code_sample_elements(html: &str) -> String {
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
        result.push_str(&escape_code_sample_inner(inner));
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

/// Two-pass escape for the inner content of a single `<code>` element.
/// Pass 1 neutralises every brace; pass 2 rewrites the `<` / `>` of
/// FAST directive tags only. The order does not matter for
/// correctness — `parse_opening_tag` ignores `{` / `}` characters and
/// the brace pass ignores `<` / `>` — but doing braces first keeps the
/// directive scanner free of binding-syntax noise inside attribute
/// values.
fn escape_code_sample_inner(s: &str) -> String {
    let with_braces = escape_braces_in_text(s);
    escape_directive_tag_angles(&with_braces)
}

/// Byte-scan: find the next `{` or `}`, bulk-copy the rest. Mirrors
/// the `emit_escaped` helper in `webui-press` (modulo `&`/`<`/`>`,
/// which we intentionally leave alone here so pre-existing entity
/// references are preserved verbatim and so non-directive markup
/// continues to render as real elements).
fn escape_braces_in_text(s: &str) -> String {
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

/// Walk the input and, for every FAST directive tag (open, close, or
/// self-closing) found, rewrite the entire tag with its `<` / `>`
/// characters replaced by `&lt;` / `&gt;`. Any raw `<` or `>` inside
/// the tag — for example the angle brackets of an operator in an
/// attribute value — are also rewritten so the browser doesn't
/// misparse the resulting text. Tags that are not FAST directives
/// are left untouched.
fn escape_directive_tag_angles(s: &str) -> String {
    let bytes = s.as_bytes();
    let mut out = String::with_capacity(s.len());
    let mut pos = 0;

    while pos < bytes.len() {
        let lt = match find_byte(bytes, pos, b'<') {
            Some(p) => p,
            None => {
                out.push_str(&s[pos..]);
                break;
            }
        };
        out.push_str(&s[pos..lt]);

        if let Some(tag_end) = match_directive_tag(s, lt) {
            out.push_str(&escape_html_angles(&s[lt..tag_end]));
            pos = tag_end;
        } else {
            out.push('<');
            pos = lt + 1;
        }
    }

    out
}

/// Replace every `<` with `&lt;` and every `>` with `&gt;` in the
/// input. Used to rewrite a complete directive tag (including any
/// stray angle brackets that appear inside attribute values).
fn escape_html_angles(s: &str) -> String {
    let bytes = s.as_bytes();
    let mut out = String::with_capacity(s.len());
    let mut start = 0;
    for (i, &b) in bytes.iter().enumerate() {
        let esc = match b {
            b'<' => "&lt;",
            b'>' => "&gt;",
            _ => continue,
        };
        out.push_str(&s[start..i]);
        out.push_str(esc);
        start = i + 1;
    }
    out.push_str(&s[start..]);
    out
}

/// If `s[pos..]` begins with a FAST directive tag (open, close, or
/// self-closing), returns `Some(tag_end)` where `tag_end` is the byte
/// index immediately past the tag's closing `>`. Otherwise returns
/// `None`. Tag name matching is ASCII-case-insensitive because
/// browsers normalise HTML tag names to lowercase during parsing —
/// an unescaped `<F-When>` would become a live `<f-when>` element
/// after the DOM round-trip and re-activate the directive.
fn match_directive_tag(s: &str, pos: usize) -> Option<usize> {
    let bytes = s.as_bytes();
    if bytes.get(pos).copied() != Some(b'<') {
        return None;
    }
    let is_close = bytes.get(pos + 1).copied() == Some(b'/');
    let name_start = if is_close { pos + 2 } else { pos + 1 };

    let directive = DIRECTIVE_TAGS
        .iter()
        .copied()
        .find(|d| slice_eq_ascii_ci(s, name_start, d))?;
    let after_name = name_start + directive.len();
    let next = bytes.get(after_name).copied().unwrap_or(0);

    if is_close {
        if !(next == b'>' || next.is_ascii_whitespace()) {
            return None;
        }
        let mut cursor = after_name;
        while cursor < bytes.len() {
            match bytes[cursor] {
                b'>' => return Some(cursor + 1),
                b if b.is_ascii_whitespace() => cursor += 1,
                _ => return None,
            }
        }
        None
    } else {
        if !(next == b'>' || next == b'/' || next.is_ascii_whitespace()) {
            return None;
        }
        parse_opening_tag(s, pos).map(|o| o.tag_end)
    }
}

/// ASCII case-insensitive equality between `s[start..start + needle.len()]`
/// and `needle`. `needle` must be ASCII-lowercase. Returns false if the
/// slice is too short.
fn slice_eq_ascii_ci(s: &str, start: usize, needle: &str) -> bool {
    let bytes = s.as_bytes();
    let n = needle.as_bytes();
    if start + n.len() > bytes.len() {
        return false;
    }
    for (i, &nb) in n.iter().enumerate() {
        if bytes[start + i].to_ascii_lowercase() != nb {
            return false;
        }
    }
    true
}

#[cfg(test)]
mod tests {
    use super::*;

    // ---------------------------------------------------------------------
    // Top-level passthrough / scope checks
    // ---------------------------------------------------------------------

    #[test]
    fn passthrough_when_no_code_element() {
        let input = "<div>{{foo}}</div>";
        assert_eq!(escape_code_sample_elements(input), input);
    }

    #[test]
    fn preserves_bindings_outside_code() {
        let input = "<h1>{{a}}</h1><code>{{b}}</code><p>{{c}}</p>";
        let expected =
            "<h1>{{a}}</h1><code>&#123;&#123;b&#125;&#125;</code><p>{{c}}</p>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn preserves_directives_outside_code() {
        // `<f-when>` outside any `<code>` element is left completely
        // alone so real directives continue to work.
        let input = "<f-when value=\"{{flag}}\">x</f-when>";
        assert_eq!(escape_code_sample_elements(input), input);
    }

    #[test]
    fn does_not_match_codepoint_tag() {
        // A tag whose name *starts* with "code" but is something else
        // must not be mistaken for `<code>` by the outer scanner.
        let input = "<codepoint>{{x}}</codepoint>";
        assert_eq!(escape_code_sample_elements(input), input);
    }

    // ---------------------------------------------------------------------
    // Brace escape inside `<code>`
    // ---------------------------------------------------------------------

    #[test]
    fn escapes_braces_inside_code() {
        let input = "<code>{{greeting}}</code>";
        let expected = "<code>&#123;&#123;greeting&#125;&#125;</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn escapes_single_brace_attribute_binding_text_inside_code() {
        // The single-brace `{...}` attribute-binding syntax must also
        // be neutralised so `button @click="{handler()}"` renders
        // literally when written as text inside `<code>`.
        let input = "<code>button @click=\"{handler()}\" /button</code>";
        let expected =
            "<code>button @click=\"&#123;handler()&#125;\" /button</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn code_with_attributes_on_the_code_element() {
        let input = "<code class=\"hl\" lang=\"html\">{{x}}</code>";
        let expected =
            "<code class=\"hl\" lang=\"html\">&#123;&#123;x&#125;&#125;</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn self_closing_code_is_left_alone() {
        // `<code />` has no content to escape; the opening tag is
        // emitted as-is and a following sibling element is not touched.
        let input = "<code /><p>{{x}}</p>";
        let expected = "<code /><p>{{x}}</p>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    // ---------------------------------------------------------------------
    // Directive-tag angle escape inside `<code>`
    // ---------------------------------------------------------------------

    #[test]
    fn escapes_literal_f_when_directive_inside_code() {
        // Authors can write a literal `<f-when>` inside `<code>`; both
        // the angle brackets and the brace-binding syntax in the
        // `value` attribute are neutralised.
        let input = "<code><f-when value=\"{{flag}}\">wrapped</f-when></code>";
        let expected = "<code>&lt;f-when value=\"&#123;&#123;flag&#125;&#125;\"&gt;wrapped&lt;/f-when&gt;</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn escapes_literal_f_repeat_directive_inside_code() {
        let input =
            "<code><f-repeat value=\"{{items}}\">i</f-repeat></code>";
        let expected = "<code>&lt;f-repeat value=\"&#123;&#123;items&#125;&#125;\"&gt;i&lt;/f-repeat&gt;</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn escapes_self_closing_directive_inside_code() {
        // The XHTML-style self-close form `<f-when … />` is also
        // matched by the directive scanner.
        let input = "<code><f-when value=\"{{flag}}\" /></code>";
        let expected =
            "<code>&lt;f-when value=\"&#123;&#123;flag&#125;&#125;\" /&gt;</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn escapes_uppercase_directive_tags_case_insensitively() {
        // Browsers normalise HTML tag names to lowercase, so an
        // unescaped `<F-When>` would become a live `<f-when>` element
        // after the DOM round-trip and re-activate the directive. The
        // server-side escape must therefore be case-insensitive.
        let input = "<code><F-When value=\"{{flag}}\">x</F-When></code>";
        let expected = "<code>&lt;F-When value=\"&#123;&#123;flag&#125;&#125;\"&gt;x&lt;/F-When&gt;</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn pre_escaped_directive_tags_inside_code_are_preserved() {
        // If the author has already entity-encoded the angle brackets
        // (carried over from older `&lt;f-when&gt;` authoring), the
        // pass is a no-op for the angles — we don't re-encode `&` —
        // and braces are still neutralised.
        let input = "<code>&lt;f-when value=\"{{flag}}\"&gt;wrapped&lt;/f-when&gt;</code>";
        let expected =
            "<code>&lt;f-when value=\"&#123;&#123;flag&#125;&#125;\"&gt;wrapped&lt;/f-when&gt;</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn does_not_match_directive_name_prefix() {
        // `<f-whenever>` must not be treated as `<f-when>` — only an
        // exact directive name followed by `>`, `/`, or whitespace
        // counts. The brace inside is still escaped because that
        // pass runs everywhere inside `<code>`.
        let input = "<code><f-whenever value=\"{{x}}\">y</f-whenever></code>";
        let expected =
            "<code><f-whenever value=\"&#123;&#123;x&#125;&#125;\">y</f-whenever></code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn escapes_directive_with_gt_inside_attribute_value() {
        // `>` inside a quoted attribute value must be skipped by the
        // tag-end scanner but *also* rewritten by the angle escape so
        // the browser doesn't see a stray `>` in the entity-decoded
        // text content of the surrounding `<code>` element.
        let input = "<code><f-when value=\"x > 5\">y</f-when></code>";
        let expected =
            "<code>&lt;f-when value=\"x &gt; 5\"&gt;y&lt;/f-when&gt;</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn escapes_directive_with_lt_inside_attribute_value() {
        // A raw `<` inside a quoted attribute value would otherwise be
        // re-parsed by the browser as the start of a new tag once the
        // outer entity is decoded; the angle escape rewrites it too.
        let input = "<code><f-when value=\"a < b\">y</f-when></code>";
        let expected =
            "<code>&lt;f-when value=\"a &lt; b\"&gt;y&lt;/f-when&gt;</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    // ---------------------------------------------------------------------
    // Real HTML elements / custom elements inside `<code>` survive
    // ---------------------------------------------------------------------

    #[test]
    fn preserves_real_html_elements_inside_code() {
        // A real `<button>` (or any non-directive HTML element) inside
        // `<code>` keeps its angle brackets so the browser renders it
        // as a live DOM element; only brace-binding text in its
        // attributes is neutralised.
        let input = "<code><button class=\"demo\">click</button></code>";
        let expected =
            "<code><button class=\"demo\">click</button></code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn preserves_custom_elements_inside_code() {
        // Custom elements (`<my-widget>`) likewise survive — their
        // angle brackets are not rewritten, but binding-like text in
        // their attribute values is neutralised so the parser doesn't
        // wire up a live binding to the rendered element.
        let input =
            "<code><my-widget data-x=\"{{value}}\">label</my-widget></code>";
        let expected =
            "<code><my-widget data-x=\"&#123;&#123;value&#125;&#125;\">label</my-widget></code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn handles_nested_code_with_real_inner_element() {
        // The outer `<code>` scope is determined by depth tracking on
        // the literal `<code>` / `</code>` tokens; the inner `<code>`
        // is *not* a FAST directive so its angle brackets are kept,
        // preserving the nested element. Braces in both scopes are
        // still neutralised.
        let input = "<code>outer {{x}} <code>inner {{y}}</code> tail</code>";
        let expected = "<code>outer &#123;&#123;x&#125;&#125; <code>inner &#123;&#123;y&#125;&#125;</code> tail</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn mixed_real_element_and_directive_inside_code() {
        // The `<button>` survives, the `<f-when>` is neutralised, and
        // all brace bindings in either subtree are escaped.
        let input = "<code><button>{{x}}</button>\
                     <f-when value=\"{{flag}}\">y</f-when></code>";
        let expected = "<code><button>&#123;&#123;x&#125;&#125;</button>\
                        &lt;f-when value=\"&#123;&#123;flag&#125;&#125;\"&gt;y&lt;/f-when&gt;</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    // ---------------------------------------------------------------------
    // Round-trip / robustness
    // ---------------------------------------------------------------------

    #[test]
    fn preserves_existing_entity_references() {
        // `&amp;` / `&lt;` etc. inside `<code>` must not be re-encoded
        // (that would produce double-escaped `&amp;amp;` and break
        // round-tripping for content the author already escaped).
        let input = "<code>R&amp;D : &lt;tag&gt; : &#123;raw&#125;</code>";
        let expected = "<code>R&amp;D : &lt;tag&gt; : &#123;raw&#125;</code>";
        assert_eq!(escape_code_sample_elements(input), expected);
    }

    #[test]
    fn idempotent_for_directive_and_brace_content() {
        // After one pass the directive tags carry entity-encoded
        // angles and the braces are entity-encoded; a second pass
        // finds nothing new to escape.
        let input =
            "<code><f-when value=\"{{x}}\">y</f-when></code>";
        let once = escape_code_sample_elements(input);
        let twice = escape_code_sample_elements(&once);
        assert_eq!(once, twice);
    }

    #[test]
    fn idempotent_for_real_elements_in_code() {
        // Real elements inside `<code>` round-trip unchanged on the
        // second pass — only the braces in their attributes are
        // escaped on the first pass, and nothing else changes.
        let input =
            "<code><button class=\"demo\">click {{x}}</button></code>";
        let once = escape_code_sample_elements(input);
        let twice = escape_code_sample_elements(&once);
        assert_eq!(once, twice);
    }
}
