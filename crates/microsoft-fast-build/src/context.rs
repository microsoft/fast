use std::borrow::Cow;
use std::collections::HashMap;
use crate::json::JsonValue;

pub(crate) type LoopVars<'a> = [(&'a str, Cow<'a, JsonValue>)];

pub(crate) trait State {
    fn lookup(&self, path: &str) -> Option<Cow<'_, JsonValue>>;
    fn is_object(&self) -> bool;
}

impl State for JsonValue {
    fn lookup(&self, path: &str) -> Option<Cow<'_, JsonValue>> {
        get_nested_property(self, path)
    }

    fn is_object(&self) -> bool {
        matches!(self, JsonValue::Object(_))
    }
}

pub(crate) struct ChildState<'a> {
    parent: Option<&'a dyn State>,
    overrides: HashMap<String, Cow<'a, JsonValue>>,
}

impl<'a> ChildState<'a> {
    pub(crate) fn new(
        parent: &'a dyn State,
        overrides: HashMap<String, Cow<'a, JsonValue>>,
    ) -> Self {
        Self {
            parent: parent.is_object().then_some(parent),
            overrides,
        }
    }
}

impl State for ChildState<'_> {
    fn lookup(&self, path: &str) -> Option<Cow<'_, JsonValue>> {
        let (key, rest) = path.split_once('.').map_or((path, None), |(key, rest)| {
            (key, Some(rest))
        });
        if let Some(value) = self.overrides.get(key) {
            return match rest {
                Some(rest) => get_nested_property(value.as_ref(), rest),
                None => Some(Cow::Borrowed(value.as_ref())),
            };
        }
        self.parent?.lookup(path)
    }

    fn is_object(&self) -> bool {
        true
    }
}

/// Resolve a binding expression against root state and loop variables.
/// Loop vars are checked innermost-first (rev); falls back to root state.
///
/// Dot-notation paths traverse nested objects: `dataset.dateOfBirth` accesses
/// `state["dataset"]["dateOfBirth"]`. When a custom element receives `data-*`
/// HTML attributes, the renderer stores them in the child state under a nested
/// `"dataset"` key so that `{{dataset.X}}` bindings work naturally.
pub(crate) fn resolve_value<'a>(
    expr: &str,
    root: &'a dyn State,
    loop_vars: &'a LoopVars<'_>,
) -> Option<Cow<'a, JsonValue>> {
    let expr = expr.trim();
    for (var_name, value) in loop_vars.iter().rev() {
        if *var_name == expr {
            return Some(Cow::Borrowed(value.as_ref()));
        }
        if let Some(prop_path) = expr.strip_prefix(var_name).and_then(|rest| rest.strip_prefix('.')) {
            return get_nested_property(value.as_ref(), prop_path);
        }
    }
    root.lookup(expr)
}

/// Access nested property via dot-notation path, supporting numeric array indices.
///
/// Existing values stay borrowed; only synthetic array lengths are owned.
fn get_nested_property<'a>(value: &'a JsonValue, path: &str) -> Option<Cow<'a, JsonValue>> {
    let mut parts = path.split('.').peekable();
    let mut current: &JsonValue = value;
    while let Some(part) = parts.next() {
        current = match current {
            JsonValue::Object(ref map) => map.get(part)?,
            JsonValue::Array(ref arr) => {
                if part == "length" {
                    // length synthesises a value — only valid as the final
                    // segment. If more segments follow, the path is invalid.
                    return if parts.peek().is_none() {
                        Some(Cow::Owned(JsonValue::Number(arr.len() as f64)))
                    } else {
                        None
                    };
                }
                let idx: usize = part.parse().ok()?;
                arr.get(idx)?
            }
            _ => return None,
        };
    }
    Some(Cow::Borrowed(current))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::json::parse;

    fn state(s: &str) -> JsonValue {
        parse(s).unwrap()
    }

    #[test]
    fn child_overrides_borrow_inherited_values_and_mask_missing_paths() {
        let root = state(r#"{"items":[{"name":"first"}],"label":"parent","object":{"inherited":1}}"#);
        let child = ChildState::new(
            &root,
            HashMap::from([
                ("label".into(), Cow::Owned(JsonValue::Null)),
                ("object".into(), Cow::Owned(JsonValue::Object(HashMap::new()))),
            ]),
        );
        let inherited = root.lookup("items").unwrap();
        let found = child.lookup("items").unwrap();
        assert!(std::ptr::eq(found.as_ref(), inherited.as_ref()));
        assert_eq!(child.lookup("label").as_deref(), Some(&JsonValue::Null));
        assert_eq!(child.lookup("object.inherited"), None);
    }

    #[test]
    fn nested_loop_scopes_borrow_items_and_shadow_missing_parent_paths() {
        let root = state(r#"{"row":{"missing":"root"}}"#);
        let outer = state(r#"{"name":"outer","missing":"outer"}"#);
        let inner = state(r#"{"name":"inner"}"#);
        let outer_vars = crate::directive::build_loop_vars(&[], "row", &outer, 3);
        let inner_vars = crate::directive::build_loop_vars(&outer_vars, "row", &inner, 1);
        let found = resolve_value("row", &root, &inner_vars).unwrap();
        assert!(std::ptr::eq(found.as_ref(), &inner));
        assert!(std::ptr::eq(outer_vars[0].1.as_ref(), inner_vars[0].1.as_ref()));
        assert_eq!(resolve_value("row.missing", &root, &inner_vars), None);
        assert_eq!(
            resolve_value("$index", &root, &inner_vars).as_deref(),
            Some(&JsonValue::Number(1.0)),
        );
    }

    // ── get_nested_property ───────────────────────────────────────────────────

    #[test]
    fn test_single_key() {
        let root = state(r#"{"name": "Alice"}"#);
        assert_eq!(get_nested_property(&root, "name").as_deref(), Some(&JsonValue::String("Alice".into())));
    }

    #[test]
    fn test_two_level_object() {
        let root = state(r#"{"foo": {"bar": "baz"}}"#);
        assert_eq!(get_nested_property(&root, "foo.bar").as_deref(), Some(&JsonValue::String("baz".into())));
    }

    #[test]
    fn test_three_level_object() {
        let root = state(r#"{"foo": {"bar": {"bat": 42}}}"#);
        assert_eq!(get_nested_property(&root, "foo.bar.bat").as_deref(), Some(&JsonValue::Number(42.0)));
    }

    #[test]
    fn test_four_level_object() {
        let root = state(r#"{"a": {"b": {"c": {"d": "deep"}}}}"#);
        assert_eq!(get_nested_property(&root, "a.b.c.d").as_deref(), Some(&JsonValue::String("deep".into())));
    }

    #[test]
    fn test_array_index() {
        let root = state(r#"{"items": ["x", "y", "z"]}"#);
        assert_eq!(get_nested_property(&root, "items.1").as_deref(), Some(&JsonValue::String("y".into())));
    }

    #[test]
    fn test_array_then_object() {
        let root = state(r#"{"users": [{"name": "Alice"}, {"name": "Bob"}]}"#);
        assert_eq!(get_nested_property(&root, "users.0.name").as_deref(), Some(&JsonValue::String("Alice".into())));
    }

    #[test]
    fn test_object_then_array_then_object() {
        let root = state(r#"{"org": {"members": [{"city": "Seattle"}, {"city": "Berlin"}]}}"#);
        assert_eq!(get_nested_property(&root, "org.members.1.city").as_deref(), Some(&JsonValue::String("Berlin".into())));
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

    #[test]
    fn test_array_length() {
        let root = state(r#"{"items": [1, 2, 3]}"#);
        assert_eq!(get_nested_property(&root, "items.length").as_deref(), Some(&JsonValue::Number(3.0)));
    }

    #[test]
    fn test_empty_array_length() {
        let root = state(r#"{"items": []}"#);
        assert_eq!(get_nested_property(&root, "items.length").as_deref(), Some(&JsonValue::Number(0.0)));
    }

    #[test]
    fn test_array_length_with_trailing_segment_returns_none() {
        let root = state(r#"{"items": [1, 2]}"#);
        assert_eq!(get_nested_property(&root, "items.length.foo"), None);
    }

    #[test]
    fn test_nested_array_length() {
        let root = state(r#"{"data": {"list": [10, 20, 30, 40]}}"#);
        assert_eq!(get_nested_property(&root, "data.list.length").as_deref(), Some(&JsonValue::Number(4.0)));
    }

    // ── resolve_value with loop vars ──────────────────────────────────────────

    #[test]
    fn test_resolve_loop_var_exact() {
        let root = state(r#"{}"#);
        let vars = vec![("item", Cow::Owned(JsonValue::String("hello".into())))];
        assert_eq!(resolve_value("item", &root, &vars).as_deref(), Some(&JsonValue::String("hello".into())));
    }

    #[test]
    fn test_resolve_loop_var_property() {
        let root = state(r#"{}"#);
        let item = state(r#"{"address": {"city": "Seattle"}}"#);
        let vars = vec![("item", Cow::Borrowed(&item))];
        assert_eq!(resolve_value("item.address.city", &root, &vars).as_deref(), Some(&JsonValue::String("Seattle".into())));
    }

    #[test]
    fn test_resolve_falls_back_to_root() {
        let root = state(r#"{"title": "Hello"}"#);
        let item = state(r#"{"name": "Alice"}"#);
        let vars = vec![("item", Cow::Borrowed(&item))];
        assert_eq!(resolve_value("title", &root, &vars).as_deref(), Some(&JsonValue::String("Hello".into())));
    }

    #[test]
    fn test_resolve_inner_loop_var_shadows_outer() {
        let root = state(r#"{}"#);
        let outer = JsonValue::String("outer".into());
        let inner = JsonValue::String("inner".into());
        let vars = vec![
            ("x", Cow::Borrowed(&outer)),
            ("x", Cow::Borrowed(&inner)),
        ];
        assert_eq!(resolve_value("x", &root, &vars).as_deref(), Some(&JsonValue::String("inner".into())));
    }
}
