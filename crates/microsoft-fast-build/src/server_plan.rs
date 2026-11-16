//! Stable semantic wire data, separate from either target's execution layout.
use serde_json::{json, Map, Value};
use std::collections::HashMap;

pub(crate) const JS_VERSION: u32 = 1;
/// Native semantic artifact schema, independent of private execution layouts.
pub const NATIVE_VERSION: u32 = 1;

fn references(op: &mut Value, mut reference: impl FnMut(&mut Value)) {
    match op[0].as_str() {
        Some("call" | "fragment") => reference(&mut op[1]),
        Some("when") => reference(&mut op[2]),
        Some("repeat") => reference(&mut op[4]),
        Some("element") => reference(&mut op[1]["body"]),
        _ => {}
    }
}

pub(crate) fn encode(ir: &Value, format: &str, version: u32) -> Value {
    fn name(id: usize, ids: &mut HashMap<usize, usize>, pending: &mut Vec<usize>) -> Value {
        let next = ids.len();
        let id = *ids.entry(id).or_insert_with(|| {
            pending.push(id);
            next
        });
        json!(format!("fragment{id}"))
    }
    fn body(mut body: Value, ids: &mut HashMap<usize, usize>, pending: &mut Vec<usize>) -> Value {
        for op in body.as_array_mut().unwrap() {
            references(op, |value| {
                let id = value.as_u64().unwrap() as usize;
                *value = name(id, ids, pending);
            });
            if op[0] == "call" {
                op[0] = json!("fragment");
            }
        }
        body
    }
    let bodies = ir["bodies"].as_array().unwrap();
    let mut ids = HashMap::new();
    let mut pending = Vec::new();
    let entry = body(
        bodies[ir["entry"].as_u64().unwrap() as usize].clone(),
        &mut ids,
        &mut pending,
    );
    let mut components = ir["components"].clone();
    for component in components.as_object_mut().unwrap().values_mut() {
        for field in ["shadow", "host"] {
            let id = component[field].as_u64().unwrap() as usize;
            component[field] = name(id, &mut ids, &mut pending);
        }
    }
    let mut fragments = Map::new();
    let mut index = 0;
    while index < pending.len() {
        let value = body(bodies[pending[index]].clone(), &mut ids, &mut pending);
        fragments.insert(format!("fragment{index}"), value);
        index += 1;
    }
    json!({
        "format":format, "version":version, "entry":entry,
        "fragments":fragments, "components":components,
    })
}

pub(crate) fn decode(mut plan: Value) -> Result<Value, ()> {
    let fields = plan.as_object().ok_or(())?;
    if fields.len() != 5
        || !["format", "version", "entry", "fragments", "components"]
            .iter()
            .all(|name| fields.contains_key(*name))
    {
        return Err(());
    }
    let Value::Object(fragments) = plan["fragments"].take() else {
        return Err(());
    };
    if fragments.len() >= 1_000_000 || fragments.keys().any(String::is_empty) {
        return Err(());
    }
    let ids: HashMap<String, usize> = fragments
        .keys()
        .enumerate()
        .map(|(id, name)| (name.clone(), id))
        .collect();
    let mut bodies: Vec<Value> = fragments.into_values().collect();
    let entry = bodies.len();
    bodies.push(plan["entry"].take());
    let resolve = |value: &mut Value| -> Result<(), ()> {
        let id = ids.get(value.as_str().ok_or(())?).ok_or(())?;
        *value = json!(id);
        Ok(())
    };
    for body in &mut bodies {
        for op in body.as_array_mut().ok_or(())? {
            let fields = op.as_array_mut().ok_or(())?;
            let kind = fields.first().and_then(Value::as_str).ok_or(())?;
            let reference = match kind {
                "fragment" => {
                    if fields.len() != 2 {
                        return Err(());
                    }
                    fields[0] = json!("call");
                    Some(fields.get_mut(1).ok_or(())?)
                }
                "when" => Some(fields.get_mut(2).ok_or(())?),
                "repeat" => Some(fields.get_mut(4).ok_or(())?),
                "element" => Some(
                    fields
                        .get_mut(1)
                        .and_then(Value::as_object_mut)
                        .and_then(|element| element.get_mut("body"))
                        .ok_or(())?,
                ),
                // Private execution references must never be accepted on the wire.
                "call" => return Err(()),
                _ => None,
            };
            if let Some(reference) = reference {
                resolve(reference)?;
            }
        }
    }
    for component in plan["components"].as_object_mut().ok_or(())?.values_mut() {
        let fields = component.as_object_mut().ok_or(())?;
        for field in ["shadow", "host"] {
            resolve(fields.get_mut(field).ok_or(())?)?;
        }
    }
    let fields = plan.as_object_mut().unwrap();
    fields.remove("fragments");
    fields.remove("format");
    fields.remove("version");
    plan["entry"] = json!(entry);
    plan["bodies"] = json!(bodies);
    Ok(plan)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn semantic_encoding_does_not_depend_on_private_body_numbering() {
        let first = json!({
            "entry":0,
            "bodies":[[["call",1],["call",1]],[["literal","shared"]]],
            "components":{},
        });
        let reordered = json!({
            "entry":1,
            "bodies":[[["literal","shared"]],[["call",0],["call",0]]],
            "components":{},
        });
        let expected = json!({
            "format":"fast-server-native", "version":1,
            "entry":[["fragment","fragment0"],["fragment","fragment0"]],
            "fragments":{"fragment0":[["literal","shared"]]}, "components":{},
        });
        assert_eq!(
            encode(&first, "fast-server-native", NATIVE_VERSION),
            expected
        );
        assert_eq!(
            encode(&reordered, "fast-server-native", NATIVE_VERSION),
            expected
        );
        assert_eq!(
            encode(
                &decode(expected.clone()).unwrap(),
                "fast-server-native",
                NATIVE_VERSION
            ),
            expected
        );
    }

    #[test]
    fn shared_fragment_graph_is_not_recursively_expanded() {
        let mut bodies = vec![json!([["literal", "shared"]])];
        for id in 0..50 {
            bodies.push(json!([["call", id], ["call", id]]));
        }
        let plan = encode(
            &json!({"entry":50,"bodies":bodies,"components":{}}),
            "fast-server-native",
            NATIVE_VERSION,
        );
        assert_eq!(plan["fragments"].as_object().unwrap().len(), 50);
        assert!(plan.to_string().len() < 5_000);
    }
}
