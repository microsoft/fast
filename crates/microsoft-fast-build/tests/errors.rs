mod common;
use common::{err, ok};
use microsoft_fast_build::RenderError;

// ── unclosed bindings ─────────────────────────────────────────────────────────

#[test]
fn test_error_unclosed_double_brace() {
    let e = err("Hello {{name", r#"{"name": "World"}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedBinding { .. }), "wrong variant: {msg}");
    assert!(msg.contains("{{name"), "should show partial expr: {msg}");
    assert!(msg.contains("Hello {{name"), "should show template context: {msg}");
}

#[test]
fn test_error_unclosed_double_brace_midway() {
    let e = err("<p>Welcome, {{user</p>", r#"{"user": "Alice"}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedBinding { .. }), "wrong variant: {msg}");
    assert!(msg.contains("{{user"), "should show partial expr: {msg}");
}

#[test]
fn test_error_unclosed_triple_brace() {
    let e = err("Content: {{{html", r#"{"html": "<b>hi</b>"}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedUnescapedBinding { .. }), "wrong variant: {msg}");
    assert!(msg.contains("{{{html"), "should show partial expr: {msg}");
    assert!(msg.contains("Content: {{{html"), "should show template context: {msg}");
}

// ── empty bindings ────────────────────────────────────────────────────────────

#[test]
fn test_error_empty_double_brace() {
    let e = err("<p>{{}}</p>", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::EmptyBinding { .. }), "wrong variant: {msg}");
    assert!(msg.contains("empty binding"), "should describe the issue: {msg}");
    assert!(msg.contains("<p>{{}}"), "should show template context: {msg}");
}

#[test]
fn test_error_empty_triple_brace() {
    let e = err("{{{}}}", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::EmptyBinding { .. }), "wrong variant: {msg}");
    assert!(msg.contains("empty binding"), "should describe the issue: {msg}");
}

#[test]
fn test_error_whitespace_only_binding() {
    let e = err("{{   }}", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::EmptyBinding { .. }), "wrong variant: {msg}");
}

// ── missing content values ────────────────────────────────────────────────────

#[test]
fn test_missing_state_double_brace_renders_empty() {
    assert_eq!(ok("<p>{{missing}}</p>", r#"{}"#), "<p></p>");
}

#[test]
fn test_missing_state_triple_brace_renders_empty() {
    assert_eq!(ok("{{{ghost}}}", r#"{}"#), "");
}

#[test]
fn test_missing_nested_property_renders_empty() {
    // foo exists but foo.bar does not
    assert_eq!(ok("{{foo.bar}}", r#"{"foo": {}}"#), "");
}

// ── unclosed directives ───────────────────────────────────────────────────────

#[test]
fn test_error_unclosed_f_when() {
    let e = err(r#"<f-when value="{{show}}">content with no close"#, r#"{"show": true}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedDirective { .. }), "wrong variant: {msg}");
    assert!(msg.contains("f-when"), "should name the tag: {msg}");
    assert!(msg.contains("</f-when>"), "should name the missing close tag: {msg}");
    assert!(msg.contains("<f-when"), "should show template context: {msg}");
}

#[test]
fn test_error_unclosed_f_repeat() {
    let e = err(r#"<f-repeat value="{{item in items}}">no close"#, r#"{"items": ["a"]}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedDirective { .. }), "wrong variant: {msg}");
    assert!(msg.contains("f-repeat"), "should name the tag: {msg}");
    assert!(msg.contains("</f-repeat>"), "should name the missing close tag: {msg}");
}

#[test]
fn test_error_unclosed_nested_directive() {
    // Outer f-when is properly closed, but inner f-when is not
    let e = err(
        r#"<f-when value="{{a}}"><f-when value="{{b}}">no inner close</f-when>"#,
        r#"{"a": true, "b": true}"#,
    );
    let msg = e.to_string();
    assert!(matches!(e, RenderError::UnclosedDirective { .. }), "wrong variant: {msg}");
}

// ── missing value attribute ───────────────────────────────────────────────────

#[test]
fn test_error_f_when_no_value_attr() {
    let e = err("<f-when>content</f-when>", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::MissingValueAttribute { .. }), "wrong variant: {msg}");
    assert!(msg.contains("f-when"), "should name the tag: {msg}");
    assert!(msg.contains("value="), "should mention the missing attribute: {msg}");
    assert!(msg.contains("<f-when>"), "should show template context: {msg}");
}

#[test]
fn test_error_f_repeat_no_value_attr() {
    let e = err("<f-repeat>content</f-repeat>", r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::MissingValueAttribute { .. }), "wrong variant: {msg}");
    assert!(msg.contains("f-repeat"), "should name the tag: {msg}");
}

#[test]
fn test_error_f_when_unquoted_value() {
    // value attribute present but not wrapped in {{}}
    let e = err(r#"<f-when value="show">content</f-when>"#, r#"{"show": true}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::MissingValueAttribute { .. }), "wrong variant: {msg}");
}

// ── invalid repeat expression ─────────────────────────────────────────────────

#[test]
fn test_error_repeat_expr_no_in_keyword() {
    let e = err(r#"<f-repeat value="{{items}}"><span>x</span></f-repeat>"#, r#"{"items": ["a"]}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::InvalidRepeatExpression { .. }), "wrong variant: {msg}");
    assert!(msg.contains("item in list"), "should describe the expected format: {msg}");
    assert!(msg.contains("items"), "should include the bad expression: {msg}");
}

#[test]
fn test_error_repeat_expr_missing_list() {
    let e = err(r#"<f-repeat value="{{item in }}"><span>x</span></f-repeat>"#, r#"{}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::InvalidRepeatExpression { .. }), "wrong variant: {msg}");
}

#[test]
fn test_error_repeat_expr_missing_var() {
    let e = err(r#"<f-repeat value="{{ in items}}"><span>x</span></f-repeat>"#, r#"{"items": ["a"]}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::InvalidRepeatExpression { .. }), "wrong variant: {msg}");
}

// ── not an array ──────────────────────────────────────────────────────────────

#[test]
fn test_error_repeat_not_an_array_string() {
    let e = err(
        r#"<f-repeat value="{{item in name}}"><span>{{item}}</span></f-repeat>"#,
        r#"{"name": "Alice"}"#,
    );
    let msg = e.to_string();
    assert!(matches!(e, RenderError::NotAnArray { .. }), "wrong variant: {msg}");
    assert!(msg.contains("name"), "should name the binding: {msg}");
    assert!(msg.contains("f-repeat"), "should mention f-repeat: {msg}");
}

#[test]
fn test_error_repeat_not_an_array_object() {
    let e = err(
        r#"<f-repeat value="{{item in config}}"><span>{{item}}</span></f-repeat>"#,
        r#"{"config": {"key": "val"}}"#,
    );
    let msg = e.to_string();
    assert!(matches!(e, RenderError::NotAnArray { .. }), "wrong variant: {msg}");
    assert!(msg.contains("config"), "should name the binding: {msg}");
}

#[test]
fn test_error_repeat_not_an_array_bool() {
    let e = err(
        r#"<f-repeat value="{{item in flag}}"><span>{{item}}</span></f-repeat>"#,
        r#"{"flag": true}"#,
    );
    let msg = e.to_string();
    assert!(matches!(e, RenderError::NotAnArray { .. }), "wrong variant: {msg}");
}

#[test]
fn test_error_repeat_not_an_array_null() {
    let e = err(r#"<f-repeat value="{{item in items}}">{{item}}</f-repeat>"#, r#"{"items": null}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::NotAnArray { .. }), "wrong variant: {msg}");
    assert!(msg.contains("items"), "should name the binding: {msg}");
}

// ── JSON parse errors ─────────────────────────────────────────────────────────

#[test]
fn test_error_invalid_json_bare_word() {
    let e = err("{{x}}", "not json at all");
    let msg = e.to_string();
    assert!(matches!(e, RenderError::JsonParse { .. }), "wrong variant: {msg}");
    assert!(msg.contains("JSON"), "should mention JSON: {msg}");
}

#[test]
fn test_error_invalid_json_unclosed_object() {
    let e = err("{{x}}", r#"{"x": 1"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::JsonParse { .. }), "wrong variant: {msg}");
}

#[test]
fn test_error_invalid_json_trailing_comma() {
    let e = err("{{x}}", r#"{"x": 1,}"#);
    let msg = e.to_string();
    assert!(matches!(e, RenderError::JsonParse { .. }), "wrong variant: {msg}");
}

// ── error propagation from nested directives ──────────────────────────────────

#[test]
fn test_missing_content_inside_f_when_renders_empty() {
    let result = ok(
        r#"<f-when value="{{show}}">{{missing}}</f-when>"#,
        r#"{"show": true}"#,
    );
    assert_eq!(result, "");
}

#[test]
fn test_missing_content_inside_f_repeat_renders_empty() {
    let result = ok(
        r#"<f-repeat value="{{item in items}}">{{missing}}</f-repeat>"#,
        r#"{"items": ["a"]}"#,
    );
    assert_eq!(result, "");
}
