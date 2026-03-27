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
