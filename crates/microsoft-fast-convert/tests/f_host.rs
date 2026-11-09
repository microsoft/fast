use microsoft_fast_convert::convert_template;

const SYNTAXES: [&str; 3] = [
    "webui-prerelease",
    "webui-framework-prerelease",
    "fast-v3-ts",
];

#[test]
fn host_attributes_are_converted_without_rendering_metadata_content() {
    let source = r#"<f-template name="my-button" role="legacy">
      <f-host role="button" tabindex="0" appearance="{{appearance}}" @click="{handle($e)}">discard</f-host>
      <template title="{{ignored}}" shadowrootmode="open"><slot></slot><template>{{nested}}</template></template>
    </f-template>"#;
    for syntax in SYNTAXES {
        let output = convert_template(source, syntax).unwrap().output;
        assert!(output.contains("role=\"button\""), "{output}");
        assert!(output.contains("tabindex=\"0\""), "{output}");
        assert!(
            output.contains("appearance=") && output.contains("handle"),
            "{output}"
        );
        assert!(output.contains("shadowrootmode=\"open\""), "{output}");
        assert!(
            !output.contains("f-host")
                && !output.contains("discard")
                && !output.contains("ignored")
                && !output.contains("legacy")
        );
    }
}

#[test]
fn host_may_follow_content_and_legacy_attributes_are_not_host_bindings() {
    for syntax in SYNTAXES {
        let source = r#"<F-TEMPLATE NAME="my-button" role="legacy"><TEMPLATE title="{{ignored}}"><slot></slot></TEMPLATE><F-HOST role="button"></F-HOST></F-TEMPLATE>"#;
        let output = convert_template(source, syntax).unwrap().output;
        assert!(output.contains("<template role=\"button\">"));
        assert!(!output.contains("ignored") && !output.contains("legacy"));
    }
}

#[test]
fn duplicate_and_unclosed_hosts_are_located_errors() {
    for syntax in SYNTAXES {
        let source = "<f-template name=\"my-button\"><f-host></f-host>\r\n<f-host></f-host><template></template></f-template>";
        let error = convert_template(source, syntax).unwrap_err();
        assert_eq!(error.code(), "multiple-hosts");
        assert_eq!(error.location().unwrap().line, 2);
        assert_eq!(error.template_name(), Some("my-button"));
        for body in [
            "<f-host><template></template>",
            "<f-host/><template></template>",
            "<f-host role=\"unfinished",
            "<f-host></f-host extra><template></template>",
            "<f-host <template></f-host><template></template>",
            "</f-host><template></template>",
        ] {
            let source = format!("<f-template name=\"my-button\">{body}</f-template>");
            assert!(convert_template(&source, syntax).is_err());
        }
    }
}

#[test]
fn errors_in_moved_host_attributes_and_unchanged_content_keep_authored_locations() {
    for syntax in SYNTAXES {
        let source = "<f-template name=\"my-button\">\r\n<f-host f-unknown=\"{host}\"></f-host><template><slot></slot></template></f-template>";
        let error = convert_template(source, syntax).unwrap_err();
        assert_eq!(error.code(), "unsupported-f-attribute");
        let location = error.location().unwrap();
        assert_eq!(
            (location.line, location.column, location.length),
            (2, 1, "<f-host f-unknown=\"{host}\">".len())
        );
        assert_eq!(error.template_name(), Some("my-button"));
        let source = "<f-template name=\"my-button\"><template class=\"ignored\">\r\n<f-unknown></f-unknown></template><f-host role=\"button\"></f-host></f-template>";
        let error = convert_template(source, syntax).unwrap_err();
        assert_eq!(error.code(), "unsupported-f-element");
        assert_eq!(
            (
                error.location().unwrap().line,
                error.location().unwrap().column
            ),
            (2, 1)
        );
    }
}
