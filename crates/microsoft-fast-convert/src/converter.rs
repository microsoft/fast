use crate::error::ConvertError;
use crate::html::parse_template_document;
use crate::syntax::{fast_v3_ts, is_valid_type_source, webui};
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
    }
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
}
