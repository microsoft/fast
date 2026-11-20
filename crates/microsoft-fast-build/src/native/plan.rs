//! Validated direct decoding of semantic FAST artifacts into execution-only data.
use super::{J, V};
use std::collections::HashMap;
use std::sync::Arc;

type Result<T> = std::result::Result<T, ()>;
const LIMIT: usize = 1_000_000;

fn collect<T>(values: impl Iterator<Item = Result<T>>) -> Result<Vec<T>> {
    // Validate before trimming so malformed nested data cannot trigger eager reservation.
    values.collect::<Result<Box<[_]>>>().map(Vec::from)
}

fn fields(v: &V, names: &[&str]) -> Result<()> {
    let obj = v.as_object().ok_or(())?;
    if obj.len() != names.len() || names.iter().any(|name| !obj.contains_key(*name)) {
        return Err(());
    }
    Ok(())
}

fn array(v: &V) -> Result<&[V]> {
    v.as_array().map(Vec::as_slice).ok_or(())
}

fn string(v: &V) -> Result<&str> {
    v.as_str().ok_or(())
}

fn literal(v: &V) -> Result<&str> {
    fields(v, &["type", "html"])?;
    if v["type"] != "literal" {
        return Err(());
    }
    string(&v["html"])
}

fn count(v: &V) -> Result<usize> {
    v.as_u64()
        .filter(|n| *n <= LIMIT as u64)
        .map(|n| n as usize)
        .ok_or(())
}

fn decoded(v: &V, depth: usize) -> Result<J> {
    if depth > 64 {
        return Err(());
    }
    let kind = string(&v["type"])?;
    if kind == "null" {
        fields(v, &["type"])?;
        return Ok(J::Null);
    }
    fields(v, &["type", "value"])?;
    Ok(match kind {
        "bool" => J::Bool(v["value"].as_bool().ok_or(())?),
        "number" => J::Number(string(&v["value"])?.parse().map_err(|_| ())?),
        "string" => J::String(string(&v["value"])?.into()),
        "array" => J::Array(collect(
            array(&v["value"])?.iter().map(|v| decoded(v, depth + 1)),
        )?),
        "object" => J::Object(
            v["value"]
                .as_object()
                .ok_or(())?
                .iter()
                .map(|(k, v)| Ok((k.clone(), decoded(v, depth + 1)?)))
                .collect::<Result<_>>()?,
        ),
        _ => return Err(()),
    })
}

#[derive(Debug)]
pub(super) struct Segment {
    pub key: String,
    pub array_index: Option<usize>,
}

pub(super) type Path = Vec<Segment>;

fn strings(v: &V) -> Result<Vec<String>> {
    let values = array(v)?;
    if values.is_empty() {
        return Err(());
    }
    collect(values.iter().map(|v| Ok(string(v)?.into())))
}

fn path(v: &V) -> Result<Path> {
    let values = array(v)?;
    if values.is_empty() {
        return Err(());
    }
    collect(values.iter().map(|v| Ok(segment(string(v)?))))
}

fn segment(key: &str) -> Segment {
    let digits = key.strip_prefix('+').unwrap_or(key);
    let array_index = (!digits.is_empty() && digits.bytes().all(|b| b.is_ascii_digit()))
        .then(|| digits.parse().ok())
        .flatten();
    Segment {
        key: key.into(),
        array_index,
    }
}

#[derive(Debug)]
pub(super) enum Operand {
    Path(Path),
    Value(J),
}

impl Operand {
    fn load(v: &V) -> Result<Self> {
        Ok(match string(&v["type"])? {
            "path" => {
                fields(v, &["type", "path"])?;
                Self::Path(path(&v["path"])?)
            }
            "value" => {
                fields(v, &["type", "value"])?;
                Self::Value(decoded(&v["value"], 0)?)
            }
            _ => return Err(()),
        })
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(super) enum Comparison {
    Equal,
    NotEqual,
    Greater,
    Less,
    GreaterEqual,
    LessEqual,
}

impl Comparison {
    fn load(v: &V) -> Result<Self> {
        Ok(match string(v)? {
            "==" => Self::Equal,
            "!=" => Self::NotEqual,
            ">" => Self::Greater,
            "<" => Self::Less,
            ">=" => Self::GreaterEqual,
            "<=" => Self::LessEqual,
            _ => return Err(()),
        })
    }
}

#[derive(Debug)]
pub(super) enum Condition {
    Or(Box<Condition>, Box<Condition>),
    And(Box<Condition>, Box<Condition>),
    Not(Path),
    Truthy(Path),
    Compare(Comparison, Path, Box<Operand>),
}

impl Condition {
    fn load(v: &V, depth: usize) -> Result<Self> {
        if depth > 64 {
            return Err(());
        }
        Ok(match string(&v["type"])? {
            "or" | "and" => {
                fields(v, &["type", "left", "right"])?;
                let left = Box::new(Self::load(&v["left"], depth + 1)?);
                let right = Box::new(Self::load(&v["right"], depth + 1)?);
                if v["type"] == "or" {
                    Self::Or(left, right)
                } else {
                    Self::And(left, right)
                }
            }
            "not" | "truthy" => {
                fields(v, &["type", "path"])?;
                let path = path(&v["path"])?;
                if v["type"] == "not" {
                    Self::Not(path)
                } else {
                    Self::Truthy(path)
                }
            }
            "compare" => {
                fields(v, &["type", "operator", "path", "value"])?;
                Self::Compare(
                    Comparison::load(&v["operator"])?,
                    path(&v["path"])?,
                    Box::new(Operand::load(&v["value"])?),
                )
            }
            _ => return Err(()),
        })
    }
}

#[derive(Debug)]
pub(super) enum Part {
    Literal(String),
    Segment(Path),
}

#[derive(Debug)]
pub(super) enum Attribute {
    Literal(String),
    Conditional(Box<Condition>, String),
    Bound {
        name: String,
        path: Path,
        boolean: bool,
        property: bool,
    },
    Quoted(String, Vec<Part>),
}

impl Attribute {
    fn load(v: &V) -> Result<Self> {
        Ok(match string(&v["type"])? {
            "literal" => Self::Literal(literal(v)?.into()),
            "conditional" => {
                fields(v, &["type", "condition", "html"])?;
                Self::Conditional(
                    Box::new(Condition::load(&v["condition"], 0)?),
                    string(&v["html"])?.into(),
                )
            }
            "attribute" => {
                fields(v, &["type", "name", "path", "boolean", "primitive"])?;
                Self::Bound {
                    name: string(&v["name"])?.into(),
                    path: path(&v["path"])?,
                    boolean: v["boolean"].as_bool().ok_or(())?,
                    property: v["primitive"].as_bool().ok_or(())?,
                }
            }
            "quoted" => {
                fields(v, &["type", "name", "parts"])?;
                Self::Quoted(
                    string(&v["name"])?.into(),
                    collect(array(&v["parts"])?.iter().map(|p| {
                        Ok(match string(&p["type"])? {
                            "literal" => {
                                fields(p, &["type", "html"])?;
                                Part::Literal(string(&p["html"])?.into())
                            }
                            "segment" => {
                                fields(p, &["type", "path"])?;
                                Part::Segment(path(&p["path"])?)
                            }
                            _ => return Err(()),
                        })
                    }))?,
                )
            }
            _ => return Err(()),
        })
    }
}

fn attrs(v: &V) -> Result<Vec<Attribute>> {
    collect(array(v)?.iter().map(Attribute::load))
}

fn defaults(v: &V) -> Result<Vec<(String, Attribute)>> {
    collect(array(v)?.iter().map(|v| {
        fields(v, &["name", "attribute"])?;
        Ok((
            string(&v["name"])?.into(),
            Attribute::load(&v["attribute"])?,
        ))
    }))
}

#[derive(Debug)]
pub(super) struct Tag {
    pub plain: Vec<Attribute>,
    pub hydrated: Vec<Attribute>,
    pub count: usize,
    pub ending: String,
}

impl Tag {
    fn load(v: &V, operation: bool) -> Result<Self> {
        fields(
            v,
            if operation {
                &["type", "plain", "hydrated", "count", "ending"]
            } else {
                &["plain", "hydrated", "count", "ending"]
            },
        )?;
        Ok(Self {
            plain: attrs(&v["plain"])?,
            hydrated: attrs(&v["hydrated"])?,
            count: count(&v["count"])?,
            ending: string(&v["ending"])?.into(),
        })
    }
}

#[derive(Debug)]
pub(super) struct Property {
    pub keys: [Path; 2],
    pub group: Option<String>,
    pub value: Operand,
}

#[derive(Debug)]
pub(super) struct Element {
    pub component: usize,
    pub body: usize,
    pub closing: String,
    pub opening: Tag,
    pub props: Vec<Property>,
    pub entry: Vec<Attribute>,
    pub normal: Vec<Attribute>,
    pub count: usize,
    pub defaults: Vec<(String, Attribute)>,
}

#[derive(Debug)]
pub(super) enum Dynamic {
    Binding(Path, bool),
    When(Box<Condition>, usize),
    Repeat {
        alias: Vec<String>,
        path: Path,
        diagnostic: String,
        body: usize,
    },
}

#[derive(Debug)]
pub(super) enum Operation {
    Literal(String),
    Tag(Box<Tag>),
    Call(usize),
    Dynamic(Box<Dynamic>),
    Element(Box<Element>),
}

impl Operation {
    fn target(&mut self) -> Option<&mut usize> {
        match self {
            Self::Call(body) => Some(body),
            Self::Element(element) => Some(&mut element.body),
            Self::Dynamic(dynamic) => match dynamic.as_mut() {
                Dynamic::When(_, body) | Dynamic::Repeat { body, .. } => Some(body),
                _ => None,
            },
            _ => None,
        }
    }
}

#[derive(Debug)]
pub(super) struct Component {
    pub name: Arc<str>,
    pub closing: String,
    pub shadow: usize,
    pub host: usize,
    pub tag: String,
}

#[derive(Debug)]
pub(super) struct Plan {
    pub entry: usize,
    pub bodies: Vec<Vec<Operation>>,
    pub components: Vec<Component>,
    pub names: HashMap<Arc<str>, usize>,
}

struct Loader<'a> {
    ids: HashMap<&'a str, usize>,
    names: HashMap<Arc<str>, usize>,
    components: Vec<Component>,
    operations: usize,
}

impl Loader<'_> {
    fn reference(&self, v: &V) -> Result<usize> {
        self.ids.get(string(v)?).copied().ok_or(())
    }

    fn component(&self, v: &V) -> Result<usize> {
        self.names.get(string(v)?).copied().ok_or(())
    }

    fn body(&mut self, ops: &[V]) -> Result<Vec<Operation>> {
        self.operations = self.operations.checked_add(ops.len()).ok_or(())?;
        if self.operations > LIMIT {
            return Err(());
        }
        collect(ops.iter().map(|v| {
            Ok(match string(&v["type"])? {
                "literal" => Operation::Literal(literal(v)?.into()),
                "template" => {
                    fields(v, &["type", "name"])?;
                    Operation::Call(self.reference(&v["name"])?)
                }
                "component" => {
                    fields(v, &["type", "name"])?;
                    Operation::Call(self.components[self.component(&v["name"])?].host)
                }
                "binding" => {
                    fields(v, &["type", "path", "escape"])?;
                    Operation::Dynamic(Box::new(Dynamic::Binding(
                        path(&v["path"])?,
                        v["escape"].as_bool().ok_or(())?,
                    )))
                }
                "when" => {
                    fields(v, &["type", "condition", "template"])?;
                    Operation::Dynamic(Box::new(Dynamic::When(
                        Box::new(Condition::load(&v["condition"], 0)?),
                        self.reference(&v["template"])?,
                    )))
                }
                "repeat" => {
                    fields(
                        v,
                        &["type", "alias", "collection", "diagnostic", "template"],
                    )?;
                    Operation::Dynamic(Box::new(Dynamic::Repeat {
                        alias: strings(&v["alias"])?,
                        path: path(&v["collection"])?,
                        diagnostic: string(&v["diagnostic"])?.into(),
                        body: self.reference(&v["template"])?,
                    }))
                }
                "tag" => Operation::Tag(Box::new(Tag::load(v, true)?)),
                "element" => {
                    fields(
                        v,
                        &[
                            "type", "name", "body", "closing", "opening", "props", "entry",
                            "normal", "count", "defaults",
                        ],
                    )?;
                    Operation::Element(Box::new(Element {
                        component: self.component(&v["name"])?,
                        body: self.reference(&v["body"])?,
                        closing: string(&v["closing"])?.into(),
                        opening: Tag::load(&v["opening"], false)?,
                        props: collect(array(&v["props"])?.iter().map(|p| {
                            fields(p, &["camelCase", "unchanged", "dataset", "value"])?;
                            Ok(Property {
                                keys: [
                                    vec![segment(string(&p["camelCase"])?)],
                                    vec![segment(string(&p["unchanged"])?)],
                                ],
                                group: if p["dataset"].is_null() {
                                    None
                                } else {
                                    Some(string(&p["dataset"])?.into())
                                },
                                value: Operand::load(&p["value"])?,
                            })
                        }))?,
                        entry: attrs(&v["entry"])?,
                        normal: attrs(&v["normal"])?,
                        count: count(&v["count"])?,
                        defaults: defaults(&v["defaults"])?,
                    }))
                }
                _ => return Err(()),
            })
        }))
    }
}

// Preserve the historical metadata-expansion accounting without constructing IR.
// Only already validated host defaults enter this serialization-size calculation.
struct Bytes(usize);

impl std::io::Write for Bytes {
    fn write(&mut self, bytes: &[u8]) -> std::io::Result<usize> {
        self.0 = self
            .0
            .checked_add(bytes.len())
            .ok_or_else(|| std::io::Error::other("FAST metadata size overflow"))?;
        Ok(bytes.len())
    }

    fn flush(&mut self) -> std::io::Result<()> {
        Ok(())
    }
}

fn json_bytes(v: &(impl serde::Serialize + ?Sized)) -> Result<usize> {
    let mut bytes = Bytes(0);
    serde_json::to_writer(&mut bytes, v).map_err(|_| ())?;
    Ok(bytes.0)
}

fn sequence_bytes(lengths: impl IntoIterator<Item = Result<usize>>) -> Result<usize> {
    let mut size = 2usize;
    let mut first = true;
    for length in lengths {
        size = size
            .checked_add(length?)
            .and_then(|n| n.checked_add(usize::from(!first)))
            .ok_or(())?;
        first = false;
    }
    Ok(size)
}

fn value_bytes(v: &V) -> Result<usize> {
    let kind = string(&v["type"])?;
    let value = match kind {
        "null" => return sequence_bytes([json_bytes(&v["type"])]),
        "array" => sequence_bytes(array(&v["value"])?.iter().map(value_bytes))?,
        "object" => sequence_bytes(v["value"].as_object().ok_or(())?.iter().map(|(key, v)| {
            json_bytes(key)?
                .checked_add(1)
                .and_then(|n| n.checked_add(value_bytes(v).ok()?))
                .ok_or(())
        }))?,
        _ => json_bytes(&v["value"])?,
    };
    sequence_bytes([json_bytes(&v["type"]), Ok(value)])
}

fn operand_bytes(v: &V) -> Result<usize> {
    if v["type"] == "path" {
        sequence_bytes([Ok(6), json_bytes(&v["path"])])
    } else {
        sequence_bytes([Ok(7), value_bytes(&v["value"])])
    }
}

fn condition_bytes(v: &V) -> Result<usize> {
    match string(&v["type"])? {
        "and" | "or" => sequence_bytes([
            Ok(4),
            condition_bytes(&v["left"]),
            condition_bytes(&v["right"]),
        ]),
        "compare" => sequence_bytes([
            Ok(9),
            json_bytes(&v["operator"]),
            json_bytes(&v["path"]),
            operand_bytes(&v["value"]),
        ]),
        _ => sequence_bytes([json_bytes(&v["type"]), json_bytes(&v["path"])]),
    }
}

fn attribute_bytes(v: &V) -> Result<usize> {
    match string(&v["type"])? {
        "literal" => sequence_bytes([Ok(9), json_bytes(&v["html"])]),
        "attribute" => sequence_bytes([
            Ok(11),
            json_bytes(&v["name"]),
            json_bytes(&v["path"]),
            json_bytes(&v["boolean"]),
            json_bytes(&v["primitive"]),
        ]),
        "conditional" => sequence_bytes([
            Ok(13),
            condition_bytes(&v["condition"]),
            json_bytes(&v["html"]),
        ]),
        "quoted" => sequence_bytes([
            Ok(8),
            json_bytes(&v["name"]),
            sequence_bytes(array(&v["parts"])?.iter().map(|p| {
                if p["type"] == "literal" {
                    attribute_bytes(p)
                } else {
                    sequence_bytes([Ok(9), json_bytes(&p["path"])])
                }
            })),
        ]),
        _ => Err(()),
    }
}

fn defaults_bytes(v: Option<&V>) -> Result<usize> {
    match v {
        None => Ok(2),
        Some(v) => {
            sequence_bytes(array(v)?.iter().map(|v| {
                sequence_bytes([json_bytes(&v["name"]), attribute_bytes(&v["attribute"])])
            }))
        }
    }
}

struct Root<'a> {
    shadow: usize,
    tag: &'a str,
    defaults: Option<&'a V>,
    defaults_bytes: usize,
    interior: &'a [V],
}

impl Plan {
    pub fn load(wire: &V) -> Result<Self> {
        fields(wire, &["entry", "templates", "components"])?;
        let templates = wire["templates"].as_object().ok_or(())?;
        if templates.len() >= LIMIT || templates.keys().any(String::is_empty) {
            return Err(());
        }
        let registry = wire["components"].as_object().ok_or(())?;
        let mut loader = Loader {
            ids: templates
                .keys()
                .enumerate()
                .map(|(id, name)| (name.as_str(), id))
                .collect(),
            names: HashMap::new(),
            components: Vec::new(),
            operations: 0,
        };
        let entry = templates.len();
        let mut bodies: Vec<Vec<Operation>> = (0..=entry).map(|_| Vec::new()).collect();
        let empty = bodies.len();
        if !registry.is_empty() {
            bodies.push(Vec::new());
        }
        let mut roots: HashMap<&str, Root<'_>> = HashMap::new();
        let mut derived_bytes = 0usize;
        for (name, reference) in registry {
            if name.is_empty() {
                return Err(());
            }
            loader.reference(reference)?;
            let reference = string(reference)?;
            if !roots.contains_key(reference) {
                let all_ops = array(&templates[reference])?;
                let (host_defaults, ops) = if all_ops
                    .first()
                    .is_some_and(|v| v["type"] == "host-attributes")
                {
                    fields(&all_ops[0], &["type", "attributes"])?;
                    // Validate defaults even when all component hosts are unused.
                    defaults(&all_ops[0]["attributes"])?;
                    (Some(&all_ops[0]["attributes"]), &all_ops[1..])
                } else {
                    (None, all_ops)
                };
                if ops.len() < 2 {
                    return Err(());
                }
                let tag = literal(&ops[0])?;
                if literal(ops.last().ok_or(())?)? != "</template>" {
                    return Err(());
                }
                let shadow = bodies.len();
                bodies.push(Vec::new());
                derived_bytes = derived_bytes
                    .checked_add(json_bytes(&templates[reference])?)
                    .ok_or(())?;
                roots.insert(
                    reference,
                    Root {
                        shadow,
                        tag,
                        defaults: host_defaults,
                        defaults_bytes: defaults_bytes(host_defaults)?,
                        interior: &ops[1..ops.len() - 1],
                    },
                );
            }
            let root = &roots[reference];
            derived_bytes = derived_bytes
                .checked_add(root.defaults_bytes)
                .and_then(|n| n.checked_add(root.tag.len().checked_mul(2)?))
                .and_then(|n| n.checked_add(name.len().checked_mul(5)?))
                .and_then(|n| n.checked_add(512))
                .ok_or(())?;
            if derived_bytes > 64 * 1024 * 1024 {
                return Err(());
            }
            let host = bodies.len();
            let component = loader.components.len();
            let base = format!("<{name}").into_boxed_str().into_string();
            let opening = format!("{base}>").into_boxed_str().into_string();
            let host_defaults = match root.defaults {
                Some(v) => defaults(v)?,
                None => Vec::new(),
            };
            bodies.push(vec![Operation::Element(Box::new(Element {
                component,
                body: empty,
                closing: format!("</{name}>").into_boxed_str().into_string(),
                opening: Tag {
                    plain: vec![Attribute::Literal(opening.clone())],
                    hydrated: vec![Attribute::Literal(opening)],
                    count: 0,
                    ending: ">".into(),
                },
                props: Vec::new(),
                entry: vec![Attribute::Literal(base.clone())],
                normal: vec![Attribute::Literal(base)],
                count: 0,
                defaults: host_defaults,
            }))]);
            let name: Arc<str> = Arc::from(name.as_str());
            loader.names.insert(name.clone(), component);
            loader.components.push(Component {
                closing: format!("</{name}>"),
                name,
                shadow: root.shadow,
                host,
                tag: root.tag.into(),
            });
        }
        if bodies.len() > LIMIT {
            return Err(());
        }
        loader.operations = registry.len();
        for (name, ops) in templates {
            let ops = array(ops)?;
            let ops = if roots.contains_key(name.as_str())
                && ops.first().is_some_and(|v| v["type"] == "host-attributes")
            {
                &ops[1..]
            } else {
                ops
            };
            bodies[loader.ids[name.as_str()]] = loader.body(ops)?;
        }
        for root in roots.values() {
            bodies[root.shadow] = loader.body(root.interior)?;
        }
        bodies[entry] = loader.body(array(&wire["entry"])?)?;
        Ok(Self {
            entry,
            bodies,
            components: loader.components,
            names: loader.names,
        }
        .compact())
    }

    /// Validate every body before following references and dropping unreachable data.
    fn compact(mut self) -> Self {
        let mut remap = vec![usize::MAX; self.bodies.len()];
        let mut pending = vec![self.entry];
        for component in &self.components {
            pending.extend([component.host, component.shadow]);
        }
        while let Some(body) = pending.pop() {
            if remap[body] != usize::MAX {
                continue;
            }
            remap[body] = 0;
            for operation in &mut self.bodies[body] {
                if let Some(target) = operation.target() {
                    pending.push(*target);
                }
            }
        }
        let mut next = 0;
        for target in &mut remap {
            if *target != usize::MAX {
                *target = next;
                next += 1;
            }
        }
        self.entry = remap[self.entry];
        for component in &mut self.components {
            component.host = remap[component.host];
            component.shadow = remap[component.shadow];
        }
        let mut bodies = Vec::with_capacity(next);
        for (id, mut body) in self.bodies.into_iter().enumerate() {
            if remap[id] == usize::MAX {
                continue;
            }
            for operation in &mut body {
                if let Some(target) = operation.target() {
                    *target = remap[*target];
                }
            }
            bodies.push(body);
        }
        self.bodies = bodies;
        self.components = self.components.into_boxed_slice().into_vec();
        self
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn tightly_sized<T>(values: &Vec<T>) {
        assert_eq!(values.capacity(), values.len());
    }

    #[test]
    fn preparation_discards_unreachable_body_capacity() {
        let templates: serde_json::Map<_, _> = (0..17)
            .map(|index| (format!("unused{index}"), json!([])))
            .collect();
        let prepared = Plan::load(&json!({
            "entry":[{"type":"literal","html":"retained"}],
            "templates":templates,"components":{},
        }))
        .unwrap();
        assert_eq!(prepared.bodies.len(), 1);
        tightly_sized(&prepared.bodies);
        tightly_sized(&prepared.bodies[prepared.entry]);
        tightly_sized(&prepared.components);
    }

    #[test]
    fn operation_budget_includes_preceding_and_derived_bodies() {
        let mut loader = Loader {
            ids: HashMap::new(),
            names: HashMap::new(),
            components: Vec::new(),
            operations: LIMIT - 3,
        };
        let interior = [json!({"type":"literal","html":"shadow"})];
        loader.body(&interior).unwrap();
        let complete = [
            json!({"type":"literal","html":"<template>"}),
            json!({"type":"literal","html":"</template>"}),
        ];
        loader.body(&complete).unwrap();
        loader.body(&[]).unwrap();
        assert!(loader.body(&interior).is_err());
    }

    #[test]
    fn host_default_expansion_counts_original_encoded_bytes() {
        let attributes = json!([
            ["literal", " role=\"list\"\n🦀"],
            ["attribute", "title", ["items", "+01"], false, true],
            [
                "quoted", "class",
                [["literal", "prefix\""], ["segment", ["items", "length"]]]
            ],
            [
                "conditional",
                [
                    "||", ["not", [""]],
                    ["&&", ["truthy", ["y"]], ["compare", ">=", ["n"], ["path", ["other"]]]]
                ],
                " selected"
            ],
            [
                "conditional",
                ["compare", "!=", ["value"], ["value", ["object", {
                    "escaped\nkey\"":["array",[
                        ["number","01.00"],["bool",true],["bool",false],["null"],
                        ["string","<&"],["object",{"n":["number","-0"]}],
                    ]],
                    "z":["number","Infinity"],
                }]]],
                " checked"
            ],
        ]);
        let expected: V = attributes
            .as_array()
            .unwrap()
            .iter()
            .enumerate()
            .map(|(index, attribute)| json!([format!("attribute{index}"), attribute]))
            .collect();
        let ir = json!({
            "entry":0,
            "bodies":[[],[["element",{"defaults":expected}]],[]],
            "components":{"test-card":{"host":1,"shadow":2,"tag":"<template>"}},
        });
        let wire = crate::server_plan::encode(&ir);
        let attributes = &wire["templates"]["template0"][0]["attributes"];
        defaults(attributes).unwrap();
        assert_eq!(
            defaults_bytes(Some(attributes)).unwrap(),
            serde_json::to_vec(&expected).unwrap().len(),
        );
        Plan::load(&wire).unwrap();
    }

    #[test]
    fn preparation_keeps_public_roots_without_unreferenced_dsd_copies() {
        let content = "static body".repeat(8192);
        let mut wire = json!({
            "entry":[{"type":"component","name":"test-card"}],
            "templates":{
                "dsd":[
                    {"type":"literal","html":"<template shadowrootmode=\"open\">"},
                    {"type":"literal","html":content},
                    {"type":"literal","html":"</template>"},
                ],
                "unused":[{"type":"literal","html":"not executable"}],
            },
            "components":{"test-card":"dsd","other-card":"dsd"},
        });
        for directly_referenced in [false, true] {
            if directly_referenced {
                wire["entry"]
                    .as_array_mut()
                    .unwrap()
                    .push(json!({"type":"template","name":"dsd"}));
            }
            let prepared = Plan::load(&wire).unwrap();
            assert_eq!(
                prepared.bodies.len(),
                if directly_referenced { 6 } else { 5 }
            );
            let component = &prepared.components[prepared.names["test-card"]];
            let other = &prepared.components[prepared.names["other-card"]];
            assert_eq!(component.shadow, other.shadow);
            assert!(matches!(
                &prepared.bodies[component.shadow][0],
                Operation::Literal(value) if value == &content
            ));
            for component in &prepared.components {
                let Operation::Element(element) = &prepared.bodies[component.host][0] else {
                    panic!("public host was not retained");
                };
                assert!(prepared.bodies[element.body].is_empty());
                assert_eq!(element.component, prepared.names[component.name.as_ref()]);
            }
            if directly_referenced {
                let Operation::Call(body) = &prepared.bodies[prepared.entry][1] else {
                    panic!("explicit DSD reference was not retained");
                };
                assert!(matches!(
                    &prepared.bodies[*body][1],
                    Operation::Literal(value) if value == &content
                ));
            }
            let artifact = super::super::CompiledArtifact {
                plan: Arc::new(prepared),
            };
            let state = J::Object(HashMap::new());
            let shadow = format!("<template shadowrootmode=\"open\">{content}</template>");
            let mut expected = format!("<test-card>{shadow}</test-card>");
            if directly_referenced {
                expected.push_str(&shadow);
            }
            assert_eq!(
                artifact.render_entry(&state, &Default::default()).unwrap(),
                expected,
            );
            assert_eq!(
                artifact
                    .render_host("other-card", &state, &Default::default())
                    .unwrap(),
                format!("<other-card>{shadow}</other-card>"),
            );
            assert_eq!(
                artifact
                    .render_shadow("other-card", &state, &Default::default())
                    .unwrap(),
                shadow,
            );
        }
    }

    #[test]
    fn preparation_follows_skipped_control_flow_and_cycles_without_recursion() {
        let wire = json!({
            "entry":[{"type":"when","condition":{"type":"truthy","path":["enabled"]},"template":"d"}],
            "templates":{
                "a":[{"type":"template","name":"b"}],
                "b":[{"type":"when","condition":{"type":"truthy","path":["again"]},"template":"a"}],
                "c":[{"type":"repeat","alias":["item"],"collection":["items"],"diagnostic":"item in items","template":"a"}],
                "d":[{"type":"template","name":"c"}],
                "unused":[{"type":"template","name":"unused"}],
            },
            "components":{},
        });
        let prepared = Plan::load(&wire).unwrap();
        assert_eq!(prepared.bodies.len(), 5);
        assert_eq!(prepared.entry, 4);
        assert!(matches!(prepared.bodies[0][0], Operation::Call(1)));
        let Operation::Dynamic(operation) = &prepared.bodies[2][0] else {
            panic!("repeat was not retained");
        };
        assert!(matches!(
            operation.as_ref(),
            Dynamic::Repeat { body: 0, .. }
        ));
    }

    #[test]
    fn prepared_plan_owns_decoded_values_and_resolves_numeric_targets() {
        let attributes = json!([
            {"type":"literal","html":"fixed"},
            {"type":"conditional","condition":{
                "type":"or","left":{"type":"not","path":["x"]},
                "right":{"type":"and","left":{"type":"truthy","path":["y"]},
                    "right":{"type":"compare","operator":">=","path":["n"],"value":{"type":"path","path":["other"]}}},
            },"html":" selected"},
            {"type":"attribute","name":"title","path":["items","+01"],"boolean":false,"primitive":true},
            {"type":"quoted","name":"class","parts":[{"type":"literal","html":"prefix"},{"type":"segment","path":["items","length"]}]},
        ]);
        let tag = json!({
            "plain":attributes,"hydrated":attributes,"count":2,"ending":">",
        });
        let value = json!({"type":"object","value":{
            "z":{"type":"number","value":"Infinity"},
            "a":{"type":"array","value":[
                {"type":"number","value":"01.00"},{"type":"bool","value":true},
                {"type":"null"},{"type":"string","value":"<&"},
                {"type":"object","value":{"n":{"type":"number","value":"-0"}}},
            ]},
        }});
        let wire = json!({
            "entry":[
                {"type":"template","name":"body"},
                {"type":"binding","path":["items","000"],"escape":true},
                {"type":"when","condition":{"type":"compare","operator":"!=","path":["value"],"value":{"type":"value","value":value}},"template":"body"},
                {"type":"repeat","alias":["item"],"collection":["items"],"diagnostic":"item in items","template":"body"},
                {"type":"element","name":"z-card","body":"body","closing":"</z-card>",
                    "opening":tag,"entry":attributes,"normal":attributes,
                    "props":[{"camelCase":"fooBar","unchanged":"foo-bar","dataset":"nested","value":{"type":"value","value":value}}],
                    "count":2,"defaults":[{"name":"role","attribute":{"type":"literal","html":" role=\"group\""}}]},
            ],
            "templates":{
                "body":[{"type":"literal","html":"ok"}],
                "dsd":[{"type":"literal","html":"<template>"},{"type":"literal","html":"</template>"}],
            },
            "components":{"a-card":"dsd","z-card":"dsd"},
        });
        let prepared = Plan::load(&wire).unwrap();
        drop(wire);
        tightly_sized(&prepared.bodies);
        tightly_sized(&prepared.components);
        for body in &prepared.bodies {
            tightly_sized(body);
        }
        for component in &prepared.components {
            let Operation::Element(host) = &prepared.bodies[component.host][0] else {
                panic!("host was not decoded");
            };
            assert_eq!(host.closing.capacity(), host.closing.len());
            for attributes in [
                &host.opening.plain,
                &host.opening.hydrated,
                &host.entry,
                &host.normal,
            ] {
                for attribute in attributes {
                    let Attribute::Literal(value) = attribute else {
                        panic!("host literal was not decoded");
                    };
                    assert_eq!(value.capacity(), value.len());
                }
            }
        }
        let Operation::Element(element) = &prepared.bodies[prepared.entry][4] else {
            panic!("element was not decoded");
        };
        tightly_sized(&element.props);
        tightly_sized(&element.defaults);
        let Attribute::Quoted(_, parts) = &element.entry[3] else {
            panic!("quoted attribute was not decoded");
        };
        tightly_sized(parts);
        let Operation::Dynamic(repeat) = &prepared.bodies[prepared.entry][3] else {
            panic!("repeat was not decoded");
        };
        let Dynamic::Repeat { alias, path, .. } = repeat.as_ref() else {
            panic!("repeat was not decoded");
        };
        tightly_sized(alias);
        tightly_sized(path);
        assert_eq!(element.component, prepared.names["z-card"]);
        assert!(prepared.bodies[prepared.components[element.component].shadow].is_empty());
        assert!(Arc::ptr_eq(
            &prepared.components[element.component].name,
            prepared.names.get_key_value("z-card").unwrap().0,
        ));
        let Operation::Dynamic(op) = &prepared.bodies[prepared.entry][1] else {
            panic!("binding was not decoded");
        };
        let Dynamic::Binding(path, _) = op.as_ref() else {
            panic!("binding was not decoded");
        };
        tightly_sized(path);
        assert_eq!(path[1].array_index, Some(0));
        let Operand::Value(value) = &element.props[0].value else {
            panic!("static operand was not decoded");
        };
        let J::Object(object) = value else {
            panic!("static object")
        };
        let J::Array(values) = &object["a"] else {
            panic!("static array")
        };
        tightly_sized(values);
        assert!(matches!(values[0], J::Number(n) if n == 1.0));
        assert!(matches!(values[1], J::Bool(true)));
        assert!(matches!(values[2], J::Null));
        assert!(matches!(&values[3], J::String(value) if value == "<&"));
        assert!(matches!(object["z"], J::Number(n) if n == f64::INFINITY));
    }
}
