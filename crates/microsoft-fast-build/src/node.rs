use std::borrow::{Borrow, Cow};

use crate::attribute::{inject_hydration_marker, strip_client_only_attrs};
use crate::config::RenderConfig;
use crate::content::{push_html_escaped, render_double_brace, render_triple_brace};
use crate::context::{resolve_value, LoopVars, State};
use crate::directive::{render_custom_element, render_repeat, render_when, Directive};
use crate::error::RenderError;
use crate::hydration::HydrationScope;
use crate::json::JsonValue;
use crate::locator::Locator;
use crate::plan::{Instruction, InstructionCursor, RenderPlan, Tag};

pub fn render_node(
    template: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<String, RenderError> {
    render_instructions(
        InstructionCursor::new(template, locator),
        template,
        root,
        loop_vars,
        locator,
        hydration,
        is_entry,
        config,
    )
}

pub(crate) fn render_plan(
    plan: &RenderPlan,
    template: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<String, RenderError> {
    render_instructions(
        &plan.instructions,
        template,
        root,
        loop_vars,
        locator,
        hydration,
        is_entry,
        config,
    )
}

fn render_instructions<I>(
    instructions: I,
    template: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    mut hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<String, RenderError>
where
    I: IntoIterator,
    I::Item: Borrow<Instruction>,
{
    let mut result = String::new();
    for instruction in instructions {
        let instruction = instruction.borrow();
        let scope = hydration.as_deref_mut();
        let directive = match instruction {
            Instruction::Literal(range) => {
                result.push_str(&template[range.clone()]);
                continue;
            }
            Instruction::Tag(tag) => {
                render_tag(tag, template, root, loop_vars, scope, &mut result);
                continue;
            }
            Instruction::Binding {
                expression,
                escaped,
            } => {
                append_binding(
                    &mut result,
                    &template[expression.clone()],
                    *escaped,
                    root,
                    loop_vars,
                    scope,
                );
                continue;
            }
            Instruction::When(when) => Directive::When(when.at),
            Instruction::Repeat(repeat) => Directive::Repeat(repeat.at),
            Instruction::Element(element) => Directive::CustomElement(element.at),
            Instruction::Deferred(directive) => *directive,
        };
        let (chunk, _) = process_directive(
            directive,
            instruction,
            template,
            root,
            loop_vars,
            locator,
            scope,
            is_entry,
            config,
        )?;
        result.push_str(&chunk);
    }
    Ok(result)
}

pub(crate) fn render_tag(
    tag: &Tag,
    template: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    hydration: Option<&mut HydrationScope>,
    result: &mut String,
) {
    match hydration {
        Some(scope) if tag.total_bindings > 0 => {
            let resolved = tag.attributes.resolve(root, loop_vars);
            let stripped = strip_client_only_attrs(&resolved);
            let marker = scope.attribute_marker(tag.total_bindings);
            result.push_str(&inject_hydration_marker(&stripped, &marker));
        }
        Some(_) => result.push_str(&tag.stripped),
        None if tag.double_bindings > 0 => {
            result.push_str(&tag.attributes.resolve(root, loop_vars))
        }
        None => result.push_str(&template[tag.range.clone()]),
    }
}

pub(crate) fn render_binding(
    expression: &str,
    escaped: bool,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    hydration: Option<&mut HydrationScope>,
) -> String {
    let mut out = String::new();
    append_binding(&mut out, expression, escaped, root, loop_vars, hydration);
    out
}

fn append_binding(
    out: &mut String,
    expression: &str,
    escaped: bool,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    mut hydration: Option<&mut HydrationScope>,
) {
    let index = hydration.as_deref_mut().map(|scope| scope.next_binding());
    if let (Some(scope), Some(index)) = (&hydration, index) {
        scope.push_content_start(out, index);
    }
    if let Some(value) = resolve_value(expression, root, loop_vars) {
        let text = match value.as_ref() {
            JsonValue::String(value) => Cow::Borrowed(value.as_str()),
            _ => Cow::Owned(value.to_display_string()),
        };
        if escaped {
            push_html_escaped(out, &text);
        } else {
            out.push_str(&text);
        }
    }
    if let (Some(scope), Some(index)) = (&hydration, index) {
        scope.push_content_end(out, index);
    }
}

fn process_directive(
    directive: Directive,
    prepared: &Instruction,
    template: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<(String, usize), RenderError> {
    match directive {
        Directive::TripleBrace(p) => {
            let (out, end) = render_triple_brace(template, p, root, loop_vars)?;
            Ok((wrap_content_binding(out, hydration), end))
        }
        Directive::DoubleBrace(p) => {
            let (out, end) = render_double_brace(template, p, root, loop_vars)?;
            Ok((wrap_content_binding(out, hydration), end))
        }
        Directive::When(p) => {
            let when = match prepared {
                Instruction::When(when) => Some(when),
                _ => None,
            };
            render_when(
                template, p, root, loop_vars, locator, hydration, config, when,
            )
        }
        Directive::Repeat(p) => {
            let repeat = match prepared {
                Instruction::Repeat(repeat) => Some(repeat),
                _ => None,
            };
            render_repeat(
                template, p, root, loop_vars, locator, hydration, config, repeat,
            )
        }
        Directive::CustomElement(p) => {
            let element = match prepared {
                Instruction::Element(element) => Some(element),
                _ => None,
            };
            render_custom_element(
                template,
                p,
                root,
                loop_vars,
                locator.expect("locator is required for a custom element"),
                hydration,
                is_entry,
                config,
                element,
            )
        }
    }
}

pub(crate) fn wrap_content_binding(
    out: String,
    hydration: Option<&mut HydrationScope>,
) -> String {
    match hydration {
        None => out,
        Some(scope) => {
            let index = scope.next_binding();
            format!(
                "{}{}{}",
                scope.content_start_marker(index),
                out,
                scope.content_end_marker(index)
            )
        }
    }
}
