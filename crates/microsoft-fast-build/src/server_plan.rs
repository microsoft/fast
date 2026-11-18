//! Stable semantic wire data, separate from the native execution layout.
use serde_json::{json, Map, Value as V};
use std::collections::HashMap;

/// Native semantic artifact schema, independent of private execution layouts.
pub const NATIVE_VERSION: u32 = 2;

fn encode_value(v: &V) -> V {
    let kind = v[0].as_str().unwrap();
    match kind {
        "null" => json!({"type":kind}),
        "array" => {
            json!({"type":kind,"value":v[1].as_array().unwrap().iter().map(encode_value).collect::<Vec<_>>()})
        }
        "object" => {
            json!({"type":kind,"value":v[1].as_object().unwrap().iter().map(|(k,v)|(k.clone(),encode_value(v))).collect::<Map<_,_>>()})
        }
        _ => json!({"type":kind,"value":v[1]}),
    }
}

fn encode_operand(v: &V) -> V {
    if v[0] == "path" {
        json!({"type":"path","path":v[1]})
    } else {
        json!({"type":"value","value":encode_value(&v[1])})
    }
}

fn encode_condition(v: &V) -> V {
    match v[0].as_str().unwrap() {
        "&&" | "||" => json!({
            "type":if v[0] == "&&" { "and" } else { "or" },
            "left":encode_condition(&v[1]),"right":encode_condition(&v[2]),
        }),
        "compare" => {
            json!({"type":"compare","operator":v[1],"path":v[2],"value":encode_operand(&v[3])})
        }
        _ => json!({"type":v[0],"path":v[1]}),
    }
}

fn encode_attribute(v: &V) -> V {
    match v[0].as_str().unwrap() {
        "literal" => json!({"type":"literal","html":v[1]}),
        "segment" => json!({"type":"segment","path":v[1]}),
        "attribute" => {
            json!({"type":"attribute","name":v[1],"path":v[2],"boolean":v[3],"primitive":v[4]})
        }
        "conditional" => {
            json!({"type":"conditional","condition":encode_condition(&v[1]),"html":v[2]})
        }
        "quoted" => json!({"type":"quoted","name":v[1],"parts":encode_attributes(&v[2])}),
        _ => unreachable!(),
    }
}

fn encode_attributes(v: &V) -> V {
    v.as_array().unwrap().iter().map(encode_attribute).collect()
}

fn encode_defaults(v: &V) -> V {
    v.as_array()
        .unwrap()
        .iter()
        .map(|v| json!({"name":v[0],"attribute":encode_attribute(&v[1])}))
        .collect()
}

fn encode_tag(v: &V) -> V {
    json!({"plain":encode_attributes(&v["plain"]),"hydrated":encode_attributes(&v["hydrated"]),"count":v["count"],"ending":v["ending"]})
}

enum Pending {
    Body(usize),
    Component { shadow: usize, tag: V, defaults: V },
}

struct Encoder {
    ids: HashMap<usize, usize>,
    hosts: HashMap<usize, String>,
    pending: Vec<Pending>,
}

impl Encoder {
    fn name(&mut self, id: usize) -> V {
        let next = self.pending.len();
        let id = *self.ids.entry(id).or_insert_with(|| {
            self.pending.push(Pending::Body(id));
            next
        });
        json!(format!("template{id}"))
    }

    fn body(&mut self, body: &V) -> Vec<V> {
        body.as_array().unwrap().iter().map(|op| {
            match op[0].as_str().unwrap() {
                "literal" => encode_attribute(op),
                "call" => {
                    let id = op[1].as_u64().unwrap() as usize;
                    if let Some(name) = self.hosts.get(&id) {
                        json!({"type":"component","name":name})
                    } else {
                        json!({"type":"template","name":self.name(id)})
                    }
                }
                "binding" => json!({"type":"binding","path":op[1],"escape":op[2]}),
                "when" => json!({"type":"when","condition":encode_condition(&op[1]),"template":self.name(op[2].as_u64().unwrap() as usize)}),
                "repeat" => json!({"type":"repeat","alias":op[1],"collection":op[2],"diagnostic":op[3],"template":self.name(op[4].as_u64().unwrap() as usize)}),
                "tag" => {
                    let mut tag = encode_tag(&op[1]);
                    tag["type"] = json!("tag");
                    tag
                }
                "element" => {
                    let el = &op[1];
                    json!({
                        "type":"element","name":el["name"],"body":self.name(el["body"].as_u64().unwrap() as usize),
                        "closing":el["closing"],"opening":encode_tag(&el["opening"]),
                        "props":el["props"].as_array().unwrap().iter().map(|p|json!({
                            "camelCase":p[0],"unchanged":p[1],"dataset":p[2],"value":encode_operand(&p[3])
                        })).collect::<Vec<_>>(),
                        "entry":encode_attributes(&el["entry"]),"normal":encode_attributes(&el["normal"]),
                        "count":el["count"],"defaults":encode_defaults(&el["defaults"]),
                    })
                }
                _ => unreachable!(),
            }
        }).collect()
    }
}

pub(crate) fn encode(ir: &V) -> V {
    let bodies = ir["bodies"].as_array().unwrap();
    let mut encoder = Encoder {
        ids: HashMap::new(),
        hosts: HashMap::new(),
        pending: Vec::new(),
    };
    let mut definitions = Vec::new();
    for (name, c) in ir["components"].as_object().unwrap() {
        let mut host = c["host"].as_u64().unwrap() as usize;
        encoder.hosts.insert(host, name.clone());
        while bodies[host][0][0] == "call" {
            host = bodies[host][0][1].as_u64().unwrap() as usize;
            encoder.hosts.insert(host, name.clone());
        }
        definitions.push((name, c, bodies[host][0][1]["defaults"].clone()));
    }
    let entry = encoder.body(&bodies[ir["entry"].as_u64().unwrap() as usize]);
    let mut components = Map::new();
    let mut shared = HashMap::new();
    for (name, c, defaults) in definitions {
        let shadow = c["shadow"].as_u64().unwrap() as usize;
        let key = (shadow, c["tag"].clone(), defaults.clone());
        let next = encoder.pending.len();
        let id = *shared.entry(key).or_insert_with(|| {
            encoder.pending.push(Pending::Component {
                shadow,
                tag: c["tag"].clone(),
                defaults,
            });
            next
        });
        components.insert(name.clone(), json!(format!("template{id}")));
    }
    let mut shadow_uses = HashMap::new();
    for pending in &encoder.pending {
        if let Pending::Component { shadow, .. } = pending {
            *shadow_uses.entry(*shadow).or_insert(0) += 1;
        }
    }
    let mut templates = Map::new();
    let mut index = 0;
    while index < encoder.pending.len() {
        let value = match &encoder.pending[index] {
            Pending::Body(id) => encoder.body(&bodies[*id]),
            Pending::Component {
                shadow,
                tag,
                defaults,
            } => {
                let shadow = *shadow;
                let mut ops = Vec::new();
                if !defaults.as_array().unwrap().is_empty() {
                    ops.push(
                        json!({"type":"host-attributes","attributes":encode_defaults(defaults)}),
                    );
                }
                ops.push(json!({"type":"literal","html":tag}));
                if shadow_uses[&shadow] > 1 {
                    ops.push(json!({"type":"template","name":encoder.name(shadow)}));
                } else {
                    ops.extend(encoder.body(&bodies[shadow]));
                }
                ops.push(json!({"type":"literal","html":"</template>"}));
                ops
            }
        };
        templates.insert(format!("template{index}"), json!(value));
        index += 1;
    }
    json!({"entry":entry,"templates":templates,"components":components})
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn semantic_encoding_does_not_depend_on_private_body_numbering() {
        let first = json!({"entry":0,"bodies":[[["call",1],["call",1]],[["literal","shared"]]],"components":{}});
        let reordered = json!({"entry":1,"bodies":[[["literal","shared"]],[["call",0],["call",0]]],"components":{}});
        let expected = json!({
            "entry":[{"type":"template","name":"template0"},{"type":"template","name":"template0"}],
            "templates":{"template0":[{"type":"literal","html":"shared"}]},"components":{},
        });
        assert_eq!(encode(&first), expected);
        assert_eq!(encode(&reordered), expected);
        let artifact = crate::CompiledArtifact::load(
            json!({
                "format":"fast-server-native","version":1,
                "entry":expected["entry"],"templates":expected["templates"],"components":{},
            })
            .to_string()
            .as_bytes(),
        )
        .unwrap();
        assert_eq!(
            artifact
                .render_entry_json("{}", &Default::default())
                .unwrap(),
            "sharedshared",
        );
    }

    #[test]
    fn shared_template_graph_is_not_recursively_expanded() {
        let mut bodies = vec![json!([["literal", "shared"]])];
        for id in 0..50 {
            bodies.push(json!([["call", id], ["call", id]]));
        }
        let plan = encode(&json!({"entry":50,"bodies":bodies,"components":{}}));
        assert_eq!(plan["templates"].as_object().unwrap().len(), 50);
        assert!(plan.to_string().len() < 10_000);
    }
}
