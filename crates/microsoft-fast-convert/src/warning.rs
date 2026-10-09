use std::fmt;

/// A non-fatal issue encountered while converting a FAST declarative
/// template. Unlike [`crate::ConvertError`], a warning does not abort
/// conversion: the offending construct is stripped from the output and
/// conversion continues.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ConvertWarning {
    /// A FAST directive has no equivalent in the target syntax and was
    /// removed from the output (`f-slotted`, `f-children`).
    StrippedUnsupportedDirective { directive: String, context: String },
}

impl fmt::Display for ConvertWarning {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::StrippedUnsupportedDirective { directive, context } => write!(
                f,
                "'{directive}' has no equivalent in the target syntax and was stripped — template: \"{context}\""
            ),
        }
    }
}

/// The result of a successful template conversion: the converted output
/// alongside any non-fatal warnings produced while converting it.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ConvertOutput {
    /// The converted template source.
    pub output: String,
    /// Non-fatal issues encountered while converting `output`.
    pub warnings: Vec<ConvertWarning>,
}

impl ConvertOutput {
    pub(crate) fn without_warnings(output: String) -> Self {
        Self {
            output,
            warnings: Vec::new(),
        }
    }
}
