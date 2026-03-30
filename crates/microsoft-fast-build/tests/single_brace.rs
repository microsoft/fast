mod common;
use common::ok;

#[test]
fn test_single_brace_passthrough() {
    assert_eq!(
        ok(r#"<button @click="{handleClick()}">{{label}}</button>"#, r#"{"label": "Click me"}"#),
        r#"<button @click="{handleClick()}">Click me</button>"#,
    );
}

#[test]
fn test_single_brace_attribute_directive() {
    assert_eq!(
        ok(r#"<slot f-slotted="{slottedNodes}"></slot><span>{{text}}</span>"#, r#"{"text": "hello"}"#),
        r#"<slot f-slotted="{slottedNodes}"></slot><span>hello</span>"#,
    );
}

#[test]
fn test_single_brace_nested_object_arg() {
    assert_eq!(
        ok(r#"<button @click="{handler({key: 'val'})}">{{text}}</button>"#, r#"{"text": "go"}"#),
        r#"<button @click="{handler({key: 'val'})}">go</button>"#,
    );
}

#[test]
fn test_single_brace_in_repeat() {
    assert_eq!(
        ok(
            r#"<f-repeat value="{{item in items}}"><button @click="{onClick()}">{{item}}</button></f-repeat>"#,
            r#"{"items": ["a", "b"]}"#,
        ),
        r#"<button @click="{onClick()}">a</button><button @click="{onClick()}">b</button>"#,
    );
}
