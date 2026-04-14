mod common;
use common::make_locator;
use microsoft_fast_build::{render_with_locator, JsonValue};
use std::collections::HashMap;

fn str_val(s: &str) -> JsonValue { JsonValue::String(s.to_string()) }

fn empty() -> JsonValue { JsonValue::Object(HashMap::new()) }

// ── tabindex → tabIndex ──────────────────────────────────────────────────────

#[test]
fn test_tabindex_to_tab_index() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div tabindex="{{tabIndex}}">focusable</div>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el tabindex="0"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"tabindex="0""#), "tabIndex resolved: {result}");
}

// ── readonly → readOnly ──────────────────────────────────────────────────────

#[test]
fn test_readonly_to_read_only() {
    let locator = make_locator(&[(
        "test-el",
        r#"<span>{{readOnly}}</span>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el readonly="true"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains("true"), "readOnly resolved: {result}");
}

// ── contenteditable → contentEditable ────────────────────────────────────────

#[test]
fn test_contenteditable_to_content_editable() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div contenteditable="{{contentEditable}}">edit me</div>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el contenteditable="true"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"contenteditable="true""#), "contentEditable resolved: {result}");
}

// ── colspan → colSpan ────────────────────────────────────────────────────────

#[test]
fn test_colspan_to_col_span() {
    let locator = make_locator(&[(
        "test-el",
        r#"<td colspan="{{colSpan}}">cell</td>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el colspan="2"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"colspan="2""#), "colSpan resolved: {result}");
}

// ── maxlength → maxLength ────────────────────────────────────────────────────

#[test]
fn test_maxlength_to_max_length() {
    let locator = make_locator(&[(
        "test-el",
        r#"<input maxlength="{{maxLength}}">"#,
    )]);
    let result = render_with_locator(
        r#"<test-el maxlength="100"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains(r#"maxlength="100""#), "maxLength resolved: {result}");
}

// ── Binding from parent state ────────────────────────────────────────────────

#[test]
fn test_html_attr_from_parent_binding() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div tabindex="{{tabIndex}}">focus</div>"#,
    )]);
    let mut root_map = HashMap::new();
    root_map.insert("idx".to_string(), str_val("-1"));
    let root = JsonValue::Object(root_map);
    let result = render_with_locator(
        r#"<test-el tabindex="{{idx}}"></test-el>"#,
        &root,
        &locator,
    ).unwrap();
    assert!(result.contains(r#"tabindex="-1""#), "tabIndex binding: {result}");
}

// ── Attributes that match exactly (no conversion) ────────────────────────────

#[test]
fn test_disabled_stays_disabled() {
    let locator = make_locator(&[(
        "test-el",
        r#"<span>{{disabled}}</span>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el disabled="true"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains("true"), "disabled stays as-is: {result}");
}

#[test]
fn test_title_stays_title() {
    let locator = make_locator(&[(
        "test-el",
        r#"<span>{{title}}</span>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el title="Hello"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains("Hello"), "title stays as-is: {result}");
}

// ── Coexistence: HTML attrs + aria attrs + regular attrs ─────────────────────

#[test]
fn test_html_aria_and_regular_attrs_coexist() {
    let locator = make_locator(&[(
        "test-el",
        r#"<div tabindex="{{tabIndex}}" aria-label="{{ariaLabel}}">{{label}}</div>"#,
    )]);
    let result = render_with_locator(
        r#"<test-el tabindex="0" aria-label="Action" label="Click"></test-el>"#,
        &empty(),
        &locator,
    ).unwrap();
    assert!(result.contains("Click"), "label: {result}");
    assert!(result.contains("Action"), "ariaLabel: {result}");
    assert!(result.contains(r#"tabindex="0""#), "tabIndex: {result}");
}
