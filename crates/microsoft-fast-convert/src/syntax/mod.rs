pub(crate) mod fast_v3_ts;
pub(crate) mod webui;

use crate::error::{template_context, ConvertError};
use crate::html::parse_attributes;

/// Metadata for a supported converter syntax target.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct SyntaxMetadata {
    /// Syntax value accepted by `convert_template`.
    pub name: &'static str,
    /// Required output extension for generated files.
    pub extension: &'static str,
    /// Default output suffix appended to the input basename.
    pub suffix: &'static str,
}

const SYNTAX_METADATA: &[SyntaxMetadata] = &[webui::METADATA, fast_v3_ts::METADATA];

pub fn syntax_metadata() -> &'static [SyntaxMetadata] {
    SYNTAX_METADATA
}

pub(crate) fn accepted_syntax_names() -> String {
    syntax_metadata()
        .iter()
        .map(|metadata| metadata.name)
        .collect::<Vec<_>>()
        .join(", ")
}

pub fn syntax_metadata_json() -> String {
    let mut out = String::from("[");
    for (index, metadata) in syntax_metadata().iter().enumerate() {
        if index > 0 {
            out.push(',');
        }
        out.push_str("{\"syntax\":\"");
        out.push_str(metadata.name);
        out.push_str("\",\"extension\":\"");
        out.push_str(metadata.extension);
        out.push_str("\",\"suffix\":\"");
        out.push_str(metadata.suffix);
        out.push_str("\"}");
    }
    out.push(']');
    out
}

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
