mod common;
use common::ok;

#[test]
fn test_content_binding() {
    assert_eq!(ok("<p>{{greeting}}</p>", r#"{"greeting": "Hello, World!"}"#), "<p>Hello, World!</p>");
}

#[test]
fn test_unescaped_html() {
    assert_eq!(ok("<div>{{{html}}}</div>", r#"{"html": "<b>bold</b>"}"#), "<div><b>bold</b></div>");
}

#[test]
fn test_html_escaping() {
    assert_eq!(
        ok("<p>{{code}}</p>", r#"{"code": "<script>alert('xss')</script>"}"#),
        "<p>&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;</p>",
    );
}

// ── array indexing ────────────────────────────────────────────────────────────

#[test]
fn test_array_index_access() {
    assert_eq!(ok("{{list.0}}", r#"{"list": ["first", "second"]}"#), "first");
}

#[test]
fn test_array_index_second_element() {
    assert_eq!(ok("{{list.1}}", r#"{"list": ["a", "b", "c"]}"#), "b");
}

// ── array .length ─────────────────────────────────────────────────────────────

#[test]
fn test_array_length() {
    assert_eq!(ok("{{items.length}}", r#"{"items": ["a", "b", "c"]}"#), "3");
}

#[test]
fn test_array_length_empty() {
    assert_eq!(ok("{{items.length}}", r#"{"items": []}"#), "0");
}

#[test]
fn test_array_length_nested() {
    assert_eq!(ok("{{user.orders.length}}", r#"{"user": {"orders": [1, 2]}}"#), "2");
}

// ── dot-notation — two levels ─────────────────────────────────────────────────

#[test]
fn test_two_level_dot() {
    assert_eq!(ok("{{foo.bar}}", r#"{"foo": {"bar": "hello"}}"#), "hello");
}

// ── dot-notation — three levels ───────────────────────────────────────────────

#[test]
fn test_three_level_dot() {
    assert_eq!(ok("{{foo.bar.bat}}", r#"{"foo": {"bar": {"bat": "deep"}}}"#), "deep");
}

#[test]
fn test_three_level_dot_number() {
    assert_eq!(ok("{{a.b.c}}", r#"{"a": {"b": {"c": 99}}}"#), "99");
}

// ── dot-notation — four levels ────────────────────────────────────────────────

#[test]
fn test_four_level_dot() {
    assert_eq!(ok("{{a.b.c.d}}", r#"{"a": {"b": {"c": {"d": "very deep"}}}}"#), "very deep");
}

// ── mixed array index and object access ───────────────────────────────────────

#[test]
fn test_array_then_object() {
    assert_eq!(
        ok("{{users.0.name}}", r#"{"users": [{"name": "Alice"}, {"name": "Bob"}]}"#),
        "Alice",
    );
}

#[test]
fn test_array_then_object_second_item() {
    assert_eq!(
        ok("{{users.1.name}}", r#"{"users": [{"name": "Alice"}, {"name": "Bob"}]}"#),
        "Bob",
    );
}

#[test]
fn test_object_then_array_then_object() {
    assert_eq!(
        ok(
            "{{org.members.0.city}}",
            r#"{"org": {"members": [{"city": "Seattle"}, {"city": "Berlin"}]}}"#,
        ),
        "Seattle",
    );
}

// ── dot access in f-repeat loop variable ──────────────────────────────────────

#[test]
fn test_deep_dot_in_f_repeat() {
    assert_eq!(
        ok(
            r#"<f-repeat value="{{item in items}}"><span>{{item.address.city}}</span></f-repeat>"#,
            r#"{"items": [{"address": {"city": "Seattle"}}, {"address": {"city": "Berlin"}}]}"#,
        ),
        "<span>Seattle</span><span>Berlin</span>",
    );
}

#[test]
fn test_array_index_in_f_repeat_item() {
    assert_eq!(
        ok(
            r#"<f-repeat value="{{item in rows}}"><span>{{item.cells.0}}</span></f-repeat>"#,
            r#"{"rows": [{"cells": ["a", "b"]}, {"cells": ["c", "d"]}]}"#,
        ),
        "<span>a</span><span>c</span>",
    );
}

// ── non-ASCII / multi-byte UTF-8 content bindings ─────────────────────────────

#[test]
fn test_binding_emoji_from_state() {
    assert_eq!(ok("{{label}}", r#"{"label": "⭐ star"}"#), "⭐ star");
}

#[test]
fn test_binding_emoji_literal_in_template() {
    // Emoji in template literal text (not a binding) must be preserved verbatim.
    assert_eq!(
        ok("<span>⭐ {{name}}</span>", r#"{"name": "Alice"}"#),
        "<span>⭐ Alice</span>",
    );
}

#[test]
fn test_binding_multibyte_chars() {
    assert_eq!(ok("{{v}}", r#"{"v": "café ✓ 🎉"}"#), "café ✓ 🎉");
}
