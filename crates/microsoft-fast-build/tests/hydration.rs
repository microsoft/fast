mod common;
use common::make_locator;
use microsoft_fast_build::{render_with_locator, JsonValue};
use std::collections::HashMap;

fn hand_root(entries: Vec<(&str, JsonValue)>) -> JsonValue {
    let map: HashMap<String, JsonValue> = entries
        .into_iter()
        .map(|(k, v)| (k.to_string(), v))
        .collect();
    JsonValue::Object(map)
}

fn str_val(s: &str) -> JsonValue { JsonValue::String(s.to_string()) }
fn bool_val(b: bool) -> JsonValue { JsonValue::Bool(b) }
fn arr_val(items: Vec<JsonValue>) -> JsonValue { JsonValue::Array(items) }
fn empty() -> JsonValue { hand_root(vec![]) }

// ── Content bindings ──────────────────────────────────────────────────────────

/// Simple `{{text}}` content binding inside a custom element shadow.
#[test]
fn test_hydration_simple_content_binding() {
    let locator = make_locator(&[("test-element", "{{text}}")]);
    let root = hand_root(vec![("text", str_val("Hello world"))]);
    let result = render_with_locator(
        r#"<test-element text="Hello world"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    // Content binding
    assert!(result.contains(
        "<!--fe:b-->Hello world<!--fe:/b-->"
    ), "content binding markers: {result}");
    assert!(result.contains(r#"shadowroot="open""#), "shadowroot: {result}");
}

/// Multiple `{{a}} {{b}}` content bindings share the same scope UUID with
/// incrementing binding indices.
#[test]
fn test_hydration_multiple_content_bindings() {
    let locator = make_locator(&[("test-element", "{{a}} {{b}}")]);
    let root = hand_root(vec![
        ("a", str_val("Hello")),
        ("b", str_val("World")),
    ]);
    let result = render_with_locator(
        r#"<test-element a="Hello" b="World"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    assert!(result.contains(
        "<!--fe:b-->Hello<!--fe:/b-->"
    ), "binding 0: {result}");
    assert!(result.contains(
        "<!--fe:b-->World<!--fe:/b-->"
    ), "binding 1: {result}");
}

// ── Attribute bindings (compact format) ───────────────────────────────────────

/// `<input type="{{type}}" disabled>` — one double-brace attribute binding.
/// Compact marker: `data-fe="1"`.
#[test]
fn test_hydration_attribute_binding_compact() {
    let locator = make_locator(&[("test-element", r#"<input type="{{type}}" disabled>"#)]);
    let root = hand_root(vec![("type", str_val("checkbox"))]);
    let result = render_with_locator(
        r#"<test-element type="checkbox"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    assert!(result.contains(r#"data-fe="1""#), "count marker: {result}");
    assert!(result.contains(r#"type="checkbox""#), "resolved attr: {result}");
    // Boolean `disabled` is NOT a binding — no extra marker for it
    assert!(!result.contains(r#"data-fe="2""#), "should not have count 2: {result}");
}

/// Single-brace `@click="{handler()}"` event binding — compact marker present, attr stripped.
#[test]
fn test_hydration_event_binding_compact() {
    let locator = make_locator(&[("test-element", r#"<button @click="{handleClick()}">Label</button>"#)]);
    let result = render_with_locator(
        r#"<test-element></test-element>"#,
        &empty(),
        &locator,
        None,
    ).unwrap();

    assert!(result.contains(r#"data-fe="1""#), "count marker: {result}");
    assert!(!result.contains(r#"@click"#), "event attr stripped: {result}");
    assert!(result.contains("Label"), "label: {result}");
}

/// Multiple event bindings on separate elements each get count markers.
/// The @click attributes are stripped from the HTML output.
#[test]
fn test_hydration_multiple_event_bindings() {
    let locator = make_locator(&[(
        "test-element",
        r#"<button @click="{handleA()}">A</button><button @click="{handleB()}">B</button>"#,
    )]);
    let result = render_with_locator(
        r#"<test-element></test-element>"#,
        &empty(),
        &locator,
        None,
    ).unwrap();

    assert!(result.contains(r#"data-fe="1""#), "first button: {result}");
    assert!(result.contains(r#"data-fe="1""#), "second button: {result}");
    assert!(!result.contains("@click"), "event attrs stripped: {result}");
}

/// `f-slotted="{slottedNodes}"` is a FAST attribute directive — treated as a client-side
/// single-brace binding. Compact marker present, attribute stripped from rendered HTML.
#[test]
fn test_hydration_f_slotted_stripped() {
    let locator = make_locator(&[("test-element", r#"<slot f-slotted="{slottedNodes}"></slot>"#)]);
    let result = render_with_locator(
        r#"<test-element></test-element>"#,
        &empty(),
        &locator,
        None,
    ).unwrap();

    assert!(result.contains(r#"data-fe="1""#), "count marker: {result}");
    assert!(!result.contains("f-slotted"), "f-slotted attr stripped: {result}");
    assert!(result.contains("<slot"), "slot element present: {result}");
}

/// `f-ref="{video}"` is a FAST attribute directive — treated as a client-side
/// single-brace binding. Compact marker present, attribute stripped from rendered HTML.
#[test]
fn test_hydration_f_ref_stripped() {
    let locator = make_locator(&[("test-element", r#"<video f-ref="{video}"></video>"#)]);
    let result = render_with_locator(
        r#"<test-element></test-element>"#,
        &empty(),
        &locator,
        None,
    ).unwrap();

    assert!(result.contains(r#"data-fe="1""#), "count marker: {result}");
    assert!(!result.contains("f-ref"), "f-ref attr stripped: {result}");
    assert!(result.contains("<video"), "video element present: {result}");
}

/// `f-children="{listItems}"` is a FAST attribute directive — treated as a client-side
/// single-brace binding. Compact marker present, attribute stripped from rendered HTML.
#[test]
fn test_hydration_f_children_stripped() {
    let locator = make_locator(&[("test-element", r#"<ul f-children="{listItems}"></ul>"#)]);
    let result = render_with_locator(
        r#"<test-element></test-element>"#,
        &empty(),
        &locator,
        None,
    ).unwrap();

    assert!(result.contains(r#"data-fe="1""#), "count marker: {result}");
    assert!(!result.contains("f-children"), "f-children attr stripped: {result}");
    assert!(result.contains("<ul"), "ul element present: {result}");
}

/// Attribute directives coexist with other bindings — binding indices are correct.
/// `<slot f-slotted="{nodes}" class="{{cls}}">` has 2 bindings (sb=1, db=1).
#[test]
fn test_hydration_f_slotted_with_double_brace_attr() {
    let locator = make_locator(&[(
        "test-element",
        r#"<slot f-slotted="{nodes}" class="{{cls}}"></slot>"#,
    )]);
    let root = hand_root(vec![("cls", str_val("active"))]);
    let result = render_with_locator(
        r#"<test-element cls="active"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    assert!(result.contains(r#"data-fe="2""#), "count marker with count 2: {result}");
    assert!(!result.contains("f-slotted"), "f-slotted attr stripped: {result}");
    assert!(result.contains(r#"class="active""#), "resolved class attr: {result}");
}

/// Mixed: attribute binding + content binding on the same element.
/// `<span class="{{cls}}">{{text}}</span>`
/// — attr binding at index 0 (data-fe="1"), content binding at index 1.
#[test]
fn test_hydration_attr_and_content_binding() {
    let locator = make_locator(&[("test-element", r#"<span class="{{cls}}">{{text}}</span>"#)]);
    let root = hand_root(vec![
        ("cls", str_val("foo")),
        ("text", str_val("bar")),
    ]);
    let result = render_with_locator(
        r#"<test-element cls="foo" text="bar"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    assert!(result.contains(r#"data-fe="1""#), "attr count marker: {result}");
    assert!(result.contains(r#"class="foo""#), "resolved class attr: {result}");
    // Content binding follows after attribute binding
    assert!(result.contains(
        "<!--fe:b-->bar<!--fe:/b-->"
    ), "content binding at index 1: {result}");
}

// ── f-when directive ──────────────────────────────────────────────────────────

/// Truthy `<f-when>`: binding markers wrap content, content in child scope.
#[test]
fn test_hydration_f_when_truthy() {
    let locator = make_locator(&[("test-element", r#"<f-when value="{{show}}">Hello</f-when>"#)]);
    let root = hand_root(vec![("show", bool_val(true))]);
    let result = render_with_locator(
        r#"<test-element show="true"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    // Outer when binding
    assert!(result.contains("<!--fe:b-->"), "start marker: {result}");
    assert!(result.contains("<!--fe:/b-->"), "end marker: {result}");
    assert!(result.contains("Hello"), "content: {result}");
}

/// Falsy `<f-when>`: start/end markers present but nothing between them.
#[test]
fn test_hydration_f_when_falsy() {
    let locator = make_locator(&[("test-element", r#"<f-when value="{{show}}">Hello</f-when>"#)]);
    let root = hand_root(vec![("show", bool_val(false))]);
    let result = render_with_locator(
        r#"<test-element show="{{show}}"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    let shadow_start = result.find(r#"shadowroot="open">"#).expect("no shadow template");
    let shadow_end = result.find("</template>").expect("no close template");
    let shadow = &result[shadow_start..shadow_end];

    assert!(shadow.contains("<!--fe:b-->"), "start: {shadow}");
    assert!(shadow.contains("<!--fe:/b-->"), "end: {shadow}");
    assert!(!shadow.contains("Hello"), "content must be absent: {shadow}");
}

/// Two bindings before and after an f-when; the when consumes one index.
#[test]
fn test_hydration_content_then_when() {
    let locator = make_locator(&[(
        "test-element",
        r#"{{before}}<f-when value="{{show}}">Mid</f-when>{{after}}"#,
    )]);
    let root = hand_root(vec![
        ("before", str_val("A")),
        ("show", bool_val(true)),
        ("after", str_val("B")),
    ]);
    let result = render_with_locator(
        r#"<test-element before="A" show="true" after="B"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    // Bindings: {{before}}, f-when, {{after}} — sequential
    assert!(result.contains(
        "<!--fe:b-->A<!--fe:/b-->"
    ), "before: {result}");
    assert!(result.contains("<!--fe:b-->"), "when start: {result}");
    assert!(result.contains("<!--fe:/b-->"), "when end: {result}");
    assert!(result.contains(
        "<!--fe:b-->B<!--fe:/b-->"
    ), "after: {result}");
}

// ── f-repeat directive ────────────────────────────────────────────────────────

/// Basic `<f-repeat>`: outer binding markers + per-item markers + item content binding.
#[test]
fn test_hydration_f_repeat_basic() {
    let locator = make_locator(&[(
        "test-element",
        "<ul><f-repeat value=\"{{item in list}}\"><li>{{item}}</li></f-repeat></ul>",
    )]);
    let root = hand_root(vec![(
        "list",
        arr_val(vec![str_val("Foo"), str_val("Bar")]),
    )]);
    // Pass list via property binding so child state gets the array.
    let result = render_with_locator(
        r#"<test-element list="{{list}}"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    // Outer scope: f-repeat wrapped in content binding markers
    assert!(result.contains("<!--fe:b-->"), "outer start: {result}");
    assert!(result.contains("<!--fe:/b-->"), "outer end: {result}");
    // Item repeat markers (data-free)
    assert!(result.contains("<!--fe:r-->"), "item 0 start: {result}");
    assert!(result.contains("<!--fe:/r-->"), "item 0 end: {result}");
    assert!(result.contains("<!--fe:r-->"), "item 1 start: {result}");
    assert!(result.contains("<!--fe:/r-->"), "item 1 end: {result}");
    // Per-item scope: {{item}} content binding
    assert!(result.contains("<!--fe:b-->Foo<!--fe:/b-->"),
        "foo binding: {result}");
    assert!(result.contains("<!--fe:b-->Bar<!--fe:/b-->"),
        "bar binding: {result}");
}

/// f-repeat with inner f-when: nested scope markers.
#[test]
fn test_hydration_f_repeat_with_inner_when() {
    let locator = make_locator(&[(
        "test-element",
        "<f-repeat value=\"{{item in list}}\"><f-when value=\"{{item.show}}\"><li>{{item.text}}</li></f-when></f-repeat>",
    )]);
    let first = hand_root(vec![
        ("show", bool_val(true)),
        ("text", str_val("Foo")),
    ]);
    let root = hand_root(vec![("list", arr_val(vec![first]))]);
    let result = render_with_locator(
        r#"<test-element list="{{list}}"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    // Outer scope: f-repeat wrapped in content binding markers
    assert!(result.contains("<!--fe:b-->"), "outer start: {result}");
    // Per-item wrapper
    assert!(result.contains("<!--fe:r-->"), "item start: {result}");
    // Item scope: f-when wrapped in content binding markers
    assert!(result.contains("<!--fe:b-->"), "when start: {result}");
    // When body scope: {{item.text}} content binding
    assert!(result.contains("<!--fe:b-->Foo<!--fe:/b-->"),
        "text binding: {result}");
}

/// Empty f-repeat: outer binding markers only, no item markers.
#[test]
fn test_hydration_f_repeat_empty() {
    let locator = make_locator(&[(
        "test-element",
        "<f-repeat value=\"{{item in list}}\"><li>{{item}}</li></f-repeat>",
    )]);
    let root = hand_root(vec![("list", arr_val(vec![]))]);
    let result = render_with_locator(
        r#"<test-element list="{{list}}"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    let shadow = extract_shadow(&result);
    assert_eq!(
        shadow.trim(),
        "<!--fe:b--><!--fe:/b-->"
    );
}

// ── f-ref / f-slotted (single-brace directive attrs) ─────────────────────────

/// `f-ref="{video}"` — single-brace attribute directive gets a compact marker
/// and is stripped from the rendered HTML (client-side only).
#[test]
fn test_hydration_f_ref_compact() {
    let locator = make_locator(&[("test-element", r#"<video f-ref="{video}"></video>"#)]);
    let result = render_with_locator(
        r#"<test-element></test-element>"#,
        &empty(),
        &locator,
        None,
    ).unwrap();

    assert!(result.contains(r#"data-fe="1""#), "count marker: {result}");
    assert!(!result.contains("f-ref"), "f-ref stripped from output: {result}");
}

/// `f-slotted="{...}"` on multiple elements: incrementing start indices.
#[test]
fn test_hydration_f_slotted_compact() {
    let locator = make_locator(&[(
        "test-element",
        r#"<slot f-slotted="{nodes}"></slot><slot name="foo" f-slotted="{foo}"></slot>"#,
    )]);
    let result = render_with_locator(
        r#"<test-element></test-element>"#,
        &empty(),
        &locator,
        None,
    ).unwrap();

    assert!(result.contains(r#"data-fe="1""#), "first slot: {result}");
    assert!(result.contains(r#"data-fe="1""#), "second slot: {result}");
}

// ── $index in f-repeat ────────────────────────────────────────────────────────

/// `{{$index}}` inside a repeat resolves to the 0-based item index.
#[test]
fn test_hydration_repeat_index() {
    let locator = make_locator(&[(
        "test-element",
        "<f-repeat value=\"{{item in list}}\"><li>{{$index}}</li></f-repeat>",
    )]);
    let root = hand_root(vec![(
        "list",
        arr_val(vec![str_val("a"), str_val("b"), str_val("c")]),
    )]);
    let result = render_with_locator(
        r#"<test-element list="{{list}}"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    assert!(result.contains("<!--fe:b-->0<!--fe:/b-->"),
        "index 0: {result}");
    assert!(result.contains("<!--fe:b-->1<!--fe:/b-->"),
        "index 1: {result}");
    assert!(result.contains("<!--fe:b-->2<!--fe:/b-->"),
        "index 2: {result}");
}

// ── Nested custom elements ─────────────────────────────────────────────────────

/// Custom element nested inside another custom element gets its own hydration scope.
#[test]
fn test_hydration_nested_custom_elements() {
    let locator = make_locator(&[
        ("parent-element", r#"<child-element label="hello"></child-element>"#),
        ("child-element", r#"<span>{{label}}</span>"#),
    ]);
    let result = render_with_locator(
        r#"<parent-element></parent-element>"#,
        &empty(),
        &locator,
        None,
    ).unwrap();

    // Both elements have their own shadow templates
    let shadow_count = result.matches(r#"shadowroot="open""#).count();
    assert_eq!(shadow_count, 2, "both elements should have shadow templates: {result}");
    // child-element has its own shadow scope
    assert!(result.contains("<!--fe:b-->hello<!--fe:/b-->"),
        "child shadow content binding: {result}");
}

/// Custom element with `{{expr}}` attribute binding inside another element's shadow:
/// the attribute binding uses the PARENT scope's counter.
#[test]
fn test_hydration_nested_element_attr_binding() {
    let locator = make_locator(&[
        ("parent-element", r#"<child-element label="{{title}}"></child-element>"#),
        ("child-element", r#"<span>{{label}}</span>"#),
    ]);
    let root = hand_root(vec![("title", str_val("Hi"))]);
    let result = render_with_locator(
        r#"<parent-element title="Hi"></parent-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    // child-element has attr binding for label="{{title}}" → data-fe="1"
    assert!(result.contains(r#"data-fe="1""#), "attr binding on child-element: {result}");
    assert!(result.contains(r#"label="Hi""#), "resolved attr: {result}");
}

// ── Unescaped triple-brace ────────────────────────────────────────────────────

/// `{{{html}}}` unescaped binding also gets hydration markers.
#[test]
fn test_hydration_triple_brace() {
    let locator = make_locator(&[("test-element", "{{{html}}}")]);
    let root = hand_root(vec![("html", str_val("<b>bold</b>"))]);
    let result = render_with_locator(
        r#"<test-element html="bold-content"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    assert!(result.contains("<!--fe:b-->"), "start: {result}");
    assert!(result.contains("<!--fe:/b-->"), "end: {result}");
    assert!(result.contains("bold-content"), "unescaped content: {result}");
}

// ── Boolean attribute bindings (?attr="{{expr}}") ────────────────────────────

/// `?disabled="{{show}}"` with `show: true` → renders `disabled` (no `?`, no value).
#[test]
fn test_hydration_bool_attr_true() {
    let locator = make_locator(&[("test-element", r#"<input ?disabled="{{show}}">"#)]);
    let root = hand_root(vec![("show", bool_val(true))]);
    let result = render_with_locator(
        r#"<test-element show="true"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    let shadow = extract_shadow(&result);
    assert!(shadow.contains("disabled"), "disabled present: {result}");
    assert!(!shadow.contains("?disabled"), "no ?disabled prefix: {result}");
    assert!(shadow.contains(r#"data-fe="1""#), "count marker: {result}");
}

/// `?disabled="{{show}}"` with `show: false` → attribute is omitted entirely.
#[test]
fn test_hydration_bool_attr_false() {
    let locator = make_locator(&[("test-element", r#"<input ?disabled="{{show}}">"#)]);
    let root = hand_root(vec![("show", bool_val(false))]);
    let result = render_with_locator(
        r#"<test-element show="{{show}}"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    let shadow = extract_shadow(&result);
    assert!(!shadow.contains("disabled"), "disabled absent: {result}");
    assert!(shadow.contains(r#"data-fe="1""#), "count marker: {result}");
}

/// `?disabled="{{!isenabled}}"` with `isEnabled: false` → renders `disabled`.
#[test]
fn test_hydration_bool_attr_negation_true() {
    let locator = make_locator(&[("test-element", r#"<input type="checkbox" ?disabled="{{!isenabled}}">"#)]);
    let root = hand_root(vec![("isEnabled", bool_val(false))]);
    let result = render_with_locator(
        r#"<test-element isEnabled="{{isEnabled}}"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    let shadow = extract_shadow(&result);
    assert!(shadow.contains("disabled"), "disabled present: {result}");
    assert!(!shadow.contains("?disabled"), "no ?disabled prefix: {result}");
}

/// `?disabled="{{!isenabled}}"` with `isEnabled: true` → attribute is omitted.
#[test]
fn test_hydration_bool_attr_negation_false() {
    let locator = make_locator(&[("test-element", r#"<input type="checkbox" ?disabled="{{!isenabled}}">"#)]);
    let root = hand_root(vec![("isEnabled", bool_val(true))]);
    let result = render_with_locator(
        r#"<test-element isEnabled="{{isEnabled}}"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    let shadow = extract_shadow(&result);
    assert!(!shadow.contains("disabled"), "disabled absent: {result}");
}

/// `?disabled="{{activegroup == currentgroup}}"` with equal values → renders `disabled`.
#[test]
fn test_hydration_bool_attr_expression_true() {
    let locator = make_locator(&[("test-element", r#"<input ?disabled="{{activegroup == currentgroup}}" type="button">"#)]);
    let root = hand_root(vec![
        ("activeGroup", str_val("work")),
        ("currentGroup", str_val("work")),
    ]);
    let result = render_with_locator(
        r#"<test-element activeGroup="{{activeGroup}}" currentGroup="{{currentGroup}}"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    let shadow = extract_shadow(&result);
    assert!(shadow.contains("disabled"), "disabled present: {result}");
    assert!(!shadow.contains("?disabled"), "no ?disabled prefix: {result}");
}

/// `?disabled="{{activegroup == currentgroup}}"` with unequal values → attribute is omitted.
#[test]
fn test_hydration_bool_attr_expression_false() {
    let locator = make_locator(&[("test-element", r#"<input ?disabled="{{activegroup == currentgroup}}" type="button">"#)]);
    let root = hand_root(vec![
        ("activeGroup", str_val("work")),
        ("currentGroup", str_val("home")),
    ]);
    let result = render_with_locator(
        r#"<test-element activeGroup="{{activeGroup}}" currentGroup="{{currentGroup}}"></test-element>"#,
        &root,
        &locator,
        None,
    ).unwrap();

    let shadow = extract_shadow(&result);
    assert!(!shadow.contains("disabled"), "disabled absent: {result}");
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/// Extract the first shadow template content from a rendered result string.
fn extract_shadow(result: &str) -> &str {
    let start = result.find(r#"shadowroot="open">"#)
        .map(|i| i + r#"shadowroot="open">"#.len())
        .unwrap_or(0);
    let end = result.find("</template>").unwrap_or(result.len());
    &result[start..end]
}
