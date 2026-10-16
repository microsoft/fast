use microsoft_fast_build::{JsonValue, Locator};
use serde_json::{json, Value};
use std::collections::HashMap;

pub const CASES: &[&str] = &[
    "url_sink_siblings",
    "repeat_custom_elements",
    "plain_bound_elements",
    "many_definitions",
    "large_state_overlay",
    "large_state_no_overlay",
];

pub struct Fixture {
    pub entry: String,
    pub state_json: String,
    pub state: JsonValue,
    pub templates: HashMap<String, String>,
}

impl Fixture {
    pub fn locator(&self) -> Locator {
        Locator::from_templates(self.templates.clone())
    }
}

fn replace_index(value: &Value, index: usize) -> Value {
    match value {
        Value::String(s) => Value::String(s.replace("{i}", &index.to_string())),
        Value::Array(items) => {
            Value::Array(items.iter().map(|v| replace_index(v, index)).collect())
        }
        Value::Object(map) => Value::Object(
            map.iter()
                .map(|(k, v)| (k.clone(), replace_index(v, index)))
                .collect(),
        ),
        _ => value.clone(),
    }
}

fn state_value(value: &Value) -> JsonValue {
    match value {
        Value::Null => JsonValue::Null,
        Value::Bool(v) => JsonValue::Bool(*v),
        Value::Number(v) => JsonValue::Number(v.as_f64().unwrap()),
        Value::String(v) => JsonValue::String(v.clone()),
        Value::Array(v) => JsonValue::Array(v.iter().map(state_value).collect()),
        Value::Object(v) => {
            JsonValue::Object(v.iter().map(|(k, v)| (k.clone(), state_value(v))).collect())
        }
    }
}

pub fn fixture(case: &str, count: usize, payload: usize, root_keys: usize) -> Fixture {
    let corpus: Value = serde_json::from_str(include_str!("corpus.json")).unwrap();
    let text = |key: &str| corpus[key].as_str().unwrap();
    let siblings = |key: &str| {
        (0..count)
            .map(|i| text(key).replace("{i}", &i.to_string()))
            .collect::<String>()
    };
    let mut state = json!({"label": corpus["item"]["label"]});
    let mut templates = HashMap::new();
    let entry = match case {
        "url_sink_siblings" => {
            templates.insert("bench-url-item".into(), text("urlTemplate").into());
            siblings("urlEntry")
        }
        "repeat_custom_elements" | "plain_bound_elements" => {
            state["items"] = Value::Array(
                (0..count)
                    .map(|i| replace_index(&corpus["item"], i))
                    .collect(),
            );
            if case == "repeat_custom_elements" {
                templates.insert("bench-repeat".into(), text("repeatTemplate").into());
                templates.insert("bench-item".into(), text("itemTemplate").into());
                text("repeatEntry").into()
            } else {
                templates.insert("bench-plain".into(), text("plainTemplate").into());
                text("plainEntry").into()
            }
        }
        "many_definitions" => {
            for i in 0..count {
                templates.insert(
                    format!("bench-definition-{i}"),
                    text("definitionTemplate").repeat(payload),
                );
            }
            siblings("definitionEntry")
        }
        "large_state_overlay" | "large_state_no_overlay" => {
            for i in 0..root_keys {
                state[format!("key{i}")] = json!({"nested": ["one", "two", "three"]});
            }
            templates.insert("bench-overlay".into(), text("overlayTemplate").into());
            siblings(if case == "large_state_overlay" {
                "overlayEntry"
            } else {
                "overlayBareEntry"
            })
        }
        _ => panic!("unknown performance case: {case}"),
    };
    Fixture {
        entry,
        state_json: serde_json::to_string(&state).unwrap(),
        state: state_value(&state),
        templates,
    }
}
