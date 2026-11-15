use crate::{Locator, RenderError};
use serde_json::{json, Value};
use std::collections::HashMap;

/// Compatibility identity for the generated module's server-only helper contract.
pub const SERVER_RUNTIME_VERSION: u32 = 5;

struct FlatPlan<'a> {
    bodies: &'a Value,
    strings: Vec<String>,
    string_ids: HashMap<String, i64>,
    rules: Vec<Vec<i64>>,
    body_ids: HashMap<usize, i64>,
}

impl<'a> FlatPlan<'a> {
    fn new(bodies: &'a Value) -> Self {
        Self {
            bodies,
            strings: Vec::new(),
            string_ids: HashMap::new(),
            rules: Vec::new(),
            body_ids: HashMap::new(),
        }
    }

    fn string(&mut self, value: &Value) -> i64 {
        self.text(value.as_str().unwrap())
    }

    fn text(&mut self, text: &str) -> i64 {
        if let Some(id) = self.string_ids.get(text) {
            return *id;
        }
        let id = self.strings.len() as i64;
        self.strings.push(text.into());
        self.string_ids.insert(text.into(), id);
        id
    }

    fn reserve(&mut self, opcode: i64) -> i64 {
        let id = self.rules.len() as i64;
        self.rules.push(vec![opcode]);
        id
    }

    fn finish(&mut self, id: i64, args: Vec<i64>) -> i64 {
        self.rules[id as usize].extend(args);
        id
    }

    fn path(&mut self, path: &Value) -> i64 {
        let id = self.reserve(1);
        let args = path
            .as_array()
            .unwrap()
            .iter()
            .map(|segment| self.string(segment))
            .collect();
        self.finish(id, args)
    }

    fn operand(&mut self, operand: &Value) -> i64 {
        match operand[0].as_str().unwrap() {
            "path" => self.path(&operand[1]),
            "value" => self.node(&operand[1]),
            _ => unreachable!("compiler-owned operand"),
        }
    }

    fn list(&mut self, items: &Value) -> i64 {
        let id = self.reserve(17);
        let args = items
            .as_array()
            .unwrap()
            .iter()
            .map(|item| self.node(item))
            .collect();
        self.finish(id, args)
    }

    fn tag(&mut self, tag: &Value) -> i64 {
        let id = self.reserve(19);
        let args = vec![
            self.list(&tag["plain"]),
            self.list(&tag["hydrated"]),
            tag["count"].as_i64().unwrap(),
            self.string(&tag["ending"]),
        ];
        self.finish(id, args)
    }

    fn props(&mut self, props: &Value) -> i64 {
        let id = self.reserve(17);
        let mut args = Vec::new();
        for prop in props.as_array().unwrap() {
            let prop_id = self.reserve(24);
            let fields = vec![
                self.string(&prop[0]),
                self.string(&prop[1]),
                if prop[2].is_null() {
                    -1
                } else {
                    self.string(&prop[2])
                },
                self.operand(&prop[3]),
            ];
            args.push(self.finish(prop_id, fields));
        }
        self.finish(id, args)
    }

    fn defaults(&mut self, defaults: &Value) -> i64 {
        let id = self.reserve(17);
        let mut args = Vec::new();
        for default in defaults.as_array().unwrap() {
            let default_id = self.reserve(25);
            let fields = vec![self.string(&default[0]), self.node(&default[1])];
            args.push(self.finish(default_id, fields));
        }
        self.finish(id, args)
    }

    fn body(&mut self, original: &Value) -> i64 {
        let original = original.as_u64().unwrap() as usize;
        if let Some(id) = self.body_ids.get(&original) {
            return *id;
        }
        let id = self.reserve(18);
        // Reserve before following references; global IR IDs never escape this map.
        self.body_ids.insert(original, id);
        let ops = self.bodies[original].as_array().unwrap();
        let args = ops.iter().map(|op| self.node(op)).collect();
        self.finish(id, args)
    }

    fn node(&mut self, node: &Value) -> i64 {
        let opcode = match node[0].as_str().unwrap() {
            "literal" => 0,
            "null" => 2,
            "bool" => 3,
            "number" => 4,
            "string" => 5,
            "array" => 6,
            "object" => 7,
            "not" => 8,
            "truthy" => 9,
            "&&" => 10,
            "||" => 11,
            "compare" => 12,
            "attribute" => 13,
            "conditional" => 14,
            "segment" => 15,
            "quoted" => 16,
            "tag" => return self.tag(&node[1]),
            "binding" => 20,
            "when" => 21,
            "repeat" => 22,
            "element" => 23,
            "call" => 26,
            _ => unreachable!("compiler-owned rule"),
        };
        let id = self.reserve(opcode);
        let args = match opcode {
            0 | 4 | 5 => vec![self.string(&node[1])],
            2 => vec![],
            3 => vec![i64::from(node[1].as_bool().unwrap())],
            6 => node[1]
                .as_array()
                .unwrap()
                .iter()
                .map(|value| self.node(value))
                .collect(),
            7 => {
                let mut args = Vec::new();
                for (key, value) in node[1].as_object().unwrap() {
                    args.push(self.text(key));
                    args.push(self.node(value));
                }
                args
            }
            8 | 9 | 15 => vec![self.path(&node[1])],
            10 | 11 => vec![self.node(&node[1]), self.node(&node[2])],
            12 => vec![
                self.string(&node[1]),
                self.path(&node[2]),
                self.operand(&node[3]),
            ],
            13 => vec![
                self.string(&node[1]),
                self.path(&node[2]),
                i64::from(node[3].as_bool().unwrap()),
                i64::from(node[4].as_bool().unwrap()),
            ],
            14 => vec![self.node(&node[1]), self.string(&node[2])],
            16 => vec![self.string(&node[1]), self.list(&node[2])],
            20 => vec![self.path(&node[1]), i64::from(node[2].as_bool().unwrap())],
            21 => vec![self.node(&node[1]), self.body(&node[2])],
            22 => vec![
                self.path(&node[1]),
                self.path(&node[2]),
                self.string(&node[3]),
                self.body(&node[4]),
            ],
            23 => {
                let element = &node[1];
                vec![
                    self.string(&element["name"]),
                    self.body(&element["body"]),
                    self.string(&element["closing"]),
                    self.tag(&element["opening"]),
                    self.props(&element["props"]),
                    self.list(&element["entry"]),
                    self.list(&element["normal"]),
                    element["count"].as_i64().unwrap(),
                    self.defaults(&element["defaults"]),
                    self.string(&element["shadowTag"]),
                ]
            }
            26 => vec![self.body(&node[1])],
            _ => unreachable!("compiler-owned opcode"),
        };
        self.finish(id, args)
    }

    fn serialize(self, root: i64, host: Option<i64>, tag: Option<i64>) -> Value {
        let mut code = Vec::new();
        let mut offsets = Vec::new();
        for rule in self.rules {
            offsets.push(code.len());
            code.extend(rule);
        }
        let mut plan = json!({
            "format":"fast-server-plan", "version":1,
            "strings":self.strings, "code":code, "offsets":offsets, "root":root,
        });
        if let Some(host) = host {
            plan["host"] = json!(host);
        }
        if let Some(tag) = tag {
            plan["tag"] = json!(tag);
        }
        plan
    }
}

fn entry_plan(ir: &Value) -> Value {
    let mut plan = FlatPlan::new(&ir["bodies"]);
    let root = plan.body(&ir["entry"]);
    plan.serialize(root, None, None)
}

fn component_plan(ir: &Value, component: &Value) -> Value {
    let mut plan = FlatPlan::new(&ir["bodies"]);
    let root = plan.body(&component["shadow"]);
    let host = plan.body(&component["host"]);
    let tag = plan.string(&component["tag"]);
    plan.serialize(root, Some(host), Some(tag))
}

fn launcher(ir: &Value, runtime_import: &str, data: &str) -> String {
    format!(
        "import * as $ from {};\n\
         if($.runtimeVersion !== {SERVER_RUNTIME_VERSION}) throw new Error(\"Incompatible FAST server runtime; regenerate server modules.\");\n\
         {data}\
         export const compilerId = {};\n\
         export const runtimeVersion = {SERVER_RUNTIME_VERSION};\n\
         const {{renderEntryJson,renderTemplateJson,renderHostJson,renderShadowJson,components}} = $.createServerRenderer(entryPlan,componentPlans,compilerId);\n\
         export {{renderEntryJson,renderTemplateJson,renderHostJson,renderShadowJson,components}};\n",
        serde_json::to_string(runtime_import).unwrap(),
        ir["compilerId"],
    )
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
    let components = ir["components"]
        .as_object()
        .unwrap()
        .iter()
        .map(|(name, component)| json!([name, component_plan(ir, component)]))
        .collect::<Vec<_>>();
    launcher(
        ir,
        runtime_import,
        &format!(
            "const entryPlan = {};\nconst componentPlans = {};\n",
            entry_plan(ir),
            json!(components),
        ),
    )
}
