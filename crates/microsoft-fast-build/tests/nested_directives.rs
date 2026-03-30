mod common;
use common::ok;

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
