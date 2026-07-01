use crate::error::{template_context, ConvertError};

#[derive(Debug, Clone)]
pub(crate) struct ParsedTemplate {
    pub(crate) _name: String,
    pub(crate) template: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct ParsedAttribute {
    pub(crate) name: String,
    pub(crate) value: Option<String>,
    pub(crate) raw: String,
}

pub(crate) fn parse_template_document(template: &str) -> Result<ParsedTemplate, ConvertError> {
    let f_templates = find_open_tags(template, "f-template");
    match f_templates.len() {
        0 => return Err(ConvertError::MissingFTemplate),
        1 => {}
        count => return Err(ConvertError::MultipleFTemplates { count }),
    }

    let f_template_start = f_templates[0];
    let f_template_end =
        find_tag_end(template, f_template_start).ok_or_else(|| ConvertError::UnclosedTag {
            context: template_context(template, f_template_start),
        })?;
    let f_template_tag = &template[f_template_start..f_template_end];
    let name =
        read_attribute_value(f_template_tag, "name").ok_or(ConvertError::MissingFTemplateName)?;
    let name = name.trim();
    if name.is_empty() {
        return Err(ConvertError::EmptyFTemplateName);
    }

    let (f_template_close, _) = find_matching_close(template, f_template_start, "f-template")
        .ok_or_else(|| ConvertError::UnclosedElement {
            tag: "f-template".to_string(),
            context: template_context(template, f_template_start),
        })?;
    let body = &template[f_template_end..f_template_close];

    let inner_templates = find_open_tags(body, "template");
    match inner_templates.len() {
        0 => return Err(ConvertError::MissingInnerTemplate),
        1 => {}
        count => return Err(ConvertError::MultipleInnerTemplates { count }),
    }

    let inner_start = inner_templates[0];
    let (_, inner_close_end) =
        find_matching_close(body, inner_start, "template").ok_or_else(|| {
            ConvertError::UnclosedElement {
                tag: "template".to_string(),
                context: template_context(body, inner_start),
            }
        })?;

    Ok(ParsedTemplate {
        _name: name.to_string(),
        template: body[inner_start..inner_close_end].to_string(),
    })
}

pub(crate) fn find_open_tags(template: &str, tag_name: &str) -> Vec<usize> {
    let mut tags = Vec::new();
    let mut pos = 0;

    while let Some(relative) = template[pos..].find('<') {
        let lt = pos + relative;
        if template[lt..].starts_with("<!--") {
            pos = find_comment_end(template, lt).unwrap_or(template.len());
            continue;
        }

        match read_tag_name(template, lt) {
            Some(name) => {
                if name == tag_name {
                    tags.push(lt);
                }
                pos = find_tag_end(template, lt).unwrap_or(lt + 1);
            }
            None => pos = lt + 1,
        }
    }

    tags
}

pub(crate) fn find_matching_close(
    template: &str,
    open_start: usize,
    tag_name: &str,
) -> Option<(usize, usize)> {
    let open_end = find_tag_end(template, open_start)?;
    if is_self_closing_tag(&template[open_start..open_end]) {
        return None;
    }

    let mut depth = 1usize;
    let mut pos = open_end;

    while let Some(relative) = template[pos..].find('<') {
        let lt = pos + relative;
        if template[lt..].starts_with("<!--") {
            pos = find_comment_end(template, lt).unwrap_or(template.len());
            continue;
        }

        if template[lt..].starts_with("</") {
            if let Some(name) = read_closing_tag_name(template, lt) {
                let close_end = find_tag_end(template, lt)?;
                if name == tag_name {
                    depth -= 1;
                    if depth == 0 {
                        return Some((lt, close_end));
                    }
                }
                pos = close_end;
            } else {
                pos = lt + 1;
            }
            continue;
        }

        if let Some(name) = read_tag_name(template, lt) {
            let tag_end = find_tag_end(template, lt)?;
            if name == tag_name && !is_self_closing_tag(&template[lt..tag_end]) {
                depth += 1;
            }
            pos = tag_end;
        } else {
            pos = lt + 1;
        }
    }

    None
}

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

pub(crate) fn read_tag_name(template: &str, lt_pos: usize) -> Option<String> {
    let bytes = template.as_bytes();
    let mut i = lt_pos;
    if bytes.get(i) != Some(&b'<') {
        return None;
    }
    i += 1;

    if matches!(bytes.get(i), Some(b'/') | Some(b'!') | Some(b'?')) {
        return None;
    }

    while i < bytes.len() && bytes[i].is_ascii_whitespace() {
        i += 1;
    }

    let start = i;
    while i < bytes.len() && !bytes[i].is_ascii_whitespace() && bytes[i] != b'>' && bytes[i] != b'/'
    {
        i += 1;
    }

    if i == start {
        None
    } else {
        Some(template[start..i].to_string())
    }
}

fn read_closing_tag_name(template: &str, lt_pos: usize) -> Option<String> {
    let bytes = template.as_bytes();
    let mut i = lt_pos;
    if bytes.get(i) != Some(&b'<') || bytes.get(i + 1) != Some(&b'/') {
        return None;
    }
    i += 2;

    while i < bytes.len() && bytes[i].is_ascii_whitespace() {
        i += 1;
    }

    let start = i;
    while i < bytes.len() && !bytes[i].is_ascii_whitespace() && bytes[i] != b'>' && bytes[i] != b'/'
    {
        i += 1;
    }

    if i == start {
        None
    } else {
        Some(template[start..i].to_string())
    }
}

pub(crate) fn is_self_closing_tag(open_tag: &str) -> bool {
    let trimmed = open_tag.trim_end();
    trimmed.ends_with("/>")
}

pub(crate) fn parse_attributes(open_tag: &str) -> Vec<ParsedAttribute> {
    let mut attrs = Vec::new();
    let bytes = open_tag.as_bytes();
    let mut i = 0;

    if bytes.get(i) == Some(&b'<') {
        i += 1;
    }

    while i < bytes.len() && !bytes[i].is_ascii_whitespace() && bytes[i] != b'>' && bytes[i] != b'/'
    {
        i += 1;
    }

    loop {
        while i < bytes.len() && bytes[i].is_ascii_whitespace() {
            i += 1;
        }

        if i >= bytes.len() || bytes[i] == b'>' || bytes[i] == b'/' {
            break;
        }

        let name_start = i;
        while i < bytes.len()
            && bytes[i] != b'='
            && !bytes[i].is_ascii_whitespace()
            && bytes[i] != b'>'
            && bytes[i] != b'/'
        {
            i += 1;
        }
        let name_end = i;
        let name = open_tag[name_start..name_end].to_string();
        if name.is_empty() {
            i += 1;
            continue;
        }

        while i < bytes.len() && bytes[i].is_ascii_whitespace() {
            i += 1;
        }

        if i >= bytes.len() || bytes[i] != b'=' {
            attrs.push(ParsedAttribute {
                name,
                value: None,
                raw: open_tag[name_start..name_end].to_string(),
            });
            continue;
        }

        i += 1;
        while i < bytes.len() && bytes[i].is_ascii_whitespace() {
            i += 1;
        }

        let (value, next) = parse_attribute_value(open_tag, bytes, i);
        i = next;

        attrs.push(ParsedAttribute {
            name,
            value: Some(value),
            raw: open_tag[name_start..i].to_string(),
        });
    }

    attrs
}

pub(crate) fn read_attribute_value(open_tag: &str, name: &str) -> Option<String> {
    parse_attributes(open_tag)
        .into_iter()
        .find(|attr| attr.name == name)
        .and_then(|attr| attr.value)
}

fn parse_attribute_value(open_tag: &str, bytes: &[u8], i: usize) -> (String, usize) {
    if matches!(bytes.get(i), Some(b'"') | Some(b'\'')) {
        let quote = bytes[i];
        let start = i + 1;
        let mut end = start;
        while end < bytes.len() && bytes[end] != quote {
            end += 1;
        }
        let value = open_tag[start..end].to_string();
        (value, if end < bytes.len() { end + 1 } else { end })
    } else {
        let start = i;
        let mut end = i;
        while end < bytes.len() && !bytes[end].is_ascii_whitespace() && bytes[end] != b'>' {
            end += 1;
        }
        (open_tag[start..end].to_string(), end)
    }
}

fn find_comment_end(template: &str, start: usize) -> Option<usize> {
    template[start..]
        .find("-->")
        .map(|relative| start + relative + 3)
}
