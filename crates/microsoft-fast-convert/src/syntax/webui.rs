use super::{is_supported_f_attribute, required_binding_value, validate_directive_attrs};
use crate::error::{template_context, ConvertError};
use crate::expression::parse_repeat_expression;
use crate::html::{find_matching_close, find_tag_end, parse_attributes, read_tag_name};

pub(crate) fn convert(template: &str) -> Result<String, ConvertError> {
    convert_segment(template)
}

fn convert_segment(template: &str) -> Result<String, ConvertError> {
    let mut out = String::with_capacity(template.len());
    let mut pos = 0usize;

    while pos < template.len() {
        if template[pos..].starts_with("<!--") {
            if let Some(end) = template[pos..].find("-->") {
                let end = pos + end + 3;
                out.push_str(&template[pos..end]);
                pos = end;
                continue;
            }
        }

        let Some(relative) = template[pos..].find('<') else {
            out.push_str(&template[pos..]);
            break;
        };
        let lt = pos + relative;
        out.push_str(&template[pos..lt]);

        let Some(tag_name) = read_tag_name(template, lt) else {
            out.push('<');
            pos = lt + 1;
            continue;
        };

        match tag_name.as_str() {
            "f-repeat" => {
                let (converted, next) = convert_directive(template, lt, "f-repeat")?;
                out.push_str(&converted);
                pos = next;
            }
            "f-when" => {
                let (converted, next) = convert_directive(template, lt, "f-when")?;
                out.push_str(&converted);
                pos = next;
            }
            _ if tag_name.starts_with("f-") => {
                return Err(ConvertError::UnsupportedFElement {
                    tag: tag_name,
                    context: template_context(template, lt),
                });
            }
            _ => {
                let tag_end =
                    find_tag_end(template, lt).ok_or_else(|| ConvertError::UnclosedTag {
                        context: template_context(template, lt),
                    })?;
                validate_attributes(&template[lt..tag_end], template, lt)?;
                out.push_str(&template[lt..tag_end]);
                pos = tag_end;
            }
        }
    }

    Ok(out)
}

fn convert_directive(
    template: &str,
    start: usize,
    tag: &str,
) -> Result<(String, usize), ConvertError> {
    let tag_end = find_tag_end(template, start).ok_or_else(|| ConvertError::UnclosedTag {
        context: template_context(template, start),
    })?;
    let open_tag = &template[start..tag_end];
    validate_directive_attrs(open_tag, template, start)?;
    let expr = required_binding_value(open_tag, tag, template, start)?;

    if tag == "f-repeat" {
        parse_repeat_expression(&expr, template, start)?;
    } else if expr.trim().is_empty() {
        return Err(ConvertError::InvalidDirectiveValue {
            tag: tag.to_string(),
            value: Some(expr),
            context: template_context(template, start),
        });
    }

    let (close_start, close_end) =
        find_matching_close(template, start, tag).ok_or_else(|| ConvertError::UnclosedElement {
            tag: tag.to_string(),
            context: template_context(template, start),
        })?;
    let inner = convert_segment(&template[tag_end..close_start])?;

    let output = if tag == "f-repeat" {
        format!("<for each=\"{}\">{inner}</for>", expr.trim())
    } else {
        format!("<if condition=\"{}\">{inner}</if>", expr.trim())
    };

    Ok((output, close_end))
}

fn validate_attributes(open_tag: &str, template: &str, at: usize) -> Result<(), ConvertError> {
    for attr in parse_attributes(open_tag) {
        if attr.name.starts_with("f-") && !is_supported_f_attribute(&attr.name) {
            return Err(ConvertError::UnsupportedFAttribute {
                attribute: attr.name,
                context: template_context(template, at),
            });
        }
    }
    Ok(())
}
