use microsoft_fast_build::{
    parse_f_templates, render_entry_template_stream_with_locator,
    render_entry_template_with_locator, render_shadow_root_template_with_locator, render_template,
    Locator, RenderConfig,
};
use std::collections::HashMap;

#[test]
fn null_and_missing_attributes_are_absent_but_empty_strings_are_preserved() {
    let template = r#"<a href="{{href}}" role="{{role}}" tabindex="{{tabindex}}" title="prefix{{missing}}"></a>"#;
    for state in [
        r#"{"href":null,"role":null,"tabindex":null,"missing":null}"#,
        "{}",
    ] {
        assert_eq!(render_template(template, state, None).unwrap(), "<a></a>");
    }
    assert_eq!(
        render_template(
            template,
            r#"{"href":"","role":"","tabindex":"","missing":""}"#,
            None
        )
        .unwrap(),
        r#"<a href="" role="" tabindex="" title="prefix"></a>"#
    );
}

#[test]
fn shadow_fragment_uses_component_state_and_reports_unknown_definitions() {
    let locator = Locator::from_templates(HashMap::from([
        (
            "test-card".into(),
            "{{title}}<nested-card></nested-card>".into(),
        ),
        ("nested-card".into(), "{{title}}".into()),
    ]));
    for markers_v2 in [false, true] {
        let config = RenderConfig::new().with_markers_v2(markers_v2);
        let fragment = render_shadow_root_template_with_locator(
            "test-card",
            Some(r#"{"title":"<&"}"#),
            &locator,
            Some(&config),
        )
        .unwrap();
        let whole = render_entry_template_with_locator(
            "<test-card><p>light</p></test-card>",
            r#"{"title":"<&"}"#,
            &locator,
            Some(&config),
        )
        .unwrap();
        assert_eq!(
            whole,
            format!("<test-card>{fragment}<p>light</p></test-card>")
        );
        assert!(fragment.contains("&lt;&amp;"));
    }
    assert!(
        render_shadow_root_template_with_locator("unknown", None, &locator, None)
            .unwrap_err()
            .to_string()
            .contains("unknown template")
    );
    assert!(
        render_shadow_root_template_with_locator("test-card", Some("{"), &locator, None).is_err()
    );
}

#[test]
fn author_null_or_false_does_not_reintroduce_template_host_defaults() {
    let mut locator = Locator::from_templates(HashMap::new());
    locator.add_template_with_attrs(
        "test-card",
        "<span></span>",
        &[],
        &[
            ("href".into(), Some("/default".into())),
            ("disabled".into(), None),
            ("role".into(), Some("button".into())),
        ],
    );
    for entry in [
        r#"<test-card href="{{href}}" disabled="{{enabled}}" role="prefix{{href}}"></test-card>"#,
        r#"<test-card href="{{href}}" ?disabled="{{enabled}}" role="{{href}}"></test-card>"#,
    ] {
        let html = render_entry_template_with_locator(
            entry,
            r#"{"href":null,"enabled":false}"#,
            &locator,
            None,
        )
        .unwrap();
        assert!(html.starts_with("<test-card>"), "{html}");
        assert_eq!(
            render_entry_template_stream_with_locator(
                entry,
                r#"{"href":null,"enabled":false}"#,
                &locator,
                None
            )
            .unwrap()
            .concat(),
            html
        );
    }
}

#[test]
fn mixed_host_attributes_resolve_every_segment_and_retain_empty_values() {
    let metadata = parse_f_templates(
        r#"<f-template name="test-card"><template title="{{first}}/{{second}}" role="prefix{{nullable}}"><span></span></template></f-template>"#,
    );
    let locator = Locator::from_metadata(metadata).unwrap();
    let state = r#"{"first":"","second":"","nullable":null}"#;
    for entry in [
        "<test-card></test-card>",
        r#"<test-card title="{{first}}/{{second}}" role="prefix{{nullable}}"></test-card>"#,
    ] {
        let whole = render_entry_template_with_locator(entry, state, &locator, None).unwrap();
        assert!(whole.starts_with(r#"<test-card title="/">"#), "{whole}");
        assert_eq!(
            render_entry_template_stream_with_locator(entry, state, &locator, None)
                .unwrap()
                .concat(),
            whole,
        );
    }
}

#[test]
fn metadata_retains_nested_repeat_aliases_and_does_not_invent_state_declarations() {
    let templates = parse_f_templates(
        r#"<f-template name="test-card"><template title="{{title}}"><f-repeat value="{{item in items}}"><f-repeat value="{{item in item.children}}"><span>{{item.name}} {{$index}}</span><button @click="{save(item.id, 'not.a.path')}"></button></f-repeat></f-repeat><f-when value="{{visible && count > 0}}">{{{html}}}</f-when><code>{{example}}</code></template></f-template>"#,
    );
    let template = &templates[0];
    assert_eq!(template.format_version, 1);
    let item = template
        .bindings
        .iter()
        .find(|binding| binding.name.as_deref() == Some("item.name"))
        .unwrap();
    assert_eq!(item.scope.len(), 2);
    assert_eq!(item.scope[0].iterable, "items");
    assert_eq!(item.scope[1].iterable, "item.children");
    assert!(item.optional.is_none() && item.value_type.is_none());
    let event = template
        .bindings
        .iter()
        .find(|binding| binding.kind == "event")
        .unwrap();
    assert_eq!(event.paths, ["save", "item.id"]);
    assert!(event.name.is_none());
    assert!(!template
        .bindings
        .iter()
        .any(|binding| binding.name.as_deref() == Some("example")));
    assert!(template
        .bindings
        .iter()
        .any(|binding| binding.kind == "repeat" && binding.value_type.as_deref() == Some("array")));
}

#[test]
fn native_metadata_locator_validates_versions_and_names() {
    let source = r#"<f-template name="test-card"><template>{{title}}</template></f-template>"#;
    let metadata = parse_f_templates(source);
    assert!(Locator::from_metadata(metadata.clone()).is_ok());
    let mut stale = metadata.clone();
    stale[0].format_version = 2;
    assert!(Locator::from_metadata(stale)
        .err()
        .unwrap()
        .to_string()
        .contains("formatVersion"));
    let mut unnamed = metadata.clone();
    unnamed[0].name = None;
    assert!(Locator::from_metadata(unnamed).is_err());
    let mut duplicate = metadata.clone();
    duplicate.extend(metadata);
    assert!(Locator::from_metadata(duplicate).is_err());
}

#[test]
fn metadata_covers_client_kinds_without_treating_literals_as_state() {
    let metadata = parse_f_templates(
        r#"<f-template name="test-card"><template><input :value="{input.value}" ?disabled="{{!enabled}}" f-ref="{inputElement}" f-slotted="{slots}" f-children="{children}" @click="{save(item.id, '{{notBinding}}')}"><f-when value="{{count > 1e3 && visible == true}}">{{{html}}}</f-when><f-when value="{{true}}"></f-when></template></f-template>"#,
    );
    let bindings = &metadata[0].bindings;
    for kind in [
        "property",
        "booleanAttribute",
        "attributeDirective",
        "event",
        "when",
        "unescapedContent",
    ] {
        assert!(
            bindings.iter().any(|binding| binding.kind == kind),
            "{kind}"
        );
    }
    let event = bindings
        .iter()
        .find(|binding| binding.kind == "event")
        .unwrap();
    assert_eq!(event.paths, ["save", "item.id"]);
    let conditions: Vec<_> = bindings
        .iter()
        .filter(|binding| binding.kind == "when")
        .collect();
    assert_eq!(conditions[0].paths, ["count", "visible"]);
    assert!(conditions[1].paths.is_empty());
    assert!(conditions[1].name.is_none());
}

#[test]
fn boolean_attributes_and_null_values_match_across_host_shadow_and_stream_paths() {
    let locator = Locator::from_templates(HashMap::from([(
        "test-card".into(),
        r#"<a href="{{href}}" role="{{role}}" tabindex="{{tabindex}}"></a><input disabled="{{disabled}}" ?checked="{{checked}}" aria-hidden="{{disabled}}">"#.into(),
    )]));
    for markers_v2 in [false, true] {
        let config = RenderConfig::new().with_markers_v2(markers_v2);
        for enabled in [false, true] {
            let state = format!(
                r#"{{"href":null,"role":null,"tabindex":null,"disabled":{enabled},"checked":{enabled}}}"#
            );
            let entry = r#"<test-card href="{{href}}" role="{{role}}" disabled="{{disabled}}"><a href="prefix{{href}}"></a></test-card>"#;
            let html =
                render_entry_template_with_locator(entry, &state, &locator, Some(&config)).unwrap();
            let chunks =
                render_entry_template_stream_with_locator(entry, &state, &locator, Some(&config))
                    .unwrap();
            assert_eq!(chunks.concat(), html);
            assert!(
                !html.contains("href=") && !html.contains("role=") && !html.contains("tabindex="),
                "{html}"
            );
            assert_eq!(html.contains(" disabled"), enabled, "{html}");
            assert_eq!(html.contains(" checked"), enabled, "{html}");
            assert!(
                html.contains(&format!(r#"aria-hidden="{enabled}""#)),
                "{html}"
            );
            assert!(
                html.contains("data-fe"),
                "Omitted attributes must retain hydration slots: {html}"
            );
        }
    }
}
