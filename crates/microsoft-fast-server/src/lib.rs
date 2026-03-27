mod json;
mod context;
mod expression;
mod attribute;
mod content;
mod directive;
mod node;
mod renderer;

pub use json::{JsonValue, JsonError};

/// Render a FAST HTML template with a JSON state string.
pub fn render_template(template: &str, state: &str) -> Result<String, JsonError> {
    let state_value = json::parse(state)?;
    Ok(renderer::render(template, &state_value))
}

/// Render a FAST HTML template with a parsed JsonValue.
pub fn render(template: &str, state: &JsonValue) -> String {
    renderer::render(template, state)
}
