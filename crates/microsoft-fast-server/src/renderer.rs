use crate::json::JsonValue;
use crate::node::render_node;

pub fn render(template: &str, root: &JsonValue) -> String {
    render_node(template, root, &[])
}
