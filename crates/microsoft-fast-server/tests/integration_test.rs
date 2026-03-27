use microsoft_fast_server::{render_template, render_with_locator, render_template_with_locator, Locator, RenderError, JsonValue};
use std::collections::HashMap;

// ── helpers ──────────────────────────────────────────────────────────────────

fn err(template: &str, state: &str) -> RenderError {
    render_template(template, state)
        .expect_err("expected an error but rendering succeeded")
}

fn ok(template: &str, state: &str) -> String {
    render_template(template, state)
        .unwrap_or_else(|e| panic!("unexpected error: {e}"))
}

// ── happy-path rendering ──────────────────────────────────────────────────────

#[test]
fn test_content_binding() {
    assert_eq!(ok("<p>{{greeting}}</p>", r#"{"greeting": "Hello, World!"}"#), "<p>Hello, World!</p>");
}

#[test]
fn test_unescaped_html() {
    assert_eq!(ok("<div>{{{html}}}</div>", r#"{"html": "<b>bold</b>"}"#), "<div><b>bold</b></div>");
}

#[test]
fn test_html_escaping() {
    assert_eq!(
        ok("<p>{{code}}</p>", r#"{"code": "<script>alert('xss')</script>"}"#),
        "<p>&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;</p>",
    );
}

#[test]
fn test_f_when_truthy() {
    assert_eq!(
        ok(r#"<f-when value="{{show}}"><span>Visible</span></f-when>"#, r#"{"show": true}"#),
        "<span>Visible</span>",
    );
}

#[test]
fn test_f_when_falsy() {
    assert_eq!(
        ok(r#"<f-when value="{{show}}"><span>Hidden</span></f-when>"#, r#"{"show": false}"#),
        "",
    );
}

#[test]
fn test_f_when_negation() {
    assert_eq!(
        ok(r#"<f-when value="{{!hidden}}"><span>Visible</span></f-when>"#, r#"{"hidden": false}"#),
        "<span>Visible</span>",
    );
}

#[test]
fn test_f_when_equality_string() {
    assert_eq!(
        ok(r#"<f-when value="{{status == 'active'}}"><span>Active</span></f-when>"#, r#"{"status": "active"}"#),
        "<span>Active</span>",
    );
}

#[test]
fn test_f_when_equality_bool() {
    assert_eq!(
        ok(r#"<f-when value="{{flag == true}}"><span>Yes</span></f-when>"#, r#"{"flag": true}"#),
        "<span>Yes</span>",
    );
}

#[test]
fn test_f_when_not_equal() {
    assert_eq!(
        ok(r#"<f-when value="{{status != 'inactive'}}"><span>Not Inactive</span></f-when>"#, r#"{"status": "active"}"#),
        "<span>Not Inactive</span>",
    );
}

#[test]
fn test_f_when_or() {
    assert_eq!(
        ok(r#"<f-when value="{{a || b}}"><span>Either</span></f-when>"#, r#"{"a": false, "b": true}"#),
        "<span>Either</span>",
    );
}

#[test]
fn test_f_when_and() {
    assert_eq!(
        ok(r#"<f-when value="{{a && b}}"><span>Both</span></f-when>"#, r#"{"a": true, "b": true}"#),
        "<span>Both</span>",
    );
    assert_eq!(
        ok(r#"<f-when value="{{a && b}}"><span>Both</span></f-when>"#, r#"{"a": true, "b": false}"#),
        "",
    );
}

#[test]
fn test_f_when_numeric_comparison() {
    assert_eq!(
        ok(r#"<f-when value="{{count > 3}}"><span>Many</span></f-when>"#, r#"{"count": 5}"#),
        "<span>Many</span>",
    );
    assert_eq!(
        ok(r#"<f-when value="{{count < 3}}"><span>Few</span></f-when>"#, r#"{"count": 5}"#),
        "",
    );
}

#[test]
fn test_f_repeat_basic() {
    assert_eq!(
        ok(r#"<f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat>"#, r#"{"items": ["a", "b", "c"]}"#),
        "<span>a</span><span>b</span><span>c</span>",
    );
}

#[test]
fn test_f_repeat_object_items() {
    assert_eq!(
        ok(r#"<f-repeat value="{{item in people}}"><span>{{item.name}}</span></f-repeat>"#, r#"{"people": [{"name": "Alice"}, {"name": "Bob"}]}"#),
        "<span>Alice</span><span>Bob</span>",
    );
}

#[test]
fn test_f_repeat_root_access() {
    assert_eq!(
        ok(r#"<f-repeat value="{{item in items}}"><span>{{title}}: {{item}}</span></f-repeat>"#, r#"{"title": "Items", "items": ["a", "b"]}"#),
        "<span>Items: a</span><span>Items: b</span>",
    );
}

#[test]
fn test_f_when_in_f_repeat() {
    assert_eq!(
        ok(
            r#"<f-repeat value="{{item in items}}"><f-when value="{{item.active}}"><span>{{item.name}}</span></f-when></f-repeat>"#,
            r#"{"items": [{"name": "Alice", "active": true}, {"name": "Bob", "active": false}]}"#,
        ),
        "<span>Alice</span>",
    );
}

#[test]
fn test_f_repeat_in_f_when() {
    assert_eq!(
        ok(
            r#"<f-when value="{{show}}"><f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat></f-when>"#,
            r#"{"show": true, "items": ["x", "y"]}"#,
        ),
        "<span>x</span><span>y</span>",
    );
}

#[test]
fn test_f_repeat_in_f_repeat() {
    assert_eq!(
        ok(
            r#"<f-repeat value="{{outer in rows}}"><f-repeat value="{{inner in outer.cells}}"><span>{{inner}}</span></f-repeat></f-repeat>"#,
            r#"{"rows": [{"cells": ["a", "b"]}, {"cells": ["c", "d"]}]}"#,
        ),
        "<span>a</span><span>b</span><span>c</span><span>d</span>",
    );
}

#[test]
fn test_f_when_in_f_when() {
    assert_eq!(
        ok(
            r#"<f-when value="{{outer}}"><f-when value="{{inner}}"><span>Both</span></f-when></f-when>"#,
            r#"{"outer": true, "inner": true}"#,
        ),
        "<span>Both</span>",
    );
    assert_eq!(
        ok(
            r#"<f-when value="{{outer}}"><f-when value="{{inner}}"><span>Both</span></f-when></f-when>"#,
            r#"{"outer": true, "inner": false}"#,
        ),
        "",
    );
}

#[test]
fn test_array_index_access() {
    assert_eq!(ok("{{list.0}}", r#"{"list": ["first", "second"]}"#), "first");
}

#[test]
fn test_single_brace_passthrough() {
    assert_eq!(
        ok(r#"<button @click="{handleClick()}">{{label}}</button>"#, r#"{"label": "Click me"}"#),
        r#"<button @click="{handleClick()}">Click me</button>"#,
    );
}

#[test]
fn test_single_brace_attribute_directive() {
    assert_eq!(
        ok(r#"<slot f-slotted="{slottedNodes}"></slot><span>{{text}}</span>"#, r#"{"text": "hello"}"#),
        r#"<slot f-slotted="{slottedNodes}"></slot><span>hello</span>"#,
    );
}

#[test]
fn test_single_brace_nested_object_arg() {
    assert_eq!(
        ok(r#"<button @click="{handler({key: 'val'})}">{{text}}</button>"#, r#"{"text": "go"}"#),
        r#"<button @click="{handler({key: 'val'})}">go</button>"#,
    );
}

#[test]
fn test_single_brace_in_repeat() {
    assert_eq!(
        ok(
            r#"<f-repeat value="{{item in items}}"><button @click="{onClick()}">{{item}}</button></f-repeat>"#,
            r#"{"items": ["a", "b"]}"#,
        ),
        r#"<button @click="{onClick()}">a</button><button @click="{onClick()}">b</button>"#,
    );
}

// ── error: unclosed bindings ──────────────────────────────────────────────────

#[test]
fn test_error_unclosed_double_brace() {
    let e = err("Hello {{name", r#"{"name": "World"}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedBinding { .. }), "wrong variant: {msg}");
    assert!(msg.contains("{{name"), "should show partial expr: {msg}");
    assert!(msg.contains("Hello {{name"), "should show template context: {msg}");
}

#[test]
fn test_error_unclosed_double_brace_midway() {
    // Unclosed {{ buried in the middle of a template
    let e = err("<p>Welcome, {{user</p>", r#"{"user": "Alice"}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedBinding { .. }), "wrong variant: {msg}");
    assert!(msg.contains("{{user"), "should show partial expr: {msg}");
}

#[test]
fn test_error_unclosed_triple_brace() {
    let e = err("Content: {{{html", r#"{"html": "<b>hi</b>"}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedUnescapedBinding { .. }), "wrong variant: {msg}");
    assert!(msg.contains("{{{html"), "should show partial expr: {msg}");
    assert!(msg.contains("Content: {{{html"), "should show template context: {msg}");
}

// ── error: empty bindings ─────────────────────────────────────────────────────

#[test]
fn test_error_empty_double_brace() {
    let e = err("<p>{{}}</p>", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::EmptyBinding { .. }), "wrong variant: {msg}");
    assert!(msg.contains("empty binding"), "should describe the issue: {msg}");
    assert!(msg.contains("<p>{{}}"), "should show template context: {msg}");
}

#[test]
fn test_error_empty_triple_brace() {
    let e = err("{{{}}}", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::EmptyBinding { .. }), "wrong variant: {msg}");
    assert!(msg.contains("empty binding"), "should describe the issue: {msg}");
}

#[test]
fn test_error_whitespace_only_binding() {
    // Whitespace-only expression is treated as empty after trimming
    let e = err("{{   }}", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::EmptyBinding { .. }), "wrong variant: {msg}");
}

// ── error: missing state ──────────────────────────────────────────────────────

#[test]
fn test_error_missing_state_double_brace() {
    let e = err("<p>{{missing}}</p>", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::MissingState { .. }), "wrong variant: {msg}");
    assert!(msg.contains("missing"), "should name the binding: {msg}");
    assert!(msg.contains("<p>{{missing}}"), "should show template context: {msg}");
}

#[test]
fn test_error_missing_state_triple_brace() {
    let e = err("{{{ghost}}}", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::MissingState { .. }), "wrong variant: {msg}");
    assert!(msg.contains("ghost"), "should name the binding: {msg}");
}

#[test]
fn test_error_missing_nested_property() {
    // foo exists but foo.bar does not
    let e = err("{{foo.bar}}", r#"{"foo": {}}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::MissingState { .. }), "wrong variant: {msg}");
    assert!(msg.contains("foo.bar"), "should name the full binding path: {msg}");
}

// ── error: unclosed directives ────────────────────────────────────────────────

#[test]
fn test_error_unclosed_f_when() {
    let e = err(r#"<f-when value="{{show}}">content with no close"#, r#"{"show": true}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedDirective { .. }), "wrong variant: {msg}");
    assert!(msg.contains("f-when"), "should name the tag: {msg}");
    assert!(msg.contains("</f-when>"), "should name the missing close tag: {msg}");
    assert!(msg.contains("<f-when"), "should show template context: {msg}");
}

#[test]
fn test_error_unclosed_f_repeat() {
    let e = err(r#"<f-repeat value="{{item in items}}">no close"#, r#"{"items": ["a"]}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedDirective { .. }), "wrong variant: {msg}");
    assert!(msg.contains("f-repeat"), "should name the tag: {msg}");
    assert!(msg.contains("</f-repeat>"), "should name the missing close tag: {msg}");
}

#[test]
fn test_error_unclosed_nested_directive() {
    // Outer f-when is properly closed, but inner f-when is not
    let e = err(
        r#"<f-when value="{{a}}"><f-when value="{{b}}">no inner close</f-when>"#,
        r#"{"a": true, "b": true}"#,
    );
    // The outer f-when has no close, since the inner </f-when> is consumed by nesting
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedDirective { .. }), "wrong variant: {msg}");
}

// ── error: missing value attribute ───────────────────────────────────────────

#[test]
fn test_error_f_when_no_value_attr() {
    let e = err("<f-when>content</f-when>", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::MissingValueAttribute { .. }), "wrong variant: {msg}");
    assert!(msg.contains("f-when"), "should name the tag: {msg}");
    assert!(msg.contains("value="), "should mention the missing attribute: {msg}");
    assert!(msg.contains("<f-when>"), "should show template context: {msg}");
}

#[test]
fn test_error_f_repeat_no_value_attr() {
    let e = err("<f-repeat>content</f-repeat>", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::MissingValueAttribute { .. }), "wrong variant: {msg}");
    assert!(msg.contains("f-repeat"), "should name the tag: {msg}");
}

#[test]
fn test_error_f_when_unquoted_value() {
    // value attribute present but not wrapped in {{}}
    let e = err(r#"<f-when value="show">content</f-when>"#, r#"{"show": true}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::MissingValueAttribute { .. }), "wrong variant: {msg}");
}

// ── error: invalid repeat expression ─────────────────────────────────────────

#[test]
fn test_error_repeat_expr_no_in_keyword() {
    // Missing "in" — just a bare identifier
    let e = err(r#"<f-repeat value="{{items}}"><span>x</span></f-repeat>"#, r#"{"items": ["a"]}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::InvalidRepeatExpression { .. }), "wrong variant: {msg}");
    assert!(msg.contains("item in list"), "should describe the expected format: {msg}");
    assert!(msg.contains("items"), "should include the bad expression: {msg}");
}

#[test]
fn test_error_repeat_expr_missing_list() {
    // Has "in" but no list identifier after it
    let e = err(r#"<f-repeat value="{{item in }}"><span>x</span></f-repeat>"#, r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::InvalidRepeatExpression { .. }), "wrong variant: {msg}");
}

#[test]
fn test_error_repeat_expr_missing_var() {
    // No variable name before "in"
    let e = err(r#"<f-repeat value="{{ in items}}"><span>x</span></f-repeat>"#, r#"{"items": ["a"]}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::InvalidRepeatExpression { .. }), "wrong variant: {msg}");
}

// ── error: not an array ───────────────────────────────────────────────────────

#[test]
fn test_error_repeat_not_an_array_string() {
    let e = err(
        r#"<f-repeat value="{{item in name}}"><span>{{item}}</span></f-repeat>"#,
        r#"{"name": "Alice"}"#,
    );
    let msg = e.to_string();
    assert!(matches!(e, RenderError::NotAnArray { .. }), "wrong variant: {msg}");
    assert!(msg.contains("name"), "should name the binding: {msg}");
    assert!(msg.contains("f-repeat"), "should mention f-repeat: {msg}");
}

#[test]
fn test_error_repeat_not_an_array_object() {
    let e = err(
        r#"<f-repeat value="{{item in config}}"><span>{{item}}</span></f-repeat>"#,
        r#"{"config": {"key": "val"}}"#,
    );
    let msg = e.to_string();
    assert!(matches!(e, RenderError::NotAnArray { .. }), "wrong variant: {msg}");
    assert!(msg.contains("config"), "should name the binding: {msg}");
}

#[test]
fn test_error_repeat_not_an_array_bool() {
    let e = err(
        r#"<f-repeat value="{{item in flag}}"><span>{{item}}</span></f-repeat>"#,
        r#"{"flag": true}"#,
    );
    let msg = e.to_string();
    assert!(matches!(e, RenderError::NotAnArray { .. }), "wrong variant: {msg}");
}

// ── error: JSON parse ─────────────────────────────────────────────────────────

#[test]
fn test_error_invalid_json_bare_word() {
    let e = err("{{x}}", "not json at all");
    let msg = e.to_string();
    assert!(matches!(e, RenderError::JsonParse { .. }), "wrong variant: {msg}");
    assert!(msg.contains("JSON"), "should mention JSON: {msg}");
}

#[test]
fn test_error_invalid_json_unclosed_object() {
    let e = err("{{x}}", r#"{"x": 1"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::JsonParse { .. }), "wrong variant: {msg}");
}

#[test]
fn test_error_invalid_json_trailing_comma() {
    let e = err("{{x}}", r#"{"x": 1,}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::JsonParse { .. }), "wrong variant: {msg}");
}

// ── error: error propagates from nested directives ────────────────────────────

#[test]
fn test_error_propagates_from_f_when_inner() {
    // Inner content has a missing binding — error should surface even inside f-when
    let e = err(
        r#"<f-when value="{{show}}">{{missing}}</f-when>"#,
        r#"{"show": true}"#,
    );
    let msg = e.to_string();
    assert!(matches!(e, RenderError::MissingState { .. }), "wrong variant: {msg}");
    assert!(msg.contains("missing"), "should name the missing binding: {msg}");
}

#[test]
fn test_error_propagates_from_f_repeat_inner() {
    let e = err(
        r#"<f-repeat value="{{item in items}}">{{missing}}</f-repeat>"#,
        r#"{"items": ["a"]}"#,
    );
    let msg = e.to_string();
    assert!(matches!(e, RenderError::MissingState { .. }), "wrong variant: {msg}");
}

// ── custom element tests ──────────────────────────────────────────────────────

fn make_locator(entries: &[(&str, &str)]) -> Locator {
    let mut templates = HashMap::new();
    for (name, content) in entries {
        templates.insert((*name).to_string(), (*content).to_string());
    }
    Locator::from_templates(templates)
}

fn empty_root() -> JsonValue {
    JsonValue::Object(HashMap::new())
}

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

#[test]
fn test_custom_element_no_template_passthrough() {
    let locator = make_locator(&[]); // no templates
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

#[test]
fn test_locator_from_patterns() {
    let locator = Locator::from_patterns(&["tests/fixtures/*.html"]).unwrap();
    assert!(locator.has_template("my-button"), "missing my-button");
    assert!(locator.has_template("my-badge"), "missing my-badge");
    assert!(locator.has_template("my-card"), "missing my-card");
    assert!(locator.has_template("my-layout"), "missing my-layout");

    // Render using the locator loaded from disk.
    let result = render_with_locator(
        r#"<my-button label="Click me"></my-button>"#,
        &empty_root(),
        &locator,
    ).unwrap();
    assert!(result.contains("<button>Click me</button>"), "rendered: {result}");
}

#[test]
fn test_locator_duplicate_template_error() {
    // The `**` glob picks up both tests/fixtures/my-button.html and
    // tests/fixtures/duplicate/my-button.html.
    let result = Locator::from_patterns(&["tests/fixtures/**/*.html"]);
    assert!(
        matches!(result, Err(RenderError::DuplicateTemplate { .. })),
        "expected DuplicateTemplate error, got: {:?}", result.err()
    );
}

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
