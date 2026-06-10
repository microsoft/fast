mod common;

use common::{make_locator, make_locator_with_host_attrs};
use microsoft_fast_build::{
    render_entry_template_stream_with_locator, render_entry_template_with_locator, render_template,
    render_template_stream,
};

fn strings(items: &[&str]) -> Vec<String> {
    items.iter().map(|item| (*item).to_string()).collect()
}

fn assert_no_empty(chunks: &[String]) {
    assert!(
        chunks.iter().all(|chunk| !chunk.is_empty()),
        "stream should not contain empty chunks: {chunks:?}"
    );
}

#[test]
fn prompt_example_streams_in_sensible_chunks() {
    let locator = make_locator(&[("custom-subheading", "{{text}}<slot></slot>")]);
    let entry = r#"<h1 id="{{id}}">Hello world</h1><custom-subheading text="{{subheadingText}}"> <span>and friends</span></custom-subheading><p>{{paragraphText}}</p>"#;
    let state = r#"{"id":"title","subheadingText":"from Mars","paragraphText":"A letter from one planet to another"}"#;

    let chunks = render_entry_template_stream_with_locator(entry, state, &locator, None).unwrap();

    assert_eq!(
        chunks,
        strings(&[
            r#"<h1 id="title">Hello world</h1>"#,
            r#"<custom-subheading text="from Mars"><template shadowrootmode="open" shadowroot="open"><!--fe:b-->from Mars<!--fe:/b--><slot></slot></template>"#,
            r#" <span>and friends</span></custom-subheading>"#,
            "<p>",
            "A letter from one planet to another",
            "</p>",
        ])
    );
    assert_eq!(
        chunks.join(""),
        render_entry_template_with_locator(entry, state, &locator, None).unwrap()
    );
    assert_no_empty(&chunks);
}

#[test]
fn no_templates_no_custom_elements_streams_content_bindings() {
    let chunks =
        render_template_stream("<p>{{greeting}}</p>", r#"{"greeting":"Hello"}"#, None).unwrap();

    assert_eq!(chunks, strings(&["<p>", "Hello", "</p>"]));
    assert_eq!(
        chunks.join(""),
        render_template("<p>{{greeting}}</p>", r#"{"greeting":"Hello"}"#, None).unwrap()
    );
}

#[test]
fn attribute_bindings_stay_in_their_tag_chunk() {
    let chunks = render_template_stream(
        r#"<h1 id="{{id}}" class="title">Hello</h1><p>{{text}}</p>"#,
        r#"{"id":"heading","text":"Body"}"#,
        None,
    )
    .unwrap();

    assert_eq!(
        chunks,
        strings(&[
            r#"<h1 id="heading" class="title">Hello</h1><p>"#,
            "Body",
            "</p>",
        ])
    );
}

#[test]
fn custom_element_opening_chunk_contains_complete_shadow_template() {
    let locator = make_locator(&[("my-el", "<span>{{text}}</span>")]);
    let entry = r#"<my-el text="{{text}}">light</my-el>"#;
    let chunks =
        render_entry_template_stream_with_locator(entry, r#"{"text":"Hello"}"#, &locator, None)
            .unwrap();

    assert_eq!(
        chunks[0],
        r#"<my-el text="Hello"><template shadowrootmode="open" shadowroot="open"><span><!--fe:b-->Hello<!--fe:/b--></span></template>"#
    );
    assert!(
        chunks[0].contains("</template>"),
        "shadow template must be complete"
    );
    assert!(
        !chunks[0].contains("</my-el>"),
        "closing tag belongs with light DOM"
    );
    assert_eq!(
        chunks.join(""),
        render_entry_template_with_locator(entry, r#"{"text":"Hello"}"#, &locator, None).unwrap()
    );
}

#[test]
fn custom_element_light_dom_streams_nested_bindings_and_custom_elements() {
    let locator = make_locator(&[
        ("outer-el", "<slot></slot>"),
        ("inner-el", "<strong>{{label}}</strong>"),
    ]);
    let entry =
        r#"<outer-el><span>{{light}}</span><inner-el label="{{inner}}"></inner-el></outer-el>"#;
    let chunks = render_entry_template_stream_with_locator(
        entry,
        r#"{"light":"Light","inner":"Nested"}"#,
        &locator,
        None,
    )
    .unwrap();

    assert_eq!(
        chunks,
        strings(&[
            r#"<outer-el><template shadowrootmode="open" shadowroot="open"><slot></slot></template>"#,
            "<span>",
            "Light",
            "</span>",
            r#"<inner-el label="Nested"><template shadowrootmode="open" shadowroot="open"><strong><!--fe:b-->Nested<!--fe:/b--></strong></template></inner-el></outer-el>"#,
        ])
    );
    assert_eq!(
        chunks.join(""),
        render_entry_template_with_locator(
            entry,
            r#"{"light":"Light","inner":"Nested"}"#,
            &locator,
            None,
        )
        .unwrap()
    );
    assert_no_empty(&chunks);
}

#[test]
fn f_when_streams_nested_content_with_normal_render_parity() {
    let locator = make_locator(&[("my-badge", "<span>{{label}}</span>")]);
    let entry = r#"<f-when value="{{show}}"><p>{{text}}</p><my-badge label="{{text}}"></my-badge></f-when>"#;
    let state = r#"{"show":true,"text":"Visible"}"#;
    let chunks = render_entry_template_stream_with_locator(entry, state, &locator, None).unwrap();

    assert!(
        chunks.contains(&"<p>".to_string()),
        "content binding should split"
    );
    assert!(
        chunks.iter().any(|chunk| chunk.starts_with("<my-badge")),
        "custom element should split into its own chunk: {chunks:?}"
    );
    assert_eq!(
        chunks.join(""),
        render_entry_template_with_locator(entry, state, &locator, None).unwrap()
    );
    assert_no_empty(&chunks);
}

#[test]
fn f_repeat_streams_nested_content_and_custom_elements_with_normal_render_parity() {
    let locator = make_locator(&[("my-badge", "<span>{{count}}</span>")]);
    let entry = r#"<ul><f-repeat value="{{item in items}}"><li>{{item.name}}</li><my-badge count="{{item.count}}"></my-badge></f-repeat></ul>"#;
    let state = r#"{"items":[{"name":"One","count":1},{"name":"Two","count":2}]}"#;
    let chunks = render_entry_template_stream_with_locator(entry, state, &locator, None).unwrap();

    assert_eq!(
        chunks.join(""),
        render_entry_template_with_locator(entry, state, &locator, None).unwrap()
    );
    assert!(chunks.iter().any(|chunk| chunk == "One"));
    assert!(chunks
        .iter()
        .any(|chunk| chunk.starts_with("<my-badge count=\"1\"")));
    assert_no_empty(&chunks);
}

#[test]
fn false_when_and_empty_bindings_do_not_emit_empty_chunks() {
    let chunks = render_template_stream(
        r#"<f-when value="{{show}}"><span>{{hidden}}</span></f-when><div>{{missing}}</div><p>{{text}}</p>"#,
        r#"{"show":false,"text":"Shown"}"#,
        None,
    )
    .unwrap();

    assert_eq!(chunks, strings(&["<div>", "</div><p>", "Shown", "</p>"]));
    assert_no_empty(&chunks);
}

#[test]
fn missing_bindings_and_triple_braces_preserve_normal_render_parity() {
    let template = "<div>{{missing}}</div><section>{{{html}}}</section>";
    let state = r#"{"html":"<em>ok</em>"}"#;
    let chunks = render_template_stream(template, state, None).unwrap();

    assert_eq!(
        chunks.join(""),
        render_template(template, state, None).unwrap()
    );
    assert_eq!(
        chunks,
        strings(&["<div>", "</div><section>", "<em>ok</em>", "</section>"])
    );
    assert_no_empty(&chunks);
}

#[test]
fn stream_preprocesses_code_samples_like_normal_rendering() {
    let template = "<code>{{literal}}</code><p>{{actual}}</p>";
    let state = r#"{"literal":"should not bind","actual":"Bound"}"#;
    let chunks = render_template_stream(template, state, None).unwrap();
    let html = chunks.join("");

    assert_eq!(html, render_template(template, state, None).unwrap());
    assert!(html.contains("&#123;&#123;literal&#125;&#125;"));
    assert!(html.contains("<p>Bound</p>"));
    assert_no_empty(&chunks);
}

#[test]
fn stream_merges_template_host_attributes_like_normal_rendering() {
    let locator = make_locator_with_host_attrs(&[(
        "my-el",
        "<slot></slot>",
        &[
            ("tabindex", Some("0")),
            ("?disabled", Some("{{enabled}}")),
            ("title", Some("{{tip}}")),
        ],
    )]);
    let entry = r#"<my-el tip="from-attr"><span>{{light}}</span></my-el>"#;
    let state = r#"{"enabled":true,"tip":"from-root","light":"Light"}"#;
    let chunks = render_entry_template_stream_with_locator(entry, state, &locator, None).unwrap();
    let html = chunks.join("");

    assert_eq!(
        html,
        render_entry_template_with_locator(entry, state, &locator, None).unwrap()
    );
    assert!(
        chunks[0].contains(r#"<my-el tip="from-attr" tabindex="0" disabled title="from-attr">"#),
        "template host attrs should be merged into the opening chunk: {chunks:?}"
    );
    assert_no_empty(&chunks);
}
