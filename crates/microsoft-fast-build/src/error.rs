use std::fmt;

/// An error encountered while rendering a FAST HTML template.
#[derive(Debug)]
pub enum RenderError {
    /// Invalid stylesheet composition options or source mapping coordinates.
    InvalidComposition { message: String },
    /// Template metadata has an unsupported version, missing name or duplicate name.
    InvalidTemplateMetadata { message: String },
    /// A shadow-root render requested an element absent from its locator.
    UnknownTemplate { element: String },
    /// `{{expr` with no closing `}}`.
    UnclosedBinding { expr: String, context: ErrorContext },
    /// `{{{expr` with no closing `}}}`.
    UnclosedUnescapedBinding { expr: String, context: ErrorContext },
    /// `{{}}` — the expression between `{{` and `}}` is empty.
    EmptyBinding { context: ErrorContext },
    /// A required directive binding is not present in the provided state.
    MissingState { binding: String, context: ErrorContext },
    /// A directive (`<f-when>` / `<f-repeat>`) has no matching closing tag.
    UnclosedDirective { tag: String, context: ErrorContext },
    /// A directive is missing a valid `value="{{…}}"` attribute.
    MissingValueAttribute { tag: String, context: ErrorContext },
    /// `<f-repeat value="{{expr}}">` — expression is not in `item in list` format.
    InvalidRepeatExpression { expr: String, context: ErrorContext },
    /// `<f-repeat>` binding resolves to a value that is not a JSON array.
    NotAnArray { binding: String, context: ErrorContext },
    /// The state string passed to `render_template` is not valid JSON.
    JsonParse { message: String },
    /// Two or more template files resolve to the same element name.
    DuplicateTemplate { element: String, paths: Vec<String> },
    /// A template file could not be read from the filesystem.
    TemplateReadError { path: String, message: String },
    /// `compose_f_template_styles` input has no `<f-template>` element.
    MissingFTemplate,
    /// `compose_f_template_styles` input has more than one `<f-template>` element.
    MultipleFTemplates { count: usize },
    /// `compose_f_template_styles` input's `<f-template>` has no inner `<template>` element.
    MissingInnerTemplate,
    /// `compose_f_template_styles` input's `<f-template>` has more than one inner `<template>` element.
    MultipleInnerTemplates { count: usize },
    /// `compose_f_template_styles` CSS contains a case-insensitive `</style` raw-text terminator.
    UnsafeStyleContent { context: ErrorContext },
    /// A validation error annotated with its authored HTML location.
    Located { error: Box<RenderError>, context: ErrorContext },
}

/// One-based UTF-16 coordinates and a UTF-16 highlight length.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ErrorLocation {
    pub line: usize,
    pub column: usize,
    pub length: usize,
}

/// The original message snippet plus source provenance, allocated only on failure.
#[derive(Debug)]
pub struct ErrorContext {
    // Keep diagnostic metadata out of the successful Result's stack footprint.
    inner: Box<ErrorContextData>,
}

#[derive(Debug)]
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

impl RenderError {
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
            Self::InvalidComposition { .. } => "invalid-composition",
            Self::InvalidTemplateMetadata { .. } => "invalid-template-metadata",
            Self::UnknownTemplate { .. } => "missing-template",
            Self::UnclosedBinding { .. } => "unclosed-binding",
            Self::UnclosedUnescapedBinding { .. } => "unclosed-unescaped-binding",
            Self::EmptyBinding { .. } => "empty-binding",
            Self::MissingState { .. } => "missing-state",
            Self::UnclosedDirective { .. } => "unclosed-directive",
            Self::MissingValueAttribute { .. } => "missing-value-attribute",
            Self::InvalidRepeatExpression { .. } => "invalid-repeat-expression",
            Self::NotAnArray { .. } => "repeat-not-array",
            Self::JsonParse { .. } => "invalid-state-json",
            Self::DuplicateTemplate { .. } => "duplicate-template",
            Self::TemplateReadError { .. } => "template-read-error",
            Self::MissingFTemplate => "missing-f-template",
            Self::MultipleFTemplates { .. } => "multiple-f-templates",
            Self::MissingInnerTemplate => "missing-inner-template",
            Self::MultipleInnerTemplates { .. } => "multiple-inner-templates",
            Self::UnsafeStyleContent { .. } => "unsafe-style-content",
            Self::Located { .. } => unreachable!("kind unwraps location wrappers"),
        }
    }

    /// The authored location, if a source is available. Check `source_kind()`.
    pub fn location(&self) -> Option<ErrorLocation> {
        let context = self.context()?;
        let source = context.source.as_deref()?;
        let mut locations = crate::binding_metadata::SourceLocations::new(source);
        let start = locations.position(context.range.start);
        let end = locations.position(context.range.end);
        Some(ErrorLocation {
            line: start.line,
            column: start.column,
            length: end.offset - start.offset,
        })
    }

    /// The input owning the diagnostic; CSS errors never claim HTML coordinates.
    pub fn source_kind(&self) -> Option<&'static str> {
        if self.context()?.source.is_none() {
            return None;
        }
        Some(if matches!(self.kind(), Self::UnsafeStyleContent { .. }) { "css" } else { "html" })
    }

    /// The separately supplied template containing the error, when known.
    pub fn template_name(&self) -> Option<&str> {
        match self.kind() {
            Self::UnknownTemplate { element } => Some(element),
            _ => self.context()?.template_name.as_deref(),
        }
    }

    fn context(&self) -> Option<&ErrorContextData> {
        match self {
            Self::UnclosedBinding { context, .. }
            | Self::UnclosedUnescapedBinding { context, .. }
            | Self::EmptyBinding { context }
            | Self::MissingState { context, .. }
            | Self::UnclosedDirective { context, .. }
            | Self::MissingValueAttribute { context, .. }
            | Self::InvalidRepeatExpression { context, .. }
            | Self::NotAnArray { context, .. }
            | Self::UnsafeStyleContent { context }
            | Self::Located { context, .. } => Some(&context.inner),
            _ => None,
        }
    }

    fn context_mut(&mut self) -> Option<&mut ErrorContextData> {
        match self {
            Self::UnclosedBinding { context, .. }
            | Self::UnclosedUnescapedBinding { context, .. }
            | Self::EmptyBinding { context }
            | Self::MissingState { context, .. }
            | Self::UnclosedDirective { context, .. }
            | Self::MissingValueAttribute { context, .. }
            | Self::InvalidRepeatExpression { context, .. }
            | Self::NotAnArray { context, .. }
            | Self::UnsafeStyleContent { context }
            | Self::Located { context, .. } => Some(&mut context.inner),
            _ => None,
        }
    }

    pub(crate) fn at(self, source: &str, at: usize) -> Self {
        Self::Located { error: Box::new(self), context: template_context(source, at) }
    }

    pub(crate) fn rebase(mut self, source: &str, offset: usize) -> Self {
        if let Some(context) = self.context_mut() {
            if context.template_name.is_none() && context.source.is_some() {
                context.range = context.range.start + offset..context.range.end + offset;
                context.source = Some(source.to_string());
            }
        }
        self
    }

    pub(crate) fn authored(mut self, source: &str) -> Self {
        if let Some(context) = self.context_mut() {
            if context.template_name.is_none() {
                if let Some(escaped) = &context.source {
                    let start = crate::code_escape::authored_offset(source, escaped, context.range.start);
                    let end = crate::code_escape::authored_offset(source, escaped, context.range.end);
                    context.range = start..end;
                    context.source = Some(source.to_string());
                }
            }
        }
        self
    }

    pub(crate) fn in_template(mut self, name: &str) -> Self {
        if let Some(context) = self.context_mut() {
            if context.template_name.is_none() {
                context.template_name = Some(name.to_string());
            }
        }
        self
    }
}

impl fmt::Display for RenderError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidComposition { message } => write!(f, "invalid composition: {message}"),
            Self::Located { error, .. } => error.fmt(f),
            Self::InvalidTemplateMetadata { message } => write!(f, "invalid template metadata: {message}"),
            Self::UnknownTemplate { element } => write!(f, "unknown template: no definition for '<{element}>'"),
            Self::UnclosedBinding { expr, context } => write!(
                f,
                "unclosed binding '{{{{{}': \
                 no closing '}}}}' found to end the expression \
                 — template: \"{context}\"",
                expr
            ),
            Self::UnclosedUnescapedBinding { expr, context } => write!(
                f,
                "unclosed unescaped binding '{{{{{{{expr}': \
                 no closing '}}}}}}' found to end the expression \
                 — template: \"{context}\""
            ),
            Self::EmptyBinding { context } => write!(
                f,
                "empty binding '{{{{}}}}': \
                 the expression between '{{{{' and '}}}}' cannot be empty \
                 — template: \"{context}\""
            ),
            Self::MissingState { binding, context } => write!(
                f,
                "missing state: '{{{{{}}}}}' has no matching key in the provided state \
                 — template: \"{context}\"",
                binding
            ),
            Self::UnclosedDirective { tag, context } => write!(
                f,
                "unclosed directive '<{tag}>': \
                 no matching '</{tag}>' closing tag was found \
                 — template: \"{context}\""
            ),
            Self::MissingValueAttribute { tag, context } => write!(
                f,
                "directive '<{tag}>' is missing a valid 'value=\"{{{{…}}}}\"' attribute \
                 — template: \"{context}\""
            ),
            Self::InvalidRepeatExpression { expr, context } => write!(
                f,
                "invalid repeat expression '{{{{{}}}}}': \
                 expected 'item in list' format \
                 — template: \"{context}\"",
                expr
            ),
            Self::NotAnArray { binding, context } => write!(
                f,
                "type error: '{{{{{}}}}}' must resolve to a JSON array for use in <f-repeat> \
                 — template: \"{context}\"",
                binding
            ),
            Self::JsonParse { message } => write!(
                f,
                "failed to parse state JSON: {message}"
            ),
            Self::DuplicateTemplate { element, paths } => write!(
                f,
                "duplicate template: element '<{element}>' is defined in multiple files: {}",
                paths.join(", ")
            ),
            Self::TemplateReadError { path, message } => write!(
                f,
                "template read error: could not read '{path}': {message}"
            ),
            Self::MissingFTemplate => write!(
                f,
                "template validation error: expected exactly one '<f-template>' element"
            ),
            Self::MultipleFTemplates { count } => write!(
                f,
                "template validation error: expected exactly one '<f-template>' element, found {count}"
            ),
            Self::MissingInnerTemplate => write!(
                f,
                "template validation error: '<f-template>' must contain exactly one inner '<template>' element"
            ),
            Self::MultipleInnerTemplates { count } => write!(
                f,
                "template validation error: '<f-template>' must contain exactly one inner '<template>' element, found {count}"
            ),
            Self::UnsafeStyleContent { context } => write!(
                f,
                "unsafe style content: css contains a '</style' raw-text terminator sequence \
                 — css: \"{context}\""
            ),
        }
    }
}

impl std::error::Error for RenderError {}

/// Extract a short snippet of `template` around `at` for use in error messages.
/// Includes up to 20 characters before `at` for surrounding context.
pub(crate) fn template_context(template: &str, at: usize) -> ErrorContext {
    const PRE: usize = 20;
    const POST: usize = 60;

    // Walk start back to a UTF-8 boundary.
    let mut start = at.saturating_sub(PRE);
    while start > 0 && !template.is_char_boundary(start) {
        start -= 1;
    }
    // Walk end forward to a UTF-8 boundary.
    let mut end = (at + POST).min(template.len());
    while end < template.len() && !template.is_char_boundary(end) {
        end += 1;
    }

    let prefix = if start > 0 { "…" } else { "" };
    let suffix = if end < template.len() { "…" } else { "" };
    let tail = &template[at..];
    let highlight_end = if tail.starts_with('<') {
        crate::attribute::find_tag_end(template, at).unwrap_or(at + 1)
    } else if tail.starts_with("{{{") {
        tail[3..].find("}}}").map(|end| at + 3 + end + 3).unwrap_or(at + 3)
    } else if tail.starts_with("{{") {
        tail[2..].find("}}").map(|end| at + 2 + end + 2).unwrap_or(at + 2)
    } else {
        at + tail.chars().next().map(char::len_utf8).unwrap_or(0)
    };
    ErrorContext { inner: Box::new(ErrorContextData {
        snippet: format!("{prefix}{}{suffix}", &template[start..end]),
        source: Some(template.to_string()),
        range: at..highlight_end,
        template_name: None,
    }) }
}

/// Truncate `s` to at most `max` chars, appending `…` if truncated.
pub(crate) fn truncate(s: &str, max: usize) -> String {
    let mut chars = s.chars();
    let mut out: String = chars.by_ref().take(max).collect();
    if chars.next().is_some() {
        out.push('…');
    }
    out
}
