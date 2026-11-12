use std::ops::Range;

use crate::attribute::{
    count_attribute_bindings, extract_directive_content_range, extract_directive_expr,
    find_tag_end, parse_element_attributes, read_tag_name, style_element_end, AttributePlan,
};
use crate::directive::{next_event, parse_repeat_expr, Directive, RenderEvent};
use crate::error::{template_context, RenderError};
use crate::locator::Locator;

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
    // The emitter reconstructs the source diagnostic before producing a module.
    Deferred(Directive),
}

#[derive(Debug)]
pub(crate) struct Body {
    pub(crate) range: Range<usize>,
}

impl Body {
    fn new(range: Range<usize>) -> Self {
        Self { range }
    }
}

#[derive(Debug)]
pub(crate) struct Tag {
    pub(crate) range: Range<usize>,
    pub(crate) double_bindings: usize,
    pub(crate) total_bindings: usize,
    pub(crate) stripped: String,
}

impl Tag {
    fn parse(source: &str, range: Range<usize>) -> Self {
        let attributes = AttributePlan::new(&source[range.clone()]).expect("scanner found a tag");
        let (double_bindings, single_bindings) = attributes.binding_counts();
        let stripped = if double_bindings + single_bindings == 0 {
            attributes.stripped()
        } else {
            String::new()
        };
        Self {
            range,
            double_bindings,
            total_bindings: double_bindings + single_bindings,
            stripped,
        }
    }
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
        let (variable, collection) =
            parse_repeat_expr(&expression).ok_or_else(|| RenderError::InvalidRepeatExpression {
                expr: expression,
                context: template_context(source, at),
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
    pub(crate) opening: Tag,
    pub(crate) unclosed_children: Option<Body>,
    pub(crate) after: usize,
}

impl Element {
    pub(crate) fn parse(source: &str, at: usize) -> Result<Self, RenderError> {
        let tag_end = find_tag_end(source, at).ok_or_else(|| RenderError::UnclosedDirective {
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
            opening: Tag::parse(source, at..tag_end),
            unclosed_children: content.is_none().then(|| Body::new(tag_end..after)),
            children: content.map(|(range, _)| Body::new(range)),
            after,
        })
    }
}

impl RenderPlan {
    pub(crate) fn compile(source: &str, locator: Option<&Locator>) -> Self {
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
                self.pos = style_element_end(source, at).unwrap_or(end);
                if end < self.pos {
                    self.literal = Some(end..self.pos);
                }
                Some(Instruction::Tag(Tag::parse(source, at..end)))
            }
            RenderEvent::Directive(directive) => {
                let parsed = match &directive {
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
                    Directive::Repeat(at) => Repeat::parse(source, *at).ok().map(|repeat| {
                        let after = repeat.after;
                        (Instruction::Repeat(repeat), after)
                    }),
                    Directive::CustomElement(at) => {
                        Element::parse(source, *at).ok().map(|element| {
                            let after = element.after;
                            (Instruction::Element(element), after)
                        })
                    }
                };
                match parsed {
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
    extract_directive_content_range(source, at, tag).ok_or_else(|| RenderError::UnclosedDirective {
        tag: tag.to_string(),
        context: template_context(source, at),
    })
}

fn directive_expression(source: &str, at: usize, tag: &str) -> Result<String, RenderError> {
    extract_directive_expr(source, at).ok_or_else(|| RenderError::MissingValueAttribute {
        tag: tag.to_string(),
        context: template_context(source, at),
    })
}
