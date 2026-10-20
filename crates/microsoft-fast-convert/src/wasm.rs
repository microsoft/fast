use wasm_bindgen::prelude::*;

use crate::ConvertOptions;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = Error)]
    type JavaScriptError;
    #[wasm_bindgen(constructor, js_class = Error)]
    fn new(message: &str) -> JavaScriptError;
    #[wasm_bindgen(method, setter)]
    fn set_code(this: &JavaScriptError, value: &str);
    #[wasm_bindgen(method, setter)]
    fn set_line(this: &JavaScriptError, value: usize);
    #[wasm_bindgen(method, setter)]
    fn set_column(this: &JavaScriptError, value: usize);
    #[wasm_bindgen(method, setter)]
    fn set_length(this: &JavaScriptError, value: usize);
    #[wasm_bindgen(method, setter, js_name = templateName)]
    fn set_template_name(this: &JavaScriptError, value: &str);
}

fn convert_error(error: crate::ConvertError) -> JsValue {
    let result = JavaScriptError::new(&error.to_string());
    result.set_code(error.code());
    if let Some(location) = error.location() {
        result.set_line(location.line);
        result.set_column(location.column);
        result.set_length(location.length);
    }
    if let Some(name) = error.template_name() {
        result.set_template_name(name);
    }
    result.into()
}

#[wasm_bindgen(typescript_custom_section)]
const ERROR_TYPES: &str = r#"
/** A thrown Error with a stable code and optional authored HTML coordinates. */
export interface FastBuildError extends Error {
    code: string;
    /** One-based line; CRLF is one break, as are lone CR and LF. */
    line?: number;
    /** One-based UTF-16 column; tabs count as one code unit. */
    column?: number;
    /** UTF-16 highlight length, in the same source as line and column. */
    length?: number;
    templateName?: string;
}
"#;

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
        .map_err(convert_error)
}

/// Convert a CSS stylesheet string to the requested syntax, exporting it as `export_name`.
#[wasm_bindgen]
pub fn convert_stylesheet(
    stylesheet: &str,
    syntax: &str,
    export_name: &str,
    typed: Option<bool>,
) -> Result<String, JsValue> {
    crate::convert_stylesheet_with_options(
        stylesheet,
        syntax,
        export_name,
        &ConvertOptions { typed: typed.unwrap_or(false), ..ConvertOptions::default() },
    )
        .map_err(convert_error)
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
    typed: Option<bool>,
) -> Result<ConvertResult, JsValue> {
    let options = ConvertOptions {
        typed: typed.unwrap_or(false),
        type_source,
        type_source_import,
    };
    crate::convert_template_with_options(template, syntax, &options)
        .map(ConvertResult::from)
        .map_err(convert_error)
}

/// Return JSON metadata for all supported syntax targets.
#[wasm_bindgen]
pub fn convert_syntax_metadata() -> String {
    crate::syntax_metadata_json()
}
