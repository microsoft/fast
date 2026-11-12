use crate::{Locator, RenderError};
use serde_json::Value;

/// Compatibility identity for the generated module's server-only helper contract.
pub const SERVER_RUNTIME_VERSION: u32 = 1;

fn js(value: &Value) -> String {
    value.to_string()
}

fn get(path: &Value) -> String {
    format!("$.get(r,l,{path})")
}

fn literal(value: &Value) -> String {
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

fn operand(value: &Value) -> String {
    if value[0] == "path" {
        get(&value[1])
    } else {
        literal(&value[1])
    }
}

fn condition(value: &Value) -> String {
    match value[0].as_str().unwrap() {
        "||" | "&&" => format!(
            "Boolean(({}) {} ({}))",
            condition(&value[1]),
            if value[0] == "||" { "|" } else { "&" },
            condition(&value[2])
        ),
        "compare" => format!(
            "$.compare({},{},{})",
            get(&value[2]),
            operand(&value[3]),
            value[1]
        ),
        "not" => format!("!$.truthy({})", get(&value[1])),
        "truthy" => format!("$.truthy({})", get(&value[1])),
        _ => unreachable!("compiler-owned condition"),
    }
}

fn attribute(value: &Value) -> String {
    match value[0].as_str().unwrap() {
        "literal" => js(&value[1]),
        "attribute" => format!(
            "$.attribute({},{},{},{})",
            value[1],
            get(&value[2]),
            value[3],
            value[4]
        ),
        "conditional" => format!("({} ? {} : \"\")", condition(&value[1]), value[2]),
        "segment" => format!("$.segment({})", get(&value[1])),
        "quoted" => format!(
            "$.quoted({},$.composite([{}]))",
            value[1],
            value[2]
                .as_array()
                .unwrap()
                .iter()
                .map(attribute)
                .collect::<Vec<_>>()
                .join(",")
        ),
        _ => unreachable!("compiler-owned attribute"),
    }
}

fn attributes(values: &Value) -> String {
    values
        .as_array()
        .unwrap()
        .iter()
        .map(|v| format!("out += {};\n", attribute(v)))
        .collect()
}

fn tag(value: &Value) -> String {
    let count = value["count"].as_u64().unwrap();
    format!(
        "if(!h) {{\n{}}} else {{\n{}{}}}\n",
        attributes(&value["plain"]),
        attributes(&value["hydrated"]),
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

fn body(id: usize, ops: &Value) -> String {
    let mut code = format!("function b{id}(r,l,o,h,e) {{\nlet out = \"\";\n");
    for op in ops.as_array().unwrap() {
        code.push_str("{\n");
        match op[0].as_str().unwrap() {
            "literal" => code.push_str(&format!("out += {};\n", op[1])),
            "tag" => code.push_str(&tag(&op[1])),
            "call" => code.push_str(&format!("out += b{}(r,l,o,h,e);\n", op[1])),
            "binding" => {
                let val = format!("$.text({})", get(&op[1]));
                let val = if op[2] == true { format!("$.htmlEscape({val})") } else { val };
                code.push_str(&format!("const index = h ? h.index++ : 0;\nif(h) out += $.start(h,index);\nout += {val};\nif(h) out += $.end(h,index);\n"));
            }
            "when" => code.push_str(&format!(
                "const index = h ? h.index++ : 0;\nif(h) out += $.start(h,index);\nif({}) out += b{}(r,l,o,h ? $.scope(o) : null,false);\nif(h) out += $.end(h,index);\n", condition(&op[1]), op[2])),
            "repeat" => code.push_str(&format!(
                "const items = $.list({},{});\nconst binding = h ? h.index++ : 0;\nif(h) out += $.start(h,binding);\nfor(let i=0;i<items.length;i++) {{\nif(h) out += $.repeatStart(h,i);\nout += b{}(r,[...l,[{},items[i]],[[\"$index\"],i]],o,h ? $.scope(o) : null,false);\nif(h) out += $.repeatEnd(h,i);\n}}\nif(h) out += $.end(h,binding);\n",
                get(&op[2]), op[3], op[4], op[1])),
            "element" => {
                let el = &op[1];
                let name = &el["name"];
                let body = &el["body"];
                code.push_str(&format!("if(!$.selected(o,{name})) {{\n{}out += b{body}(r,l,o,h,e) + {};\n}} else {{\nconst parent = r;\n", tag(&el["opening"]), el["closing"]));
                let props = el["props"].as_array().unwrap();
                let entries = props
                    .iter()
                    .map(|p| {
                        let key = if p[0] == p[1] {
                            js(&p[0])
                        } else {
                            format!("(o.strategy === \"camelCase\" ? {} : {})", p[0], p[1])
                        };
                        format!("[{key},{},{}]", p[2], operand(&p[3]))
                    })
                    .collect::<Vec<_>>()
                    .join(",");
                let child = if props.is_empty() { "r".into() } else { format!("$.child(r,[{entries}])") };
                code.push_str(&format!("const child = {child};\nconst shadow = shadows[{name}](child,[],o,$.scope(o),false);\nlet hydrationAttribute = null;\nif(e) {{\n{}}} else {{\n{}", attributes(&el["entry"]), attributes(&el["normal"])));
                if el["count"] != 0 {
                    code.push_str(&format!("if(h) {{ const marker = $.marker(h,{}); hydrationAttribute = marker.split(\"=\")[0]; out += \" \" + marker; }}\n", el["count"]));
                }
                code.push_str("}\n{\nconst r = child;\nconst l = [];\n");
                for default in el["defaults"].as_array().unwrap() {
                    code.push_str(&format!("if(hydrationAttribute !== {}) out += {};\n", default[0], attribute(&default[1])));
                }
                code.push_str(&format!("}}\nout += \">\" + {} + shadow + \"</template>\";\nout += b{body}(parent,l,o,h,false);\nout += {};\n}}\n", el["shadowTag"], serde_json::to_string(&format!("</{}>", name.as_str().unwrap())).unwrap()));
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
    let entry = &ir["entry"];
    let components = ir["components"].as_object().unwrap();
    let names = components.keys().collect::<Vec<_>>();
    let registry = |field: &str, function: bool| {
        components
            .iter()
            .map(|(name, c)| {
                format!(
                    "[{},{}{}]",
                    serde_json::to_string(name).unwrap(),
                    if function { "b" } else { "" },
                    c[field]
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
        .map(|(id, ops)| body(id, ops))
        .collect::<Vec<_>>()
        .join("\n");
    format!(
        "import * as $ from {};\n\
         if($.runtimeVersion !== {SERVER_RUNTIME_VERSION}) throw new Error(\"Incompatible FAST server runtime; regenerate server modules.\");\n\
         export const compilerId = {};\n\
         export const runtimeVersion = {SERVER_RUNTIME_VERSION};\n\
         export const components = Object.freeze({});\n\
         const shadows = Object.fromEntries([{}]);\n\
         const hosts = Object.fromEntries([{}]);\n\
         const shadowTags = Object.fromEntries([{}]);\n\
         {functions}\n\
         export function renderEntry(state,options) {{\nconst [r,o] = $.request(state,options);\nreturn b{entry}(r,[],o,null,true);\n}}\n\
         export function renderTemplate(state,options) {{\nconst [r,o] = $.request(state,options);\nreturn b{entry}(r,[],o,null,false);\n}}\n\
         export function renderHost(name,state,options) {{\nconst [r,o] = $.request(state,options);\n\
         if(!Object.hasOwn(hosts,name)) throw Object.assign(new Error(\"Unknown component: \" + name),{{code:\"missing-template\",templateName:name}});\n\
         return hosts[name](r,[],o,null,true);\n}}\n\
         export function renderShadow(name,state,options) {{\nconst [r,o] = $.request(state,options);\n\
         if(!Object.hasOwn(shadows,name)) throw Object.assign(new Error(\"Unknown component: \" + name),{{code:\"missing-template\",templateName:name}});\n\
         return $.selected(o,name) ? shadowTags[name] + shadows[name](r,[],o,$.scope(o),false) + \"</template>\" : \"\";\n}}\n",
        serde_json::to_string(runtime_import).unwrap(), ir["compilerId"], serde_json::to_string(&names).unwrap(),
        registry("shadow", true), registry("host", true), registry("tag", false),
    )
}
