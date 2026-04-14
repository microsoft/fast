use wasm_bindgen::prelude::*;
use std::collections::HashMap;
use crate::{json, Locator, render_template, render_template_with_locator, render_entry_template_with_locator};
use crate::config::{RenderConfig, AttributeNameStrategy};
use crate::{render_template_with_locator_and_config, render_entry_template_with_locator_and_config};

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

/// Render the top-level **entry HTML** with custom element templates and a JSON state string.
/// Custom elements found at the root level of `entry` receive the full root state rather than
/// building their child state from HTML attributes. For `{{binding}}` attributes on root custom
/// elements, primitive results (`string`, `number`, and `bool`) are preserved in the rendered
/// output, while non-primitive values (`array`, `object`, `null`) are stripped.
///
/// `templates_json` is a JSON object mapping element names to their HTML template strings.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render_entry_with_templates(entry: &str, templates_json: &str, state: &str) -> Result<String, JsValue> {
    let templates = parse_templates_map(templates_json)?;
    let locator = Locator::from_templates(templates);
    render_entry_template_with_locator(entry, state, &locator)
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

fn parse_attribute_name_strategy(strategy: &str) -> Result<AttributeNameStrategy, JsValue> {
    match strategy {
        "" | "none" => Ok(AttributeNameStrategy::None),
        "camelCase" => Ok(AttributeNameStrategy::CamelCase),
        _ => Err(JsValue::from_str(&format!(
            "Invalid attribute-name-strategy '{}': expected 'none' or 'camelCase'",
            strategy
        ))),
    }
}

/// Render a FAST HTML template with custom element templates, a JSON state string,
/// and an `attribute-name-strategy` configuration.
/// `attribute_name_strategy` must be `"none"` or `"camelCase"`.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render_with_templates_and_config(
    entry: &str,
    templates_json: &str,
    state: &str,
    attribute_name_strategy: &str,
) -> Result<String, JsValue> {
    let templates = parse_templates_map(templates_json)?;
    let locator = Locator::from_templates(templates);
    let strategy = parse_attribute_name_strategy(attribute_name_strategy)?;
    let config = RenderConfig::new().with_attribute_name_strategy(strategy);
    render_template_with_locator_and_config(entry, state, &locator, &config)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Render the top-level **entry HTML** with custom element templates, a JSON state string,
/// and an `attribute-name-strategy` configuration.
/// `attribute_name_strategy` must be `"none"` or `"camelCase"`.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render_entry_with_templates_and_config(
    entry: &str,
    templates_json: &str,
    state: &str,
    attribute_name_strategy: &str,
) -> Result<String, JsValue> {
    let templates = parse_templates_map(templates_json)?;
    let locator = Locator::from_templates(templates);
    let strategy = parse_attribute_name_strategy(attribute_name_strategy)?;
    let config = RenderConfig::new().with_attribute_name_strategy(strategy);
    render_entry_template_with_locator_and_config(entry, state, &locator, &config)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}
