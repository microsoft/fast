use std::ops::Range;
use std::sync::OnceLock;

use crate::attribute::{
    count_attribute_bindings, extract_directive_content_range, extract_directive_expr,
    find_tag_end, parse_element_attributes, read_tag_name, style_element_end,
    AttributePlan,
};
use crate::directive::{next_event, parse_repeat_expr, Directive, RenderEvent};
use crate::error::{template_context, RenderError};
use crate::locator::Locator;

#[cfg(test)]
std::thread_local! {
    static COMPILATIONS: std::cell::Cell<usize> = const { std::cell::Cell::new(0) };
}

#[derive(Debug)]
pub(crate) struct RenderPlan {
    pub(crate) instructions: Vec<Instruction>,
}

#[derive(Debug)]
pub(crate) enum Instruction {
    Literal(Range<usize>),
    Tag(Tag),
    Binding {
        expression: Range<usize>,
        escaped: bool,
    },
    When(When),
    Repeat(Repeat),
    Element(Element),
    // Keep syntax failures lazy, including failures inside skipped directive bodies.
    Deferred(Directive),
}

#[derive(Debug)]
pub(crate) struct Body {
    pub(crate) range: Range<usize>,
    plan: OnceLock<RenderPlan>,
}

impl Body {
    fn new(range: Range<usize>) -> Self {
        Self {
            range,
            plan: OnceLock::new(),
        }
    }

    pub(crate) fn plan(&self, source: &str, locator: Option<&Locator>) -> &RenderPlan {
        self.plan
            .get_or_init(|| RenderPlan::compile(&source[self.range.clone()], locator))
    }
}

#[derive(Debug)]
pub(crate) struct Tag {
    pub(crate) range: Range<usize>,
    pub(crate) attributes: AttributePlan,
    pub(crate) double_bindings: usize,
    pub(crate) total_bindings: usize,
    pub(crate) stripped: String,
}

#[derive(Debug)]
pub(crate) struct When {
    pub(crate) at: usize,
    pub(crate) expression: String,
    pub(crate) body: Body,
    pub(crate) after: usize,
}

impl When {
    pub(crate) fn parse(source: &str, at: usize) -> Result<Self, RenderError> {
        let (range, after) = directive_body(source, at, "f-when")?;
        let expression = directive_expression(source, at, "f-when")?;
        Ok(Self {
            at,
            expression,
            body: Body::new(range),
            after,
        })
    }
}

#[derive(Debug)]
pub(crate) struct Repeat {
    pub(crate) at: usize,
    pub(crate) variable: String,
    pub(crate) collection: String,
    pub(crate) body: Body,
    pub(crate) after: usize,
}

impl Repeat {
    pub(crate) fn parse(source: &str, at: usize) -> Result<Self, RenderError> {
        let (range, after) = directive_body(source, at, "f-repeat")?;
        let expression = directive_expression(source, at, "f-repeat")?;
        let (variable, collection) = parse_repeat_expr(&expression).ok_or_else(|| {
            RenderError::InvalidRepeatExpression {
                expr: expression,
                context: template_context(source, at),
            }
        })?;
        Ok(Self {
            at,
            variable,
            collection,
            body: Body::new(range),
            after,
        })
    }
}

#[derive(Debug)]
pub(crate) struct Element {
    pub(crate) at: usize,
    pub(crate) name: String,
    pub(crate) tag_end: usize,
    pub(crate) base: String,
    pub(crate) attrs: Vec<(String, Option<String>)>,
    pub(crate) binding_count: usize,
    pub(crate) children: Option<Body>,
    pub(crate) after: usize,
}

impl Element {
    pub(crate) fn parse(source: &str, at: usize) -> Result<Self, RenderError> {
        let tag_end =
            find_tag_end(source, at).ok_or_else(|| RenderError::UnclosedDirective {
                tag: "custom element".to_string(),
                context: template_context(source, at),
            })?;
        let name = read_tag_name(source, at).unwrap_or_default();
        let opening = &source[at..tag_end];
        let before_gt = opening[..opening.len() - 1].trim_end();
        let self_closing = before_gt.ends_with('/');
        let base = if self_closing {
            before_gt[..before_gt.len() - 1].trim_end().to_string()
        } else {
            opening[..opening.len() - 1].to_string()
        };
        let content = if self_closing {
            Some((tag_end..tag_end, tag_end))
        } else {
            extract_directive_content_range(source, at, &name)
        };
        let after = content.as_ref().map_or(source.len(), |(_, after)| *after);
        let attrs = parse_element_attributes(opening);
        let (double, single) =
            count_attribute_bindings(attrs.iter().map(|(_, value)| value.as_deref()));
        Ok(Self {
            at,
            name,
            tag_end,
            base,
            attrs,
            binding_count: double + single,
            children: content.map(|(range, _)| Body::new(range)),
            after,
        })
    }
}

impl RenderPlan {
    pub(crate) fn compile(source: &str, locator: Option<&Locator>) -> Self {
        #[cfg(test)]
        COMPILATIONS.with(|count| count.set(count.get() + 1));
        Self {
            instructions: InstructionCursor::new(source, locator).collect(),
        }
    }
}

pub(crate) struct InstructionCursor<'a> {
    source: &'a str,
    locator: Option<&'a Locator>,
    pos: usize,
    event: Option<RenderEvent>,
    literal: Option<Range<usize>>,
}

impl<'a> InstructionCursor<'a> {
    pub(crate) fn new(source: &'a str, locator: Option<&'a Locator>) -> Self {
        Self {
            source,
            locator,
            pos: 0,
            event: None,
            literal: None,
        }
    }
}

impl Iterator for InstructionCursor<'_> {
    type Item = Instruction;

    fn next(&mut self) -> Option<Instruction> {
        if let Some(range) = self.literal.take() {
            return Some(Instruction::Literal(range));
        }
        let source = self.source;
        if self.pos >= source.len() {
            return None;
        }
        let event = self
            .event
            .take()
            .or_else(|| next_event(source, self.pos, self.locator));
        let Some(event) = event else {
            let range = self.pos..source.len();
            self.pos = source.len();
            return Some(Instruction::Literal(range));
        };
        let at = match &event {
            RenderEvent::PlainTag(at) => *at,
            RenderEvent::Directive(directive) => directive.position(),
        };
        if self.pos < at {
            let range = self.pos..at;
            self.pos = at;
            self.event = Some(event);
            return Some(Instruction::Literal(range));
        }
        match event {
            RenderEvent::PlainTag(at) => {
                let Some(end) = find_tag_end(source, at) else {
                    self.pos = source.len();
                    return Some(Instruction::Literal(at..source.len()));
                };
                let attributes =
                    AttributePlan::new(&source[at..end]).expect("scanner found a tag");
                let (double_bindings, single_bindings) = attributes.binding_counts();
                let stripped = if double_bindings + single_bindings == 0 {
                    attributes.stripped()
                } else {
                    String::new()
                };
                self.pos = style_element_end(source, at).unwrap_or(end);
                if end < self.pos {
                    self.literal = Some(end..self.pos);
                }
                Some(Instruction::Tag(Tag {
                    range: at..end,
                    attributes,
                    double_bindings,
                    total_bindings: double_bindings + single_bindings,
                    stripped,
                }))
            }
            RenderEvent::Directive(directive) => {
                let prepared = match &directive {
                    Directive::DoubleBrace(at) | Directive::TripleBrace(at) => {
                        let escaped = matches!(directive, Directive::DoubleBrace(_));
                        let width = if escaped { 2 } else { 3 };
                        let start = at + width;
                        let delimiter = if escaped { "}}" } else { "}}}" };
                        source[start..].find(delimiter).and_then(|offset| {
                            let end = start + offset;
                            let text = &source[start..end];
                            if text.trim().is_empty() {
                                return None;
                            }
                            let start = start + text.len() - text.trim_start().len();
                            Some((
                                Instruction::Binding {
                                    expression: start..start + text.trim().len(),
                                    escaped,
                                },
                                end + width,
                            ))
                        })
                    }
                    Directive::When(at) => When::parse(source, *at).ok().map(|when| {
                        let after = when.after;
                        (Instruction::When(when), after)
                    }),
                    Directive::Repeat(at) => {
                        Repeat::parse(source, *at).ok().map(|repeat| {
                            let after = repeat.after;
                            (Instruction::Repeat(repeat), after)
                        })
                    }
                    Directive::CustomElement(at) => {
                        Element::parse(source, *at).ok().map(|element| {
                            let after = element.after;
                            (Instruction::Element(element), after)
                        })
                    }
                };
                match prepared {
                    Some((instruction, after)) => {
                        self.pos = after;
                        Some(instruction)
                    }
                    None => {
                        self.pos = source.len();
                        Some(Instruction::Deferred(directive))
                    }
                }
            }
        }
    }
}

fn directive_body(
    source: &str,
    at: usize,
    tag: &str,
) -> Result<(Range<usize>, usize), RenderError> {
    extract_directive_content_range(source, at, tag).ok_or_else(|| {
        RenderError::UnclosedDirective {
            tag: tag.to_string(),
            context: template_context(source, at),
        }
    })
}

fn directive_expression(
    source: &str,
    at: usize,
    tag: &str,
) -> Result<String, RenderError> {
    extract_directive_expr(source, at).ok_or_else(|| RenderError::MissingValueAttribute {
        tag: tag.to_string(),
        context: template_context(source, at),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{render_entry_template_with_locator, RenderConfig};
    use std::collections::HashMap;

    fn locator(source: &str) -> Locator {
        Locator::from_templates(HashMap::from([("my-list".into(), source.into())]))
    }

    #[test]
    fn one_shot_entries_execute_without_compiling_a_plan() {
        let locator = Locator::from_templates(HashMap::new());
        let source = "<p>{{value}}</p><style>b{content:'{{value}}'}</style>";
        let root = crate::json::parse(r#"{"value":"<&"}"#).unwrap();
        let before = COMPILATIONS.with(|count| count.get());
        let html =
            crate::render_entry_with_locator(source, &root, &locator, None).unwrap();
        let chunks =
            crate::render_entry_stream_with_locator(source, &root, &locator, None)
                .unwrap();
        assert_eq!(
            chunks,
            [
                "<p>",
                "&lt;&amp;",
                "</p><style>b{content:'{{value}}'}</style>"
            ],
        );
        assert_eq!(html, chunks.concat());
        assert_eq!(COMPILATIONS.with(|count| count.get()), before);
    }

    #[test]
    fn repeated_bodies_and_definitions_are_reused_without_caching_state_or_scopes() {
        let source = r#"<f-repeat value="{{item in items}}"><f-when value="{{item.active}}"><b title="{{item.text}}">{{$index}}:{{item.text}}</b></f-when></f-repeat>"#;
        let locator = locator(source);
        let entry = "<my-list></my-list>";
        let first = render_entry_template_with_locator(
            entry,
            r#"{"items":[{"active":true,"text":"first-value"}]}"#,
            &locator,
            None,
        )
        .unwrap();
        assert!(first.contains("first-value"));
        let plan = locator.render_plan("my-list").unwrap();
        let before = COMPILATIONS.with(|count| count.get());
        let config = RenderConfig::new().with_markers_v2(true);
        let state = format!(
            r#"{{"items":[{}]}}"#,
            vec![r#"{"active":true,"text":"second-value"}"#; 100].join(","),
        );
        let second =
            render_entry_template_with_locator(entry, &state, &locator, Some(&config))
                .unwrap();
        assert!(second.contains("second-value"));
        assert!(!second.contains("first-value"));
        assert!(std::ptr::eq(plan, locator.render_plan("my-list").unwrap()));
        assert_eq!(
            COMPILATIONS.with(|count| count.get()) - before,
            0,
            "the new entry is executed without retaining a plan"
        );
        assert_eq!(
            second,
            render_entry_template_with_locator(entry, &state, &locator, Some(&config))
                .unwrap(),
        );
    }

    #[test]
    fn skipped_bodies_stay_uncompiled_and_cached_errors_keep_their_location() {
        let locator = locator(r#"<f-when value="{{show}}">{{{oops</f-when>"#);
        let entry = "<my-list></my-list>";
        render_entry_template_with_locator(entry, r#"{"show":false}"#, &locator, None)
            .unwrap();
        let plan = locator.render_plan("my-list").unwrap();
        let Instruction::When(when) = &plan.instructions[0] else {
            panic!("expected conditional")
        };
        assert!(when.body.plan.get().is_none());
        let first =
            render_entry_template_with_locator(entry, r#"{"show":true}"#, &locator, None)
                .unwrap_err();
        let second =
            render_entry_template_with_locator(entry, r#"{"show":true}"#, &locator, None)
                .unwrap_err();
        assert_eq!(first.code(), "unclosed-unescaped-binding");
        assert_eq!(first.template_name(), Some("my-list"));
        assert_eq!(first.location(), second.location());
        assert_eq!(first.to_string(), second.to_string());
        assert!(when.body.plan.get().is_some());
        render_entry_template_with_locator(entry, r#"{"show":false}"#, &locator, None)
            .unwrap();
    }

    #[test]
    fn normal_and_stream_evaluation_share_directive_and_light_dom_plans() {
        let locator = locator("<b>{{title}}</b>");
        let source = r#"<f-repeat value="{{item in items}}"><my-list title="{{item.text}}"><f-when value="{{item.active}}">{{item.text}}</f-when></my-list></f-repeat>"#;
        let root = crate::json::parse(
            r#"{"items":[{"text":"first","active":true},{"text":"second","active":false}]}"#,
        ).unwrap();
        let plan = RenderPlan::compile(source, Some(&locator));
        for mode in [false, true] {
            let config = RenderConfig::new().with_markers_v2(mode);
            let html = crate::node::render_plan(
                &plan,
                source,
                &root,
                &[],
                Some(&locator),
                None,
                true,
                &config,
            )
            .unwrap();
            let before = COMPILATIONS.with(|count| count.get());
            let chunks = crate::streaming::stream_plan(
                &plan,
                source,
                &root,
                &[],
                Some(&locator),
                None,
                true,
                &config,
            )
            .unwrap();
            assert_eq!(COMPILATIONS.with(|count| count.get()), before);
            assert_eq!(chunks.concat(), html);
            assert_eq!(
                chunks,
                crate::render_entry_stream_with_locator(
                    source,
                    &root,
                    &locator,
                    Some(&config),
                )
                .unwrap(),
            );
        }
    }

    #[test]
    fn registry_additions_and_replacements_invalidate_nested_element_classification() {
        let mut locator = locator("<new-item>{{title}}</new-item>");
        let entry = "<my-list></my-list>";
        let state = r#"{"title":"light"}"#;
        let before =
            render_entry_template_with_locator(entry, state, &locator, None).unwrap();
        assert!(
            before.contains("<new-item><!--fe:b-->light<!--fe:/b--></new-item>"),
            "{before}"
        );
        locator.add_template("new-item", "<b>first</b>");
        let added =
            render_entry_template_with_locator(entry, state, &locator, None).unwrap();
        assert!(
            added.contains("<b>first</b></template><!--fe:b-->light"),
            "{added}"
        );
        locator.add_template_with_attrs(
            "new-item",
            "<b>replacement</b>",
            &[("shadowrootmode".into(), Some("closed".into()))],
            &[("role".into(), Some("button".into()))],
        );
        let replaced =
            render_entry_template_with_locator(entry, state, &locator, None).unwrap();
        assert!(replaced
            .contains(r#"<new-item role="button"><template shadowrootmode="closed""#));
        assert!(replaced.contains("<b>replacement</b>"));
        assert!(!replaced.contains("<b>first</b>"));
    }

    #[test]
    fn concurrent_renders_share_only_immutable_template_work() {
        let locator = locator("<b>{{title}}</b>");
        std::thread::scope(|scope| {
            let handles: Vec<_> = (0..4)
                .map(|i| {
                    let locator = &locator;
                    scope.spawn(move || {
                        let state = format!(r#"{{"title":"thread-{i}"}}"#);
                        render_entry_template_with_locator(
                            "<my-list></my-list>",
                            &state,
                            locator,
                            None,
                        )
                        .unwrap()
                    })
                })
                .collect();
            for (i, handle) in handles.into_iter().enumerate() {
                let html = handle.join().unwrap();
                assert!(html.contains(&format!("thread-{i}")));
                for other in (0..4).filter(|other| *other != i) {
                    assert!(!html.contains(&format!("thread-{other}")));
                }
            }
        });
    }
}
