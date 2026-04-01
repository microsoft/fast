use wasm_bindgen::prelude::*;
use std::collections::HashMap;
use crate::{json, Locator, render_template, render_template_with_locator};

/// Render a FAST HTML template with a JSON state string.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render(entry: &str, state: &str) -> Result<String, JsValue> {
    render_template(entry, state).map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Render a FAST HTML template with custom element templates and a JSON state string.
/// `templates_json` is a JSON object mapping element names to their HTML template strings,
/// e.g. `{"my-button": "<template>...</template>"}`.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render_with_templates(entry: &str, templates_json: &str, state: &str) -> Result<String, JsValue> {
    let templates = parse_templates_map(templates_json)?;
    let locator = Locator::from_templates(templates);
    render_template_with_locator(entry, state, &locator)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

fn parse_templates_map(templates_json: &str) -> Result<HashMap<String, String>, JsValue> {
    let parsed = json::parse(templates_json)
        .map_err(|e| JsValue::from_str(&format!("Failed to parse templates JSON: {}", e.message)))?;
    match parsed {
        json::JsonValue::Object(obj) => {
            let mut map = HashMap::new();
            for (k, v) in obj {
                match v {
                    json::JsonValue::String(s) => { map.insert(k, s); }
                    _ => return Err(JsValue::from_str(&format!(
                        "Template value for '{}' must be a string", k
                    ))),
                }
            }
            Ok(map)
        }
        _ => Err(JsValue::from_str("Templates must be a JSON object")),
    }
}
