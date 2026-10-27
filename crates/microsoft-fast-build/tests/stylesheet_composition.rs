use microsoft_fast_build::{
    compose_f_template_styles, compose_f_template_styles_with_options, parse_f_templates,
    render_entry_template_stream_with_locator, render_template_with_locator, CompositionSource,
    ErrorLocation, Locator, Stylesheet,
};

fn inline<'a>(css: &'a str, style_id: Option<&'a str>) -> Stylesheet<'a> {
    Stylesheet::Inline { css, style_id }
}

#[test]
fn identified_inline_preserves_authored_styles_and_attributes() {
    let html = "<f-template name='card' shadowrootmode='closed'><template class='x'>\n<style>authored{}</style><b>{{title}}</b></template></f-template>";
    let result =
        compose_f_template_styles_with_options(html, inline("a{}", Some("a\"<&'"))).unwrap();
    assert!(result
        .html()
        .contains("<style data-fast-ssr-style=\"a&quot;&lt;&amp;&#39;\">a{}</style>"));
    assert!(result.html().contains("\n<style>authored{}</style>"));
    assert_eq!(
        compose_f_template_styles(html, "a{}").unwrap(),
        compose_f_template_styles_with_options(html, inline("a{}", None))
            .unwrap()
            .html()
    );
}

#[test]
fn external_urls_are_serialized_without_resolving_or_fetching() {
    let html = "<f-template name='card'><template>body</template></f-template>";
    let result = compose_f_template_styles_with_options(
        html,
        Stylesheet::External {
            href: "/a.css?x=\"&y=<x>",
        },
    )
    .unwrap();
    assert!(result
        .html()
        .contains("<link rel=\"stylesheet\" href=\"/a.css?x=&quot;&amp;y=&lt;x&gt;\">body"));
    assert_eq!(
        result.map_span(0, 1).unwrap().source,
        CompositionSource::Html
    );
    assert!(
        compose_f_template_styles_with_options(html, Stylesheet::External { href: "" }).is_err()
    );
    assert!(compose_f_template_styles_with_options(html, inline("", Some(""))).is_err());
}

#[test]
fn maps_binding_spans_and_diagnostics_after_multiline_css() {
    let html = "\r\n😀<f-template name='my-card'>\r<template>\n😀\t{{title}}<f-when></f-when></template></f-template>";
    let css = "\r\n:host {\r color: red;\n}\n";
    let result = compose_f_template_styles_with_options(html, inline(css, None)).unwrap();
    let definitions = parse_f_templates(result.html());
    let original = parse_f_templates(html);
    let binding = &definitions[0].bindings[0];
    let mapped = result
        .map_span(binding.span.start.offset, binding.span.end.offset)
        .unwrap();
    assert_eq!(mapped.source, CompositionSource::Html);
    assert_eq!(mapped.span.unwrap(), original[0].bindings[0].span);

    let locator = Locator::from_metadata(definitions).unwrap();
    let error =
        render_template_with_locator("<my-card></my-card>", "{}", &locator, None).unwrap_err();
    let mapped = result
        .map_location(error.location().unwrap(), true)
        .unwrap();
    let original_locator = Locator::from_metadata(original).unwrap();
    let original_error =
        render_template_with_locator("<my-card></my-card>", "{}", &original_locator, None)
            .unwrap_err();
    let original_location = original_error.location().unwrap();
    assert_eq!(mapped.source, CompositionSource::Html);
    let start = mapped.span.unwrap().start;
    // Original locator coordinates are content-relative; mapping returns full-document coordinates.
    assert_eq!(start.line, 4);
    assert_eq!(start.column, original_location.column);

    let at = result.html().find("<f-when>").unwrap();
    let prefix = &result.html()[..at];
    let normalized = prefix.replace("\r\n", "\n").replace('\r', "\n");
    let line = normalized.split('\n').count();
    let column = normalized
        .rsplit('\n')
        .next()
        .unwrap()
        .encode_utf16()
        .count()
        + 1;
    let mapped_document = result
        .map_location(
            ErrorLocation {
                line,
                column,
                length: error.location().unwrap().length,
            },
            false,
        )
        .unwrap();
    assert_eq!(mapped_document.span.unwrap().start, start);
}

#[test]
fn mapping_distinguishes_css_generated_and_invalid_ranges() {
    let html = "<f-template name='card'><template>{{title}}</template></f-template>";
    let css = "😀\r\nx{}";
    let result = compose_f_template_styles_with_options(html, inline(css, Some("id"))).unwrap();
    let css_at = result.html()[..result.html().find(css).unwrap()]
        .encode_utf16()
        .count();
    let mapped = result.map_span(css_at, css_at + 2).unwrap();
    assert_eq!(mapped.source, CompositionSource::Css);
    assert_eq!(mapped.span.unwrap().end.column, 3);
    assert!(result.map_span(css_at + 1, css_at + 2).is_err());
    assert!(result.map_span(css_at - 1, css_at + 2).is_err());
    let opening = result.html().find("<style").unwrap();
    let generated = result.map_span(opening, opening + 6).unwrap();
    assert_eq!(generated.source, CompositionSource::Generated);
    assert!(generated.span.is_none());
    assert!(result.map_span(usize::MAX, usize::MAX).is_err());
    assert!(result.map_span(2, 1).is_err());
    assert!(result
        .map_location(
            ErrorLocation {
                line: 0,
                column: 1,
                length: 1
            },
            false
        )
        .is_err());
}

#[test]
fn unsafe_css_diagnostics_belong_to_css() {
    let error = compose_f_template_styles("", "\r\n😀</STYLE >").unwrap_err();
    assert_eq!(error.code(), "unsafe-style-content");
    assert_eq!(error.source_kind(), Some("css"));
    assert_eq!(error.location().unwrap().line, 2);
    assert_eq!(error.location().unwrap().column, 3);
}

#[test]
fn maps_crlf_line_starts_without_selecting_the_middle_of_the_break() {
    let html =
        "<f-template name='my-card'><template>\r\n<f-when></f-when>\r\n</template></f-template>";
    let result = compose_f_template_styles_with_options(html, inline("a{}\r\n", None)).unwrap();
    let definitions = parse_f_templates(result.html());
    let locator = Locator::from_metadata(definitions).unwrap();
    let error =
        render_template_with_locator("<my-card></my-card>", "{}", &locator, None).unwrap_err();
    let mapped = result
        .map_location(error.location().unwrap(), true)
        .unwrap();
    let span = mapped.span.unwrap();
    assert_eq!(
        span.start.offset,
        html[..html.find("<f-when>").unwrap()]
            .encode_utf16()
            .count()
    );
    assert_eq!(span.start.line, 2);
    assert_eq!(span.start.column, 1);
    assert!(result
        .map_location(
            ErrorLocation {
                line: 4,
                column: 1,
                length: 1
            },
            true
        )
        .is_err());
}

#[test]
fn css_is_raw_text_for_parsing_metadata_and_both_render_paths() {
    let html = "<f-template name='my-card'><template>{{title}}</template></f-template>";
    let css = "a{content:'{{notState}} <f-template><template><f-when></f-when></template></f-template> </my-card> <code>{{}}</code>'}";
    let result =
        compose_f_template_styles_with_options(html, inline(css, Some("card-v1"))).unwrap();
    let definitions = parse_f_templates(result.html());
    assert_eq!(definitions.len(), 1);
    assert_eq!(definitions[0].bindings.len(), 1);
    let locator = Locator::from_metadata(definitions).unwrap();
    let rendered = render_template_with_locator(
        "<my-card></my-card>",
        "{\"title\":\"Hello\"}",
        &locator,
        None,
    )
    .unwrap();
    assert!(rendered.contains(css));
    assert!(rendered.contains("Hello"));
    let chunks = render_entry_template_stream_with_locator(
        "<my-card></my-card>",
        "{\"title\":\"Hello\"}",
        &locator,
        None,
    )
    .unwrap();
    assert_eq!(chunks.concat(), rendered);
}
