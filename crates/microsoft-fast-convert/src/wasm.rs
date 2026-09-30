use wasm_bindgen::prelude::*;

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

/// Return JSON metadata for all supported syntax targets.
#[wasm_bindgen]
pub fn convert_syntax_metadata() -> String {
    crate::syntax_metadata_json()
}
