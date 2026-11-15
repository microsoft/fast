//! Synchronous JSON-only Node-API transport; execution stays in `native`.
use crate::{
    parse_render_state, AttributeNameStrategy, CompiledArtifact, NativeRenderError,
    NativeRenderOptions,
};
use napi::{
    bindgen_prelude::{Buffer, Either},
    Error, Result,
};
use napi_derive::napi;
use serde::Deserialize;

fn error(error: NativeRenderError) -> Error<String> {
    Error::new(error.code.to_owned(), error.message)
}

fn text(input: &Either<String, Buffer>) -> Result<&str, String> {
    match input {
        Either::A(text) => Ok(text),
        Either::B(bytes) => std::str::from_utf8(bytes)
            .map_err(|_| Error::new("invalid-state".to_owned(), "JSON must be strict UTF-8")),
    }
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

fn options(input: Option<Either<String, Buffer>>) -> Result<NativeRenderOptions, String> {
    let options: Options = match input.as_ref() {
        Some(input) => serde_json::from_str(
            text(input).map_err(|e| Error::new("invalid-options".to_owned(), e.reason))?,
        )
        .map_err(|e| Error::new("invalid-options".to_owned(), e.to_string()))?,
        None => Options::default(),
    };
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
    state: Either<String, Buffer>,
    input_options: Option<Either<String, Buffer>>,
    execute: impl FnOnce(&str, &NativeRenderOptions) -> std::result::Result<String, NativeRenderError>,
) -> Result<Buffer, String> {
    let json = text(&state)?;
    let options = match options(input_options) {
        Ok(options) => options,
        Err(options_error) => {
            // State errors precede options/lookup errors, including on invalid options.
            parse_render_state(json).map_err(error)?;
            return Err(options_error);
        }
    };
    execute(json, &options)
        .map(|output| Buffer::from(output.into_bytes()))
        .map_err(error)
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
    pub fn render_entry_json(
        &self,
        state: Either<String, Buffer>,
        options: Option<Either<String, Buffer>>,
    ) -> Result<Buffer, String> {
        render(state, options, |json, options| {
            self.artifact.render_entry_json(json, options)
        })
    }

    #[napi]
    pub fn render_template_json(
        &self,
        state: Either<String, Buffer>,
        options: Option<Either<String, Buffer>>,
    ) -> Result<Buffer, String> {
        render(state, options, |json, options| {
            self.artifact.render_template_json(json, options)
        })
    }

    #[napi]
    pub fn render_host_json(
        &self,
        name: String,
        state: Either<String, Buffer>,
        options: Option<Either<String, Buffer>>,
    ) -> Result<Buffer, String> {
        render(state, options, |json, options| {
            self.artifact.render_host_json(&name, json, options)
        })
    }

    #[napi]
    pub fn render_shadow_json(
        &self,
        name: String,
        state: Either<String, Buffer>,
        options: Option<Either<String, Buffer>>,
    ) -> Result<Buffer, String> {
        render(state, options, |json, options| {
            self.artifact.render_shadow_json(&name, json, options)
        })
    }
}
