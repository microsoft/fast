mod common;
use common::{ok, make_locator};
use microsoft_fast_build::{render_with_locator, JsonValue, RenderConfig};
use std::collections::HashMap;

fn state(entries: Vec<(&str, JsonValue)>) -> JsonValue {
    JsonValue::Object(entries.into_iter().map(|(k, v)| (k.to_string(), v)).collect())
}

fn str_val(s: &str) -> JsonValue { JsonValue::String(s.to_string()) }
fn bool_val(b: bool) -> JsonValue { JsonValue::Bool(b) }

fn empty() -> JsonValue { JsonValue::Object(HashMap::new()) }

// ── Content bindings — dataset.X reads state["dataset"]["X"] ─────────────────

/// `{{dataset.name}}` resolves from nested state `{"dataset": {"name": "Alice"}}`.
#[test]
fn test_dataset_content_binding() {
    assert_eq!(
        ok(r#"<p>{{dataset.name}}</p>"#, r#"{"dataset": {"name": "Alice"}}"#),
        r#"<p>Alice</p>"#,
    );
}

/// Multi-level camelCase: `{{dataset.dateOfBirth}}` reads `state.dataset.dateOfBirth`.
#[test]
fn test_dataset_content_binding_multi_word() {
    assert_eq!(
        ok(
            r#"{{dataset.dateOfBirth}}"#,
            r#"{"dataset": {"dateOfBirth": "1990-01-01"}}"#,
        ),
        "1990-01-01",
    );
}

// ── Custom element: data-* attributes populate the dataset state key ──────────

/// `data-date-of-birth` on a custom element becomes `state.dataset.dateOfBirth`
/// in the shadow template.
#[test]
fn test_data_attr_maps_to_dataset_state() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div data-date-of-birth="{{dataset.dateOfBirth}}"></div>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el data-date-of-birth="1990-01-01"></test-el>"#,
        &empty(),
        &locator,
        &RenderConfig::default(),
    ).unwrap();
    assert!(result.contains(r#"data-date-of-birth="1990-01-01""#), "resolved: {result}");
}

/// `data-date-of-birth="{{dob}}"` — value from parent binding — reaches the
/// shadow template as `{{dataset.dateOfBirth}}`.
#[test]
fn test_data_attr_from_parent_binding() {
    let locator = make_locator(&[(
        "test-el",
        r#"<span>{{dataset.dateOfBirth}}</span>"#,
    )]);
    let root = state(vec![("dob", str_val("1990-01-01"))]);
    let result = render_with_locator(
        r#"<test-el data-date-of-birth="{{dob}}"></test-el>"#,
        &root,
        &locator,
        &RenderConfig::default(),
    ).unwrap();
    assert!(result.contains("1990-01-01"), "content binding: {result}");
}

/// Multiple `data-*` attributes are all grouped under `dataset`.
#[test]
fn test_multiple_data_attrs_in_dataset() {
    let locator = make_locator(&[(
        "test-el",
        r#"<p>{{dataset.firstName}} {{dataset.lastName}}</p>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el data-first-name="Ada" data-last-name="Lovelace"></test-el>"#,
        &empty(),
        &locator,
        &RenderConfig::default(),
    ).unwrap();
    assert!(result.contains("Ada"), "firstName: {result}");
    assert!(result.contains("Lovelace"), "lastName: {result}");
}

/// Non-`data-*` attributes are still accessible as top-level state keys.
#[test]
fn test_non_data_attrs_remain_top_level() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div class="{{cls}}" data-id="{{dataset.id}}"></div>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el cls="card" data-id="42"></test-el>"#,
        &empty(),
        &locator,
        &RenderConfig::default(),
    ).unwrap();
    assert!(result.contains(r#"class="card""#), "cls: {result}");
    assert!(result.contains(r#"data-id="42""#), "dataset.id: {result}");
}

// ── dataset.X in f-when ───────────────────────────────────────────────────────

/// `<f-when value="{{dataset.active}}">` evaluates `state.dataset.active`.
#[test]
fn test_dataset_in_f_when_true() {
    assert_eq!(
        ok(
            r#"<f-when value="{{dataset.active}}">yes</f-when>"#,
            r#"{"dataset": {"active": true}}"#,
        ),
        "yes",
    );
}

#[test]
fn test_dataset_in_f_when_false() {
    assert_eq!(
        ok(
            r#"<f-when value="{{dataset.active}}">yes</f-when>"#,
            r#"{"dataset": {"active": false}}"#,
        ),
        "",
    );
}
