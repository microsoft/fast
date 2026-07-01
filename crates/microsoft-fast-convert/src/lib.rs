//! # microsoft-fast-convert
//!
//! Converts one FAST declarative HTML `<f-template>` string into either WebUI
//! prerelease template HTML or FAST v3 TypeScript template source. The converter
//! uses a focused hand scanner rather than constructing a DOM or depending on an
//! HTML parser.

mod converter;
mod error;
mod expression;
mod html;
mod syntax;
#[cfg(target_arch = "wasm32")]
mod wasm;

pub use error::ConvertError;

/// Convert a FAST declarative template string to the requested syntax.
///
/// Supported syntax values are `webui-prerelease` and `fast-v3-ts`.
pub fn convert_template(template: &str, syntax: &str) -> Result<String, ConvertError> {
    converter::convert(template, syntax)
}
