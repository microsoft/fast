mod common;
use common::ok;
use microsoft_fast_build::render_template_without_state;

#[test]
fn test_f_repeat_basic() {
    assert_eq!(
        ok(r#"<f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat>"#, r#"{"items": ["a", "b", "c"]}"#),
        "<span>a</span><span>b</span><span>c</span>",
    );
}

#[test]
fn test_f_repeat_object_items() {
    assert_eq!(
        ok(r#"<f-repeat value="{{item in people}}"><span>{{item.name}}</span></f-repeat>"#, r#"{"people": [{"name": "Alice"}, {"name": "Bob"}]}"#),
        "<span>Alice</span><span>Bob</span>",
    );
}

#[test]
fn test_f_repeat_root_access() {
    assert_eq!(
        ok(r#"<f-repeat value="{{item in items}}"><span>{{title}}: {{item}}</span></f-repeat>"#, r#"{"title": "Items", "items": ["a", "b"]}"#),
        "<span>Items: a</span><span>Items: b</span>",
    );
}

#[test]
fn test_f_repeat_missing_list_renders_empty() {
    assert_eq!(
        ok(r#"before<f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat>after"#, r#"{}"#),
        "beforeafter",
    );
}

#[test]
fn test_f_repeat_missing_dot_path_list_renders_empty() {
    assert_eq!(
        ok(r#"<f-repeat value="{{item in items.list}}"><span>{{item}}</span></f-repeat>"#, r#"{}"#),
        "",
    );
}

#[test]
fn test_f_repeat_without_state_renders_empty() {
    let result = render_template_without_state(
        r#"<f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat>"#,
        None,
    )
    .expect("render without state");

    assert_eq!(result, "");
}
