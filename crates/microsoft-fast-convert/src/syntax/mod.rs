pub(crate) mod fast_v3_ts;
pub(crate) mod webui;

use crate::error::{template_context, ConvertError};
use crate::html::parse_attributes;

pub(crate) fn required_binding_value(
    open_tag: &str,
    tag: &str,
    template: &str,
    at: usize,
) -> Result<String, ConvertError> {
    let value = parse_attributes(open_tag)
        .into_iter()
        .find(|attr| attr.name == "value")
        .and_then(|attr| attr.value)
        .ok_or_else(|| ConvertError::MissingValueAttribute {
            tag: tag.to_string(),
            context: template_context(template, at),
        })?;

    let trimmed = value.trim();
    if !trimmed.starts_with("{{") || !trimmed.ends_with("}}") || trimmed.len() <= 4 {
        return Err(ConvertError::InvalidDirectiveValue {
            tag: tag.to_string(),
            value: Some(value),
            context: template_context(template, at),
        });
    }

    let expr = trimmed[2..trimmed.len() - 2].trim();
    if expr.is_empty() {
        return Err(ConvertError::InvalidDirectiveValue {
            tag: tag.to_string(),
            value: Some(value),
            context: template_context(template, at),
        });
    }

    Ok(expr.to_string())
}

pub(crate) fn validate_directive_attrs(
    open_tag: &str,
    template: &str,
    at: usize,
) -> Result<(), ConvertError> {
    for attr in parse_attributes(open_tag) {
        if attr.name.starts_with("f-") {
            return Err(ConvertError::UnsupportedFAttribute {
                attribute: attr.name,
                context: template_context(template, at),
            });
        }
    }
    Ok(())
}

pub(crate) fn is_supported_f_attribute(name: &str) -> bool {
    matches!(name, "f-ref" | "f-children" | "f-slotted")
}

pub(crate) fn strip_single_brace(value: &str) -> Option<&str> {
    let trimmed = value.trim();
    if trimmed.starts_with('{')
        && trimmed.ends_with('}')
        && !trimmed.starts_with("{{")
        && trimmed.len() >= 2
    {
        Some(trimmed[1..trimmed.len() - 1].trim())
    } else {
        None
    }
}
