use microsoft_fast_build::{
    parse_render_state, AttributeNameStrategy, CompiledArtifact, JsonValue, NativeRenderError,
    NativeRenderOptions, SERVER_COMPILER_ID,
};
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

#[derive(Default, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Options {
    markers_v2: Option<bool>,
    dsd: Option<Vec<String>>,
    attribute_name_strategy: Option<Strategy>,
    max_output_bytes: Option<usize>,
    max_steps: Option<usize>,
}

fn render(
    state: Buffer,
    options: Option<Buffer>,
    execute: impl FnOnce(
        &JsonValue,
        &NativeRenderOptions,
    ) -> std::result::Result<String, NativeRenderError>,
) -> Result<Buffer, String> {
    let text = std::str::from_utf8(&state)
        .map_err(|_| Error::new("invalid-state".to_owned(), "State must be UTF-8 JSON"))?;
    let state = parse_render_state(text).map_err(error)?;
    let options: Options = options
        .as_ref()
        .map(|bytes| serde_json::from_slice(bytes))
        .transpose()
        .map_err(|error| Error::new("invalid-options".to_owned(), error.to_string()))?
        .unwrap_or_default();
    let defaults = NativeRenderOptions::default();
    let options = NativeRenderOptions {
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
    };
    execute(&state, &options)
        .map(|output| Buffer::from(output.into_bytes()))
        .map_err(error)
}

#[napi]
pub fn compiler_id() -> String {
    SERVER_COMPILER_ID.to_owned()
}

#[napi]
pub struct NativeProgram {
    artifact: CompiledArtifact,
}

#[napi]
impl NativeProgram {
    #[napi(constructor)]
    pub fn new(artifact: Buffer) -> Result<Self, String> {
        Ok(Self {
            artifact: CompiledArtifact::load(&artifact).map_err(error)?,
        })
    }

    #[napi]
    pub fn render_entry(&self, state: Buffer, options: Option<Buffer>) -> Result<Buffer, String> {
        render(state, options, |state, options| {
            self.artifact.render_entry(state, options)
        })
    }

    #[napi]
    pub fn render_template(
        &self,
        state: Buffer,
        options: Option<Buffer>,
    ) -> Result<Buffer, String> {
        render(state, options, |state, options| {
            self.artifact.render_template(state, options)
        })
    }

    #[napi]
    pub fn render_host(
        &self,
        name: String,
        state: Buffer,
        options: Option<Buffer>,
    ) -> Result<Buffer, String> {
        render(state, options, |state, options| {
            self.artifact.render_host(&name, state, options)
        })
    }

    #[napi]
    pub fn render_shadow(
        &self,
        name: String,
        state: Buffer,
        options: Option<Buffer>,
    ) -> Result<Buffer, String> {
        render(state, options, |state, options| {
            self.artifact.render_shadow(&name, state, options)
        })
    }
}
