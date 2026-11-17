//! Synchronous JSON-only Node-API transport; execution stays in `native`.
use crate::{AttributeNameStrategy, CompiledArtifact, NativeRenderError, NativeRenderOptions};
use napi::{bindgen_prelude::Buffer, Error, Result};
use napi_derive::napi;
use serde::Deserialize;

fn error(error: NativeRenderError) -> Error<String> {
    Error::new(error.code.to_owned(), error.message)
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
enum Strategy {
    CamelCase,
    None,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Options {
    markers_v2: Option<bool>,
    dsd: Option<Vec<String>>,
    attribute_name_strategy: Option<Strategy>,
    max_output_bytes: Option<usize>,
    max_steps: Option<usize>,
}

fn options(input: &str) -> Result<NativeRenderOptions, String> {
    let options: Options = serde_json::from_str(input)
        .map_err(|e| Error::new("invalid-options".to_owned(), e.to_string()))?;
    let defaults = NativeRenderOptions::default();
    Ok(NativeRenderOptions {
        markers_v2: options.markers_v2.unwrap_or(defaults.markers_v2),
        dsd: options.dsd,
        attribute_name_strategy: match options.attribute_name_strategy {
            Some(Strategy::None) => AttributeNameStrategy::None,
            _ => AttributeNameStrategy::CamelCase,
        },
        max_output_bytes: options
            .max_output_bytes
            .unwrap_or(defaults.max_output_bytes),
        max_steps: options.max_steps.unwrap_or(defaults.max_steps),
    })
}

fn render(
    state: Buffer,
    execute: impl FnOnce(&str) -> std::result::Result<String, NativeRenderError>,
) -> Result<Buffer, String> {
    let json = std::str::from_utf8(&state)
        .map_err(|_| Error::new("invalid-state".to_owned(), "JSON must be strict UTF-8"))?;
    execute(json)
        .map(|output| Buffer::from(output.into_bytes()))
        .map_err(error)
}

#[napi]
pub struct NativeProgram {
    artifact: CompiledArtifact,
    options: NativeRenderOptions,
}

#[napi]
impl NativeProgram {
    #[napi(constructor)]
    pub fn new(artifact: Buffer, input_options: String) -> Result<Self, String> {
        Ok(Self {
            artifact: CompiledArtifact::load(&artifact).map_err(error)?,
            options: options(&input_options)?,
        })
    }

    #[napi]
    pub fn render_entry_json(&self, state: Buffer) -> Result<Buffer, String> {
        render(state, |json| {
            self.artifact.render_entry_json(json, &self.options)
        })
    }

    #[napi]
    pub fn render_template_json(&self, state: Buffer) -> Result<Buffer, String> {
        render(state, |json| {
            self.artifact.render_template_json(json, &self.options)
        })
    }

    #[napi]
    pub fn render_host_json(&self, name: String, state: Buffer) -> Result<Buffer, String> {
        render(state, |json| {
            self.artifact.render_host_json(&name, json, &self.options)
        })
    }

    #[napi]
    pub fn render_shadow_json(&self, name: String, state: Buffer) -> Result<Buffer, String> {
        render(state, |json| {
            self.artifact.render_shadow_json(&name, json, &self.options)
        })
    }
}
