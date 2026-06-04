use crate::json::JsonValue;
use crate::error::RenderError;
use crate::config::RenderConfig;
use crate::node::render_node;
use crate::streaming::stream_node;
use crate::locator::Locator;

pub fn render(template: &str, root: &JsonValue, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    let default = RenderConfig::default();
    let config = config.unwrap_or(&default);
    render_node(template, root, &[], None, None, false, config)
}

pub fn render_stream(template: &str, root: &JsonValue, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    let default = RenderConfig::default();
    let config = config.unwrap_or(&default);
    stream_node(template, root, &[], None, None, false, config)
}

pub fn render_with_locator(template: &str, root: &JsonValue, locator: &Locator, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    let default = RenderConfig::default();
    let config = config.unwrap_or(&default);
    render_node(template, root, &[], Some(locator), None, false, config)
}

pub fn render_stream_with_locator(template: &str, root: &JsonValue, locator: &Locator, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    let default = RenderConfig::default();
    let config = config.unwrap_or(&default);
    stream_node(template, root, &[], Some(locator), None, false, config)
}

/// Render the top-level **entry HTML** — custom elements found at this level use
/// entry opening-tag handling while their child state starts from the full root
/// state with HTML attributes overlaid on top.
pub fn render_entry_with_locator(template: &str, root: &JsonValue, locator: &Locator, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    let default = RenderConfig::default();
    let config = config.unwrap_or(&default);
    render_node(template, root, &[], Some(locator), None, true, config)
}

pub fn render_entry_stream_with_locator(template: &str, root: &JsonValue, locator: &Locator, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    let default = RenderConfig::default();
    let config = config.unwrap_or(&default);
    stream_node(template, root, &[], Some(locator), None, true, config)
}
