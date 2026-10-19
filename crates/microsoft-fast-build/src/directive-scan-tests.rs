use super::{next_event, Directive, RenderEvent};
use crate::attribute::{
    find_custom_element, find_directive, find_next_plain_html_tag, find_single_brace, find_str,
    skip_single_brace_expr, SEARCH_BYTES,
};
use crate::Locator;
use std::collections::HashMap;

fn legacy_next_directive(
    template: &str,
    from: usize,
    locator: Option<&Locator>,
) -> Option<Directive> {
    let mut pos = from;
    loop {
        let triple = find_str(template, "{{{", pos).map(Directive::TripleBrace);
        let double = find_str(template, "{{", pos).and_then(|d| {
            let shadowed = triple.as_ref().map(|t| t.position() == d).unwrap_or(false);
            if shadowed {
                None
            } else {
                Some(Directive::DoubleBrace(d))
            }
        });
        let when = find_directive(template, "<f-when", pos).map(Directive::When);
        let repeat = find_directive(template, "<f-repeat", pos).map(Directive::Repeat);
        let custom = locator
            .and_then(|loc| find_custom_element(template, pos, loc).map(Directive::CustomElement));
        let earliest = [&triple, &double, &when, &repeat, &custom]
            .into_iter()
            .flatten()
            .map(Directive::position)
            .min();
        if let (Some(single), Some(earliest)) = (find_single_brace(template, pos), earliest) {
            if single < earliest {
                pos = skip_single_brace_expr(template, single);
                continue;
            }
        }
        return [triple, double, when, repeat, custom]
            .into_iter()
            .flatten()
            .min_by_key(Directive::position);
    }
}

fn legacy_next_event(
    template: &str,
    from: usize,
    locator: Option<&Locator>,
) -> Option<RenderEvent> {
    let directive = legacy_next_directive(template, from, locator);
    let before = directive
        .as_ref()
        .map_or(template.len(), Directive::position);
    if let Some(tag) = find_next_plain_html_tag(template, from, before, locator) {
        Some(RenderEvent::PlainTag(tag))
    } else {
        directive.map(RenderEvent::Directive)
    }
}

#[test]
fn scanner_matches_legacy_discovery_outside_comments_at_every_utf8_boundary() {
    let locator = Locator::from_templates(HashMap::from([
        ("my-el".into(), "<span>{{value}}</span>".into()),
        ("other-el".into(), "<slot></slot>".into()),
    ]));
    let fragments = [
        "",
        "literal",
        "café 🦀",
        "{{value}}",
        "{{{html}}}",
        "{{",
        "{{{",
        "{handler({key: '}}'})}",
        "{'{{ignored}}'}",
        "{unclosed",
        "{",
        r#"{"html":"<span>","binding":"{{value}}"}"#,
        r#"{"html":"<my-el>","binding":"{{value}}"}"#,
        r#"<div title="{{value}}" @click="{handler()}">"#,
        r#"<div title=">">"#,
        "<div",
        "<",
        "</div>",
        "<!doctype html>",
        "< f-when>",
        "<f-when>",
        "<f-when\n",
        "<f-when\t",
        "<f-when\r",
        "<f-when\u{000c}",
        "<f-when-x>",
        "<f-repeat>",
        "<f-repeat/",
        "<f-ref>",
        "<my-el>",
        "<my-el/>",
        "<other-el>",
        "<unknown-el>",
    ];
    for locator in [None, Some(&locator)] {
        for first in fragments {
            for second in fragments {
                let template = format!("{first}{second}{{{{tail}}}}");
                for (from, _) in template.char_indices() {
                    assert_eq!(
                        next_event(&template, from, locator),
                        legacy_next_event(&template, from, locator),
                        "template={template:?}, from={from}",
                    );
                }
            }
        }
    }
}

#[test]
fn scanner_skips_whole_comments_before_discovering_real_events() {
    let locator = Locator::from_templates(HashMap::from([("my-el".into(), "".into())]));
    let comment = r#"<!-- {{ignored}} {{{raw}}} <div title=">"> <my-el> <f-when value="{{show}}"> <f-repeat value="{{item in items}}"> " -->"#;
    for (tail, event) in [
        ("{{real}}", RenderEvent::Directive(Directive::DoubleBrace(comment.len()))),
        ("{{{real}}}", RenderEvent::Directive(Directive::TripleBrace(comment.len()))),
        ("<div>", RenderEvent::PlainTag(comment.len())),
        ("<my-el>", RenderEvent::Directive(Directive::CustomElement(comment.len()))),
        ("<f-when>", RenderEvent::Directive(Directive::When(comment.len()))),
        ("<f-repeat>", RenderEvent::Directive(Directive::Repeat(comment.len()))),
    ] {
        assert_eq!(
            next_event(&format!("{comment}{tail}"), 0, Some(&locator)),
            Some(event),
        );
    }
    assert_eq!(next_event(comment, 0, Some(&locator)), None);
    assert_eq!(
        next_event("<!-- {{ignored}} <my-el>", 0, Some(&locator)),
        None,
    );
}

#[test]
fn adjacent_plain_tags_are_events_even_without_any_later_directive() {
    let template = "<div></div>".repeat(20_000);
    let mut from = 0;
    let mut tags = 0;
    while let Some(RenderEvent::PlainTag(pos)) = next_event(&template, from, None) {
        assert_eq!(pos, tags * 11);
        from = pos + 5;
        tags += 1;
    }
    assert_eq!(tags, 20_000);
}

#[test]
fn adjacent_known_hosts_do_not_need_an_absent_binding_or_directive_search() {
    let locator =
        Locator::from_templates(HashMap::from([("my-el".into(), "<span></span>".into())]));
    let template = "<my-el></my-el>".repeat(20_000);
    SEARCH_BYTES.with(|counter| counter.set(0));
    for i in 0..20_000 {
        assert_eq!(
            next_event(&template, i * 15, Some(&locator)),
            Some(RenderEvent::Directive(Directive::CustomElement(i * 15))),
        );
    }
    SEARCH_BYTES.with(|counter| assert_eq!(counter.get(), 0));

    // Count the logical search spans of the four absent literal patterns,
    // not CPU instructions, allocations, or the other legacy scanners.
    let legacy_template = "<my-el></my-el>".repeat(1_000);
    for i in 0..1_000 {
        legacy_next_directive(&legacy_template, i * 15, Some(&locator));
    }
    SEARCH_BYTES.with(|counter| assert_eq!(counter.get(), 30_030_000));
}
