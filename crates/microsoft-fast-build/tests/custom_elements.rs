mod common;
use common::{make_locator, empty_root};
use microsoft_fast_build::{render_template, render_with_locator, render_template_with_locator, render_entry_template_with_locator, Locator, RenderError, RenderConfig, AttributeNameStrategy};

// ── attribute → state mapping ─────────────────────────────────────────────────

#[test]
fn test_custom_element_string_attr() {
    let locator = make_locator(&[("my-button", "<button>{{label}}</button>")]);
    let result = render_with_locator(
        r#"<my-button label="Click me"></my-button>"#,
        &empty_root(),
        &locator,
        None,
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
        None,
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
        None,
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
        None,
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
        None,
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
        None,
    ).unwrap();
    assert!(result.contains(r#"<template shadowrootmode="open" shadowroot="open">"#), "shadow: {result}");
    assert!(result.contains(r#"<div class="layout"><slot></slot></div>"#), "shadow content: {result}");
    assert!(result.contains("light DOM content"), "light DOM: {result}");
    assert!(result.contains("</my-layout>"), "close tag: {result}");
}

#[test]
fn test_f_template_shadowroot_defaults_remain_open() {
    let locator = Locator::from_patterns(&["tests/fixtures/my-button.html"]).unwrap();
    let result = render_with_locator(
        r#"<my-button label="Hi"></my-button>"#,
        &empty_root(),
        &locator,
        None,
    ).unwrap();
    assert!(result.contains(r#"<template shadowrootmode="open" shadowroot="open">"#), "shadow attrs: {result}");
}

#[test]
fn test_f_template_shadowrootmode_forwarded_with_legacy_shadowroot() {
    let locator = Locator::from_patterns(&["tests/fixtures/shadowroot-closed.html"]).unwrap();
    let result = render_with_locator(
        r#"<shadowroot-closed></shadowroot-closed>"#,
        &empty_root(),
        &locator,
        None,
    ).unwrap();
    assert!(result.contains(r#"<template shadowrootmode="closed" shadowroot="closed">"#), "shadow attrs: {result}");
}

#[test]
fn test_f_template_additional_shadowroot_attrs_forwarded() {
    let locator = Locator::from_patterns(&["tests/fixtures/shadowroot-extra.html"]).unwrap();
    let result = render_with_locator(
        r#"<shadowroot-extra></shadowroot-extra>"#,
        &empty_root(),
        &locator,
        None,
    ).unwrap();
    assert!(
        result.contains(r#"<template shadowrootmode="open" shadowroot="open" shadowrootdelegatesfocus shadowrootclonable="true">"#),
        "shadow attrs: {result}"
    );
}

#[test]
fn test_f_template_explicit_shadowroot_value_is_preserved() {
    let locator = Locator::from_patterns(&["tests/fixtures/shadowroot-explicit.html"]).unwrap();
    let result = render_with_locator(
        r#"<shadowroot-explicit></shadowroot-explicit>"#,
        &empty_root(),
        &locator,
        None,
    ).unwrap();
    assert!(result.contains(r#"<template shadowrootmode="closed" shadowroot="open">"#), "shadow attrs: {result}");
}

#[test]
fn test_f_template_boolean_shadowrootmode_defaults_to_open() {
    let locator = Locator::from_patterns(&["tests/fixtures/shadowroot-boolean-mode.html"]).unwrap();
    let result = render_with_locator(
        r#"<shadowroot-boolean-mode></shadowroot-boolean-mode>"#,
        &empty_root(),
        &locator,
        None,
    ).unwrap();
    assert!(result.contains(r#"<template shadowrootmode="open" shadowroot="open">"#), "shadow attrs: {result}");
}

#[test]
fn test_f_template_boolean_shadowroot_defaults_to_open() {
    let locator = Locator::from_patterns(&["tests/fixtures/shadowroot-boolean-shadowroot.html"]).unwrap();
    let result = render_with_locator(
        r#"<shadowroot-boolean-shadowroot></shadowroot-boolean-shadowroot>"#,
        &empty_root(),
        &locator,
        None,
    ).unwrap();
    assert!(result.contains(r#"<template shadowrootmode="open" shadowroot="open">"#), "shadow attrs: {result}");
}

#[test]
fn test_f_template_boolean_shadowroot_mirrors_closed_mode() {
    let locator = Locator::from_patterns(&["tests/fixtures/shadowroot-closed-boolean-shadowroot.html"]).unwrap();
    let result = render_with_locator(
        r#"<shadowroot-closed-boolean-shadowroot></shadowroot-closed-boolean-shadowroot>"#,
        &empty_root(),
        &locator,
        None,
    ).unwrap();
    assert!(result.contains(r#"<template shadowrootmode="closed" shadowroot="closed">"#), "shadow attrs: {result}");
}

#[test]
fn test_f_template_shadowroot_attr_values_are_escaped() {
    let locator = Locator::from_patterns(&["tests/fixtures/shadowroot-escaped.html"]).unwrap();
    let result = render_with_locator(
        r#"<shadowroot-escaped></shadowroot-escaped>"#,
        &empty_root(),
        &locator,
        None,
    ).unwrap();
    assert!(
        result.contains(r#"<template shadowrootmode="open" shadowroot="open" shadowrootserializable="a&quot;b&amp;c">"#),
        "shadow attrs: {result}"
    );
}

// ── passthrough when no template or locator ───────────────────────────────────

#[test]
fn test_custom_element_no_template_passthrough() {
    let locator = make_locator(&[]); // no templates registered
    let result = render_with_locator(
        r#"<unknown-element foo="bar">content</unknown-element>"#,
        &empty_root(),
        &locator,
        None,
    ).unwrap();
    assert_eq!(result, r#"<unknown-element foo="bar">content</unknown-element>"#);
}

#[test]
fn test_custom_element_no_locator_passthrough() {
    let result = render_template(
        r#"<my-button label="Click me">content</my-button>"#,
        r#"{}"#,
        None,
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
        None,
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
        None,
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
        None,
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
        None,
    ).unwrap();
    assert!(result_a.contains("Hello"), "my-multi-a rendered: {result_a}");

    let result_b = render_template_with_locator(
        r#"<my-multi-b count="7"></my-multi-b>"#,
        r#"{}"#,
        &locator,
        None,
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
    // kebab-case attr names are lowercased; with explicit none strategy, hyphens are preserved
    let locator = make_locator(&[("my-el", "<span>{{selected-user-id}}</span>")]);
    let none_config = RenderConfig::new().with_attribute_name_strategy(AttributeNameStrategy::None);
    let result = render_template_with_locator(
        r#"<my-el selected-user-id="42"></my-el>"#,
        "{}",
        &locator,
        Some(&none_config),
    ).unwrap();
    assert!(result.contains("42"), "kebab attr resolved: {result}");
}

#[test]
fn test_custom_element_multi_word_kebab_attrs() {
    // multiple kebab-case attrs are lowercased; with explicit none strategy, passed to the child scope as-is
    let locator = make_locator(&[("my-el", "<p>{{show-details}}</p><p>{{enable-continue}}</p>")]);
    let none_config = RenderConfig::new().with_attribute_name_strategy(AttributeNameStrategy::None);
    let result = render_template_with_locator(
        r#"<my-el show-details="true" enable-continue="false"></my-el>"#,
        "{}",
        &locator,
        Some(&none_config),
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
        None,
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
        None,
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
        None,
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
        None,
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
        None,
    ).unwrap();
    assert!(result.contains("Hello world"), "heading binding: {result}");
    assert!(result.contains("John"), "selecteduser in my-parent-a: {result}");
    assert!(result.contains("Item 1"), "item 1 in my-child: {result}");
    assert!(result.contains("Item 2"), "item 2 in my-child: {result}");
}

#[test]
fn test_nested_custom_element_inherits_parent_state() {
    // Nested elements (inside a shadow template) inherit the parent element's state
    // so unbound state keys propagate through the element tree automatically.
    let locator = make_locator(&[
        ("outer-el", r#"<inner-el label="{{innerLabel}}"></inner-el>"#),
        ("inner-el", "<span>{{label}} {{rootKey}}</span>"),
    ]);
    // inner-el's template references {{rootKey}}. Since state propagates through
    // all descendant elements, rootKey is available in the nested child state.
    let result = render_entry_template_with_locator(
        r#"<outer-el></outer-el>"#,
        r#"{"innerLabel":"Nested","rootKey":"Available"}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains("Nested"), "label from attr binding: {result}");
    assert!(result.contains("Available"), "rootKey propagated to nested child: {result}");
}

// ── state propagation to all descendant child elements ────────────────────────

#[test]
fn test_unbound_state_propagates_to_child_elements() {
    // The exact scenario from the spec: my-el and my-child-el both reference
    // {{text}}, with state.json containing {"text": "Hello world"}.
    // State should propagate through to all descendant custom elements
    // even without explicit attribute bindings.
    let locator = make_locator(&[
        ("my-el", "{{text}}\n        <my-child-el></my-child-el>"),
        ("my-child-el", "{{text}}"),
    ]);
    let result = render_entry_template_with_locator(
        "<my-el></my-el>",
        r#"{"text":"Hello world"}"#,
        &locator,
        None,
    ).unwrap();
    // Both my-el and my-child-el should render "Hello world"
    let hello_count = result.matches("Hello world").count();
    assert!(hello_count >= 2, "expected 'Hello world' in both elements, found {hello_count}: {result}");
}

#[test]
fn test_state_propagates_through_multiple_levels() {
    // State should flow through three levels of nesting.
    let locator = make_locator(&[
        ("level-one", "<span>L1:{{msg}}</span><level-two></level-two>"),
        ("level-two", "<span>L2:{{msg}}</span><level-three></level-three>"),
        ("level-three", "<span>L3:{{msg}}</span>"),
    ]);
    let result = render_entry_template_with_locator(
        "<level-one></level-one>",
        r#"{"msg":"deep"}"#,
        &locator,
        None,
    ).unwrap();
    // Hydration markers wrap each binding, so check for the resolved value "deep"
    // within each level's shadow template.
    let deep_count = result.matches("deep").count();
    assert!(deep_count >= 3, "expected 'deep' at least 3 times (all levels), found {deep_count}: {result}");
    assert!(result.contains("<level-two>"), "level 2 element present: {result}");
    assert!(result.contains("<level-three>"), "level 3 element present: {result}");
}

#[test]
fn test_child_attr_overrides_propagated_state() {
    // When a child element has an explicit attribute that matches a propagated
    // state key, the attribute-derived value should take precedence.
    let locator = make_locator(&[
        ("parent-el", r#"<child-el color="blue"></child-el>"#),
        ("child-el", "<span>{{color}}</span>"),
    ]);
    let result = render_entry_template_with_locator(
        "<parent-el></parent-el>",
        r#"{"color":"red"}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains("blue"), "attr value overrides propagated state: {result}");
    assert!(!result.contains("red"), "propagated state key overridden by attr: {result}");
}

#[test]
fn test_non_entry_render_also_propagates_state() {
    // State propagation should work even when using render_template_with_locator
    // (non-entry mode), so child elements within a shadow template get parent state.
    let locator = make_locator(&[
        ("my-wrapper", "<my-inner></my-inner>"),
        ("my-inner", "<span>{{title}}</span>"),
    ]);
    let result = render_template_with_locator(
        r#"<my-wrapper title="{{title}}"></my-wrapper>"#,
        r#"{"title":"Propagated"}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains("Propagated"), "state propagates via non-entry rendering: {result}");
}

// ── entry-level custom element attribute resolution ───────────────────────────

#[test]
fn test_root_custom_element_primitive_binding_resolved() {
    // {{binding}} attrs on root custom elements that resolve to a primitive
    // (string/number/bool) should appear in the rendered HTML with the resolved value.
    let locator = make_locator(&[("my-el", "<span>{{text}}</span>")]);
    let result = render_entry_template_with_locator(
        r#"<my-el text="{{text}}"></my-el>"#,
        r#"{"text":"Hello world"}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains(r#"text="Hello world""#), "primitive binding resolved: {result}");
    assert!(result.contains("Hello world"), "template still renders state: {result}");
}

#[test]
fn test_root_custom_element_boolean_attr_binding_truthy() {
    // ?attr="{{expr}}" on a root element should render as the bare attribute name when truthy.
    let locator = make_locator(&[("my-button", "<button>Click</button>")]);
    let result = render_entry_template_with_locator(
        r#"<my-button ?disabled="{{show}}"></my-button>"#,
        r#"{"show":true}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains(" disabled"), "boolean attr rendered when true: {result}");
    assert!(!result.contains("?disabled"), "? prefix stripped: {result}");
}

#[test]
fn test_root_custom_element_boolean_attr_binding_falsy() {
    // ?attr="{{expr}}" on a root element should be omitted when falsy.
    let locator = make_locator(&[("my-button", "<button>Click</button>")]);
    let result = render_entry_template_with_locator(
        r#"<my-button ?disabled="{{show}}"></my-button>"#,
        r#"{"show":false}"#,
        &locator,
        None,
    ).unwrap();
    assert!(!result.contains("disabled"), "boolean attr omitted when false: {result}");
}

#[test]
fn test_root_custom_element_non_primitive_binding_stripped() {
    // {{binding}} attrs on root custom elements that resolve to an array or object
    // should be stripped — they cannot be represented as an HTML attribute.
    let locator = make_locator(&[("my-el", "<span>content</span>")]);
    let result = render_entry_template_with_locator(
        r#"<my-el list="{{list}}" data="{{data}}"></my-el>"#,
        r#"{"list":["a","b"],"data":{"key":"val"}}"#,
        &locator,
        None,
    ).unwrap();
    assert!(!result.contains("list="), "array binding stripped: {result}");
    assert!(!result.contains("data="), "object binding stripped: {result}");
}

#[test]
fn test_root_custom_element_static_attrs_kept() {
    // Non-binding (static) attributes on root custom elements must be preserved.
    let locator = make_locator(&[("my-el", "<span>content</span>")]);
    let result = render_entry_template_with_locator(
        r#"<my-el id="main" class="app"></my-el>"#,
        r#"{"ignored": true}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains(r#"id="main""#), "id attribute kept: {result}");
    assert!(result.contains(r#"class="app""#), "class attribute kept: {result}");
}

#[test]
fn test_root_custom_element_mixed_attrs() {
    // Primitive binding → resolved and rendered. Non-primitive → stripped. Static → kept.
    let locator = make_locator(&[("my-el", "<span>{{name}}</span>")]);
    let result = render_entry_template_with_locator(
        r#"<my-el id="root" name="{{name}}" items="{{items}}"></my-el>"#,
        r#"{"name":"Alice","items":["x","y"]}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains(r#"id="root""#), "static id kept: {result}");
    assert!(result.contains(r#"name="Alice""#), "primitive binding resolved: {result}");
    assert!(!result.contains("items="), "array binding stripped: {result}");
}

#[test]
fn test_nested_custom_element_binding_attrs_not_stripped() {
    // Attributes with {{binding}} values on *nested* (non-root) custom elements must
    // NOT be stripped — they are used for attribute-based child state building and
    // the resolved value is rendered into the HTML for the FAST runtime.
    let locator = make_locator(&[
        ("my-outer", r#"<my-inner label="{{name}}"></my-inner>"#),
        ("my-inner", "<span>{{label}}</span>"),
    ]);
    // Pass name via :name so my-outer's child state has it for its template to use.
    let result = render_template_with_locator(
        r#"<my-outer :name="{{name}}"></my-outer>"#,
        r#"{"name":"Bob"}"#,
        &locator,
        None,
    ).unwrap();
    // The inner element is nested (not entry-level), so its resolved attr IS rendered.
    assert!(result.contains(r#"label="Bob""#), "nested element attr rendered: {result}");
    assert!(result.contains("Bob"), "inner template renders label: {result}");
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
        None,
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
        None,
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
        None,
    ).unwrap();
    assert!(!result.contains(":config"), "colon attr not in HTML: {result}");
    assert!(result.contains("Hello"), "rendered: {result}");
}

// ── entry-level custom element merged state ────────────────────────────────────

#[test]
fn test_root_element_per_element_attr_available_in_template() {
    // A per-element static attribute (e.g. planet="earth") should be available as a
    // template binding key in the entry element's shadow template, even if that key
    // is not present in the shared root state.json.
    let locator = make_locator(&[("planet-el", r#"<span>{{planet}}</span>"#)]);
    let result = render_entry_template_with_locator(
        r#"<planet-el planet="earth"></planet-el>"#,
        r#"{"shared":"yes"}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains("earth"), "per-element attr available in template: {result}");
}

#[test]
fn test_root_element_attr_overrides_root_state_key() {
    // When an entry element carries a static attribute whose key matches a root state
    // key, the attribute-derived value should take precedence in the child template.
    let locator = make_locator(&[("my-el", r#"<span>{{color}}</span>"#)]);
    let result = render_entry_template_with_locator(
        r#"<my-el color="blue"></my-el>"#,
        r#"{"color":"red"}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains("blue"), "attr value overrides root state: {result}");
    assert!(!result.contains("red"), "root state key not used when attr present: {result}");
}

#[test]
fn test_root_element_root_state_available_alongside_attr() {
    // Root state keys that are NOT shadowed by an attribute should still be accessible
    // in the entry element's template alongside per-element attr values.
    let locator = make_locator(&[("my-el", r#"<span>{{planet}} {{shared}}</span>"#)]);
    let result = render_entry_template_with_locator(
        r#"<my-el planet="mars"></my-el>"#,
        r#"{"shared":"context"}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains("mars"), "per-element attr rendered: {result}");
    assert!(result.contains("context"), "root state key still accessible: {result}");
}

#[test]
fn test_root_element_boolean_attr_available_in_template() {
    // A boolean (no-value) attribute on an entry element should be available as
    // true in the child template.
    let locator = make_locator(&[("my-el", r#"<f-when value="{{show}}"><span>visible</span></f-when>"#)]);
    let result = render_entry_template_with_locator(
        r#"<my-el show></my-el>"#,
        r#"{}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains("visible"), "boolean attr resolves to true in template: {result}");
}

#[test]
fn test_root_elements_with_different_per_element_attrs() {
    // Multiple root elements in the same entry HTML each have their own attribute
    // values available in their respective templates.
    let locator = make_locator(&[("planet-el", r#"<span>{{planet}}</span>"#)]);
    let result = render_entry_template_with_locator(
        r#"<planet-el planet="earth"></planet-el><planet-el planet="mars"></planet-el>"#,
        r#"{"shared":"yes"}"#,
        &locator,
        None,
    ).unwrap();
    assert!(result.contains("earth"), "first element attr: {result}");
    assert!(result.contains("mars"), "second element attr: {result}");
}

// ── JSON literals in attribute values ─────────────────────────────────────────

#[test]
fn test_custom_element_json_array_attr() {
    let locator = make_locator(&[(
        "item-list",
        r#"<f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat>"#,
    )]);
    let result = render_template_with_locator(
        r#"<item-list items='["a","b","c"]'></item-list>"#,
        "{}",
        &locator,
        None,
    ).unwrap();
    assert!(result.contains(">a<"), "rendered a: {result}");
    assert!(result.contains(">b<"), "rendered b: {result}");
    assert!(result.contains(">c<"), "rendered c: {result}");
}

#[test]
fn test_custom_element_empty_array_attr() {
    let locator = make_locator(&[(
        "item-list",
        r#"<f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat>"#,
    )]);
    let result = render_template_with_locator(
        r#"<item-list items="[]"></item-list>"#,
        "{}",
        &locator,
        None,
    ).unwrap();
    assert!(!result.contains("<span>"), "no items: {result}");
}

#[test]
fn test_custom_element_json_object_attr() {
    let locator = make_locator(&[("my-card", r#"<div>{{config.title}}</div>"#)]);
    let result = render_template_with_locator(
        r#"<my-card config='{"title":"Hello"}'></my-card>"#,
        "{}",
        &locator,
        None,
    ).unwrap();
    assert!(result.contains("Hello"), "rendered: {result}");
}

#[test]
fn test_custom_element_invalid_json_attr_falls_back_to_string() {
    // An attribute value that looks like JSON but is invalid should remain a string,
    // not cause a parse error or panic.
    let locator = make_locator(&[("my-el", r#"<span>{{items}}</span>"#)]);
    let result = render_template_with_locator(
        r#"<my-el items='["a",]'></my-el>"#,
        "{}",
        &locator,
        None,
    ).unwrap();
    // Invalid JSON falls back to the raw string value
    assert!(result.contains(r#"["a",]"#), "invalid JSON kept as string: {result}");
}