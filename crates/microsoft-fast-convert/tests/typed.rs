use microsoft_fast_convert::{
    convert_stylesheet_with_options, convert_template_with_options, ConvertOptions,
};

#[test]
fn typed_exports_preserve_source_generics_and_add_type_only_imports() {
    let source = r#"<f-template name="test-card"><template>{{title}}</template></f-template>"#;
    let options = ConvertOptions {
        typed: true,
        type_source: Some("Card".into()),
        type_source_import: Some("./card.js".into()),
    };
    let output = convert_template_with_options(source, "fast-v3-ts", &options)
        .unwrap()
        .output;
    assert!(output.contains("import type { ElementViewTemplate }"));
    assert!(output.contains("template: ElementViewTemplate<Card> = html<Card>"));
    let options = ConvertOptions {
        typed: true,
        ..ConvertOptions::default()
    };
    let output = convert_template_with_options(source, "fast-v3-ts", &options)
        .unwrap()
        .output;
    assert!(output.contains("template: ElementViewTemplate = html`"));
    let styles =
        convert_stylesheet_with_options("a { content: `${x}`; }", "fast-v3-ts", "styles", &options)
            .unwrap();
    assert!(styles.contains("import type { ElementStyles }"));
    assert!(styles.contains("styles: ElementStyles = css`"));
    assert!(styles.contains(r"\`\${x}\`"));
    assert!(convert_template_with_options(source, "webui-framework-prerelease", &options).is_err());
    assert!(convert_stylesheet_with_options(
        "a {}",
        "fast-v3-ts",
        "styles",
        &ConvertOptions {
            type_source: Some("Card".into()),
            ..options
        }
    )
    .is_err());
}

#[test]
fn typed_imports_handle_dotted_sources_and_name_collisions() {
    let source = r#"<f-template name="test-card"><template>{{title}}</template></f-template>"#;
    for name in ["Namespace.Card", "ElementViewTemplate"] {
        let output = convert_template_with_options(
            source,
            "fast-v3-ts",
            &ConvertOptions {
                typed: true,
                type_source: Some(name.into()),
                type_source_import: Some("./card.js".into()),
            },
        )
        .unwrap()
        .output;
        if name == "Namespace.Card" {
            assert!(output.contains("import type { Namespace }"));
        } else {
            assert!(output.contains("ElementViewTemplate as _ElementViewTemplate"));
            assert!(output.contains("template: _ElementViewTemplate<ElementViewTemplate>"));
        }
    }
    let output = convert_stylesheet_with_options(
        "a {}",
        "fast-v3-ts",
        "ElementStyles",
        &ConvertOptions {
            typed: true,
            ..ConvertOptions::default()
        },
    )
    .unwrap();
    assert!(output.contains("ElementStyles as _ElementStyles"));
    assert!(output.contains("export const ElementStyles: _ElementStyles"));
}
