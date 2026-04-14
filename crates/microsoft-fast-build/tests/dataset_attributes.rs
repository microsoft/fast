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

// ── Custom element: data-* attributes are stored as flat keys (no conversion) ─

/// `data-date-of-birth` on a custom element becomes state key `data-date-of-birth`
/// in the shadow template — no camelCase conversion.
#[test]
fn test_data_attr_preserved_as_flat_key() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div data-date-of-birth="{{data-date-of-birth}}"></div>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el data-date-of-birth="1990-01-01"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"data-date-of-birth="1990-01-01""#), "resolved: {result}");
}

/// `data-date-of-birth="{{dob}}"` — value from parent binding — reaches the
/// shadow template as `{{data-date-of-birth}}`.
#[test]
fn test_data_attr_from_parent_binding() {
    let locator = make_locator(&[(
        "test-el",
        r#"<span>{{data-date-of-birth}}</span>"#,
    )]);
    let root = state(vec![("dob", str_val("1990-01-01"))]);
    let result = render_with_locator(
        r#"<test-el data-date-of-birth="{{dob}}"></test-el>"#,
        &root,
        &locator,
    ).unwrap();
    assert!(result.contains("1990-01-01"), "content binding: {result}");
}

/// Multiple `data-*` attributes are all stored as flat keys.
#[test]
fn test_multiple_data_attrs_as_flat_keys() {
    let locator = make_locator(&[(
        "test-el",
        r#"<p>{{data-first-name}} {{data-last-name}}</p>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el data-first-name="Ada" data-last-name="Lovelace"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains("Ada"), "data-first-name: {result}");
    assert!(result.contains("Lovelace"), "data-last-name: {result}");
}

/// Non-`data-*` attributes are still accessible as top-level state keys.
#[test]
fn test_non_data_attrs_remain_top_level() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div class="{{cls}}" data-id="{{data-id}}"></div>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el cls="card" data-id="42"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"class="card""#), "cls: {result}");
    assert!(result.contains(r#"data-id="42""#), "data-id: {result}");
}

// ── data-* in f-when ─────────────────────────────────────────────────────────

/// `<f-when value="{{data-active}}">` evaluates the flat `data-active` key.
#[test]
fn test_data_attr_in_f_when_true() {
    let locator = make_locator(&[(
        "test-el",
        r#"<f-when value="{{data-active}}">yes</f-when>"#,
    )]);
    let root = state(vec![("data-active", bool_val(true))]);
    let result = render_with_locator(
        r#"<test-el data-active="{{data-active}}"></test-el>"#,
        &root,
        &locator,
    ).unwrap();
    assert!(result.contains("yes"), "f-when truthy: {result}");
}

#[test]
fn test_data_attr_in_f_when_false() {
    let locator = make_locator(&[(
        "test-el",
        r#"<f-when value="{{data-active}}">yes</f-when>"#,
    )]);
    let root = state(vec![("data-active", bool_val(false))]);
    let result = render_with_locator(
        r#"<test-el data-active="{{data-active}}"></test-el>"#,
        &root,
        &locator,
    ).unwrap();
    assert!(!result.contains("yes"), "f-when falsy: {result}");
}
