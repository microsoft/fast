mod common;

use microsoft_fast_build::{
    compile_server_artifact, parse_render_state, CompiledArtifact, Locator, NativeRenderOptions,
    PreparedState,
};
use serde_json::json;

const SHADOW_OPEN: &str = "<template shadowrootmode=\"open\">";

fn compile(entry: &str, locator: &Locator) -> CompiledArtifact {
    CompiledArtifact::load(&compile_server_artifact(entry, locator).unwrap()).unwrap()
}

// Frozen native marker spellings, independent of the executor's span assembly.
fn attribute(index: usize, count: usize, v2: bool) -> String {
    if !v2 {
        format!(" data-fe=\"{count}\"")
    } else if count == 1 {
        format!(" data-fe-b-{index}")
    } else {
        format!(" data-fe-c-{index}-{count}")
    }
}

fn boundary(kind: &str, index: usize, repeat: bool, v2: bool) -> String {
    if v2 {
        if repeat {
            format!("<!--fe-repeat$${kind}$${index}$$fe-repeat-->")
        } else {
            format!("<!--fe-b$${kind}$${index}$$fast-build$$fe-b-->")
        }
    } else {
        match (repeat, kind) {
            (true, "start") => "<!--fe:r-->".into(),
            (true, _) => "<!--fe:/r-->".into(),
            (false, "start") => "<!--fe:b-->".into(),
            _ => "<!--fe:/b-->".into(),
        }
    }
}

fn wrapped(text: &str, index: usize, repeat: bool, v2: bool) -> String {
    format!(
        "{}{text}{}",
        boundary("start", index, repeat, v2),
        boundary("end", index, repeat, v2)
    )
}

#[test]
fn marker_modes_preserve_nested_adjacent_repeated_and_empty_bindings() {
    let content = concat!(
        "<i title='{{value}}' data-fixed='&amp;' ?hidden=\"{{hide}}\">",
        "{{value}}{{value}}</i>",
        "<f-when value=\"{{show}}\"><f-repeat value=\"{{row in rows}}\">",
        "<b title=\"{{row}}\">{{row}}</b></f-repeat></f-when>",
        "<f-when value=\"{{hide}}\">unused</f-when>",
        "<f-repeat value=\"{{row in empty}}\">{{row}}</f-repeat>"
    );
    let locator = common::make_locator(&[("test-markers", content)]);
    let artifact = compile("<test-markers></test-markers>", &locator);
    let plain = compile(content, &common::make_locator(&[]));
    let state_json = r#"{"value":"é<&","show":true,"hide":false,"rows":["尾",""],"empty":[]}"#;
    let state = parse_render_state(state_json).unwrap();
    let prepared = PreparedState::from_json(state_json).unwrap();
    for v2 in [false, true] {
        let options = NativeRenderOptions {
            markers_v2: v2,
            ..Default::default()
        };
        assert_eq!(
            plain.render_entry_json(state_json, &options).unwrap(),
            "<i title=\"é&lt;&amp;\" data-fixed='&amp;'>é&lt;&amp;é&lt;&amp;</i><b title=\"尾\">尾</b><b title=\"\"></b>"
        );
        let mut repeated = String::new();
        for (index, value) in ["尾", ""].iter().enumerate() {
            let row = format!(
                "<b title=\"{value}\"{}>{}</b>",
                attribute(0, 1, v2),
                wrapped(value, 1, false, v2)
            );
            repeated.push_str(&wrapped(&row, index, true, v2));
        }
        let nested = wrapped(&wrapped(&repeated, 0, false, v2), 4, false, v2);
        let expected = format!(
            "{SHADOW_OPEN}<i title=\"é&lt;&amp;\" data-fixed='&amp;'{}>{}{}</i>{nested}{}{}</template>",
            attribute(0, 2, v2),
            wrapped("é&lt;&amp;", 2, false, v2),
            wrapped("é&lt;&amp;", 3, false, v2),
            wrapped("", 5, false, v2),
            wrapped("", 6, false, v2)
        );
        assert_eq!(
            artifact
                .render_shadow_json("test-markers", state_json, &options)
                .unwrap(),
            expected
        );
        let host = format!("<test-markers>{expected}</test-markers>");
        assert_eq!(artifact.render_entry(&state, &options).unwrap(), host);
        assert_eq!(
            artifact
                .render_host_prepared("test-markers", &prepared, &options)
                .unwrap(),
            host
        );
        assert_eq!(
            artifact.render_template_json(state_json, &options).unwrap(),
            host
        );
        let disabled = NativeRenderOptions {
            dsd: Some(vec![]),
            ..options
        };
        assert_eq!(
            artifact.render_entry_json(state_json, &disabled).unwrap(),
            "<test-markers></test-markers>"
        );
        assert_eq!(
            artifact
                .render_shadow_json("test-markers", state_json, &disabled)
                .unwrap(),
            ""
        );
    }
}

#[test]
fn binding_counts_indices_and_repeat_indices_cross_decimal_widths() {
    let mut content = "{{value}}".repeat(101);
    let mut plain = "x".repeat(101);
    for count in [1, 9, 10, 99, 100] {
        content.push_str("<i");
        for index in 0..count {
            content.push_str(&format!(" ?flag{index}=\"{{{{off}}}}\""));
        }
        content.push_str("></i>");
        plain.push_str("<i></i>");
    }
    content.push_str("<f-repeat value=\"{{row in rows}}\">{{row}}</f-repeat>");
    plain.push_str(&"x".repeat(101));
    let locator = common::make_locator(&[("test-widths", &content)]);
    let artifact = compile("", &locator);
    let unhydrated = compile(&content, &common::make_locator(&[]));
    let state = json!({"value":"x","off":false,"rows":vec!["x";101]}).to_string();
    for v2 in [false, true] {
        let options = NativeRenderOptions {
            markers_v2: v2,
            ..Default::default()
        };
        assert_eq!(
            unhydrated.render_entry_json(&state, &options).unwrap(),
            plain
        );
        let mut expected = SHADOW_OPEN.to_owned();
        for index in 0..101 {
            expected.push_str(&wrapped("x", index, false, v2));
        }
        let mut next = 101;
        for count in [1, 9, 10, 99, 100] {
            expected.push_str(&format!("<i{}></i>", attribute(next, count, v2)));
            next += count;
        }
        let mut repeated = String::new();
        for index in 0..101 {
            repeated.push_str(&wrapped(&wrapped("x", 0, false, v2), index, true, v2));
        }
        expected.push_str(&wrapped(&repeated, next, false, v2));
        expected.push_str("</template>");
        let exact = NativeRenderOptions {
            max_output_bytes: expected.len(),
            ..options
        };
        assert_eq!(
            artifact
                .render_shadow_json("test-widths", &state, &exact)
                .unwrap(),
            expected
        );
        let short = NativeRenderOptions {
            max_output_bytes: expected.len() - 1,
            ..exact.clone()
        };
        assert_eq!(
            artifact
                .render_shadow_json("test-widths", &state, &short)
                .unwrap_err()
                .message,
            "Output byte limit exceeded"
        );
        assert_eq!(
            artifact
                .render_shadow_json("test-widths", &state, &exact)
                .unwrap(),
            expected
        );
    }
}

#[test]
fn component_marker_names_suppress_only_exact_host_defaults_in_authored_order() {
    let locator = common::make_locator_with_host_attrs(&[
        (
            "test-parent",
            "<test-leaf title='{{value}}'></test-leaf><test-leaf title=\"{{value}}\" ?hidden=\"{{off}}\"></test-leaf>{{value}}",
            &[],
        ),
        (
            "test-leaf",
            "",
            &[
                ("data-fe", Some("legacy")),
                ("data-fe-b-0", Some("binding")),
                ("data-fe-b-00", Some("leading-zero")),
                ("data-fe-c-1-2", Some("composite")),
                ("data-fe-c-1-20", Some("suffix")),
                ("role", Some("group")),
            ],
        ),
    ]);
    let artifact = compile("<test-parent></test-parent>", &locator);
    let state = r#"{"value":"é&\"","off":false}"#;
    for v2 in [false, true] {
        let options = NativeRenderOptions {
            markers_v2: v2,
            ..Default::default()
        };
        let mut expected = SHADOW_OPEN.to_owned();
        let mut unselected = SHADOW_OPEN.to_owned();
        for (index, count) in [(0, 1), (1, 2)] {
            let opening = format!(
                "<test-leaf title=\"é&amp;&quot;\"{}",
                attribute(index, count, v2)
            );
            expected.push_str(&opening);
            unselected.push_str(&format!("{opening}></test-leaf>"));
            for (name, value) in [
                ("data-fe", "legacy"),
                ("data-fe-b-0", "binding"),
                ("data-fe-b-00", "leading-zero"),
                ("data-fe-c-1-2", "composite"),
                ("data-fe-c-1-20", "suffix"),
                ("role", "group"),
            ] {
                if (!v2 && name == "data-fe")
                    || (v2 && count == 1 && name == "data-fe-b-0")
                    || (v2 && count == 2 && name == "data-fe-c-1-2")
                {
                    continue;
                }
                expected.push_str(&format!(" {name}=\"{value}\""));
            }
            expected.push_str(&format!(">{SHADOW_OPEN}</template></test-leaf>"));
        }
        let tail = wrapped("é&amp;&quot;", 3, false, v2);
        expected.push_str(&format!("{tail}</template>"));
        unselected.push_str(&format!("{tail}</template>"));
        assert_eq!(
            artifact
                .render_shadow_json("test-parent", state, &options)
                .unwrap(),
            expected
        );
        let selected = NativeRenderOptions {
            dsd: Some(vec!["test-parent".into()]),
            ..options
        };
        assert_eq!(
            artifact
                .render_shadow_json("test-parent", state, &selected)
                .unwrap(),
            unselected
        );
    }
}

#[test]
fn marker_byte_limits_and_step_limits_keep_repeat_error_precedence_and_recover() {
    let content = "{{value}}<f-repeat value=\"{{row in rows}}\">{{row}}</f-repeat>";
    let locator = common::make_locator(&[("test-limits", content)]);
    let artifact = compile("", &locator);
    let invalid = r#"{"value":"","rows":false}"#;
    let valid = r#"{"value":"","rows":[]}"#;
    let prepared = PreparedState::from_json(invalid).unwrap();
    for v2 in [false, true] {
        let prefix = format!("{SHADOW_OPEN}{}", wrapped("", 0, false, v2));
        let expected = format!("{prefix}{}</template>", wrapped("", 1, false, v2));
        for max_output_bytes in 0..=expected.len() + 1 {
            for max_steps in [0, 1, 2, 3] {
                let options = NativeRenderOptions {
                    markers_v2: v2,
                    max_output_bytes,
                    max_steps,
                    ..Default::default()
                };
                let (code, message) = if max_output_bytes < SHADOW_OPEN.len() {
                    ("render-limit", "Output byte limit exceeded")
                } else if max_steps == 0 {
                    ("render-limit", "Execution step limit exceeded")
                } else if max_output_bytes < prefix.len() {
                    ("render-limit", "Output byte limit exceeded")
                } else if max_steps == 1 {
                    ("render-limit", "Execution step limit exceeded")
                } else {
                    ("repeat-not-array", "repeat binding 'rows' is not an array")
                };
                let failed = artifact
                    .render_shadow_json("test-limits", invalid, &options)
                    .unwrap_err();
                assert_eq!((failed.code, failed.message.as_str()), (code, message));
                assert_eq!(
                    artifact
                        .render_shadow_prepared("test-limits", &prepared, &options)
                        .unwrap_err(),
                    failed
                );
            }
            let options = NativeRenderOptions {
                markers_v2: v2,
                max_output_bytes,
                max_steps: 2,
                ..Default::default()
            };
            let result = artifact.render_shadow_json("test-limits", valid, &options);
            if max_output_bytes < expected.len() {
                assert_eq!(result.unwrap_err().message, "Output byte limit exceeded");
            } else {
                assert_eq!(result.unwrap(), expected);
            }
            let exact = NativeRenderOptions {
                max_output_bytes: expected.len(),
                ..options
            };
            assert_eq!(
                artifact
                    .render_shadow_json("test-limits", valid, &exact)
                    .unwrap(),
                expected
            );
        }
    }
}

#[test]
fn nested_component_failure_precedes_parent_host_markers_even_at_zero_budget() {
    let locator = common::make_locator_with_host_attrs(&[
        (
            "test-outer",
            "<test-inner title=\"{{large}}\"></test-inner>",
            &[("title", Some("{{large}}"))],
        ),
        (
            "test-inner",
            "<f-repeat value=\"{{row in rows}}\">{{row}}</f-repeat>",
            &[],
        ),
    ]);
    let artifact = compile("<test-outer></test-outer>", &locator);
    let invalid = json!({"large":"&".repeat(128),"rows":false}).to_string();
    let valid = r#"{"large":"é&","rows":[]}"#;
    for v2 in [false, true] {
        let options = NativeRenderOptions {
            markers_v2: v2,
            ..Default::default()
        };
        let expected = artifact.render_entry_json(valid, &options).unwrap();
        for max_output_bytes in 0..=expected.len() {
            let limited = NativeRenderOptions {
                max_output_bytes,
                ..options.clone()
            };
            assert_eq!(
                artifact
                    .render_entry_json(&invalid, &limited)
                    .unwrap_err()
                    .code,
                "repeat-not-array"
            );
            assert_eq!(
                artifact
                    .render_shadow_json("test-outer", &invalid, &limited)
                    .unwrap_err()
                    .message,
                if max_output_bytes < SHADOW_OPEN.len() {
                    "Output byte limit exceeded"
                } else {
                    "repeat binding 'rows' is not an array"
                }
            );
            assert_eq!(
                artifact.render_entry_json(valid, &options).unwrap(),
                expected
            );
        }
    }
}
