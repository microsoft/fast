//! Compiler-owned executable representation. No source ranges or authored bodies
//! survive lowering: both backends consume these same operations and operands.
use crate::attribute::{
    data_attr_to_dataset_key, is_boolean_attribute, kebab_to_camel, parse_element_attribute_parts,
    single_attribute_binding,
};
use crate::attribute_lookup::{aria_attr_to_property_key, html_attr_to_property_key};
use crate::content::html_escape;
use crate::directive::Directive;
use crate::error::{template_context, RenderError};
use crate::expression::{find_binary_op, find_comparison_op};
use crate::plan::{Body, Element, Instruction, RenderPlan, Repeat, Tag, When};
use crate::Locator;
use serde_json::{json, Value};
use std::collections::HashMap;

pub const ARTIFACT_VERSION: u32 = 1;

pub(crate) fn path(expression: &str) -> Value {
    json!(expression.trim().split('.').collect::<Vec<_>>())
}

fn value(input: crate::JsonValue) -> Value {
    use crate::JsonValue as J;
    match input {
        J::Null => json!(["null"]),
        J::Bool(v) => json!(["bool", v]),
        J::Number(v) => json!(["number", v.to_string()]),
        J::String(v) => json!(["string", v]),
        J::Array(v) => json!(["array", v.into_iter().map(value).collect::<Vec<_>>()]),
        J::Object(v) => json!([
            "object",
            v.into_iter()
                .map(|(k, v)| (k, value(v)))
                .collect::<std::collections::BTreeMap<_, _>>()
        ]),
    }
}

fn rhs(expression: &str) -> Value {
    let text = expression.trim();
    let literal = if text.len() >= 2
        && ((text.starts_with('\'') && text.ends_with('\''))
            || (text.starts_with('"') && text.ends_with('"')))
    {
        Some(crate::JsonValue::String(text[1..text.len() - 1].into()))
    } else {
        match text {
            "null" => Some(crate::JsonValue::Null),
            "true" => Some(crate::JsonValue::Bool(true)),
            "false" => Some(crate::JsonValue::Bool(false)),
            _ => text.parse().ok().map(crate::JsonValue::Number),
        }
    };
    literal.map_or_else(
        || json!(["path", path(text)]),
        |v| json!(["value", value(v)]),
    )
}

fn condition(expression: &str) -> Value {
    let expression = expression.trim();
    for op in ["||", "&&"] {
        if let Some(at) = find_binary_op(expression, op) {
            return json!([
                op,
                condition(&expression[..at]),
                condition(&expression[at + 2..])
            ]);
        }
    }
    for op in [">=", "<=", "==", "!=", ">", "<"] {
        if let Some(at) = find_comparison_op(expression, op) {
            return json!([
                "compare",
                op,
                path(&expression[..at]),
                rhs(&expression[at + op.len()..])
            ]);
        }
    }
    if let Some(inner) = expression.strip_prefix('!') {
        json!(["not", path(inner)])
    } else {
        json!(["truthy", path(expression)])
    }
}

fn client_only(name: &str) -> bool {
    name.starts_with('@')
        || name.starts_with(':')
        || ["f-ref", "f-slotted", "f-children"]
            .iter()
            .any(|key| name.eq_ignore_ascii_case(key))
}

fn literal(text: impl Into<String>) -> Value {
    json!(["literal", text.into()])
}

// 0: ordinary tag; 1: entry host; 2: template host defaults.
fn attribute(name: &str, val: Option<&str>, raw: &str, mode: u8) -> Value {
    if let Some(bare) = name.strip_prefix('?') {
        if mode == 1 {
            if let Some(expr) = val.and_then(single_attribute_binding) {
                return json!(["conditional", condition(expr), format!(" {bare}")]);
            }
        } else {
            if let Some(text) = val.map(str::trim) {
                if text.starts_with("{{")
                    && text.ends_with("}}")
                    && (text.len() > 4 || (mode == 2 && text.len() == 4))
                {
                    return json!([
                        "conditional",
                        condition(&text[2..text.len() - 2]),
                        format!(" {bare}")
                    ]);
                }
            }
            return literal("");
        }
    }
    if let Some(text) = val {
        if let Some(expr) = single_attribute_binding(text) {
            return json!([
                "attribute",
                name,
                path(expr),
                is_boolean_attribute(name),
                mode != 0
            ]);
        }
        if text.contains("{{") {
            let mut parts = Vec::new();
            let mut at = 0;
            while let Some(relative) = text[at..].find("{{") {
                let start = at + relative;
                let Some(end) = text[start + 2..].find("}}").map(|v| start + 2 + v) else {
                    break;
                };
                parts.push(literal(&text[at..start]));
                parts.push(json!(["segment", path(&text[start + 2..end])]));
                at = end + 2;
            }
            parts.push(literal(&text[at..]));
            return json!(["quoted", name, parts]);
        }
        if mode != 0 {
            return literal(format!(
                " {name}=\"{}\"",
                if mode == 2 {
                    html_escape(text)
                } else {
                    text.into()
                }
            ));
        }
    }
    literal(format!(" {raw}"))
}

fn attributes(raw: &str, strip: bool, mode: u8) -> Vec<Value> {
    parse_element_attribute_parts(raw)
        .into_iter()
        .filter(|attr| !strip || !client_only(&attr.name))
        .map(|attr| attribute(&attr.name, attr.value.as_deref(), &attr.raw, mode))
        .collect()
}

fn resolved_tag(raw: &str, strip: bool) -> Vec<Value> {
    let name = crate::attribute::read_tag_name(raw, 0).unwrap();
    let mut parts = vec![literal(format!("<{name}"))];
    parts.extend(attributes(raw, strip, 0));
    parts
}

fn tag(source: &str, tag: &Tag) -> Value {
    let raw = &source[tag.range.clone()];
    let ending = if raw.trim_end().ends_with("/>") {
        " />"
    } else if raw.trim_end().ends_with('>') {
        ">"
    } else {
        ""
    };
    let plain = if tag.double_bindings == 0 {
        vec![literal(raw)]
    } else {
        let mut parts = resolved_tag(raw, false);
        parts.push(literal(ending));
        parts
    };
    let hydrated = if tag.total_bindings == 0 {
        vec![literal(&tag.stripped)]
    } else {
        resolved_tag(raw, true)
    };
    json!({"plain":plain,"hydrated":hydrated,"count":tag.total_bindings,"ending":ending})
}

struct Lowerer<'a> {
    locator: &'a Locator,
    bodies: Vec<Value>,
    elements: HashMap<String, usize>,
}

impl Lowerer<'_> {
    fn body(&mut self, source: &str, body: &Body, depth: usize) -> Result<usize, RenderError> {
        self.plan(&source[body.range.clone()], depth)
            .map_err(|e| e.rebase(source, body.range.start))
    }

    fn plan(&mut self, source: &str, depth: usize) -> Result<usize, RenderError> {
        if depth > 128 {
            return Err(RenderError::InvalidTemplateMetadata {
                message: "server compilation exceeds 128 structural levels".into(),
            }
            .at(source, 0));
        }
        let id = self.bodies.len();
        self.bodies.push(Value::Null);
        let mut ops = Vec::new();
        for instruction in RenderPlan::compile(source, Some(self.locator)).instructions {
            ops.push(match instruction {
                Instruction::Literal(range) => literal(&source[range]),
                Instruction::Tag(t) => json!(["tag", tag(source, &t)]),
                Instruction::Binding {
                    expression,
                    escaped,
                } => json!(["binding", path(&source[expression]), escaped]),
                Instruction::When(when) => {
                    let body = self.body(source, &when.body, depth + 1)?;
                    json!(["when", condition(&when.expression), body])
                }
                Instruction::Repeat(repeat) => {
                    let body = self.body(source, &repeat.body, depth + 1)?;
                    json!([
                        "repeat",
                        path(&repeat.variable),
                        path(&repeat.collection),
                        repeat.collection,
                        body
                    ])
                }
                Instruction::Element(element) => {
                    let authored = &source[element.at..element.after];
                    let element_id = if let Some(id) = self.elements.get(authored) {
                        *id
                    } else {
                        let element_id = self.bodies.len();
                        self.bodies.push(Value::Null);
                        let op = self.element(source, &element, depth + 1)?;
                        self.bodies[element_id] = json!([op]);
                        self.elements.insert(authored.into(), element_id);
                        element_id
                    };
                    json!(["call", element_id])
                }
                Instruction::Deferred(directive) => {
                    let at = directive.position();
                    return Err(match directive {
                        Directive::DoubleBrace(_) | Directive::TripleBrace(_) => {
                            let triple = matches!(directive, Directive::TripleBrace(_));
                            let start = at + if triple { 3 } else { 2 };
                            let delimiter = if triple { "}}}" } else { "}}" };
                            let context = template_context(source, at);
                            if source[start..].contains(delimiter) {
                                RenderError::EmptyBinding { context }
                            } else {
                                let expr = crate::error::truncate(&source[start..], 30);
                                if triple {
                                    RenderError::UnclosedUnescapedBinding { expr, context }
                                } else {
                                    RenderError::UnclosedBinding { expr, context }
                                }
                            }
                        }
                        Directive::When(_) => When::parse(source, at).unwrap_err(),
                        Directive::Repeat(_) => Repeat::parse(source, at).unwrap_err(),
                        Directive::CustomElement(_) => Element::parse(source, at).unwrap_err(),
                    });
                }
            });
        }
        self.bodies[id] = json!(ops);
        Ok(id)
    }

    fn element(&mut self, source: &str, el: &Element, depth: usize) -> Result<Value, RenderError> {
        let children = el
            .children
            .as_ref()
            .ok_or_else(|| RenderError::UnclosedDirective {
                tag: el.name.clone(),
                context: template_context(source, el.at),
            })?;
        let body = self.body(source, children, depth)?;
        let mut props = Vec::new();
        for (name, val) in &el.attrs {
            if name.starts_with('@')
                || name.starts_with('?')
                || ["f-ref", "f-slotted", "f-children"]
                    .iter()
                    .any(|key| name.eq_ignore_ascii_case(key))
            {
                continue;
            }
            let operand = match val {
                None => json!(["value", value(crate::JsonValue::Bool(true))]),
                Some(text) if text.starts_with("{{") && text.ends_with("}}") => {
                    json!(["path", path(&text[2..text.len() - 2])])
                }
                Some(text) => {
                    let trimmed = text.trim();
                    let parsed = if (trimmed.starts_with('[') && trimmed.ends_with(']'))
                        || (trimmed.starts_with('{') && trimmed.ends_with('}'))
                    {
                        crate::json::parse(trimmed).ok()
                    } else {
                        None
                    };
                    json!([
                        "value",
                        value(parsed.unwrap_or_else(|| crate::JsonValue::String(text.clone())))
                    ])
                }
            };
            let lowered = name.to_lowercase();
            let (camel, none, group) = if let Some(prop) = lowered.strip_prefix(':') {
                (prop.to_string(), prop.to_string(), None)
            } else if let Some(path) = data_attr_to_dataset_key(&lowered) {
                (
                    "dataset".into(),
                    "dataset".into(),
                    Some(path.split_once('.').unwrap().1.to_string()),
                )
            } else if let Some(key) =
                aria_attr_to_property_key(&lowered).or_else(|| html_attr_to_property_key(&lowered))
            {
                (key.to_string(), key.to_string(), None)
            } else {
                (kebab_to_camel(&lowered), lowered, None)
            };
            props.push(json!([camel, none, group, operand]));
        }
        let author_names = el
            .attrs
            .iter()
            .filter(|(name, _)| !client_only(name))
            .map(|(name, _)| name.strip_prefix('?').unwrap_or(name).to_lowercase())
            .collect::<Vec<_>>();
        let defaults = self
            .locator
            .get_host_attributes(&el.name)
            .iter()
            .filter(|(name, _)| {
                !client_only(name)
                    && !author_names
                        .contains(&name.strip_prefix('?').unwrap_or(name).to_lowercase())
            })
            .map(|(name, val)| {
                json!([
                    name.strip_prefix('?').unwrap_or(name).to_lowercase(),
                    attribute(name, val.as_deref(), name, 2)
                ])
            })
            .collect::<Vec<_>>();
        let normal = if el.binding_count == 0 {
            vec![literal(crate::attribute::strip_client_only_attrs(&el.base))]
        } else {
            resolved_tag(&el.base, true)
        };
        let mut entry = vec![literal(format!("<{}", el.name))];
        entry.extend(attributes(&el.base, true, 1));
        Ok(json!(["element", {
            "name":el.name, "body":body, "closing":&source[children.range.end..el.after],
            "opening":tag(source, &el.opening), "props":props, "entry":entry, "normal":normal,
            "count":el.binding_count, "defaults":defaults,
            "shadowTag":format!("<template{}>", self.locator.shadowroot_markup(&el.name))
        }]))
    }
}

pub(crate) fn lower(entry: &str, locator: &Locator) -> Result<Value, RenderError> {
    let mut compiler = Lowerer {
        locator,
        bodies: Vec::new(),
        elements: HashMap::new(),
    };
    let source = crate::code_escape::escape_code_sample_elements(entry);
    let entry_id = compiler.plan(&source, 0).map_err(|e| e.authored(entry))?;
    let mut names = locator.template_names().collect::<Vec<_>>();
    names.sort_unstable();
    let mut components = serde_json::Map::new();
    for name in names {
        let shadow = compiler
            .plan(locator.get_template(name).unwrap(), 0)
            .map_err(|e| {
                e.authored(locator.authored_template(name).unwrap())
                    .in_template(name)
            })?;
        let host = compiler.plan(&format!("<{name}></{name}>"), 0)?;
        components.insert(name.into(), json!({"shadow":shadow,"host":host,"tag":format!("<template{}>", locator.shadowroot_markup(name))}));
    }
    Ok(json!({
        "format":"fast-server", "version":ARTIFACT_VERSION, "compilerId":crate::SERVER_COMPILER_ID,
        "runtimeVersion":crate::SERVER_RUNTIME_VERSION, "entry":entry_id,
        "bodies":compiler.bodies, "components":components
    }))
}
