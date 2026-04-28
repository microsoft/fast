mod common;
use common::{ok, make_locator, empty_root};
use microsoft_fast_build::{
    render, render_entry_with_locator, render_entry_with_locator_without_state,
    render_template_without_state, render_with_locator, JsonValue,
};
use std::collections::HashMap;

// ── empty and whitespace-only templates ───────────────────────────────────────

#[test]
fn test_empty_template() {
    assert_eq!(ok("", "{}"), "");
}

#[test]
fn test_whitespace_only_template() {
    assert_eq!(ok("   \n\t  ", "{}"), "   \n\t  ");
}

#[test]
fn test_template_with_no_bindings() {
    let result = ok("<div><p>Static content</p></div>", "{}");
    assert_eq!(result, "<div><p>Static content</p></div>");
}

#[test]
fn test_empty_state_object() {
    // A template with no bindings renders fine against an empty state.
    assert_eq!(ok("<h1>Hello</h1>", "{}"), "<h1>Hello</h1>");
}

#[test]
fn test_render_template_without_state_uses_empty_object() {
    let result = render_template_without_state("<h1>{{title}}</h1>", None)
        .expect("render without state");
    assert_eq!(result, "<h1></h1>");
}

#[test]
fn test_missing_regular_html_attribute_binding_is_omitted() {
    let result = ok(r#"<div class="{{missing}}"></div>"#, "{}");
    assert_eq!(result, "<div></div>");
}

#[test]
fn test_missing_regular_html_attribute_omits_content_stays_empty() {
    let result = ok(r#"<div class="{{missing}}">{{missing}}</div>"#, "{}");
    assert_eq!(result, "<div></div>");
}

#[test]
fn test_render_entry_with_locator_without_state_uses_empty_object() {
    let locator = make_locator(&[("my-el", "<span>{{label}}</span>")]);
    let result = render_entry_with_locator_without_state("<my-el></my-el>", &locator, None)
        .expect("render entry without state");
    assert!(result.contains("<span>"), "shadow content rendered: {result}");
    assert!(result.contains("<!--fe-b$$start$$0$$label-0$$fe-b--><!--fe-b$$end$$0$$label-0$$fe-b-->"));
}

// ── deeply nested property access ─────────────────────────────────────────────

#[test]
fn test_deeply_nested_six_levels() {
    let result = ok(
        "{{a.b.c.d.e.f}}",
        r#"{"a": {"b": {"c": {"d": {"e": {"f": "deep"}}}}}}"#,
    );
    assert_eq!(result, "deep");
}

#[test]
fn test_deeply_nested_in_f_when() {
    let result = ok(
        r#"<f-when value="{{a.b.c.enabled}}">yes</f-when>"#,
        r#"{"a": {"b": {"c": {"enabled": true}}}}"#,
    );
    assert_eq!(result, "yes");
}

#[test]
fn test_deeply_nested_in_f_repeat() {
    let result = ok(
        r#"<f-repeat value="{{item in data.list.items}}">{{item}}</f-repeat>"#,
        r#"{"data": {"list": {"items": ["x", "y"]}}}"#,
    );
    assert_eq!(result, "xy");
}

#[test]
fn test_deeply_nested_missing_intermediate_renders_empty() {
    let result = ok("{{a.b.c.d}}", r#"{"a": {"b": {}}}"#);
    assert_eq!(result, "");
}

// ── multiple root custom elements ─────────────────────────────────────────────

#[test]
fn test_multiple_root_custom_elements() {
    let locator = make_locator(&[
        ("my-header", "<header>{{title}}</header>"),
        ("my-footer", "<footer>{{copyright}}</footer>"),
    ]);
    let mut state_map = HashMap::new();
    state_map.insert("title".to_string(), JsonValue::String("Home".to_string()));
    state_map.insert("copyright".to_string(), JsonValue::String("2025".to_string()));
    let root = JsonValue::Object(state_map);

    let result = render_entry_with_locator(
        "<my-header></my-header><my-footer></my-footer>",
        &root,
        &locator,
        None,
    ).expect("render multiple root custom elements");
    let home_index = result.find("Home").expect("header content 'Home' must be present");
    let copyright_index = result.find("2025").expect("footer content '2025' must be present");
    assert!(
        home_index < copyright_index,
        "header content must appear before footer content: {result}"
    );
}

#[test]
fn test_multiple_root_custom_elements_with_text_between() {
    let locator = make_locator(&[
        ("my-a", "<span>A</span>"),
        ("my-b", "<span>B</span>"),
    ]);
    let result = render_entry_with_locator(
        "<my-a></my-a> separator <my-b></my-b>",
        &empty_root(),
        &locator,
        None,
    ).expect("render multiple root elements with text between");

    let a_index = result.find("<span>A</span>");
    let separator_index = result.find("separator");
    let b_index = result.find("<span>B</span>");

    assert!(a_index.is_some(), "rendered A fragment: {result}");
    assert!(separator_index.is_some(), "literal text: {result}");
    assert!(b_index.is_some(), "rendered B fragment: {result}");

    let a_index = a_index.unwrap();
    let separator_index = separator_index.unwrap();
    let b_index = b_index.unwrap();

    assert!(
        a_index < separator_index && separator_index < b_index,
        "expected rendered A fragment, separator text, and rendered B fragment in order: {result}"
    );
}

// ── root element state merging and override behaviour ─────────────────────────

#[test]
fn test_root_element_attr_overrides_root_state() {
    // The element-level attribute "color=red" should take precedence over
    // the root state key "color=blue" for the same key.
    let locator = make_locator(&[("my-el", "{{color}}")]);
    let mut state_map = HashMap::new();
    state_map.insert("color".to_string(), JsonValue::String("blue".to_string()));
    let root = JsonValue::Object(state_map);

    let result = render_entry_with_locator(
        r#"<my-el color="red"></my-el>"#,
        &root,
        &locator,
        None,
    ).expect("render element with attr override");
    // Per-element attribute value ("red") must win over root state ("blue").
    assert!(result.contains("red"), "attr override: {result}");
    assert!(!result.contains("blue"), "root state must not override attr: {result}");
}

#[test]
fn test_root_element_accesses_root_state_keys() {
    // Keys not covered by element attributes should still be readable from root state.
    let locator = make_locator(&[("my-el", "{{user}}")]);
    let mut state_map = HashMap::new();
    state_map.insert("user".to_string(), JsonValue::String("Alice".to_string()));
    let root = JsonValue::Object(state_map);

    let result = render_entry_with_locator(
        "<my-el></my-el>",
        &root,
        &locator,
        None,
    ).expect("render element accessing root state");
    assert!(result.contains("Alice"), "root state accessible: {result}");
}

#[test]
fn test_root_element_binding_attr_resolves_from_root_state() {
    // A {{binding}} attribute on a root element is resolved from root state and
    // forwarded into the child template as the resolved value.
    let locator = make_locator(&[("my-el", "{{label}}")]);
    let mut state_map = HashMap::new();
    state_map.insert("title".to_string(), JsonValue::String("Hello".to_string()));
    let root = JsonValue::Object(state_map);

    let result = render_entry_with_locator(
        r#"<my-el label="{{title}}"></my-el>"#,
        &root,
        &locator,
        None,
    ).expect("render element with binding attr forwarded from root state");
    assert!(result.contains("Hello"), "binding resolved into child state: {result}");
}

// ── array length access ───────────────────────────────────────────────────────

#[test]
fn test_array_length() {
    let result = ok("{{items.length}}", r#"{"items": [1, 2, 3]}"#);
    assert_eq!(result, "3");
}

#[test]
fn test_empty_array_length() {
    let result = ok("{{items.length}}", r#"{"items": []}"#);
    assert_eq!(result, "0");
}

// ── whitespace around binding expressions ─────────────────────────────────────

#[test]
fn test_binding_with_leading_trailing_whitespace() {
    let result = ok("{{  name  }}", r#"{"name": "Alice"}"#);
    assert_eq!(result, "Alice");
}

#[test]
fn test_triple_brace_with_whitespace() {
    let result = ok("{{{  html  }}}", r#"{"html": "<b>bold</b>"}"#);
    assert_eq!(result, "<b>bold</b>");
}

// ── custom element with no matching template passes through ───────────────────

#[test]
fn test_unknown_custom_element_passes_through() {
    let locator = make_locator(&[]);
    let result = render_with_locator(
        r#"<my-unknown label="Hi"></my-unknown>"#,
        &empty_root(),
        &locator,
        None,
    ).expect("render unknown custom element passes through");
    // No template → element is left verbatim.
    assert_eq!(result, r#"<my-unknown label="Hi"></my-unknown>"#);
}

// ── f-repeat with an empty array ─────────────────────────────────────────────

#[test]
fn test_f_repeat_empty_array_produces_no_output() {
    let result = ok(
        r#"before<f-repeat value="{{item in items}}"><li>{{item}}</li></f-repeat>after"#,
        r#"{"items": []}"#,
    );
    assert_eq!(result, "beforeafter");
}

// ── f-when with missing key is falsy ──────────────────────────────────────────

#[test]
fn test_f_when_missing_key_is_falsy() {
    // A key that does not exist in state resolves to None which is treated as falsy.
    let result = ok(r#"<f-when value="{{missing}}">shown</f-when>"#, "{}");
    assert_eq!(result, "");
}

// ── nested custom elements inside a shadow template ───────────────────────────

#[test]
fn test_nested_custom_element_inside_shadow() {
    let locator = make_locator(&[
        ("my-outer", r#"<div><my-inner label="nested"></my-inner></div>"#),
        ("my-inner", "<span>{{label}}</span>"),
    ]);
    let result = render_with_locator("<my-outer></my-outer>", &empty_root(), &locator, None)
        .expect("render nested custom element inside shadow");
    assert!(result.contains("nested"), "inner rendered: {result}");
    assert!(
        result.contains("<span>") && result.contains("</span>"),
        "inner template span tag rendered: {result}"
    );
}

// ── render with a JsonValue directly ─────────────────────────────────────────

#[test]
fn test_render_with_json_value_directly() {
    let mut map = HashMap::new();
    map.insert("greeting".to_string(), JsonValue::String("Hi".to_string()));
    let state = JsonValue::Object(map);
    let result = render("<p>{{greeting}}</p>", &state, None).expect("render with JsonValue directly");
    assert_eq!(result, "<p>Hi</p>");
}
