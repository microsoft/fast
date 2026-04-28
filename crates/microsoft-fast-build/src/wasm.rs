use wasm_bindgen::prelude::*;
use std::collections::HashMap;
use crate::{
    json, Locator, render_entry_template_with_locator, render_entry_with_locator_without_state,
    render_template, render_template_with_locator, render_template_without_state,
    render_with_locator_without_state,
};
use crate::config::{RenderConfig, AttributeNameStrategy};

/// Render a FAST HTML template with an optional JSON state string.
/// Omitted state is treated as an empty object.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render(entry: &str, state: Option<String>) -> Result<String, JsValue> {
    match state {
        Some(state) => render_template(entry, &state, None),
        None => render_template_without_state(entry, None),
    }
    .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Render a FAST HTML template with custom element templates and an optional JSON state string.
/// Omitted state is treated as an empty object.
/// `templates_json` is a JSON object mapping element names to their HTML template strings,
/// e.g. `{"my-button": "<template>...</template>"}`.
/// `attribute_name_strategy` controls attribute-to-property mapping: `"camelCase"` (default)
/// or `"none"`. Pass an empty string for the default.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render_with_templates(entry: &str, templates_json: &str, state: Option<String>, attribute_name_strategy: Option<String>) -> Result<String, JsValue> {
    let templates = parse_templates_map(templates_json)?;
    let locator = Locator::from_templates(templates);
    let config = build_config(attribute_name_strategy.as_deref())?;
    match state {
        Some(state) => render_template_with_locator(entry, &state, &locator, config.as_ref()),
        None => render_with_locator_without_state(entry, &locator, config.as_ref()),
    }
    .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Render the top-level **entry HTML** with custom element templates and an optional JSON state string.
/// Omitted state is treated as an empty object.
/// Custom elements found at the root level of `entry` build child state from the full root
/// state with HTML attributes overlaid on top. For `{{binding}}` attributes on root custom
/// elements, primitive results (`string`, `number`, and `bool`) are preserved in the rendered
/// output, while missing and non-primitive values (`array`, `object`, `null`) are stripped.
///
/// `templates_json` is a JSON object mapping element names to their HTML template strings.
/// `attribute_name_strategy` controls attribute-to-property mapping: `"camelCase"` (default)
/// or `"none"`. Pass an empty string for the default.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render_entry_with_templates(entry: &str, templates_json: &str, state: Option<String>, attribute_name_strategy: Option<String>) -> Result<String, JsValue> {
    let templates = parse_templates_map(templates_json)?;
    let locator = Locator::from_templates(templates);
    let config = build_config(attribute_name_strategy.as_deref())?;
    match state {
        Some(state) => render_entry_template_with_locator(entry, &state, &locator, config.as_ref()),
        None => render_entry_with_locator_without_state(entry, &locator, config.as_ref()),
    }
    .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Parse all `<f-template>` elements from an HTML string.
/// Returns a JSON array of `{"name": string | null, "content": string}` objects,
/// one per `<f-template>` element found. `name` is `null` when the element has
/// no `name` attribute.
#[wasm_bindgen]
pub fn parse_f_templates(html: &str) -> String {
    let templates = crate::locator::parse_f_templates(html);
    let mut parts = Vec::with_capacity(templates.len());
    for (name_opt, content) in templates {
        let name_json = match name_opt {
            Some(n) => format!("\"{}\"", escape_json_str(&n)),
            None => "null".to_string(),
        };
        parts.push(format!(
            "{{\"name\":{},\"content\":\"{}\"}}",
            name_json,
            escape_json_str(&content)
        ));
    }
    format!("[{}]", parts.join(","))
}

fn escape_json_str(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '"'  => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            c    => out.push(c),
        }
    }
    out
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

/// Build an `Option<RenderConfig>` from the optional strategy string.
/// Returns `None` for omitted, `""`, or `"camelCase"`; `Some(config)` for `"none"`.
fn build_config(strategy: Option<&str>) -> Result<Option<RenderConfig>, JsValue> {
    let strategy = strategy.unwrap_or("");
    match strategy {
        "" | "camelCase" => Ok(None),
        "none" => Ok(Some(
            RenderConfig::new().with_attribute_name_strategy(AttributeNameStrategy::None),
        )),
        _ => Err(JsValue::from_str(&format!(
            "Invalid attribute-name-strategy '{}': expected 'none' or 'camelCase'",
            strategy
        ))),
    }
}
