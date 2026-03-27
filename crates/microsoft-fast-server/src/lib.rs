mod json;
mod context;
mod expression;
mod attribute;
mod content;
mod directive;
mod node;
mod renderer;
mod error;

pub use json::{JsonValue, JsonError};
pub use error::RenderError;

/// Render a FAST HTML template with a JSON state string.
pub fn render_template(template: &str, state: &str) -> Result<String, RenderError> {
    let state_value = json::parse(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    renderer::render(template, &state_value)
}

/// Render a FAST HTML template with a parsed [`JsonValue`].
pub fn render(template: &str, state: &JsonValue) -> Result<String, RenderError> {
    renderer::render(template, state)
}
