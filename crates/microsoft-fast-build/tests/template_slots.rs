use microsoft_fast_build::extract_template_slots;

#[test]
fn slots_retain_names_order_duplicates_and_original_coordinates() {
    let html = "<p>prefix</p>\r\n<f-template name=\"card\">\r\n  <template>\r\n    <slot name=\"title\"></slot>\r\n    <slot></slot>\r\n    <slot name=\"title\"></slot>\r\n  </template>\r\n</f-template>";
    let slots = extract_template_slots(html, "card").unwrap();
    assert_eq!(
        slots
            .iter()
            .map(|slot| (slot.name.as_str(), slot.line, slot.column))
            .collect::<Vec<_>>(),
        [("title", 4, 5), ("", 5, 5), ("title", 6, 5)],
    );
    let unicode = "<f-template name=card><template>\r\n\t😀é<slot name=x></slot>\r<slot></slot>\n<slot></slot></template></f-template>";
    let slots = extract_template_slots(unicode, "card").unwrap();
    assert_eq!(
        slots
            .iter()
            .map(|slot| (slot.line, slot.column))
            .collect::<Vec<_>>(),
        [(2, 5), (3, 1), (4, 1)],
    );
}

#[test]
fn html_contexts_and_attribute_decoding_follow_the_parser() {
    let html = r#"
<!-- <f-template name=card><template><slot></slot></template></f-template> -->
<f-template name=card><template>
<!-- <slot name=comment> -->
<script>"</template></f-template><slot name=script>"</script>
<style>slot::before { content: '<slot name=style>'; }</style>
<textarea><slot name=textarea></textarea>
<title><slot name=title></title>
<iframe><slot name=iframe></iframe>
<xmp><slot name=xmp></xmp>
<noembed><slot name=noembed></noembed>
<noframes><slot name=noframes></noframes>
<noscript><slot name=noscript></noscript>
<div data-example="<slot name=attribute>"></div>
&lt;slot name=escaped&gt;
<SLOT NAME="a&amp;b&#x1f600;" name=ignored></SLOT>
<slot name="&copy &copyx &amp= &#128; &#0;"></slot>
<slot name></slot>
</template></f-template>"#;
    let slots = extract_template_slots(html, "card").unwrap();
    assert_eq!(
        slots
            .iter()
            .map(|slot| slot.name.as_str())
            .collect::<Vec<_>>(),
        ["a&b😀", "© &copyx &amp= € �", ""],
    );
}

#[test]
fn scope_includes_latent_templates_but_not_other_definitions_or_shadow_roots() {
    let html = r#"<slot name=outside></slot>
<f-template name=other><template><slot name=other></slot></template></f-template>
<f-template name=card>
<slot name=publisher></slot><template>
<f-when value="{{shown}}"><slot name=conditional></slot></f-when>
<f-repeat value="{{item in items}}"><slot name=repeated></slot></f-repeat>
<template><slot name=latent></slot></template>
<f-template name=nested><template><slot name=nested></slot></template></f-template>
<nested-card><template shadowrootmode=open><slot name=shadow></slot></template></nested-card>
<slot name=last></slot>
</template><slot name=after></slot></f-template>"#;
    let slots = extract_template_slots(html, "card").unwrap();
    assert_eq!(
        slots
            .iter()
            .map(|slot| slot.name.as_str())
            .collect::<Vec<_>>(),
        ["conditional", "repeated", "latent", "last"],
    );
}

#[test]
fn foreign_elements_are_excluded_but_html_integration_points_are_included() {
    let html = r#"<f-template name=card><template>
<svg><slot name=svg></slot><foreignObject><slot name=html-svg></slot></foreignObject>
<title><slot name=html-title></slot></title>
<![CDATA[<slot name=cdata>]]></svg>
<math><slot name=math></slot><mtext><slot name=html-math></slot></mtext></math>
<math><annotation-xml encoding="text/html"><slot name=annotation></slot></annotation-xml></math>
<slot name=html></slot></template></f-template>"#;
    let slots = extract_template_slots(html, "card").unwrap();
    assert_eq!(
        slots
            .iter()
            .map(|slot| slot.name.as_str())
            .collect::<Vec<_>>(),
        ["html-svg", "html-title", "html-math", "annotation", "html"],
    );
}

#[test]
fn selection_errors_are_not_empty_slot_results() {
    assert!(extract_template_slots(
        "<f-template name=card><template></template></f-template>",
        "card"
    )
    .unwrap()
    .is_empty());
    for (html, name, code) in [
        ("", "", "invalid-template-metadata"),
        ("", "card", "missing-template"),
        ("<f-template name=card></f-template>", "card", "missing-inner-template"),
        ("<f-template name=card><template></template><template></template></f-template>", "card", "multiple-inner-templates"),
        ("<f-template name=card><template></template></f-template><f-template name=card><template></template></f-template>", "card", "invalid-template-metadata"),
    ] {
        assert_eq!(extract_template_slots(html, name).unwrap_err().code(), code);
    }
}

#[test]
fn decoded_definition_names_are_case_sensitive_and_dsd_roots_are_inspectable() {
    let html = r#"<f-template NAME="a&amp;b"><template shadowrootmode=open><slot></slot></template></f-template>"#;
    assert_eq!(extract_template_slots(html, "a&b").unwrap().len(), 1);
    assert_eq!(
        extract_template_slots(html, "A&B").unwrap_err().code(),
        "missing-template"
    );
}

#[test]
fn parser_recovery_preserves_authored_order_after_foster_parenting() {
    let html = r#"<f-template name=card><template><table><tr><td><slot name=first></slot></td></tr><slot name=second></slot></table></template></f-template>"#;
    let slots = extract_template_slots(html, "card").unwrap();
    assert_eq!(
        slots
            .iter()
            .map(|slot| slot.name.as_str())
            .collect::<Vec<_>>(),
        ["first", "second"]
    );
    for slot in slots {
        assert_eq!(
            slot.column,
            html.find(&format!("<slot name={}", slot.name)).unwrap() + 1
        );
    }
}
