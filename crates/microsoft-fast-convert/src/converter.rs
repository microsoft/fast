use crate::error::ConvertError;
use crate::html::parse_template_document;
use crate::syntax::{fast_v3_ts, webui};

pub(crate) fn convert(template: &str, syntax: &str) -> Result<String, ConvertError> {
    let syntax = Syntax::parse(syntax)?;
    let parsed = parse_template_document(template)?;

    match syntax {
        Syntax::WebuiPrerelease => webui::convert(&parsed.template),
        Syntax::FastV3Ts => fast_v3_ts::convert(&parsed.template),
    }
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
