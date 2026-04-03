use crate::json::JsonValue;
use crate::error::RenderError;
use crate::node::render_node;
use crate::locator::Locator;

pub fn render(template: &str, root: &JsonValue) -> Result<String, RenderError> {
    render_node(template, root, &[], None, None)
}

pub fn render_with_locator(template: &str, root: &JsonValue, locator: &Locator) -> Result<String, RenderError> {
    render_node(template, root, &[], Some(locator), None)
}
