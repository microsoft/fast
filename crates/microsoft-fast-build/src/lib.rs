//! # microsoft-fast-build
//!
//! Server-side renderer for [FAST](https://www.fast.design/) declarative HTML templates.
//! Takes a template string and an optional JSON state object, resolves bindings, evaluates
//! conditionals, iterates repeats, and expands custom element shadow DOM — producing
//! static HTML ready to be served.
//! Omitted state is treated as an empty object.
//!
//! ## Pipeline
//!
//! ```text
//! render_template(template, state_str)
//!         │
//!         ▼
//!    json::parse(state_str)          ← hand-rolled JSON parser → JsonValue
//!         │
//!         ▼
//!   renderer::render(template, root) ─────────────────────────────────────┐
//!   renderer::render_stream(template, root) ───────────────┐              │
//!         │                                                                │
//!         ▼                                                                │
//!   node::render_node(template, root, loop_vars, locator, hydration?)     │
//!   streaming::stream_node(...) → Vec<String> chunks                      │
//!         │                                                                │
//!         ├─ directive::next_event() → next tag or directive              │
//!         │      ├─ PlainTag     → resolve attributes, hydration markers │
//!         │      ├─ TripleBrace  → content::render_triple_brace()        │
//!         │      ├─ DoubleBrace  → content::render_double_brace()        │
//!         │      ├─ When         → directive::render_when()  ────────────┘ recurse
//!         │      ├─ Repeat       → directive::render_repeat() ───────────┘ recurse per item
//!         │      └─ CustomElement→ directive::render_custom_element() ───┘ recurse, fresh HydrationScope
//!         │
//!         └─ append literal prefix + resolved chunk → output string
//! ```
//!
//! Streaming entry points use the same scanner and rendering semantics, but
//! return precomputed non-empty HTML chunks. Joining those chunks matches the
//! equivalent non-streamed render.
//!
//! ## Module map
//!
//! | Module | Role |
//! |--------|------|
//! | `renderer` | Thin entry points mapping the public API into `render_node` or `stream_node` calls |
//! | `node` | Main rendering loop — directive dispatch and hydration tag scan |
//! | `streaming` | Simulated streaming loop — returns precomputed HTML chunks |
//! | `directive` | `Directive` / `RenderEvent` enums, forward `next_event` scanner, directive renderers |
//! | `content` | `{{expr}}` / `{{{expr}}}` binding renderers and `html_escape` |
//! | `attribute` | Low-level HTML/attribute string parsing utilities |
//! | `attribute_lookup` | Static lookup tables mapping ARIA and HTML attribute names to DOM property names |
//! | `config` | `RenderConfig` struct and `AttributeNameStrategy` enum |
//! | `context` | State resolution: dot-path traversal, loop-variable scoping |
//! | `expression` | Boolean expression evaluator for `<f-when value="{{…}}">` |
//! | `hydration` | `HydrationScope` — binding index tracking and marker generation |
//! | `json` | Hand-rolled JSON parser producing [`JsonValue`] |
//! | `locator` | [`Locator`] — maps element names to template strings; glob scanner |
//! | `f_template` | [`compose_f_template_styles`] — in-memory `<f-template>` CSS composition, no filesystem requirement |
//! | `error` | [`RenderError`] enum with `Display` impl and helpers |
//! | `wasm` | WASM bindings (`#[cfg(target_arch = "wasm32")]`) |
//!
//! See the [design document](https://github.com/microsoft/fast/blob/main/crates/microsoft-fast-build/DESIGN.md)
//! for a deeper explanation of each module.

mod json;
mod context;
mod expression;
mod attribute;
mod attribute_lookup;
mod config;
mod content;
mod directive;
mod hydration;
mod code_escape;
mod node;
mod renderer;
mod streaming;
mod error;
mod locator;
mod f_template;
mod binding_metadata;
mod template_slots;
#[cfg(target_arch = "wasm32")]
mod wasm;

pub use json::{JsonValue, JsonError};
pub use error::{ErrorContext, ErrorLocation, RenderError};
pub use locator::{Locator, FTemplate, parse_f_templates};
pub use binding_metadata::{BindingMetadata, BindingScope, SourcePosition, SourceSpan};
pub use config::{RenderConfig, AttributeNameStrategy};
pub use f_template::{
    compose_f_template_styles, compose_f_template_styles_with_options, ComposedTemplate,
    CompositionSource, CompositionSpan, Stylesheet,
};
pub use template_slots::{extract_template_slots, TemplateSlot};

/// Version of generated template metadata; unversioned maps remain supported.
pub const TEMPLATE_FORMAT_VERSION: u32 = 1;

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
    let content = directive::render_shadow_content(element_name, state, locator, config)?;
    let attrs = directive::build_shadowroot_template_attrs(
        locator.get_shadowroot_attributes(element_name),
    );
    Ok(format!("<template{attrs}>{content}</template>"))
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
        Some(state) => json::parse(state).map_err(|error| RenderError::JsonParse {
            message: error.message,
        })?,
        None => empty_state(),
    };
    render_shadow_root_with_locator(element_name, &state, locator, config)
}

fn empty_state() -> JsonValue {
    JsonValue::Object(std::collections::HashMap::new())
}

/// Render a FAST HTML template with a JSON state string.
pub fn render_template(template: &str, state: &str, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    let state_value = json::parse(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    renderer::render(template, &state_value, config)
}

/// Render a FAST HTML template with a JSON state string into HTML stream chunks.
pub fn render_template_stream(template: &str, state: &str, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    let state_value = json::parse(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    renderer::render_stream(template, &state_value, config)
}

/// Render a FAST HTML template with no state, using an empty object.
pub fn render_template_without_state(template: &str, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    let state_value = empty_state();
    renderer::render(template, &state_value, config)
}

/// Render a FAST HTML template with no state into HTML stream chunks.
pub fn render_template_stream_without_state(template: &str, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    let state_value = empty_state();
    renderer::render_stream(template, &state_value, config)
}

/// Render a FAST HTML template with a parsed [`JsonValue`].
pub fn render(template: &str, state: &JsonValue, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    renderer::render(template, state, config)
}

/// Render a FAST HTML template with a parsed [`JsonValue`] into HTML stream chunks.
pub fn render_stream(template: &str, state: &JsonValue, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    renderer::render_stream(template, state, config)
}

/// Render a FAST HTML template with no state, using an empty object.
pub fn render_without_state(template: &str, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    let state_value = empty_state();
    renderer::render(template, &state_value, config)
}

/// Render a FAST HTML template with no state into HTML stream chunks.
pub fn render_stream_without_state(template: &str, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    let state_value = empty_state();
    renderer::render_stream(template, &state_value, config)
}

/// Render a FAST HTML template with a parsed [`JsonValue`] and a [`Locator`] for custom elements.
pub fn render_with_locator(template: &str, state: &JsonValue, locator: &Locator, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    renderer::render_with_locator(template, state, locator, config)
}

/// Render a FAST HTML template with a parsed [`JsonValue`] and a [`Locator`] into HTML stream chunks.
pub fn render_stream_with_locator(template: &str, state: &JsonValue, locator: &Locator, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    renderer::render_stream_with_locator(template, state, locator, config)
}

/// Render a FAST HTML template with a [`Locator`] for custom elements and no state.
pub fn render_with_locator_without_state(template: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    let state_value = empty_state();
    renderer::render_with_locator(template, &state_value, locator, config)
}

/// Render a FAST HTML template with a [`Locator`] and no state into HTML stream chunks.
pub fn render_stream_with_locator_without_state(template: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    let state_value = empty_state();
    renderer::render_stream_with_locator(template, &state_value, locator, config)
}

/// Render a FAST HTML template with a [`Locator`] for custom elements and no state.
pub fn render_template_with_locator_without_state(template: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    render_with_locator_without_state(template, locator, config)
}

/// Render a FAST HTML template with a [`Locator`] and no state into HTML stream chunks.
pub fn render_template_stream_with_locator_without_state(template: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    render_stream_with_locator_without_state(template, locator, config)
}

/// Render a FAST HTML template with a JSON state string and a [`Locator`] for custom elements.
pub fn render_template_with_locator(template: &str, state: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    let state_value = json::parse(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    renderer::render_with_locator(template, &state_value, locator, config)
}

/// Render a FAST HTML template with a JSON state string and a [`Locator`] into HTML stream chunks.
pub fn render_template_stream_with_locator(template: &str, state: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    let state_value = json::parse(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    renderer::render_stream_with_locator(template, &state_value, locator, config)
}

/// Render the top-level **entry HTML** with a parsed [`JsonValue`] and a [`Locator`].
/// Custom elements found at this level build child state from the full root state
/// with HTML attributes overlaid on top.
pub fn render_entry_with_locator(template: &str, state: &JsonValue, locator: &Locator, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    renderer::render_entry_with_locator(template, state, locator, config)
}

/// Render the top-level **entry HTML** into stream chunks with a parsed [`JsonValue`] and a [`Locator`].
pub fn render_entry_stream_with_locator(template: &str, state: &JsonValue, locator: &Locator, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    renderer::render_entry_stream_with_locator(template, state, locator, config)
}

/// Render the top-level **entry HTML** with a [`Locator`] and no state.
pub fn render_entry_with_locator_without_state(template: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    let state_value = empty_state();
    renderer::render_entry_with_locator(template, &state_value, locator, config)
}

/// Render the top-level **entry HTML** with a [`Locator`] and no state into stream chunks.
pub fn render_entry_stream_with_locator_without_state(template: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    let state_value = empty_state();
    renderer::render_entry_stream_with_locator(template, &state_value, locator, config)
}

/// Render the top-level **entry HTML** with a [`Locator`] and no state.
pub fn render_entry_template_with_locator_without_state(template: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    render_entry_with_locator_without_state(template, locator, config)
}

/// Render the top-level **entry HTML** with a [`Locator`] and no state into stream chunks.
pub fn render_entry_template_stream_with_locator_without_state(template: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    render_entry_stream_with_locator_without_state(template, locator, config)
}

/// Render the top-level **entry HTML** with a JSON state string and a [`Locator`].
/// Custom elements found at this level build child state from the full root state
/// with HTML attributes overlaid on top.
pub fn render_entry_template_with_locator(template: &str, state: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<String, RenderError> {
    let state_value = json::parse(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    renderer::render_entry_with_locator(template, &state_value, locator, config)
}

/// Render the top-level **entry HTML** with a JSON state string and a [`Locator`] into stream chunks.
pub fn render_entry_template_stream_with_locator(template: &str, state: &str, locator: &Locator, config: Option<&RenderConfig>) -> Result<Vec<String>, RenderError> {
    let state_value = json::parse(state).map_err(|e| RenderError::JsonParse { message: e.message })?;
    renderer::render_entry_stream_with_locator(template, &state_value, locator, config)
}
