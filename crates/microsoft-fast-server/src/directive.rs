use crate::json::JsonValue;
use crate::context::resolve_value;
use crate::expression::evaluate;
use crate::attribute::{
    find_str, find_directive, extract_directive_expr, extract_directive_content,
    find_single_brace, skip_single_brace_expr, find_tag_end, read_tag_name,
    parse_element_attributes, find_custom_element,
};
use crate::error::{RenderError, template_context};
use crate::node::render_node;
use crate::locator::Locator;

/// A template directive found at a given byte position.
pub enum Directive {
    TripleBrace(usize),
    DoubleBrace(usize),
    When(usize),
    Repeat(usize),
    CustomElement(usize),
}

impl Directive {
    pub fn position(&self) -> usize {
        match self {
            Directive::TripleBrace(p) | Directive::DoubleBrace(p)
            | Directive::When(p) | Directive::Repeat(p)
            | Directive::CustomElement(p) => *p,
        }
    }
}

/// Find the earliest directive in `template` starting from `from`.
/// Single-brace expressions (`{…}`) are skipped so their `}` characters cannot
/// accidentally terminate a `{{…}}` binding search.
/// If `locator` is Some, also detects `CustomElement` directives for known elements.
pub fn next_directive(template: &str, from: usize, locator: Option<&Locator>) -> Option<Directive> {
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
        let custom = locator.and_then(|loc| {
            find_custom_element(template, pos, loc).map(Directive::CustomElement)
        });

        let all_refs = [triple.as_ref(), double.as_ref(), when.as_ref(), repeat.as_ref(), custom.as_ref()];
        let earliest_pos = all_refs.into_iter().flatten().map(|d| d.position()).min();

        // If a single { precedes the earliest binding, skip past it so its `}`
        // cannot be misread as the closing `}}` of a double-brace binding.
        if let (Some(single), Some(earliest)) = (find_single_brace(template, pos), earliest_pos) {
            if single < earliest {
                pos = skip_single_brace_expr(template, single);
                continue;
            }
        }

        return [triple, double, when, repeat, custom]
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
    locator: Option<&Locator>,
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
        render_node(&inner, root, loop_vars, locator)?
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
    locator: Option<&Locator>,
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
                    render_node(&inner, root, &new_vars, locator)
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

/// Render a custom element by expanding its shadow DOM template.
///
/// Output format:
///   `<original-open-tag><template shadowrootmode="open">{rendered}</template>{children}</tag-name>`
///
/// For self-closing elements (`<my-button />`), the element is emitted as non-self-closing.
pub fn render_custom_element(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: &Locator,
) -> Result<(String, usize), RenderError> {
    // Find the end of the opening tag.
    let tag_end = find_tag_end(template, at).ok_or_else(|| RenderError::UnclosedDirective {
        tag: "custom element".to_string(),
        context: template_context(template, at),
    })?;

    let tag_name = read_tag_name(template, at).unwrap_or_default();
    let open_tag_content = &template[at..tag_end];

    // Detect self-closing (`/>` possibly preceded by whitespace).
    let before_gt = open_tag_content[..open_tag_content.len() - 1].trim_end();
    let is_self_closing = before_gt.ends_with('/');

    // Build the non-self-closing version of the opening tag.
    let open_tag = if is_self_closing {
        let without_slash = before_gt[..before_gt.len() - 1].trim_end();
        format!("{}>", without_slash)
    } else {
        open_tag_content.to_string()
    };

    // Parse attributes and build child state.
    let attrs = parse_element_attributes(open_tag_content);
    let mut state_map = std::collections::HashMap::new();
    for (attr_name, value) in attrs {
        let json_val = match value {
            None => JsonValue::Bool(true), // boolean attribute
            Some(v) => {
                if v.starts_with("{{") && v.ends_with("}}") {
                    // Property binding: resolve the expression from the parent state.
                    let binding = v[2..v.len() - 2].trim();
                    resolve_value(binding, root, loop_vars).unwrap_or(JsonValue::Null)
                } else if v == "true" {
                    JsonValue::Bool(true)
                } else if v == "false" {
                    JsonValue::Bool(false)
                } else if let Ok(n) = v.parse::<f64>() {
                    JsonValue::Number(n)
                } else {
                    JsonValue::String(v)
                }
            }
        };
        state_map.insert(attr_name, json_val);
    }
    let child_root = JsonValue::Object(state_map);

    // Render the element's shadow DOM template with the child state.
    let element_template = locator.get_template(&tag_name).unwrap_or_default();
    let rendered = render_node(element_template, &child_root, &[], Some(locator))?;

    // Extract the light DOM children (for non-self-closing elements).
    let (children, after) = if is_self_closing {
        (String::new(), tag_end)
    } else {
        extract_directive_content(template, at, &tag_name)
            .ok_or_else(|| RenderError::UnclosedDirective {
                tag: tag_name.clone(),
                context: template_context(template, at),
            })?
    };

    let output = format!(
        "{}<template shadowrootmode=\"open\">{}</template>{}</{}>",
        open_tag, rendered, children, tag_name
    );

    Ok((output, after))
}
