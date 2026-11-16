//! Stable semantic wire data, separate from either target's execution layout.
use serde_json::{json, Map, Value as V};
use std::collections::HashMap;

pub(crate) const JS_VERSION: u32 = 1;
/// Native semantic artifact schema, independent of private execution layouts.
pub const NATIVE_VERSION: u32 = 1;

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

enum Scope<'a> {
    All,
    Entry,
    Component(&'a str),
}

pub(crate) fn encode(ir: &V, format: &str, version: u32) -> V {
    encode_scope(ir, format, version, Scope::All)
}

pub(crate) fn encode_module(ir: &V, component: Option<&str>) -> V {
    encode_scope(
        ir,
        "fast-server-js",
        JS_VERSION,
        component.map_or(Scope::Entry, Scope::Component),
    )
}

fn encode_scope(ir: &V, format: &str, version: u32, scope: Scope<'_>) -> V {
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
        if matches!(scope, Scope::All)
            || matches!(scope, Scope::Component(selected) if selected == name.as_str())
        {
            // Registry names need not parse as authored HTML host tags.
            let defaults = bodies[host][0][1]
                .get("defaults")
                .cloned()
                .unwrap_or_else(|| json!([]));
            definitions.push((name, c, defaults));
        }
    }
    let entry = if matches!(scope, Scope::Component(_)) {
        Vec::new()
    } else {
        encoder.body(&bodies[ir["entry"].as_u64().unwrap() as usize])
    };
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
    json!({"format":format,"version":version,"entry":entry,"templates":templates,"components":components})
}

fn fields(v: &V, names: &[&str]) -> Result<(), ()> {
    let obj = v.as_object().ok_or(())?;
    if obj.len() != names.len() || names.iter().any(|name| !obj.contains_key(*name)) {
        return Err(());
    }
    Ok(())
}

fn map(v: &V, convert: impl Fn(&V) -> Result<V, ()>) -> Result<V, ()> {
    v.as_array()
        .ok_or(())?
        .iter()
        .map(convert)
        .collect::<Result<Vec<_>, _>>()
        .map(V::Array)
}

fn decode_value(v: &V, depth: usize) -> Result<V, ()> {
    if depth > 64 {
        return Err(());
    }
    let kind = v["type"].as_str().ok_or(())?;
    if kind == "null" {
        fields(v, &["type"])?;
        return Ok(json!(["null"]));
    }
    fields(v, &["type", "value"])?;
    let value = match kind {
        "array" => map(&v["value"], |v| decode_value(v, depth + 1))?,
        "object" => V::Object(
            v["value"]
                .as_object()
                .ok_or(())?
                .iter()
                .map(|(k, v)| Ok((k.clone(), decode_value(v, depth + 1)?)))
                .collect::<Result<_, ()>>()?,
        ),
        "bool" | "number" | "string" => v["value"].clone(),
        _ => return Err(()),
    };
    Ok(json!([kind, value]))
}

fn decode_operand(v: &V) -> Result<V, ()> {
    match v["type"].as_str().ok_or(())? {
        "path" => {
            fields(v, &["type", "path"])?;
            Ok(json!(["path", v["path"]]))
        }
        "value" => {
            fields(v, &["type", "value"])?;
            Ok(json!(["value", decode_value(&v["value"], 0)?]))
        }
        _ => Err(()),
    }
}

fn decode_condition(v: &V, depth: usize) -> Result<V, ()> {
    if depth > 64 {
        return Err(());
    }
    match v["type"].as_str().ok_or(())? {
        "and" | "or" => {
            fields(v, &["type", "left", "right"])?;
            Ok(json!([
                if v["type"] == "and" { "&&" } else { "||" },
                decode_condition(&v["left"], depth + 1)?,
                decode_condition(&v["right"], depth + 1)?
            ]))
        }
        "truthy" | "not" => {
            fields(v, &["type", "path"])?;
            Ok(json!([v["type"], v["path"]]))
        }
        "compare" => {
            fields(v, &["type", "operator", "path", "value"])?;
            Ok(json!([
                "compare",
                v["operator"],
                v["path"],
                decode_operand(&v["value"])?
            ]))
        }
        _ => Err(()),
    }
}

fn decode_attribute(v: &V) -> Result<V, ()> {
    match v["type"].as_str().ok_or(())? {
        "literal" => {
            fields(v, &["type", "html"])?;
            Ok(json!(["literal", v["html"]]))
        }
        "attribute" => {
            fields(v, &["type", "name", "path", "boolean", "primitive"])?;
            Ok(json!([
                "attribute",
                v["name"],
                v["path"],
                v["boolean"],
                v["primitive"]
            ]))
        }
        "conditional" => {
            fields(v, &["type", "condition", "html"])?;
            Ok(json!([
                "conditional",
                decode_condition(&v["condition"], 0)?,
                v["html"]
            ]))
        }
        "quoted" => {
            fields(v, &["type", "name", "parts"])?;
            let parts = map(&v["parts"], |part| {
                match part["type"].as_str().ok_or(())? {
                    "literal" => decode_attribute(part),
                    "segment" => {
                        fields(part, &["type", "path"])?;
                        Ok(json!(["segment", part["path"]]))
                    }
                    _ => Err(()),
                }
            })?;
            Ok(json!(["quoted", v["name"], parts]))
        }
        _ => Err(()),
    }
}

fn decode_defaults(v: &V) -> Result<V, ()> {
    map(v, |v| {
        fields(v, &["name", "attribute"])?;
        Ok(json!([v["name"], decode_attribute(&v["attribute"])?]))
    })
}

fn decode_tag(v: &V, operation: bool) -> Result<V, ()> {
    fields(
        v,
        if operation {
            &["type", "plain", "hydrated", "count", "ending"]
        } else {
            &["plain", "hydrated", "count", "ending"]
        },
    )?;
    Ok(
        json!({"plain":map(&v["plain"],decode_attribute)?,"hydrated":map(&v["hydrated"],decode_attribute)?,"count":v["count"],"ending":v["ending"]}),
    )
}

struct Decoder<'a> {
    ids: HashMap<&'a str, usize>,
    components: Map<String, V>,
}

impl Decoder<'_> {
    fn reference(&self, v: &V) -> Result<usize, ()> {
        self.ids.get(v.as_str().ok_or(())?).copied().ok_or(())
    }

    fn body(&self, ops: &[V]) -> Result<V, ()> {
        ops.iter().map(|v| {
            match v["type"].as_str().ok_or(())? {
                "literal" => decode_attribute(v),
                "template" => {
                    fields(v, &["type","name"])?;
                    Ok(json!(["call",self.reference(&v["name"])?]))
                }
                "component" => {
                    fields(v, &["type","name"])?;
                    let c = self.components.get(v["name"].as_str().ok_or(())?).ok_or(())?;
                    Ok(json!(["call",c["host"]]))
                }
                "binding" => {
                    fields(v, &["type","path","escape"])?;
                    Ok(json!(["binding",v["path"],v["escape"]]))
                }
                "when" => {
                    fields(v, &["type","condition","template"])?;
                    Ok(json!(["when",decode_condition(&v["condition"],0)?,self.reference(&v["template"])?]))
                }
                "repeat" => {
                    fields(v, &["type","alias","collection","diagnostic","template"])?;
                    Ok(json!(["repeat",v["alias"],v["collection"],v["diagnostic"],self.reference(&v["template"])?]))
                }
                "tag" => Ok(json!(["tag",decode_tag(v,true)?])),
                "element" => {
                    fields(v, &["type","name","body","closing","opening","props","entry","normal","count","defaults"])?;
                    let c = self.components.get(v["name"].as_str().ok_or(())?).ok_or(())?;
                    Ok(json!(["element",{
                        "name":v["name"],"body":self.reference(&v["body"])?,"closing":v["closing"],
                        "opening":decode_tag(&v["opening"],false)?,
                        "props":map(&v["props"],|p| {
                            fields(p,&["camelCase","unchanged","dataset","value"])?;
                            Ok(json!([p["camelCase"],p["unchanged"],p["dataset"],decode_operand(&p["value"])?]))
                        })?,
                        "entry":map(&v["entry"],decode_attribute)?,"normal":map(&v["normal"],decode_attribute)?,
                        "count":v["count"],"defaults":decode_defaults(&v["defaults"])?,"shadowTag":c["tag"],
                    }]))
                }
                _ => Err(()),
            }
        }).collect::<Result<Vec<_>,_>>().map(V::Array)
    }
}

pub(crate) fn decode(plan: V) -> Result<V, ()> {
    fields(
        &plan,
        &["format", "version", "entry", "templates", "components"],
    )?;
    let templates = plan["templates"].as_object().ok_or(())?;
    if templates.len() >= 1_000_000 || templates.keys().any(String::is_empty) {
        return Err(());
    }
    let mut decoder = Decoder {
        ids: templates
            .keys()
            .enumerate()
            .map(|(id, name)| (name.as_str(), id))
            .collect(),
        components: Map::new(),
    };
    let entry = templates.len();
    let mut bodies = vec![V::Null; entry + 1];
    let mut roots = HashMap::new();
    let mut derived_bytes = 0usize;
    let mut definitions = Vec::new();
    let registry = plan["components"].as_object().ok_or(())?;
    let empty = bodies.len();
    if !registry.is_empty() {
        bodies.push(json!([]));
    }
    for (name, reference) in registry {
        if name.is_empty() {
            return Err(());
        }
        decoder.reference(reference)?;
        let reference = reference.as_str().ok_or(())?;
        let (shadow, tag, defaults, defaults_bytes) = if let Some(root) = roots.get(reference) {
            root
        } else {
            let ops = templates[reference].as_array().ok_or(())?;
            let (defaults, ops) = if ops.first().is_some_and(|v| v["type"] == "host-attributes") {
                fields(&ops[0], &["type", "attributes"])?;
                (decode_defaults(&ops[0]["attributes"])?, &ops[1..])
            } else {
                (json!([]), ops.as_slice())
            };
            if ops.len() < 2 {
                return Err(());
            }
            let first = decode_attribute(&ops[0])?;
            let last = decode_attribute(ops.last().ok_or(())?)?;
            if first[0] != "literal"
                || !first[1].is_string()
                || last != json!(["literal", "</template>"])
            {
                return Err(());
            }
            let shadow = bodies.len();
            bodies.push(V::Null);
            definitions.push((shadow, &ops[1..ops.len() - 1]));
            derived_bytes = derived_bytes
                .checked_add(
                    serde_json::to_vec(&templates[reference])
                        .map_err(|_| ())?
                        .len(),
                )
                .ok_or(())?;
            let defaults_bytes = serde_json::to_vec(&defaults).map_err(|_| ())?.len();
            roots
                .entry(reference)
                .or_insert((shadow, first[1].clone(), defaults, defaults_bytes))
        };
        // Shared metadata must not expand without a bound when rebuilding private hosts.
        derived_bytes = derived_bytes
            .checked_add(*defaults_bytes)
            .and_then(|n| n.checked_add(tag.as_str()?.len().checked_mul(2)?))
            .and_then(|n| n.checked_add(name.len().checked_mul(5)?))
            .and_then(|n| n.checked_add(512))
            .ok_or(())?;
        if derived_bytes > 64 * 1024 * 1024 {
            return Err(());
        }
        let host = bodies.len();
        let base = format!("<{name}");
        let opening = json!({"plain":[["literal",format!("{base}>")]],"hydrated":[["literal",format!("{base}>")]],"count":0,"ending":">"});
        bodies.push(json!([["element",{
            "name":name,"body":empty,"closing":format!("</{name}>"),"opening":opening,"props":[],
            "entry":[["literal",base]],"normal":[["literal",base]],"count":0,"defaults":defaults,"shadowTag":tag,
        }]]));
        decoder
            .components
            .insert(name.clone(), json!({"shadow":shadow,"host":host,"tag":tag}));
    }
    for (name, ops) in templates {
        let ops = ops.as_array().ok_or(())?;
        let ops = if roots.contains_key(name.as_str())
            && ops.first().is_some_and(|v| v["type"] == "host-attributes")
        {
            &ops[1..]
        } else {
            ops.as_slice()
        };
        bodies[decoder.ids[name.as_str()]] = decoder.body(ops)?;
    }
    for (id, ops) in definitions {
        bodies[id] = decoder.body(ops)?;
    }
    bodies[entry] = decoder.body(plan["entry"].as_array().ok_or(())?)?;
    Ok(json!({"entry":entry,"bodies":bodies,"components":decoder.components}))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn semantic_encoding_does_not_depend_on_private_body_numbering() {
        let first = json!({"entry":0,"bodies":[[["call",1],["call",1]],[["literal","shared"]]],"components":{}});
        let reordered = json!({"entry":1,"bodies":[[["literal","shared"]],[["call",0],["call",0]]],"components":{}});
        let expected = json!({
            "format":"fast-server-native","version":1,
            "entry":[{"type":"template","name":"template0"},{"type":"template","name":"template0"}],
            "templates":{"template0":[{"type":"literal","html":"shared"}]},"components":{},
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
    fn shared_template_graph_is_not_recursively_expanded() {
        let mut bodies = vec![json!([["literal", "shared"]])];
        for id in 0..50 {
            bodies.push(json!([["call", id], ["call", id]]));
        }
        let plan = encode(
            &json!({"entry":50,"bodies":bodies,"components":{}}),
            "fast-server-native",
            NATIVE_VERSION,
        );
        assert_eq!(plan["templates"].as_object().unwrap().len(), 50);
        assert!(plan.to_string().len() < 10_000);
    }
}
