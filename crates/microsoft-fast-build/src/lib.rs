//! Build-time compiler and template tooling for FAST declarative HTML.
//!
//! Generate server ESM with [`compile_server_module`]; execute that module in
//! JavaScript with JSON-shaped state. This crate does not execute rendering.

mod aot;
mod attribute;
mod attribute_lookup;
mod binding_metadata;
mod code_escape;
mod content;
mod directive;
mod error;
mod expression;
mod f_template;
mod json;
mod locator;
mod plan;
mod template_slots;
#[cfg(target_arch = "wasm32")]
mod wasm;

pub use aot::{compile_server_module, SERVER_RUNTIME_VERSION};
pub use binding_metadata::{BindingMetadata, BindingScope, SourcePosition, SourceSpan};
pub use error::{ErrorContext, ErrorLocation, RenderError};
pub use f_template::{
    compose_f_template_styles, compose_f_template_styles_with_options, ComposedTemplate,
    CompositionSource, CompositionSpan, Stylesheet,
};
pub use json::{JsonError, JsonValue};
pub use locator::{parse_f_templates, FTemplate, Locator};
pub use template_slots::{extract_template_slots, TemplateSlot};

/// Version of generated template metadata; unversioned maps remain supported.
pub const TEMPLATE_FORMAT_VERSION: u32 = 1;

/// Fingerprint of the build-time compiler inputs.
pub const SERVER_COMPILER_ID: &str = env!("FAST_BUILD_COMPILER_ID");
