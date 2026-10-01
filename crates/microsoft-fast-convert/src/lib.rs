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
pub use syntax::SyntaxMetadata;

/// Options that adjust the shape of converted output.
///
/// `type_source` and `type_source_import` are only meaningful for the
/// `fast-v3-ts` syntax target; supplying either for another syntax is a
/// [`ConvertError::TypeSourceUnsupportedForSyntax`] error.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct ConvertOptions {
    /// Explicit `TSource` type name emitted as `html<TypeSource>` in
    /// `fast-v3-ts` output. Must be a simple dotted identifier
    /// (e.g. `MyElement` or `Namespace.MyElement`).
    pub type_source: Option<String>,
    /// Module specifier for an `import type { <type_source> } from "…";`
    /// statement emitted alongside `type_source`. Requires `type_source`.
    pub type_source_import: Option<String>,
}

/// Convert a FAST declarative template string to the requested syntax.
///
/// Supported syntax values are `webui-prerelease` and `fast-v3-ts`.
pub fn convert_template(template: &str, syntax: &str) -> Result<String, ConvertError> {
    convert_template_with_options(template, syntax, &ConvertOptions::default())
}

/// Convert a FAST declarative template string to the requested syntax, with
/// additional output options.
///
/// Supported syntax values are `webui-prerelease` and `fast-v3-ts`.
pub fn convert_template_with_options(
    template: &str,
    syntax: &str,
    options: &ConvertOptions,
) -> Result<String, ConvertError> {
    converter::convert(template, syntax, options)
}

/// Metadata for all supported converter syntax targets.
pub fn syntax_metadata() -> &'static [SyntaxMetadata] {
    syntax::syntax_metadata()
}

/// JSON metadata for supported converter syntax targets.
///
/// This is intentionally hand-written to avoid adding a serialization
/// dependency to the crate.
pub fn syntax_metadata_json() -> String {
    syntax::syntax_metadata_json()
}
