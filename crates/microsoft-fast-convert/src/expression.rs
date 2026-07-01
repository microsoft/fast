use crate::error::{template_context, ConvertError};

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct RepeatScope {
    pub(crate) alias: String,
}

pub(crate) fn parse_repeat_expression(
    expr: &str,
    context: &str,
    at: usize,
) -> Result<(String, String), ConvertError> {
    let parts: Vec<&str> = expr.split_whitespace().collect();
    if parts.len() != 3 || parts[1] != "in" || !is_identifier(parts[0]) || !is_path(parts[2]) {
        return Err(ConvertError::InvalidRepeatExpression {
            expr: expr.to_string(),
            context: template_context(context, at),
        });
    }

    Ok((parts[0].to_string(), parts[2].to_string()))
}

pub(crate) fn expression_to_arrow(
    expr: &str,
    scopes: &[RepeatScope],
    context: &str,
    at: usize,
) -> Result<String, ConvertError> {
    Ok(format!(
        "x => {}",
        expression_to_js(expr, scopes, context, at)?
    ))
}

pub(crate) fn event_handler_to_arrow(
    value: &str,
    scopes: &[RepeatScope],
    context: &str,
    at: usize,
) -> Result<String, ConvertError> {
    let expr = value.trim();
    let open = expr
        .find('(')
        .ok_or_else(|| ConvertError::UnsupportedEventHandler {
            value: value.to_string(),
            reason: "expected a handler call such as 'handleClick($e)'".to_string(),
            context: template_context(context, at),
        })?;
    if !expr.ends_with(')') {
        return Err(ConvertError::UnsupportedEventHandler {
            value: value.to_string(),
            reason: "event handler calls must end with ')'".to_string(),
            context: template_context(context, at),
        });
    }

    let path = expr[..open].trim();
    if !is_path(path) {
        return Err(ConvertError::UnsupportedEventHandler {
            value: value.to_string(),
            reason: "handler name must be an identifier or dotted path".to_string(),
            context: template_context(context, at),
        });
    }

    let args = &expr[open + 1..expr.len() - 1];
    let converted_args = split_arguments(args)
        .into_iter()
        .map(|arg| event_argument_to_js(arg, scopes, context, at))
        .collect::<Result<Vec<_>, _>>()?;

    Ok(format!(
        "(x, c) => {}({})",
        event_handler_target(path, scopes, context, at)?,
        converted_args.join(", ")
    ))
}

fn expression_to_js(
    expr: &str,
    scopes: &[RepeatScope],
    context: &str,
    at: usize,
) -> Result<String, ConvertError> {
    let expr = expr.trim();
    if expr.is_empty() {
        return Err(ConvertError::EmptyBinding {
            context: template_context(context, at),
        });
    }

    reject_known_unsupported(expr, context, at)?;

    if let Some(inner) = strip_outer_parens(expr) {
        return Ok(format!(
            "({})",
            expression_to_js(inner, scopes, context, at)?
        ));
    }

    if let Some((idx, op)) = find_top_level_operator(expr, &["||"]) {
        return binary_to_js(expr, idx, op, scopes, context, at);
    }
    if let Some((idx, op)) = find_top_level_operator(expr, &["&&"]) {
        return binary_to_js(expr, idx, op, scopes, context, at);
    }
    if let Some((idx, op)) = find_top_level_operator(expr, &[">=", "<=", "==", "!=", ">", "<"]) {
        return binary_to_js(expr, idx, op, scopes, context, at);
    }

    if let Some(inner) = expr.strip_prefix('!') {
        let converted = expression_to_js(inner, scopes, context, at)?;
        return if converted.contains(' ') {
            Ok(format!("!({converted})"))
        } else {
            Ok(format!("!{converted}"))
        };
    }

    if is_string_literal(expr)
        || is_number_literal(expr)
        || matches!(expr, "true" | "false" | "null")
    {
        return Ok(expr.to_string());
    }

    if is_path(expr) {
        return path_to_js(expr, scopes, context, at, false);
    }

    let reason = if expr.contains('(') || expr.contains(')') {
        "function calls and unsupported parenthesized expressions are not supported"
    } else {
        "expected an identifier, dotted path, literal, or supported operator expression"
    };
    Err(ConvertError::UnsupportedExpression {
        expr: expr.to_string(),
        reason: reason.to_string(),
        context: template_context(context, at),
    })
}

fn binary_to_js(
    expr: &str,
    idx: usize,
    op: &str,
    scopes: &[RepeatScope],
    context: &str,
    at: usize,
) -> Result<String, ConvertError> {
    let left = expression_to_js(&expr[..idx], scopes, context, at)?;
    let right = expression_to_js(&expr[idx + op.len()..], scopes, context, at)?;
    Ok(format!("{left} {op} {right}"))
}

fn reject_known_unsupported(expr: &str, context: &str, at: usize) -> Result<(), ConvertError> {
    let reason = if expr.contains("?.") {
        Some("optional chaining is not supported")
    } else if expr.contains('[') || expr.contains(']') {
        Some("bracket access is not supported")
    } else if expr.contains("=>") {
        Some("arrow functions are not supported")
    } else {
        None
    };

    if let Some(reason) = reason {
        return Err(ConvertError::UnsupportedExpression {
            expr: expr.to_string(),
            reason: reason.to_string(),
            context: template_context(context, at),
        });
    }

    Ok(())
}

fn path_to_js(
    path: &str,
    scopes: &[RepeatScope],
    context: &str,
    at: usize,
    allow_root_from_repeat: bool,
) -> Result<String, ConvertError> {
    let mut parts = path.split('.');
    let head = parts.next().unwrap_or_default();
    let rest = parts.collect::<Vec<_>>().join(".");

    if let Some(current) = scopes.last() {
        if head == current.alias {
            return if rest.is_empty() {
                Ok("x".to_string())
            } else {
                Ok(format!("x.{rest}"))
            };
        }

        if scopes[..scopes.len() - 1]
            .iter()
            .any(|scope| scope.alias == head)
        {
            return Err(ConvertError::UnsupportedExpression {
                expr: path.to_string(),
                reason: "parent repeat aliases are not supported in bindings".to_string(),
                context: template_context(context, at),
            });
        }

        if allow_root_from_repeat {
            return Ok(format!("{}.{}", repeat_parent_context(scopes.len()), path));
        }

        return Err(ConvertError::UnsupportedExpression {
            expr: path.to_string(),
            reason: "root access from inside f-repeat is not supported for bindings".to_string(),
            context: template_context(context, at),
        });
    }

    Ok(format!("x.{path}"))
}

fn event_handler_target(
    path: &str,
    scopes: &[RepeatScope],
    context: &str,
    at: usize,
) -> Result<String, ConvertError> {
    let mut parts = path.split('.');
    let head = parts.next().unwrap_or_default();
    let rest = parts.collect::<Vec<_>>().join(".");

    if let Some(current) = scopes.last() {
        if head == current.alias {
            return if rest.is_empty() {
                Ok("x".to_string())
            } else {
                Ok(format!("x.{rest}"))
            };
        }

        if scopes[..scopes.len() - 1]
            .iter()
            .any(|scope| scope.alias == head)
        {
            return Err(ConvertError::UnsupportedEventHandler {
                value: path.to_string(),
                reason: "parent repeat aliases are not supported in event handler targets"
                    .to_string(),
                context: template_context(context, at),
            });
        }

        return Ok(format!("{}.{}", repeat_parent_context(scopes.len()), path));
    }

    Ok(format!("x.{path}"))
}

fn event_argument_to_js(
    arg: &str,
    scopes: &[RepeatScope],
    context: &str,
    at: usize,
) -> Result<String, ConvertError> {
    let arg = arg.trim();
    match arg {
        "" => Ok(String::new()),
        "$e" => Ok("c.event".to_string()),
        "$c" => Ok("c".to_string()),
        _ if is_path(arg) && !scopes.is_empty() => path_to_js(arg, scopes, context, at, true),
        _ => expression_to_js(arg, scopes, context, at),
    }
}

fn repeat_parent_context(depth: usize) -> String {
    if depth == 0 {
        return "x".to_string();
    }

    let mut out = String::from("c.");
    for _ in 1..depth {
        out.push_str("parentContext.");
    }
    out.push_str("parent");
    out
}

fn split_arguments(args: &str) -> Vec<&str> {
    let mut result = Vec::new();
    let mut start = 0usize;
    let mut depth = 0usize;
    let mut quote: Option<u8> = None;
    let bytes = args.as_bytes();
    let mut i = 0usize;

    while i < bytes.len() {
        match bytes[i] {
            c if quote == Some(c) => quote = None,
            b'"' | b'\'' if quote.is_none() => quote = Some(bytes[i]),
            b'(' if quote.is_none() => depth += 1,
            b')' if quote.is_none() && depth > 0 => depth -= 1,
            b',' if quote.is_none() && depth == 0 => {
                result.push(args[start..i].trim());
                start = i + 1;
            }
            _ => {}
        }
        i += 1;
    }

    let tail = args[start..].trim();
    if !tail.is_empty() {
        result.push(tail);
    }
    result
}

fn find_top_level_operator<'a>(expr: &str, ops: &[&'a str]) -> Option<(usize, &'a str)> {
    let bytes = expr.as_bytes();
    let mut depth = 0usize;
    let mut quote: Option<u8> = None;
    let mut i = 0usize;

    while i < bytes.len() {
        match bytes[i] {
            c if quote == Some(c) => quote = None,
            b'"' | b'\'' if quote.is_none() => quote = Some(bytes[i]),
            b'(' if quote.is_none() => depth += 1,
            b')' if quote.is_none() && depth > 0 => depth -= 1,
            _ if quote.is_none() && depth == 0 => {
                for op in ops {
                    if expr[i..].starts_with(op) {
                        return Some((i, *op));
                    }
                }
            }
            _ => {}
        }
        i += 1;
    }

    None
}

fn strip_outer_parens(expr: &str) -> Option<&str> {
    if !expr.starts_with('(') || !expr.ends_with(')') {
        return None;
    }

    let bytes = expr.as_bytes();
    let mut depth = 0usize;
    let mut quote: Option<u8> = None;

    for (i, byte) in bytes.iter().enumerate() {
        match *byte {
            c if quote == Some(c) => quote = None,
            b'"' | b'\'' if quote.is_none() => quote = Some(*byte),
            b'(' if quote.is_none() => depth += 1,
            b')' if quote.is_none() => {
                depth -= 1;
                if depth == 0 && i != bytes.len() - 1 {
                    return None;
                }
            }
            _ => {}
        }
    }

    if depth == 0 {
        Some(&expr[1..expr.len() - 1])
    } else {
        None
    }
}

fn is_string_literal(expr: &str) -> bool {
    if expr.len() < 2 {
        return false;
    }
    let bytes = expr.as_bytes();
    let quote = bytes[0];
    if quote != b'"' && quote != b'\'' || bytes[bytes.len() - 1] != quote {
        return false;
    }

    let mut escaped = false;
    for byte in &bytes[1..bytes.len() - 1] {
        if escaped {
            escaped = false;
        } else if *byte == b'\\' {
            escaped = true;
        } else if *byte == quote {
            return false;
        }
    }

    !escaped
}

fn is_number_literal(expr: &str) -> bool {
    if expr.is_empty() || !expr.chars().any(|ch| ch.is_ascii_digit()) {
        return false;
    }
    expr.parse::<f64>().is_ok()
        && expr
            .chars()
            .all(|ch| ch.is_ascii_digit() || matches!(ch, '.' | '-' | '+' | 'e' | 'E'))
}

pub(crate) fn is_path(expr: &str) -> bool {
    let mut parts = expr.split('.');
    let Some(first) = parts.next() else {
        return false;
    };
    !first.is_empty()
        && is_identifier(first)
        && parts.all(|part| !part.is_empty() && is_identifier(part))
}

fn is_identifier(segment: &str) -> bool {
    let mut chars = segment.chars();
    let Some(first) = chars.next() else {
        return false;
    };
    (first == '_' || first == '$' || first.is_ascii_alphabetic())
        && chars.all(|ch| ch == '_' || ch == '$' || ch.is_ascii_alphanumeric())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parent_context_matches_declarative_repeat_chain() {
        assert_eq!(repeat_parent_context(1), "c.parent");
        assert_eq!(repeat_parent_context(2), "c.parentContext.parent");
        assert_eq!(
            repeat_parent_context(3),
            "c.parentContext.parentContext.parent"
        );
    }
}
