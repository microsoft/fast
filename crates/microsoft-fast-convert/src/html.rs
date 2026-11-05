use crate::error::{template_context, ConvertError};

#[derive(Debug, Clone)]
pub(crate) struct ParsedTemplate {
    pub(crate) _name: String,
    pub(crate) template: String,
    pub(crate) original_template: String,
    pub(crate) host_start: Option<usize>,
    pub(crate) template_start: usize,
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
        count => return Err(ConvertError::MultipleFTemplates { count }.at(template, f_templates[1])),
    }

    let f_template_start = f_templates[0];
    let f_template_end =
        find_tag_end(template, f_template_start).ok_or_else(|| ConvertError::UnclosedTag {
            context: template_context(template, f_template_start),
        })?;
    let f_template_tag = &template[f_template_start..f_template_end];
    let name =
        read_attribute_value(f_template_tag, "name")
            .ok_or_else(|| ConvertError::MissingFTemplateName.at(template, f_template_start))?;
    let name = name.trim();
    if name.is_empty() {
        return Err(ConvertError::EmptyFTemplateName.at(template, f_template_start));
    }

    let (f_template_close, _) = find_matching_close(template, f_template_start, "f-template")
        .ok_or_else(|| ConvertError::UnclosedElement {
            tag: "f-template".to_string(),
            context: template_context(template, f_template_start),
        }.in_template(name))?;
    let body = &template[f_template_end..f_template_close];

    let direct = direct_children(body)
        .map_err(|error| error.rebase(template, f_template_end).in_template(name))?;
    let inner_templates: Vec<_> = direct
        .iter()
        .filter(|(tag, _)| tag == "template")
        .map(|(_, at)| *at)
        .collect();
    let hosts: Vec<_> = direct
        .iter()
        .filter(|(tag, _)| tag == "f-host")
        .map(|(_, at)| *at)
        .collect();
    let shadows: Vec<_> = direct
        .iter()
        .filter(|(tag, _)| tag == "f-shadow")
        .map(|(_, at)| *at)
        .collect();
    if hosts.len() > 1 {
        return Err(ConvertError::MultipleHosts { count: hosts.len() }
            .at(template, f_template_end + hosts[1])
            .in_template(name));
    }
    if shadows.len() > 1 {
        return Err(ConvertError::MultipleShadows { count: shadows.len() }
            .at(template, f_template_end + shadows[1])
            .in_template(name));
    }
    match inner_templates.len() {
        0 => return Err(ConvertError::MissingInnerTemplate.at(template, f_template_start).in_template(name)),
        1 => {}
        count => return Err(ConvertError::MultipleInnerTemplates { count }
            .at(template, f_template_end + inner_templates[1]).in_template(name)),
    }

    let inner_start = inner_templates[0];
    let (_, inner_close_end) =
        find_matching_close(body, inner_start, "template").ok_or_else(|| {
            ConvertError::UnclosedElement {
                tag: "template".to_string(),
                context: template_context(body, inner_start),
            }
            .rebase(template, f_template_end)
            .in_template(name)
        })?;

    let original_template = body[inner_start..inner_close_end].to_string();
    let inner_open_end = find_tag_end(&original_template, 0).expect("matched template opening tag");
    let mut attrs: Vec<_> = parse_attributes(&original_template[..inner_open_end])
        .into_iter()
        .filter(|attr| attr.name.to_ascii_lowercase().starts_with("shadowroot"))
        .collect();
    if let Some(shadow) = shadows.first() {
        let shadow_end = find_tag_end(body, *shadow).expect("validated shadow opening tag");
        attrs = shadow_declaration_attributes(&body[*shadow..shadow_end])
            .map_err(|error| error.at(template, f_template_end + shadow).in_template(name))?;
    } else {
        // TODO(#7800): Remove outer/inner template shadowroot forwarding in vNext.
        let has_inner_mode = attrs.iter().any(|attr| {
            attr.name.eq_ignore_ascii_case("shadowrootmode")
                || attr.name.eq_ignore_ascii_case("shadowroot")
        });
        for attr in parse_attributes(f_template_tag) {
            if attr.name.to_ascii_lowercase().starts_with("shadowroot")
                && !attrs.iter().any(|existing| existing.name.eq_ignore_ascii_case(&attr.name))
                && !(has_inner_mode
                    && (attr.name.eq_ignore_ascii_case("shadowrootmode")
                        || attr.name.eq_ignore_ascii_case("shadowroot")))
            {
                attrs.push(attr);
            }
        }
    }
    if let Some(host) = hosts.first() {
        let host_end = find_tag_end(body, *host).expect("validated host opening tag");
        attrs.extend(parse_attributes(&body[*host..host_end]));
    }
    let mut normalized = String::from("<template");
    for attr in attrs {
        normalized.push(' ');
        normalized.push_str(&attr.raw);
    }
    normalized.push('>');
    normalized.push_str(&original_template[inner_open_end..]);

    Ok(ParsedTemplate {
        _name: name.to_string(),
        template: normalized,
        original_template,
        host_start: hosts.first().map(|at| f_template_end + at),
        template_start: f_template_end + inner_start,
    })
}

fn shadow_declaration_attributes(tag: &str) -> Result<Vec<ParsedAttribute>, ConvertError> {
    let mut mode = "open".to_string();
    let mut flags = Vec::new();
    let mut seen = Vec::new();
    for attr in parse_attributes(tag) {
        let name = attr.name.to_ascii_lowercase();
        if seen.contains(&name) {
            continue;
        }
        seen.push(name.clone());
        let invalid = |reason: &str| ConvertError::InvalidShadowDeclaration {
            reason: reason.to_string(),
        };
        if attr
            .value
            .as_deref()
            .is_some_and(|value| value.contains(['{', '}']))
        {
            return Err(invalid("configuration must be static"));
        }
        match name.as_str() {
            "mode" => {
                let value = attr.value.as_deref().unwrap_or("");
                if !matches!(value, "open" | "closed") {
                    return Err(invalid("mode must be 'open' or 'closed'"));
                }
                mode = value.to_string();
            }
            "delegatesfocus" | "clonable" | "serializable" => {
                let name = format!("shadowroot{name}");
                flags.push(ParsedAttribute {
                    raw: name.clone(),
                    name,
                    value: None,
                });
            }
            _ => return Err(invalid(&format!("unsupported attribute '{name}'"))),
        }
    }
    let mut attrs = vec![ParsedAttribute {
        name: "shadowrootmode".to_string(),
        raw: format!("shadowrootmode=\"{mode}\""),
        value: Some(mode),
    }];
    attrs.extend(flags);
    Ok(attrs)
}

fn is_metadata_declaration(name: &str) -> bool {
    matches!(name, "f-host" | "f-shadow")
}

fn direct_children(template: &str) -> Result<Vec<(String, usize)>, ConvertError> {
    let mut children = Vec::new();
    let mut pos = 0;
    while let Some(relative) = template[pos..].find('<') {
        let at = pos + relative;
        if template[at..].starts_with("<!--") {
            pos = find_comment_end(template, at).unwrap_or(template.len());
            continue;
        }
        if read_closing_tag_name(template, at)
            .is_some_and(|name| is_metadata_declaration(&name.to_ascii_lowercase()))
        {
            let name = read_closing_tag_name(template, at)
                .unwrap()
                .to_ascii_lowercase();
            return Err(invalid_metadata_declaration(&name).at(template, at));
        }
        let Some(name) = read_tag_name(template, at) else {
            pos = at + 1;
            continue;
        };
        let name = name.to_ascii_lowercase();
        let end = find_tag_end(template, at).ok_or_else(|| ConvertError::UnclosedTag {
            context: template_context(template, at),
        })?;
        if is_metadata_declaration(&name)
            && parse_attributes(&template[at..end])
                .iter()
                .any(|attr| attr.name.contains(['<', '>', '"', '\'', '=']))
        {
            return Err(invalid_metadata_declaration(&name).at(template, at));
        }
        children.push((name.clone(), at));
        if matches!(
            name.as_str(),
            "area"
                | "base"
                | "br"
                | "col"
                | "embed"
                | "hr"
                | "img"
                | "input"
                | "link"
                | "meta"
                | "param"
                | "source"
                | "track"
                | "wbr"
        ) {
            pos = end;
        } else {
            pos = find_matching_close(template, at, &name)
                .ok_or_else(|| ConvertError::UnclosedElement {
                    tag: name,
                    context: template_context(template, at),
                })?
                .1;
        }
    }
    Ok(children)
}

fn invalid_metadata_declaration(name: &str) -> ConvertError {
    if name == "f-shadow" {
        ConvertError::InvalidShadowDeclaration {
            reason: "malformed HTML tag".to_string(),
        }
    } else {
        ConvertError::InvalidHostDeclaration
    }
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
        if let Some(end) = style_element_end(template, lt) {
            pos = end;
            continue;
        }

        match read_tag_name(template, lt) {
            Some(name) => {
                if name.eq_ignore_ascii_case(tag_name) {
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
        if let Some(end) = style_element_end(template, lt) {
            pos = end;
            continue;
        }
        if template[lt..].starts_with("<!--") {
            pos = find_comment_end(template, lt).unwrap_or(template.len());
            continue;
        }

        if template[lt..].starts_with("</") {
            if let Some(name) = read_closing_tag_name(template, lt) {
                let close_end = find_tag_end(template, lt)?;
                if name.eq_ignore_ascii_case(tag_name) {
                    if is_metadata_declaration(&name.to_ascii_lowercase())
                        && template[lt + 2 + name.len()..close_end].trim() != ">"
                    {
                        return None;
                    }
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
            if name.eq_ignore_ascii_case(tag_name) && !is_self_closing_tag(&template[lt..tag_end]) {
                depth += 1;
            }
            pos = tag_end;
        } else {
            pos = lt + 1;
        }
    }

    None
}

/// Preserve CSS raw text, including template-like strings and tag-like content.
pub(crate) fn style_element_end(template: &str, at: usize) -> Option<usize> {
    if !read_tag_name(template, at)?.eq_ignore_ascii_case("style") {
        return None;
    }
    let mut pos = find_tag_end(template, at)?;
    while let Some(relative) = template[pos..].find("</") {
        let close = pos + relative;
        let name = close + 2;
        if template.as_bytes().get(name..name + 5)
            .is_some_and(|value| value.eq_ignore_ascii_case(b"style"))
            && template.as_bytes().get(name + 5)
                .is_none_or(|byte| byte.is_ascii_whitespace() || matches!(byte, b'/' | b'>'))
        {
            return Some(find_tag_end(template, close).unwrap_or(template.len()));
        }
        pos = name;
    }
    Some(template.len())
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
        .find(|attr| attr.name.eq_ignore_ascii_case(name))
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
