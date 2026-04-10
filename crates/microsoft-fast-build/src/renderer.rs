use crate::json::JsonValue;
use crate::error::RenderError;
use crate::node::render_node;
use crate::locator::Locator;

pub fn render(template: &str, root: &JsonValue) -> Result<String, RenderError> {
    render_node(template, root, &[], None, None, false)
}

pub fn render_with_locator(template: &str, root: &JsonValue, locator: &Locator) -> Result<String, RenderError> {
    render_node(template, root, &[], Some(locator), None, false)
}

/// Render the top-level **entry HTML** — custom elements found at this level are treated
/// as root elements and receive the full root state rather than attribute-based child state.
pub fn render_entry_with_locator(template: &str, root: &JsonValue, locator: &Locator) -> Result<String, RenderError> {
    render_node(template, root, &[], Some(locator), None, true)
}
