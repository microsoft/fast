use std::fmt;

pub(crate) const ACCEPTED_SYNTAXES: &[&str] = &["webui-prerelease", "fast-v3-ts"];

/// An error encountered while converting a FAST declarative template.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ConvertError {
    /// The requested target syntax is not supported.
    UnsupportedSyntax { syntax: String },
    /// No `<f-template>` element was present in the input.
    MissingFTemplate,
    /// More than one `<f-template>` element was present in the input.
    MultipleFTemplates { count: usize },
    /// The `<f-template>` element is missing a string-valued `name` attribute.
    MissingFTemplateName,
    /// The `<f-template name="…">` value is empty or whitespace.
    EmptyFTemplateName,
    /// The `<f-template>` element does not contain an inner `<template>` element.
    MissingInnerTemplate,
    /// The `<f-template>` element contains more than one inner `<template>` element.
    MultipleInnerTemplates { count: usize },
    /// An HTML element was not closed.
    UnclosedElement { tag: String, context: String },
    /// An opening tag was not terminated with `>`.
    UnclosedTag { context: String },
    /// A directive is missing its required `value="{{…}}"` attribute.
    MissingValueAttribute { tag: String, context: String },
    /// A directive `value` attribute is not wrapped in declarative binding delimiters.
    InvalidDirectiveValue {
        tag: String,
        value: Option<String>,
        context: String,
    },
    /// An `<f-repeat>` expression is not in `item in items` form.
    InvalidRepeatExpression { expr: String, context: String },
    /// A double-brace binding is not closed.
    UnclosedBinding { context: String },
    /// A double-brace binding has no expression.
    EmptyBinding { context: String },
    /// An `f-*` attribute is not supported by the converter.
    UnsupportedFAttribute { attribute: String, context: String },
    /// An `f-*` element is not supported by the converter.
    UnsupportedFElement { tag: String, context: String },
    /// A declarative expression is outside the supported converter grammar.
    UnsupportedExpression {
        expr: String,
        reason: String,
        context: String,
    },
    /// An event handler expression could not be converted.
    UnsupportedEventHandler {
        value: String,
        reason: String,
        context: String,
    },
}

impl fmt::Display for ConvertError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::UnsupportedSyntax { syntax } => write!(
                f,
                "unsupported syntax '{syntax}': accepted values are {}",
                ACCEPTED_SYNTAXES.join(", ")
            ),
            Self::MissingFTemplate => write!(
                f,
                "template validation error: expected exactly one '<f-template>' element"
            ),
            Self::MultipleFTemplates { count } => write!(
                f,
                "template validation error: expected exactly one '<f-template>' element, found {count}"
            ),
            Self::MissingFTemplateName => write!(
                f,
                "template validation error: '<f-template>' must include a string 'name' attribute"
            ),
            Self::EmptyFTemplateName => write!(
                f,
                "template validation error: '<f-template name>' cannot be empty"
            ),
            Self::MissingInnerTemplate => write!(
                f,
                "template validation error: '<f-template>' must contain exactly one inner '<template>' element"
            ),
            Self::MultipleInnerTemplates { count } => write!(
                f,
                "template validation error: '<f-template>' must contain exactly one inner '<template>' element, found {count}"
            ),
            Self::UnclosedElement { tag, context } => write!(
                f,
                "unclosed element '<{tag}>': no matching '</{tag}>' closing tag was found — template: \"{context}\""
            ),
            Self::UnclosedTag { context } => write!(
                f,
                "unclosed tag: no closing '>' was found — template: \"{context}\""
            ),
            Self::MissingValueAttribute { tag, context } => write!(
                f,
                "directive '<{tag}>' is missing a valid 'value=\"{{{{…}}}}\"' attribute — template: \"{context}\""
            ),
            Self::InvalidDirectiveValue { tag, value, context } => {
                let value = value.as_deref().unwrap_or("");
                write!(
                    f,
                    "directive '<{tag}>' has invalid value '{value}': expected 'value=\"{{{{…}}}}\"' — template: \"{context}\""
                )
            }
            Self::InvalidRepeatExpression { expr, context } => write!(
                f,
                "invalid repeat expression '{{{{{expr}}}}}': expected 'item in items' format — template: \"{context}\""
            ),
            Self::UnclosedBinding { context } => write!(
                f,
                "unclosed binding '{{{{…': no closing '}}}}' found — template: \"{context}\""
            ),
            Self::EmptyBinding { context } => write!(
                f,
                "empty binding '{{{{}}}}': the expression between '{{{{' and '}}}}' cannot be empty — template: \"{context}\""
            ),
            Self::UnsupportedFAttribute { attribute, context } => write!(
                f,
                "unsupported f-* attribute '{attribute}' — template: \"{context}\""
            ),
            Self::UnsupportedFElement { tag, context } => write!(
                f,
                "unsupported f-* element '<{tag}>' — template: \"{context}\""
            ),
            Self::UnsupportedExpression { expr, reason, context } => write!(
                f,
                "unsupported expression '{{{{{expr}}}}}': {reason} — template: \"{context}\""
            ),
            Self::UnsupportedEventHandler { value, reason, context } => write!(
                f,
                "unsupported event handler '{{{value}}}': {reason} — template: \"{context}\""
            ),
        }
    }
}

impl std::error::Error for ConvertError {}

/// Extract a short snippet of `template` around `at` for use in error messages.
pub(crate) fn template_context(template: &str, at: usize) -> String {
    const PRE: usize = 20;
    const POST: usize = 80;

    let mut start = at.saturating_sub(PRE);
    while start > 0 && !template.is_char_boundary(start) {
        start -= 1;
    }

    let mut end = (at + POST).min(template.len());
    while end < template.len() && !template.is_char_boundary(end) {
        end += 1;
    }

    let prefix = if start > 0 { "…" } else { "" };
    let suffix = if end < template.len() { "…" } else { "" };
    format!("{prefix}{}{suffix}", &template[start..end])
}
