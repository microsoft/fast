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

/// Find the first `{` that is NOT the start of `{{` or `{{{`.
/// These are FAST client-side bindings that the server renderer must pass through verbatim.
pub fn find_single_brace(template: &str, from: usize) -> Option<usize> {
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
pub fn skip_single_brace_expr(template: &str, pos: usize) -> usize {
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

/// Read the tag name from a `<` position. Returns None for closing tags (`</...>`).
pub fn read_tag_name(template: &str, lt_pos: usize) -> Option<String> {
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
pub fn is_custom_element(tag_name: &str) -> bool {
    tag_name.contains('-') && tag_name != "f-when" && tag_name != "f-repeat"
}

/// Find the position of the next opening tag of a custom element that has a template in `locator`.
/// Scans `template[from..]` for `<`, reads the next word, and checks both `is_custom_element`
/// and `locator.has_template`. Skips closing tags and non-custom elements.
pub fn find_custom_element(
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
pub fn count_tag_attribute_bindings(tag: &str) -> (usize, usize) {
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

// ── Dataset attribute helpers ────────────────────────────────────────────────

/// Convert a camelCase string to kebab-case.
/// "dateOfBirth" → "date-of-birth"
fn camel_to_kebab(s: &str) -> String {
    let mut result = String::with_capacity(s.len() + 4);
    for ch in s.chars() {
        if ch.is_uppercase() {
            result.push('-');
            result.push(ch.to_ascii_lowercase());
        } else {
            result.push(ch);
        }
    }
    result
}

/// Convert a `dataset.propertyName` attribute name to the corresponding
/// `data-property-name` HTML attribute name, following the MDN HTMLElement.dataset
/// naming convention. Returns `None` for names that do not start with `dataset.`.
///
/// Examples: "dataset.dateOfBirth" → "data-date-of-birth", "dataset.foo" → "data-foo"
pub fn dataset_name_to_data_attr(name: &str) -> Option<String> {
    name.strip_prefix("dataset.")
        .map(|camel| format!("data-{}", camel_to_kebab(camel)))
}

/// In an HTML opening tag string, convert any `dataset.propertyName` (or
/// `?dataset.propertyName` boolean-binding) attribute names to the corresponding
/// `data-property-name` (or `?data-property-name`) HTML attribute names.
/// All other content — attribute values, other attributes — is copied verbatim.
///
/// This is a no-op (returns an owned copy without scanning) when the tag does not
/// contain the substring `dataset.`.
pub fn normalize_dataset_attribute_names(tag: &str) -> String {
    if !tag.contains("dataset.") {
        return tag.to_string();
    }

    let bytes = tag.as_bytes();
    let mut result = String::with_capacity(tag.len() + 16);
    let mut i = 0;

    // Copy `<tagname` verbatim.
    if i < bytes.len() && bytes[i] == b'<' {
        i += 1;
    }
    while i < bytes.len()
        && !bytes[i].is_ascii_whitespace()
        && bytes[i] != b'>'
        && bytes[i] != b'/'
    {
        i += 1;
    }
    result.push_str(&tag[..i]);

    // Process attributes one by one.
    while i < bytes.len() {
        // Whitespace between attributes.
        if bytes[i].is_ascii_whitespace() {
            let ws_start = i;
            while i < bytes.len() && bytes[i].is_ascii_whitespace() {
                i += 1;
            }
            result.push_str(&tag[ws_start..i]);
            continue;
        }

        // End of tag (`>` or `/>` or trailing `/`).
        if bytes[i] == b'>' || bytes[i] == b'/' {
            result.push_str(&tag[i..]);
            break;
        }

        // Read attribute name (may begin with `?` for boolean bindings).
        let name_start = i;
        while i < bytes.len()
            && bytes[i] != b'='
            && !bytes[i].is_ascii_whitespace()
            && bytes[i] != b'>'
            && bytes[i] != b'/'
        {
            i += 1;
        }
        let attr_name = &tag[name_start..i];

        // Convert dataset attribute names; handle the `?dataset.X` boolean-binding form too.
        if let Some(data_name) = dataset_name_to_data_attr(attr_name) {
            result.push_str(&data_name);
        } else if let Some(inner) = attr_name.strip_prefix('?') {
            if let Some(data_name) = dataset_name_to_data_attr(inner) {
                result.push('?');
                result.push_str(&data_name);
            } else {
                result.push_str(attr_name);
            }
        } else {
            result.push_str(attr_name);
        }

        // Copy the value part verbatim (handles `=`, quoted, and unquoted values).
        if i < bytes.len() && bytes[i] == b'=' {
            result.push('=');
            i += 1;
            let ws_start = i;
            while i < bytes.len() && bytes[i].is_ascii_whitespace() {
                i += 1;
            }
            result.push_str(&tag[ws_start..i]);
            if i < bytes.len() && (bytes[i] == b'"' || bytes[i] == b'\'') {
                let quote = bytes[i];
                let val_start = i;
                i += 1;
                while i < bytes.len() && bytes[i] != quote {
                    i += 1;
                }
                if i < bytes.len() {
                    i += 1; // closing quote
                }
                result.push_str(&tag[val_start..i]);
            } else {
                let val_start = i;
                while i < bytes.len()
                    && !bytes[i].is_ascii_whitespace()
                    && bytes[i] != b'>'
                    && bytes[i] != b'/'
                {
                    i += 1;
                }
                result.push_str(&tag[val_start..i]);
            }
        }
    }

    result
}

/// Resolve `{{expr}}` in attribute values of an opening tag, leaving `{expr}`
/// single-brace values and all other content unchanged.
/// Handles `?attr="{{expr}}"` boolean bindings: evaluates `expr` as a boolean and
/// either renders the bare attribute name (if true) or omits the attribute (if false).
/// Also converts any `dataset.propertyName` attribute names to `data-property-name`.
pub fn resolve_attribute_bindings_in_tag(
    tag: &str,
    root: &crate::json::JsonValue,
    loop_vars: &[(String, crate::json::JsonValue)],
) -> String {
    use crate::content::html_escape;
    use crate::context::resolve_value;
    use crate::expression::evaluate;
    let normalized = normalize_dataset_attribute_names(tag);
    let tag = normalized.as_str();
    let mut result = String::with_capacity(tag.len());
    let mut pos = 0;
    loop {
        let dbl = match find_str(tag, "{{", pos) {
            None => {
                result.push_str(&tag[pos..]);
                break;
            }
            Some(idx) => idx,
        };
        let inner_start = dbl + 2;
        let end = match find_str(tag, "}}", inner_start) {
            None => {
                result.push_str(&tag[dbl..]);
                break;
            }
            Some(idx) => idx,
        };
        let expr = tag[inner_start..end].trim();

        // Append literal text up to {{
        result.push_str(&tag[pos..dbl]);

        // Check whether this {{expr}} is the value of a `?attr` boolean binding.
        // Pattern: `result` ends with `?name="` after appending the prefix text.
        if let Some(bool_name) = extract_bool_attr_prefix(&result) {
            // Remove `?name="` from result (len = '?' + name + '="' = name.len() + 3)
            let trim_to = result.len() - (bool_name.len() + 3);
            result.truncate(trim_to);
            // Render the bare attribute name when the expression is truthy, nothing when falsy.
            if evaluate(expr, root, loop_vars) {
                result.push_str(&bool_name);
            }
            // Skip past `}}"` (closing `}}` + closing `"`)
            pos = end + 3;
        } else {
            let val = resolve_value(expr, root, loop_vars)
                .map(|v| html_escape(&v.to_display_string()))
                .unwrap_or_default();
            result.push_str(&val);
            pos = end + 2;
        }
    }
    result
}

/// If `result` ends with `?name="` (a FAST boolean attribute prefix), return `name`.
/// Returns `None` for any other suffix.
fn extract_bool_attr_prefix(result: &str) -> Option<String> {
    if !result.ends_with("=\"") {
        return None;
    }
    let before_eq = &result[..result.len() - 2];
    let name_start = before_eq
        .rfind(|c: char| c.is_ascii_whitespace())
        .map(|i| i + 1)
        .unwrap_or(0);
    let attr_part = &before_eq[name_start..];
    if attr_part.starts_with('?') && attr_part.len() > 1 {
        Some(attr_part[1..].to_string())
    } else {
        None
    }
}

/// Insert `data-fe-c-{start}-{count}` as an attribute just before the closing `>` or `/>`.
pub fn inject_compact_marker(tag: &str, start_idx: usize, count: usize) -> String {
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
pub fn find_next_plain_html_tag(
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
pub fn parse_element_attributes(open_tag: &str) -> Vec<(String, Option<String>)> {
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
