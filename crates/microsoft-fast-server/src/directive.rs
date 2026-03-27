use crate::json::JsonValue;
use crate::context::resolve_value;
use crate::expression::evaluate;
use crate::attribute::{
    find_str, find_directive, extract_directive_expr, extract_directive_content,
    find_single_brace, skip_single_brace_expr,
};
use crate::error::{RenderError, template_context};
use crate::node::render_node;

/// A template directive found at a given byte position.
pub enum Directive {
    TripleBrace(usize),
    DoubleBrace(usize),
    When(usize),
    Repeat(usize),
}

impl Directive {
    pub fn position(&self) -> usize {
        match self {
            Directive::TripleBrace(p) | Directive::DoubleBrace(p)
            | Directive::When(p) | Directive::Repeat(p) => *p,
        }
    }
}

/// Find the earliest directive in `template` starting from `from`.
/// Single-brace expressions (`{…}`) are skipped so their `}` characters cannot
/// accidentally terminate a `{{…}}` binding search.
pub fn next_directive(template: &str, from: usize) -> Option<Directive> {
    let mut pos = from;
    loop {
        let triple = find_str(template, "{{{", pos).map(Directive::TripleBrace);
        // Suppress `{{` when it coincides with the start of a `{{{`
        let double = find_str(template, "{{", pos).and_then(|d| {
            let shadowed = triple.as_ref().map(|t| t.position() == d).unwrap_or(false);
            if shadowed { None } else { Some(Directive::DoubleBrace(d)) }
        });
        let when   = find_directive(template, "<f-when",   pos).map(Directive::When);
        let repeat = find_directive(template, "<f-repeat", pos).map(Directive::Repeat);

        let earliest_pos = [triple.as_ref(), double.as_ref(), when.as_ref(), repeat.as_ref()]
            .into_iter()
            .flatten()
            .map(|d| d.position())
            .min();

        // If a single { precedes the earliest binding, skip past it so its `}`
        // cannot be misread as the closing `}}` of a double-brace binding.
        if let (Some(single), Some(earliest)) = (find_single_brace(template, pos), earliest_pos) {
            if single < earliest {
                pos = skip_single_brace_expr(template, single);
                continue;
            }
        }

        return [triple, double, when, repeat]
            .into_iter()
            .flatten()
            .min_by_key(|d| d.position());
    }
}

/// Render an `<f-when>` directive.
pub fn render_when(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
) -> Result<(String, usize), RenderError> {
    let (inner, after) = extract_directive_content(template, at, "f-when")
        .ok_or_else(|| RenderError::UnclosedDirective {
            tag: "f-when".to_string(),
            context: template_context(template, at),
        })?;
    let expr = extract_directive_expr(template, at)
        .ok_or_else(|| RenderError::MissingValueAttribute {
            tag: "f-when".to_string(),
            context: template_context(template, at),
        })?;
    let output = if evaluate(&expr, root, loop_vars) {
        render_node(&inner, root, loop_vars)?
    } else {
        String::new()
    };
    Ok((output, after))
}

/// Render an `<f-repeat>` directive.
pub fn render_repeat(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
) -> Result<(String, usize), RenderError> {
    let (inner, after) = extract_directive_content(template, at, "f-repeat")
        .ok_or_else(|| RenderError::UnclosedDirective {
            tag: "f-repeat".to_string(),
            context: template_context(template, at),
        })?;
    let expr = extract_directive_expr(template, at)
        .ok_or_else(|| RenderError::MissingValueAttribute {
            tag: "f-repeat".to_string(),
            context: template_context(template, at),
        })?;
    let (var_name, list_expr) = parse_repeat_expr(&expr)
        .ok_or_else(|| RenderError::InvalidRepeatExpression {
            expr: expr.clone(),
            context: template_context(template, at),
        })?;
    match resolve_value(&list_expr, root, loop_vars) {
        None => Err(RenderError::MissingState {
            binding: list_expr,
            context: template_context(template, at),
        }),
        Some(JsonValue::Array(items)) => {
            let output = items
                .iter()
                .map(|item| {
                    let mut new_vars = loop_vars.to_vec();
                    new_vars.push((var_name.clone(), item.clone()));
                    render_node(&inner, root, &new_vars)
                })
                .collect::<Result<String, _>>()?;
            Ok((output, after))
        }
        Some(_) => Err(RenderError::NotAnArray {
            binding: list_expr,
            context: template_context(template, at),
        }),
    }
}

/// Parse `"item in list"` into `("item", "list")`.
fn parse_repeat_expr(expr: &str) -> Option<(String, String)> {
    let parts: Vec<&str> = expr.trim().splitn(3, ' ').collect();
    if parts.len() == 3 && parts[1] == "in" && !parts[0].is_empty() && !parts[2].is_empty() {
        Some((parts[0].to_string(), parts[2].to_string()))
    } else {
        None
    }
}
