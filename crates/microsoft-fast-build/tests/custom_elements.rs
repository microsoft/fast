mod common;
use common::{make_locator, empty_root};
use microsoft_fast_build::{render_template, render_with_locator, render_template_with_locator, Locator, RenderError};

// ── attribute → state mapping ─────────────────────────────────────────────────

#[test]
fn test_custom_element_string_attr() {
    let locator = make_locator(&[("my-button", "<button>{{label}}</button>")]);
    let result = render_with_locator(
        r#"<my-button label="Click me"></my-button>"#,
        &empty_root(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"<my-button label="Click me">"#), "open tag: {result}");
    assert!(result.contains(r#"<template shadowrootmode="open" shadowroot="open">"#), "shadow: {result}");
    assert!(result.contains("Click me"), "rendered: {result}");
    assert!(result.contains("</template>"), "close template: {result}");
    assert!(result.contains("</my-button>"), "close tag: {result}");
}

#[test]
fn test_custom_element_boolean_attr() {
    let locator = make_locator(&[(
        "my-button",
        r#"<f-when value="{{disabled}}"><button disabled></button></f-when>"#,
    )]);
    let result = render_with_locator(
        r#"<my-button disabled></my-button>"#,
        &empty_root(),
        &locator,
    ).unwrap();
    assert!(result.contains("<button disabled></button>"), "rendered: {result}");
}

#[test]
fn test_custom_element_number_attr() {
    let locator = make_locator(&[("my-badge", "<span>{{count}}</span>")]);
    let result = render_with_locator(
        r#"<my-badge count="42"></my-badge>"#,
        &empty_root(),
        &locator,
    ).unwrap();
    assert!(result.contains("42"), "rendered: {result}");
}

#[test]
fn test_custom_element_property_binding_rename() {
    let locator = make_locator(&[("my-button", "<button>{{foo}}</button>")]);
    let result = render_template_with_locator(
        r#"<my-button foo="{{bar}}"></my-button>"#,
        r#"{"bar": "hello"}"#,
        &locator,
    ).unwrap();
    assert!(result.contains("hello"), "rendered: {result}");
}

// ── element structure ─────────────────────────────────────────────────────────

#[test]
fn test_custom_element_self_closing() {
    let locator = make_locator(&[("my-button", "<button>{{label}}</button>")]);
    let result = render_with_locator(
        r#"<my-button label="Hi" />"#,
        &empty_root(),
        &locator,
    ).unwrap();
    assert!(result.starts_with(r#"<my-button label="Hi">"#), "open tag: {result}");
    assert!(result.contains(r#"<template shadowrootmode="open" shadowroot="open">"#), "shadow: {result}");
    assert!(result.contains("</my-button>"), "close tag: {result}");
}

#[test]
fn test_custom_element_with_children() {
    let locator = make_locator(&[("my-layout", r#"<div class="layout"><slot></slot></div>"#)]);
    let result = render_with_locator(
        r#"<my-layout>light DOM content</my-layout>"#,
        &empty_root(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"<template shadowrootmode="open" shadowroot="open">"#), "shadow: {result}");
    assert!(result.contains(r#"<div class="layout"><slot></slot></div>"#), "shadow content: {result}");
    assert!(result.contains("light DOM content"), "light DOM: {result}");
    assert!(result.contains("</my-layout>"), "close tag: {result}");
}

// ── passthrough when no template or locator ───────────────────────────────────

#[test]
fn test_custom_element_no_template_passthrough() {
    let locator = make_locator(&[]); // no templates registered
    let result = render_with_locator(
        r#"<unknown-element foo="bar">content</unknown-element>"#,
        &empty_root(),
        &locator,
    ).unwrap();
    assert_eq!(result, r#"<unknown-element foo="bar">content</unknown-element>"#);
}

#[test]
fn test_custom_element_no_locator_passthrough() {
    let result = render_template(
        r#"<my-button label="Click me">content</my-button>"#,
        r#"{}"#,
    ).unwrap();
    assert_eq!(result, r#"<my-button label="Click me">content</my-button>"#);
}

// ── Locator ───────────────────────────────────────────────────────────────────

#[test]
fn test_locator_from_patterns() {
    let locator = Locator::from_patterns(&["tests/fixtures/*.html"]).unwrap();
    assert!(locator.has_template("my-button"), "missing my-button");
    assert!(locator.has_template("my-badge"), "missing my-badge");
    assert!(locator.has_template("my-card"), "missing my-card");
    assert!(locator.has_template("my-layout"), "missing my-layout");

    let result = render_with_locator(
        r#"<my-button label="Click me"></my-button>"#,
        &empty_root(),
        &locator,
    ).unwrap();
    assert!(result.contains("Click me"), "rendered: {result}");
}

#[test]
fn test_locator_duplicate_template_error() {
    // ** glob picks up both tests/fixtures/my-button.html and
    // tests/fixtures/duplicate/my-button.html.
    let result = Locator::from_patterns(&["tests/fixtures/**/*.html"]);
    assert!(
        matches!(result, Err(RenderError::DuplicateTemplate { .. })),
        "expected DuplicateTemplate error, got: {:?}", result.err()
    );
}

// ── composition ───────────────────────────────────────────────────────────────

#[test]
fn test_custom_element_nested() {
    let locator = make_locator(&[
        ("my-card", r#"<div class="card"><h2>{{title}}</h2><my-badge count="5"></my-badge></div>"#),
        ("my-badge", "<span>{{count}}</span>"),
    ]);
    let result = render_with_locator(
        r#"<my-card title="Hello"></my-card>"#,
        &empty_root(),
        &locator,
    ).unwrap();
    assert!(result.contains("Hello"), "heading: {result}");
    assert!(result.contains("5"), "badge: {result}");
}

#[test]
fn test_custom_element_in_f_repeat() {
    let locator = make_locator(&[("my-badge", "<span>{{count}}</span>")]);
    let result = render_template_with_locator(
        r#"<f-repeat value="{{item in items}}"><my-badge count="{{item.count}}"></my-badge></f-repeat>"#,
        r#"{"items": [{"count": 1}, {"count": 2}]}"#,
        &locator,
    ).unwrap();
    assert!(result.contains("1"), "first item: {result}");
    assert!(result.contains("2"), "second item: {result}");
}

#[test]
fn test_locator_multiple_templates_in_file() {
    // multi/multi-components.html contains both my-multi-a and my-multi-b
    let locator = Locator::from_patterns(&["tests/fixtures/multi/*.html"]).unwrap();
    assert!(locator.has_template("my-multi-a"), "missing my-multi-a");
    assert!(locator.has_template("my-multi-b"), "missing my-multi-b");

    let result_a = render_with_locator(
        r#"<my-multi-a label="Hello"></my-multi-a>"#,
        &empty_root(),
        &locator,
    ).unwrap();
    assert!(result_a.contains("Hello"), "my-multi-a rendered: {result_a}");

    let result_b = render_template_with_locator(
        r#"<my-multi-b count="7"></my-multi-b>"#,
        r#"{}"#,
        &locator,
    ).unwrap();
    assert!(result_b.contains("7"), "my-multi-b rendered: {result_b}");
}

#[test]
fn test_locator_nameless_f_template_does_not_register() {
    // no-name.html has an <f-template> without a name attribute
    // It should emit a warning to stderr but NOT error and NOT register any template
    let locator = Locator::from_patterns(&["tests/fixtures/no-name.html"]).unwrap();
    assert!(!locator.has_template("no-name"), "should not register nameless template");
}

#[test]
fn test_locator_name_from_f_template_attribute_not_file_stem() {
    // my-button.html has <f-template name="my-button"> — name comes from attribute, not stem
    let locator = Locator::from_patterns(&["tests/fixtures/my-button.html"]).unwrap();
    assert!(locator.has_template("my-button"), "should find my-button by name attribute");
}

// ── attribute name → lowercase normalisation ──────────────────────────────────

#[test]
fn test_custom_element_kebab_attr_camel_in_template() {
    // kebab-case attrs are normalised to lowercase without hyphens by default
    let locator = make_locator(&[("my-el", "<span>{{selecteduserid}}</span>")]);
    let result = render_template_with_locator(
        r#"<my-el selected-user-id="42"></my-el>"#,
        "{}",
        &locator,
    ).unwrap();
    assert!(result.contains("42"), "lowercase resolved: {result}");
}

#[test]
fn test_custom_element_multi_word_kebab_to_camel() {
    let locator = make_locator(&[("my-el", "<p>{{showdetails}}</p><p>{{enablecontinue}}</p>")]);
    let result = render_template_with_locator(
        r#"<my-el show-details="true" enable-continue="false"></my-el>"#,
        "{}",
        &locator,
    ).unwrap();
    assert!(result.contains("true"), "showdetails: {result}");
    assert!(result.contains("false"), "enablecontinue: {result}");
}

// ── colon-prefixed property bindings ─────────────────────────────────────────

#[test]
fn test_custom_element_colon_property_binding() {
    // `:myprop="{{expr}}"` — the `:` prefix is stripped when building child state
    let parent_template = r#"<child-el :myprop="{{value}}"></child-el>"#;
    let child_template = "<span>{{myprop}}</span>";
    let locator = make_locator(&[("child-el", child_template)]);
    let result = render_template_with_locator(parent_template, r#"{"value": "hello"}"#, &locator).unwrap();
    assert!(result.contains("hello"), "colon binding resolved: {result}");
}

#[test]
fn test_custom_element_event_binding_skipped() {
    // `@click="{handler()}"` bindings are skipped — they are client-side only
    let locator = make_locator(&[("my-btn", "<button>{{label}}</button>")]);
    let result = render_template_with_locator(
        r#"<my-btn label="OK" @click="{handleClick()}"></my-btn>"#,
        "{}",
        &locator,
    ).unwrap();
    assert!(result.contains("OK"), "label: {result}");
    // The @click binding should not appear in element state or cause an error
}
