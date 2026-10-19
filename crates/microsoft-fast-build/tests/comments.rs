use microsoft_fast_build::{
    parse_f_templates, render_entry_template_stream_with_locator,
    render_entry_template_with_locator, render_shadow_root_template_with_locator, render_template,
    render_template_stream, Locator, RenderConfig,
};
use std::collections::HashMap;

fn assert_render_and_stream(template: &str, state: &str, expected: &str) {
    assert_eq!(render_template(template, state, None).unwrap(), expected);
    assert_eq!(
        render_template_stream(template, state, None)
            .unwrap()
            .concat(),
        expected,
    );
}

#[test]
fn comments_are_literal_and_excluded_from_binding_metadata() {
    let comment = "<!-- café {{ignored}} {{{raw}}} {{}} {{unterminated -->";
    let content = format!("{comment}<span title=\"{{{{title}}}}\">{{{{text}}}}</span>");
    let definitions = parse_f_templates(&format!(
        "<f-template name=\"test-card\"><template>{content}</template></f-template>"
    ));
    assert_eq!(definitions[0].content, content);
    assert_eq!(
        definitions[0]
            .bindings
            .iter()
            .map(|binding| (binding.expression.as_str(), binding.kind.as_str()))
            .collect::<Vec<_>>(),
        [("title", "attribute"), ("text", "content")],
    );
    assert_render_and_stream(
        &content,
        r#"{"ignored":"WRONG","raw":"WRONG","title":"Title","text":"<&"}"#,
        &format!("{comment}<span title=\"Title\">&lt;&amp;</span>"),
    );
}

#[test]
fn commented_markup_does_not_create_bindings_or_shift_hydration_indices() {
    let comment = r#"<!-- <span title="{{ignored}}" @click="{handler()}" f-ref="{ref}"> {{{raw}}} <f-when value="{{hidden}}"> <f-repeat value="{{item in wrong}}"> <nested-card title='{{ignored}}'> " > -->"#;
    let content =
        format!("{{{{before}}}}{comment}<span title=\"{{{{title}}}}\">{{{{after}}}}</span>");
    let mut definitions = parse_f_templates(&format!(
        "<f-template name=\"test-card\"><template>{content}</template></f-template>"
    ));
    assert_eq!(
        definitions[0]
            .bindings
            .iter()
            .map(|binding| binding.expression.as_str())
            .collect::<Vec<_>>(),
        ["before", "title", "after"],
    );
    definitions.extend(parse_f_templates(
        r#"<f-template name="nested-card"><template>WRONG</template></f-template>"#,
    ));
    let locator = Locator::from_metadata(definitions).unwrap();
    let state = r#"{"before":"A","title":"T","after":"B","wrong":[1]}"#;
    for markers_v2 in [false, true] {
        let config = RenderConfig::new().with_markers_v2(markers_v2);
        let expected_content = if markers_v2 {
            format!(
                "<!--fe-b$$start$$0$$fast-build$$fe-b-->A<!--fe-b$$end$$0$$fast-build$$fe-b-->{comment}<span title=\"T\" data-fe-b-1>\
                 <!--fe-b$$start$$2$$fast-build$$fe-b-->B<!--fe-b$$end$$2$$fast-build$$fe-b--></span>"
            )
        } else {
            format!(
                "<!--fe:b-->A<!--fe:/b-->{comment}<span title=\"T\" data-fe=\"1\"><!--fe:b-->B<!--fe:/b--></span>"
            )
        };
        let fragment = render_shadow_root_template_with_locator(
            "test-card",
            Some(state),
            &locator,
            Some(&config),
        )
        .unwrap();
        assert_eq!(
            fragment,
            format!("<template shadowrootmode=\"open\" shadowroot=\"open\">{expected_content}</template>"),
        );
        let entry = format!("<test-card>{comment}{{{{after}}}}</test-card>");
        let expected = format!("<test-card>{fragment}{comment}B</test-card>");
        assert_eq!(
            render_entry_template_with_locator(&entry, state, &locator, Some(&config)).unwrap(),
            expected,
        );
        assert_eq!(
            render_entry_template_stream_with_locator(&entry, state, &locator, Some(&config))
                .unwrap()
                .concat(),
            expected,
        );
    }
}

#[test]
fn commented_template_tags_do_not_change_definition_or_body_extraction() {
    let prefix = r#"<!-- <f-template name="fake"><template>{{wrong}}</template></f-template> -->"#;
    let before = r#"<!-- <template title="{{wrong}}">ignored</template> -->"#;
    let comment = r#"<!-- </template> </f-template> <template title='{{wrong}}'> " -->"#;
    let content = format!("{comment}<b>{{{{real}}}}</b>");
    let definitions = parse_f_templates(&format!(
        "{prefix}<f-template name=\"test-card\">{before}<template title=\"{{{{title}}}}\">{content}</template></f-template>"
    ));
    assert_eq!(definitions.len(), 1);
    assert_eq!(definitions[0].name.as_deref(), Some("test-card"));
    assert_eq!(definitions[0].content, content);
    assert_eq!(
        definitions[0]
            .bindings
            .iter()
            .map(|binding| binding.expression.as_str())
            .collect::<Vec<_>>(),
        ["title", "real"],
    );
}

#[test]
fn commented_closing_and_opening_tags_do_not_change_directive_depth() {
    for tag in ["f-when", "f-repeat"] {
        for fake in [
            format!("</{tag}>"),
            format!("<{tag} value='{{{{wrong}}}}'>"),
        ] {
            let comment = format!("<!-- {fake} <span title='> {{ignored}}'> \" -->");
            let value = if tag == "f-when" {
                "show"
            } else {
                "item in items"
            };
            let template = format!(
                "<{tag} value=\"{{{{{value}}}}}\">{comment}<b>{{{{real}}}}</b></{tag}>{{{{after}}}}"
            );
            assert_render_and_stream(
                &template,
                r#"{"show":true,"items":[1],"real":"R","after":"A"}"#,
                &format!("{comment}<b>R</b>A"),
            );
        }
    }
}

#[test]
fn nested_repeats_ignore_commented_directives_and_retain_metadata_scopes() {
    let comment = r#"<!-- </f-repeat> <f-when value="{{wrong}}"> -->"#;
    let content = format!(
        "<f-repeat value=\"{{{{group in groups}}}}\">{comment}<f-repeat value=\"{{{{item in group.items}}}}\">{{{{item}}}}</f-repeat></f-repeat>{{{{after}}}}"
    );
    let definitions = parse_f_templates(&format!(
        "<f-template name=\"test-card\"><template>{content}</template></f-template>"
    ));
    let bindings = &definitions[0].bindings;
    assert_eq!(
        bindings
            .iter()
            .map(|binding| binding.expression.as_str())
            .collect::<Vec<_>>(),
        ["groups", "group.items", "item", "after"],
    );
    assert_eq!(bindings[2].scope.len(), 2);
    assert_eq!(bindings[2].scope[0].variable, "group");
    assert_eq!(bindings[2].scope[1].iterable, "group.items");
    assert_render_and_stream(
        &content,
        r#"{"groups":[{"items":["A","B"]},{"items":["C"]}],"after":"D"}"#,
        &format!("{comment}AB{comment}CD"),
    );
    let locator = Locator::from_metadata(definitions).unwrap();
    for markers_v2 in [false, true] {
        let binding = |value: &str, index: usize| {
            if markers_v2 {
                format!("<!--fe-b$$start$${index}$$fast-build$$fe-b-->{value}<!--fe-b$$end$${index}$$fast-build$$fe-b-->")
            } else {
                format!("<!--fe:b-->{value}<!--fe:/b-->")
            }
        };
        let item = |value: &str, index: usize| {
            if markers_v2 {
                format!("<!--fe-repeat$$start$${index}$$fe-repeat-->{value}<!--fe-repeat$$end$${index}$$fe-repeat-->")
            } else {
                format!("<!--fe:r-->{value}<!--fe:/r-->")
            }
        };
        let first = format!(
            "{comment}{}",
            binding(
                &format!("{}{}", item(&binding("A", 0), 0), item(&binding("B", 0), 1)),
                0,
            ),
        );
        let second = format!("{comment}{}", binding(&item(&binding("C", 0), 0), 0));
        let expected = format!(
            "<test-card><template shadowrootmode=\"open\" shadowroot=\"open\">{}{}</template></test-card>",
            binding(&format!("{}{}", item(&first, 0), item(&second, 1)), 0),
            binding("D", 1),
        );
        let config = RenderConfig::new().with_markers_v2(markers_v2);
        let state = r#"{"groups":[{"items":["A","B"]},{"items":["C"]}],"after":"D"}"#;
        let entry = "<test-card></test-card>";
        assert_eq!(
            render_entry_template_with_locator(entry, state, &locator, Some(&config)).unwrap(),
            expected,
        );
        assert_eq!(
            render_entry_template_stream_with_locator(entry, state, &locator, Some(&config))
                .unwrap()
                .concat(),
            expected,
        );
    }
}

#[test]
fn custom_element_children_ignore_commented_matching_tags() {
    let locator = Locator::from_templates(HashMap::from([(
        "test-card".into(),
        "<slot></slot>".into(),
    )]));
    for fake in ["</test-card>", "<test-card title='{{wrong}}'>"] {
        let comment = format!("<!-- {fake} -->");
        let entry = format!("<test-card>{comment}{{{{real}}}}</test-card>{{{{after}}}}");
        let expected = format!(
            "<test-card><template shadowrootmode=\"open\" shadowroot=\"open\"><slot></slot></template>{comment}R</test-card>A"
        );
        let state = r#"{"real":"R","after":"A"}"#;
        assert_eq!(
            render_entry_template_with_locator(&entry, state, &locator, None).unwrap(),
            expected,
        );
        assert_eq!(
            render_entry_template_stream_with_locator(&entry, state, &locator, None)
                .unwrap()
                .concat(),
            expected,
        );
    }
}

#[test]
fn code_preprocessing_preserves_comments_inside_and_outside_code() {
    let outside = r#"<!-- <code>{{ignored}} <f-when value="{{wrong}}"> -->"#;
    let inside = r#"<!-- </code> <code> {{ignored}} <f-repeat value="{{wrong}}"> -->"#;
    assert_render_and_stream(
        &format!("{outside}<code>{inside}{{{{sample}}}}</code>{{{{real}}}}"),
        r#"{"ignored":"WRONG","real":"R"}"#,
        &format!("{outside}<code>{inside}&#123;&#123;sample&#125;&#125;</code>R"),
    );
}

#[test]
fn comment_openers_in_quoted_attributes_do_not_hide_real_bindings() {
    let content = r#"<f-when value="{{show}}"><span title="<!--" data-label="{{real}}">{{real}}</span><!-- {{ignored}} --></f-when><code><span title="<!--">{{sample}}</span><!-- {{ignored}} --></code>{{after}}"#;
    let definitions = parse_f_templates(&format!(
        "<f-template name=\"test-card\"><template>{content}</template></f-template>"
    ));
    assert_eq!(definitions[0].content, content);
    assert_eq!(
        definitions[0]
            .bindings
            .iter()
            .map(|binding| binding.expression.as_str())
            .collect::<Vec<_>>(),
        ["show", "real", "real", "after"],
    );
    assert_render_and_stream(
        content,
        r#"{"show":true,"real":"R","after":"A"}"#,
        r#"<span title="<!--" data-label="R">R</span><!-- {{ignored}} --><code><span title="<!--">&#123;&#123;sample&#125;&#125;</span><!-- {{ignored}} --></code>A"#,
    );
}

#[test]
fn raw_less_than_text_does_not_consume_directive_closes_or_real_bindings() {
    for text in ["1 < 2", "Use < before a number", "1 <2", "1 << 2"] {
        let comment = "<!-- </f-when> </f-repeat> {{ignored}} -->";
        let quoted = r#"<span title="<!-- </f-when> </f-repeat> -->"></span>"#;
        for (tag, expression) in [("f-when", "show"), ("f-repeat", "item in items")] {
            assert_render_and_stream(
                &format!(
                    "<{tag} value=\"{{{{{expression}}}}}\">{text}{{{{real}}}}</{tag}>{{{{after}}}}"
                ),
                r#"{"show":true,"items":[1],"real":"R","after":"A"}"#,
                &format!("{text}RA"),
            );
            let template = format!(
                "<{tag} value=\"{{{{{expression}}}}}\">{text}{quoted}{comment}{{{{real}}}}</{tag}>{{{{after}}}}"
            );
            assert_render_and_stream(
                &template,
                r#"{"show":true,"items":[1],"real":"R","after":"A"}"#,
                &format!("{text}{quoted}{comment}RA"),
            );
        }
    }
}

#[test]
fn raw_less_than_text_does_not_hide_template_definitions_or_metadata() {
    for text in ["1 < 2", "Use < before a number", "1 <2", "1 << 2"] {
        let content = format!(
            "{text}<span title=\"<!-- </template> </f-template> -->\"></span><!-- {{{{ignored}}}} -->{{{{real}}}}"
        );
        let definitions = parse_f_templates(&format!(
            "{text}<f-template name=\"test-card\">{text}<template>{content}</template>{text}</f-template>"
        ));
        assert_eq!(definitions.len(), 1, "{text}");
        assert_eq!(definitions[0].content, content, "{text}");
        assert_eq!(
            definitions[0]
                .bindings
                .iter()
                .map(|binding| binding.expression.as_str())
                .collect::<Vec<_>>(),
            ["real"],
            "{text}",
        );
        assert_render_and_stream(
            &content,
            r#"{"real":"R"}"#,
            &format!(
                "{text}<span title=\"<!-- </template> </f-template> -->\"></span><!-- {{{{ignored}}}} -->R"
            ),
        );
    }
}

#[test]
fn unclosed_comments_are_literal_but_real_malformed_bindings_still_error() {
    assert_render_and_stream(
        "{{real}}<!-- {{ignored}} <f-repeat value=\"{{wrong}}\">",
        r#"{"real":"R","ignored":"WRONG"}"#,
        "R<!-- {{ignored}} <f-repeat value=\"{{wrong}}\">",
    );
    for binding in ["{{", "{{{", "{{}}", "{{{}}}"] {
        let template = format!("<!-- {{{{ignored}}}} -->{binding}");
        assert!(render_template(&template, "{}", None).is_err());
        assert!(render_template_stream(&template, "{}", None).is_err());
    }
}
