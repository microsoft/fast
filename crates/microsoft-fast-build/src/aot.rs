use crate::attribute::{
    data_attr_to_dataset_key, is_boolean_attribute, kebab_to_camel, parse_element_attribute_parts,
    single_attribute_binding,
};
use crate::attribute_lookup::{aria_attr_to_property_key, html_attr_to_property_key};
use crate::code_escape::escape_code_sample_elements;
use crate::content::html_escape;
use crate::error::{template_context, RenderError};
use crate::expression::{find_binary_op, find_comparison_op};
use crate::locator::Locator;
use crate::plan::{Body, Element, Instruction, RenderPlan, Tag};

/// Compatibility identity for the generated module's server-only helper contract.
pub const SERVER_RUNTIME_VERSION: u32 = 1;

fn js(value: &str) -> String {
    serde_json::to_string(value).expect("strings are serializable")
}

fn literal(value: &crate::JsonValue) -> String {
    match value {
        crate::JsonValue::Null => "null".into(),
        crate::JsonValue::Bool(value) => value.to_string(),
        crate::JsonValue::Number(value) => {
            if *value == f64::INFINITY {
                "Infinity".into()
            } else if *value == f64::NEG_INFINITY {
                "-Infinity".into()
            } else if value.is_nan() {
                "NaN".into()
            } else {
                value.to_string()
            }
        }
        crate::JsonValue::String(value) => js(value),
        crate::JsonValue::Array(values) => format!(
            "[{}]",
            values.iter().map(literal).collect::<Vec<_>>().join(",")
        ),
        crate::JsonValue::Object(values) => {
            let mut keys = values.keys().collect::<Vec<_>>();
            keys.sort_unstable();
            format!(
                "Object.fromEntries([{}])",
                keys.into_iter()
                    .map(|key| { format!("[{},{}]", js(key), literal(&values[key])) })
                    .collect::<Vec<_>>()
                    .join(",")
            )
        }
    }
}

fn path(expression: &str, root: &str, loops: &str) -> String {
    let segments = expression
        .trim()
        .split('.')
        .map(js)
        .collect::<Vec<_>>()
        .join(",");
    format!("$.get({root},{loops},[{segments}])")
}

fn rhs(expression: &str) -> String {
    let value = expression.trim();
    if value.len() >= 2
        && ((value.starts_with('\'') && value.ends_with('\''))
            || (value.starts_with('"') && value.ends_with('"')))
    {
        return js(&value[1..value.len() - 1]);
    }
    if matches!(value, "true" | "false" | "null") {
        return value.to_string();
    }
    if let Ok(number) = value.parse::<f64>() {
        return if number.is_nan() {
            "NaN".into()
        } else if number == f64::INFINITY {
            "Infinity".into()
        } else if number == f64::NEG_INFINITY {
            "-Infinity".into()
        } else {
            number.to_string()
        };
    }
    path(value, "r", "l")
}

fn condition(expression: &str) -> String {
    let expression = expression.trim();
    for operator in ["||", "&&"] {
        if let Some(at) = find_binary_op(expression, operator) {
            // Both operands are evaluated by the existing server evaluator.
            let left = condition(&expression[..at]);
            let right = condition(&expression[at + 2..]);
            let operator = if operator == "||" { "|" } else { "&" };
            return format!("Boolean(({left}) {operator} ({right}))");
        }
    }
    for operator in [">=", "<=", "==", "!=", ">", "<"] {
        if let Some(at) = find_comparison_op(expression, operator) {
            return format!(
                "$.compare({},{},{})",
                path(&expression[..at], "r", "l"),
                rhs(&expression[at + operator.len()..]),
                js(operator),
            );
        }
    }
    if let Some(inner) = expression.strip_prefix('!') {
        return format!("!$.truthy({})", path(inner, "r", "l"));
    }
    format!("$.truthy({})", path(expression, "r", "l"))
}

fn client_only(name: &str) -> bool {
    name.starts_with('@')
        || name.starts_with(':')
        || ["f-ref", "f-slotted", "f-children"]
            .iter()
            .any(|key| name.eq_ignore_ascii_case(key))
}

fn composite(value: &str) -> String {
    let mut parts = Vec::new();
    let mut at = 0;
    while let Some(relative) = value[at..].find("{{") {
        let start = at + relative;
        let Some(relative_end) = value[start + 2..].find("}}") else {
            break;
        };
        let end = start + 2 + relative_end;
        parts.push(js(&value[at..start]));
        parts.push(format!(
            "$.segment({})",
            path(&value[start + 2..end], "r", "l")
        ));
        at = end + 2;
    }
    parts.push(js(&value[at..]));
    format!("$.composite([{}])", parts.join(","))
}

// 0: ordinary tag; 1: entry host; 2: template host defaults.
fn attribute(name: &str, value: Option<&str>, raw: &str, mode: u8) -> String {
    if let Some(bare) = name.strip_prefix('?') {
        if mode == 1 {
            if let Some(expression) = value.and_then(single_attribute_binding) {
                return format!(
                    "({} ? {} : \"\")",
                    condition(expression),
                    js(&format!(" {bare}")),
                );
            }
        } else {
            if let Some(value) = value {
                let value = value.trim();
                if value.starts_with("{{")
                    && value.ends_with("}}")
                    && (value.len() > 4 || (mode == 2 && value.len() == 4))
                {
                    return format!(
                        "({} ? {} : \"\")",
                        condition(&value[2..value.len() - 2]),
                        js(&format!(" {bare}")),
                    );
                }
            }
            return "\"\"".into();
        }
    }
    if let Some(value) = value {
        if let Some(expression) = single_attribute_binding(value) {
            return format!(
                "$.attribute({},{},{},{})",
                js(name),
                path(expression, "r", "l"),
                is_boolean_attribute(name),
                mode != 0,
            );
        }
        if value.contains("{{") {
            return format!("$.quoted({},{})", js(name), composite(value));
        }
        if mode != 0 {
            return js(&format!(
                " {name}=\"{}\"",
                if mode == 2 {
                    html_escape(value)
                } else {
                    value.to_string()
                },
            ));
        }
    }
    js(&format!(" {raw}"))
}

struct Emitter<'a> {
    locator: &'a Locator,
    functions: Vec<String>,
    elements: std::collections::HashMap<String, usize>,
}

impl Emitter<'_> {
    fn body(&mut self, source: &str, body: &Body, depth: usize) -> Result<usize, RenderError> {
        self.plan(&source[body.range.clone()], depth)
            .map_err(|error| error.rebase(source, body.range.start))
    }

    fn plan(&mut self, source: &str, depth: usize) -> Result<usize, RenderError> {
        if depth > 128 {
            return Err(RenderError::InvalidTemplateMetadata {
                message: "server compilation exceeds 128 structural levels".into(),
            }
            .at(source, 0));
        }
        let id = self.functions.len();
        self.functions.push(String::new());
        let mut code = format!("function b{id}(r,l,o,h,e) {{\nlet out = \"\";\n");
        for instruction in RenderPlan::compile(source, Some(self.locator)).instructions {
            code.push_str("{\n");
            match instruction {
                Instruction::Literal(range) => {
                    code.push_str(&format!("out += {};\n", js(&source[range])));
                }
                Instruction::Tag(tag) => code.push_str(&self.tag(source, &tag)),
                Instruction::Binding {
                    expression,
                    escaped,
                } => {
                    code.push_str(
                        "const index = h ? h.index++ : 0;\nif(h) out += $.start(h,index);\n",
                    );
                    let value = format!("$.text({})", path(&source[expression], "r", "l"));
                    code.push_str(&format!(
                        "out += {};\n",
                        if escaped {
                            format!("$.htmlEscape({value})")
                        } else {
                            value
                        }
                    ));
                    code.push_str("if(h) out += $.end(h,index);\n");
                }
                Instruction::When(when) => {
                    let body = self.body(source, &when.body, depth + 1)?;
                    code.push_str(
                        "const index = h ? h.index++ : 0;\nif(h) out += $.start(h,index);\n",
                    );
                    code.push_str(&format!(
                        "if({}) out += b{body}(r,l,o,h ? $.scope(o) : null,false);\n",
                        condition(&when.expression),
                    ));
                    code.push_str("if(h) out += $.end(h,index);\n");
                }
                Instruction::Repeat(repeat) => {
                    let body = self.body(source, &repeat.body, depth + 1)?;
                    code.push_str(&format!(
                        "const items = $.list({},{});\n",
                        path(&repeat.collection, "r", "l"),
                        js(&repeat.collection),
                    ));
                    code.push_str(
                        "const binding = h ? h.index++ : 0;\nif(h) out += $.start(h,binding);\n",
                    );
                    code.push_str(
                        "for(let i=0;i<items.length;i++) {\nif(h) out += $.repeatStart(h,i);\n",
                    );
                    code.push_str(&format!(
                        "out += b{body}(r,[...l,[[{}],items[i]],[[\"$index\"],i]],o,h ? $.scope(o) : null,false);\n",
                        repeat.variable.split('.').map(js).collect::<Vec<_>>().join(","),
                    ));
                    code.push_str(
                        "if(h) out += $.repeatEnd(h,i);\n}\nif(h) out += $.end(h,binding);\n",
                    );
                }
                Instruction::Element(element) => {
                    let authored = &source[element.at..element.after];
                    let element_id = if let Some(id) = self.elements.get(authored) {
                        *id
                    } else {
                        let element_id = self.functions.len();
                        self.functions.push(String::new());
                        let element_code = self.element(source, &element, depth + 1)?;
                        self.functions[element_id] = format!(
                            "function b{element_id}(r,l,o,h,e) {{\nlet out = \"\";\n{element_code}return out;\n}}\n",
                        );
                        self.elements.insert(authored.to_string(), element_id);
                        element_id
                    };
                    code.push_str(&format!("out += b{element_id}(r,l,o,h,e);\n"));
                }
                Instruction::Deferred(directive) => {
                    let empty = crate::empty_state();
                    // Reuse the normal diagnostic, but report it during generation even in skipped bodies.
                    crate::node::render_node(
                        &source[directive.position()..],
                        &empty,
                        &[],
                        Some(self.locator),
                        None,
                        false,
                        &crate::RenderConfig::default(),
                    )
                    .map_err(|error| error.rebase(source, directive.position()))?;
                    return Err(RenderError::InvalidTemplateMetadata {
                        message: format!("unsupported server instruction {directive:?}"),
                    }
                    .at(source, directive.position()));
                }
            }
            code.push_str("}\n");
        }
        code.push_str("return out;\n}\n");
        self.functions[id] = code;
        Ok(id)
    }

    fn tag(&self, source: &str, tag: &Tag) -> String {
        let raw = &source[tag.range.clone()];
        let mut code = String::new();
        code.push_str("if(!h) {\n");
        if tag.double_bindings == 0 {
            code.push_str(&format!("out += {};\n", js(raw)));
        } else {
            code.push_str(&self.resolved_tag(raw, false, None));
        }
        code.push_str("} else {\n");
        if tag.total_bindings == 0 {
            code.push_str(&format!("out += {};\n", js(&tag.stripped)));
        } else {
            code.push_str(&self.resolved_tag(raw, true, Some(tag.total_bindings)));
        }
        code.push_str("}\n");
        code
    }

    fn resolved_tag(&self, raw: &str, strip: bool, marker: Option<usize>) -> String {
        let name = crate::attribute::read_tag_name(raw, 0).unwrap();
        let mut code = format!("out += {};\n", js(&format!("<{name}")));
        for attr in parse_element_attribute_parts(raw) {
            if strip && client_only(&attr.name) {
                continue;
            }
            code.push_str(&format!(
                "out += {};\n",
                attribute(&attr.name, attr.value.as_deref(), &attr.raw, 0)
            ));
        }
        if let Some(count) = marker {
            code.push_str(&format!("out += \" \" + $.marker(h,{count});\n"));
        }
        let ending = if raw.trim_end().ends_with("/>") {
            " />"
        } else if raw.trim_end().ends_with('>') {
            ">"
        } else {
            ""
        };
        code.push_str(&format!("out += {};\n", js(ending)));
        code
    }

    fn element(
        &mut self,
        source: &str,
        element: &Element,
        depth: usize,
    ) -> Result<String, RenderError> {
        let children = element
            .children
            .as_ref()
            .ok_or_else(|| RenderError::UnclosedDirective {
                tag: element.name.clone(),
                context: template_context(source, element.at),
            })?;
        let body = self.body(source, children, depth)?;
        let name = js(&element.name);
        let mut code = format!("if(!$.selected(o,{name})) {{\n");
        code.push_str(&self.tag(source, &element.opening));
        code.push_str(&format!(
            "out += b{body}(r,l,o,h,e) + {};\n",
            js(&source[children.range.end..element.after]),
        ));
        code.push_str("} else {\nconst parent = r;\n");
        let mut entries = Vec::new();
        for (attr_name, value) in &element.attrs {
            if attr_name.starts_with('@')
                || attr_name.starts_with('?')
                || ["f-ref", "f-slotted", "f-children"]
                    .iter()
                    .any(|key| attr_name.eq_ignore_ascii_case(key))
            {
                continue;
            }
            let value = match value {
                None => "true".into(),
                Some(value) if value.starts_with("{{") && value.ends_with("}}") => {
                    path(&value[2..value.len() - 2], "r", "l")
                }
                Some(value) => {
                    let trimmed = value.trim();
                    if (trimmed.starts_with('[') && trimmed.ends_with(']'))
                        || (trimmed.starts_with('{') && trimmed.ends_with('}'))
                    {
                        crate::json::parse(trimmed)
                            .map(|value| literal(&value))
                            .unwrap_or_else(|_| js(value))
                    } else {
                        js(value)
                    }
                }
            };
            let lowered = attr_name.to_lowercase();
            if let Some(prop) = lowered.strip_prefix(':') {
                entries.push(format!("[{},null,{value}]", js(prop)));
            } else if let Some(path) = data_attr_to_dataset_key(&lowered) {
                let (_, prop) = path.split_once('.').unwrap();
                entries.push(format!("[\"dataset\",{},{value}]", js(prop)));
            } else {
                let key = aria_attr_to_property_key(&lowered)
                    .or_else(|| html_attr_to_property_key(&lowered));
                let key = key.map(js).unwrap_or_else(|| {
                    if lowered.contains('-') {
                        format!(
                            "(o.strategy === \"camelCase\" ? {} : {})",
                            js(&kebab_to_camel(&lowered)),
                            js(&lowered)
                        )
                    } else {
                        js(&lowered)
                    }
                });
                entries.push(format!("[{key},null,{value}]"));
            }
        }
        code.push_str(&format!(
            "const child = {};\nconst shadow = shadows[{name}](child,[],o,$.scope(o),false);\n",
            if entries.is_empty() {
                "r".into()
            } else {
                format!("$.child(r,[{}])", entries.join(","))
            },
        ));
        code.push_str("let hydrationAttribute = null;\nif(e) {\n");
        code.push_str(&format!("out += {};\n", js(&format!("<{}", element.name))));
        for attr in parse_element_attribute_parts(&element.base) {
            if client_only(&attr.name) {
                continue;
            }
            code.push_str(&format!(
                "out += {};\n",
                attribute(&attr.name, attr.value.as_deref(), &attr.raw, 1)
            ));
        }
        code.push_str("} else {\n");
        if element.binding_count == 0 {
            code.push_str(&format!(
                "out += {};\n",
                js(&crate::attribute::strip_client_only_attrs(&element.base)),
            ));
        } else {
            code.push_str(&self.resolved_tag(&element.base, true, None));
            code.push_str(&format!(
                "if(h) {{ const marker = $.marker(h,{}); hydrationAttribute = marker.split(\"=\")[0]; out += \" \" + marker; }}\n", element.binding_count,
            ));
        }
        code.push_str("}\n{\nconst r = child;\nconst l = [];\n");
        let author_names = element
            .attrs
            .iter()
            .filter(|(name, _)| !client_only(name))
            .map(|(name, _)| name.strip_prefix('?').unwrap_or(name).to_lowercase())
            .collect::<Vec<_>>();
        for (attr_name, value) in self.locator.get_host_attributes(&element.name) {
            let key = attr_name
                .strip_prefix('?')
                .unwrap_or(attr_name)
                .to_lowercase();
            if client_only(attr_name) || author_names.contains(&key) {
                continue;
            }
            let attr = attribute(attr_name, value.as_deref(), attr_name, 2);
            code.push_str(&format!(
                "if(hydrationAttribute !== {}) out += {attr};\n",
                js(&key)
            ));
        }
        code.push_str("}\n");
        code.push_str(&format!(
            "out += {} + shadow + \"</template>\";\nout += b{body}(parent,l,o,h,false);\nout += {};\n}}\n",
            js(&format!("><template{}>", self.locator.shadowroot_markup(&element.name))),
            js(&format!("</{}>", element.name)),
        ));
        Ok(code)
    }
}

/// Compile trusted declarative templates to synchronous server ESM.
///
/// Compilation eagerly diagnoses invalid directive bodies. Expressions are lowered
/// from the existing server grammar, never interpolated as executable source.
/// Generated modules import only `runtime_import`; they do not depend on WASM.
pub fn compile_server_module(
    entry: &str,
    locator: &Locator,
    runtime_import: &str,
) -> Result<String, RenderError> {
    let mut emitter = Emitter {
        locator,
        functions: Vec::new(),
        elements: std::collections::HashMap::new(),
    };
    let source = escape_code_sample_elements(entry);
    let entry_id = emitter
        .plan(&source, 0)
        .map_err(|error| error.authored(entry))?;
    let mut names = locator.template_names().collect::<Vec<_>>();
    names.sort_unstable();
    let mut shadows = Vec::new();
    let mut hosts = Vec::new();
    let mut shadow_attrs = Vec::new();
    for name in &names {
        let content = locator.get_template(name).unwrap();
        let id = emitter.plan(content, 0).map_err(|error| {
            error
                .authored(locator.authored_template(name).unwrap())
                .in_template(name)
        })?;
        shadows.push(format!("[{},b{id}]", js(name)));
        let host_id = emitter.plan(&format!("<{name}></{name}>"), 0)?;
        hosts.push(format!("[{},b{host_id}]", js(name)));
        shadow_attrs.push(format!(
            "[{},{}]",
            js(name),
            js(&format!("<template{}>", locator.shadowroot_markup(name)))
        ));
    }
    let functions = emitter.functions.join("\n");
    Ok(format!(
        "import * as $ from {};\n\
         if($.runtimeVersion !== {SERVER_RUNTIME_VERSION}) throw new Error(\"Incompatible FAST server runtime; regenerate server modules.\");\n\
         export const compilerId = {};\n\
         export const runtimeVersion = {SERVER_RUNTIME_VERSION};\n\
         export const components = Object.freeze([{}]);\n\
         const shadows = Object.fromEntries([{}]);\n\
         const hosts = Object.fromEntries([{}]);\n\
         const shadowTags = Object.fromEntries([{}]);\n\
         {functions}\n\
         export function renderEntry(state,options) {{\n\
         const [r,o] = $.request(state,options);\nreturn b{entry_id}(r,[],o,null,true);\n}}\n\
         export function renderHost(name,state,options) {{\n\
         const [r,o] = $.request(state,options);\n\
         if(!Object.hasOwn(hosts,name)) throw new Error(\"Unknown component: \" + name);\n\
         return hosts[name](r,[],o,null,true);\n}}\n\
         export function renderShadow(name,state,options) {{\n\
         const [r,o] = $.request(state,options);\n\
         if(!Object.hasOwn(shadows,name)) throw new Error(\"Unknown component: \" + name);\n\
         return $.selected(o,name) ? shadowTags[name] + shadows[name](r,[],o,$.scope(o),false) + \"</template>\" : \"\";\n}}\n",
        js(runtime_import), js(crate::PREPARED_COMPILER_ID),
        names.iter().map(|name| js(name)).collect::<Vec<_>>().join(","),
        shadows.join(","), hosts.join(","), shadow_attrs.join(","),
    ))
}
