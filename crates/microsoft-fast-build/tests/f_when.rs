mod common;
use common::ok;

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

// ── array .length in conditions ───────────────────────────────────────────────

#[test]
fn test_when_array_length_gt_zero() {
    assert_eq!(
        ok(r#"<f-when value="{{items.length > 0}}">has items</f-when>"#, r#"{"items": ["x"]}"#),
        "has items",
    );
}

#[test]
fn test_when_array_length_zero() {
    assert_eq!(
        ok(r#"<f-when value="{{items.length > 0}}">has items</f-when>"#, r#"{"items": []}"#),
        "",
    );
}

// ── chained expressions ───────────────────────────────────────────────────────

#[test]
fn test_f_when_chained_and_all_true() {
    assert_eq!(
        ok(
            r#"<f-when value="{{isAdmin && !isGuest && status == 'active'}}"><span>Welcome</span></f-when>"#,
            r#"{"isAdmin": true, "isGuest": false, "status": "active"}"#,
        ),
        "<span>Welcome</span>",
    );
}

#[test]
fn test_f_when_chained_and_first_false() {
    assert_eq!(
        ok(
            r#"<f-when value="{{isAdmin && !isGuest && status == 'active'}}"><span>Welcome</span></f-when>"#,
            r#"{"isAdmin": false, "isGuest": false, "status": "active"}"#,
        ),
        "",
    );
}

#[test]
fn test_f_when_chained_and_middle_false() {
    assert_eq!(
        ok(
            r#"<f-when value="{{isAdmin && !isGuest && status == 'active'}}"><span>Welcome</span></f-when>"#,
            r#"{"isAdmin": true, "isGuest": true, "status": "active"}"#,
        ),
        "",
    );
}

#[test]
fn test_f_when_chained_and_last_false() {
    assert_eq!(
        ok(
            r#"<f-when value="{{isAdmin && !isGuest && status == 'active'}}"><span>Welcome</span></f-when>"#,
            r#"{"isAdmin": true, "isGuest": false, "status": "inactive"}"#,
        ),
        "",
    );
}

#[test]
fn test_f_when_chained_or() {
    assert_eq!(
        ok(
            r#"<f-when value="{{a || b || c}}"><span>Any</span></f-when>"#,
            r#"{"a": false, "b": false, "c": true}"#,
        ),
        "<span>Any</span>",
    );
    assert_eq!(
        ok(
            r#"<f-when value="{{a || b || c}}"><span>Any</span></f-when>"#,
            r#"{"a": false, "b": false, "c": false}"#,
        ),
        "",
    );
}

#[test]
fn test_f_when_and_before_or() {
    // "a || b && c" = "a || (b && c)" — standard precedence
    assert_eq!(
        ok(
            r#"<f-when value="{{a || b && c}}"><span>Yes</span></f-when>"#,
            r#"{"a": false, "b": true, "c": true}"#,
        ),
        "<span>Yes</span>",
    );
    assert_eq!(
        ok(
            r#"<f-when value="{{a || b && c}}"><span>Yes</span></f-when>"#,
            r#"{"a": false, "b": true, "c": false}"#,
        ),
        "",
    );
}

// ── JavaScript truthy/falsy semantics ─────────────────────────────────────────

#[test]
fn test_f_when_empty_array_is_truthy() {
    // In JavaScript [] is truthy even though it is empty.
    assert_eq!(
        ok(
            r#"<f-when value="{{items}}"><span>Shown</span></f-when>"#,
            r#"{"items": []}"#,
        ),
        "<span>Shown</span>",
    );
}

#[test]
fn test_f_when_nonempty_array_is_truthy() {
    assert_eq!(
        ok(
            r#"<f-when value="{{items}}"><span>Shown</span></f-when>"#,
            r#"{"items": [1, 2, 3]}"#,
        ),
        "<span>Shown</span>",
    );
}

#[test]
fn test_f_when_empty_object_is_truthy() {
    assert_eq!(
        ok(
            r#"<f-when value="{{obj}}"><span>Shown</span></f-when>"#,
            r#"{"obj": {}}"#,
        ),
        "<span>Shown</span>",
    );
}

#[test]
fn test_f_when_empty_string_is_falsy() {
    assert_eq!(
        ok(
            r#"<f-when value="{{name}}"><span>Shown</span></f-when>"#,
            r#"{"name": ""}"#,
        ),
        "",
    );
}

#[test]
fn test_f_when_zero_is_falsy() {
    assert_eq!(
        ok(
            r#"<f-when value="{{count}}"><span>Shown</span></f-when>"#,
            r#"{"count": 0}"#,
        ),
        "",
    );
}
