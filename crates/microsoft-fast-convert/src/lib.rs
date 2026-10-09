//! # microsoft-fast-convert
//!
//! Converts one FAST declarative HTML `<f-template>` string into WebUI
//! prerelease template HTML, or FAST v3 TypeScript template source. The
//! converter uses a focused hand scanner rather than constructing a DOM or
//! depending on an HTML parser.
//!
//! The `webui-prerelease` target emits HTML for WebUI's native shadow-DOM
//! runtime — note that the WebUI Framework itself is currently a prerelease,
//! hence the target's name. FAST directives with no WebUI equivalent
//! (`f-slotted`, `f-children`) are stripped from the output rather than
//! causing conversion to fail; [`ConvertOutput::warnings`] reports each one
//! that was removed.

mod converter;
mod error;
mod expression;
mod html;
mod syntax;
mod warning;
#[cfg(target_arch = "wasm32")]
mod wasm;

pub use error::ConvertError;
pub use syntax::SyntaxMetadata;
pub use warning::{ConvertOutput, ConvertWarning};

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
/// Supported syntax values are `webui-prerelease` and `fast-v3-ts`. Returns
/// the converted output alongside any non-fatal [`ConvertWarning`]s, such as
/// a stripped `f-slotted`/`f-children` directive.
pub fn convert_template(template: &str, syntax: &str) -> Result<ConvertOutput, ConvertError> {
    convert_template_with_options(template, syntax, &ConvertOptions::default())
}

/// Convert a FAST declarative template string to the requested syntax, with
/// additional output options.
///
/// Supported syntax values are `webui-prerelease` and `fast-v3-ts`. Returns
/// the converted output alongside any non-fatal [`ConvertWarning`]s, such as
/// a stripped `f-slotted`/`f-children` directive.
pub fn convert_template_with_options(
    template: &str,
    syntax: &str,
    options: &ConvertOptions,
) -> Result<ConvertOutput, ConvertError> {
    converter::convert(template, syntax, options)
}

/// Convert a CSS stylesheet string to the requested syntax, exporting it as
/// `export_name`.
///
/// Only `fast-v3-ts` supports CSS conversion. `export_name` must be a valid
/// TypeScript/JavaScript identifier (no dotted paths). The generated module
/// imports `css` from `@microsoft/fast-element` and exports `export_name` as a
/// `css` tagged template, with the stylesheet content escaped for safe
/// embedding in a TypeScript template literal.
pub fn convert_stylesheet(
    stylesheet: &str,
    syntax: &str,
    export_name: &str,
) -> Result<String, ConvertError> {
    converter::convert_stylesheet(stylesheet, syntax, export_name)
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
