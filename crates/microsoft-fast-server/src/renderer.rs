use crate::json::JsonValue;
use crate::error::RenderError;
use crate::node::render_node;

pub fn render(template: &str, root: &JsonValue) -> Result<String, RenderError> {
    render_node(template, root, &[])
}
