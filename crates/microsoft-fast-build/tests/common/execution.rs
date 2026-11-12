#![allow(dead_code)]
use super::configuration::*;
use microsoft_fast_build::{
    compile_server_artifact, compile_server_module, CompiledArtifact, JsonValue, Locator,
    NativeRenderOptions, RenderError,
};
use serde_json::{json, Value};
use std::collections::HashMap;
use std::io::Write;
use std::process::{Command, Stdio};

fn value(input: &JsonValue) -> Value {
    match input {
        JsonValue::Null => Value::Null,
        JsonValue::Bool(v) => json!(v),
        JsonValue::Number(v) => json!(v),
        JsonValue::String(v) => json!(v),
        JsonValue::Array(v) => Value::Array(v.iter().map(value).collect()),
        JsonValue::Object(v) => {
            Value::Object(v.iter().map(|(k, v)| (k.clone(), value(v))).collect())
        }
    }
}

fn from_value(input: Value) -> JsonValue {
    match input {
        Value::Null => JsonValue::Null,
        Value::Bool(v) => JsonValue::Bool(v),
        Value::Number(v) => JsonValue::Number(v.as_f64().unwrap()),
        Value::String(v) => JsonValue::String(v),
        Value::Array(v) => JsonValue::Array(v.into_iter().map(from_value).collect()),
        Value::Object(v) => {
            JsonValue::Object(v.into_iter().map(|(k, v)| (k, from_value(v))).collect())
        }
    }
}

pub fn parse_state(source: &str) -> Result<JsonValue, microsoft_fast_build::JsonError> {
    serde_json::from_str(source)
        .map(from_value)
        .map_err(|error| microsoft_fast_build::JsonError {
            message: error.to_string(),
        })
}

fn execute(
    template: &str,
    root: &JsonValue,
    locator: &Locator,
    config: Option<&RenderConfig>,
    entry: bool,
    shadow: Option<&str>,
) -> Result<String, RenderError> {
    let source = compile_server_module(template, locator, "__FAST_TEST_RUNTIME__")?;
    let config = config.cloned().unwrap_or_default();
    let native_options = NativeRenderOptions {
        markers_v2: config.markers_v2,
        dsd: match &config.dsd_selection {
            DsdSelection::All => None,
            DsdSelection::Only(names) => Some(names.iter().cloned().collect()),
        },
        attribute_name_strategy: if config.attribute_name_strategy == AttributeNameStrategy::None {
            microsoft_fast_build::AttributeNameStrategy::None
        } else {
            microsoft_fast_build::AttributeNameStrategy::CamelCase
        },
        ..Default::default()
    };
    let artifact = CompiledArtifact::load(&compile_server_artifact(template, locator)?)
        .expect("compiler output must load natively");
    let native_result = if let Some(name) = shadow {
        artifact.render_shadow(name, root, &native_options)
    } else if entry {
        artifact.render_entry(root, &native_options)
    } else {
        artifact.render_template(root, &native_options)
    };
    let dsd = match config.dsd_selection {
        DsdSelection::All => Value::Null,
        DsdSelection::Only(names) => json!(names),
    };
    let mut options = json!({
        "attributeNameStrategy": if config.attribute_name_strategy == AttributeNameStrategy::None { "none" } else { "camelCase" },
        "markersV2": config.markers_v2,
    });
    if !dsd.is_null() {
        options["dsd"] = dsd;
    }
    let request = json!({ "source": source, "state": value(root), "options": options, "shadow": shadow, "template": !entry });
    let mut child = Command::new("node")
        .arg(
            std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
                .join("../../packages/fast-build/test/execute-server.mjs"),
        )
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("Node is required for generated-JS rendering assertions");
    child
        .stdin
        .take()
        .unwrap()
        .write_all(request.to_string().as_bytes())
        .unwrap();
    let output = child.wait_with_output().unwrap();
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    let result: Value = serde_json::from_slice(&output.stdout).unwrap();
    if let Some(error) = result.get("error") {
        assert_eq!(
            native_result.as_ref().unwrap_err().code,
            error["code"].as_str().unwrap(),
            "native/JS failure contract"
        );
        if error["code"] == "repeat-not-array" {
            return Err(RenderError::NotAnArray {
                binding: error["message"].as_str().unwrap_or("").to_string(),
                context: template.to_string().into(),
            });
        }
        return Err(RenderError::InvalidTemplateMetadata {
            message: error["message"].as_str().unwrap_or("").to_string(),
        });
    }
    let result = result["value"].as_str().unwrap().to_string();
    assert_eq!(
        native_result.expect("native execution must match successful JS"),
        result,
        "loaded native artifact and generated JS must preserve identical bytes"
    );
    Ok(result)
}

pub fn render(
    template: &str,
    root: &JsonValue,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    render_with_locator(
        template,
        root,
        &Locator::from_templates(HashMap::new()),
        config,
    )
}
pub fn render_with_locator(
    template: &str,
    root: &JsonValue,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    execute(template, root, locator, config, false, None)
}
pub fn render_entry_with_locator(
    template: &str,
    root: &JsonValue,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    execute(template, root, locator, config, true, None)
}
pub fn shadow(
    name: &str,
    root: &JsonValue,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<String, RenderError> {
    execute("", root, locator, config, true, Some(name))
}
// Legacy chunk-boundary tests are retired. Remaining shared assertions compare
// complete output and use one chunk solely to avoid duplicating those fixtures.
pub fn render_stream(
    template: &str,
    root: &JsonValue,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    render(template, root, config).map(|html| if html.is_empty() { vec![] } else { vec![html] })
}
pub fn render_stream_with_locator(
    template: &str,
    root: &JsonValue,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    render_with_locator(template, root, locator, config).map(|html| {
        if html.is_empty() {
            vec![]
        } else {
            vec![html]
        }
    })
}
pub fn render_entry_stream_with_locator(
    template: &str,
    root: &JsonValue,
    locator: &Locator,
    config: Option<&RenderConfig>,
) -> Result<Vec<String>, RenderError> {
    render_entry_with_locator(template, root, locator, config).map(|html| {
        if html.is_empty() {
            vec![]
        } else {
            vec![html]
        }
    })
}
