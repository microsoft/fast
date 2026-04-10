//! # microsoft-fast-build
//!
//! Server-side renderer for [FAST](https://www.fast.design/) declarative HTML templates.
//! Takes a template string and a JSON state object, resolves bindings, evaluates
//! conditionals, iterates repeats, and expands custom element shadow DOM — producing
//! static HTML ready to be served.
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
//!         │                                                                │
//!         ▼                                                                │
//!   node::render_node(template, root, loop_vars, locator, hydration?)     │
//!         │                                                                │
//!         ├─ [hydration] scan literal HTML tags for attr bindings         │
//!         │      └─ inject data-fe-c-{n}-{count} compact markers         │
//!         │                                                                │
//!         ├─ directive::next_directive() → earliest position              │
//!         │      ├─ TripleBrace  → content::render_triple_brace()        │
//!         │      ├─ DoubleBrace  → content::render_double_brace()        │
//!         │      ├─ When         → directive::render_when()  ────────────┘ recurse
//!         │      ├─ Repeat       → directive::render_repeat() ───────────┘ recurse per item
//!         │      └─ CustomElement→ directive::render_custom_element() ───┘ recurse, fresh HydrationScope
//!         │
//!         └─ append literal prefix + resolved chunk → output string
//! ```
//!
//! ## Module map
//!
//! | Module | Role |
//! |--------|------|
//! | `renderer` | Thin entry points mapping the public API into `render_node` calls |
//! | `node` | Main rendering loop — directive dispatch and hydration tag scan |
//! | `directive` | `Directive` enum, `next_directive` scanner, directive renderers |
//! | `content` | `{{expr}}` / `{{{expr}}}` binding renderers and `html_escape` |
//! | `attribute` | Low-level HTML/attribute string parsing utilities |
//! | `context` | State resolution: dot-path traversal, loop-variable scoping |
//! | `expression` | Boolean expression evaluator for `<f-when value="{{…}}">` |
//! | `hydration` | `HydrationScope` — binding index tracking and marker generation |
//! | `json` | Hand-rolled JSON parser producing [`JsonValue`] |
//! | `locator` | [`Locator`] — maps element names to template strings; glob scanner |
//! | `error` | [`RenderError`] enum with `Display` impl and helpers |
//! | `wasm` | WASM bindings (`#[cfg(target_arch = "wasm32")]`) |
//!
//! See the [design document](https://github.com/microsoft/fast/blob/main/crates/microsoft-fast-build/DESIGN.md)
//! for a deeper explanation of each module.

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
