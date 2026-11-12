mod common;

use microsoft_fast_build::{
    compile_server_artifact, compile_server_module, parse_render_state, AttributeNameStrategy,
    CompiledArtifact, JsonValue, Locator, NativeRenderOptions,
};
use serde_json::{json, Value};
use std::io::Write;
use std::process::{Command, Stdio};

fn locator() -> Locator {
    common::make_locator_with_host_attrs(&[
        ("test-card", "<h2 title=\"{{label}}\">{{label}}</h2><test-leaf :item=\"{{item}}\"></test-leaf><slot>fallback</slot>", &[("role", Some("group")), ("title", Some("{{label}}"))]),
        ("test-leaf", "{{item.name}}/{{dataset.inherited}}/{{fooBar}}/{{foo-bar}}", &[]),
    ])
}

fn js(source: &str, state: &str, options: Value, target: &str, name: &str) -> Value {
    let mut child = Command::new("node")
        .arg(
            std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
                .join("../../packages/fast-build/test/execute-server.mjs"),
        )
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .unwrap();
    let input = json!({
        "source":source, "stateJson":state, "options":options,
        "host":if target == "host" {Some(name)} else {None},
        "shadow":if target == "shadow" {Some(name)} else {None}, "template":target == "template",
    });
    child
        .stdin
        .take()
        .unwrap()
        .write_all(input.to_string().as_bytes())
        .unwrap();
    let output = child.wait_with_output().unwrap();
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    serde_json::from_slice(&output.stdout).unwrap()
}

#[test]
fn all_render_targets_share_state_markers_selection_and_bytes() {
    let locator = locator();
    let entry = "<f-repeat value=\"{{item in items}}\"><test-card :item=\"{{item}}\" label=\"{{label}}\" foo-bar=\"custom\">{{$index}}/{{item.name}}</test-card></f-repeat>";
    let source = compile_server_module(entry, &locator, "__FAST_TEST_RUNTIME__").unwrap();
    let bytes = compile_server_artifact(entry, &locator).unwrap();
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    assert_eq!(source, artifact.emit_server_module("__FAST_TEST_RUNTIME__"));
    let state_json = r#"{"label":"& < > \" ' 😀","items":[{"name":"one"},{"name":null},false],"item":{"name":"resolved"},"dataset":{"inherited":"yes"},"fooBar":"camel","foo-bar":"dash"}"#;
    let state = parse_render_state(state_json).unwrap();
    for v2 in [false, true] {
        for strategy in [
            AttributeNameStrategy::CamelCase,
            AttributeNameStrategy::None,
        ] {
            for dsd in [
                None,
                Some(vec![]),
                Some(vec!["test-leaf".to_string()]),
                Some(vec!["test-card".to_string()]),
            ] {
                let options = NativeRenderOptions {
                    markers_v2: v2,
                    attribute_name_strategy: strategy,
                    dsd: dsd.clone(),
                    ..Default::default()
                };
                let mut js_options = json!({"markersV2":v2, "attributeNameStrategy":if strategy == AttributeNameStrategy::None {"none"} else {"camelCase"}});
                if let Some(names) = dsd {
                    js_options["dsd"] = json!(names);
                }
                for target in ["entry", "template", "host", "shadow"] {
                    let native = match target {
                        "entry" => artifact.render_entry(&state, &options),
                        "template" => artifact.render_template(&state, &options),
                        "host" => artifact.render_host("test-card", &state, &options),
                        _ => artifact.render_shadow("test-card", &state, &options),
                    }
                    .unwrap();
                    let javascript =
                        js(&source, state_json, js_options.clone(), target, "test-card");
                    assert_eq!(json!({"value":native}), javascript, "{target}, {options:?}");
                }
            }
        }
    }
}

#[test]
fn native_output_has_explicit_literal_byte_contracts() {
    let locator = common::make_locator(&[("test-text", "<b title=\"{{x}}\">{{x}}/{{{raw}}}</b>")]);
    let bytes = compile_server_artifact("<test-text></test-text>", &locator).unwrap();
    drop(locator);
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    drop(bytes);
    let state = parse_render_state(r#"{"x":"<&","raw":"<i>raw</i>"}"#).unwrap();
    assert_eq!(artifact.render_entry(&state, &Default::default()).unwrap(),
        "<test-text><template shadowrootmode=\"open\" shadowroot=\"open\"><b title=\"&lt;&amp;\" data-fe=\"1\"><!--fe:b-->&lt;&amp;<!--fe:/b-->/<!--fe:b--><i>raw</i><!--fe:/b--></b></template></test-text>");
    let v2 = NativeRenderOptions {
        markers_v2: true,
        ..Default::default()
    };
    assert_eq!(artifact.render_shadow("test-text", &state, &v2).unwrap(),
        "<template shadowrootmode=\"open\" shadowroot=\"open\"><b title=\"&lt;&amp;\" data-fe-b-0><!--fe-b$$start$$1$$fast-build$$fe-b-->&lt;&amp;<!--fe-b$$end$$1$$fast-build$$fe-b-->/<!--fe-b$$start$$2$$fast-build$$fe-b--><i>raw</i><!--fe-b$$end$$2$$fast-build$$fe-b--></b></template>");
}

#[test]
fn numbers_and_comparisons_match_generated_javascript() {
    let locator = common::make_locator(&[]);
    let entry =
        "{{n}}<f-when value=\"{{a >= b}}\">yes</f-when><f-when value=\"{{a == b}}\">equal</f-when>";
    let source = compile_server_module(entry, &locator, "__FAST_TEST_RUNTIME__").unwrap();
    let artifact =
        CompiledArtifact::load(&compile_server_artifact(entry, &locator).unwrap()).unwrap();
    for state_json in [
        r#"{"n":1e23,"a":"NaN","b":"NaN"}"#,
        r#"{"n":1e-7,"a":"1e3","b":1000}"#,
        r#"{"n":1000000000000000100,"a":"Infinity","b":"inf"}"#,
        r#"{"n":5e-324,"a":" 1","b":1}"#,
        r#"{"n":1.7976931348623157e308,"a":"😀","b":"\uffff"}"#,
        r#"{"n":2.2250738585072014e-308,"a":"0.84551240822557006","b":0.84551240822557006}"#,
        r#"{"n":1.23456789012345678,"a":1.2345678901234567,"b":"1.2345678901234567"}"#,
        r#"{"n":-0,"a":null,"b":false}"#,
        r#"{"a":[],"b":[]}"#,
    ] {
        let state = parse_render_state(state_json).unwrap();
        let native = artifact.render_entry(&state, &Default::default()).unwrap();
        assert_eq!(
            json!({"value":native}),
            js(&source, state_json, json!({}), "entry", ""),
            "{state_json}"
        );
    }
}

#[test]
fn load_rejects_incompatible_malformed_and_deep_artifacts_without_panics() {
    let bytes = compile_server_artifact("{{x}}", &common::make_locator(&[])).unwrap();
    let original: Value = serde_json::from_slice(&bytes).unwrap();
    for (field, value) in [
        ("version", json!(99)),
        ("runtimeVersion", json!(99)),
        ("compilerId", json!("old")),
        ("format", json!("metadata")),
    ] {
        let mut v = original.clone();
        v[field] = value;
        assert_eq!(
            CompiledArtifact::load(v.to_string().as_bytes())
                .unwrap_err()
                .code,
            "incompatible-artifact"
        );
    }
    for mutate in 0..10 {
        let mut v = original.clone();
        match mutate {
            0 => v["entry"] = json!(999),
            1 => v["bodies"][0][0][0] = json!("eval"),
            2 => v["bodies"][0][0] = json!(["call", 999]),
            3 => v["bodies"][0][0] = json!(["binding", [], true]),
            4 => {
                v["bodies"][0][0] = json!(["when", ["compare", "evil", ["x"], ["path", ["y"]]], 0])
            }
            5 => v["bodies"][0] = json!({}),
            6 => v["unexpected"] = json!(true),
            7 => v["components"] = json!({"bad":{"shadow":999,"host":0,"tag":""}}),
            8 => v["bodies"][0][0] = json!(["binding", ["x"], true, "extra"]),
            _ => v["bodies"][0][0] = json!(["element", {}]),
        }
        assert_eq!(
            CompiledArtifact::load(v.to_string().as_bytes())
                .unwrap_err()
                .code,
            "invalid-artifact"
        );
    }
    for invalid in [b"not-json".as_slice(), b"[]", b"null"] {
        assert!(CompiledArtifact::load(invalid).is_err());
    }
    let deep = format!("{}0{}", "[".repeat(200), "]".repeat(200));
    assert!(CompiledArtifact::load(deep.as_bytes()).is_err());
    let mut v = original.clone();
    let mut cond = json!(["truthy", ["x"]]);
    for _ in 0..70 {
        cond = json!(["&&", cond, ["truthy", ["x"]]]);
    }
    v["bodies"][0][0] = json!(["when", cond, 0]);
    assert!(CompiledArtifact::load(v.to_string().as_bytes()).is_err());
}

#[test]
fn native_errors_and_resource_limits_are_request_local() {
    let locator = common::make_locator(&[(
        "test-list",
        "<f-repeat value=\"{{item in items}}\">{{item}}</f-repeat>",
    )]);
    let artifact = CompiledArtifact::load(
        &compile_server_artifact("<test-list></test-list>", &locator).unwrap(),
    )
    .unwrap();
    let state = parse_render_state(r#"{"items":null}"#).unwrap();
    assert_eq!(
        artifact
            .render_entry(&state, &Default::default())
            .unwrap_err()
            .code,
        "repeat-not-array"
    );
    assert_eq!(
        artifact
            .render_host("missing", &state, &Default::default())
            .unwrap_err()
            .code,
        "missing-template"
    );
    assert_eq!(
        artifact
            .render_entry(&JsonValue::Number(f64::NAN), &Default::default())
            .unwrap_err()
            .code,
        "invalid-state"
    );
    assert_eq!(
        artifact
            .render_host("missing", &JsonValue::Number(f64::NAN), &Default::default())
            .unwrap_err()
            .code,
        "invalid-state"
    );
    assert!(parse_render_state(r#"{"unused":"\ud800"}"#).is_err());
    assert!(parse_render_state(r#"{"x":1e9999}"#).is_err());
    assert!(parse_render_state(&format!("{}0{}", "[".repeat(200), "]".repeat(200))).is_err());
    let state = parse_render_state(r#"{"items":[1,2,3]}"#).unwrap();
    let tiny = NativeRenderOptions {
        max_output_bytes: 10,
        ..Default::default()
    };
    assert_eq!(
        artifact.render_entry(&state, &tiny).unwrap_err().code,
        "render-limit"
    );
    let tiny = NativeRenderOptions {
        max_steps: 1,
        ..Default::default()
    };
    assert_eq!(
        artifact.render_entry(&state, &tiny).unwrap_err().code,
        "render-limit"
    );
    assert!(artifact.render_entry(&state, &Default::default()).is_ok());
}

#[test]
fn finite_conditional_cycles_render_and_unbounded_cycles_fail_safely() {
    let locator = common::make_locator(&[("test-cycle", "<f-when value=\"{{node}}\">{{node.label}}<test-cycle :node=\"{{node.next}}\"></test-cycle></f-when>")]);
    let bytes = compile_server_artifact("<test-cycle></test-cycle>", &locator).unwrap();
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    let state_json = r#"{"node":{"label":"a","next":{"label":"b","next":null}}}"#;
    let state = parse_render_state(state_json).unwrap();
    let source = compile_server_module(
        "<test-cycle></test-cycle>",
        &locator,
        "__FAST_TEST_RUNTIME__",
    )
    .unwrap();
    assert_eq!(
        json!({"value":artifact.render_entry(&state, &Default::default()).unwrap()}),
        js(&source, state_json, json!({}), "entry", "")
    );
    let locator = common::make_locator(&[("test-cycle", "<test-cycle></test-cycle>")]);
    let artifact = CompiledArtifact::load(
        &compile_server_artifact("<test-cycle></test-cycle>", &locator).unwrap(),
    )
    .unwrap();
    assert_eq!(
        artifact
            .render_entry(&parse_render_state("{}").unwrap(), &Default::default())
            .unwrap_err()
            .code,
        "render-limit"
    );
}

#[test]
fn state_depth_boundary_is_native_specific_and_includes_unused_state() {
    let artifact =
        CompiledArtifact::load(&compile_server_artifact("ok", &common::make_locator(&[])).unwrap())
            .unwrap();
    let source = artifact.emit_server_module("__FAST_TEST_RUNTIME__");
    for depth in [64, 65] {
        let state = (0..depth).fold(JsonValue::Number(0.0), |value, _| {
            JsonValue::Array(vec![value])
        });
        let state_json = format!("{}0{}", "[".repeat(depth), "]".repeat(depth));
        let native = artifact.render_entry(&state, &Default::default());
        let parsed = parse_render_state(&state_json);
        if depth == 64 {
            assert_eq!(native.unwrap(), "ok");
            assert!(parsed.is_ok());
        } else {
            assert_eq!(native.unwrap_err().code, "invalid-state");
            assert_eq!(parsed.unwrap_err().code, "invalid-state");
        }
        assert_eq!(
            js(&source, &state_json, json!({}), "entry", ""),
            json!({"value":"ok"})
        );
    }
}

#[test]
fn state_value_limit_counts_the_root_and_is_request_local() {
    let artifact =
        CompiledArtifact::load(&compile_server_artifact("ok", &common::make_locator(&[])).unwrap())
            .unwrap();
    let mut state = JsonValue::Array(vec![JsonValue::Null; 999_999]);
    assert_eq!(
        artifact.render_entry(&state, &Default::default()).unwrap(),
        "ok"
    );
    if let JsonValue::Array(values) = &mut state {
        values.push(JsonValue::Null);
    }
    assert_eq!(
        artifact
            .render_entry(&state, &Default::default())
            .unwrap_err()
            .code,
        "invalid-state"
    );
    assert_eq!(
        artifact
            .render_entry(&JsonValue::Null, &Default::default())
            .unwrap(),
        "ok"
    );
}

#[test]
fn step_and_utf8_output_budgets_accept_exact_limits_and_reset_after_errors() {
    let artifact =
        CompiledArtifact::load(&compile_server_artifact("é", &common::make_locator(&[])).unwrap())
            .unwrap();
    let state = JsonValue::Null;
    let exact = NativeRenderOptions {
        max_steps: 1,
        max_output_bytes: 2,
        ..Default::default()
    };
    assert_eq!(artifact.render_entry(&state, &exact).unwrap(), "é");
    for options in [
        NativeRenderOptions {
            max_steps: 0,
            ..exact.clone()
        },
        NativeRenderOptions {
            max_output_bytes: 1,
            ..exact.clone()
        },
    ] {
        assert_eq!(
            artifact.render_entry(&state, &options).unwrap_err().code,
            "render-limit"
        );
        assert_eq!(artifact.render_entry(&state, &exact).unwrap(), "é");
    }
    assert_eq!(
        js(
            &artifact.emit_server_module("__FAST_TEST_RUNTIME__"),
            "null",
            json!({}),
            "entry",
            "",
        ),
        json!({"value":"é"})
    );
}

#[test]
fn native_body_depth_accepts_128_nested_calls_but_not_129() {
    let bytes = compile_server_artifact("ok", &common::make_locator(&[])).unwrap();
    let original: Value = serde_json::from_slice(&bytes).unwrap();
    for depth in [128, 129] {
        let mut ir = original.clone();
        ir["entry"] = json!(0);
        ir["bodies"] = json!((0..depth)
            .map(|index| json!([["call", index + 1]]))
            .chain(std::iter::once(json!([["literal", "ok"]])))
            .collect::<Vec<_>>());
        let artifact = CompiledArtifact::load(ir.to_string().as_bytes()).unwrap();
        let native = artifact.render_entry(&JsonValue::Null, &Default::default());
        if depth == 128 {
            assert_eq!(native.unwrap(), "ok");
        } else {
            assert_eq!(native.unwrap_err().code, "render-limit");
        }
        assert_eq!(
            js(
                &artifact.emit_server_module("__FAST_TEST_RUNTIME__"),
                "null",
                json!({}),
                "entry",
                "",
            ),
            json!({"value":"ok"})
        );
    }
}

#[test]
fn deployment_activation_preserves_in_flight_handles_and_owned_results() {
    let locator = common::make_locator(&[]);
    let old = compile_server_artifact("old {{value}}", &locator).unwrap();
    let new = compile_server_artifact("new {{value}}", &locator).unwrap();
    let mut active = CompiledArtifact::load(&old).unwrap();
    let in_flight = active.clone();
    let state = parse_render_state(r#"{"value":"request"}"#).unwrap();
    let completed = active.render_entry(&state, &Default::default()).unwrap();
    let mut incompatible: Value = serde_json::from_slice(&new).unwrap();
    incompatible["compilerId"] = json!("another-deployment");
    assert_eq!(
        CompiledArtifact::load(incompatible.to_string().as_bytes())
            .unwrap_err()
            .code,
        "incompatible-artifact"
    );
    assert_eq!(
        active.render_entry(&state, &Default::default()).unwrap(),
        "old request"
    );
    active = CompiledArtifact::load(&new).unwrap();
    drop((locator, old, new));
    assert_eq!(
        active.render_entry(&state, &Default::default()).unwrap(),
        "new request"
    );
    assert_eq!(
        in_flight.render_entry(&state, &Default::default()).unwrap(),
        "old request"
    );
    drop((active, in_flight, state));
    assert_eq!(completed, "old request");
}

#[test]
fn artifact_ownership_is_send_sync_and_concurrent_requests_are_isolated() {
    fn send_sync<T: Send + Sync>() {}
    send_sync::<CompiledArtifact>();
    let artifact = CompiledArtifact::load(
        &compile_server_artifact("{{value}}", &common::make_locator(&[])).unwrap(),
    )
    .unwrap();
    let workers = (0..8)
        .map(|i| {
            let artifact = artifact.clone();
            std::thread::spawn(move || {
                let state = parse_render_state(&format!("{{\"value\":{i}}}")).unwrap();
                for _ in 0..10 {
                    assert_eq!(
                        artifact.render_entry(&state, &Default::default()).unwrap(),
                        i.to_string()
                    );
                }
            })
        })
        .collect::<Vec<_>>();
    for worker in workers {
        worker.join().unwrap();
    }
}
