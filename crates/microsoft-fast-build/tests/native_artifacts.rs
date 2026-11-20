mod common;

use microsoft_fast_build::{
    compile_server_artifact, parse_render_state, AttributeNameStrategy, CompiledArtifact,
    JsonValue, Locator, NativeRenderOptions, PreparedState,
};
use serde_json::{json, Value};

fn locator() -> Locator {
    common::make_locator_with_host_attrs(&[
        ("test-card", "<h2 title=\"{{label}}\">{{label}}</h2><test-leaf :item=\"{{item}}\"></test-leaf><slot>fallback</slot>", &[("role", Some("group")), ("title", Some("{{label}}"))]),
        ("test-leaf", "{{item.name}}/{{dataset.inherited}}/{{fooBar}}/{{foo-bar}}", &[]),
    ])
}

fn artifact_json(
    entry: &str,
    locator: &Locator,
) -> Result<String, microsoft_fast_build::RenderError> {
    compile_server_artifact(entry, locator).map(|bytes| String::from_utf8(bytes).unwrap())
}

fn render_json(source: &str, state: &str, options: Value, target: &str, name: &str) -> Value {
    let artifact = CompiledArtifact::load(source.as_bytes()).unwrap();
    let options = NativeRenderOptions {
        markers_v2: options["markersV2"].as_bool().unwrap_or(false),
        dsd: options["dsd"].as_array().map(|names| {
            names
                .iter()
                .map(|name| name.as_str().unwrap().to_owned())
                .collect()
        }),
        attribute_name_strategy: if options["attributeNameStrategy"] == "none" {
            AttributeNameStrategy::None
        } else {
            AttributeNameStrategy::CamelCase
        },
        ..Default::default()
    };
    let result = match target {
        "host" => artifact.render_host_json(name, state, &options),
        "shadow" => artifact.render_shadow_json(name, state, &options),
        "template" => artifact.render_template_json(state, &options),
        _ => artifact.render_entry_json(state, &options),
    };
    match result {
        Ok(value) => json!({"value":value}),
        Err(error) => json!({"error":{"code":error.code,"message":error.message}}),
    }
}

fn semantic_plan(plan: &Value) -> String {
    plan.to_string()
}

fn semantic_artifact(program: &Value, schema: u64) -> Vec<u8> {
    let envelope = if schema == 1 {
        let mut envelope = program.clone();
        envelope["format"] = json!("fast-server-native");
        envelope["version"] = json!(1);
        envelope
    } else {
        json!({
            "format":"fast-server-native", "version":2,
            "inputs":{"entry":"","templateSources":[]}, "program":program,
        })
    };
    serde_json::to_vec(&envelope).unwrap()
}

#[test]
fn semantic_decoder_compatibility_preserves_static_scalar_spellings() {
    let bytes = compile_server_artifact(
        r#"<value-card :value="{{source}}"></value-card>"#,
        &common::make_locator(&[("value-card", "{{value}}")]),
    )
    .unwrap();
    let envelope: Value = serde_json::from_slice(&bytes).unwrap();
    let original = &envelope["program"];
    let mut cases = vec![
        (json!({"type":"null"}), ""),
        (json!({"type":"bool","value":false}), "false"),
        (json!({"type":"bool","value":true}), "true"),
        (json!({"type":"string","value":"<&"}), "&lt;&amp;"),
        (json!({"type":"array","value":[]}), "[Array]"),
        (
            json!({"type":"object","value":{"":{"type":"array","value":[
                {"type":"null"}, {"type":"number","value":"NaN"}
            ]}}}),
            "[Object]",
        ),
    ];
    for (spelling, expected) in [
        ("+01", "1"),
        (".5", "0.5"),
        ("1.", "1"),
        ("1E+3", "1000"),
        ("-0", "0"),
        ("NaN", "NaN"),
        ("inf", "inf"),
        ("+Infinity", "inf"),
        ("-inf", "-inf"),
        ("1e999", "inf"),
    ] {
        cases.push((json!({"type":"number","value":spelling}), expected));
    }
    for (value, expected) in cases {
        for schema in [1, 2] {
            let mut program = original.clone();
            let element = program["templates"]
                .as_object_mut()
                .unwrap()
                .values_mut()
                .flat_map(|body| body.as_array_mut().unwrap())
                .find(|operation| operation["type"] == "element")
                .unwrap();
            element["props"][0]["value"] = json!({"type":"value","value":value});
            let artifact = CompiledArtifact::load(&semantic_artifact(&program, schema)).unwrap();
            assert_eq!(
                artifact
                    .render_entry_json("{}", &Default::default())
                    .unwrap(),
                format!("<value-card><template shadowrootmode=\"open\"><!--fe:b-->{expected}<!--fe:/b--></template></value-card>"),
                "schema {schema}, value {value}",
            );
        }
    }
}

#[test]
fn semantic_decoder_compatibility_preserves_segmented_aliases_and_nested_conditions() {
    let program = json!({
        "entry":[{"type":"repeat","alias":["","item"],"collection":["items"],
            "diagnostic":"","template":"row"}],
        "templates":{
            "row":[
                {"type":"binding","path":["","item","","+01"],"escape":true},
                {"type":"literal","html":"/"},
                {"type":"binding","path":["","item","keys","+01"],"escape":true},
                {"type":"when","template":"yes","condition":{
                    "type":"and","left":{"type":"not","path":["skip"]},
                    "right":{"type":"or",
                        "left":{"type":"compare","operator":">=",
                            "path":["","item","n"],"value":{"type":"path","path":["threshold"]}},
                        "right":{"type":"truthy","path":["fallback"]}}
                }}
            ],
            "yes":[{"type":"literal","html":"!"}]
        },
        "components":{}
    });
    for schema in [1, 2] {
        let artifact = CompiledArtifact::load(&semantic_artifact(&program, schema)).unwrap();
        let state = r#"{"items":[{"":["zero","<&"],"keys":{"+01":"key","01":"wrong"},"n":2}],"threshold":2}"#;
        assert_eq!(
            artifact
                .render_entry_json(state, &Default::default())
                .unwrap(),
            "&lt;&amp;/key!",
        );
        assert_eq!(
            artifact
                .render_entry_json(r#"{"items":false}"#, &Default::default())
                .unwrap_err()
                .code,
            "repeat-not-array",
        );
        assert_eq!(
            artifact
                .render_template_json(state, &Default::default())
                .unwrap(),
            "&lt;&amp;/key!",
        );
    }
}

#[test]
fn semantic_decoder_compatibility_validates_unused_nested_fields_and_scalar_types() {
    let original = json!({
        "entry":[{"type":"literal","html":"ok"}],
        "templates":{"empty":[],"unused":[
            {"type":"repeat","alias":[""],"collection":[""],"diagnostic":"","template":"empty"},
            {"type":"when","template":"empty","condition":{
                "type":"or","left":{"type":"not","path":[""]},
                "right":{"type":"compare","operator":"==","path":[""],
                    "value":{"type":"value","value":{"type":"object","value":{
                        "unused":{"type":"array","value":[{"type":"null"}]}
                    }}}}
            }},
            {"type":"tag","plain":[{"type":"quoted","name":"","parts":[
                {"type":"literal","html":""},{"type":"segment","path":[""]}
            ]}],"hydrated":[{"type":"conditional","html":"",
                "condition":{"type":"truthy","path":[""]}}],
                "count":1_000_000,"ending":""}
        ]},
        "components":{}
    });
    for schema in [1, 2] {
        let artifact = CompiledArtifact::load(&semantic_artifact(&original, schema)).unwrap();
        assert_eq!(
            artifact
                .render_entry_json("{}", &Default::default())
                .unwrap(),
            "ok",
        );
        for (pointer, value) in [
            ("/templates/unused/0/alias", json!([])),
            ("/templates/unused/0/alias/0", json!(false)),
            ("/templates/unused/0/collection", json!([])),
            ("/templates/unused/1/condition/right/operator", json!("===")),
            (
                "/templates/unused/1/condition/right/value",
                json!({"type":"path","path":[""],"extra":null}),
            ),
            (
                "/templates/unused/1/condition/right/value/value/value/unused/value/0",
                json!({"type":"null","value":null}),
            ),
            (
                "/templates/unused/1/condition/right/value/value/value/unused/value/0",
                json!({"type":"number","value":1}),
            ),
            (
                "/templates/unused/2/plain/0/parts/1",
                json!({"type":"segment","path":[""],"extra":null}),
            ),
            ("/templates/unused/2/plain/0/parts/1/path", json!([])),
            ("/templates/unused/2/hydrated/0/condition/path/0", json!(0)),
            ("/templates/unused/2/count", json!(1_000_001)),
            ("/templates/unused/2/count", json!(1.0)),
            ("/templates/unused/2/count", json!(-1)),
        ] {
            let mut program = original.clone();
            *program.pointer_mut(pointer).unwrap() = value;
            assert_eq!(
                CompiledArtifact::load(&semantic_artifact(&program, schema))
                    .unwrap_err()
                    .code,
                "invalid-artifact",
                "schema {schema}, {pointer}: {program}",
            );
        }
    }
}

#[test]
fn semantic_decoder_compatibility_keeps_shared_full_templates_and_public_component_roots() {
    for header in [false, true] {
        for tag in ["", "<template shadowrootmode='closed' data-value='&amp;'>"] {
            let mut dsd = vec![
                json!({"type":"literal","html":tag}),
                json!({"type":"template","name":"content"}),
                json!({"type":"literal","html":"</template>"}),
            ];
            if header {
                dsd.insert(
                    0,
                    json!({"type":"host-attributes","attributes":[
                        {"name":"role","attribute":{"type":"literal","html":" role='group'"}}
                    ]}),
                );
            }
            let program = json!({
                "entry":[{"type":"template","name":"dsd"},{"type":"component","name":"a-card"}],
                "templates":{"dsd":dsd,"content":[{"type":"literal","html":"inside"}]},
                "components":{"a-card":"dsd","b-card":"dsd"}
            });
            let shadow = format!("{tag}inside</template>");
            let default = if header { " role='group'" } else { "" };
            for schema in [1, 2] {
                let artifact =
                    CompiledArtifact::load(&semantic_artifact(&program, schema)).unwrap();
                for name in ["a-card", "b-card"] {
                    assert_eq!(
                        artifact
                            .render_host_json(name, "{}", &Default::default())
                            .unwrap(),
                        format!("<{name}{default}>{shadow}</{name}>"),
                    );
                    assert_eq!(
                        artifact
                            .render_shadow_json(name, "{}", &Default::default())
                            .unwrap(),
                        shadow,
                    );
                }
                assert_eq!(
                    artifact
                        .render_entry_json("{}", &Default::default())
                        .unwrap(),
                    format!("{shadow}<a-card{default}>{shadow}</a-card>"),
                );
                let deselected = NativeRenderOptions {
                    dsd: Some(vec![]),
                    ..Default::default()
                };
                assert_eq!(
                    artifact.render_entry_json("{}", &deselected).unwrap(),
                    format!("{shadow}<a-card></a-card>"),
                );
                assert_eq!(
                    artifact
                        .render_shadow_json("b-card", "{}", &deselected)
                        .unwrap(),
                    "",
                );
            }
        }
    }
}

#[test]
fn semantic_decoder_compatibility_bounds_derived_metadata_not_only_input_bytes() {
    const LIMIT: usize = 64 * 1024 * 1024;
    let mut program = json!({
        "entry":[],
        "templates":{"dsd":[
            {"type":"literal","html":""},{"type":"literal","html":"</template>"}
        ]},
        "components":{}
    });
    let template_bytes = serde_json::to_vec(&program["templates"]["dsd"])
        .unwrap()
        .len();
    // The FAST metadata budget charges the full template once and each derived host.
    let (name, tag_bytes) = (4..=6)
        .find_map(|name_bytes| {
            let overhead = template_bytes + 2 + name_bytes * 5 + 512;
            ((LIMIT - overhead) % 3 == 0).then(|| ("a".repeat(name_bytes), (LIMIT - overhead) / 3))
        })
        .unwrap();
    for (extra, valid) in [(0, true), (2, false)] {
        let component = if valid {
            name.clone()
        } else {
            // Two tag bytes cost six budget bytes; one fewer name byte refunds five.
            name[..name.len() - 1].to_owned()
        };
        program["components"] =
            Value::Object([(component.clone(), json!("dsd"))].into_iter().collect());
        program["templates"]["dsd"][0]["html"] = json!("x".repeat(tag_bytes + extra));
        let bytes = semantic_artifact(&program, 2);
        assert!(bytes.len() < LIMIT / 2);
        let loaded = CompiledArtifact::load(&bytes);
        if valid {
            let artifact = loaded.unwrap();
            let short = NativeRenderOptions {
                max_output_bytes: 1,
                ..Default::default()
            };
            assert_eq!(
                artifact
                    .render_shadow_json(&component, "{}", &short)
                    .unwrap_err()
                    .code,
                "render-limit",
            );
            assert_eq!(
                artifact
                    .render_entry_json("{}", &Default::default())
                    .unwrap(),
                "",
            );
        } else {
            assert_eq!(loaded.unwrap_err().code, "invalid-artifact");
        }
    }
}

#[test]
fn consolidated_inputs_are_build_metadata_not_runtime_template_sources() {
    let locator = common::make_locator_with_host_attrs(&[(
        "test-card",
        "<b>{{title}}</b>",
        &[("role", Some("group"))],
    )]);
    let bytes = compile_server_artifact("<test-card></test-card>", &locator).unwrap();
    let mut envelope: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(envelope["version"], 2);
    assert_eq!(envelope["inputs"]["entry"], "<test-card></test-card>");
    assert_eq!(
        envelope["inputs"]["templates"]["test-card"]["content"],
        "<b>{{title}}</b>"
    );
    assert_eq!(
        envelope["inputs"]["templates"]["test-card"]["hostAttributes"],
        json!([{"name":"role","value":"group"}])
    );
    let expected = CompiledArtifact::load(&bytes)
        .unwrap()
        .render_entry_json(r#"{"title":"Kept"}"#, &Default::default())
        .unwrap();
    envelope["inputs"]["entry"] = json!("{{}}");
    envelope["inputs"]["templates"] = json!({"broken":{"content":"{{}}"}});
    let program = CompiledArtifact::load(envelope.to_string().as_bytes()).unwrap();
    drop((envelope, bytes, locator));
    assert_eq!(
        program
            .render_entry_json(r#"{"title":"Kept"}"#, &Default::default())
            .unwrap(),
        expected
    );
}

#[test]
fn consolidated_envelopes_reject_missing_or_malformed_build_metadata() {
    let bytes = compile_server_artifact("ok", &common::make_locator(&[])).unwrap();
    let original: Value = serde_json::from_slice(&bytes).unwrap();
    for inputs in [
        json!(null),
        json!({}),
        json!({"entry":0,"templates":{}}),
        json!({"entry":"","templates":[]}),
        json!({"entry":"","templateSources":[0]}),
        json!({"entry":"","templates":{},"state":{}}),
    ] {
        let mut envelope = original.clone();
        envelope["inputs"] = inputs;
        assert_eq!(
            CompiledArtifact::load(envelope.to_string().as_bytes())
                .unwrap_err()
                .code,
            "invalid-artifact"
        );
    }
}

#[test]
fn fresh_json_preserves_binary64_values_and_decimal_output() {
    let bytes = compile_server_artifact(
        r#"<p title="{{value}}" data-joined="pre {{value}}">{{value}}</p>"#,
        &common::make_locator(&[]),
    )
    .unwrap();
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    for value in [1e-30, 1e-300, f64::from_bits(1), f64::MAX] {
        let json = format!(r#"{{"value":{value}}}"#);
        let state = JsonValue::Object(
            [("value".to_owned(), JsonValue::Number(value))]
                .into_iter()
                .collect(),
        );
        assert_eq!(
            artifact
                .render_entry_json(&json, &Default::default())
                .unwrap(),
            artifact.render_entry(&state, &Default::default()).unwrap(),
        );
    }
}

#[test]
fn static_markup_does_not_expand_into_per_tag_rendering_code() {
    let locator = common::make_locator(&[]);
    for count in [64, 256] {
        let entry = "<section class=\"panel\"><h2>Static &amp; text</h2><p title='fixed'>Payload</p><br /></section>\n".repeat(count);
        let bytes = compile_server_artifact(&entry, &locator).unwrap();
        let ir: Value = serde_json::from_slice(&bytes).unwrap();
        let body = &ir["program"]["entry"];
        assert_eq!(
            body,
            &json!([{"type":"literal","html":entry}]),
            "invariant static tags should form one literal run"
        );
        let artifact = CompiledArtifact::load(&bytes).unwrap();
        let source = artifact_json(&entry, &locator).unwrap();
        assert!(
            ir["program"].to_string().len() < entry.len() * 3 / 2,
            "static output expanded into generalized operations"
        );
        assert_eq!(
            artifact
                .render_entry(&common::empty_root(), &Default::default())
                .unwrap(),
            entry
        );
        assert_eq!(
            json!({"value":entry}),
            render_json(&source, "{}", json!({}), "entry", "")
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
    let source = artifact_json(entry, &locator).unwrap();
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
        let shadow = format!(
            "<template shadowrootmode=\"open\">{prefix}{stripped}{bound}{suffix}</template>"
        );
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
            render_json(&source, state_json, json!({"markersV2":v2}), "entry", "")
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
fn instance_constants_do_not_duplicate_fresh_json_element_functions() {
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
        let source = artifact_json(&entry, &locator).unwrap();
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
            render_json(&source, "{}", json!({}), "entry", "")
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
    let source = artifact_json("<test-parent></test-parent>", &locator).unwrap();
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
                    let mut json_options = json!({
                        "markersV2":v2,
                        "attributeNameStrategy":if strategy == AttributeNameStrategy::None {"none"} else {"camelCase"},
                    });
                    if let Some(names) = dsd {
                        json_options["dsd"] = json!(names);
                    }
                    let native = artifact.render_entry(&state, &options).unwrap();
                    assert_eq!(
                        json!({"value":native}),
                        render_json(&source, state_json, json_options, "entry", ""),
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
    let source = artifact_json(entry, &locator).unwrap();
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
                let mut json_options = json!({"markersV2":v2, "attributeNameStrategy":if strategy == AttributeNameStrategy::None {"none"} else {"camelCase"}});
                if let Some(names) = dsd {
                    json_options["dsd"] = json!(names);
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
                    let fresh_json = render_json(
                        &source,
                        state_json,
                        json_options.clone(),
                        target,
                        "test-card",
                    );
                    assert_eq!(json!({"value":native}), fresh_json, "{target}, {options:?}");
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
        "<test-text><template shadowrootmode=\"open\"><b title=\"&lt;&amp;\" data-fe=\"1\"><!--fe:b-->&lt;&amp;<!--fe:/b-->/<!--fe:b--><i>raw</i><!--fe:/b--></b></template></test-text>");
    let v2 = NativeRenderOptions {
        markers_v2: true,
        ..Default::default()
    };
    assert_eq!(artifact.render_shadow("test-text", &state, &v2).unwrap(),
        "<template shadowrootmode=\"open\"><b title=\"&lt;&amp;\" data-fe-b-0><!--fe-b$$start$$1$$fast-build$$fe-b-->&lt;&amp;<!--fe-b$$end$$1$$fast-build$$fe-b-->/<!--fe-b$$start$$2$$fast-build$$fe-b--><i>raw</i><!--fe-b$$end$$2$$fast-build$$fe-b--></b></template>");
}

#[test]
fn numbers_and_comparisons_match_generated_fresh_json() {
    let locator = common::make_locator(&[]);
    let entry =
        "{{n}}<f-when value=\"{{a >= b}}\">yes</f-when><f-when value=\"{{a == b}}\">equal</f-when>";
    let source = artifact_json(entry, &locator).unwrap();
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
            render_json(&source, state_json, json!({}), "entry", ""),
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
    let envelope: Value = serde_json::from_slice(&emitted).unwrap();
    assert_eq!(envelope["program"]["entry"], expected["entry"]);
    assert_eq!(envelope["inputs"]["entry"], "{{value}}");
}

#[test]
fn component_templates_share_content_but_preserve_distinct_host_defaults() {
    let content = format!("{}{{{{label}}}}", "x".repeat(32_768));
    let locator = common::make_locator_with_host_attrs(&[
        ("one-card", &content, &[("role", Some("group"))]),
        ("two-card", &content, &[("role", Some("note"))]),
    ]);
    let bytes = compile_server_artifact("", &locator).unwrap();
    let plan: Value = serde_json::from_slice(&bytes).unwrap();
    assert!(
        plan["program"].to_string().len() < 50_000,
        "shared component content expanded"
    );
    assert_eq!(plan["program"]["templates"].as_object().unwrap().len(), 3);
    assert!(plan["program"]["components"]
        .as_object()
        .unwrap()
        .values()
        .all(Value::is_string));
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    let source = artifact_json("", &locator).unwrap();
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
            render_json(&source, r#"{"label":"<&"}"#, json!({}), "host", name),
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
    let reference = plan["program"]["components"]["test-card"].clone();
    plan["program"]["components"] = Value::Object(
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
    let source = semantic_plan(&ir);
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
            render_json(&source, state_json, json!({}), target, "x-card"),
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
        render_json(&source, state_json, json!({}), "host", "x-card"),
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
        render_json(&source, state_json, json!({}), "shadow", "x-card"),
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
        render_json(
            &artifact_json(entry, &common::make_locator(&[])).unwrap(),
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
        "<b title=\"{{dataset.items.0.name}}\">{{dataset.base}}/{{dataset.label}}/{{label}}</b>",
        &[("title", Some("{{label}}"))],
    )]);
    let entry = "<test-static-data :dataset='{\"base\":\"static\",\"number\":1,\"items\":[{\"name\":\"nested\"}]}' data-label=\"{{label}}\" label=\"{{label}}\"></test-static-data>";
    let bytes = compile_server_artifact(entry, &locator).unwrap();
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    let source = artifact_json(entry, &locator).unwrap();
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
                assert!(entry.contains("title=\"nested\""));
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
                    render_json(source, &state_json, json!({"markersV2":options.markers_v2}), "entry", ""),
                    json!({"value":entry}),
                );
            });
        }
    });
}

#[test]
fn logical_shortcuts_preserve_budgets_and_complete_state_validation() {
    let bytes = compile_server_artifact(
        r#"<f-when value="{{enabled || missing.value}}">Y</f-when><f-when value="{{blocked && missing.value}}">N</f-when>"#,
        &common::make_locator(&[]),
    )
    .unwrap();
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    let json = r#"{"enabled":true,"blocked":false}"#;
    let state = parse_render_state(json).unwrap();
    let prepared = PreparedState::new(&state).unwrap();
    let exact = NativeRenderOptions {
        max_steps: 3,
        max_output_bytes: 1,
        ..Default::default()
    };
    for options in [
        NativeRenderOptions {
            max_steps: 2,
            ..exact.clone()
        },
        exact,
    ] {
        for result in [
            artifact.render_entry(&state, &options),
            artifact.render_entry_prepared(&prepared, &options),
            artifact.render_entry_json(json, &options),
        ] {
            if options.max_steps == 2 {
                assert_eq!(result.unwrap_err().code, "render-limit");
            } else {
                assert_eq!(result.unwrap(), "Y");
            }
        }
    }
    assert_eq!(
        artifact
            .render_entry_json(
                r#"{"enabled":true,"blocked":false,"unused":1e9999}"#,
                &Default::default(),
            )
            .unwrap_err()
            .code,
        "invalid-state"
    );
}

#[test]
fn load_rejects_incompatible_malformed_and_deep_artifacts_without_panics() {
    let bytes = compile_server_artifact("{{x}}", &common::make_locator(&[])).unwrap();
    let original: Value = serde_json::from_slice(&bytes).unwrap();
    for (field, value) in [
        ("version", json!(0)),
        ("version", json!(4)),
        ("version", json!(3)),
        ("version", json!(99)),
        ("version", json!("1")),
        ("version", json!(2.5)),
        ("version", json!(null)),
        ("format", json!("metadata")),
        ("format", json!("fast-server")),
        ("format", json!("unknown-format")),
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
            0 => v["program"]["entry"] = json!(999),
            1 => v["program"]["entry"][0]["type"] = json!("eval"),
            2 => v["program"]["entry"][0] = json!({"type":"template","name":"missing"}),
            3 => v["program"]["entry"][0]["path"] = json!([]),
            4 => {
                v["program"]["entry"][0] = json!({
                    "type":"when","template":"missing",
                    "condition":{"type":"compare","operator":"evil","path":["x"],"value":{"type":"path","path":["y"]}}
                })
            }
            5 => v["program"]["entry"] = json!({}),
            6 => v["unexpected"] = json!(true),
            7 => v["program"]["components"] = json!({"bad":{"shadow":999,"host":0,"tag":""}}),
            8 => v["program"]["entry"][0]["unexpected"] = json!(true),
            9 => v["program"]["entry"][0] = json!({"type":"element"}),
            10 => {
                v["program"]["entry"][0] = json!({"type":"repeat","alias":["item"],"collection":["items"],"diagnostic":"item in items","template":"missing"})
            }
            11 => {
                v["program"]["entry"][0] = json!({"type":"when","condition":{"type":"truthy","path":["x"]},"template":"missing"})
            }
            12 => v["program"]["components"] = json!({"bad":"missing"}),
            13 => {
                v["program"]["templates"] = json!({"unused":[{"type":"template","name":"missing"}]})
            }
            14 => v["program"]["entry"][0] = json!(["call", 0]),
            15 => v["program"]["entry"][0] = json!(["fragment", "missing"]),
            _ => v["program"]["entry"][0] = json!({"type":"template","name":0}),
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
    v["program"]["entry"][0] = json!({"type":"when","condition":cond,"template":"missing"});
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
    let source = artifact_json("<test-cycle></test-cycle>", &locator).unwrap();
    assert_eq!(
        json!({"value":artifact.render_entry(&state, &Default::default()).unwrap()}),
        render_json(&source, state_json, json!({}), "entry", "")
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
fn state_depth_boundary_is_includes_unused_state() {
    let artifact =
        CompiledArtifact::load(&compile_server_artifact("ok", &common::make_locator(&[])).unwrap())
            .unwrap();
    let source = artifact_json("ok", &common::make_locator(&[])).unwrap();
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
        let result = render_json(&source, &state_json, json!({}), "entry", "");
        if depth == 64 {
            assert_eq!(result, json!({"value":"ok"}));
        } else {
            assert_eq!(result["error"]["code"], "invalid-state");
        }
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
fn inline_and_spilled_component_scopes_preserve_masking_and_dataset_overlays() {
    let locator = common::make_locator(&[(
        "scope-card",
        "{{label}}/{{masked.value}}/{{dataset.base}}/{{dataset.note}}/{{dataset.keep}}",
    )]);
    for spare_properties in [0, 1] {
        let spare = r#" :spare="unused""#.repeat(spare_properties);
        let entry = format!(
            r#"<scope-card :masked="{{{{missing}}}}" :dataset='{{"base":"local"}}' data-note="{{{{label}}}}" :label="{{{{label}}}}"{spare}></scope-card>"#
        );
        let artifact =
            CompiledArtifact::load(&compile_server_artifact(&entry, &locator).unwrap()).unwrap();
        for label in ["large".repeat(8192), "small".into()] {
            let state_json = json!({
                "label":label,
                "masked":{"value":"must-not-leak"},
                "dataset":{"keep":"must-not-leak"},
            })
            .to_string();
            let state = PreparedState::from_json(&state_json).unwrap();
            let expected = format!(
                "<scope-card data-note=\"{label}\"><template shadowrootmode=\"open\"><!--fe:b-->{label}<!--fe:/b-->/<!--fe:b--><!--fe:/b-->/<!--fe:b-->local<!--fe:/b-->/<!--fe:b-->{label}<!--fe:/b-->/<!--fe:b--><!--fe:/b--></template></scope-card>"
            );
            assert_eq!(
                artifact
                    .render_entry_json(&state_json, &Default::default())
                    .unwrap(),
                expected
            );
            assert_eq!(
                artifact
                    .render_entry_prepared(&state, &Default::default())
                    .unwrap(),
                expected
            );
        }
    }
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
    let source = artifact_json(entry, &locator).unwrap();
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
                let mut json_options = json!({"markersV2":v2});
                if let Some(names) = dsd {
                    json_options["dsd"] = json!(names);
                }
                assert_eq!(
                    json!({"value":html}),
                    render_json(&source, &state_json, json_options, "entry", "")
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
        render_json(
            &artifact_json("é", &common::make_locator(&[])).unwrap(),
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
    let source = artifact_json("{{value}}", &common::make_locator(&[])).unwrap();
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
            render_json(&source, &state_json, json!({}), "entry", ""),
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
    let source = artifact_json(entry, &common::make_locator(&[])).unwrap();
    let state_json = r#"{"value":"é😀&<>\"'/","tail":"尾","flag":true,"url":3.5,"scalar":false}"#;
    let state = parse_render_state(state_json).unwrap();
    let expected = r#"<i title="pre &quot;&amp;/é😀&amp;&lt;&gt;&quot;&#39;//尾" data-value="é😀&amp;&lt;&gt;&quot;&#39;/" hidden></i><a href="3.5">false</a>"#;
    assert_eq!(
        render_json(&source, state_json, json!({}), "entry", ""),
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
            render_json(&source, &state_json, json!({}), "entry", "")
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
    let source = artifact_json(entry, &locator).unwrap();
    let invalid_json = json!({"large":"&".repeat(100_000),"items":false}).to_string();
    let invalid = parse_render_state(&invalid_json).unwrap();
    let prepared = PreparedState::from_json(&invalid_json).unwrap();
    let options = NativeRenderOptions {
        // Shadow prefixes fit, but either host attribute does not.
        max_output_bytes: 16,
        ..Default::default()
    };
    let failed = artifact.render_entry(&invalid, &options).unwrap_err();
    assert_eq!(failed.code, "repeat-not-array");
    assert_eq!(
        artifact
            .render_entry_prepared(&prepared, &options)
            .unwrap_err(),
        failed
    );
    assert_eq!(
        artifact
            .render_entry_json(&invalid_json, &options)
            .unwrap_err(),
        failed
    );
    assert_eq!(
        render_json(&source, &invalid_json, json!({}), "entry", "")["error"]["code"],
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
        render_json(&source, valid_json, json!({}), "entry", "")
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
fn nested_shadow_output_keeps_order_escaping_and_construction_limits() {
    let locator = common::make_locator(&[
        ("test-outer", "A<test-inner>light</test-inner>Z"),
        (
            "test-inner",
            "{{value}}<f-repeat value=\"{{item in items}}\">{{item}}</f-repeat>",
        ),
    ]);
    let artifact = CompiledArtifact::load(
        &compile_server_artifact("é<test-outer>tail</test-outer>尾", &locator).unwrap(),
    )
    .unwrap();
    let json = r#"{"value":"&é","items":[]}"#;
    let state = parse_render_state(json).unwrap();
    let prepared = PreparedState::from_json(json).unwrap();
    let expected = concat!(
        "é<test-outer><template shadowrootmode=\"open\">A",
        "<test-inner><template shadowrootmode=\"open\">",
        "<!--fe:b-->&amp;é<!--fe:/b--><!--fe:b--><!--fe:/b-->",
        "</template>light</test-inner>Z</template>tail</test-outer>尾",
    );
    let exact = NativeRenderOptions {
        max_output_bytes: expected.len(),
        ..Default::default()
    };
    let held = artifact.render_entry_prepared(&prepared, &exact).unwrap();
    assert_eq!(held, expected);
    for mode in 0..3 {
        let render = |json: &str, options: &NativeRenderOptions| match mode {
            0 => artifact.render_entry(&parse_render_state(json).unwrap(), options),
            1 => artifact.render_entry_prepared(&PreparedState::from_json(json).unwrap(), options),
            _ => artifact.render_entry_json(json, options),
        };
        assert_eq!(render(json, &exact).unwrap(), expected);
        for max_output_bytes in [0, 15, 20, expected.len() - 1] {
            let short = NativeRenderOptions {
                max_output_bytes,
                ..exact.clone()
            };
            assert_eq!(render(json, &short).unwrap_err().code, "render-limit");
        }
        // Escaped expansion exhausts the nested shadow before its invalid repeat.
        let invalid = json!({"value":"&".repeat(100),"items":false}).to_string();
        let short = NativeRenderOptions {
            max_output_bytes: 20,
            ..exact.clone()
        };
        let error = render(&invalid, &short).unwrap_err();
        assert_eq!(error.code, "render-limit");
        assert_eq!(error.message, "Output byte limit exceeded");
        assert_eq!(
            render(&invalid, &Default::default()).unwrap_err().code,
            "repeat-not-array"
        );
        assert_eq!(render(json, &exact).unwrap(), expected);
    }
    assert_eq!(artifact.render_entry(&state, &exact).unwrap(), held);
    assert_eq!(held, expected);
}

#[test]
fn nested_shadow_depth_is_bounded_before_assembly_and_recovers() {
    for depth in [32, 129] {
        let templates = (0..depth)
            .map(|index| {
                (
                    format!("test-level-{index}"),
                    if index + 1 == depth {
                        "é".to_owned()
                    } else {
                        format!("<test-level-{}></test-level-{}>", index + 1, index + 1)
                    },
                )
            })
            .collect();
        let artifact = CompiledArtifact::load(
            &compile_server_artifact(
                "<test-level-0></test-level-0>",
                &Locator::from_templates(templates),
            )
            .unwrap(),
        )
        .unwrap();
        let prepared = PreparedState::from_json("{}").unwrap();
        let expected = (0..depth).rev().fold("é".to_owned(), |body, index| {
            format!("<test-level-{index}><template shadowrootmode=\"open\">{body}</template></test-level-{index}>")
        });
        for result in [
            artifact.render_entry(&JsonValue::Null, &Default::default()),
            artifact.render_entry_prepared(&prepared, &Default::default()),
            artifact.render_entry_json("{}", &Default::default()),
        ] {
            if depth == 32 {
                assert_eq!(result.unwrap(), expected);
            } else {
                let error = result.unwrap_err();
                assert_eq!(error.code, "render-limit");
                assert_eq!(error.message, "Component/body nesting exceeds 128 levels");
            }
        }
        assert_eq!(
            artifact
                .render_shadow_json(
                    &format!("test-level-{}", depth - 1),
                    "{}",
                    &Default::default(),
                )
                .unwrap(),
            "<template shadowrootmode=\"open\">é</template>",
        );
    }
}

#[test]
fn native_body_depth_accepts_128_nested_calls_but_not_129() {
    let bytes = compile_server_artifact("ok", &common::make_locator(&[])).unwrap();
    let original: Value = serde_json::from_slice(&bytes).unwrap();
    for depth in [128, 129] {
        let mut ir = original.clone();
        ir["program"]["entry"] = json!([{"type":"template","name":"next0"}]);
        let mut templates = serde_json::Map::new();
        for index in 0..depth {
            let body = if index + 1 == depth {
                json!([{"type":"literal","html":"ok"}])
            } else {
                json!([{"type":"template","name":format!("next{}", index + 1)}])
            };
            templates.insert(format!("next{index}"), body);
        }
        ir["program"]["templates"] = json!(templates);
        let artifact = CompiledArtifact::load(ir.to_string().as_bytes()).unwrap();
        let native = artifact.render_entry(&JsonValue::Null, &Default::default());
        if depth == 128 {
            assert_eq!(native.unwrap(), "ok");
        } else {
            assert_eq!(native.unwrap_err().code, "render-limit");
        }
        let result = render_json(&semantic_plan(&ir), "null", json!({}), "entry", "");
        if depth == 128 {
            assert_eq!(result, json!({"value":"ok"}));
        } else {
            assert_eq!(result["error"]["code"], "render-limit");
        }
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
    incompatible["version"] = json!(99);
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
