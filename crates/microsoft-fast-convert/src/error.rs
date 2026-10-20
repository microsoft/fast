use std::fmt;

/// An error encountered while converting a FAST declarative template.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ConvertError {
    /// Typed exports are only meaningful for TypeScript conversion.
    TypedUnsupportedForSyntax { syntax: String },
    /// Stylesheets cannot use template source types.
    TypeSourceUnsupportedForStylesheet,
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
    UnclosedElement { tag: String, context: ErrorContext },
    /// An opening tag was not terminated with `>`.
    UnclosedTag { context: ErrorContext },
    /// A directive is missing its required `value="{{…}}"` attribute.
    MissingValueAttribute { tag: String, context: ErrorContext },
    /// A directive `value` attribute is not wrapped in declarative binding delimiters.
    InvalidDirectiveValue {
        tag: String,
        value: Option<String>,
        context: ErrorContext,
    },
    /// An `<f-repeat>` expression is not in `item in items` form.
    InvalidRepeatExpression { expr: String, context: ErrorContext },
    /// A double-brace binding is not closed.
    UnclosedBinding { context: ErrorContext },
    /// A double-brace binding has no expression.
    EmptyBinding { context: ErrorContext },
    /// An `f-*` attribute is not supported by the converter.
    UnsupportedFAttribute { attribute: String, context: ErrorContext },
    /// An `f-*` element is not supported by the converter.
    UnsupportedFElement { tag: String, context: ErrorContext },
    /// A declarative expression is outside the supported converter grammar.
    UnsupportedExpression {
        expr: String,
        reason: String,
        context: ErrorContext,
    },
    /// An event handler expression could not be converted.
    UnsupportedEventHandler {
        value: String,
        reason: String,
        context: ErrorContext,
    },
    /// `convert_stylesheet` was called with a syntax that does not support CSS conversion.
    StylesheetUnsupportedForSyntax { syntax: String },
    /// `convert_stylesheet`'s export name is not a valid TypeScript identifier.
    InvalidExportName { name: String },
    /// `type_source` was supplied for a syntax that does not support it.
    TypeSourceUnsupportedForSyntax { syntax: String },
    /// `type_source` is not a valid dotted TypeScript identifier.
    InvalidTypeSource { value: String },
    /// `type_source_import` was supplied without `type_source`.
    TypeSourceImportRequiresTypeSource,
    /// A FAST event context token has no WebUI equivalent (`$c`, or
    /// unsupported traversal such as `$c.parent`).
    UnsupportedEventContext { value: String, context: ErrorContext },
    /// The outer `<f-template>` and inner `<template>` declare conflicting
    /// shadow-root attribute values.
    ConflictingShadowRootMode {
        publisher: String,
        inner: String,
        context: ErrorContext,
    },
    /// The outer `<f-template>` wrapper declares an attribute (other than
    /// `name` or a `shadowroot`-prefixed attribute) that the converter does
    /// not know how to transfer onto the inner `<template>`.
    UnsupportedPublisherAttribute { attribute: String, context: ErrorContext },
    /// An attribute value is not in the expected braced form (e.g. `f-ref`
    /// must be a single-braced `{expr}`).
    InvalidAttributeValue {
        attribute: String,
        value: Option<String>,
        context: ErrorContext,
    },
    /// A validation error annotated with its authored HTML location.
    Located { error: Box<ConvertError>, context: ErrorContext },
}

/// One-based UTF-16 coordinates and a UTF-16 highlight length.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ErrorLocation {
    pub line: usize,
    pub column: usize,
    pub length: usize,
}

/// The original message snippet plus source provenance, allocated only on failure.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ErrorContext {
    // Keep diagnostic metadata out of the successful Result's stack footprint.
    inner: Box<ErrorContextData>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct ErrorContextData {
    snippet: String,
    source: Option<String>,
    range: std::ops::Range<usize>,
    template_name: Option<String>,
}

impl fmt::Display for ErrorContext {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.inner.snippet.fmt(f)
    }
}

impl From<String> for ErrorContext {
    fn from(snippet: String) -> Self {
        Self { inner: Box::new(ErrorContextData {
            snippet, source: None, range: 0..0, template_name: None,
        }) }
    }
}

impl ConvertError {
    /// The underlying error variant, without a source-location wrapper.
    pub fn kind(&self) -> &Self {
        match self {
            Self::Located { error, .. } => error.kind(),
            _ => self,
        }
    }

    /// A stable, machine-readable error code.
    pub fn code(&self) -> &'static str {
        match self.kind() {
            Self::TypedUnsupportedForSyntax { .. } => "typed-unsupported-for-syntax",
            Self::TypeSourceUnsupportedForStylesheet => "type-source-unsupported-for-stylesheet",
            Self::UnsupportedSyntax { .. } => "unsupported-syntax",
            Self::MissingFTemplate => "missing-f-template",
            Self::MultipleFTemplates { .. } => "multiple-f-templates",
            Self::MissingFTemplateName => "missing-f-template-name",
            Self::EmptyFTemplateName => "empty-f-template-name",
            Self::MissingInnerTemplate => "missing-inner-template",
            Self::MultipleInnerTemplates { .. } => "multiple-inner-templates",
            Self::UnclosedElement { .. } => "unclosed-element",
            Self::UnclosedTag { .. } => "unclosed-tag",
            Self::MissingValueAttribute { .. } => "missing-value-attribute",
            Self::InvalidDirectiveValue { .. } => "invalid-directive-value",
            Self::InvalidRepeatExpression { .. } => "invalid-repeat-expression",
            Self::UnclosedBinding { .. } => "unclosed-binding",
            Self::EmptyBinding { .. } => "empty-binding",
            Self::UnsupportedFAttribute { .. } => "unsupported-f-attribute",
            Self::UnsupportedFElement { .. } => "unsupported-f-element",
            Self::UnsupportedExpression { .. } => "unsupported-expression",
            Self::UnsupportedEventHandler { .. } => "unsupported-event-handler",
            Self::StylesheetUnsupportedForSyntax { .. } => "stylesheet-unsupported-for-syntax",
            Self::InvalidExportName { .. } => "invalid-export-name",
            Self::TypeSourceUnsupportedForSyntax { .. } => "type-source-unsupported-for-syntax",
            Self::InvalidTypeSource { .. } => "invalid-type-source",
            Self::TypeSourceImportRequiresTypeSource => "type-source-import-requires-type-source",
            Self::UnsupportedEventContext { .. } => "unsupported-event-context",
            Self::ConflictingShadowRootMode { .. } => "conflicting-shadow-root-mode",
            Self::UnsupportedPublisherAttribute { .. } => "unsupported-publisher-attribute",
            Self::InvalidAttributeValue { .. } => "invalid-attribute-value",
            Self::Located { .. } => unreachable!("kind unwraps location wrappers"),
        }
    }

    /// The authored HTML location, if an HTML source is available.
    pub fn location(&self) -> Option<ErrorLocation> {
        let context = self.context()?;
        let source = context.source.as_deref()?;
        let mut line = 1;
        let mut column = 1;
        let mut previous_cr = false;
        for ch in source[..context.range.start].chars() {
            match ch {
                '\r' => { line += 1; column = 1; }
                '\n' => { if !previous_cr { line += 1; } column = 1; }
                _ => column += ch.len_utf16(),
            }
            previous_cr = ch == '\r';
        }
        Some(ErrorLocation {
            line,
            column,
            length: source[context.range.clone()].encode_utf16().count(),
        })
    }

    /// The name of the authored `<f-template>`, when known.
    pub fn template_name(&self) -> Option<&str> {
        self.context()?.template_name.as_deref()
    }

    fn context(&self) -> Option<&ErrorContextData> {
        match self {
            Self::UnclosedElement { context, .. }
            | Self::UnclosedTag { context }
            | Self::MissingValueAttribute { context, .. }
            | Self::InvalidDirectiveValue { context, .. }
            | Self::InvalidRepeatExpression { context, .. }
            | Self::UnclosedBinding { context }
            | Self::EmptyBinding { context }
            | Self::UnsupportedFAttribute { context, .. }
            | Self::UnsupportedFElement { context, .. }
            | Self::UnsupportedExpression { context, .. }
            | Self::UnsupportedEventHandler { context, .. }
            | Self::UnsupportedEventContext { context, .. }
            | Self::ConflictingShadowRootMode { context, .. }
            | Self::UnsupportedPublisherAttribute { context, .. }
            | Self::InvalidAttributeValue { context, .. }
            | Self::Located { context, .. } => Some(&context.inner),
            _ => None,
        }
    }

    fn context_mut(&mut self) -> Option<&mut ErrorContextData> {
        match self {
            Self::UnclosedElement { context, .. }
            | Self::UnclosedTag { context }
            | Self::MissingValueAttribute { context, .. }
            | Self::InvalidDirectiveValue { context, .. }
            | Self::InvalidRepeatExpression { context, .. }
            | Self::UnclosedBinding { context }
            | Self::EmptyBinding { context }
            | Self::UnsupportedFAttribute { context, .. }
            | Self::UnsupportedFElement { context, .. }
            | Self::UnsupportedExpression { context, .. }
            | Self::UnsupportedEventHandler { context, .. }
            | Self::UnsupportedEventContext { context, .. }
            | Self::ConflictingShadowRootMode { context, .. }
            | Self::UnsupportedPublisherAttribute { context, .. }
            | Self::InvalidAttributeValue { context, .. }
            | Self::Located { context, .. } => Some(&mut context.inner),
            _ => None,
        }
    }

    pub(crate) fn at(mut self, source: &str, at: usize) -> Self {
        let mut location = template_context(source, at);
        if let Some(context) = self.context_mut() {
            location.inner.snippet = std::mem::take(&mut context.snippet);
            *context = *location.inner;
            self
        } else {
            Self::Located { error: Box::new(self), context: location }
        }
    }

    pub(crate) fn rebase(mut self, source: &str, offset: usize) -> Self {
        if let Some(context) = self.context_mut() {
            if context.source.is_some() {
                context.range = context.range.start + offset..context.range.end + offset;
                context.source = Some(source.to_string());
            }
        }
        self
    }

    pub(crate) fn original_open_tag(
        mut self, source: &str, original_end: usize, rewritten_end: usize,
    ) -> Self {
        if let Some(context) = self.context_mut() {
            context.range = if context.range.start >= rewritten_end {
                context.range.start - rewritten_end + original_end
                    ..context.range.end - rewritten_end + original_end
            } else {
                0..original_end
            };
            context.source = Some(source.to_string());
        }
        self
    }

    pub(crate) fn in_template(mut self, name: &str) -> Self {
        if let Some(context) = self.context_mut() {
            context.template_name = Some(name.to_string());
        }
        self
    }
}

impl fmt::Display for ConvertError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Located { error, .. } => error.fmt(f),
            Self::TypedUnsupportedForSyntax { syntax } => write!(f, "typed output is only supported for syntax 'fast-v3-ts', not '{syntax}'"),
            Self::TypeSourceUnsupportedForStylesheet => write!(f, "stylesheet conversion does not accept type-source or type-source-import"),
            Self::UnsupportedSyntax { syntax } => write!(
                f,
                "unsupported syntax '{syntax}': accepted values are {}",
                crate::syntax::accepted_syntax_names()
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
            Self::StylesheetUnsupportedForSyntax { syntax } => write!(
                f,
                "stylesheet conversion is not supported for syntax '{syntax}': only '{}' is supported",
                crate::syntax::fast_v3_ts::METADATA.name
            ),
            Self::InvalidExportName { name } => write!(
                f,
                "invalid export name '{name}': expected a valid TypeScript identifier"
            ),
            Self::TypeSourceUnsupportedForSyntax { syntax } => write!(
                f,
                "type-source is only supported for syntax 'fast-v3-ts', not '{syntax}'"
            ),
            Self::InvalidTypeSource { value } => write!(
                f,
                "invalid type-source '{value}': expected a dotted TypeScript identifier such as 'MyElement' or 'Namespace.MyElement'"
            ),
            Self::TypeSourceImportRequiresTypeSource => write!(
                f,
                "type-source-import requires type-source: provide the type name to import alongside the import module"
            ),
            Self::UnsupportedEventContext { value, context } => write!(
                f,
                "FAST event context '{value}' has no WebUI mapping — template: \"{context}\""
            ),
            Self::ConflictingShadowRootMode { publisher, inner, context } => write!(
                f,
                "conflicting shadow-root attributes: outer '<f-template>' declares '{publisher}' but inner '<template>' already declares '{inner}' — template: \"{context}\""
            ),
            Self::UnsupportedPublisherAttribute { attribute, context } => write!(
                f,
                "unsupported publisher attribute '{attribute}' on '<f-template>': only 'name' and 'shadowroot'-prefixed attributes are transferred — template: \"{context}\""
            ),
            Self::InvalidAttributeValue { attribute, value, context } => {
                let value = value.as_deref().unwrap_or("");
                write!(
                    f,
                    "invalid value '{value}' for attribute '{attribute}' — template: \"{context}\""
                )
            }
        }
    }
}

impl std::error::Error for ConvertError {}

/// Extract a short snippet of `template` around `at` for use in error messages.
pub(crate) fn template_context(template: &str, at: usize) -> ErrorContext {
    let tail = &template[at..];
    let highlight_end = if tail.starts_with('<') {
        crate::html::find_tag_end(template, at).unwrap_or(at + 1)
    } else if tail.starts_with("{{{") {
        tail[3..].find("}}}").map(|end| at + 3 + end + 3).unwrap_or(at + 3)
    } else if tail.starts_with("{{") {
        tail[2..].find("}}").map(|end| at + 2 + end + 2).unwrap_or(at + 2)
    } else {
        at + tail.chars().next().map(char::len_utf8).unwrap_or(0)
    };
    ErrorContext { inner: Box::new(ErrorContextData {
        snippet: template_snippet(template, at),
        source: Some(template.to_string()),
        range: at..highlight_end,
        template_name: None,
    }) }
}

pub(crate) fn template_snippet(template: &str, at: usize) -> String {
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
