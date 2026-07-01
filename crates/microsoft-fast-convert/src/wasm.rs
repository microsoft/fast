use wasm_bindgen::prelude::*;

/// Convert one FAST declarative template string to the requested syntax.
#[wasm_bindgen]
pub fn convert_template(template: &str, syntax: &str) -> Result<String, JsValue> {
    crate::convert_template(template, syntax).map_err(|error| JsValue::from_str(&error.to_string()))
}

/// Return JSON metadata for all supported syntax targets.
#[wasm_bindgen]
pub fn convert_syntax_metadata() -> String {
    crate::syntax_metadata_json()
}
