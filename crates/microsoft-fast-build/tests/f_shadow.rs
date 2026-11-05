use microsoft_fast_build::{
    parse_f_templates, render_entry_template_stream_with_locator,
    render_entry_template_with_locator, Locator,
};

#[test]
fn shadow_metadata_configures_dsd_and_is_not_rendered() {
    let source = r#"<f-template name="my-button" shadowrootmode="closed">
        <f-shadow mode="open" delegatesFocus clonable serializable>discard {{ignored}}</f-shadow>
        <f-host role="button"></f-host>
        <template shadowrootmode="closed"><span>{{label}}</span></template>
    </f-template>"#;
    let definitions = parse_f_templates(source).unwrap();
    assert_eq!(definitions[0].bindings.len(), 1);
    assert_eq!(definitions[0].bindings[0].expression, "label");
    let locator = Locator::from_metadata(definitions).unwrap();
    let entry = "<my-button></my-button>";
    let state = r#"{"label":"Hello"}"#;
    let html = render_entry_template_with_locator(entry, state, &locator, None).unwrap();
    assert!(html.starts_with(
        r#"<my-button role="button"><template shadowrootmode="open" shadowroot="open" shadowrootdelegatesfocus shadowrootclonable shadowrootserializable>"#
    ), "{html}");
    assert!(!html.contains("f-shadow") && !html.contains("ignored") && !html.contains("discard"));
    assert_eq!(
        render_entry_template_stream_with_locator(entry, state, &locator, None)
            .unwrap()
            .concat(),
        html
    );
}

#[test]
fn shadow_declaration_defaults_and_closed_mode_are_independent_of_legacy_attributes() {
    for (declaration, mode) in [
        ("<f-shadow></f-shadow>", "open"),
        (r#"<f-shadow mode="closed"></f-shadow>"#, "closed"),
    ] {
        let source = format!(
            r#"<f-template name="my-button" shadowrootdelegatesfocus><template shadowrootclonable><slot></slot></template>{declaration}</f-template>"#
        );
        let definitions = parse_f_templates(&source).unwrap();
        assert_eq!(
            definitions[0].shadowroot_attributes,
            [("shadowrootmode".to_string(), Some(mode.to_string()))]
        );
    }
}

#[test]
fn legacy_outer_and_inner_attributes_remain_supported_with_inner_precedence() {
    for (outer, inner, expected_mode) in [
        (
            r#"shadowrootmode="closed" shadowrootdelegatesfocus"#,
            "",
            "closed",
        ),
        (
            "",
            r#"shadowrootmode="closed" shadowrootdelegatesfocus"#,
            "closed",
        ),
        (
            r#"shadowrootmode="open" shadowrootdelegatesfocus"#,
            r#"shadowroot="closed""#,
            "closed",
        ),
        (
            r#"shadowroot="open" shadowrootdelegatesfocus"#,
            r#"shadowrootmode="closed""#,
            "closed",
        ),
    ] {
        let source = format!(
            r#"<f-template name="my-button" {outer}><template {inner}><slot></slot></template></f-template>"#
        );
        let locator = Locator::from_metadata(parse_f_templates(&source).unwrap()).unwrap();
        let html =
            render_entry_template_with_locator("<my-button></my-button>", "{}", &locator, None)
                .unwrap();
        assert!(
            html.contains(&format!("shadowrootmode=\"{expected_mode}\"")),
            "{html}"
        );
        assert!(html.contains("shadowrootdelegatesfocus"), "{html}");
        assert!(!html.starts_with("<my-button shadowroot"), "{html}");
    }
}

#[test]
fn shadow_metadata_is_removed_from_fallback_content_without_moving_binding_spans() {
    let source = r#"<f-template name="my-button">{{before}}<f-shadow mode="open">{{ignored}}</f-shadow><f-host title="{{title}}"></f-host>{{after}}</f-template>"#;
    let definitions = parse_f_templates(source).unwrap();
    assert_eq!(definitions[0].content, "{{before}}{{after}}");
    assert_eq!(definitions[0].bindings.len(), 3);
    let units: Vec<_> = source.encode_utf16().collect();
    for binding in &definitions[0].bindings {
        assert_eq!(
            String::from_utf16(&units[binding.span.start.offset..binding.span.end.offset]).unwrap(),
            binding.expression
        );
    }
}

#[test]
fn invalid_shadow_declarations_report_authored_errors() {
    for body in [
        "<f-shadow></f-shadow><f-shadow></f-shadow><template></template>",
        "<f-shadow/><template></template>",
        "<f-shadow><template></template>",
        "<f-shadow></f-shadow invalid><template></template>",
        r#"<f-shadow mode="invalid"></f-shadow><template></template>"#,
        r#"<f-shadow mode="{{mode}}"></f-shadow><template></template>"#,
        r#"<f-shadow delegatesFocus="{{flag}}"></f-shadow><template></template>"#,
        r#"<f-shadow unknown></f-shadow><template></template>"#,
    ] {
        let source = format!(r#"<f-template name="my-button">{body}</f-template>"#);
        let error = parse_f_templates(&source).unwrap_err();
        assert!(error.to_string().contains("f-shadow"), "{error}");
        assert!(error.location().is_some(), "{error}");
    }
}
