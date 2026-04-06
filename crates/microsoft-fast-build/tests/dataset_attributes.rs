mod common;
use common::make_locator;
use microsoft_fast_build::{render_with_locator, JsonValue};
use std::collections::HashMap;

fn state(entries: Vec<(&str, JsonValue)>) -> JsonValue {
    JsonValue::Object(entries.into_iter().map(|(k, v)| (k.to_string(), v)).collect())
}

fn str_val(s: &str) -> JsonValue {
    JsonValue::String(s.to_string())
}

fn empty() -> JsonValue {
    JsonValue::Object(HashMap::new())
}

// ── Static dataset attributes (no binding) ────────────────────────────────────

/// A static `dataset.X` attribute name is converted to `data-x` in the output.
#[test]
fn test_static_dataset_attribute() {
    let locator = make_locator(&[("test-el", r#"<div dataset.dateOfBirth="1990-01-01"></div>"#)]);
    let result = render_with_locator(r#"<test-el></test-el>"#, &empty(), &locator).unwrap();
    assert!(result.contains(r#"data-date-of-birth="1990-01-01""#), "converted attr: {result}");
    assert!(!result.contains("dataset.dateOfBirth"), "old name gone: {result}");
}

/// Single-word dataset property: `dataset.name` → `data-name`.
#[test]
fn test_static_dataset_single_word() {
    let locator = make_locator(&[("test-el", r#"<span dataset.name="Alice"></span>"#)]);
    let result = render_with_locator(r#"<test-el></test-el>"#, &empty(), &locator).unwrap();
    assert!(result.contains(r#"data-name="Alice""#), "single-word: {result}");
    assert!(!result.contains("dataset.name"), "old name gone: {result}");
}

/// Multi-word camelCase: `dataset.createdAt` → `data-created-at`.
#[test]
fn test_static_dataset_multi_word() {
    let locator = make_locator(&[("test-el", r#"<div dataset.createdAt="2024-01-15"></div>"#)]);
    let result = render_with_locator(r#"<test-el></test-el>"#, &empty(), &locator).unwrap();
    assert!(result.contains(r#"data-created-at="2024-01-15""#), "multi-word: {result}");
    assert!(!result.contains("dataset.createdAt"), "old name gone: {result}");
}

// ── Bound dataset attributes ──────────────────────────────────────────────────

/// A `dataset.X="{{expr}}"` binding: attribute name is converted and value is resolved.
#[test]
fn test_dataset_attribute_with_binding() {
    let locator = make_locator(&[("test-el", r#"<div dataset.dateOfBirth="{{dateOfBirth}}"></div>"#)]);
    let root = state(vec![("dateOfBirth", str_val("1990-01-01"))]);
    let result = render_with_locator(
        r#"<test-el dateOfBirth="1990-01-01"></test-el>"#,
        &root,
        &locator,
    ).unwrap();
    assert!(result.contains(r#"data-date-of-birth="1990-01-01""#), "attr binding: {result}");
    assert!(!result.contains("dataset.dateOfBirth"), "old name gone: {result}");
}

/// Binding expression that references a nested `dataset.*` path in state:
/// `{{dataset.dateOfBirth}}` reads `state.dataset.dateOfBirth`.
#[test]
fn test_dataset_binding_from_nested_state() {
    let inner = JsonValue::Object(
        vec![("dateOfBirth".to_string(), str_val("1990-01-01"))].into_iter().collect(),
    );
    let root = state(vec![("dataset", inner)]);
    let locator = make_locator(&[(
        "test-el",
        r#"<div dataset.dateOfBirth="{{dataset.dateOfBirth}}"></div>"#,
    )]);
    // Pass dataset.dateOfBirth through the custom-element attribute
    let result = render_with_locator(
        r#"<test-el dataset.dateOfBirth="1990-01-01"></test-el>"#,
        &root,
        &locator,
    ).unwrap();
    assert!(result.contains("data-date-of-birth="), "attr name converted: {result}");
    assert!(!result.contains("dataset.dateOfBirth="), "old attr name gone: {result}");
}

// ── Mixed attributes ───────────────────────────────────────────────────────────

/// Non-dataset attributes are unchanged alongside dataset ones.
#[test]
fn test_mixed_regular_and_dataset_attributes() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div id="card" dataset.dateOfBirth="1990-01-01" class="item"></div>"#,
    )]);
    let result = render_with_locator(r#"<test-el></test-el>"#, &empty(), &locator).unwrap();
    assert!(result.contains(r#"id="card""#), "id attr: {result}");
    assert!(result.contains(r#"data-date-of-birth="1990-01-01""#), "dataset attr: {result}");
    assert!(result.contains(r#"class="item""#), "class attr: {result}");
    assert!(!result.contains("dataset.dateOfBirth"), "old name gone: {result}");
}

/// Multiple dataset attributes on the same element are all converted.
#[test]
fn test_multiple_dataset_attributes() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div dataset.firstName="Ada" dataset.lastName="Lovelace"></div>"#,
    )]);
    let result = render_with_locator(r#"<test-el></test-el>"#, &empty(), &locator).unwrap();
    assert!(result.contains(r#"data-first-name="Ada""#), "first-name: {result}");
    assert!(result.contains(r#"data-last-name="Lovelace""#), "last-name: {result}");
}

// ── dataset on custom-element opening tag ─────────────────────────────────────

/// A `dataset.X` attribute on a custom-element opening tag is also converted.
#[test]
fn test_dataset_on_custom_element_opening_tag() {
    let locator = make_locator(&[("test-el", "inner")]);
    let result = render_with_locator(
        r#"<test-el dataset.owner="Alice"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"data-owner="Alice""#), "custom-el open tag: {result}");
    assert!(!result.contains("dataset.owner"), "old name gone: {result}");
}
