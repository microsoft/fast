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

#[test]
fn test_array_index_access() {
    assert_eq!(ok("{{list.0}}", r#"{"list": ["first", "second"]}"#), "first");
}
