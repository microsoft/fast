use std::fmt;

/// An error encountered while rendering a FAST HTML template.
#[derive(Debug)]
pub enum RenderError {
    /// `{{expr` with no closing `}}`.
    UnclosedBinding { expr: String, context: String },
    /// `{{{expr` with no closing `}}}`.
    UnclosedUnescapedBinding { expr: String, context: String },
    /// `{{}}` — the expression between `{{` and `}}` is empty.
    EmptyBinding { context: String },
    /// A required directive binding is not present in the provided state.
    MissingState { binding: String, context: String },
    /// A directive (`<f-when>` / `<f-repeat>`) has no matching closing tag.
    UnclosedDirective { tag: String, context: String },
    /// A directive is missing a valid `value="{{…}}"` attribute.
    MissingValueAttribute { tag: String, context: String },
    /// `<f-repeat value="{{expr}}">` — expression is not in `item in list` format.
    InvalidRepeatExpression { expr: String, context: String },
    /// `<f-repeat>` binding resolves to a value that is not a JSON array.
    NotAnArray { binding: String, context: String },
    /// The state string passed to `render_template` is not valid JSON.
    JsonParse { message: String },
    /// Two or more template files resolve to the same element name.
    DuplicateTemplate { element: String, paths: Vec<String> },
    /// A template file could not be read from the filesystem.
    TemplateReadError { path: String, message: String },
}

impl fmt::Display for RenderError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
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
        }
    }
}

impl std::error::Error for RenderError {}

/// Extract a short snippet of `template` around `at` for use in error messages.
/// Includes up to 20 characters before `at` for surrounding context.
pub(crate) fn template_context(template: &str, at: usize) -> String {
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
    format!("{prefix}{}{suffix}", &template[start..end])
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
