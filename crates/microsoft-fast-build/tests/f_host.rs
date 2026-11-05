use microsoft_fast_build::{
    parse_f_templates, render_entry_template_stream_with_locator,
    render_entry_template_with_locator, render_template_stream_with_locator,
    render_template_with_locator, Locator, RenderConfig,
};

#[test]
fn host_metadata_is_optional_and_legacy_attributes_are_not_forwarded() {
    let source = r#"<f-template name="my-button" role="legacy" shadowrootmode="closed">
      <template tabindex="7" title="{{ignored}}" shadowrootmode="open"><slot></slot></template>
    </f-template>"#;
    let definitions = parse_f_templates(source).unwrap();
    assert!(definitions[0].host_attributes.is_empty());
    assert!(definitions[0].bindings.is_empty());
    assert_eq!(
        definitions[0].shadowroot_attributes,
        [("shadowrootmode".into(), Some("open".into()))]
    );
    let locator = Locator::from_metadata(definitions).unwrap();
    let html = render_entry_template_with_locator("<my-button></my-button>", "{}", &locator, None)
        .unwrap();
    assert!(html.starts_with("<my-button><template shadowrootmode=\"open\""));
    assert!(!html.contains("legacy") && !html.contains("tabindex") && !html.contains("title"));
}

#[test]
fn missing_and_multiple_inner_templates_remain_permissive_for_browser_diagnostics() {
    for host in ["", r#"<f-host role="button"></f-host>"#] {
        let source = format!(
            r#"<f-template name="test-element-no-template">{host}<span>No template element provided</span></f-template>
<f-template name="test-element-multiple-templates"><template><span>First template</span></template>{host}<template><span>Second template</span></template></f-template>"#,
        );
        let definitions = parse_f_templates(&source).unwrap();
        assert_eq!(definitions.len(), 2);
        assert_eq!(
            definitions[0].content,
            "<span>No template element provided</span>"
        );
        assert_eq!(definitions[1].content, "<span>First template</span>");
        for definition in &definitions {
            assert_eq!(
                definition.host_attributes.len(),
                usize::from(!host.is_empty())
            );
        }
        assert!(Locator::from_metadata(definitions).is_ok());
    }
}

#[test]
fn missing_inner_template_excludes_host_content_without_shifting_fallback_binding_spans() {
    let source = "😀\r\n<f-template name=\"my-button\">{{ before }}<f-host title=\"{{ title }}\"><template>{{ignored}}</template></f-host>{{ after }}</f-template>";
    let definitions = parse_f_templates(source).unwrap();
    assert_eq!(definitions[0].content, "{{ before }}{{ after }}");
    let bindings = &definitions[0].bindings;
    assert_eq!(
        bindings
            .iter()
            .map(|binding| binding.expression.as_str())
            .collect::<Vec<_>>(),
        ["before", "title", "after"]
    );
    let units: Vec<_> = source.encode_utf16().collect();
    let mut previous = 0;
    for binding in bindings {
        assert!(binding.span.start.offset >= previous);
        assert_eq!(
            String::from_utf16(&units[binding.span.start.offset..binding.span.end.offset]).unwrap(),
            binding.expression
        );
        previous = binding.span.end.offset;
    }
}

#[test]
fn host_boolean_bindings_render_without_instance_attributes_and_publisher_hidden_stays_metadata() {
    let definitions = parse_f_templates(
        r#"<f-template name="my-button" hidden><f-host role="button" tabindex="0" appearance="{{hostAttr}}" ?disabled="{{disabled}}"></f-host><template><slot></slot></template></f-template>"#,
    )
    .unwrap();
    assert!(!definitions[0]
        .host_attributes
        .iter()
        .any(|(name, _)| name == "hidden"));
    let locator = Locator::from_metadata(definitions).unwrap();
    for (state, expected) in [
        (
            r#"{"hostAttr":"accent","disabled":true}"#,
            r#"<my-button role="button" tabindex="0" appearance="accent" disabled>"#,
        ),
        (
            r#"{"hostAttr":"accent","disabled":false}"#,
            r#"<my-button role="button" tabindex="0" appearance="accent">"#,
        ),
        (
            r#"{"hostAttr":"accent"}"#,
            r#"<my-button role="button" tabindex="0" appearance="accent">"#,
        ),
    ] {
        let entry = "<my-button></my-button>";
        let html = render_entry_template_with_locator(entry, state, &locator, None).unwrap();
        let chunks =
            render_entry_template_stream_with_locator(entry, state, &locator, None).unwrap();
        assert!(html.starts_with(&format!("{expected}<template ")), "{html}");
        assert!(!html.contains("hidden") && !html.contains("?disabled"));
        assert_eq!(chunks.concat(), html);
    }
}

#[test]
fn host_bindings_use_existing_normal_and_stream_semantics_before_dsd() {
    let definitions = parse_f_templates(
        r#"<f-template name="my-button">
        <f-host role="button" tabindex="0" appearance="{{appearance}}"
          title="{{label}}" ?disabled="{{disabled}}" aria-hidden="{{disabled}}"
          data-empty="{{empty}}" data-null="{{absent}}" @click="{handle()}" :value="{value}"
          f-ref="{host}">discard this content</f-host>
        <template shadowrootmode="closed"><slot></slot>{{label}}</template>
        </f-template>"#,
    )
    .unwrap();
    assert!(!definitions[0].content.contains("f-host"));
    let locator = Locator::from_metadata(definitions).unwrap();
    for markers_v2 in [false, true] {
        let config = RenderConfig::new().with_markers_v2(markers_v2);
        for (entry, expected) in [
            (
                "<my-button></my-button>",
                r#"<my-button role="button" tabindex="0" appearance="accent" title="Hello" disabled aria-hidden="true" data-empty="">"#,
            ),
            (
                r#"<my-button ROLE="link" tabindex="2" appearance="outline" title="{{absent}}" ?disabled="{{off}}"></my-button>"#,
                r#"<my-button ROLE="link" tabindex="2" appearance="outline" aria-hidden="true" data-empty="">"#,
            ),
        ] {
            let state = r#"{"appearance":"accent","label":"Hello","disabled":true,"off":false,"empty":"","absent":null}"#;
            let normal =
                render_entry_template_with_locator(entry, state, &locator, Some(&config)).unwrap();
            let chunks =
                render_entry_template_stream_with_locator(entry, state, &locator, Some(&config))
                    .unwrap();
            assert!(
                normal.starts_with(&format!("{expected}<template shadowrootmode=\"closed\"")),
                "{normal}"
            );
            assert_eq!(chunks.concat(), normal);
            assert!(chunks[0].starts_with(expected) && chunks[0].contains("</template>"));
            assert!(!normal.contains("f-host") && !normal.contains("discard this"));
            assert!(
                !normal.contains("@click")
                    && !normal.contains(":value")
                    && !normal.contains("f-ref")
            );
            assert_eq!(
                render_template_with_locator(entry, state, &locator, Some(&config)).unwrap(),
                render_template_stream_with_locator(entry, state, &locator, Some(&config))
                    .unwrap()
                    .concat()
            );
        }
    }
}

#[test]
fn host_spans_retain_authored_order_on_either_side_of_content() {
    for source in [
        "😀\r\n<f-template name=\"my-button\"><f-host title='{{ title }}' @click='{ save() }'></f-host><template>{{ title }}<template>{{ nested }}</template></template></f-template>",
        "😀\r\n<f-template name=\"my-button\"><template>{{ title }}<template>{{ nested }}</template></template>\r<f-host title='{{ title }}' @click='{ save() }'></f-host></f-template>",
    ] {
        let templates = parse_f_templates(source).unwrap();
        let bindings = &templates[0].bindings;
        assert_eq!(bindings.len(), 4);
        assert_eq!(bindings.iter().filter(|binding| binding.kind == "hostAttribute").count(), 1);
        let units: Vec<_> = source.encode_utf16().collect();
        let mut previous = 0;
        for binding in bindings {
            assert!(binding.span.start.offset >= previous);
            assert_eq!(
                String::from_utf16(&units[binding.span.start.offset..binding.span.end.offset]).unwrap(),
                binding.expression
            );
            previous = binding.span.end.offset;
        }
        assert!(templates[0].content.ends_with("</template>"));
    }
}

#[test]
fn only_direct_host_declarations_are_metadata() {
    let source = r#"<f-template name="my-button">
      <!-- <f-host role="comment"></f-host> -->
      <script>const text = '<f-template><f-host role="script"></f-host></f-template>';</script>
      <div><f-host role="nested"></f-host></div>
      <F-HOST role="button"></F-HOST>
      <template><span data-example="<f-host>"></span><style>x::before{content:"<f-host>"}</style><slot></slot></template>
    </f-template>"#;
    let templates = parse_f_templates(source).unwrap();
    assert_eq!(
        templates[0].host_attributes,
        [("role".into(), Some("button".into()))]
    );
    assert!(templates[0].content.starts_with("<span"));
}

#[test]
fn invalid_host_declarations_are_explicit_located_errors() {
    for body in [
        "<f-host></f-host><template></template><f-host></f-host>",
        "<f-host><template></template>",
        "<f-host role=\"unfinished",
        "<f-host/><template></template>",
        "</f-host><template></template>",
        "<f-host></f-host extra><template></template>",
        "<f-host <template></f-host><template></template>",
    ] {
        let source = format!("\r\n<f-template name=\"my-button\">{body}</f-template>");
        let error = parse_f_templates(&source).unwrap_err();
        assert_eq!(error.code(), "invalid-template-metadata", "{error}");
        assert!(error.location().is_some(), "{error}");
        assert!(error.to_string().contains("f-host") || error.to_string().contains("unclosed"));
        assert_eq!(error.template_name(), Some("my-button"));
    }
    assert!(
        parse_f_templates("<f-template name=\"my-button\"><f-host></f-host>")
            .unwrap_err()
            .to_string()
            .contains("unclosed")
    );
}

#[test]
fn file_locator_propagates_invalid_host_declarations() {
    let directory = tempfile::tempdir().unwrap();
    std::fs::write(directory.path().join("button.html"),
        "<f-template name=\"my-button\"><f-host></f-host><f-host></f-host><template></template></f-template>"
    ).unwrap();
    let pattern = directory
        .path()
        .join("*.html")
        .to_string_lossy()
        .replace('\\', "/");
    assert_eq!(
        Locator::from_patterns(&[&pattern]).err().unwrap().code(),
        "invalid-template-metadata"
    );
}
