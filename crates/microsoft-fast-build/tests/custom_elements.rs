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
    assert!(result.contains(r#"<template shadowrootmode="open">"#), "shadow: {result}");
    assert!(result.contains("<button>Click me</button>"), "rendered: {result}");
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
    assert!(result.contains("<span>42</span>"), "rendered: {result}");
}

#[test]
fn test_custom_element_property_binding_rename() {
    let locator = make_locator(&[("my-button", "<button>{{foo}}</button>")]);
    let result = render_template_with_locator(
        r#"<my-button foo="{{bar}}"></my-button>"#,
        r#"{"bar": "hello"}"#,
        &locator,
    ).unwrap();
    assert!(result.contains("<button>hello</button>"), "rendered: {result}");
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
    assert!(result.contains(r#"<template shadowrootmode="open">"#), "shadow: {result}");
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
    assert!(result.contains(r#"<template shadowrootmode="open">"#), "shadow: {result}");
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
    assert!(result.contains("<button>Click me</button>"), "rendered: {result}");
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
    assert!(result.contains("<h2>Hello</h2>"), "heading: {result}");
    assert!(result.contains("<span>5</span>"), "badge: {result}");
}

#[test]
fn test_custom_element_in_f_repeat() {
    let locator = make_locator(&[("my-badge", "<span>{{count}}</span>")]);
    let result = render_template_with_locator(
        r#"<f-repeat value="{{item in items}}"><my-badge count="{{item.count}}"></my-badge></f-repeat>"#,
        r#"{"items": [{"count": 1}, {"count": 2}]}"#,
        &locator,
    ).unwrap();
    assert!(result.contains("<span>1</span>"), "first item: {result}");
    assert!(result.contains("<span>2</span>"), "second item: {result}");
}
