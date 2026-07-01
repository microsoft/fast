use super::{required_binding_value, strip_single_brace, validate_directive_attrs};
use crate::error::{template_context, ConvertError};
use crate::expression::{
    event_handler_to_arrow, expression_to_arrow, is_path, parse_repeat_expression, RepeatScope,
};
use crate::html::{
    find_matching_close, find_tag_end, is_self_closing_tag, parse_attributes, read_tag_name,
    ParsedAttribute,
};
use crate::syntax::SyntaxMetadata;

pub(crate) const METADATA: SyntaxMetadata = SyntaxMetadata {
    name: "fast-v3-ts",
    extension: ".ts",
    suffix: ".template.ts",
};

pub(crate) fn convert(template: &str) -> Result<String, ConvertError> {
    let mut state = TsState::default();
    let body = convert_segment(template, &mut state, &[])?;

    let mut output = String::new();
    output.push_str("import { html } from \"@microsoft/fast-element/html.js\";\n");
    if state.repeat {
        output.push_str("import { repeat } from \"@microsoft/fast-element/repeat.js\";\n");
    }
    if state.when {
        output.push_str("import { when } from \"@microsoft/fast-element/when.js\";\n");
    }
    if state.ref_attr {
        output.push_str("import { ref } from \"@microsoft/fast-element/ref.js\";\n");
    }
    if state.children {
        output.push_str("import { children } from \"@microsoft/fast-element/children.js\";\n");
    }
    if state.slotted {
        output.push_str("import { slotted } from \"@microsoft/fast-element/slotted.js\";\n");
    }
    output.push_str("\nexport const template = html`");
    output.push_str(&body);
    output.push_str("`;\n");

    Ok(output)
}

#[derive(Default)]
struct TsState {
    repeat: bool,
    when: bool,
    ref_attr: bool,
    children: bool,
    slotted: bool,
}

fn convert_segment(
    template: &str,
    state: &mut TsState,
    scopes: &[RepeatScope],
) -> Result<String, ConvertError> {
    let mut out = String::with_capacity(template.len());
    let mut pos = 0usize;

    while pos < template.len() {
        if template[pos..].starts_with("<!--") {
            if let Some(end) = template[pos..].find("-->") {
                let end = pos + end + 3;
                out.push_str(&escape_ts_literal(&template[pos..end]));
                pos = end;
                continue;
            }
        }

        if template[pos..].starts_with("{{{") {
            return Err(ConvertError::UnsupportedExpression {
                expr: "{{{…}}}".to_string(),
                reason:
                    "triple-brace unescaped bindings are not supported by fast-v3-ts conversion"
                        .to_string(),
                context: template_context(template, pos),
            });
        }

        if template[pos..].starts_with("{{") {
            let (binding, next) = convert_text_binding(template, pos, scopes)?;
            out.push_str(&binding);
            pos = next;
            continue;
        }

        if template[pos..].starts_with("</") {
            let tag_end = find_tag_end(template, pos).ok_or_else(|| ConvertError::UnclosedTag {
                context: template_context(template, pos),
            })?;
            out.push_str(&escape_ts_literal(&template[pos..tag_end]));
            pos = tag_end;
            continue;
        }

        if template[pos..].starts_with('<') {
            if let Some(tag_name) = read_tag_name(template, pos) {
                match tag_name.as_str() {
                    "f-repeat" => {
                        let (converted, next) = convert_repeat(template, pos, state, scopes)?;
                        out.push_str(&converted);
                        pos = next;
                        continue;
                    }
                    "f-when" => {
                        let (converted, next) = convert_when(template, pos, state, scopes)?;
                        out.push_str(&converted);
                        pos = next;
                        continue;
                    }
                    _ if tag_name.starts_with("f-") => {
                        return Err(ConvertError::UnsupportedFElement {
                            tag: tag_name,
                            context: template_context(template, pos),
                        });
                    }
                    _ => {
                        let (tag, next) = convert_open_tag(template, pos, state, scopes)?;
                        out.push_str(&tag);
                        pos = next;
                        continue;
                    }
                }
            }
        }

        let next_special = find_next_special(template, pos + 1).unwrap_or(template.len());
        out.push_str(&escape_ts_literal(&template[pos..next_special]));
        pos = next_special;
    }

    Ok(out)
}

fn convert_text_binding(
    template: &str,
    start: usize,
    scopes: &[RepeatScope],
) -> Result<(String, usize), ConvertError> {
    let expr_start = start + 2;
    let end = template[expr_start..]
        .find("}}")
        .map(|relative| expr_start + relative)
        .ok_or_else(|| ConvertError::UnclosedBinding {
            context: template_context(template, start),
        })?;
    let expr = template[expr_start..end].trim();
    if expr.is_empty() {
        return Err(ConvertError::EmptyBinding {
            context: template_context(template, start),
        });
    }

    Ok((
        format!(
            "${{{}}}",
            expression_to_arrow(expr, scopes, template, start)?
        ),
        end + 2,
    ))
}

fn convert_repeat(
    template: &str,
    start: usize,
    state: &mut TsState,
    scopes: &[RepeatScope],
) -> Result<(String, usize), ConvertError> {
    let tag_end = find_tag_end(template, start).ok_or_else(|| ConvertError::UnclosedTag {
        context: template_context(template, start),
    })?;
    let open_tag = &template[start..tag_end];
    validate_directive_attrs(open_tag, template, start)?;
    let expr = required_binding_value(open_tag, "f-repeat", template, start)?;
    let (alias, source) = parse_repeat_expression(&expr, template, start)?;
    let selector = expression_to_arrow(&source, scopes, template, start)?;
    let (close_start, close_end) =
        find_matching_close(template, start, "f-repeat").ok_or_else(|| {
            ConvertError::UnclosedElement {
                tag: "f-repeat".to_string(),
                context: template_context(template, start),
            }
        })?;

    let mut child_scopes = scopes.to_vec();
    child_scopes.push(RepeatScope { alias });
    let inner = convert_segment(&template[tag_end..close_start], state, &child_scopes)?;
    state.repeat = true;

    Ok((
        format!("${{repeat({selector}, x => html`{inner}`)}}"),
        close_end,
    ))
}

fn convert_when(
    template: &str,
    start: usize,
    state: &mut TsState,
    scopes: &[RepeatScope],
) -> Result<(String, usize), ConvertError> {
    let tag_end = find_tag_end(template, start).ok_or_else(|| ConvertError::UnclosedTag {
        context: template_context(template, start),
    })?;
    let open_tag = &template[start..tag_end];
    validate_directive_attrs(open_tag, template, start)?;
    let expr = required_binding_value(open_tag, "f-when", template, start)?;
    let condition = expression_to_arrow(&expr, scopes, template, start)?;
    let (close_start, close_end) =
        find_matching_close(template, start, "f-when").ok_or_else(|| {
            ConvertError::UnclosedElement {
                tag: "f-when".to_string(),
                context: template_context(template, start),
            }
        })?;
    let inner = convert_segment(&template[tag_end..close_start], state, scopes)?;
    state.when = true;

    Ok((format!("${{when({condition}, html`{inner}`)}}"), close_end))
}

fn convert_open_tag(
    template: &str,
    start: usize,
    state: &mut TsState,
    scopes: &[RepeatScope],
) -> Result<(String, usize), ConvertError> {
    let tag_end = find_tag_end(template, start).ok_or_else(|| ConvertError::UnclosedTag {
        context: template_context(template, start),
    })?;
    let open_tag = &template[start..tag_end];
    let tag_name = read_tag_name(template, start).unwrap_or_default();
    let mut out = String::new();
    out.push('<');
    out.push_str(&tag_name);

    for attr in parse_attributes(open_tag) {
        append_converted_attribute(&mut out, attr, template, start, state, scopes)?;
    }

    if is_self_closing_tag(open_tag) {
        out.push_str(" />");
    } else {
        out.push('>');
    }

    Ok((out, tag_end))
}

fn append_converted_attribute(
    out: &mut String,
    attr: ParsedAttribute,
    template: &str,
    at: usize,
    state: &mut TsState,
    scopes: &[RepeatScope],
) -> Result<(), ConvertError> {
    if attr.name.starts_with("f-") {
        append_f_attribute(out, attr, template, at, state)?;
        return Ok(());
    }

    if attr.name.starts_with('@') {
        if let Some(value) = attr.value.as_deref() {
            if let Some(handler) = strip_single_brace(value) {
                let converted = event_handler_to_arrow(handler, scopes, template, at)?;
                out.push_str(&format!(" {}=\"${{{converted}}}\"", attr.name));
                return Ok(());
            }
        }
    }

    if let Some(value) = attr.value.as_deref() {
        if value.contains("{{") {
            let converted = convert_attribute_value(value, template, at, scopes)?;
            out.push_str(&format!(" {}=\"{}\"", attr.name, converted));
            return Ok(());
        }
    }

    out.push(' ');
    out.push_str(&escape_ts_literal(&attr.raw));
    Ok(())
}

fn append_f_attribute(
    out: &mut String,
    attr: ParsedAttribute,
    template: &str,
    at: usize,
    state: &mut TsState,
) -> Result<(), ConvertError> {
    let (helper, flag): (&str, fn(&mut TsState) -> &mut bool) = match attr.name.as_str() {
        "f-ref" => ("ref", |state| &mut state.ref_attr),
        "f-children" => ("children", |state| &mut state.children),
        "f-slotted" => ("slotted", |state| &mut state.slotted),
        _ => {
            return Err(ConvertError::UnsupportedFAttribute {
                attribute: attr.name,
                context: template_context(template, at),
            });
        }
    };

    let value = attr
        .value
        .ok_or_else(|| ConvertError::UnsupportedFAttribute {
            attribute: attr.name.clone(),
            context: template_context(template, at),
        })?;
    let normalized = normalize_f_attribute_value(&value);
    if normalized.is_empty() || !is_path(normalized) {
        return Err(ConvertError::UnsupportedFAttribute {
            attribute: attr.name,
            context: template_context(template, at),
        });
    }

    *flag(state) = true;
    out.push_str(&format!(
        " ${{{}(\"{}\")}}",
        helper,
        escape_js_string(normalized)
    ));
    Ok(())
}

fn convert_attribute_value(
    value: &str,
    template: &str,
    at: usize,
    scopes: &[RepeatScope],
) -> Result<String, ConvertError> {
    let mut out = String::new();
    let mut pos = 0usize;

    while pos < value.len() {
        let Some(relative) = value[pos..].find("{{") else {
            out.push_str(&escape_ts_attribute_literal(&value[pos..]));
            break;
        };
        let start = pos + relative;
        out.push_str(&escape_ts_attribute_literal(&value[pos..start]));

        if value[start..].starts_with("{{{") {
            return Err(ConvertError::UnsupportedExpression {
                expr: "{{{…}}}".to_string(),
                reason: "triple-brace unescaped bindings are not supported in attributes"
                    .to_string(),
                context: template_context(template, at),
            });
        }

        let expr_start = start + 2;
        let end = value[expr_start..]
            .find("}}")
            .map(|relative| expr_start + relative)
            .ok_or_else(|| ConvertError::UnclosedBinding {
                context: template_context(template, at),
            })?;
        let expr = value[expr_start..end].trim();
        if expr.is_empty() {
            return Err(ConvertError::EmptyBinding {
                context: template_context(template, at),
            });
        }
        out.push_str(&format!(
            "${{{}}}",
            expression_to_arrow(expr, scopes, template, at)?
        ));
        pos = end + 2;
    }

    Ok(out)
}

fn normalize_f_attribute_value(value: &str) -> &str {
    strip_single_brace(value).unwrap_or(value).trim()
}

fn find_next_special(template: &str, from: usize) -> Option<usize> {
    let lt = template[from..].find('<').map(|relative| from + relative);
    let binding = template[from..].find("{{").map(|relative| from + relative);
    [lt, binding].into_iter().flatten().min()
}

fn escape_ts_literal(value: &str) -> String {
    let mut out = String::with_capacity(value.len());
    let mut chars = value.chars().peekable();

    while let Some(ch) = chars.next() {
        match ch {
            '`' => out.push_str("\\`"),
            '\\' => out.push_str("\\\\"),
            '$' if chars.peek() == Some(&'{') => {
                out.push_str("\\${");
                chars.next();
            }
            _ => out.push(ch),
        }
    }

    out
}

fn escape_ts_attribute_literal(value: &str) -> String {
    escape_ts_literal(&value.replace('"', "&quot;"))
}

fn escape_js_string(value: &str) -> String {
    let mut out = String::with_capacity(value.len());
    for ch in value.chars() {
        match ch {
            '\\' => out.push_str("\\\\"),
            '"' => out.push_str("\\\""),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            _ => out.push(ch),
        }
    }
    out
}
