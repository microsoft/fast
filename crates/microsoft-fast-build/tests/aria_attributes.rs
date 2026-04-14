mod common;
use common::make_locator;
use microsoft_fast_build::{render_with_locator, JsonValue};
use std::collections::HashMap;

fn state(entries: Vec<(&str, JsonValue)>) -> JsonValue {
    JsonValue::Object(entries.into_iter().map(|(k, v)| (k.to_string(), v)).collect())
}

fn str_val(s: &str) -> JsonValue { JsonValue::String(s.to_string()) }
fn bool_val(b: bool) -> JsonValue { JsonValue::Bool(b) }

fn empty() -> JsonValue { JsonValue::Object(HashMap::new()) }

// ── Custom element: aria-* attributes are stored as camelCase property names ──

/// `aria-disabled` on a custom element becomes state key `ariaDisabled`.
#[test]
fn test_aria_attr_to_camel_case() {
    let locator = make_locator(&[(
        "test-el",
        r#"<button disabled="{{ariaDisabled}}">click</button>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el aria-disabled="true"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"disabled="true""#), "ariaDisabled resolved: {result}");
}

/// `aria-label` on a custom element becomes state key `ariaLabel`.
#[test]
fn test_aria_label() {
    let locator = make_locator(&[(
        "test-el",
        r#"<span>{{ariaLabel}}</span>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el aria-label="Close dialog"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains("Close dialog"), "ariaLabel resolved: {result}");
}

/// `aria-label="{{expr}}"` — value from parent binding.
#[test]
fn test_aria_attr_from_parent_binding() {
    let locator = make_locator(&[(
        "test-el",
        r#"<span>{{ariaLabel}}</span>"#,
    )]);
    let root = state(vec![("label", str_val("Submit form"))]);
    let result = render_with_locator(
        r#"<test-el aria-label="{{label}}"></test-el>"#,
        &root,
        &locator,
    ).unwrap();
    assert!(result.contains("Submit form"), "ariaLabel binding: {result}");
}

/// Multi-word aria attribute: `aria-live-region` → `ariaLiveRegion`.
#[test]
fn test_aria_multi_word_attr() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div role="{{ariaValueNow}}"></div>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el aria-value-now="50"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"role="50""#), "ariaValueNow resolved: {result}");
}

/// Multiple aria attributes on the same element.
#[test]
fn test_multiple_aria_attrs() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div>{{ariaLabel}} {{ariaDisabled}}</div>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el aria-label="Close" aria-disabled="true"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains("Close"), "ariaLabel: {result}");
    assert!(result.contains("true"), "ariaDisabled: {result}");
}

/// aria-* in f-when condition.
#[test]
fn test_aria_attr_in_f_when() {
    let locator = make_locator(&[(
        "test-el",
        r#"<f-when value="{{ariaHidden}}">hidden</f-when>"#,
    )]);
    let root = state(vec![("hidden", bool_val(true))]);
    let result = render_with_locator(
        r#"<test-el aria-hidden="{{hidden}}"></test-el>"#,
        &root,
        &locator,
    ).unwrap();
    assert!(result.contains("hidden"), "f-when truthy: {result}");
}

/// Non-aria attributes remain as lowercased flat keys alongside aria attrs.
#[test]
fn test_aria_and_non_aria_attrs_coexist() {
    let locator = make_locator(&[(
        "test-el",
        r#"<button aria-label="{{ariaLabel}}">{{label}}</button>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el label="Click me" aria-label="Action button"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains("Click me"), "label: {result}");
    assert!(result.contains("Action button"), "ariaLabel: {result}");
}
