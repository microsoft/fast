/// Find the first occurrence of `pat` in `s[from..]`, returning the absolute index.
pub(crate) fn find_str(s: &str, pat: &str, from: usize) -> Option<usize> {
    s[from..].find(pat).map(|i| i + from)
}

/// Find a directive tag (e.g. `<f-when`, `<f-repeat`), ensuring the character
/// immediately after the tag name is whitespace or `>` to avoid false matches.
pub(crate) fn find_directive(template: &str, tag: &str, from: usize) -> Option<usize> {
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
pub(crate) fn find_tag_end(template: &str, from: usize) -> Option<usize> {
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

/// Find the first `{` that is NOT the start of `{{` or `{{{`.
/// These are FAST client-side bindings that the server renderer must pass through verbatim.
pub(crate) fn find_single_brace(template: &str, from: usize) -> Option<usize> {
    let bytes = template.as_bytes();
    let mut i = from;
    while i < bytes.len() {
        if bytes[i] == b'{' && (i + 1 >= bytes.len() || bytes[i + 1] != b'{') {
            return Some(i);
        }
        i += 1;
    }
    None
}

/// Return the position after the closing `}` of the single-brace expression starting at `pos`.
/// Handles nesting (`{outer {inner}}`) and quoted strings so inner `}` characters are not
/// mistaken for the closing brace.
pub(crate) fn skip_single_brace_expr(template: &str, pos: usize) -> usize {
    let bytes = template.as_bytes();
    let mut depth = 0usize;
    let mut i = pos;
    let mut in_quote = false;
    let mut quote_char = b'"';
    while i < bytes.len() {
        match bytes[i] {
            c if in_quote && c == quote_char => in_quote = false,
            b'"' | b'\'' if !in_quote => {
                in_quote = true;
                quote_char = bytes[i];
            }
            b'{' if !in_quote => depth += 1,
            b'}' if !in_quote => {
                depth -= 1;
                if depth == 0 {
                    return i + 1;
                }
            }
            _ => {}
        }
        i += 1;
    }
    pos + 1 // Unclosed brace — advance past just the `{`
}

/// Extract the expression from `value="{{...}}"` inside a directive opening tag.
pub(crate) fn extract_directive_expr(template: &str, tag_start: usize) -> Option<String> {
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
pub(crate) fn extract_directive_content(
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

/// Read the tag name from a `<` position. Returns None for closing tags (`</...>`).
pub(crate) fn read_tag_name(template: &str, lt_pos: usize) -> Option<String> {
    let bytes = template.as_bytes();
    let mut i = lt_pos;

    if i >= bytes.len() || bytes[i] != b'<' {
        return None;
    }
    i += 1;

    // Closing tags start with `/` — skip them.
    if i < bytes.len() && bytes[i] == b'/' {
        return None;
    }

    // Skip any leading whitespace (unusual but defensive).
    while i < bytes.len() && bytes[i].is_ascii_whitespace() {
        i += 1;
    }

    let name_start = i;
    while i < bytes.len()
        && !bytes[i].is_ascii_whitespace()
        && bytes[i] != b'>'
        && bytes[i] != b'/'
    {
        i += 1;
    }

    if i == name_start {
        return None;
    }
    Some(template[name_start..i].to_string())
}

/// Return true if `tag_name` is a custom element (contains a hyphen and is not a FAST directive).
pub(crate) fn is_custom_element(tag_name: &str) -> bool {
    tag_name.contains('-') && tag_name != "f-when" && tag_name != "f-repeat"
}

/// Find the position of the next opening tag of a custom element that has a template in `locator`.
/// Scans `template[from..]` for `<`, reads the next word, and checks both `is_custom_element`
/// and `locator.has_template`. Skips closing tags and non-custom elements.
pub(crate) fn find_custom_element(
    template: &str,
    from: usize,
    locator: &crate::locator::Locator,
) -> Option<usize> {
    let mut i = from;
    while i < template.len() {
        match template[i..].find('<') {
            None => break,
            Some(rel) => {
                let lt_pos = i + rel;
                if let Some(name) = read_tag_name(template, lt_pos) {
                    if is_custom_element(&name) && locator.has_template(&name) {
                        return Some(lt_pos);
                    }
                }
                i = lt_pos + 1;
            }
        }
    }
    None
}

// ── Hydration helpers ────────────────────────────────────────────────────────

/// Count attribute bindings in an opening tag:
/// - `attr="{{expr}}"` → double-brace binding
/// - `attr="{expr}"` (single brace, not `{{`) → single-brace client binding
/// Returns `(double_brace_count, single_brace_count)`.
pub(crate) fn count_tag_attribute_bindings(tag: &str) -> (usize, usize) {
    let attrs = parse_element_attributes(tag);
    let mut db = 0usize;
    let mut sb = 0usize;
    for (_name, value) in attrs {
        if let Some(v) = value {
            if v.contains("{{") {
                db += 1;
            } else if v.starts_with('{') && v.ends_with('}') {
                sb += 1;
            }
        }
    }
    (db, sb)
}

// ── Data attribute helpers ────────────────────────────────────────────────────

/// Convert a kebab-case string to camelCase.
/// "date-of-birth" → "dateOfBirth", "name" → "name"
pub(crate) fn kebab_to_camel(s: &str) -> String {
    let mut result = String::with_capacity(s.len());
    let mut next_upper = false;
    for ch in s.chars() {
        if ch == '-' {
            next_upper = true;
        } else if next_upper {
            result.push(ch.to_ascii_uppercase());
            next_upper = false;
        } else {
            result.push(ch);
        }
    }
    result
}

/// Convert a `data-kebab-case` HTML attribute name to its full dot-notation
/// dataset path, following the MDN HTMLElement.dataset naming convention.
/// Returns `None` for names that do not start with `data-`.
///
/// Examples: `"data-date-of-birth"` → `"dataset.dateOfBirth"`, `"data-name"` → `"dataset.name"`
pub(crate) fn data_attr_to_dataset_key(name: &str) -> Option<String> {
    name.strip_prefix("data-").map(|rest| format!("dataset.{}", kebab_to_camel(rest)))
}

/// Resolve `{{expr}}` in attribute values of an opening tag, leaving `{expr}`
/// single-brace values and all other content unchanged.
/// Handles `?attr="{{expr}}"` boolean bindings: evaluates `expr` as a boolean and
/// either renders the bare attribute name (if true) or omits the attribute (if false).
/// If a normal attribute binding cannot be resolved, the whole attribute is omitted.
pub(crate) fn resolve_attribute_bindings_in_tag(
    tag: &str,
    root: &crate::json::JsonValue,
    loop_vars: &[(String, crate::json::JsonValue)],
) -> String {
    use crate::expression::evaluate;

    let trimmed = tag.trim_end();
    let is_self_closing = trimmed.ends_with("/>");
    let has_closing_gt = is_self_closing || trimmed.ends_with('>');
    let tag_name = match read_tag_name(tag, 0) {
        Some(name) => name,
        None => return tag.to_string(),
    };

    let mut result = String::with_capacity(tag.len());
    result.push('<');
    result.push_str(&tag_name);

    for (name, value) in parse_element_attributes(tag) {
        if name.starts_with('?') {
            if let Some(v) = value {
                let trimmed = v.trim();
                if trimmed.starts_with("{{") && trimmed.ends_with("}}") && trimmed.len() > 4 {
                    let expr = trimmed[2..trimmed.len() - 2].trim();
                    if evaluate(expr, root, loop_vars) {
                        result.push(' ');
                        result.push_str(&name[1..]);
                    }
                }
            }
            continue;
        }

        match value {
            None => {
                result.push(' ');
                result.push_str(&name);
            }
            Some(v) if v.contains("{{") => {
                if let Some(resolved) = resolve_attribute_value(&v, root, loop_vars) {
                    result.push_str(&format!(" {}=\"{}\"", name, resolved));
                }
            }
            Some(v) => {
                result.push_str(&format!(" {}=\"{}\"", name, v));
            }
        }
    }

    if is_self_closing {
        result.push_str(" />");
    } else if has_closing_gt {
        result.push('>');
    }

    result
}

fn resolve_attribute_value(
    value: &str,
    root: &crate::json::JsonValue,
    loop_vars: &[(String, crate::json::JsonValue)],
) -> Option<String> {
    use crate::content::html_escape;
    use crate::context::resolve_value;

    let mut result = String::with_capacity(value.len());
    let mut pos = 0;
    loop {
        let dbl = match find_str(value, "{{", pos) {
            None => {
                result.push_str(&value[pos..]);
                return Some(result);
            }
            Some(idx) => idx,
        };
        let inner_start = dbl + 2;
        let end = match find_str(value, "}}", inner_start) {
            None => {
                result.push_str(&value[pos..]);
                return Some(result);
            }
            Some(idx) => idx,
        };
        let expr = value[inner_start..end].trim();
        let resolved = resolve_value(expr, root, loop_vars)?;
        result.push_str(&value[pos..dbl]);
        result.push_str(&html_escape(&resolved.to_display_string()));
        pos = end + 2;
    }
}

/// Remove all FAST client-only binding attributes from an opening tag string:
/// - `@attr="{...}"` event bindings
/// - `:attr="..."` property bindings
/// - `f-ref="{...}"`, `f-slotted="{...}"`, `f-children="{...}"` attribute directives
///
/// These are resolved or reconnected entirely by the FAST client runtime and
/// have no meaning in static HTML. The `data-fe-c` hydration binding count is
/// unaffected — callers use `count_tag_attribute_bindings` on the *original*
/// tag string so the FAST runtime still allocates the correct number of binding slots.
pub(crate) fn strip_client_only_attrs(tag: &str) -> String {
    let trimmed = tag.trim_end();
    let is_self_closing = trimmed.ends_with("/>");
    let has_closing_gt = is_self_closing || trimmed.ends_with('>');

    let tag_name = match read_tag_name(tag, 0) {
        Some(name) => name,
        None => return tag.to_string(),
    };

    let mut out = format!("<{}", tag_name);
    for (name, value) in parse_element_attributes(tag) {
        if name.starts_with('@') || name.starts_with(':')
            || name.eq_ignore_ascii_case("f-ref")
            || name.eq_ignore_ascii_case("f-slotted")
            || name.eq_ignore_ascii_case("f-children")
        {
            continue;
        }
        match value {
            None => { out.push(' '); out.push_str(&name); }
            Some(v) => out.push_str(&format!(" {}=\"{}\"", name, v)),
        }
    }

    if is_self_closing {
        out.push_str(" />");
    } else if has_closing_gt {
        out.push('>');
    }
    out
}

/// Insert `data-fe-c-{start}-{count}` as an attribute just before the closing `>` or `/>`.
pub(crate) fn inject_compact_marker(tag: &str, start_idx: usize, count: usize) -> String {
    let marker = format!(" data-fe-c-{}-{}", start_idx, count);
    let trimmed = tag.trim_end();
    if trimmed.ends_with("/>") {
        let base = trimmed[..trimmed.len() - 2].trim_end();
        format!("{}{} />", base, marker)
    } else if trimmed.ends_with('>') {
        format!("{}{}>", &trimmed[..trimmed.len() - 1], marker)
    } else {
        format!("{}{}", tag, marker)
    }
}

/// Find the next opening HTML tag in `template[from..]`, skipping:
/// - Closing tags (`</`)
/// - Comments / declarations (`<!`)
/// - FAST directive tags (`<f-...`)
/// - Known custom elements with templates in `locator`
pub(crate) fn find_next_plain_html_tag(
    template: &str,
    from: usize,
    locator: Option<&crate::locator::Locator>,
) -> Option<usize> {
    let mut i = from;
    while i < template.len() {
        let rel = template[i..].find('<')?;
        let lt_pos = i + rel;
        let after = lt_pos + 1;
        if after >= template.len() {
            return None;
        }
        let next_byte = template.as_bytes()[after];
        if next_byte == b'/' || next_byte == b'!' {
            i = lt_pos + 1;
            continue;
        }
        if let Some(name) = read_tag_name(template, lt_pos) {
            if !is_skippable_tag(&name, locator) {
                return Some(lt_pos);
            }
        }
        i = lt_pos + 1;
    }
    None
}

fn is_skippable_tag(name: &str, locator: Option<&crate::locator::Locator>) -> bool {
    if name.starts_with("f-") {
        return true;
    }
    locator.map_or(false, |loc| is_custom_element(name) && loc.has_template(name))
}

/// Parse all attributes from an opening tag string (e.g. `<my-button label="Hi" disabled>`).
/// Returns `(attribute_name, Option<value>)` — `None` value means boolean attribute.
/// Handles double-quoted, single-quoted, and unquoted values.
pub(crate) fn parse_element_attributes(open_tag: &str) -> Vec<(String, Option<String>)> {
    let mut attrs = Vec::new();
    let bytes = open_tag.as_bytes();
    let mut i = 0;

    // Skip `<`
    if i < bytes.len() && bytes[i] == b'<' {
        i += 1;
    }

    // Skip tag name (first word).
    while i < bytes.len() && !bytes[i].is_ascii_whitespace() && bytes[i] != b'>' && bytes[i] != b'/' {
        i += 1;
    }

    loop {
        // Skip whitespace.
        while i < bytes.len() && bytes[i].is_ascii_whitespace() {
            i += 1;
        }

        if i >= bytes.len() || bytes[i] == b'>' || bytes[i] == b'/' {
            break;
        }

        // Read attribute name.
        let name_start = i;
        while i < bytes.len()
            && bytes[i] != b'='
            && !bytes[i].is_ascii_whitespace()
            && bytes[i] != b'>'
            && bytes[i] != b'/'
        {
            i += 1;
        }
        let name = open_tag[name_start..i].to_string();

        if name.is_empty() {
            // Safety: advance to prevent an infinite loop on unexpected chars.
            i += 1;
            continue;
        }

        // Skip whitespace before potential `=`.
        while i < bytes.len() && bytes[i].is_ascii_whitespace() {
            i += 1;
        }

        if i >= bytes.len() || bytes[i] != b'=' {
            // Boolean attribute — no value.
            attrs.push((name, None));
            continue;
        }

        // Skip `=`.
        i += 1;

        // Skip whitespace after `=`.
        while i < bytes.len() && bytes[i].is_ascii_whitespace() {
            i += 1;
        }

        // Read value using helper.
        let (value, new_i) = parse_attribute_value(open_tag, bytes, i);
        i = new_i;

        attrs.push((name, Some(value)));
    }

    attrs
}

fn parse_attribute_value(open_tag: &str, bytes: &[u8], i: usize) -> (String, usize) {
    if i < bytes.len() && (bytes[i] == b'"' || bytes[i] == b'\'') {
        let quote = bytes[i];
        let start = i + 1;
        let mut end = start;
        while end < bytes.len() && bytes[end] != quote {
            end += 1;
        }
        let val = open_tag[start..end].to_string();
        (val, if end < bytes.len() { end + 1 } else { end })
    } else {
        let start = i;
        let mut end = i;
        while end < bytes.len() && !bytes[end].is_ascii_whitespace() && bytes[end] != b'>' && bytes[end] != b'/' {
            end += 1;
        }
        (open_tag[start..end].to_string(), end)
    }
}
