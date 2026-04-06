mod common;
use common::{ok, make_locator};
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

// ── Content bindings ──────────────────────────────────────────────────────────

/// `{{dataset.dateOfBirth}}` as a content binding strips the `dataset.` prefix
/// and resolves the camelCase property name from state.
#[test]
fn test_dataset_content_binding() {
    assert_eq!(
        ok(
            r#"<p>{{dataset.dateOfBirth}}</p>"#,
            r#"{"dateOfBirth": "1990-01-01"}"#,
        ),
        r#"<p>1990-01-01</p>"#,
    );
}

/// Single-word dataset property: `{{dataset.name}}` reads `state.name`.
#[test]
fn test_dataset_content_binding_single_word() {
    assert_eq!(
        ok(r#"<span>{{dataset.name}}</span>"#, r#"{"name": "Alice"}"#),
        r#"<span>Alice</span>"#,
    );
}

/// Multi-word camelCase: `{{dataset.createdAt}}` reads `state.createdAt`.
#[test]
fn test_dataset_content_binding_multi_word() {
    assert_eq!(
        ok(r#"{{dataset.createdAt}}"#, r#"{"createdAt": "2024-01-15"}"#),
        r#"2024-01-15"#,
    );
}

// ── Attribute bindings inside custom-element shadows ─────────────────────────

/// `data-date-of-birth="{{dataset.dateOfBirth}}"` inside a shadow template:
/// the attribute name is already correct HTML; the binding resolves from
/// the camelCase state key.
#[test]
fn test_dataset_attr_binding_in_shadow() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div data-date-of-birth="{{dataset.dateOfBirth}}"></div>"#,
    )]);
    let root = state(vec![("dateOfBirth", str_val("1990-01-01"))]);
    let result = render_with_locator(
        r#"<test-el dateOfBirth="1990-01-01"></test-el>"#,
        &root,
        &locator,
    ).unwrap();
    assert!(result.contains(r#"data-date-of-birth="1990-01-01""#), "attr binding: {result}");
}

/// Multiple dataset bindings on the same element are each resolved.
#[test]
fn test_multiple_dataset_attr_bindings() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div data-first-name="{{dataset.firstName}}" data-last-name="{{dataset.lastName}}"></div>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el firstName="Ada" lastName="Lovelace"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"data-first-name="Ada""#), "first-name: {result}");
    assert!(result.contains(r#"data-last-name="Lovelace""#), "last-name: {result}");
}

// ── dataset.X inside f-when ───────────────────────────────────────────────────

/// `{{dataset.active}}` used as a boolean condition in `<f-when>`.
#[test]
fn test_dataset_in_f_when() {
    assert_eq!(
        ok(
            r#"<f-when value="{{dataset.active}}">yes</f-when>"#,
            r#"{"active": true}"#,
        ),
        "yes",
    );
}

#[test]
fn test_dataset_in_f_when_false() {
    assert_eq!(
        ok(
            r#"<f-when value="{{dataset.active}}">yes</f-when>"#,
            r#"{"active": false}"#,
        ),
        "",
    );
}

// ── dataset.X does not affect non-binding attribute names ─────────────────────

/// A plain `data-date-of-birth` attribute (no binding) is passed through verbatim.
#[test]
fn test_plain_data_attr_unchanged() {
    assert_eq!(
        ok(
            r#"<div data-date-of-birth="1990-01-01">{{name}}</div>"#,
            r#"{"name": "Ada"}"#,
        ),
        r#"<div data-date-of-birth="1990-01-01">Ada</div>"#,
    );
}
