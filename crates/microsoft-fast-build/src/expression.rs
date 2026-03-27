use crate::json::JsonValue;
use crate::context::resolve_value;

pub fn evaluate(expr: &str, root: &JsonValue, loop_vars: &[(String, JsonValue)]) -> bool {
    let expr = expr.trim();
    // OR (lowest precedence)
    if let Some(idx) = find_binary_op(expr, "||") {
        let left = evaluate(&expr[..idx], root, loop_vars);
        let right = evaluate(&expr[idx + 2..], root, loop_vars);
        return left || right;
    }
    // AND
    if let Some(idx) = find_binary_op(expr, "&&") {
        let left = evaluate(&expr[..idx], root, loop_vars);
        let right = evaluate(&expr[idx + 2..], root, loop_vars);
        return left && right;
    }
    // Comparison operators (multi-char before single-char)
    for op in &[">=", "<=", "==", "!=", ">", "<"] {
        if let Some(idx) = find_comparison_op(expr, op) {
            let lhs_str = expr[..idx].trim();
            let rhs_str = expr[idx + op.len()..].trim();
            let lhs = resolve_value(lhs_str, root, loop_vars);
            let rhs = parse_or_resolve_rhs(rhs_str, root, loop_vars);
            return compare_values(&lhs, &rhs, op);
        }
    }
    // Unary NOT
    if expr.starts_with('!') {
        let inner = expr[1..].trim();
        let val = resolve_value(inner, root, loop_vars);
        return !val.map(|v| v.is_truthy()).unwrap_or(false);
    }
    // Truthy check
    let val = resolve_value(expr, root, loop_vars);
    val.map(|v| v.is_truthy()).unwrap_or(false)
}

fn find_binary_op(expr: &str, op: &str) -> Option<usize> {
    let bytes = expr.as_bytes();
    let op_bytes = op.as_bytes();
    let mut i = 0;
    while i + op_bytes.len() <= bytes.len() {
        if &bytes[i..i + op_bytes.len()] == op_bytes {
            return Some(i);
        }
        i += 1;
    }
    None
}

fn find_comparison_op(expr: &str, op: &str) -> Option<usize> {
    let bytes = expr.as_bytes();
    let op_bytes = op.as_bytes();
    let mut i = 0;
    while i + op_bytes.len() <= bytes.len() {
        if &bytes[i..i + op_bytes.len()] == op_bytes {
            // For single-char < or >, make sure next char isn't = (to avoid matching part of <= or >=)
            if op_bytes.len() == 1 && (op_bytes[0] == b'>' || op_bytes[0] == b'<') {
                if bytes.get(i + 1) == Some(&b'=') {
                    i += 1;
                    continue;
                }
            }
            return Some(i);
        }
        i += 1;
    }
    None
}

fn parse_or_resolve_rhs(rhs: &str, root: &JsonValue, loop_vars: &[(String, JsonValue)]) -> Option<JsonValue> {
    let rhs = rhs.trim();
    // Quoted string
    if (rhs.starts_with('\'') && rhs.ends_with('\'')) || (rhs.starts_with('"') && rhs.ends_with('"')) {
        return Some(JsonValue::String(rhs[1..rhs.len()-1].to_string()));
    }
    // Boolean literals
    if rhs == "true" { return Some(JsonValue::Bool(true)); }
    if rhs == "false" { return Some(JsonValue::Bool(false)); }
    if rhs == "null" { return Some(JsonValue::Null); }
    // Number
    if let Ok(n) = rhs.parse::<f64>() {
        return Some(JsonValue::Number(n));
    }
    // State reference
    resolve_value(rhs, root, loop_vars)
}

fn compare_values(lhs: &Option<JsonValue>, rhs: &Option<JsonValue>, op: &str) -> bool {
    match (lhs, rhs) {
        (Some(l), Some(r)) => {
            match op {
                "==" => values_equal(l, r),
                "!=" => !values_equal(l, r),
                ">" => compare_numeric(l, r) > 0,
                "<" => compare_numeric(l, r) < 0,
                ">=" => compare_numeric(l, r) >= 0,
                "<=" => compare_numeric(l, r) <= 0,
                _ => false,
            }
        }
        (None, None) => op == "==" || op == ">=" || op == "<=",
        _ => op == "!=",
    }
}

fn values_equal(a: &JsonValue, b: &JsonValue) -> bool {
    match (a, b) {
        (JsonValue::Null, JsonValue::Null) => true,
        (JsonValue::Bool(a), JsonValue::Bool(b)) => a == b,
        (JsonValue::Number(a), JsonValue::Number(b)) => a == b,
        (JsonValue::String(a), JsonValue::String(b)) => a == b,
        (JsonValue::Bool(b), JsonValue::String(s)) => b.to_string() == *s,
        (JsonValue::String(s), JsonValue::Bool(b)) => *s == b.to_string(),
        (JsonValue::Number(n), JsonValue::String(s)) => format_number(*n) == *s,
        (JsonValue::String(s), JsonValue::Number(n)) => *s == format_number(*n),
        _ => false,
    }
}

fn format_number(n: f64) -> String {
    if n == n.floor() && n.abs() < 1e15 {
        format!("{}", n as i64)
    } else {
        format!("{}", n)
    }
}

fn compare_numeric(a: &JsonValue, b: &JsonValue) -> i32 {
    let an = to_number(a);
    let bn = to_number(b);
    match (an, bn) {
        (Some(a), Some(b)) => {
            if a < b { -1 } else if a > b { 1 } else { 0 }
        }
        _ => {
            let as_ = a.to_display_string();
            let bs = b.to_display_string();
            match as_.cmp(&bs) {
                std::cmp::Ordering::Less => -1,
                std::cmp::Ordering::Equal => 0,
                std::cmp::Ordering::Greater => 1,
            }
        }
    }
}

fn to_number(v: &JsonValue) -> Option<f64> {
    match v {
        JsonValue::Number(n) => Some(*n),
        JsonValue::String(s) => s.parse().ok(),
        JsonValue::Bool(b) => Some(if *b { 1.0 } else { 0.0 }),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::json::parse;

    fn state(s: &str) -> JsonValue {
        parse(s).unwrap()
    }

    #[test]
    fn test_truthy_identifier() {
        let root = state(r#"{"show": true}"#);
        assert!(evaluate("show", &root, &[]));
    }

    #[test]
    fn test_falsy_identifier() {
        let root = state(r#"{"show": false}"#);
        assert!(!evaluate("show", &root, &[]));
    }

    #[test]
    fn test_negation() {
        let root = state(r#"{"hidden": false}"#);
        assert!(evaluate("!hidden", &root, &[]));
    }

    #[test]
    fn test_equality_string() {
        let root = state(r#"{"status": "active"}"#);
        assert!(evaluate("status == 'active'", &root, &[]));
        assert!(!evaluate("status == 'inactive'", &root, &[]));
    }

    #[test]
    fn test_equality_bool() {
        let root = state(r#"{"flag": true}"#);
        assert!(evaluate("flag == true", &root, &[]));
        assert!(!evaluate("flag == false", &root, &[]));
    }

    #[test]
    fn test_or() {
        let root = state(r#"{"a": false, "b": true}"#);
        assert!(evaluate("a || b", &root, &[]));
    }

    #[test]
    fn test_and() {
        let root = state(r#"{"a": true, "b": true}"#);
        assert!(evaluate("a && b", &root, &[]));
        let root2 = state(r#"{"a": true, "b": false}"#);
        assert!(!evaluate("a && b", &root2, &[]));
    }

    #[test]
    fn test_numeric_comparison() {
        let root = state(r#"{"count": 5}"#);
        assert!(evaluate("count > 3", &root, &[]));
        assert!(!evaluate("count < 3", &root, &[]));
    }

    #[test]
    fn test_chained_and() {
        let root = state(r#"{"isAdmin": true, "isGuest": false, "status": "active"}"#);
        assert!(evaluate("isAdmin && !isGuest && status == 'active'", &root, &[]));
    }

    #[test]
    fn test_chained_and_first_false() {
        let root = state(r#"{"isAdmin": false, "isGuest": false, "status": "active"}"#);
        assert!(!evaluate("isAdmin && !isGuest && status == 'active'", &root, &[]));
    }

    #[test]
    fn test_chained_and_middle_false() {
        let root = state(r#"{"isAdmin": true, "isGuest": true, "status": "active"}"#);
        assert!(!evaluate("isAdmin && !isGuest && status == 'active'", &root, &[]));
    }

    #[test]
    fn test_chained_and_last_false() {
        let root = state(r#"{"isAdmin": true, "isGuest": false, "status": "inactive"}"#);
        assert!(!evaluate("isAdmin && !isGuest && status == 'active'", &root, &[]));
    }

    #[test]
    fn test_chained_or() {
        let root = state(r#"{"a": false, "b": false, "c": true}"#);
        assert!(evaluate("a || b || c", &root, &[]));
    }

    #[test]
    fn test_chained_or_all_false() {
        let root = state(r#"{"a": false, "b": false, "c": false}"#);
        assert!(!evaluate("a || b || c", &root, &[]));
    }

    #[test]
    fn test_and_before_or() {
        // Standard precedence: && binds tighter than ||
        // "a || b && c" is treated as "a || (b && c)"
        let root = state(r#"{"a": false, "b": true, "c": true}"#);
        assert!(evaluate("a || b && c", &root, &[]));
        let root2 = state(r#"{"a": false, "b": true, "c": false}"#);
        assert!(!evaluate("a || b && c", &root2, &[]));
    }

    #[test]
    fn test_chained_mixed() {
        // "a && b || c && d" = "(a && b) || (c && d)"
        let root = state(r#"{"a": false, "b": true, "c": true, "d": true}"#);
        assert!(evaluate("a && b || c && d", &root, &[]));
        let root2 = state(r#"{"a": false, "b": true, "c": false, "d": true}"#);
        assert!(!evaluate("a && b || c && d", &root2, &[]));
    }
}

