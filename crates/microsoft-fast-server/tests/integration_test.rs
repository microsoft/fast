use microsoft_fast_server::render_template;

#[test]
fn test_content_binding() {
    let result = render_template("<p>{{greeting}}</p>", r#"{"greeting": "Hello, World!"}"#).unwrap();
    assert_eq!(result, "<p>Hello, World!</p>");
}

#[test]
fn test_unescaped_html() {
    let result = render_template("<div>{{{html}}}</div>", r#"{"html": "<b>bold</b>"}"#).unwrap();
    assert_eq!(result, "<div><b>bold</b></div>");
}

#[test]
fn test_html_escaping() {
    let result = render_template("<p>{{code}}</p>", r#"{"code": "<script>alert('xss')</script>"}"#).unwrap();
    assert_eq!(result, "<p>&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;</p>");
}

#[test]
fn test_f_when_truthy() {
    let result = render_template(
        r#"<f-when value="{{show}}"><span>Visible</span></f-when>"#,
        r#"{"show": true}"#,
    ).unwrap();
    assert_eq!(result, "<span>Visible</span>");
}

#[test]
fn test_f_when_falsy() {
    let result = render_template(
        r#"<f-when value="{{show}}"><span>Hidden</span></f-when>"#,
        r#"{"show": false}"#,
    ).unwrap();
    assert_eq!(result, "");
}

#[test]
fn test_f_when_negation() {
    let result = render_template(
        r#"<f-when value="{{!hidden}}"><span>Visible</span></f-when>"#,
        r#"{"hidden": false}"#,
    ).unwrap();
    assert_eq!(result, "<span>Visible</span>");
}

#[test]
fn test_f_when_equality_string() {
    let result = render_template(
        r#"<f-when value="{{status == 'active'}}"><span>Active</span></f-when>"#,
        r#"{"status": "active"}"#,
    ).unwrap();
    assert_eq!(result, "<span>Active</span>");
}

#[test]
fn test_f_when_equality_bool() {
    let result = render_template(
        r#"<f-when value="{{flag == true}}"><span>Yes</span></f-when>"#,
        r#"{"flag": true}"#,
    ).unwrap();
    assert_eq!(result, "<span>Yes</span>");
}

#[test]
fn test_f_when_not_equal() {
    let result = render_template(
        r#"<f-when value="{{status != 'inactive'}}"><span>Not Inactive</span></f-when>"#,
        r#"{"status": "active"}"#,
    ).unwrap();
    assert_eq!(result, "<span>Not Inactive</span>");
}

#[test]
fn test_f_when_or() {
    let result = render_template(
        r#"<f-when value="{{a || b}}"><span>Either</span></f-when>"#,
        r#"{"a": false, "b": true}"#,
    ).unwrap();
    assert_eq!(result, "<span>Either</span>");
}

#[test]
fn test_f_when_and() {
    let result = render_template(
        r#"<f-when value="{{a && b}}"><span>Both</span></f-when>"#,
        r#"{"a": true, "b": true}"#,
    ).unwrap();
    assert_eq!(result, "<span>Both</span>");

    let result2 = render_template(
        r#"<f-when value="{{a && b}}"><span>Both</span></f-when>"#,
        r#"{"a": true, "b": false}"#,
    ).unwrap();
    assert_eq!(result2, "");
}

#[test]
fn test_f_when_numeric_comparison() {
    let result = render_template(
        r#"<f-when value="{{count > 3}}"><span>Many</span></f-when>"#,
        r#"{"count": 5}"#,
    ).unwrap();
    assert_eq!(result, "<span>Many</span>");

    let result2 = render_template(
        r#"<f-when value="{{count < 3}}"><span>Few</span></f-when>"#,
        r#"{"count": 5}"#,
    ).unwrap();
    assert_eq!(result2, "");
}

#[test]
fn test_f_repeat_basic() {
    let result = render_template(
        r#"<f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat>"#,
        r#"{"items": ["a", "b", "c"]}"#,
    ).unwrap();
    assert_eq!(result, "<span>a</span><span>b</span><span>c</span>");
}

#[test]
fn test_f_repeat_object_items() {
    let result = render_template(
        r#"<f-repeat value="{{item in people}}"><span>{{item.name}}</span></f-repeat>"#,
        r#"{"people": [{"name": "Alice"}, {"name": "Bob"}]}"#,
    ).unwrap();
    assert_eq!(result, "<span>Alice</span><span>Bob</span>");
}

#[test]
fn test_f_repeat_root_access() {
    let result = render_template(
        r#"<f-repeat value="{{item in items}}"><span>{{title}}: {{item}}</span></f-repeat>"#,
        r#"{"title": "Items", "items": ["a", "b"]}"#,
    ).unwrap();
    assert_eq!(result, "<span>Items: a</span><span>Items: b</span>");
}

#[test]
fn test_f_when_in_f_repeat() {
    let result = render_template(
        r#"<f-repeat value="{{item in items}}"><f-when value="{{item.active}}"><span>{{item.name}}</span></f-when></f-repeat>"#,
        r#"{"items": [{"name": "Alice", "active": true}, {"name": "Bob", "active": false}]}"#,
    ).unwrap();
    assert_eq!(result, "<span>Alice</span>");
}

#[test]
fn test_f_repeat_in_f_when() {
    let result = render_template(
        r#"<f-when value="{{show}}"><f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat></f-when>"#,
        r#"{"show": true, "items": ["x", "y"]}"#,
    ).unwrap();
    assert_eq!(result, "<span>x</span><span>y</span>");
}

#[test]
fn test_f_repeat_in_f_repeat() {
    let result = render_template(
        r#"<f-repeat value="{{outer in rows}}"><f-repeat value="{{inner in outer.cells}}"><span>{{inner}}</span></f-repeat></f-repeat>"#,
        r#"{"rows": [{"cells": ["a", "b"]}, {"cells": ["c", "d"]}]}"#,
    ).unwrap();
    assert_eq!(result, "<span>a</span><span>b</span><span>c</span><span>d</span>");
}

#[test]
fn test_f_when_in_f_when() {
    let result = render_template(
        r#"<f-when value="{{outer}}"><f-when value="{{inner}}"><span>Both</span></f-when></f-when>"#,
        r#"{"outer": true, "inner": true}"#,
    ).unwrap();
    assert_eq!(result, "<span>Both</span>");

    let result2 = render_template(
        r#"<f-when value="{{outer}}"><f-when value="{{inner}}"><span>Both</span></f-when></f-when>"#,
        r#"{"outer": true, "inner": false}"#,
    ).unwrap();
    assert_eq!(result2, "");
}

#[test]
fn test_missing_binding() {
    let result = render_template("<p>{{missing}}</p>", r#"{}"#).unwrap();
    assert_eq!(result, "<p></p>");
}

#[test]
fn test_render_template_with_json_string() {
    let result = render_template("Hello, {{name}}!", r#"{"name": "World"}"#).unwrap();
    assert_eq!(result, "Hello, World!");
}

#[test]
fn test_array_index_access() {
    let result = render_template("{{list.0}}", r#"{"list": ["first", "second"]}"#).unwrap();
    assert_eq!(result, "first");
}
