use crate::error::ConvertError;
use crate::html::parse_template_document;
use crate::syntax::{fast_v3_ts, is_valid_identifier, is_valid_type_source, webui, webui_native};
use crate::ConvertOptions;

pub(crate) fn convert(
    template: &str,
    syntax: &str,
    options: &ConvertOptions,
) -> Result<String, ConvertError> {
    let syntax_kind = Syntax::parse(syntax)?;
    validate_options(syntax, syntax_kind, options)?;
    let parsed = parse_template_document(template)?;

    match syntax_kind {
        Syntax::WebuiPrerelease => webui::convert(&parsed.template),
        Syntax::FastV3Ts => fast_v3_ts::convert(&parsed.template, options),
        Syntax::WebuiNative => webui_native::convert(&parsed),
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

fn validate_options(
    syntax: &str,
    syntax_kind: Syntax,
    options: &ConvertOptions,
) -> Result<(), ConvertError> {
    if options.type_source_import.is_some() && options.type_source.is_none() {
        return Err(ConvertError::TypeSourceImportRequiresTypeSource);
    }

    if let Some(type_source) = options.type_source.as_deref() {
        if syntax_kind != Syntax::FastV3Ts {
            return Err(ConvertError::TypeSourceUnsupportedForSyntax {
                syntax: syntax.to_string(),
            });
        }

        if !is_valid_type_source(type_source) {
            return Err(ConvertError::InvalidTypeSource {
                value: type_source.to_string(),
            });
        }
    }

    Ok(())
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Syntax {
    WebuiPrerelease,
    FastV3Ts,
    WebuiNative,
}

impl Syntax {
    fn parse(value: &str) -> Result<Self, ConvertError> {
        match value {
            value if value == webui::METADATA.name => Ok(Self::WebuiPrerelease),
            value if value == fast_v3_ts::METADATA.name => Ok(Self::FastV3Ts),
            value if value == webui_native::METADATA.name => Ok(Self::WebuiNative),
            _ => Err(ConvertError::UnsupportedSyntax {
                syntax: value.to_string(),
            }),
        }
    }

    fn name(&self) -> &'static str {
        match self {
            Self::WebuiPrerelease => webui::METADATA.name,
            Self::FastV3Ts => fast_v3_ts::METADATA.name,
            Self::WebuiNative => webui_native::METADATA.name,
        }
    }
}
