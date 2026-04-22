mod common;
use common::{make_locator, empty_root};
use microsoft_fast_build::{
    render_with_locator,
    render_template_with_locator,
    render_entry_with_locator,
    RenderConfig, AttributeNameStrategy, JsonValue,
};
use std::collections::HashMap;

fn camel_config() -> RenderConfig {
    RenderConfig::new().with_attribute_name_strategy(AttributeNameStrategy::CamelCase)
}

fn none_config() -> RenderConfig {
    RenderConfig::new().with_attribute_name_strategy(AttributeNameStrategy::None)
}

// ── camelCase strategy: basic conversion ──────────────────────────────────────

#[test]
fn test_camelcase_dashed_attribute() {
    let locator = make_locator(&[("my-el", "<span>{{fooBar}}</span>")]);
    let result = render_with_locator(
        r#"<my-el foo-bar="hello"></my-el>"#,
        &empty_root(),
        &locator,
        Some(&camel_config()),
    ).unwrap();
    assert!(result.contains("hello"), "dashed attr should be camelCased: {result}");
}

#[test]
fn test_camelcase_multi_dashed_attribute() {
    let locator = make_locator(&[("my-el", "<span>{{myCustomProp}}</span>")]);
    let result = render_with_locator(
        r#"<my-el my-custom-prop="world"></my-el>"#,
        &empty_root(),
        &locator,
        Some(&camel_config()),
    ).unwrap();
    assert!(result.contains("world"), "multi-dashed attr should be camelCased: {result}");
}

#[test]
fn test_camelcase_no_dash_unchanged() {
    let locator = make_locator(&[("my-el", "<span>{{disabled}}</span>")]);
    let result = render_with_locator(
        r#"<my-el disabled></my-el>"#,
        &empty_root(),
        &locator,
        Some(&camel_config()),
    ).unwrap();
    assert!(result.contains("true"), "no-dash attr should stay as-is: {result}");
}

// ── camelCase strategy: lookup table attributes are unaffected ─────────────

#[test]
fn test_camelcase_aria_uses_lookup() {
    let locator = make_locator(&[("my-el", "<span>{{ariaDisabled}}</span>")]);
    let result = render_with_locator(
        r#"<my-el aria-disabled="true"></my-el>"#,
        &empty_root(),
        &locator,
        Some(&camel_config()),
    ).unwrap();
    assert!(result.contains("true"), "aria-* should use lookup table: {result}");
}

#[test]
fn test_camelcase_html_attr_uses_lookup() {
    let locator = make_locator(&[("my-el", "<span>{{tabIndex}}</span>")]);
    let result = render_with_locator(
        r#"<my-el tabindex="5"></my-el>"#,
        &empty_root(),
        &locator,
        Some(&camel_config()),
    ).unwrap();
    assert!(result.contains("5"), "HTML lookup attrs should use lookup table: {result}");
}

#[test]
fn test_camelcase_data_attr_uses_dataset() {
    let locator = make_locator(&[("my-el", "<span>{{dataset.dateOfBirth}}</span>")]);
    let result = render_with_locator(
        r#"<my-el data-date-of-birth="1990"></my-el>"#,
        &empty_root(),
        &locator,
        Some(&camel_config()),
    ).unwrap();
    assert!(result.contains("1990"), "data-* should use dataset grouping: {result}");
}

// ── none strategy: preserves current behavior ─────────────────────────────────

#[test]
fn test_none_strategy_dashed_attr_stays_dashed() {
    let locator = make_locator(&[("my-el", "<span>{{foo-bar}}</span>")]);
    let result = render_with_locator(
        r#"<my-el foo-bar="hello"></my-el>"#,
        &empty_root(),
        &locator,
        Some(&none_config()),
    ).unwrap();
    assert!(result.contains("hello"), "none strategy should not convert: {result}");
}

#[test]
fn test_none_strategy_multi_dashed_attr_preserved() {
    let locator = make_locator(&[("my-el", "<span>{{selected-user-id}}</span>")]);
    let result = render_with_locator(
        r#"<my-el selected-user-id="42"></my-el>"#,
        &empty_root(),
        &locator,
        Some(&none_config()),
    ).unwrap();
    assert!(result.contains("42"), "none strategy should preserve dashes: {result}");
}

// ── default config matches camelCase strategy ─────────────────────────────────

#[test]
fn test_default_config_matches_camel_case() {
    let locator = make_locator(&[("my-el", "<span>{{fooBar}}</span>")]);
    let result_default = render_with_locator(
        r#"<my-el foo-bar="hello"></my-el>"#,
        &empty_root(),
        &locator,
        None,
    ).unwrap();
    let result_camel = render_with_locator(
        r#"<my-el foo-bar="hello"></my-el>"#,
        &empty_root(),
        &locator,
        Some(&camel_config()),
    ).unwrap();
    assert_eq!(result_default, result_camel, "default should match camelCase strategy");
}

// ── camelCase with binding resolution ─────────────────────────────────────────

#[test]
fn test_camelcase_with_binding_attr() {
    let locator = make_locator(&[("my-el", "<span>{{myProp}}</span>")]);
    let config = camel_config();
    let mut root = HashMap::new();
    root.insert("source".to_string(), JsonValue::String("resolved".into()));
    let root_val = JsonValue::Object(root);
    let result = render_with_locator(
        r#"<my-el my-prop="{{source}}"></my-el>"#,
        &root_val,
        &locator,
        Some(&config),
    ).unwrap();
    assert!(result.contains("resolved"), "binding should resolve and key should be camelCased: {result}");
}

// ── camelCase with template_with_locator_and_config API ───────────────────────

#[test]
fn test_camelcase_template_api() {
    let locator = make_locator(&[("my-el", "<span>{{fooBar}}</span>")]);
    let config = camel_config();
    let result = render_template_with_locator(
        r#"<my-el foo-bar="hello"></my-el>"#,
        r#"{}"#,
        &locator,
        Some(&config),
    ).unwrap();
    assert!(result.contains("hello"), "template API with config should work: {result}");
}

// ── camelCase with entry-level rendering ──────────────────────────────────────

#[test]
fn test_camelcase_entry_level() {
    let locator = make_locator(&[("my-el", "<span>{{fooBar}}</span>")]);
    let config = camel_config();
    let result = render_entry_with_locator(
        r#"<my-el foo-bar="static"></my-el>"#,
        &empty_root(),
        &locator,
        Some(&config),
    ).unwrap();
    // Entry-level builds child state from attrs with camelCase, so foo-bar → fooBar = "static"
    assert!(result.contains("static"), "entry-level should use camelCase config for child state: {result}");
}

// ── camelCase with nested custom elements ─────────────────────────────────────

#[test]
fn test_camelcase_nested_custom_elements() {
    let locator = make_locator(&[
        ("my-outer", r#"<my-inner inner-prop="{{outerProp}}"></my-inner>"#),
        ("my-inner", "<span>{{innerProp}}</span>"),
    ]);
    let config = camel_config();
    let result = render_template_with_locator(
        r#"<my-outer outer-prop="hello"></my-outer>"#,
        r#"{}"#,
        &locator,
        Some(&config),
    ).unwrap();
    assert!(result.contains("hello"), "camelCase should work through nested elements: {result}");
}

// ── camelCase: :prop bindings are not affected ────────────────────────────────

#[test]
fn test_camelcase_colon_prop_stays_lowercased() {
    let locator = make_locator(&[("my-el", "<span>{{myprop}}</span>")]);
    let config = camel_config();
    let mut root = HashMap::new();
    root.insert("source".to_string(), JsonValue::String("val".into()));
    let root_val = JsonValue::Object(root);
    let result = render_with_locator(
        r#"<my-el :myProp="{{source}}"></my-el>"#,
        &root_val,
        &locator,
        Some(&config),
    ).unwrap();
    assert!(result.contains("val"), ":prop should be lowercased, not camelCased: {result}");
}

// ── camelCase: state key override ─────────────────────────────────────────────

#[test]
fn test_camelcase_attr_overrides_root_state() {
    let locator = make_locator(&[("my-el", "<span>{{fooBar}}</span>")]);
    let config = camel_config();
    let mut root = HashMap::new();
    root.insert("fooBar".to_string(), JsonValue::String("from root".into()));
    let root_val = JsonValue::Object(root);
    let result = render_with_locator(
        r#"<my-el foo-bar="from attr"></my-el>"#,
        &root_val,
        &locator,
        Some(&config),
    ).unwrap();
    assert!(result.contains("from attr"), "attr should override root state: {result}");
}
