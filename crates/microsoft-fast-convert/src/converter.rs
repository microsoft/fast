use crate::error::ConvertError;
use crate::html::parse_template_document;
use crate::syntax::{fast_v3_ts, is_valid_identifier, webui};

pub(crate) fn convert(template: &str, syntax: &str) -> Result<String, ConvertError> {
    let syntax = Syntax::parse(syntax)?;
    let parsed = parse_template_document(template)?;

    match syntax {
        Syntax::WebuiPrerelease => webui::convert(&parsed.template),
        Syntax::FastV3Ts => fast_v3_ts::convert(&parsed.template),
    }
}

/// Convert a CSS stylesheet string to the requested syntax, exporting `export_name`.
///
/// Only `fast-v3-ts` supports CSS conversion; other syntax values are rejected with
/// [`ConvertError::StylesheetUnsupportedForSyntax`].
pub(crate) fn convert_stylesheet(
    stylesheet: &str,
    syntax: &str,
    export_name: &str,
) -> Result<String, ConvertError> {
    let syntax = Syntax::parse(syntax)?;

    if syntax != Syntax::FastV3Ts {
        return Err(ConvertError::StylesheetUnsupportedForSyntax {
            syntax: syntax.name().to_string(),
        });
    }

    if !is_valid_identifier(export_name) {
        return Err(ConvertError::InvalidExportName {
            name: export_name.to_string(),
        });
    }

    Ok(fast_v3_ts::convert_stylesheet(stylesheet, export_name))
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Syntax {
    WebuiPrerelease,
    FastV3Ts,
}

impl Syntax {
    fn parse(value: &str) -> Result<Self, ConvertError> {
        match value {
            value if value == webui::METADATA.name => Ok(Self::WebuiPrerelease),
            value if value == fast_v3_ts::METADATA.name => Ok(Self::FastV3Ts),
            _ => Err(ConvertError::UnsupportedSyntax {
                syntax: value.to_string(),
            }),
        }
    }

    fn name(&self) -> &'static str {
        match self {
            Self::WebuiPrerelease => webui::METADATA.name,
            Self::FastV3Ts => fast_v3_ts::METADATA.name,
        }
    }
}
