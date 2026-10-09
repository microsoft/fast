//! WebUI Framework prerelease conversion target.
//!
//! Converts the FAST-element-authored declarative `<f-template>` syntax into
//! the declarative HTML syntax consumed by the Microsoft WebUI Framework's
//! own web component runtime: the outer `<f-template>` publisher wrapper is
//! removed (its `shadowroot`-prefixed attributes are transferred onto the
//! inner `<template>`), `f-ref` becomes a braced `w-ref`, and FAST's `$e`
//! event argument becomes `e`. FAST directives with no WebUI Framework
//! equivalent (`f-slotted`, `f-children`) are stripped from the output and
//! reported as [`ConvertWarning`]s rather than aborting conversion; every
//! other unsupported construct remains a hard error.
//!
//! The `-prerelease` suffix on this target's name reflects that the WebUI
//! Framework project itself is currently in prerelease — it is not a
//! statement about the stability of this conversion target's
//! implementation. This target is independent from, and does not modify,
//! the separate `webui-prerelease` target (which targets WebUI's FAST
//! parser plugin instead of the WebUI Framework runtime).

use super::strip_single_brace;
use crate::error::{template_context, ConvertError};
use crate::expression::{is_path, parse_repeat_expression, split_arguments};
use crate::html::{
    find_matching_close, find_tag_end, parse_attributes, read_tag_name, ParsedAttribute,
    ParsedTemplate,
};
use crate::syntax::SyntaxMetadata;
use crate::warning::ConvertWarning;
use crate::ConvertOutput;

pub(crate) const METADATA: SyntaxMetadata = SyntaxMetadata {
    name: "webui-framework-prerelease",
    extension: ".html",
    // Deliberately distinct from `webui-prerelease`'s `.webui.html` default so
    // converting the same input for both targets without an explicit
    // `--output` cannot silently overwrite the other target's file.
    suffix: ".webui-framework.html",
};

pub(crate) fn convert(parsed: &ParsedTemplate) -> Result<ConvertOutput, ConvertError> {
    let template = merge_publisher_attributes(parsed)?;
    let mut warnings = Vec::new();
    let output = convert_segment(&template, &mut warnings)?;
    Ok(ConvertOutput { output, warnings })
}

/// Moves supported outer `<f-template>` publisher attributes (`shadowroot`-prefixed
/// attributes) onto the inner `<template>` tag, rejecting unsupported publisher
/// attributes and conflicting shadow-root declarations.
fn merge_publisher_attributes(parsed: &ParsedTemplate) -> Result<String, ConvertError> {
    let template = &parsed.template;
    let tag_end = find_tag_end(template, 0).ok_or_else(|| ConvertError::UnclosedTag {
        context: template_context(template, 0),
    })?;
    let open_tag = &template[0..tag_end];
    let inner_attrs = parse_attributes(open_tag);

    let mut merged: Vec<ParsedAttribute> = inner_attrs.clone();

    for publisher_attr in &parsed.publisher_attributes {
        if !is_shadowroot_attribute(&publisher_attr.name) {
            return Err(ConvertError::UnsupportedPublisherAttribute {
                attribute: publisher_attr.name.clone(),
                context: template_context(template, 0),
            });
        }

        match inner_attrs
            .iter()
            .find(|attr| attr.name.eq_ignore_ascii_case(&publisher_attr.name))
        {
            Some(existing) if existing.value == publisher_attr.value => {
                // Already present with an identical value; nothing to do.
            }
            Some(existing) => {
                return Err(ConvertError::ConflictingShadowRootMode {
                    publisher: attribute_display(publisher_attr),
                    inner: attribute_display(existing),
                    context: template_context(template, 0),
                });
            }
            None => merged.push(publisher_attr.clone()),
        }
    }

    let mut rebuilt = String::from("<template");
    for attr in &merged {
        rebuilt.push(' ');
        rebuilt.push_str(&attr.name);
        if let Some(value) = &attr.value {
            rebuilt.push_str("=\"");
            rebuilt.push_str(value);
            rebuilt.push('"');
        }
    }
    rebuilt.push('>');
    rebuilt.push_str(&template[tag_end..]);

    Ok(rebuilt)
}

fn is_shadowroot_attribute(name: &str) -> bool {
    name.to_ascii_lowercase().starts_with("shadowroot")
}

fn attribute_display(attr: &ParsedAttribute) -> String {
    match &attr.value {
        Some(value) => format!("{}=\"{value}\"", attr.name),
        None => attr.name.clone(),
    }
}

fn convert_segment(
    template: &str,
    warnings: &mut Vec<ConvertWarning>,
) -> Result<String, ConvertError> {
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

        if template[pos..].starts_with("{{") {
            let (binding, next) = validate_text_binding(template, pos)?;
            out.push_str(&binding);
            pos = next;
            continue;
        }

        let Some(relative) = template[pos..].find('<') else {
            out.push_str(&template[pos..]);
            break;
        };
        let lt = pos + relative;
        if lt > pos {
            // Copy text content up to the tag, preserving any raw `{{…}}`
            // bindings scanned above; re-scan from `pos` for the next binding
            // boundary so text and tags interleave correctly.
            let next_boundary = template[pos..lt]
                .find("{{")
                .map(|relative| pos + relative)
                .unwrap_or(lt);
            out.push_str(&template[pos..next_boundary]);
            pos = next_boundary;
            continue;
        }

        let Some(tag_name) = read_tag_name(template, lt) else {
            out.push('<');
            pos = lt + 1;
            continue;
        };

        match tag_name.as_str() {
            "f-repeat" => {
                let (converted, next) = convert_directive(template, lt, "f-repeat", warnings)?;
                out.push_str(&converted);
                pos = next;
            }
            "f-when" => {
                let (converted, next) = convert_directive(template, lt, "f-when", warnings)?;
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
                let converted = convert_open_tag(&template[lt..tag_end], template, lt, warnings)?;
                out.push_str(&converted);
                pos = tag_end;
            }
        }
    }

    Ok(out)
}

fn validate_text_binding(template: &str, start: usize) -> Result<(String, usize), ConvertError> {
    let expr_start = start + 2;
    let end = template[expr_start..]
        .find("}}")
        .map(|relative| expr_start + relative)
        .ok_or_else(|| ConvertError::UnclosedBinding {
            context: template_context(template, start),
        })?;

    if template[expr_start..end].trim().is_empty() {
        return Err(ConvertError::EmptyBinding {
            context: template_context(template, start),
        });
    }

    Ok((template[start..end + 2].to_string(), end + 2))
}

fn convert_directive(
    template: &str,
    start: usize,
    tag: &str,
    warnings: &mut Vec<ConvertWarning>,
) -> Result<(String, usize), ConvertError> {
    let tag_end = find_tag_end(template, start).ok_or_else(|| ConvertError::UnclosedTag {
        context: template_context(template, start),
    })?;
    let open_tag = &template[start..tag_end];
    let expr = super::required_binding_value(open_tag, tag, template, start)?;

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
    let inner = convert_segment(&template[tag_end..close_start], warnings)?;

    let output = if tag == "f-repeat" {
        format!("<for each=\"{}\">{inner}</for>", expr.trim())
    } else {
        format!("<if condition=\"{}\">{inner}</if>", expr.trim())
    };

    Ok((output, close_end))
}

fn convert_open_tag(
    open_tag: &str,
    template: &str,
    at: usize,
    warnings: &mut Vec<ConvertWarning>,
) -> Result<String, ConvertError> {
    let tag_name = read_tag_name(template, at).unwrap_or_default();
    let self_closing = open_tag.trim_end().ends_with("/>");

    let mut out = String::from("<");
    out.push_str(&tag_name);

    for attr in parse_attributes(open_tag) {
        if let Some(converted) = convert_attribute(&attr, template, at, warnings)? {
            out.push(' ');
            out.push_str(&converted);
        }
    }

    if self_closing {
        out.push_str(" />");
    } else {
        out.push('>');
    }

    Ok(out)
}

/// Converts a single attribute, returning `None` when the attribute has no
/// WebUI equivalent and should be stripped from the output (recording a
/// warning in that case rather than failing the whole conversion).
fn convert_attribute(
    attr: &ParsedAttribute,
    template: &str,
    at: usize,
    warnings: &mut Vec<ConvertWarning>,
) -> Result<Option<String>, ConvertError> {
    if attr.name == "f-ref" {
        let inner =
            strip_single_brace(attr.value.as_deref().unwrap_or_default()).ok_or_else(|| {
                ConvertError::InvalidAttributeValue {
                    attribute: "f-ref".to_string(),
                    value: attr.value.clone(),
                    context: template_context(template, at),
                }
            })?;
        return Ok(Some(format!("w-ref=\"{{{inner}}}\"")));
    }

    if matches!(attr.name.as_str(), "f-slotted" | "f-children") {
        warnings.push(ConvertWarning::StrippedUnsupportedDirective {
            directive: attr.name.clone(),
            context: template_context(template, at),
        });
        return Ok(None);
    }

    if attr.name.starts_with("f-") {
        return Err(ConvertError::UnsupportedFAttribute {
            attribute: attr.name.clone(),
            context: template_context(template, at),
        });
    }

    if let Some(event_name) = attr.name.strip_prefix('@') {
        let value = convert_event_value(attr.value.as_deref().unwrap_or_default(), template, at)?;
        return Ok(Some(format!("@{event_name}=\"{value}\"")));
    }

    if let Some(value) = &attr.value {
        if value.trim().starts_with("{{") {
            validate_double_brace_value(value, template, at)?;
        }
        return Ok(Some(format!("{}=\"{value}\"", attr.name)));
    }

    Ok(Some(attr.name.clone()))
}

fn validate_double_brace_value(value: &str, template: &str, at: usize) -> Result<(), ConvertError> {
    let trimmed = value.trim();
    if !trimmed.ends_with("}}") {
        return Err(ConvertError::UnclosedBinding {
            context: template_context(template, at),
        });
    }
    if trimmed.len() <= 4 || trimmed[2..trimmed.len() - 2].trim().is_empty() {
        return Err(ConvertError::EmptyBinding {
            context: template_context(template, at),
        });
    }
    Ok(())
}

fn convert_event_value(value: &str, template: &str, at: usize) -> Result<String, ConvertError> {
    let inner = strip_single_brace(value).ok_or_else(|| ConvertError::UnsupportedEventHandler {
        value: value.to_string(),
        reason: "event handlers must be a single-braced call such as '{select($e)}'".to_string(),
        context: template_context(template, at),
    })?;

    let open = inner
        .find('(')
        .ok_or_else(|| ConvertError::UnsupportedEventHandler {
            value: value.to_string(),
            reason: "expected a handler call such as 'handleClick($e)'".to_string(),
            context: template_context(template, at),
        })?;
    if !inner.ends_with(')') {
        return Err(ConvertError::UnsupportedEventHandler {
            value: value.to_string(),
            reason: "event handler calls must end with ')'".to_string(),
            context: template_context(template, at),
        });
    }

    let name = inner[..open].trim();
    if !is_path(name) {
        return Err(ConvertError::UnsupportedEventHandler {
            value: value.to_string(),
            reason: "handler name must be an identifier or dotted path".to_string(),
            context: template_context(template, at),
        });
    }

    let args = &inner[open + 1..inner.len() - 1];
    let converted_args = split_arguments(args)
        .into_iter()
        .map(|arg| convert_event_argument(arg, template, at))
        .collect::<Result<Vec<_>, _>>()?;

    Ok(format!("{{{name}({})}}", converted_args.join(", ")))
}

fn convert_event_argument(arg: &str, template: &str, at: usize) -> Result<String, ConvertError> {
    let arg = arg.trim();
    match arg {
        "" => Ok(String::new()),
        "$e" => Ok("e".to_string()),
        _ if arg.starts_with('$') => Err(ConvertError::UnsupportedEventContext {
            value: arg.to_string(),
            context: template_context(template, at),
        }),
        _ => Ok(arg.to_string()),
    }
}
