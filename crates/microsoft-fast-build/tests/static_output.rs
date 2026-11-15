use microsoft_fast_build::{
    compile_server_artifact, parse_render_state, CompiledArtifact, Locator, NativeRenderOptions,
};
use serde_json::{json, Value};
use std::io::Write;
use std::path::PathBuf;
use std::process::{Command, Stdio};

fn fixture_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../packages/fast-build/test/fixtures/static-output")
}

fn pairs(value: &Value) -> Vec<(String, Option<String>)> {
    value
        .as_array()
        .map(|pairs| {
            pairs
                .iter()
                .map(|pair| {
                    (
                        pair["name"].as_str().unwrap().to_owned(),
                        pair["value"].as_str().map(str::to_owned),
                    )
                })
                .collect()
        })
        .unwrap_or_default()
}

#[test]
fn qualified_static_output_oracles() {
    let directory = fixture_dir();
    let input: Value =
        serde_json::from_slice(&std::fs::read(directory.join("input.json")).unwrap()).unwrap();
    let mut locator = Locator::from_templates(Default::default());
    for (name, template) in input["templates"].as_object().unwrap() {
        let content = template
            .as_str()
            .or_else(|| template["content"].as_str())
            .unwrap();
        locator.add_template_with_attrs(
            name,
            content,
            &pairs(&template["shadowrootAttributes"]),
            &pairs(&template["hostAttributes"]),
        );
    }
    let artifact = compile_server_artifact(input["entry"].as_str().unwrap(), &locator).unwrap();
    let program = CompiledArtifact::load(&artifact).unwrap();
    let state = parse_render_state(&input["state"].to_string()).unwrap();
    let output = program
        .render_entry(&state, &NativeRenderOptions::default())
        .unwrap();
    assert_eq!(
        output,
        std::fs::read_to_string(directory.join("modern.html")).unwrap()
    );
    let retained =
        CompiledArtifact::load(&std::fs::read(directory.join("legacy.fast")).unwrap()).unwrap();
    assert_eq!(
        retained
            .render_entry(&state, &NativeRenderOptions::default())
            .unwrap(),
        std::fs::read_to_string(directory.join("legacy.html")).unwrap(),
    );
    let no_dsd = NativeRenderOptions {
        dsd: Some(vec![]),
        ..Default::default()
    };
    assert_eq!(
        program.render_entry(&state, &no_dsd).unwrap(),
        retained.render_entry(&state, &no_dsd).unwrap(),
    );
    for artifact in [&program, &retained] {
        for selected in [true, false] {
            let options = if selected {
                NativeRenderOptions::default()
            } else {
                no_dsd.clone()
            };
            let expected = artifact.render_entry(&state, &options).unwrap();
            let mut child = Command::new("node")
                .arg(directory.join("../../execute-server.mjs"))
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
                .unwrap();
            child
                .stdin
                .take()
                .unwrap()
                .write_all(
                    json!({
                        "source": artifact.emit_server_module("__FAST_TEST_RUNTIME__"),
                        "state": input["state"],
                        "options": if selected { json!({}) } else { json!({"dsd":[]}) },
                    })
                    .to_string()
                    .as_bytes(),
                )
                .unwrap();
            let output = child.wait_with_output().unwrap();
            assert!(
                output.status.success(),
                "{}",
                String::from_utf8_lossy(&output.stderr)
            );
            let result: Value = serde_json::from_slice(&output.stdout).unwrap();
            assert_eq!(
                result["value"], expected,
                "retained/new artifact JS/native parity"
            );
        }
    }
}
