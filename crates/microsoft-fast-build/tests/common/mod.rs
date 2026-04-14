use microsoft_fast_build::{render_template, Locator, JsonValue, RenderError, RenderConfig};
use std::collections::HashMap;

pub fn ok(template: &str, state: &str) -> String {
    render_template(template, state, &RenderConfig::default())
        .unwrap_or_else(|e| panic!("unexpected error: {e}"))
}

pub fn err(template: &str, state: &str) -> RenderError {
    render_template(template, state, &RenderConfig::default())
        .expect_err("expected an error but rendering succeeded")
}

pub fn make_locator(entries: &[(&str, &str)]) -> Locator {
    let mut templates = HashMap::new();
    for (name, content) in entries {
        templates.insert((*name).to_string(), (*content).to_string());
    }
    Locator::from_templates(templates)
}

pub fn empty_root() -> JsonValue {
    JsonValue::Object(HashMap::new())
}
