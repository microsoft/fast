use wasm_bindgen::prelude::*;

use crate::ConvertOptions;

/// Convert one FAST declarative template string to the requested syntax.
#[wasm_bindgen]
pub fn convert_template(template: &str, syntax: &str) -> Result<String, JsValue> {
    crate::convert_template(template, syntax).map_err(|error| JsValue::from_str(&error.to_string()))
}

/// Convert a CSS stylesheet string to the requested syntax, exporting it as `export_name`.
#[wasm_bindgen]
pub fn convert_stylesheet(
    stylesheet: &str,
    syntax: &str,
    export_name: &str,
) -> Result<String, JsValue> {
    crate::convert_stylesheet(stylesheet, syntax, export_name)
        .map_err(|error| JsValue::from_str(&error.to_string()))
}

/// Convert one FAST declarative template string to the requested syntax,
/// optionally emitting an explicit `TSource` generic (`type_source`) and a
/// matching `import type` statement (`type_source_import`) for `fast-v3-ts`
/// output. Both are only honored for the `fast-v3-ts` syntax; `type_source`
/// must be provided when `type_source_import` is.
#[wasm_bindgen]
pub fn convert_template_with_options(
    template: &str,
    syntax: &str,
    type_source: Option<String>,
    type_source_import: Option<String>,
) -> Result<String, JsValue> {
    let options = ConvertOptions {
        type_source,
        type_source_import,
    };
    crate::convert_template_with_options(template, syntax, &options)
        .map_err(|error| JsValue::from_str(&error.to_string()))
}

/// Return JSON metadata for all supported syntax targets.
#[wasm_bindgen]
pub fn convert_syntax_metadata() -> String {
    crate::syntax_metadata_json()
}
