mod common;
use common::make_locator;
use microsoft_fast_build::{
    compose_f_template_styles, render_template_with_locator, Locator, RenderError,
};

// ── success paths ──────────────────────────────────────────────────────────

#[test]
fn test_compose_inserts_style_as_first_child() {
    let input = r#"<f-template name="my-el"><template><span>hi</span></template></f-template>"#;
    let composed = compose_f_template_styles(input, ":host { display: block; }").expect("compose");
    assert_eq!(
        composed,
        r#"<f-template name="my-el"><template><style>:host { display: block; }</style><span>hi</span></template></f-template>"#
    );
}

#[test]
fn test_compose_preserves_outer_attributes_byte_for_byte() {
    let input = r#"<f-template name="my-el" shadowroot-mode="closed" data-extra="v"><template part="root"><p>x</p></template></f-template>"#;
    let composed = compose_f_template_styles(input, "p { color: red; }").expect("compose");
    assert!(composed.starts_with(
        r#"<f-template name="my-el" shadowroot-mode="closed" data-extra="v"><template part="root"><style>"#
    ));
    assert!(composed.ends_with(r#"</f-template>"#));
    assert!(composed.contains("<p>x</p>"));
}

#[test]
fn test_compose_preserves_surrounding_document_content() {
    let input = r#"<!doctype html><f-template name="my-el"><template>before</template></f-template><div>after</div>"#;
    let composed = compose_f_template_styles(input, "a{}").expect("compose");
    assert!(composed.starts_with("<!doctype html>"));
    assert!(composed.ends_with("<div>after</div>"));
}

#[test]
fn test_compose_with_empty_css_still_inserts_empty_style_element() {
    let input = r#"<f-template name="my-el"><template></template></f-template>"#;
    let composed = compose_f_template_styles(input, "").expect("compose");
    assert_eq!(
        composed,
        r#"<f-template name="my-el"><template><style></style></template></f-template>"#
    );
}

// ── consumable by the rendering pipeline ────────────────────────────────────

#[test]
fn test_composed_output_parseable_and_renderable_via_locator() {
    let input = r#"<f-template name="my-el"><template><span>hi</span></template></f-template>"#;
    let composed = compose_f_template_styles(input, ":host { display: block; }").expect("compose");

    let tmp = tempfile::tempdir().expect("create tempdir");
    let file = tmp.path().join("composed.html");
    std::fs::write(&file, &composed).expect("write composed.html");

    let pattern = format!("{}/*.html", tmp.path().display());
    let locator = Locator::from_patterns(&[&pattern]).expect("from_patterns");
    assert!(locator.has_template("my-el"));

    let rendered = render_template_with_locator("<my-el></my-el>", "{}", &locator, None)
        .expect("render with locator");
    assert!(rendered.contains(":host { display: block; }"));
    assert!(rendered.contains("<span>hi</span>"));
}

#[test]
fn test_composed_output_renders_with_in_memory_locator() {
    let input = r#"<f-template name="my-el"><template><span>hi</span></template></f-template>"#;
    let composed = compose_f_template_styles(input, "span { color: blue; }").expect("compose");

    // Reuse `common`'s in-memory locator helper — proves the inserted
    // <style> content survives once extracted as bare template content.
    let inner_start = composed.find("<template>").expect("inner template") + "<template>".len();
    let inner_end = composed.rfind("</template>").expect("inner close");
    let inner_content = &composed[inner_start..inner_end];
    let locator = make_locator(&[("my-el", inner_content)]);

    let rendered_via_locator =
        render_template_with_locator("<my-el></my-el>", "{}", &locator, None).expect("render");
    assert!(rendered_via_locator.contains("span { color: blue; }"));
    assert!(rendered_via_locator.contains("<span>hi</span>"));
}

// ── outer <f-template> validation ───────────────────────────────────────────

#[test]
fn test_compose_rejects_missing_f_template() {
    let e = compose_f_template_styles("<div><template>x</template></div>", "a{}")
        .expect_err("expected error");
    assert!(
        matches!(e, RenderError::MissingFTemplate),
        "wrong variant: {e}"
    );
}

#[test]
fn test_compose_rejects_multiple_f_templates() {
    let input = r#"<f-template name="a"><template>x</template></f-template><f-template name="b"><template>y</template></f-template>"#;
    let e = compose_f_template_styles(input, "a{}").expect_err("expected error");
    assert!(
        matches!(e, RenderError::MultipleFTemplates { count: 2 }),
        "wrong variant: {e}"
    );
}

// ── inner <template> validation ─────────────────────────────────────────────

#[test]
fn test_compose_rejects_missing_inner_template() {
    let input = r#"<f-template name="my-el"><span>no template here</span></f-template>"#;
    let e = compose_f_template_styles(input, "a{}").expect_err("expected error");
    assert!(
        matches!(e, RenderError::MissingInnerTemplate),
        "wrong variant: {e}"
    );
}

#[test]
fn test_compose_rejects_multiple_inner_templates() {
    let input =
        r#"<f-template name="my-el"><template>x</template><template>y</template></f-template>"#;
    let e = compose_f_template_styles(input, "a{}").expect_err("expected error");
    assert!(
        matches!(e, RenderError::MultipleInnerTemplates { count: 2 }),
        "wrong variant: {e}"
    );
}

// ── unsafe CSS content ───────────────────────────────────────────────────────

#[test]
fn test_compose_rejects_style_terminator_in_css() {
    let input = r#"<f-template name="my-el"><template>x</template></f-template>"#;
    let e = compose_f_template_styles(input, "a{} </style><script>evil()</script>")
        .expect_err("expected error");
    assert!(
        matches!(e, RenderError::UnsafeStyleContent { .. }),
        "wrong variant: {e}"
    );
}

#[test]
fn test_compose_rejects_style_terminator_case_insensitively() {
    let input = r#"<f-template name="my-el"><template>x</template></f-template>"#;
    for css in ["</STYLE>", "</StYlE >", "</style/", "</style\t>"] {
        let e = compose_f_template_styles(input, css).expect_err("expected error");
        assert!(
            matches!(e, RenderError::UnsafeStyleContent { .. }),
            "css {css:?} should be rejected, got: {e}"
        );
    }
}

#[test]
fn test_compose_does_not_falsely_reject_style_like_content() {
    let input = r#"<f-template name="my-el"><template>x</template></f-template>"#;
    // `</stylesheet>` is not a real HTML raw-text terminator for <style>.
    let composed = compose_f_template_styles(input, "content: '</stylesheet>';")
        .expect("should not be rejected");
    assert!(composed.contains("</stylesheet>"));
}
