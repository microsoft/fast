use crate::{Locator, RenderError};
use serde_json::{json, Value};
use std::collections::HashMap;

/// Compatibility identity for the generated module's server-only helper contract.
pub const SERVER_RUNTIME_VERSION: u32 = 3;

fn js(value: &Value) -> String {
    if let Some(index) = value.get("parameter").and_then(Value::as_u64) {
        format!("p[{index}]")
    } else {
        value.to_string()
    }
}

struct Accesses {
    aliases: Vec<Value>,
    paths: HashMap<String, usize>,
    declarations: Vec<String>,
}

impl Accesses {
    fn new(bodies: &Value) -> Self {
        let mut aliases = Vec::new();
        for body in bodies.as_array().unwrap() {
            for op in body.as_array().unwrap() {
                if op[0] == "repeat" {
                    if aliases.is_empty() {
                        aliases.push(json!(["$index"]));
                    }
                    if !aliases.contains(&op[1]) {
                        aliases.push(op[1].clone());
                    }
                }
            }
        }
        Self {
            aliases,
            paths: HashMap::new(),
            declarations: Vec::new(),
        }
    }

    fn slot(&self, alias: &Value) -> usize {
        self.aliases.iter().position(|name| name == alias).unwrap()
    }

    fn get(&mut self, path: &Value) -> String {
        let key = path.to_string();
        if let Some(id) = self.paths.get(&key) {
            return format!("g{id}(r,l)");
        }
        let id = self.paths.len();
        self.paths.insert(key, id);
        let segments = path.as_array().unwrap();
        let aliases = self
            .aliases
            .iter()
            .enumerate()
            .filter_map(|(slot, name)| {
                let name = name.as_array().unwrap();
                segments
                    .starts_with(name)
                    .then(|| json!([slot, name.len()]))
            })
            .collect::<Vec<_>>();
        self.declarations.push(format!(
            "const g{id} = $.access({path},{});\n",
            json!(aliases)
        ));
        format!("g{id}(r,l)")
    }
}

fn literal(value: &Value) -> String {
    if value.get("parameter").is_some() {
        return js(value);
    }
    match value[0].as_str().unwrap() {
        "null" => "null".into(),
        "bool" | "string" => js(&value[1]),
        "number" => {
            let number: f64 = value[1].as_str().unwrap().parse().unwrap();
            if number == f64::INFINITY {
                "Infinity".into()
            } else if number == f64::NEG_INFINITY {
                "-Infinity".into()
            } else {
                number.to_string()
            }
        }
        "array" => format!(
            "[{}]",
            value[1]
                .as_array()
                .unwrap()
                .iter()
                .map(literal)
                .collect::<Vec<_>>()
                .join(",")
        ),
        "object" => format!(
            "Object.fromEntries([{}])",
            value[1]
                .as_object()
                .unwrap()
                .iter()
                .map(|(key, val)| format!(
                    "[{},{}]",
                    serde_json::to_string(key).unwrap(),
                    literal(val)
                ))
                .collect::<Vec<_>>()
                .join(",")
        ),
        _ => unreachable!("compiler-owned value"),
    }
}

fn parameter(value: &mut Value, values: &mut Vec<String>, encoded: String) {
    let index = values.len();
    values.push(encoded);
    *value = json!({"parameter":index});
}

fn parameterize_attributes(attributes: &mut Value, values: &mut Vec<String>) {
    for attribute in attributes.as_array_mut().unwrap() {
        match attribute[0].as_str().unwrap() {
            "literal" => {
                let encoded = js(&attribute[1]);
                parameter(&mut attribute[1], values, encoded);
            }
            "conditional" => {
                let encoded = js(&attribute[2]);
                parameter(&mut attribute[2], values, encoded);
            }
            "quoted" => parameterize_attributes(&mut attribute[2], values),
            _ => {}
        }
    }
}

struct ElementShape {
    element: Value,
    instances: Vec<(usize, Vec<String>)>,
}

struct SharedElements {
    shapes: Vec<ElementShape>,
    calls: Vec<Option<(usize, usize)>>,
}

impl SharedElements {
    fn new(bodies: &Value) -> Self {
        let mut shapes = Vec::<ElementShape>::new();
        let mut keys = HashMap::new();
        for (id, body) in bodies.as_array().unwrap().iter().enumerate() {
            let ops = body.as_array().unwrap();
            if ops.len() != 1 || ops[0][0] != "element" {
                continue;
            }
            let mut element = ops[0][1].clone();
            let mut values = Vec::new();
            for field in ["plain", "hydrated"] {
                parameterize_attributes(&mut element["opening"][field], &mut values);
            }
            for field in ["entry", "normal"] {
                parameterize_attributes(&mut element[field], &mut values);
            }
            for default in element["defaults"].as_array_mut().unwrap() {
                let mut attributes = json!([default[1]]);
                parameterize_attributes(&mut attributes, &mut values);
                default[1] = attributes[0].take();
            }
            for prop in element["props"].as_array_mut().unwrap() {
                let operand = &mut prop[3];
                // Compound values must still be constructed per invocation: dataset
                // overlays can mutate a locally constructed object.
                if operand[0] == "value"
                    && matches!(
                        operand[1][0].as_str(),
                        Some("null" | "bool" | "number" | "string")
                    )
                {
                    let encoded = literal(&operand[1]);
                    parameter(&mut operand[1], &mut values, encoded);
                }
            }
            let key = element.to_string();
            let shape = *keys.entry(key).or_insert_with(|| {
                let index = shapes.len();
                shapes.push(ElementShape {
                    element,
                    instances: Vec::new(),
                });
                index
            });
            shapes[shape].instances.push((id, values));
        }
        let mut calls = vec![None; bodies.as_array().unwrap().len()];
        for (shape, group) in shapes.iter().enumerate() {
            if group.instances.len() > 1 {
                for (instance, (id, _)) in group.instances.iter().enumerate() {
                    calls[*id] = Some((shape, instance));
                }
            }
        }
        Self { shapes, calls }
    }

    fn call(&self, id: usize, arguments: &str) -> String {
        if let Some((shape, instance)) = self.calls[id] {
            format!("s{shape}({arguments},p{shape}[{instance}])")
        } else {
            format!("b{id}({arguments})")
        }
    }

    fn reference(&self, id: usize) -> String {
        if self.calls[id].is_some() {
            format!("((r,l,o,h,e)=>{})", self.call(id, "r,l,o,h,e"))
        } else {
            format!("b{id}")
        }
    }

    fn emit(&self, accesses: &mut Accesses) -> String {
        let mut code = String::new();
        for (shape, group) in self.shapes.iter().enumerate() {
            if group.instances.len() < 2 {
                continue;
            }
            let instances = group
                .instances
                .iter()
                .map(|(_, values)| format!("[{}]", values.join(",")))
                .collect::<Vec<_>>()
                .join(",");
            code.push_str(&format!("const p{shape} = [{instances}];\n"));
            code.push_str(&body(
                &format!("s{shape}"),
                &json!([["element", group.element]]),
                self,
                true,
                accesses,
            ));
        }
        code
    }
}

fn operand(value: &Value, accesses: &mut Accesses) -> String {
    if value[0] == "path" {
        accesses.get(&value[1])
    } else {
        literal(&value[1])
    }
}

fn condition(value: &Value, accesses: &mut Accesses) -> String {
    match value[0].as_str().unwrap() {
        "||" | "&&" => format!(
            "Boolean(({}) {} ({}))",
            condition(&value[1], accesses),
            if value[0] == "||" { "|" } else { "&" },
            condition(&value[2], accesses)
        ),
        "compare" => format!(
            "$.compare({},{},{})",
            accesses.get(&value[2]),
            operand(&value[3], accesses),
            value[1]
        ),
        "not" => format!("!$.truthy({})", accesses.get(&value[1])),
        "truthy" => format!("$.truthy({})", accesses.get(&value[1])),
        _ => unreachable!("compiler-owned condition"),
    }
}

fn attribute(value: &Value, accesses: &mut Accesses) -> String {
    match value[0].as_str().unwrap() {
        "literal" => js(&value[1]),
        "attribute" => format!(
            "$.attribute({},{},{},{})",
            value[1],
            accesses.get(&value[2]),
            value[3],
            value[4]
        ),
        "conditional" => format!(
            "({} ? {} : \"\")",
            condition(&value[1], accesses),
            js(&value[2])
        ),
        "segment" => format!("$.segment({})", accesses.get(&value[1])),
        "quoted" => format!(
            "$.quoted({},$.composite([{}]))",
            value[1],
            value[2]
                .as_array()
                .unwrap()
                .iter()
                .map(|part| attribute(part, accesses))
                .collect::<Vec<_>>()
                .join(",")
        ),
        _ => unreachable!("compiler-owned attribute"),
    }
}

fn attributes(values: &Value, accesses: &mut Accesses) -> String {
    values
        .as_array()
        .unwrap()
        .iter()
        .map(|v| format!("out += {};\n", attribute(v, accesses)))
        .collect()
}

fn tag(value: &Value, accesses: &mut Accesses) -> String {
    let count = value["count"].as_u64().unwrap();
    format!(
        "if(!h) {{\n{}}} else {{\n{}{}}}\n",
        attributes(&value["plain"], accesses),
        attributes(&value["hydrated"], accesses),
        if count == 0 {
            String::new()
        } else {
            format!(
                "out += \" \" + $.marker(h,{count}) + {};\n",
                value["ending"]
            )
        }
    )
}

fn body(
    name: &str,
    ops: &Value,
    shared: &SharedElements,
    parameterized: bool,
    accesses: &mut Accesses,
) -> String {
    let operations = ops.as_array().unwrap();
    if operations.is_empty() || (operations.len() == 1 && operations[0][0] == "literal") {
        let output = operations
            .first()
            .map_or_else(|| "\"\"".into(), |op| js(&op[1]));
        return format!("function {name}(r,l,o,h,e) {{ return {output}; }}\n");
    }
    let mut code = format!(
        "function {name}(r,l,o,h,e{}) {{\nlet out = \"\";\n",
        if parameterized { ",p" } else { "" }
    );
    for op in operations {
        code.push_str("{\n");
        match op[0].as_str().unwrap() {
            "literal" => code.push_str(&format!("out += {};\n", op[1])),
            "tag" => code.push_str(&tag(&op[1], accesses)),
            "call" => code.push_str(&format!(
                "out += {};\n",
                shared.call(op[1].as_u64().unwrap() as usize, "r,l,o,h,e")
            )),
            "binding" => {
                let val = format!("$.text({})", accesses.get(&op[1]));
                let val = if op[2] == true { format!("$.htmlEscape({val})") } else { val };
                code.push_str(&format!("const index = h ? h.index++ : 0;\nif(h) out += $.start(h,index);\nout += {val};\nif(h) out += $.end(h,index);\n"));
            }
            "when" => code.push_str(&format!(
                "const index = h ? h.index++ : 0;\nif(h) out += $.start(h,index);\nif({}) out += {};\nif(h) out += $.end(h,index);\n",
                condition(&op[1], accesses),
                shared.call(op[2].as_u64().unwrap() as usize, "r,l,o,h ? $.scope(o) : null,false")
            )),
            "repeat" => code.push_str(&format!(
                "const items = $.list({},{});\nconst binding = h ? h.index++ : 0;\nif(h) out += $.start(h,binding);\nconst next = items.length ? $.loop(l,{}) : null;\nfor(let i=0;i<items.length;i++) {{\nnext.value.value = items[i];\nnext.index.value = i;\nif(h) out += $.repeatStart(h,i);\nout += {};\nif(h) out += $.repeatEnd(h,i);\n}}\nif(h) out += $.end(h,binding);\n",
                accesses.get(&op[2]), op[3], accesses.slot(&op[1]),
                shared.call(op[4].as_u64().unwrap() as usize, "r,next,o,h ? $.scope(o) : null,false")
            )),
            "element" => {
                let el = &op[1];
                let name = &el["name"];
                let body = el["body"].as_u64().unwrap() as usize;
                code.push_str(&format!("if(!$.selected(o,{name})) {{\n{}out += {} + {};\n}} else {{\nconst parent = r;\n", tag(&el["opening"], accesses), shared.call(body, "r,l,o,h,e"), el["closing"]));
                let props = el["props"].as_array().unwrap();
                let entries = props
                    .iter()
                    .map(|p| {
                        let key = if p[0] == p[1] {
                            js(&p[0])
                        } else {
                            format!("(o.strategy === \"camelCase\" ? {} : {})", p[0], p[1])
                        };
                        format!("[{key},{},{}]", p[2], operand(&p[3], accesses))
                    })
                    .collect::<Vec<_>>()
                    .join(",");
                let child = if props.is_empty() { "r".into() } else { format!("$.child(r,[{entries}])") };
                code.push_str(&format!("const child = {child};\nconst shadow = shadows[{name}](child,null,o,$.scope(o),false);\nlet hydrationAttribute = null;\nif(e) {{\n{}}} else {{\n{}", attributes(&el["entry"], accesses), attributes(&el["normal"], accesses)));
                if el["count"] != 0 {
                    code.push_str(&format!("if(h) {{ const marker = $.marker(h,{}); hydrationAttribute = marker.split(\"=\")[0]; out += \" \" + marker; }}\n", el["count"]));
                }
                code.push_str("}\n{\nconst r = child;\nconst l = null;\n");
                for default in el["defaults"].as_array().unwrap() {
                    code.push_str(&format!("if(hydrationAttribute !== {}) out += {};\n", default[0], attribute(&default[1], accesses)));
                }
                code.push_str(&format!("}}\nout += \">\" + {} + shadow + \"</template>\";\nout += {};\nout += {};\n}}\n", el["shadowTag"], shared.call(body, "parent,l,o,h,false"), serde_json::to_string(&format!("</{}>", name.as_str().unwrap())).unwrap()));
            }
            _ => unreachable!("compiler-owned operation"),
        }
        code.push_str("}\n");
    }
    code.push_str("return out;\n}\n");
    code
}

/// Compile trusted declarative templates through the shared executable IR to ESM.
pub fn compile_server_module(
    entry: &str,
    locator: &Locator,
    runtime_import: &str,
) -> Result<String, RenderError> {
    let ir = crate::server_ir::lower(entry, locator)?;
    Ok(emit(&ir, runtime_import))
}

pub(crate) fn emit(ir: &Value, runtime_import: &str) -> String {
    let entry = ir["entry"].as_u64().unwrap() as usize;
    let shared = SharedElements::new(&ir["bodies"]);
    let mut accesses = Accesses::new(&ir["bodies"]);
    let components = ir["components"].as_object().unwrap();
    let names = components.keys().collect::<Vec<_>>();
    let registry = |field: &str, function: bool| {
        components
            .iter()
            .map(|(name, c)| {
                format!(
                    "[{},{}]",
                    serde_json::to_string(name).unwrap(),
                    if function {
                        shared.reference(c[field].as_u64().unwrap() as usize)
                    } else {
                        c[field].to_string()
                    }
                )
            })
            .collect::<Vec<_>>()
            .join(",")
    };
    let functions = ir["bodies"]
        .as_array()
        .unwrap()
        .iter()
        .enumerate()
        .filter(|(id, _)| shared.calls[*id].is_none())
        .map(|(id, ops)| body(&format!("b{id}"), ops, &shared, false, &mut accesses))
        .collect::<Vec<_>>()
        .join("\n");
    let shapes = shared.emit(&mut accesses);
    let accessors = accesses.declarations.join("");
    let renders = [("", "request"), ("Prepared", "preparedRequest")]
        .iter()
        .map(|(suffix, request)| format!(
            "export function renderEntry{suffix}(state,options) {{\nconst [r,o] = $.{request}(state,options);\nreturn {};\n}}\n\
             export function renderTemplate{suffix}(state,options) {{\nconst [r,o] = $.{request}(state,options);\nreturn {};\n}}\n\
             export function renderHost{suffix}(name,state,options) {{\nconst [r,o] = $.{request}(state,options);\n\
             if(!Object.hasOwn(hosts,name)) throw Object.assign(new Error(\"Unknown component: \" + name),{{code:\"missing-template\",templateName:name}});\n\
             return hosts[name](r,null,o,null,true);\n}}\n\
             export function renderShadow{suffix}(name,state,options) {{\nconst [r,o] = $.{request}(state,options);\n\
             if(!Object.hasOwn(shadows,name)) throw Object.assign(new Error(\"Unknown component: \" + name),{{code:\"missing-template\",templateName:name}});\n\
             return $.selected(o,name) ? shadowTags[name] + shadows[name](r,null,o,$.scope(o),false) + \"</template>\" : \"\";\n}}\n",
            shared.call(entry, "r,null,o,null,true"), shared.call(entry, "r,null,o,null,false"),
        ))
        .collect::<String>();
    format!(
        "import * as $ from {};\n\
         if($.runtimeVersion !== {SERVER_RUNTIME_VERSION}) throw new Error(\"Incompatible FAST server runtime; regenerate server modules.\");\n\
         export const compilerId = {};\n\
         export const runtimeVersion = {SERVER_RUNTIME_VERSION};\n\
         export const prepareState = $.prepareState;\n\
         export const components = Object.freeze({});\n\
         const shadows = Object.fromEntries([{}]);\n\
         const hosts = Object.fromEntries([{}]);\n\
         const shadowTags = Object.fromEntries([{}]);\n\
         {accessors}{shapes}{functions}\n{renders}",
        serde_json::to_string(runtime_import).unwrap(), ir["compilerId"], serde_json::to_string(&names).unwrap(),
        registry("shadow", true), registry("host", true), registry("tag", false),
    )
}
