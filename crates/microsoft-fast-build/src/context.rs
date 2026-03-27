use crate::json::JsonValue;

/// Resolve a binding expression against root state and loop variables.
/// Loop vars are checked innermost-first (rev); falls back to root state.
pub fn resolve_value(expr: &str, root: &JsonValue, loop_vars: &[(String, JsonValue)]) -> Option<JsonValue> {
    let expr = expr.trim();
    for (var_name, value) in loop_vars.iter().rev() {
        if var_name == expr {
            return Some(value.clone());
        }
        let prefix = format!("{}.", var_name);
        if let Some(prop_path) = expr.strip_prefix(&prefix) {
            return get_nested_property(value, prop_path);
        }
    }
    get_nested_property(root, expr)
}

/// Access nested property via dot-notation path, supporting numeric array indices.
pub fn get_nested_property(value: &JsonValue, path: &str) -> Option<JsonValue> {
    let parts: Vec<&str> = path.split('.').collect();
    let mut current = value.clone();
    for part in parts {
        current = match current {
            JsonValue::Object(ref map) => {
                map.get(part)?.clone()
            }
            JsonValue::Array(ref arr) => {
                let idx: usize = part.parse().ok()?;
                arr.get(idx)?.clone()
            }
            _ => return None,
        };
    }
    Some(current)
}
