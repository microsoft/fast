mod common;
use common::{make_locator, empty_root};
use microsoft_fast_build::{render_template, render_with_locator, render_template_with_locator, render_entry_template_with_locator, Locator, RenderError};

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
fn test_custom_element_kebab_attr_hyphens_preserved() {
    // kebab-case attr names are lowercased; hyphens are preserved
    let locator = make_locator(&[("my-el", "<span>{{selected-user-id}}</span>")]);
    let result = render_template_with_locator(
        r#"<my-el selected-user-id="42"></my-el>"#,
        "{}",
        &locator,
    ).unwrap();
    assert!(result.contains("42"), "kebab attr resolved: {result}");
}

#[test]
fn test_custom_element_multi_word_kebab_attrs() {
    // multiple kebab-case attrs are lowercased and passed to the child scope as-is
    let locator = make_locator(&[("my-el", "<p>{{show-details}}</p><p>{{enable-continue}}</p>")]);
    let result = render_template_with_locator(
        r#"<my-el show-details="true" enable-continue="false"></my-el>"#,
        "{}",
        &locator,
    ).unwrap();
    assert!(result.contains("true"), "show-details: {result}");
    assert!(result.contains("false"), "enable-continue: {result}");
}

// ── colon-prefixed property bindings ─────────────────────────────────────────

#[test]
fn test_custom_element_colon_property_in_state_not_html() {
    // `:prop` bindings are NOT rendered as HTML attributes but their resolved value
    // IS added to the child element's rendering state.
    let locator = make_locator(&[("my-btn", "<button>{{label}}</button><span>{{myprop}}</span>")]);
    let result = render_template_with_locator(
        r#"<my-btn label="OK" :myProp="{{value}}"></my-btn>"#,
        r#"{"value": "passed"}"#,
        &locator,
    ).unwrap();
    assert!(result.contains("OK"), "label: {result}");
    assert!(!result.contains(":myProp"), "colon attr stripped from HTML: {result}");
    assert!(result.contains("passed"), "prop value in child state: {result}");
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

// ── root custom element full-state inheritance ────────────────────────────────

#[test]
fn test_root_custom_element_receives_full_state() {
    // A custom element at the entry-HTML level (no parent hydration scope) should
    // receive the complete root state so its template can access any state key.
    let locator = make_locator(&[("my-parent", "<span>{{selecteduser}}</span>")]);
    let result = render_entry_template_with_locator(
        r#"<my-parent></my-parent>"#,
        r#"{"selecteduser":"John","heading":"Hello"}"#,
        &locator,
    ).unwrap();
    assert!(result.contains("John"), "root state key resolved: {result}");
}

#[test]
fn test_root_custom_element_full_state_with_nested_child() {
    // Root element gets full state; its template passes a slice of that state to a
    // nested child via :prop. This mirrors the my-parent-b / my-child scenario.
    let locator = make_locator(&[
        (
            "my-parent-b",
            r#"<my-child :items="{{items}}"></my-child>"#,
        ),
        (
            "my-child",
            r#"<f-repeat value="{{item in items}}"><span>{{item.text}}</span></f-repeat>"#,
        ),
    ]);
    let result = render_entry_template_with_locator(
        r#"<my-parent-b></my-parent-b>"#,
        r#"{"items":[{"text":"Item 1"},{"text":"Item 2"}]}"#,
        &locator,
    ).unwrap();
    assert!(result.contains("Item 1"), "first item rendered: {result}");
    assert!(result.contains("Item 2"), "second item rendered: {result}");
}

#[test]
fn test_root_custom_elements_full_scenario() {
    // Full scenario from the spec: entry HTML with two root elements and a text
    // binding. my-parent-a reads selecteduser directly; my-parent-b passes items
    // to a nested my-child via :items.
    let locator = make_locator(&[
        ("my-parent-a", "<span>{{selecteduser}}</span>"),
        (
            "my-parent-b",
            r#"<my-child :items="{{items}}"></my-child>"#,
        ),
        (
            "my-child",
            r#"<f-repeat value="{{item in items}}"><li>{{item.text}}</li></f-repeat>"#,
        ),
    ]);
    let result = render_entry_template_with_locator(
        r#"{{heading}}<my-parent-a></my-parent-a><my-parent-b></my-parent-b>"#,
        r#"{"heading":"Hello world","selecteduser":"John","items":[{"text":"Item 1"},{"text":"Item 2"}]}"#,
        &locator,
    ).unwrap();
    assert!(result.contains("Hello world"), "heading binding: {result}");
    assert!(result.contains("John"), "selecteduser in my-parent-a: {result}");
    assert!(result.contains("Item 1"), "item 1 in my-child: {result}");
    assert!(result.contains("Item 2"), "item 2 in my-child: {result}");
}

#[test]
fn test_nested_custom_element_still_uses_attr_state() {
    // Nested elements (inside a shadow template) must still get state from their
    // HTML attributes, not the root state.
    let locator = make_locator(&[
        ("outer-el", r#"<inner-el label="{{innerLabel}}"></inner-el>"#),
        ("inner-el", "<span>{{label}} {{rootKey}}</span>"),
    ]);
    // inner-el's template references {{rootKey}}. Since inner-el is nested (inside outer-el's
    // shadow), it receives only attr-based state { label: "Nested" }. If rootKey incorrectly
    // leaked, the render would succeed; it must fail with MissingState.
    let err = render_entry_template_with_locator(
        r#"<outer-el></outer-el>"#,
        r#"{"innerLabel":"Nested","rootKey":"ShouldNotLeak"}"#,
        &locator,
    ).expect_err("rootKey should not be available in nested child state");
    assert!(
        format!("{err:?}").contains("MissingState"),
        "expected MissingState when nested child tries to resolve rootKey: {err:?}",
    );
}

#[test]
fn test_custom_element_repeat_from_colon_binding() {
    // Arrays are passed to child elements via :prop={{binding}} so the typed array
    // reaches the child state without appearing as a rendered HTML attribute.
    // f-repeat then resolves the named array from the child element's state.
    let locator = make_locator(&[(
        "item-list",
        r#"<f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat>"#,
    )]);
    let result = render_template_with_locator(
        r#"<item-list :items="{{items}}"></item-list>"#,
        r#"{"items":["a","b","c"]}"#,
        &locator,
    ).unwrap();
    assert!(!result.contains(":items"), "colon attr not in HTML: {result}");
    assert!(result.contains(">a<"), "rendered a: {result}");
    assert!(result.contains(">b<"), "rendered b: {result}");
    assert!(result.contains(">c<"), "rendered c: {result}");
}

#[test]
fn test_custom_element_repeat_empty_array_from_colon_binding() {
    let locator = make_locator(&[(
        "item-list",
        r#"<f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat>"#,
    )]);
    let result = render_template_with_locator(
        r#"<item-list :items="{{items}}"></item-list>"#,
        r#"{"items":[]}"#,
        &locator,
    ).unwrap();
    assert!(!result.contains("<span>"), "no items: {result}");
}

#[test]
fn test_custom_element_object_from_colon_binding() {
    // Object values passed via :prop={{binding}} are resolved from the parent state
    // and forwarded to the child element's rendering scope without appearing in HTML.
    let locator = make_locator(&[("my-card", r#"<div>{{config.title}}</div>"#)]);
    let result = render_template_with_locator(
        r#"<my-card :config="{{config}}"></my-card>"#,
        r#"{"config":{"title":"Hello"}}"#,
        &locator,
    ).unwrap();
    assert!(!result.contains(":config"), "colon attr not in HTML: {result}");
    assert!(result.contains("Hello"), "rendered: {result}");
}
