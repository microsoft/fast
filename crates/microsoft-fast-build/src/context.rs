use crate::json::JsonValue;

/// Resolve a binding expression against root state and loop variables.
/// Loop vars are checked innermost-first (rev); falls back to root state.
///
/// Expressions starting with `dataset.` have the prefix stripped before resolution:
/// `dataset.dateOfBirth` resolves `dateOfBirth` from state, matching the
/// MDN `HTMLElement.dataset` convention where the camelCase property name is the
/// state key and the corresponding HTML attribute is `data-<kebab-case>`.
pub fn resolve_value(expr: &str, root: &JsonValue, loop_vars: &[(String, JsonValue)]) -> Option<JsonValue> {
    let expr = expr.trim();
    let expr = expr.strip_prefix("dataset.").unwrap_or(expr);
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::json::parse;

    fn state(s: &str) -> JsonValue {
        parse(s).unwrap()
    }

    // ── get_nested_property ───────────────────────────────────────────────────

    #[test]
    fn test_single_key() {
        let root = state(r#"{"name": "Alice"}"#);
        assert_eq!(get_nested_property(&root, "name"), Some(JsonValue::String("Alice".into())));
    }

    #[test]
    fn test_two_level_object() {
        let root = state(r#"{"foo": {"bar": "baz"}}"#);
        assert_eq!(get_nested_property(&root, "foo.bar"), Some(JsonValue::String("baz".into())));
    }

    #[test]
    fn test_three_level_object() {
        let root = state(r#"{"foo": {"bar": {"bat": 42}}}"#);
        assert_eq!(get_nested_property(&root, "foo.bar.bat"), Some(JsonValue::Number(42.0)));
    }

    #[test]
    fn test_four_level_object() {
        let root = state(r#"{"a": {"b": {"c": {"d": "deep"}}}}"#);
        assert_eq!(get_nested_property(&root, "a.b.c.d"), Some(JsonValue::String("deep".into())));
    }

    #[test]
    fn test_array_index() {
        let root = state(r#"{"items": ["x", "y", "z"]}"#);
        assert_eq!(get_nested_property(&root, "items.1"), Some(JsonValue::String("y".into())));
    }

    #[test]
    fn test_array_then_object() {
        let root = state(r#"{"users": [{"name": "Alice"}, {"name": "Bob"}]}"#);
        assert_eq!(get_nested_property(&root, "users.0.name"), Some(JsonValue::String("Alice".into())));
    }

    #[test]
    fn test_object_then_array_then_object() {
        let root = state(r#"{"org": {"members": [{"city": "Seattle"}, {"city": "Berlin"}]}}"#);
        assert_eq!(get_nested_property(&root, "org.members.1.city"), Some(JsonValue::String("Berlin".into())));
    }

    #[test]
    fn test_missing_intermediate_key() {
        let root = state(r#"{"foo": {}}"#);
        assert_eq!(get_nested_property(&root, "foo.bar.bat"), None);
    }

    #[test]
    fn test_missing_top_level_key() {
        let root = state(r#"{}"#);
        assert_eq!(get_nested_property(&root, "foo.bar"), None);
    }

    #[test]
    fn test_out_of_bounds_index() {
        let root = state(r#"{"items": ["a"]}"#);
        assert_eq!(get_nested_property(&root, "items.5"), None);
    }

    #[test]
    fn test_non_numeric_index_on_array() {
        let root = state(r#"{"items": ["a", "b"]}"#);
        assert_eq!(get_nested_property(&root, "items.foo"), None);
    }

    // ── resolve_value with loop vars ──────────────────────────────────────────

    #[test]
    fn test_resolve_loop_var_exact() {
        let root = state(r#"{}"#);
        let vars = vec![("item".to_string(), JsonValue::String("hello".into()))];
        assert_eq!(resolve_value("item", &root, &vars), Some(JsonValue::String("hello".into())));
    }

    #[test]
    fn test_resolve_loop_var_property() {
        let root = state(r#"{}"#);
        let item = state(r#"{"address": {"city": "Seattle"}}"#);
        let vars = vec![("item".to_string(), item)];
        assert_eq!(resolve_value("item.address.city", &root, &vars), Some(JsonValue::String("Seattle".into())));
    }

    #[test]
    fn test_resolve_falls_back_to_root() {
        let root = state(r#"{"title": "Hello"}"#);
        let item = state(r#"{"name": "Alice"}"#);
        let vars = vec![("item".to_string(), item)];
        assert_eq!(resolve_value("title", &root, &vars), Some(JsonValue::String("Hello".into())));
    }

    #[test]
    fn test_resolve_inner_loop_var_shadows_outer() {
        let root = state(r#"{}"#);
        let outer = JsonValue::String("outer".into());
        let inner = JsonValue::String("inner".into());
        let vars = vec![
            ("x".to_string(), outer),
            ("x".to_string(), inner),
        ];
        assert_eq!(resolve_value("x", &root, &vars), Some(JsonValue::String("inner".into())));
    }
}
