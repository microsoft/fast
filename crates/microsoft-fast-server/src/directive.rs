use crate::json::JsonValue;
use crate::context::resolve_value;
use crate::expression::evaluate;
use crate::attribute::{find_str, find_directive, extract_directive_expr, extract_directive_content};
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
pub fn next_directive(template: &str, from: usize) -> Option<Directive> {
    let triple = find_str(template, "{{{", from).map(Directive::TripleBrace);
    // Suppress `{{` when it's the start of a `{{{`
    let double = find_str(template, "{{", from).and_then(|d| {
        let shadowed = triple.as_ref().map(|t| t.position() == d).unwrap_or(false);
        if shadowed { None } else { Some(Directive::DoubleBrace(d)) }
    });
    let when = find_directive(template, "<f-when", from).map(Directive::When);
    let repeat = find_directive(template, "<f-repeat", from).map(Directive::Repeat);

    [triple, double, when, repeat]
        .into_iter()
        .flatten()
        .min_by_key(|d| d.position())
}

/// Render an `<f-when>` directive.
pub fn render_when(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
) -> (String, usize) {
    let Some((inner, after)) = extract_directive_content(template, at, "f-when") else {
        return ("<f-when".to_string(), at + 7);
    };
    let Some(expr) = extract_directive_expr(template, at) else {
        return (String::new(), after);
    };
    let output = if evaluate(&expr, root, loop_vars) {
        render_node(&inner, root, loop_vars)
    } else {
        String::new()
    };
    (output, after)
}

/// Render an `<f-repeat>` directive.
pub fn render_repeat(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
) -> (String, usize) {
    let Some((inner, after)) = extract_directive_content(template, at, "f-repeat") else {
        return ("<f-repeat".to_string(), at + 9);
    };
    let Some(expr) = extract_directive_expr(template, at) else {
        return (String::new(), after);
    };
    let Some((var_name, list_expr)) = parse_repeat_expr(&expr) else {
        return (String::new(), after);
    };
    let Some(JsonValue::Array(items)) = resolve_value(&list_expr, root, loop_vars) else {
        return (String::new(), after);
    };
    let output = items
        .iter()
        .map(|item| {
            let mut new_vars = loop_vars.to_vec();
            new_vars.push((var_name.clone(), item.clone()));
            render_node(&inner, root, &new_vars)
        })
        .collect();
    (output, after)
}

/// Parse `"item in list"` into `("item", "list")`.
fn parse_repeat_expr(expr: &str) -> Option<(String, String)> {
    let parts: Vec<&str> = expr.trim().splitn(3, ' ').collect();
    if parts.len() == 3 && parts[1] == "in" {
        Some((parts[0].to_string(), parts[2].to_string()))
    } else {
        None
    }
}
