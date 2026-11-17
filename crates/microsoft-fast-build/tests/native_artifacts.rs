mod common;

use microsoft_fast_build::{
    compile_server_artifact, compile_server_module, parse_render_state, AttributeNameStrategy,
    CompiledArtifact, JsonValue, Locator, NativeRenderOptions, PreparedState,
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

fn js_semantic_plan(plan: &Value) -> String {
    let mut plan = plan.clone();
    plan["format"] = json!("fast-server-js");
    format!(
        "import {{ createServerRenderer }} from \"__FAST_TEST_RUNTIME__\";\n\
         export const {{ prepareState, renderEntry, renderTemplate, renderHost, renderShadow, renderEntryJson, renderTemplateJson, renderHostJson, renderShadowJson, renderEntryPrepared, renderTemplatePrepared, renderHostPrepared, renderShadowPrepared }} = createServerRenderer({plan});"
    )
}

#[test]
fn static_markup_does_not_expand_into_per_tag_rendering_code() {
    let locator = common::make_locator(&[]);
    for count in [64, 256] {
        let entry = "<section class=\"panel\"><h2>Static &amp; text</h2><p title='fixed'>Payload</p><br /></section>\n".repeat(count);
        let bytes = compile_server_artifact(&entry, &locator).unwrap();
        let ir: Value = serde_json::from_slice(&bytes).unwrap();
        let body = &ir["entry"];
        assert_eq!(
            body,
            &json!([{"type":"literal","html":entry}]),
            "invariant static tags should form one literal run"
        );
        let artifact = CompiledArtifact::load(&bytes).unwrap();
        let source = compile_server_module(&entry, &locator, "__FAST_TEST_RUNTIME__").unwrap();
        assert!(
            source.len() < entry.len() * 3 / 2,
            "static output expanded into generalized JavaScript"
        );
        assert_eq!(
            artifact
                .render_entry(&common::empty_root(), &Default::default())
                .unwrap(),
            entry
        );
        assert_eq!(
            json!({"value":entry}),
            js(&source, "{}", json!({}), "entry", "")
        );
    }
}

#[test]
fn static_runs_preserve_hydration_whitespace_escaping_and_selection() {
    let prefix = "<section class='fixed'>Static &amp; text<br /></section>\n";
    let variant = "<p  title='raw &amp;' :value=\"static\"> spaced </p>";
    let stripped = "<p title='raw &amp;'> spaced </p>";
    let suffix = "\n<svg viewBox='0 0 1 1'><path d='M0 0' /></svg>";
    let template = format!("{prefix}{variant}<b title=\"{{{{label}}}}\">{{{{label}}}}</b>{suffix}");
    let locator = common::make_locator_with_host_attrs(&[(
        "test-static",
        &template,
        &[("title", Some("A < & \" default"))],
    )]);
    let entry = "<test-static></test-static>";
    let bytes = compile_server_artifact(entry, &locator).unwrap();
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    let source = compile_server_module(entry, &locator, "__FAST_TEST_RUNTIME__").unwrap();
    let state_json = r#"{"label":"<&"}"#;
    let state = parse_render_state(state_json).unwrap();
    for v2 in [false, true] {
        let options = NativeRenderOptions {
            markers_v2: v2,
            ..Default::default()
        };
        let bound = if v2 {
            "<b title=\"&lt;&amp;\" data-fe-b-0><!--fe-b$$start$$1$$fast-build$$fe-b-->&lt;&amp;<!--fe-b$$end$$1$$fast-build$$fe-b--></b>"
        } else {
            "<b title=\"&lt;&amp;\" data-fe=\"1\"><!--fe:b-->&lt;&amp;<!--fe:/b--></b>"
        };
        let shadow = format!("<template shadowrootmode=\"open\" shadowroot=\"open\">{prefix}{stripped}{bound}{suffix}</template>");
        let expected =
            format!("<test-static title=\"A &lt; &amp; &quot; default\">{shadow}</test-static>");
        assert_eq!(artifact.render_entry(&state, &options).unwrap(), expected);
        assert_eq!(
            artifact
                .render_shadow("test-static", &state, &options)
                .unwrap(),
            shadow
        );
        assert_eq!(
            json!({"value":expected}),
            js(&source, state_json, json!({"markersV2":v2}), "entry", "")
        );
        let deselected = NativeRenderOptions {
            dsd: Some(vec![]),
            ..options
        };
        assert_eq!(
            artifact.render_entry(&state, &deselected).unwrap(),
            "<test-static></test-static>"
        );
        let plain =
            CompiledArtifact::load(&compile_server_artifact(&template, &locator).unwrap()).unwrap();
        assert_eq!(
            plain.render_template(&state, &deselected).unwrap(),
            format!("{prefix}{variant}<b title=\"&lt;&amp;\">&lt;&amp;</b>{suffix}")
        );
    }
}

#[test]
fn instance_constants_do_not_duplicate_javascript_element_functions() {
    let locator = common::make_locator(&[(
        "test-item",
        "<article title=\"{{index}}\">{{index}}/{{dataset.x}}</article>",
    )]);
    for count in [64, 256] {
        let entry = (0..count)
            .map(|index| {
                format!("<test-item index=\"{index}\" data-x=\"value-{index}\" style=\"--index:{index}\"></test-item>")
            })
            .collect::<String>();
        let source = compile_server_module(&entry, &locator, "__FAST_TEST_RUNTIME__").unwrap();
        assert!(
            source.matches("function ").count() < 16,
            "instance constants duplicated executable functions for {count} hosts"
        );
        let artifact =
            CompiledArtifact::load(&compile_server_artifact(&entry, &locator).unwrap()).unwrap();
        let native = artifact
            .render_entry(&common::empty_root(), &Default::default())
            .unwrap();
        assert_eq!(
            json!({"value":native}),
            js(&source, "{}", json!({}), "entry", "")
        );
        assert!(native.contains(&format!("value-{}", count - 1)));
    }
}

#[test]
fn shared_element_shapes_preserve_overlays_light_dom_and_marker_modes() {
    let locator = common::make_locator_with_host_attrs(&[
        ("test-parent", "<test-item index=\"first\" data-x=\"one\" foo-bar=\"camel-one\" :dataset='{\"base\":\"local\"}' :item=\"{{item}}\" title=\"prefix {{title}}\">light</test-item><test-item index=\"second\" data-x=\"two\" foo-bar=\"camel-two\" :dataset='{\"base\":\"local\"}' :item=\"{{item}}\" title=\"prefix {{title}}\">light</test-item>", &[]),
        ("test-item", "{{index}}/{{dataset.x}}/{{dataset.base}}/{{fooBar}}/{{foo-bar}}/{{item.name}}", &[("role", Some("group")), ("title", Some("default")), ("data-fe", Some("authored"))]),
    ]);
    let source = compile_server_module(
        "<test-parent></test-parent>",
        &locator,
        "__FAST_TEST_RUNTIME__",
    )
    .unwrap();
    let artifact = CompiledArtifact::load(
        &compile_server_artifact("<test-parent></test-parent>", &locator).unwrap(),
    )
    .unwrap();
    for state_json in [
        r#"{"title":"<&","item":{"name":"first request"}}"#,
        r#"{"title":null,"item":{"name":"second request"}}"#,
    ] {
        let state = parse_render_state(state_json).unwrap();
        for v2 in [false, true] {
            for strategy in [
                AttributeNameStrategy::CamelCase,
                AttributeNameStrategy::None,
            ] {
                for dsd in [None, Some(vec!["test-parent".to_string()])] {
                    let options = NativeRenderOptions {
                        markers_v2: v2,
                        attribute_name_strategy: strategy,
                        dsd: dsd.clone(),
                        ..Default::default()
                    };
                    let mut js_options = json!({
                        "markersV2":v2,
                        "attributeNameStrategy":if strategy == AttributeNameStrategy::None {"none"} else {"camelCase"},
                    });
                    if let Some(names) = dsd {
                        js_options["dsd"] = json!(names);
                    }
                    let native = artifact.render_entry(&state, &options).unwrap();
                    assert_eq!(
                        json!({"value":native}),
                        js(&source, state_json, js_options, "entry", ""),
                        "{state_json}, {options:?}"
                    );
                }
            }
        }
    }
}

#[test]
fn all_render_targets_share_state_markers_selection_and_bytes() {
    let locator = locator();
    let entry = "<f-repeat value=\"{{item in items}}\"><test-card :item=\"{{item}}\" label=\"{{label}}\" foo-bar=\"custom\">{{$index}}/{{item.name}}</test-card></f-repeat>";
    let source = compile_server_module(entry, &locator, "__FAST_TEST_RUNTIME__").unwrap();
    let bytes = compile_server_artifact(entry, &locator).unwrap();
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    let state_json = r#"{"label":"& < > \" ' 😀","items":[{"name":"one"},{"name":null},false],"item":{"name":"resolved"},"dataset":{"inherited":"yes"},"fooBar":"camel","foo-bar":"dash"}"#;
    let state = parse_render_state(state_json).unwrap();
    let prepared = PreparedState::new(&state).unwrap();
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
                    let reused = match target {
                        "entry" => artifact.render_entry_prepared(&prepared, &options),
                        "template" => artifact.render_template_prepared(&prepared, &options),
                        "host" => artifact.render_host_prepared("test-card", &prepared, &options),
                        _ => artifact.render_shadow_prepared("test-card", &prepared, &options),
                    }
                    .unwrap();
                    assert_eq!(native, reused, "{target}, {options:?}");
                    let fresh = match target {
                        "entry" => artifact.render_entry_json(state_json, &options),
                        "template" => artifact.render_template_json(state_json, &options),
                        "host" => artifact.render_host_json("test-card", state_json, &options),
                        _ => artifact.render_shadow_json("test-card", state_json, &options),
                    }
                    .unwrap();
                    assert_eq!(native, fresh, "fresh {target}, {options:?}");
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
fn native_semantic_schema_loads_without_execution_tables_or_build_metadata() {
    let bytes = br#"{"format":"fast-server-native","version":1,"entry":[{"type":"binding","path":["value"],"escape":true}],"templates":{},"components":{}}"#;
    let artifact = CompiledArtifact::load(bytes).unwrap();
    let state = parse_render_state(r#"{"value":"Compatible & native"}"#).unwrap();
    assert_eq!(
        artifact.render_entry(&state, &Default::default()).unwrap(),
        "Compatible &amp; native"
    );
    let emitted = compile_server_artifact("{{value}}", &common::make_locator(&[])).unwrap();
    let expected: Value = serde_json::from_slice(bytes).unwrap();
    assert_eq!(serde_json::from_slice::<Value>(&emitted).unwrap(), expected);
}

#[test]
fn component_templates_share_content_but_preserve_distinct_host_defaults() {
    let content = format!("{}{{{{label}}}}", "x".repeat(32_768));
    let locator = common::make_locator_with_host_attrs(&[
        ("one-card", &content, &[("role", Some("group"))]),
        ("two-card", &content, &[("role", Some("note"))]),
    ]);
    let bytes = compile_server_artifact("", &locator).unwrap();
    assert!(bytes.len() < 50_000, "shared component content expanded");
    let plan: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(plan["templates"].as_object().unwrap().len(), 3);
    assert!(plan["components"]
        .as_object()
        .unwrap()
        .values()
        .all(Value::is_string));
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    let source = compile_server_module("", &locator, "__FAST_TEST_RUNTIME__").unwrap();
    let state = parse_render_state(r#"{"label":"<&"}"#).unwrap();
    let one = artifact
        .render_host("one-card", &state, &Default::default())
        .unwrap();
    let two = artifact
        .render_host("two-card", &state, &Default::default())
        .unwrap();
    assert!(one.starts_with("<one-card role=\"group\">"));
    assert!(two.starts_with("<two-card role=\"note\">"));
    assert!(one.ends_with("<!--fe:b-->&lt;&amp;<!--fe:/b--></template></one-card>"));
    assert!(two.ends_with("<!--fe:b-->&lt;&amp;<!--fe:/b--></template></two-card>"));
    for (name, expected) in [("one-card", one), ("two-card", two)] {
        assert_eq!(
            js(&source, r#"{"label":"<&"}"#, json!({}), "host", name),
            json!({"value":expected}),
        );
    }
}

#[test]
fn shared_component_metadata_has_a_bounded_native_expansion() {
    let large = "x".repeat(1024 * 1024);
    let locator = common::make_locator_with_host_attrs(&[(
        "test-card",
        "content",
        &[("title", Some(&large))],
    )]);
    let bytes = compile_server_artifact("", &locator).unwrap();
    let mut plan: Value = serde_json::from_slice(&bytes).unwrap();
    let reference = plan["components"]["test-card"].clone();
    plan["components"] = Value::Object(
        (0..100)
            .map(|index| (format!("test-card-{index}"), reference.clone()))
            .collect(),
    );
    assert_eq!(
        CompiledArtifact::load(plan.to_string().as_bytes())
            .unwrap_err()
            .code,
        "invalid-artifact"
    );
}

#[test]
fn unreachable_semantic_templates_reject_bad_operations_refs_and_static_trees_eagerly() {
    let original = json!({
        "format":"fast-server-native", "version":1,
        "entry":[{"type":"literal","html":"ok"}],
        "templates":{"unused":[]},
        "components":{},
    });
    for bad in [
        json!({"type":"unknown"}),
        json!({"type":"template","name":u64::MAX}),
        json!({"type":"template","name":"missing"}),
        json!({"type":"when","condition":{"type":"truthy","path":["x"]},"template":-1}),
        json!({"type":"repeat","alias":["item"],"collection":["items"],"diagnostic":"item in items","template":1.0}),
        json!({"type":"when","condition":{"type":"compare","operator":"==","path":["x"],
            "value":{"type":"value","value":{"type":"object","value":{"unused":{"type":"array","value":[{"type":"number","value":"not-a-number"}]}}}}},
            "template":"unused"}),
        json!({"type":"when","condition":{"type":"compare","operator":"==","path":["x"],
            "value":{"type":"value","value":{"type":"object","value":{"unused":{"type":"array","value":[{"type":"string","value":false}]}}}}},
            "template":"unused"}),
        json!({"type":"when","condition":{"type":"compare","operator":"==","path":["x"],
            "value":{"type":"value","value":{"type":"array","value":[{"type":"eval","value":"0"}]}}},
            "template":"unused"}),
    ] {
        let mut ir = original.clone();
        ir["templates"]["unused"] = json!([bad]);
        assert_eq!(
            CompiledArtifact::load(ir.to_string().as_bytes())
                .unwrap_err()
                .code,
            "invalid-artifact",
            "{ir}",
        );
    }
    for reference in [json!(u64::MAX), json!(-1), json!(0.5), json!("missing")] {
        let mut ir = original.clone();
        ir["components"]["unused"] = reference;
        assert_eq!(
            CompiledArtifact::load(ir.to_string().as_bytes())
                .unwrap_err()
                .code,
            "invalid-artifact",
        );
    }
}

#[test]
fn typed_dispatch_preserves_exact_logical_charges_and_js_parity_in_all_contexts() {
    let ir = json!({
        "format":"fast-server-native", "version":1,
        "entry":[
                {"type":"tag","plain":[{"type":"literal","html":"<i>"}], "hydrated":[],
                    "count":0,"ending":""},
                {"type":"when","condition":{"type":"truthy","path":["show"]},"template":"when"},
                {"type":"repeat","alias":["item"],"collection":["items"],"diagnostic":"item in items","template":"repeat"},
                {"type":"element","name":"x-card","body":"light","closing":"</x-card>",
                    "opening":{"plain":[{"type":"literal","html":"<x-card>"}],"hydrated":[],
                        "count":0,"ending":""},
                    "props":[{"camelCase":"value","unchanged":"value","dataset":null,
                        "value":{"type":"value","value":{"type":"number","value":"01.00"}}}],
                    "entry":[{"type":"literal","html":"<x-card"}],"normal":[{"type":"literal","html":"<x-card"}],
                    "count":0,"defaults":[{"name":"role","attribute":{"type":"literal","html":" role=\"group\""}}]},
        ],
        "templates":{
            "when":[{"type":"template","name":"literal"}],
            "repeat":[{"type":"binding","path":["item","x"],"escape":true}],
            "light":[{"type":"literal","html":"L"}],
            "literal":[{"type":"literal","html":"W"}],
            "card":[
                {"type":"host-attributes","attributes":[{"name":"role","attribute":{"type":"literal","html":" role=\"group\""}}]},
                {"type":"literal","html":"<template>"},
                {"type":"binding","path":["value"],"escape":true},
                {"type":"literal","html":"</template>"},
            ],
        },
        "components":{"x-card":"card"},
    });
    let artifact = CompiledArtifact::load(ir.to_string().as_bytes()).unwrap();
    let source = js_semantic_plan(&ir);
    let state_json = r#"{"show":true,"items":[{"x":"&"},{"x":"é"}],"value":"root"}"#;
    let state = parse_render_state(state_json).unwrap();
    let prepared = PreparedState::new(&state).unwrap();
    let expected =
        "<i>W&amp;é<x-card role=\"group\"><template><!--fe:b-->1<!--fe:/b--></template>L</x-card>";
    let exact = NativeRenderOptions {
        max_steps: 16,
        max_output_bytes: expected.len(),
        ..Default::default()
    };
    for target in ["entry", "template"] {
        let ordinary = |options: &NativeRenderOptions| match target {
            "entry" => artifact.render_entry(&state, options),
            "template" => artifact.render_template(&state, options),
            _ => unreachable!(),
        };
        let snapshot = |options: &NativeRenderOptions| match target {
            "entry" => artifact.render_entry_prepared(&prepared, options),
            "template" => artifact.render_template_prepared(&prepared, options),
            _ => unreachable!(),
        };
        assert_eq!(ordinary(&exact).unwrap(), expected);
        assert_eq!(snapshot(&exact).unwrap(), expected);
        for short in [
            NativeRenderOptions {
                max_steps: 15,
                ..exact.clone()
            },
            NativeRenderOptions {
                max_output_bytes: expected.len() - 1,
                ..exact.clone()
            },
        ] {
            assert_eq!(ordinary(&short).unwrap_err().code, "render-limit");
            assert_eq!(snapshot(&short).unwrap_err().code, "render-limit");
        }
        assert_eq!(ordinary(&exact).unwrap(), expected);
        assert_eq!(
            js(&source, state_json, json!({}), target, "x-card"),
            json!({"value":expected}),
        );
    }
    let shadow = "<template><!--fe:b-->root<!--fe:/b--></template>";
    let host = format!("<x-card role=\"group\">{shadow}</x-card>");
    assert_eq!(
        artifact
            .render_host("x-card", &state, &Default::default())
            .unwrap(),
        host,
    );
    assert_eq!(
        artifact
            .render_host_prepared("x-card", &prepared, &Default::default())
            .unwrap(),
        host,
    );
    assert_eq!(
        js(&source, state_json, json!({}), "host", "x-card"),
        json!({"value":host}),
    );
    let exact = NativeRenderOptions {
        max_steps: 1,
        max_output_bytes: shadow.len(),
        ..Default::default()
    };
    assert_eq!(
        artifact.render_shadow("x-card", &state, &exact).unwrap(),
        shadow
    );
    assert_eq!(
        artifact
            .render_shadow_prepared("x-card", &prepared, &exact)
            .unwrap(),
        shadow
    );
    assert_eq!(
        js(&source, state_json, json!({}), "shadow", "x-card"),
        json!({"value":shadow}),
    );
}

#[test]
fn prepared_numeric_path_segments_keep_object_keys_and_repeat_masking() {
    let entry = "{{values.+01}}/{{values.000}}/{{values.length}}/{{object.+01}}/{{object.length}}/{{values.999999999999999999999999999999}}/<f-repeat value=\"{{item in items}}\">{{item.name}}<f-repeat value=\"{{item in item.children}}\">{{item.name}}/{{$index}}</f-repeat>{{item.name}};</f-repeat>";
    let artifact = CompiledArtifact::load(
        &compile_server_artifact(entry, &common::make_locator(&[])).unwrap(),
    )
    .unwrap();
    let state_json = r#"{"values":["zero","one"],"object":{"+01":"key","length":"own"},"item":{"name":"parent"},"items":[{"name":"outer","children":[{"name":"inner"},{}]}]}"#;
    let state = parse_render_state(state_json).unwrap();
    let expected = "one/zero/2/key/own//outerinner/0/1outer;";
    assert_eq!(
        artifact.render_entry(&state, &Default::default()).unwrap(),
        expected
    );
    assert_eq!(
        js(
            &compile_server_module(entry, &common::make_locator(&[]), "__FAST_TEST_RUNTIME__")
                .unwrap(),
            state_json,
            json!({}),
            "entry",
            ""
        ),
        json!({"value":expected}),
    );
}

#[test]
fn typed_element_dispatch_keeps_shadow_before_host_failure_precedence() {
    let locator = common::make_locator_with_host_attrs(&[(
        "test-order",
        "<f-repeat value=\"{{item in items}}\">{{item}}</f-repeat>",
        &[("title", Some("oversized host attribute"))],
    )]);
    let artifact = CompiledArtifact::load(
        &compile_server_artifact("<test-order></test-order>", &locator).unwrap(),
    )
    .unwrap();
    let state = parse_render_state(r#"{"items":null}"#).unwrap();
    let prepared = PreparedState::new(&state).unwrap();
    let zero_output = NativeRenderOptions {
        max_output_bytes: 0,
        ..Default::default()
    };
    for result in [
        artifact.render_entry(&state, &zero_output),
        artifact.render_template(&state, &zero_output),
        artifact.render_host("test-order", &state, &zero_output),
        artifact.render_entry_prepared(&prepared, &zero_output),
        artifact.render_template_prepared(&prepared, &zero_output),
        artifact.render_host_prepared("test-order", &prepared, &zero_output),
    ] {
        assert_eq!(result.unwrap_err().code, "repeat-not-array");
    }
    // The shadow-only API writes its template tag before evaluating the body.
    assert_eq!(
        artifact
            .render_shadow("test-order", &state, &zero_output)
            .unwrap_err()
            .code,
        "render-limit",
    );
    let skipped = NativeRenderOptions {
        dsd: Some(vec![]),
        ..zero_output
    };
    assert_eq!(
        artifact
            .render_shadow_prepared("test-order", &prepared, &skipped)
            .unwrap(),
        "",
    );
    assert_eq!(
        artifact.render_entry(&state, &skipped).unwrap_err().code,
        "render-limit"
    );
    let valid = parse_render_state(r#"{"items":["ok"]}"#).unwrap();
    assert!(artifact
        .render_entry(&valid, &Default::default())
        .unwrap()
        .contains("ok"));
}

#[test]
fn typed_static_operands_are_isolated_across_concurrent_contexts() {
    let locator = common::make_locator_with_host_attrs(&[(
        "test-static-data",
        "{{dataset.base}}/{{dataset.label}}/{{label}}",
        &[("title", Some("{{label}}"))],
    )]);
    let entry = "<test-static-data :dataset='{\"base\":\"static\",\"number\":1}' data-label=\"{{label}}\" label=\"{{label}}\"></test-static-data>";
    let bytes = compile_server_artifact(entry, &locator).unwrap();
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    let source = compile_server_module(entry, &locator, "__FAST_TEST_RUNTIME__").unwrap();
    drop((bytes, locator));
    std::thread::scope(|scope| {
        for i in 0..4 {
            let artifact = artifact.clone();
            let source = &source;
            scope.spawn(move || {
                let state_json = json!({"label":format!("request-{i}"),"dataset":{"base":"root","label":"resolved"}}).to_string();
                let state = parse_render_state(&state_json).unwrap();
                let prepared = PreparedState::new(&state).unwrap();
                let options = NativeRenderOptions { markers_v2:i%2 == 0, ..Default::default() };
                let entry = artifact.render_entry(&state, &options).unwrap();
                let template = artifact.render_template(&state, &options).unwrap();
                let host = artifact.render_host("test-static-data", &state, &options).unwrap();
                let shadow = artifact.render_shadow("test-static-data", &state, &options).unwrap();
                for _ in 0..2 {
                    let short = NativeRenderOptions { max_steps:0, ..options.clone() };
                    assert_eq!(artifact.render_entry_prepared(&prepared, &short).unwrap_err().code, "render-limit");
                    assert_eq!(artifact.render_entry_prepared(&prepared, &options).unwrap(), entry);
                    assert_eq!(artifact.render_template_prepared(&prepared, &options).unwrap(), template);
                    assert_eq!(artifact.render_host_prepared("test-static-data", &prepared, &options).unwrap(), host);
                    assert_eq!(artifact.render_shadow_prepared("test-static-data", &prepared, &options).unwrap(), shadow);
                }
                assert_eq!(
                    js(source, &state_json, json!({"markersV2":options.markers_v2}), "entry", ""),
                    json!({"value":entry}),
                );
            });
        }
    });
}

#[test]
fn load_rejects_incompatible_malformed_and_deep_artifacts_without_panics() {
    let bytes = compile_server_artifact("{{x}}", &common::make_locator(&[])).unwrap();
    let original: Value = serde_json::from_slice(&bytes).unwrap();
    for (field, value) in [
        ("version", json!(0)),
        ("version", json!(2)),
        ("version", json!(3)),
        ("version", json!(99)),
        ("version", json!("1")),
        ("version", json!(2.5)),
        ("version", json!(null)),
        ("format", json!("metadata")),
        ("format", json!("fast-server")),
        ("format", json!("fast-server-js")),
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
    for mutate in 0..17 {
        let mut v = original.clone();
        match mutate {
            0 => v["entry"] = json!(999),
            1 => v["entry"][0]["type"] = json!("eval"),
            2 => v["entry"][0] = json!({"type":"template","name":"missing"}),
            3 => v["entry"][0]["path"] = json!([]),
            4 => {
                v["entry"][0] = json!({
                    "type":"when","template":"missing",
                    "condition":{"type":"compare","operator":"evil","path":["x"],"value":{"type":"path","path":["y"]}}
                })
            }
            5 => v["entry"] = json!({}),
            6 => v["unexpected"] = json!(true),
            7 => v["components"] = json!({"bad":{"shadow":999,"host":0,"tag":""}}),
            8 => v["entry"][0]["unexpected"] = json!(true),
            9 => v["entry"][0] = json!({"type":"element"}),
            10 => {
                v["entry"][0] = json!({"type":"repeat","alias":["item"],"collection":["items"],"diagnostic":"item in items","template":"missing"})
            }
            11 => {
                v["entry"][0] = json!({"type":"when","condition":{"type":"truthy","path":["x"]},"template":"missing"})
            }
            12 => v["components"] = json!({"bad":"missing"}),
            13 => v["templates"] = json!({"unused":[{"type":"template","name":"missing"}]}),
            14 => v["entry"][0] = json!(["call", 0]),
            15 => v["entry"][0] = json!(["fragment", "missing"]),
            _ => v["entry"][0] = json!({"type":"template","name":0}),
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
    let mut cond = json!({"type":"truthy","path":["x"]});
    for _ in 0..70 {
        cond = json!({"type":"and","left":cond,"right":{"type":"truthy","path":["x"]}});
    }
    v["entry"][0] = json!({"type":"when","condition":cond,"template":"missing"});
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
    let source =
        compile_server_module("ok", &common::make_locator(&[]), "__FAST_TEST_RUNTIME__").unwrap();
    for depth in [64, 65] {
        let state = (0..depth).fold(JsonValue::Number(0.0), |value, _| {
            JsonValue::Array(vec![value])
        });
        let state_json = format!("{}0{}", "[".repeat(depth), "]".repeat(depth));
        let native = artifact.render_entry(&state, &Default::default());
        let parsed = parse_render_state(&state_json);
        let prepared = PreparedState::new(&state);
        if depth == 64 {
            assert_eq!(native.unwrap(), "ok");
            assert!(parsed.is_ok());
            assert!(prepared.is_ok());
        } else {
            assert_eq!(native.unwrap_err().code, "invalid-state");
            assert_eq!(parsed.unwrap_err().code, "invalid-state");
            assert_eq!(prepared.unwrap_err().code, "invalid-state");
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
    assert!(PreparedState::new(&state).is_ok());
    let mut json = format!("[{}null]", "null,".repeat(999_998));
    assert_eq!(
        artifact
            .render_entry_json(&json, &Default::default())
            .unwrap(),
        "ok"
    );
    json.insert_str(1, "null,");
    assert_eq!(
        artifact
            .render_entry_json(&json, &Default::default())
            .unwrap_err()
            .code,
        "invalid-state"
    );
    // Budgets count the final retained tree, not overwritten duplicate values.
    assert!(parse_render_state(&format!(r#"{{"unused":{json},"unused":null}}"#)).is_ok());
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
        PreparedState::new(&state).unwrap_err().code,
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
fn fresh_json_preserves_normalization_full_validation_and_error_precedence() {
    let artifact = CompiledArtifact::load(
        &compile_server_artifact("{{zero}}/{{label}}", &common::make_locator(&[])).unwrap(),
    )
    .unwrap();
    let state_json = r#"{"zero":-0,"label":"first","label":"<&😀é","unused":{"constructor":null,"__proto__":[true,9007199254740993,1e-300]}}"#;
    let parsed = parse_render_state(state_json).unwrap();
    if let JsonValue::Object(values) = &parsed {
        assert!(matches!(values.get("zero"), Some(JsonValue::Number(n)) if !n.is_sign_negative()));
    }
    let expected = "0/&lt;&amp;😀é";
    assert_eq!(
        artifact
            .render_entry_json(state_json, &Default::default())
            .unwrap(),
        expected
    );
    assert_eq!(
        artifact.render_entry(&parsed, &Default::default()).unwrap(),
        expected
    );
    for json in [
        r#"{"unused":"\ud800","unused":null}"#,
        r#"{"unused":1e999,"unused":null}"#,
        r#"{"zero":0} trailing"#,
    ] {
        assert_eq!(
            artifact
                .render_entry_json(json, &Default::default())
                .unwrap_err()
                .code,
            "invalid-state"
        );
        assert_eq!(
            artifact
                .render_host_json("missing", json, &Default::default())
                .unwrap_err()
                .code,
            "invalid-state"
        );
        let unselected = NativeRenderOptions {
            dsd: Some(vec![]),
            ..Default::default()
        };
        assert_eq!(
            artifact
                .render_shadow_json("missing", json, &unselected)
                .unwrap_err()
                .code,
            "invalid-state"
        );
    }
    for depth in [64, 65] {
        let json = format!("{}0{}", "[".repeat(depth), "]".repeat(depth));
        let result = artifact.render_entry_json(&json, &Default::default());
        assert_eq!(result.is_ok(), depth == 64);
    }
    let json = format!(
        r#"{{"deep":{}0{},"bad":"\ud800"}}"#,
        "[".repeat(65),
        "]".repeat(65)
    );
    let parser_error = serde_json::from_str::<Value>(&json)
        .unwrap_err()
        .to_string();
    assert_eq!(parse_render_state(&json).unwrap_err().message, parser_error);
    assert_eq!(
        artifact
            .render_entry_json(state_json, &Default::default())
            .unwrap(),
        expected
    );
}

#[test]
fn borrowed_nested_repeats_keep_exact_step_budgets_and_recover() {
    let entry = r#"<f-repeat value="{{item in groups}}"><f-repeat value="{{item in item.items}}">{{item.label}}</f-repeat></f-repeat>"#;
    let artifact = CompiledArtifact::load(
        &compile_server_artifact(entry, &common::make_locator(&[])).unwrap(),
    )
    .unwrap();
    let json = json!({
        "groups": vec![json!({"items":vec![json!({"label":"é"});4]});3]
    })
    .to_string();
    let state = parse_render_state(&json).unwrap();
    let prepared = PreparedState::from_json(&json).unwrap();
    // One outer repeat plus three (iteration + repeat + four pairs of
    // inner iteration/binding). Lexical-frame management consumes no steps.
    let exact = NativeRenderOptions {
        max_steps: 31,
        max_output_bytes: 24,
        ..Default::default()
    };
    let short = NativeRenderOptions {
        max_steps: 30,
        ..exact.clone()
    };
    let expected = "é".repeat(12);
    assert_eq!(artifact.render_entry(&state, &exact).unwrap(), expected);
    assert_eq!(
        artifact.render_entry_prepared(&prepared, &exact).unwrap(),
        expected
    );
    assert_eq!(artifact.render_entry_json(&json, &exact).unwrap(), expected);
    assert_eq!(
        artifact.render_entry_json(&json, &short).unwrap_err().code,
        "render-limit"
    );
    assert_eq!(artifact.render_entry_json(&json, &exact).unwrap(), expected);
}

#[test]
fn nested_repeat_payloads_preserve_aliases_overlay_masking_and_owned_results() {
    let locator = common::make_locator(&[(
        "borrow-leaf",
        "{{item.label}}/{{outer.label}}/{{dataset.keep}}/{{dataset.note}}/{{masked.value}}",
    )]);
    let entry = r#"<f-repeat value="{{outer in groups}}">{{outer.label}}:<f-repeat value="{{inner in outer.items}}">{{outer.label}}/{{inner.label}}/{{$index}}<borrow-leaf :item="{{inner}}" :outer="{{outer}}" :masked="{{inner.masked}}" data-note="{{inner.label}}">caller {{outer.label}}/{{inner.label}}</borrow-leaf><f-repeat value="{{outer in inner.children}}">{{outer.label}}/{{$index}}</f-repeat>{{outer.label}}</f-repeat><f-repeat value="{{outer in outer.items}}">{{outer.label}}/{{$index}}</f-repeat>{{outer.label}}</f-repeat>"#;
    let artifact =
        CompiledArtifact::load(&compile_server_artifact(entry, &locator).unwrap()).unwrap();
    let source = compile_server_module(entry, &locator, "__FAST_TEST_RUNTIME__").unwrap();
    let mut previous = None;
    for payload_bytes in [0, 1024, 131_072] {
        let payload = "é".repeat(payload_bytes / 2);
        let state_json = json!({
            "groups": (0..3).map(|i| json!({
                "label": format!("outer-{i}"),
                "payload": payload,
                "items": (0..4).map(|j| json!({
                    "label": format!("inner-{j}"),
                    "masked": null,
                    "payload": payload,
                    "children": [{"label":"deep<&😀","payload":payload}]
                })).collect::<Vec<_>>()
            })).collect::<Vec<_>>(),
            "dataset": {"keep":"retained"},
            "masked": {"value":"must-not-leak"}
        })
        .to_string();
        let state = parse_render_state(&state_json).unwrap();
        let original = state.clone();
        let prepared = PreparedState::from_json(&state_json).unwrap();
        for v2 in [false, true] {
            for dsd in [None, Some(vec![])] {
                let options = NativeRenderOptions {
                    markers_v2: v2,
                    dsd: dsd.clone(),
                    ..Default::default()
                };
                let html = artifact.render_entry_json(&state_json, &options).unwrap();
                assert_eq!(artifact.render_entry(&state, &options).unwrap(), html);
                assert_eq!(
                    artifact.render_entry_prepared(&prepared, &options).unwrap(),
                    html
                );
                let mut js_options = json!({"markersV2":v2});
                if let Some(names) = dsd {
                    js_options["dsd"] = json!(names);
                }
                assert_eq!(
                    json!({"value":html}),
                    js(&source, &state_json, js_options, "entry", "")
                );
                assert!(!html.contains("must-not-leak"));
                let exact = NativeRenderOptions {
                    max_output_bytes: html.len(),
                    ..options.clone()
                };
                assert_eq!(
                    artifact.render_entry_json(&state_json, &exact).unwrap(),
                    html
                );
                let short = NativeRenderOptions {
                    max_output_bytes: html.len() - 1,
                    ..exact
                };
                assert_eq!(
                    artifact
                        .render_entry_json(&state_json, &short)
                        .unwrap_err()
                        .code,
                    "render-limit"
                );
                if !v2 && options.dsd.is_none() {
                    if let Some(ref previous) = previous {
                        assert_eq!(previous, &html);
                    }
                    previous = Some(html);
                }
            }
        }
        assert_eq!(state, original);
        assert_eq!(
            artifact
                .render_entry_prepared(&prepared, &Default::default())
                .unwrap(),
            previous.as_ref().unwrap().as_str()
        );
    }
}

#[test]
fn prepared_state_owns_validated_data_across_artifacts_threads_and_failed_requests() {
    fn send_sync<T: Send + Sync>() {}
    send_sync::<PreparedState>();
    let locator = common::make_locator(&[]);
    let artifact =
        CompiledArtifact::load(&compile_server_artifact("{{label}}", &locator).unwrap()).unwrap();
    let other =
        CompiledArtifact::load(&compile_server_artifact("{{zero}}/{{label}}", &locator).unwrap())
            .unwrap();
    let mut raw = parse_render_state(r#"{"label":"first<&é","zero":-0}"#).unwrap();
    let prepared = PreparedState::new(&raw).unwrap();
    if let JsonValue::Object(values) = &mut raw {
        values.insert("label".into(), JsonValue::String("changed".into()));
        values.insert("unused".into(), JsonValue::Number(f64::NAN));
    }
    assert_eq!(PreparedState::new(&raw).unwrap_err().code, "invalid-state");
    assert_eq!(
        artifact
            .render_entry(&raw, &Default::default())
            .unwrap_err()
            .code,
        "invalid-state"
    );
    drop(raw);
    let expected = "first&lt;&amp;é";
    let exact = NativeRenderOptions {
        max_steps: 1,
        max_output_bytes: expected.len(),
        ..Default::default()
    };
    let held = artifact.render_entry_prepared(&prepared, &exact).unwrap();
    for options in [
        NativeRenderOptions {
            max_steps: 0,
            ..exact.clone()
        },
        NativeRenderOptions {
            max_output_bytes: expected.len() - 1,
            ..exact.clone()
        },
    ] {
        assert_eq!(
            artifact
                .render_entry_prepared(&prepared, &options)
                .unwrap_err()
                .code,
            "render-limit"
        );
        assert_eq!(
            artifact.render_entry_prepared(&prepared, &exact).unwrap(),
            expected
        );
    }
    assert_eq!(held, expected);
    assert_eq!(
        artifact
            .render_host_prepared("missing", &prepared, &exact)
            .unwrap_err()
            .code,
        "missing-template"
    );
    assert_eq!(
        artifact
            .render_shadow_prepared("missing", &prepared, &exact)
            .unwrap_err()
            .code,
        "missing-template"
    );
    let cloned = prepared.clone();
    drop(prepared);
    std::thread::scope(|scope| {
        let first = scope.spawn(|| artifact.render_entry_prepared(&cloned, &exact).unwrap());
        let second = scope.spawn(|| {
            other
                .render_entry_prepared(&cloned, &Default::default())
                .unwrap()
        });
        assert_eq!(first.join().unwrap(), expected);
        assert_eq!(second.join().unwrap(), format!("0/{expected}"));
    });
    let parsed = PreparedState::from_json(r#"{"label":"parsed"}"#).unwrap();
    assert_eq!(
        artifact.render_entry_prepared(&parsed, &exact).unwrap(),
        "parsed"
    );
    for json in ["invalid", r#"{"unused":"\ud800"}"#, r#"{"unused":1e9999}"#] {
        assert_eq!(
            PreparedState::from_json(json).unwrap_err().code,
            "invalid-state"
        );
    }
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
            &compile_server_module("é", &common::make_locator(&[]), "__FAST_TEST_RUNTIME__")
                .unwrap(),
            "null",
            json!({}),
            "entry",
            "",
        ),
        json!({"value":"é"})
    );
}

#[test]
fn escaped_bindings_preserve_bytes_and_exact_request_local_budgets() {
    let artifact = CompiledArtifact::load(
        &compile_server_artifact("{{value}}", &common::make_locator(&[])).unwrap(),
    )
    .unwrap();
    let source = compile_server_module(
        "{{value}}",
        &common::make_locator(&[]),
        "__FAST_TEST_RUNTIME__",
    )
    .unwrap();
    for (value, expected) in [
        ("", ""),
        ("unchanged é😀尾", "unchanged é😀尾"),
        ("é😀&<>\"'&amp;尾", "é😀&amp;&lt;&gt;&quot;&#39;&amp;amp;尾"),
        ("&&", "&amp;&amp;"),
    ] {
        let state_json = json!({"value":value}).to_string();
        let state = parse_render_state(&state_json).unwrap();
        let exact = NativeRenderOptions {
            max_steps: 1,
            max_output_bytes: expected.len(),
            ..Default::default()
        };
        let held = artifact.render_entry(&state, &exact).unwrap();
        assert_eq!(held, expected);
        assert_eq!(
            js(&source, &state_json, json!({}), "entry", ""),
            json!({"value":expected})
        );
        if !expected.is_empty() {
            let short = NativeRenderOptions {
                max_output_bytes: expected.len() - 1,
                ..exact.clone()
            };
            assert_eq!(
                artifact.render_entry(&state, &short).unwrap_err().code,
                "render-limit"
            );
        }
        assert_eq!(artifact.render_entry(&state, &exact).unwrap(), expected);
        assert_eq!(held, expected);
    }
}

#[test]
fn bounded_attributes_preserve_entities_suppression_order_and_owned_results() {
    let entry = r#"<i title='pre "&amp;/{{value}}/{{tail}}' data-value="{{value}}" ?hidden="{{flag}}"></i><a href="{{url}}">{{scalar}}</a>"#;
    let artifact = CompiledArtifact::load(
        &compile_server_artifact(entry, &common::make_locator(&[])).unwrap(),
    )
    .unwrap();
    let source =
        compile_server_module(entry, &common::make_locator(&[]), "__FAST_TEST_RUNTIME__").unwrap();
    let state_json = r#"{"value":"é😀&<>\"'/","tail":"尾","flag":true,"url":3.5,"scalar":false}"#;
    let state = parse_render_state(state_json).unwrap();
    let expected = r#"<i title="pre &quot;&amp;/é😀&amp;&lt;&gt;&quot;&#39;//尾" data-value="é😀&amp;&lt;&gt;&quot;&#39;/" hidden></i><a href="3.5">false</a>"#;
    assert_eq!(
        js(&source, state_json, json!({}), "entry", ""),
        json!({"value":expected})
    );
    let exact = NativeRenderOptions {
        max_output_bytes: expected.len(),
        ..Default::default()
    };
    let held = artifact.render_entry(&state, &exact).unwrap();
    assert_eq!(held, expected);
    assert_eq!(
        artifact.render_entry_json(state_json, &exact).unwrap(),
        expected
    );
    for max_output_bytes in [0, 1, 20, expected.len() - 1] {
        let short = NativeRenderOptions {
            max_output_bytes,
            ..exact.clone()
        };
        assert_eq!(
            artifact.render_entry(&state, &short).unwrap_err().code,
            "render-limit"
        );
        assert_eq!(
            artifact
                .render_entry_json(state_json, &short)
                .unwrap_err()
                .code,
            "render-limit"
        );
    }
    // The large first part must not produce a budget error when the later
    // part suppresses the attribute. The independent huge value still fails.
    let huge = "&\"é😀".repeat(100_000);
    let suppressed_json = json!({"value":huge}).to_string();
    let suppressed = parse_render_state(&suppressed_json).unwrap();
    let composite = CompiledArtifact::load(
        &compile_server_artifact(
            r#"<i title="pre {{value}}/{{missing}}"></i>"#,
            &common::make_locator(&[]),
        )
        .unwrap(),
    )
    .unwrap();
    let tiny = NativeRenderOptions {
        max_output_bytes: 7,
        ..Default::default()
    };
    assert_eq!(
        composite.render_entry(&suppressed, &tiny).unwrap(),
        "<i></i>"
    );
    assert_eq!(
        composite
            .render_entry_json(&suppressed_json, &tiny)
            .unwrap(),
        "<i></i>"
    );
    for template in [
        r#"<i title="{{value}}"></i>"#,
        r#"<i title="pre {{value}}/{{value}}"></i>"#,
        "{{value}}",
        "{{{value}}}",
    ] {
        let artifact = CompiledArtifact::load(
            &compile_server_artifact(template, &common::make_locator(&[])).unwrap(),
        )
        .unwrap();
        assert_eq!(
            artifact.render_entry(&suppressed, &tiny).unwrap_err().code,
            "render-limit"
        );
        assert_eq!(
            artifact
                .render_entry_json(&suppressed_json, &tiny)
                .unwrap_err()
                .code,
            "render-limit"
        );
    }
    for value in [
        json!(null),
        json!(false),
        json!([]),
        json!({}),
        json!(-0.0),
        json!(1e23),
    ] {
        let state_json = json!({"value":value,"tail":"ok","url":value,"scalar":value}).to_string();
        let state = parse_render_state(&state_json).unwrap();
        assert_eq!(
            artifact
                .render_entry_json(&state_json, &Default::default())
                .unwrap(),
            artifact.render_entry(&state, &Default::default()).unwrap()
        );
        assert_eq!(
            json!({"value":artifact.render_entry(&state, &Default::default()).unwrap()}),
            js(&source, &state_json, json!({}), "entry", "")
        );
    }
    assert_eq!(artifact.render_entry(&state, &exact).unwrap(), expected);
    assert_eq!(held, expected);
}

#[test]
fn bounded_composite_attributes_keep_borrowed_and_synthetic_repeat_values() {
    let entry = r#"<f-repeat value="{{group in groups}}"><i title="{{group.values.length}}/{{group.label}}/{{group.values}}">{{group.values.length}}</i></f-repeat>"#;
    let artifact = CompiledArtifact::load(
        &compile_server_artifact(entry, &common::make_locator(&[])).unwrap(),
    )
    .unwrap();
    let json = r#"{"groups":[{"values":[null,true],"label":"<&😀"}]}"#;
    let state = parse_render_state(json).unwrap();
    let prepared = PreparedState::from_json(json).unwrap();
    let expected = r#"<i title="2/&lt;&amp;😀/[Array]">2</i>"#;
    let exact = NativeRenderOptions {
        max_output_bytes: expected.len(),
        ..Default::default()
    };
    assert_eq!(artifact.render_entry(&state, &exact).unwrap(), expected);
    assert_eq!(
        artifact.render_entry_prepared(&prepared, &exact).unwrap(),
        expected
    );
    assert_eq!(artifact.render_entry_json(json, &exact).unwrap(), expected);
    let short = NativeRenderOptions {
        max_output_bytes: expected.len() - 1,
        ..exact.clone()
    };
    assert_eq!(
        artifact.render_entry_json(json, &short).unwrap_err().code,
        "render-limit"
    );
    assert_eq!(artifact.render_entry_json(json, &exact).unwrap(), expected);
}

#[test]
fn nested_shadow_errors_precede_host_attribute_budgets_and_recover() {
    let locator = common::make_locator_with_host_attrs(&[
        (
            "test-outer",
            "outer<test-inner title=\"{{large}}\"></test-inner>",
            &[("title", Some("{{large}}"))],
        ),
        (
            "test-inner",
            "inner<f-repeat value=\"{{item in items}}\">{{item}}</f-repeat>",
            &[("data-default", Some("{{large}}"))],
        ),
    ]);
    let entry = "<test-outer title=\"{{large}}\"></test-outer>";
    let artifact =
        CompiledArtifact::load(&compile_server_artifact(entry, &locator).unwrap()).unwrap();
    let source = compile_server_module(entry, &locator, "__FAST_TEST_RUNTIME__").unwrap();
    let invalid_json = json!({"large":"&".repeat(100_000),"items":false}).to_string();
    let invalid = parse_render_state(&invalid_json).unwrap();
    let options = NativeRenderOptions {
        // Shadow prefixes fit, but either host attribute does not.
        max_output_bytes: 16,
        ..Default::default()
    };
    let failed = artifact.render_entry(&invalid, &options).unwrap_err();
    assert_eq!(failed.code, "repeat-not-array");
    assert_eq!(
        artifact
            .render_entry_json(&invalid_json, &options)
            .unwrap_err(),
        failed
    );
    assert_eq!(
        js(&source, &invalid_json, json!({}), "entry", "")["error"]["code"],
        "repeat-not-array"
    );
    let prefix_limit = NativeRenderOptions {
        max_output_bytes: 9,
        ..options.clone()
    };
    assert_eq!(
        artifact
            .render_entry(&invalid, &prefix_limit)
            .unwrap_err()
            .code,
        "render-limit"
    );
    assert_eq!(
        artifact
            .render_entry_json(&invalid_json, &prefix_limit)
            .unwrap_err()
            .code,
        "render-limit"
    );
    let valid_json = r#"{"large":"é&","items":["尾"]}"#;
    let valid = parse_render_state(valid_json).unwrap();
    let held = artifact.render_entry(&valid, &Default::default()).unwrap();
    assert_eq!(
        json!({"value":held}),
        js(&source, valid_json, json!({}), "entry", "")
    );
    let exact = NativeRenderOptions {
        max_output_bytes: held.len(),
        ..Default::default()
    };
    assert_eq!(artifact.render_entry(&valid, &exact).unwrap(), held);
    assert_eq!(
        artifact.render_entry_json(valid_json, &exact).unwrap(),
        held
    );
    assert_eq!(
        artifact.render_entry(&invalid, &options).unwrap_err().code,
        failed.code
    );
    assert_eq!(artifact.render_entry(&valid, &exact).unwrap(), held);
    assert_eq!(
        artifact.render_entry_json(valid_json, &exact).unwrap(),
        held
    );
}

#[test]
fn native_body_depth_accepts_128_nested_calls_but_not_129() {
    let bytes = compile_server_artifact("ok", &common::make_locator(&[])).unwrap();
    let original: Value = serde_json::from_slice(&bytes).unwrap();
    for depth in [128, 129] {
        let mut ir = original.clone();
        ir["entry"] = json!([{"type":"template","name":"next0"}]);
        let mut templates = serde_json::Map::new();
        for index in 0..depth {
            let body = if index + 1 == depth {
                json!([{"type":"literal","html":"ok"}])
            } else {
                json!([{"type":"template","name":format!("next{}", index + 1)}])
            };
            templates.insert(format!("next{index}"), body);
        }
        ir["templates"] = json!(templates);
        let artifact = CompiledArtifact::load(ir.to_string().as_bytes()).unwrap();
        let native = artifact.render_entry(&JsonValue::Null, &Default::default());
        if depth == 128 {
            assert_eq!(native.unwrap(), "ok");
        } else {
            assert_eq!(native.unwrap_err().code, "render-limit");
        }
        assert_eq!(
            js(&js_semantic_plan(&ir), "null", json!({}), "entry", "",),
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
    incompatible["version"] = json!(2);
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
