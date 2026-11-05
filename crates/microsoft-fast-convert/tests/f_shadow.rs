use microsoft_fast_convert::convert_template;

const SYNTAXES: [&str; 3] = [
    "webui-prerelease",
    "webui-framework-prerelease",
    "fast-v3-ts",
];

#[test]
fn shadow_metadata_maps_to_native_attributes_for_every_target() {
    let source = r#"<f-template name="my-button" shadowrootmode="closed"><f-shadow shadowrootmode="open" shadowrootdelegatesfocus shadowrootclonable shadowrootserializable></f-shadow><f-host role="button"></f-host><template shadowrootmode="closed"><slot></slot></template></f-template>"#;
    for syntax in SYNTAXES {
        let output = convert_template(source, syntax).unwrap().output;
        assert!(
            output.contains("shadowrootmode=\"open\""),
            "{syntax}: {output}"
        );
        assert!(
            output.contains("shadowrootdelegatesfocus"),
            "{syntax}: {output}"
        );
        assert!(output.contains("shadowrootclonable"), "{syntax}: {output}");
        assert!(
            output.contains("shadowrootserializable"),
            "{syntax}: {output}"
        );
        assert!(output.contains("role=\"button\""), "{syntax}: {output}");
        assert!(
            !output.contains("f-shadow") && !output.contains("closed"),
            "{syntax}: {output}"
        );
    }
}

#[test]
fn both_legacy_locations_remain_compatible_and_inner_mode_wins() {
    for (outer, inner, mode) in [
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
    ] {
        let source = format!(
            r#"<f-template name="my-button" {outer}><template {inner}><slot></slot></template></f-template>"#
        );
        for syntax in SYNTAXES {
            let output = convert_template(&source, syntax).unwrap().output;
            let expected = if inner.contains("shadowroot=") {
                "shadowroot"
            } else {
                "shadowrootmode"
            };
            assert!(
                output.contains(&format!("{expected}=\"{mode}\"")),
                "{output}"
            );
            assert!(output.contains("shadowrootdelegatesfocus"), "{output}");
        }
    }
}

#[test]
fn invalid_shadow_metadata_fails_before_conversion_with_a_location() {
    for declaration in [
        "<f-shadow></f-shadow><f-shadow></f-shadow>",
        "<f-shadow/>",
        "<f-shadow>",
        r#"<f-shadow shadowrootmode="invalid"></f-shadow>"#,
        r#"<f-shadow shadowrootmode="{{mode}}"></f-shadow>"#,
        r#"<f-shadow shadowrootdelegatesfocus="{{flag}}"></f-shadow>"#,
        r#"<f-shadow mode="open"></f-shadow>"#,
        "<f-shadow delegatesfocus></f-shadow>",
        "<f-shadow clonable></f-shadow>",
        "<f-shadow serializable></f-shadow>",
        "<f-shadow unknown></f-shadow>",
    ] {
        let source = format!(
            r#"<f-template name="my-button">{declaration}<template></template></f-template>"#
        );
        for syntax in SYNTAXES {
            let error = convert_template(&source, syntax).unwrap_err();
            assert!(error.to_string().contains("f-shadow"), "{error}");
            assert!(error.location().is_some(), "{error}");
        }
    }
}
