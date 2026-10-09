use wasm_bindgen::prelude::*;

use crate::ConvertOptions;

/// The wasm-facing result of a successful template conversion: the converted
/// `output` string alongside any non-fatal `warnings` (each formatted as a
/// human-readable message) produced while converting it.
#[wasm_bindgen]
pub struct ConvertResult {
    output: String,
    warnings: Vec<String>,
}

#[wasm_bindgen]
impl ConvertResult {
    #[wasm_bindgen(getter)]
    pub fn output(&self) -> String {
        self.output.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn warnings(&self) -> Vec<String> {
        self.warnings.clone()
    }
}

impl From<crate::ConvertOutput> for ConvertResult {
    fn from(value: crate::ConvertOutput) -> Self {
        Self {
            output: value.output,
            warnings: value.warnings.iter().map(ToString::to_string).collect(),
        }
    }
}

/// Convert one FAST declarative template string to the requested syntax.
#[wasm_bindgen]
pub fn convert_template(template: &str, syntax: &str) -> Result<ConvertResult, JsValue> {
    crate::convert_template(template, syntax)
        .map(ConvertResult::from)
        .map_err(|error| JsValue::from_str(&error.to_string()))
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
) -> Result<ConvertResult, JsValue> {
    let options = ConvertOptions {
        type_source,
        type_source_import,
    };
    crate::convert_template_with_options(template, syntax, &options)
        .map(ConvertResult::from)
        .map_err(|error| JsValue::from_str(&error.to_string()))
}

/// Return JSON metadata for all supported syntax targets.
#[wasm_bindgen]
pub fn convert_syntax_metadata() -> String {
    crate::syntax_metadata_json()
}
