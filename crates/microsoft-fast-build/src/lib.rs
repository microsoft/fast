mod json;
mod context;
mod expression;
mod attribute;
mod content;
mod directive;
mod hydration;
mod node;
mod renderer;
mod error;
mod locator;
#[cfg(target_arch = "wasm32")]
mod wasm;

pub use json::{JsonValue, JsonError};
pub use error::RenderError;
pub use locator::Locator;

/// Render a FAST HTML template with a JSON state string.
pub fn render_template(template: &str, state: &str) -> Result<String, RenderError> {
    let state_value = json::parse(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    renderer::render(template, &state_value)
}

/// Render a FAST HTML template with a parsed [`JsonValue`].
pub fn render(template: &str, state: &JsonValue) -> Result<String, RenderError> {
    renderer::render(template, state)
}

/// Render a FAST HTML template with a parsed [`JsonValue`] and a [`Locator`] for custom elements.
pub fn render_with_locator(template: &str, state: &JsonValue, locator: &Locator) -> Result<String, RenderError> {
    renderer::render_with_locator(template, state, locator)
}

/// Render a FAST HTML template with a JSON state string and a [`Locator`] for custom elements.
pub fn render_template_with_locator(template: &str, state: &str, locator: &Locator) -> Result<String, RenderError> {
    let state_value = json::parse(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    renderer::render_with_locator(template, &state_value, locator)
}

/// Render the top-level **entry HTML** with a parsed [`JsonValue`] and a [`Locator`].
/// Custom elements found at this level receive the full root state rather than
/// building their child state from HTML attributes.
pub fn render_entry_with_locator(template: &str, state: &JsonValue, locator: &Locator) -> Result<String, RenderError> {
    renderer::render_entry_with_locator(template, state, locator)
}

/// Render the top-level **entry HTML** with a JSON state string and a [`Locator`].
/// Custom elements found at this level receive the full root state rather than
/// building their child state from HTML attributes.
pub fn render_entry_template_with_locator(template: &str, state: &str, locator: &Locator) -> Result<String, RenderError> {
    let state_value = json::parse(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    renderer::render_entry_with_locator(template, &state_value, locator)
}
