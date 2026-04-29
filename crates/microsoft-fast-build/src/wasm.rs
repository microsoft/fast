use crate::config::{AttributeNameStrategy, RenderConfig};
use crate::{
    json, render_entry_template_with_locator, render_entry_template_with_locator_without_state,
    render_template, render_template_with_locator, render_template_with_locator_without_state,
    render_template_without_state, Locator,
};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

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
///
/// This preserves the original non-entry rendering semantics for this export.
/// Use `render_entry_with_templates` for top-level entry HTML rendering.
///
/// `templates_json` is a JSON object mapping element names to their HTML template strings,
/// e.g. `{"my-button": "<template>...</template>"}`, or template metadata objects.
/// `attribute_name_strategy` controls attribute-to-property mapping: `"camelCase"` (default)
/// or `"none"`. Pass an empty string for the default.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render_with_templates(
    entry: &str,
    templates_json: &str,
    state: Option<String>,
    attribute_name_strategy: Option<String>,
) -> Result<String, JsValue> {
    let templates = parse_templates_map(templates_json)?;
    let locator = Locator::from_template_definitions(templates);
    let config = build_config(attribute_name_strategy.as_deref())?;
    match state {
        Some(state) => render_template_with_locator(entry, &state, &locator, config.as_ref()),
        None => render_template_with_locator_without_state(entry, &locator, config.as_ref()),
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
/// `templates_json` is a JSON object mapping element names to their HTML template strings,
/// e.g. `{"my-button": "<template>...</template>"}`, or template metadata objects.
/// `attribute_name_strategy` controls attribute-to-property mapping: `"camelCase"` (default)
/// or `"none"`. Pass an empty string for the default.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render_entry_with_templates(
    entry: &str,
    templates_json: &str,
    state: Option<String>,
    attribute_name_strategy: Option<String>,
) -> Result<String, JsValue> {
    let templates = parse_templates_map(templates_json)?;
    let locator = Locator::from_template_definitions(templates);
    let config = build_config(attribute_name_strategy.as_deref())?;
    match state {
        Some(state) => render_entry_template_with_locator(entry, &state, &locator, config.as_ref()),
        None => render_entry_template_with_locator_without_state(entry, &locator, config.as_ref()),
    }
    .map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Parse all `<f-template>` elements from an HTML string.
/// Returns a JSON array of template metadata objects,
/// one per `<f-template>` element found. `name` is `null` when the element has
/// no `name` attribute.
#[wasm_bindgen]
pub fn parse_f_templates(html: &str) -> String {
    let templates = crate::locator::parse_f_templates(html);
    let mut parts = Vec::with_capacity(templates.len());
    for template in templates {
        let name_json = match template.name {
            Some(n) => format!("\"{}\"", escape_json_str(&n)),
            None => "null".to_string(),
        };
        parts.push(format!(
            "{{\"name\":{},\"content\":\"{}\",\"shadowrootAttributes\":{}}}",
            name_json,
            escape_json_str(&template.content),
            shadowroot_attributes_json(&template.shadowroot_attributes)
        ));
    }
    format!("[{}]", parts.join(","))
}

fn shadowroot_attributes_json(attrs: &[(String, Option<String>)]) -> String {
    let mut parts = Vec::with_capacity(attrs.len());
    for (name, value) in attrs {
        let value_json = match value {
            Some(value) => format!("\"{}\"", escape_json_str(value)),
            None => "null".to_string(),
        };
        parts.push(format!(
            "{{\"name\":\"{}\",\"value\":{}}}",
            escape_json_str(name),
            value_json
        ));
    }
    format!("[{}]", parts.join(","))
}

fn escape_json_str(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            c => out.push(c),
        }
    }
    out
}

fn parse_templates_map(
    templates_json: &str,
) -> Result<HashMap<String, (String, Vec<(String, Option<String>)>)>, JsValue> {
    let parsed = json::parse(templates_json).map_err(|e| {
        JsValue::from_str(&format!("Failed to parse templates JSON: {}", e.message))
    })?;
    match parsed {
        json::JsonValue::Object(obj) => {
            let mut map = HashMap::new();
            for (k, v) in obj {
                match v {
                    json::JsonValue::String(s) => {
                        map.insert(k, (s, Vec::new()));
                    }
                    json::JsonValue::Object(template) => {
                        map.insert(k.clone(), parse_template_metadata(&k, &template)?);
                    }
                    _ => {
                        return Err(JsValue::from_str(&format!(
                            "Template value for '{}' must be a string or metadata object",
                            k
                        )));
                    }
                }
            }
            Ok(map)
        }
        _ => Err(JsValue::from_str("Templates must be a JSON object")),
    }
}

fn parse_template_metadata(
    template_name: &str,
    template: &HashMap<String, json::JsonValue>,
) -> Result<(String, Vec<(String, Option<String>)>), JsValue> {
    let content = match template.get("content") {
        Some(json::JsonValue::String(content)) => content.clone(),
        _ => {
            return Err(JsValue::from_str(&format!(
                "Template metadata for '{}' must include a string content property",
                template_name
            )));
        }
    };

    let attrs = match template.get("shadowrootAttributes") {
        Some(json::JsonValue::Array(attrs)) => parse_shadowroot_attributes(template_name, attrs)?,
        Some(_) => {
            return Err(JsValue::from_str(&format!(
                "Template metadata for '{}' must use an array shadowrootAttributes property",
                template_name
            )));
        }
        None => Vec::new(),
    };

    Ok((content, attrs))
}

fn parse_shadowroot_attributes(
    template_name: &str,
    attrs: &[json::JsonValue],
) -> Result<Vec<(String, Option<String>)>, JsValue> {
    let mut parsed = Vec::with_capacity(attrs.len());
    for attr in attrs {
        let attr = match attr {
            json::JsonValue::Object(attr) => attr,
            _ => {
                return Err(JsValue::from_str(&format!(
                    "Template metadata for '{}' contains a non-object shadowroot attribute",
                    template_name
                )));
            }
        };
        let name = match attr.get("name") {
            Some(json::JsonValue::String(name)) => name.clone(),
            _ => {
                return Err(JsValue::from_str(&format!(
                    "Template metadata for '{}' contains a shadowroot attribute without a string name",
                    template_name
                )));
            }
        };
        let value = match attr.get("value") {
            Some(json::JsonValue::String(value)) => Some(value.clone()),
            Some(json::JsonValue::Null) | None => None,
            _ => {
                return Err(JsValue::from_str(&format!(
                    "Template metadata for '{}' contains a shadowroot attribute with a non-string value",
                    template_name
                )));
            }
        };
        parsed.push((name, value));
    }
    Ok(parsed)
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
