//! Typed private execution of decoded semantic artifacts.
//! JSON instructions exist only during loading.
use super::{J, V};
use std::collections::HashMap;
use std::sync::Arc;

fn array(v: &V) -> &[V] {
    v.as_array().unwrap()
}
fn string(v: &V) -> &str {
    v.as_str().unwrap()
}
fn index(v: &V) -> usize {
    v.as_u64().unwrap() as usize
}

fn decoded(v: &V) -> J {
    match string(&v[0]) {
        "null" => J::Null,
        "bool" => J::Bool(v[1].as_bool().unwrap()),
        "number" => J::Number(string(&v[1]).parse().unwrap()),
        "string" => J::String(string(&v[1]).into()),
        "array" => J::Array(array(&v[1]).iter().map(decoded).collect()),
        "object" => J::Object(
            v[1].as_object()
                .unwrap()
                .iter()
                .map(|(k, v)| (k.clone(), decoded(v)))
                .collect(),
        ),
        _ => unreachable!("validated value"),
    }
}

#[derive(Debug)]
pub(super) struct Segment {
    pub key: String,
    pub array_index: Option<usize>,
}

pub(super) type Path = Vec<Segment>;

pub(super) fn path(v: &V) -> Path {
    array(v).iter().map(|v| segment(string(v))).collect()
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
    fn load(v: &V) -> Self {
        if v[0] == "path" {
            Self::Path(path(&v[1]))
        } else {
            Self::Value(decoded(&v[1]))
        }
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
    fn load(v: &V) -> Self {
        match string(v) {
            "==" => Self::Equal,
            "!=" => Self::NotEqual,
            ">" => Self::Greater,
            "<" => Self::Less,
            ">=" => Self::GreaterEqual,
            "<=" => Self::LessEqual,
            _ => unreachable!("validated comparison"),
        }
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
    fn load(v: &V) -> Self {
        match string(&v[0]) {
            "||" => Self::Or(Box::new(Self::load(&v[1])), Box::new(Self::load(&v[2]))),
            "&&" => Self::And(Box::new(Self::load(&v[1])), Box::new(Self::load(&v[2]))),
            "not" => Self::Not(path(&v[1])),
            "truthy" => Self::Truthy(path(&v[1])),
            "compare" => Self::Compare(
                Comparison::load(&v[1]),
                path(&v[2]),
                Box::new(Operand::load(&v[3])),
            ),
            _ => unreachable!("validated condition"),
        }
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
    fn load(v: &V) -> Self {
        match string(&v[0]) {
            "literal" => Self::Literal(string(&v[1]).into()),
            "conditional" => {
                Self::Conditional(Box::new(Condition::load(&v[1])), string(&v[2]).into())
            }
            "attribute" => Self::Bound {
                name: string(&v[1]).into(),
                path: path(&v[2]),
                boolean: v[3].as_bool().unwrap(),
                property: v[4].as_bool().unwrap(),
            },
            "quoted" => Self::Quoted(
                string(&v[1]).into(),
                array(&v[2])
                    .iter()
                    .map(|p| {
                        if p[0] == "literal" {
                            Part::Literal(string(&p[1]).into())
                        } else {
                            Part::Segment(path(&p[1]))
                        }
                    })
                    .collect(),
            ),
            _ => unreachable!("validated attribute"),
        }
    }
}

fn attrs(v: &V) -> Vec<Attribute> {
    array(v).iter().map(Attribute::load).collect()
}

#[derive(Debug)]
pub(super) struct Tag {
    pub plain: Vec<Attribute>,
    pub hydrated: Vec<Attribute>,
    pub count: usize,
    pub ending: String,
}

impl Tag {
    fn load(v: &V) -> Self {
        Self {
            plain: attrs(&v["plain"]),
            hydrated: attrs(&v["hydrated"]),
            count: index(&v["count"]),
            ending: string(&v["ending"]).into(),
        }
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

#[derive(Debug)]
pub(super) struct Component {
    pub name: Arc<str>,
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

impl Plan {
    /// Called only after eager validation of the entire wire graph.
    pub fn load(ir: &V) -> Self {
        let components: Vec<_> = ir["components"]
            .as_object()
            .unwrap()
            .iter()
            .map(|(name, c)| Component {
                name: Arc::from(name.as_str()),
                shadow: index(&c["shadow"]),
                host: index(&c["host"]),
                tag: string(&c["tag"]).into(),
            })
            .collect();
        let names: HashMap<_, _> = components
            .iter()
            .enumerate()
            .map(|(id, c)| (c.name.clone(), id))
            .collect();
        let bodies = array(&ir["bodies"])
            .iter()
            .map(|body| {
                array(body)
                    .iter()
                    .map(|op| match string(&op[0]) {
                        "literal" => Operation::Literal(string(&op[1]).into()),
                        "tag" => Operation::Tag(Box::new(Tag::load(&op[1]))),
                        "call" => Operation::Call(index(&op[1])),
                        "binding" => Operation::Dynamic(Box::new(Dynamic::Binding(
                            path(&op[1]),
                            op[2].as_bool().unwrap(),
                        ))),
                        "when" => Operation::Dynamic(Box::new(Dynamic::When(
                            Box::new(Condition::load(&op[1])),
                            index(&op[2]),
                        ))),
                        "repeat" => Operation::Dynamic(Box::new(Dynamic::Repeat {
                            alias: array(&op[1]).iter().map(|v| string(v).into()).collect(),
                            path: path(&op[2]),
                            diagnostic: string(&op[3]).into(),
                            body: index(&op[4]),
                        })),
                        "element" => {
                            let el = &op[1];
                            Operation::Element(Box::new(Element {
                                component: names[string(&el["name"])],
                                body: index(&el["body"]),
                                closing: string(&el["closing"]).into(),
                                opening: Tag::load(&el["opening"]),
                                props: array(&el["props"])
                                    .iter()
                                    .map(|p| Property {
                                        keys: [
                                            vec![segment(string(&p[0]))],
                                            vec![segment(string(&p[1]))],
                                        ],
                                        group: p[2].as_str().map(String::from),
                                        value: Operand::load(&p[3]),
                                    })
                                    .collect(),
                                entry: attrs(&el["entry"]),
                                normal: attrs(&el["normal"]),
                                count: index(&el["count"]),
                                defaults: array(&el["defaults"])
                                    .iter()
                                    .map(|p| (string(&p[0]).into(), Attribute::load(&p[1])))
                                    .collect(),
                            }))
                        }
                        _ => unreachable!("validated operation"),
                    })
                    .collect()
            })
            .collect();
        Self {
            entry: index(&ir["entry"]),
            bodies,
            components,
            names,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn prepared_plan_owns_decoded_values_and_resolves_numeric_targets() {
        let attributes = json!([
            ["literal", "fixed"],
            [
                "conditional",
                [
                    "||",
                    ["not", ["x"]],
                    [
                        "&&",
                        ["truthy", ["y"]],
                        ["compare", ">=", ["n"], ["path", ["other"]]]
                    ]
                ],
                " selected"
            ],
            ["attribute", "title", ["items", "+01"], false, true],
            [
                "quoted",
                "class",
                [["literal", "prefix"], ["segment", ["items", "length"]]]
            ],
        ]);
        let tag = json!({
            "plain":attributes,"hydrated":attributes,"count":2,"ending":">",
        });
        let value = json!(["object", {
            "z":["number","Infinity"],
            "a":["array",[
                ["number","01.00"],["bool",true],["null"],["string","<&"],
                ["object",{"n":["number","-0"]}],
            ]],
        }]);
        let ir = json!({
            "entry":1,
            "bodies":[
                [["literal","ok"],["tag",tag]],
                [
                    ["call",0],["binding",["items","000"],true],
                    ["when",["compare","!=",["value"],["value",value]],0],
                    ["repeat",["item"],["items"],"item in items",0],
                    ["element",{
                        "name":"z-card","body":0,"closing":"</z-card>",
                        "opening":tag,"entry":attributes,"normal":attributes,
                        "props":[["fooBar","foo-bar","nested",["value",value]]],
                        "count":2,"defaults":[["role",["literal"," role=\"group\""]]],
                    }],
                ],
            ],
            "components":{
                "a-card":{"host":0,"shadow":1,"tag":"<template>"},
                "z-card":{"host":1,"shadow":0,"tag":"<template>"},
            },
        });
        super::super::validate_artifact(&ir).unwrap();
        let prepared = Plan::load(&ir);
        drop(ir);
        let Operation::Element(element) = &prepared.bodies[1][4] else {
            panic!("element was not decoded");
        };
        assert_eq!(element.component, prepared.names["z-card"]);
        assert_eq!(prepared.components[element.component].shadow, 0);
        assert!(Arc::ptr_eq(
            &prepared.components[element.component].name,
            prepared.names.get_key_value("z-card").unwrap().0,
        ));
        let Operation::Dynamic(op) = &prepared.bodies[1][1] else {
            panic!("binding was not decoded");
        };
        let Dynamic::Binding(path, _) = op.as_ref() else {
            panic!("binding was not decoded");
        };
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
        assert!(matches!(values[0], J::Number(n) if n == 1.0));
        assert!(matches!(values[1], J::Bool(true)));
        assert!(matches!(values[2], J::Null));
        assert!(matches!(&values[3], J::String(value) if value == "<&"));
        assert!(matches!(object["z"], J::Number(n) if n == f64::INFINITY));
    }
}
