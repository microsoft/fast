mod common;
use common::make_locator_with_host_attrs;
use microsoft_fast_build::{render_entry_template_with_locator, render_template_with_locator};

// ── static template host attribute propagation ────────────────────────────────

#[test]
fn test_template_static_host_attr_propagates() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[("tabindex", Some("0"))],
    )]);
    let result = render_template_with_locator(
        r#"<my-el></my-el>"#,
        r#"{}"#,
        &locator,
        None,
    )
    .unwrap();
    assert!(
        result.contains(r#"<my-el tabindex="0">"#),
        "expected template tabindex on host: {result}"
    );
}

#[test]
fn test_template_static_host_attr_with_value_html_escapes() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[("data-x", Some("<&>"))],
    )]);
    let result = render_template_with_locator(
        r#"<my-el></my-el>"#,
        r#"{}"#,
        &locator,
        None,
    )
    .unwrap();
    assert!(
        result.contains(r#"<my-el data-x="&lt;&amp;&gt;">"#),
        "expected HTML-escaped value on host: {result}"
    );
}

#[test]
fn test_template_static_bool_host_attr_propagates() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[("hidden", None)],
    )]);
    let result = render_template_with_locator(
        r#"<my-el></my-el>"#,
        r#"{}"#,
        &locator,
        None,
    )
    .unwrap();
    assert!(
        result.contains("<my-el hidden>"),
        "expected static boolean attr on host: {result}"
    );
}

// ── author wins on conflicts ──────────────────────────────────────────────────

#[test]
fn test_author_attr_overrides_template_host_attr() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[("id", Some("from-template"))],
    )]);
    let result = render_template_with_locator(
        r#"<my-el id="from-author"></my-el>"#,
        r#"{}"#,
        &locator,
        None,
    )
    .unwrap();
    assert!(
        result.contains(r#"id="from-author""#),
        "author id should be preserved: {result}"
    );
    assert!(
        !result.contains(r#"id="from-template""#),
        "template id should NOT appear: {result}"
    );
}

#[test]
fn test_author_disabled_wins_over_template_bool_binding() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[("?disabled", Some("{{isDisabled}}"))],
    )]);
    let result = render_template_with_locator(
        r#"<my-el disabled></my-el>"#,
        r#"{"isDisabled": false}"#,
        &locator,
        None,
    )
    .unwrap();
    assert!(
        result.contains("<my-el disabled"),
        "author disabled should remain even when template binding is falsy: {result}"
    );
}

// ── client-only template host attributes are skipped ──────────────────────────

#[test]
fn test_client_only_template_host_attrs_skipped() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[
            ("@click", Some("{x()}")),
            (":title", Some("{t}")),
            ("f-ref", Some("{r}")),
            ("f-slotted", Some("{s}")),
            ("f-children", Some("{c}")),
        ],
    )]);
    let result = render_template_with_locator(
        r#"<my-el></my-el>"#,
        r#"{}"#,
        &locator,
        None,
    )
    .unwrap();
    let host_open_end = result.find('>').expect("opening tag should end");
    let host_open = &result[..=host_open_end];
    assert!(!host_open.contains('@'), "@event must not appear: {host_open}");
    assert!(!host_open.contains(':'), ":prop must not appear: {host_open}");
    assert!(
        !host_open.to_lowercase().contains("f-ref"),
        "f-ref must not appear: {host_open}"
    );
    assert!(
        !host_open.to_lowercase().contains("f-slotted"),
        "f-slotted must not appear: {host_open}"
    );
    assert!(
        !host_open.to_lowercase().contains("f-children"),
        "f-children must not appear: {host_open}"
    );
}

// ── ?attr="{{expr}}" boolean binding ──────────────────────────────────────────

#[test]
fn test_template_host_bool_binding_truthy() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[("?disabled", Some("{{isDisabled}}"))],
    )]);
    let result = render_template_with_locator(
        r#"<my-el></my-el>"#,
        r#"{"isDisabled": true}"#,
        &locator,
        None,
    )
    .unwrap();
    let host_open_end = result.find('>').expect("opening tag should end");
    let host_open = &result[..=host_open_end];
    assert!(
        host_open.contains(" disabled"),
        "bare `disabled` should appear when binding is truthy: {host_open}"
    );
    assert!(
        !host_open.contains("?disabled"),
        "`?` prefix must not leak through: {host_open}"
    );
    assert!(
        !host_open.contains("disabled="),
        "no `=` should be emitted for boolean binding: {host_open}"
    );
}

#[test]
fn test_template_host_bool_binding_falsy() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[("?disabled", Some("{{isDisabled}}"))],
    )]);
    let result = render_template_with_locator(
        r#"<my-el></my-el>"#,
        r#"{"isDisabled": false}"#,
        &locator,
        None,
    )
    .unwrap();
    let host_open_end = result.find('>').expect("opening tag should end");
    let host_open = &result[..=host_open_end];
    assert!(
        !host_open.contains("disabled"),
        "no `disabled` should appear when binding is falsy: {host_open}"
    );
}

// ── attr="{{expr}}" value binding ─────────────────────────────────────────────

#[test]
fn test_template_host_value_binding_resolves_primitive() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[("title", Some("{{tip}}"))],
    )]);
    let result = render_template_with_locator(
        r#"<my-el></my-el>"#,
        r#"{"tip": "hello"}"#,
        &locator,
        None,
    )
    .unwrap();
    assert!(
        result.contains(r#"<my-el title="hello">"#),
        "primitive value should be emitted: {result}"
    );
}

#[test]
fn test_template_host_value_binding_strips_nonprimitive() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[("title", Some("{{obj}}"))],
    )]);
    let result = render_template_with_locator(
        r#"<my-el></my-el>"#,
        r#"{"obj": {"a": 1}}"#,
        &locator,
        None,
    )
    .unwrap();
    let host_open_end = result.find('>').expect("opening tag should end");
    let host_open = &result[..=host_open_end];
    assert!(
        !host_open.contains("title"),
        "object value should not produce a `title` attribute: {host_open}"
    );
}

// ── entry-mode propagation ────────────────────────────────────────────────────

#[test]
fn test_template_host_attr_propagates_in_entry_mode() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[("tabindex", Some("0"))],
    )]);
    let result = render_entry_template_with_locator(
        r#"<my-el></my-el>"#,
        r#"{}"#,
        &locator,
        None,
    )
    .unwrap();
    assert!(
        result.contains(r#"<my-el tabindex="0">"#),
        "expected template tabindex on entry host: {result}"
    );
}

#[test]
fn test_template_host_value_binding_resolves_against_child_root_in_entry_mode() {
    // Entry mode: when the author element has a state-relevant attribute, the
    // child state is built from root + the attr overlay. Template-host bindings
    // resolve against that child state, so `tip` from the attribute overlay
    // wins over `tip` in the root.
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<span>x</span>",
        &[("title", Some("{{tip}}"))],
    )]);
    let result = render_entry_template_with_locator(
        r#"<my-el tip="from-attr"></my-el>"#,
        r#"{"tip": "from-root"}"#,
        &locator,
        None,
    )
    .unwrap();
    assert!(
        result.contains(r#"title="from-attr""#),
        "title should resolve against the child state (attribute overlay): {result}"
    );
}
