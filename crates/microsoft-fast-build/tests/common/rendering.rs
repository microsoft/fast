#![allow(dead_code)]
use super::configuration::*;
use super::execution;
use super::execution::parse_state;
use microsoft_fast_build::{JsonValue, Locator, RenderError};
/// Render only the Declarative Shadow DOM `<template>` for a named component.
///
/// `state` is the component's resolved state. No host markup, host-attribute
/// overlay, or light DOM is synthesized. Nested components and hydration use
/// the same rendering path as whole-host rendering.
pub fn render_shadow_root_with_locator(
    element_name: &str,
    state: &JsonValue,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    let default_config = RenderConfig::default();
    let config = config.unwrap_or(&default_config);
    if !locator.has_template(element_name) {
        return Err(RenderError::UnknownTemplate {
            element: element_name.to_string(),
        });
    }
    if !config.dsd_selection.includes(element_name) {
        return Ok(String::new());
    }
    execution::shadow(element_name, state, locator, Some(config))
}

/// Render a named component's shadow-root fragment with optional JSON state.
/// Omitted state is treated as an empty object.
pub fn render_shadow_root_template_with_locator(
    element_name: &str,
    state: Option<&str>,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    let state = match state {
        Some(state) => parse_state(state).map_err(|error| RenderError::JsonParse {
            message: error.message,
        })?,
        None => empty_state(),
    };
    render_shadow_root_with_locator(element_name, &state, locator, config)
}

pub fn empty_state() -> JsonValue {
    JsonValue::Object(std::collections::HashMap::new())
}

/// Render a FAST HTML template with a JSON state string.
pub fn render_template(
    template: &str,
    state: &str,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    let state_value =
        parse_state(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    execution::render(template, &state_value, config)
}

/// Render a FAST HTML template with a JSON state string into HTML stream chunks.
pub fn render_template_stream(
    template: &str,
    state: &str,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    let state_value =
        parse_state(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    execution::render_stream(template, &state_value, config)
}

/// Render a FAST HTML template with no state, using an empty object.
pub fn render_template_without_state(
    template: &str,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    let state_value = empty_state();
    execution::render(template, &state_value, config)
}

/// Render a FAST HTML template with no state into HTML stream chunks.
pub fn render_template_stream_without_state(
    template: &str,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    let state_value = empty_state();
    execution::render_stream(template, &state_value, config)
}

/// Render a FAST HTML template with a parsed [`JsonValue`].
pub fn render(
    template: &str,
    state: &JsonValue,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    execution::render(template, state, config)
}

/// Render a FAST HTML template with a parsed [`JsonValue`] into HTML stream chunks.
pub fn render_stream(
    template: &str,
    state: &JsonValue,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    execution::render_stream(template, state, config)
}

/// Render a FAST HTML template with no state, using an empty object.
pub fn render_without_state(
    template: &str,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    let state_value = empty_state();
    execution::render(template, &state_value, config)
}

/// Render a FAST HTML template with no state into HTML stream chunks.
pub fn render_stream_without_state(
    template: &str,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    let state_value = empty_state();
    execution::render_stream(template, &state_value, config)
}

/// Render a FAST HTML template with a parsed [`JsonValue`] and a [`Locator`] for custom elements.
pub fn render_with_locator(
    template: &str,
    state: &JsonValue,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    execution::render_with_locator(template, state, locator, config)
}

/// Render a FAST HTML template with a parsed [`JsonValue`] and a [`Locator`] into HTML stream chunks.
pub fn render_stream_with_locator(
    template: &str,
    state: &JsonValue,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    execution::render_stream_with_locator(template, state, locator, config)
}

/// Render a FAST HTML template with a [`Locator`] for custom elements and no state.
pub fn render_with_locator_without_state(
    template: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    let state_value = empty_state();
    execution::render_with_locator(template, &state_value, locator, config)
}

/// Render a FAST HTML template with a [`Locator`] and no state into HTML stream chunks.
pub fn render_stream_with_locator_without_state(
    template: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    let state_value = empty_state();
    execution::render_stream_with_locator(template, &state_value, locator, config)
}

/// Render a FAST HTML template with a [`Locator`] for custom elements and no state.
pub fn render_template_with_locator_without_state(
    template: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    render_with_locator_without_state(template, locator, config)
}

/// Render a FAST HTML template with a [`Locator`] and no state into HTML stream chunks.
pub fn render_template_stream_with_locator_without_state(
    template: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    render_stream_with_locator_without_state(template, locator, config)
}

/// Render a FAST HTML template with a JSON state string and a [`Locator`] for custom elements.
pub fn render_template_with_locator(
    template: &str,
    state: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    let state_value =
        parse_state(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    execution::render_with_locator(template, &state_value, locator, config)
}

/// Render a FAST HTML template with a JSON state string and a [`Locator`] into HTML stream chunks.
pub fn render_template_stream_with_locator(
    template: &str,
    state: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    let state_value =
        parse_state(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    execution::render_stream_with_locator(template, &state_value, locator, config)
}

/// Render the top-level **entry HTML** with a parsed [`JsonValue`] and a [`Locator`].
/// Custom elements found at this level build child state from the full root state
/// with HTML attributes overlaid on top.
pub fn render_entry_with_locator(
    template: &str,
    state: &JsonValue,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    execution::render_entry_with_locator(template, state, locator, config)
}

/// Render the top-level **entry HTML** into stream chunks with a parsed [`JsonValue`] and a [`Locator`].
pub fn render_entry_stream_with_locator(
    template: &str,
    state: &JsonValue,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    execution::render_entry_stream_with_locator(template, state, locator, config)
}

/// Render the top-level **entry HTML** with a [`Locator`] and no state.
pub fn render_entry_with_locator_without_state(
    template: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    let state_value = empty_state();
    execution::render_entry_with_locator(template, &state_value, locator, config)
}

/// Render the top-level **entry HTML** with a [`Locator`] and no state into stream chunks.
pub fn render_entry_stream_with_locator_without_state(
    template: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    let state_value = empty_state();
    execution::render_entry_stream_with_locator(template, &state_value, locator, config)
}

/// Render the top-level **entry HTML** with a [`Locator`] and no state.
pub fn render_entry_template_with_locator_without_state(
    template: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    render_entry_with_locator_without_state(template, locator, config)
}

/// Render the top-level **entry HTML** with a [`Locator`] and no state into stream chunks.
pub fn render_entry_template_stream_with_locator_without_state(
    template: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    render_entry_stream_with_locator_without_state(template, locator, config)
}

/// Render the top-level **entry HTML** with a JSON state string and a [`Locator`].
/// Custom elements found at this level build child state from the full root state
/// with HTML attributes overlaid on top.
pub fn render_entry_template_with_locator(
    template: &str,
    state: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    let state_value =
        parse_state(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    execution::render_entry_with_locator(template, &state_value, locator, config)
}

/// Render the top-level **entry HTML** with a JSON state string and a [`Locator`] into stream chunks.
pub fn render_entry_template_stream_with_locator(
    template: &str,
    state: &str,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    let state_value =
        parse_state(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    execution::render_entry_stream_with_locator(template, &state_value, locator, config)
}
