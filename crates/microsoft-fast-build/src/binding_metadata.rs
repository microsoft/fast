use crate::attribute::{
    extract_directive_content, extract_directive_expr, find_tag_end, parse_element_attributes,
};
use crate::code_escape::escape_code_sample_elements;
use crate::directive::{next_event, parse_repeat_expr, Directive, RenderEvent};
#[cfg(target_arch = "wasm32")]
use crate::json::{escape_json_str, json_string_array};

/// One lexical repeat frame, ordered outermost to innermost.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BindingScope {
    pub variable: String,
    pub iterable: String,
}

/// Syntactic binding information, not a declaration of application state.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BindingMetadata {
    /// A direct lookup path, or `None` for compound/client expressions.
    pub name: Option<String>,
    pub expression: String,
    pub kind: String,
    pub paths: Vec<String>,
    pub scope: Vec<BindingScope>,
    /// Only repeat collections have a known array requirement.
    pub value_type: Option<String>,
    /// Required/optional application declarations cannot be inferred from HTML.
    pub optional: Option<bool>,
}

pub(crate) fn collect_bindings(
    content: &str,
    host_attrs: &[(String, Option<String>)],
) -> Vec<BindingMetadata> {
    let mut bindings = Vec::new();
    collect_attributes(host_attrs, true, &[], &mut bindings);
    scan(&escape_code_sample_elements(content), &[], &mut bindings);
    bindings
}

fn scan(content: &str, scopes: &[BindingScope], bindings: &mut Vec<BindingMetadata>) {
    let mut pos = 0;
    while let Some(event) = next_event(content, pos, None) {
        match event {
            RenderEvent::PlainTag(at) => {
                let Some(end) = find_tag_end(content, at) else {
                    break;
                };
                collect_attributes(
                    &parse_element_attributes(&content[at..end]),
                    false,
                    scopes,
                    bindings,
                );
                pos = end;
            }
            RenderEvent::Directive(directive) => match directive {
                Directive::DoubleBrace(at) | Directive::TripleBrace(at) => {
                    let (open, close, kind) = if matches!(directive, Directive::TripleBrace(_)) {
                        (3, "}}}", "unescapedContent")
                    } else {
                        (2, "}}", "content")
                    };
                    let start = at + open;
                    let Some(end) = content[start..].find(close).map(|end| start + end) else {
                        break;
                    };
                    add_binding(&content[start..end], kind, scopes, false, bindings);
                    pos = end + close.len();
                }
                Directive::When(at) | Directive::Repeat(at) => {
                    let is_repeat = matches!(directive, Directive::Repeat(_));
                    let tag = if is_repeat { "f-repeat" } else { "f-when" };
                    let Some((body, after)) = extract_directive_content(content, at, tag) else {
                        break;
                    };
                    let mut nested = scopes.to_vec();
                    if let Some(expression) = extract_directive_expr(content, at) {
                        if is_repeat {
                            if let Some((variable, iterable)) = parse_repeat_expr(&expression) {
                                add_binding(&iterable, "repeat", scopes, false, bindings);
                                nested.push(BindingScope { variable, iterable });
                            } else {
                                add_binding(&expression, "repeat", scopes, true, bindings);
                            }
                        } else {
                            add_binding(&expression, "when", scopes, true, bindings);
                        }
                    }
                    scan(&body, &nested, bindings);
                    pos = after;
                }
                Directive::CustomElement(_) => {
                    unreachable!("No locator is used for metadata discovery")
                }
            },
        }
    }
}

fn collect_attributes(
    attrs: &[(String, Option<String>)],
    host: bool,
    scopes: &[BindingScope],
    bindings: &mut Vec<BindingMetadata>,
) {
    for (name, value) in attrs {
        let Some(value) = value else { continue };
        let kind = if name.starts_with('@') {
            "event"
        } else if name.starts_with(':') {
            "property"
        } else if name.starts_with('?') {
            "booleanAttribute"
        } else if ["f-ref", "f-slotted", "f-children"]
            .iter()
            .any(|attr| name.eq_ignore_ascii_case(attr))
        {
            "attributeDirective"
        } else if host {
            "hostAttribute"
        } else {
            "attribute"
        };
        if ["event", "property", "attributeDirective"].contains(&kind) {
            let trimmed = value.trim();
            if !trimmed.starts_with("{{") {
                if let Some(expression) = trimmed
                    .strip_prefix('{')
                    .and_then(|value| value.strip_suffix('}'))
                {
                    add_binding(expression, kind, scopes, true, bindings);
                    continue;
                }
            }
        }
        let mut pos = 0;
        while let Some(at) = value[pos..].find("{{").map(|at| pos + at) {
            let start = at + 2;
            let Some(end) = value[start..].find("}}").map(|end| start + end) else {
                break;
            };
            add_binding(
                &value[start..end],
                kind,
                scopes,
                name.starts_with('?'),
                bindings,
            );
            pos = end + 2;
        }
    }
}

fn add_binding(
    expression: &str,
    kind: &str,
    scopes: &[BindingScope],
    compound: bool,
    bindings: &mut Vec<BindingMetadata>,
) {
    let expression = expression.trim();
    let paths = if expression.is_empty() {
        Vec::new()
    } else if compound {
        expression_paths(expression)
    } else {
        vec![expression.to_string()]
    };
    let name = if !expression.is_empty()
        && (!compound || (is_path(expression) && paths == [expression]))
    {
        Some(expression.to_string())
    } else {
        None
    };
    bindings.push(BindingMetadata {
        name,
        expression: expression.to_string(),
        kind: kind.to_string(),
        paths,
        scope: scopes.to_vec(),
        value_type: (kind == "repeat" && !compound).then(|| "array".to_string()),
        optional: None,
    });
}

fn is_path(value: &str) -> bool {
    !value.is_empty()
        && value.split('.').all(|segment| {
            !segment.is_empty()
                && segment
                    .chars()
                    .all(|ch| ch.is_alphanumeric() || ch == '_' || ch == '$')
        })
}

fn expression_paths(expression: &str) -> Vec<String> {
    let mut paths = Vec::new();
    let mut chars = expression.char_indices().peekable();
    while let Some((start, ch)) = chars.next() {
        if ch == '\'' || ch == '"' || ch == '`' {
            while let Some((_, next)) = chars.next() {
                if next == '\\' {
                    chars.next();
                } else if next == ch {
                    break;
                }
            }
        } else if ch.is_ascii_digit() {
            while chars
                .peek()
                .is_some_and(|(_, ch)| ch.is_ascii_digit() || *ch == '.')
            {
                chars.next();
            }
            if chars.peek().is_some_and(|(_, ch)| *ch == 'e' || *ch == 'E') {
                chars.next();
                if chars.peek().is_some_and(|(_, ch)| *ch == '+' || *ch == '-') {
                    chars.next();
                }
                while chars.peek().is_some_and(|(_, ch)| ch.is_ascii_digit()) {
                    chars.next();
                }
            }
        } else if ch.is_alphabetic() || ch == '_' || ch == '$' {
            let mut end = start + ch.len_utf8();
            while let Some(&(at, next)) = chars.peek() {
                if next.is_alphanumeric() || next == '_' || next == '$' || next == '.' {
                    chars.next();
                    end = at + next.len_utf8();
                } else {
                    break;
                }
            }
            let path = &expression[start..end];
            if !["true", "false", "null", "undefined"].contains(&path)
                && !paths.iter().any(|existing| existing == path)
            {
                paths.push(path.to_string());
            }
        }
    }
    paths
}

#[cfg(target_arch = "wasm32")]
pub(crate) fn bindings_json(bindings: &[BindingMetadata]) -> String {
    let records = bindings.iter().map(|binding| {
        let string = |value: &str| format!("\"{}\"", escape_json_str(value));
        let name = binding.name.as_deref().map(&string).unwrap_or_else(|| "null".to_string());
        let value_type = binding.value_type.as_deref().map(&string).unwrap_or_else(|| "null".to_string());
        let scopes = binding.scope.iter().map(|scope| format!(
            "{{\"variable\":{},\"iterable\":{}}}", string(&scope.variable), string(&scope.iterable),
        )).collect::<Vec<_>>().join(",");
        format!(
            "{{\"name\":{},\"expression\":{},\"kind\":{},\"paths\":{},\"scope\":[{}],\"type\":{},\"optional\":null}}",
            name, string(&binding.expression), string(&binding.kind), json_string_array(&binding.paths), scopes, value_type,
        )
    }).collect::<Vec<_>>();
    format!("[{}]", records.join(","))
}
