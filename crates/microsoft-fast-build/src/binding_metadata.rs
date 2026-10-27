use crate::attribute::{
    extract_directive_content_range, extract_directive_expr_range, find_tag_end,
    parse_element_attribute_parts, ParsedAttribute,
};
use crate::code_escape::mask_code_sample_elements;
use crate::directive::{next_event, parse_repeat_expr, Directive, RenderEvent};
#[cfg(target_arch = "wasm32")]
use crate::json::{escape_json_str, json_string_array};

/// One lexical repeat frame, ordered outermost to innermost.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BindingScope {
    pub variable: String,
    pub iterable: String,
}

/// A position in the complete HTML input supplied to `parse_f_templates`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct SourcePosition {
    /// Zero-based UTF-16 code-unit offset.
    pub offset: usize,
    /// One-based line; CRLF is one line break, as are lone CR and LF.
    pub line: usize,
    /// One-based UTF-16 code-unit column; tabs count as one code unit.
    pub column: usize,
}

/// Half-open range of the trimmed expression, excluding binding delimiters.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct SourceSpan {
    pub start: SourcePosition,
    pub end: SourcePosition,
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
    /// Authored expression location; repeat bindings locate the iterable only.
    pub span: SourceSpan,
}

pub(crate) struct SourceLocations<'a> {
    source: &'a str,
    byte: usize,
    position: SourcePosition,
    previous_cr: bool,
}

impl<'a> SourceLocations<'a> {
    pub(crate) fn new(source: &'a str) -> Self {
        Self {
            source,
            byte: 0,
            position: SourcePosition {
                offset: 0,
                line: 1,
                column: 1,
            },
            previous_cr: false,
        }
    }

    pub(crate) fn position(&mut self, byte: usize) -> SourcePosition {
        // Discovery visits locations in source order, so coordinates need only one pass.
        assert!(
            byte >= self.byte,
            "source locations must advance in source order"
        );
        for ch in self.source[self.byte..byte].chars() {
            self.position.offset += ch.len_utf16();
            match ch {
                '\r' => {
                    self.position.line += 1;
                    self.position.column = 1;
                }
                '\n' => {
                    if !self.previous_cr {
                        self.position.line += 1;
                    }
                    self.position.column = 1;
                }
                _ => self.position.column += ch.len_utf16(),
            }
            self.previous_cr = ch == '\r';
        }
        self.byte = byte;
        self.position
    }
}

pub(crate) fn collect_bindings(
    content: &str,
    content_offset: usize,
    host_attrs: &[ParsedAttribute],
    host_offset: usize,
    locations: &mut SourceLocations<'_>,
) -> Vec<BindingMetadata> {
    let mut collector = BindingCollector {
        locations,
        bindings: Vec::new(),
    };
    collector.collect_attributes(host_attrs, host_offset, true, &[]);
    collector.scan(&mask_code_sample_elements(content), content_offset, &[]);
    collector.bindings
}

struct BindingCollector<'a, 'source> {
    locations: &'a mut SourceLocations<'source>,
    bindings: Vec<BindingMetadata>,
}

impl BindingCollector<'_, '_> {
    fn scan(&mut self, content: &str, offset: usize, scopes: &[BindingScope]) {
        let mut pos = 0;
        while let Some(event) = next_event(content, pos, None) {
            match event {
                RenderEvent::PlainTag(at) => {
                    let Some(end) = find_tag_end(content, at) else {
                        break;
                    };
                    self.collect_attributes(
                        &parse_element_attribute_parts(&content[at..end]),
                        offset + at,
                        false,
                        scopes,
                    );
                    pos = crate::attribute::style_element_end(content, at).unwrap_or(end);
                }
                RenderEvent::Directive(directive) => match directive {
                    Directive::DoubleBrace(at) | Directive::TripleBrace(at) => {
                        let (open, close, kind) = if matches!(directive, Directive::TripleBrace(_))
                        {
                            (3, "}}}", "unescapedContent")
                        } else {
                            (2, "}}", "content")
                        };
                        let start = at + open;
                        let Some(end) = content[start..].find(close).map(|end| start + end) else {
                            break;
                        };
                        self.add_binding(&content[start..end], offset + start, kind, scopes, false);
                        pos = end + close.len();
                    }
                    Directive::When(at) | Directive::Repeat(at) => {
                        let is_repeat = matches!(directive, Directive::Repeat(_));
                        let tag = if is_repeat { "f-repeat" } else { "f-when" };
                        let Some((body, after)) = extract_directive_content_range(content, at, tag)
                        else {
                            break;
                        };
                        let mut nested = scopes.to_vec();
                        if let Some(range) = extract_directive_expr_range(content, at) {
                            let expression = &content[range.clone()];
                            if is_repeat {
                                if let Some((variable, iterable)) = parse_repeat_expr(expression) {
                                    self.add_binding(
                                        &iterable,
                                        offset + range.end - iterable.len(),
                                        "repeat",
                                        scopes,
                                        false,
                                    );
                                    nested.push(BindingScope { variable, iterable });
                                } else {
                                    self.add_binding(
                                        expression,
                                        offset + range.start,
                                        "repeat",
                                        scopes,
                                        true,
                                    );
                                }
                            } else {
                                self.add_binding(
                                    expression,
                                    offset + range.start,
                                    "when",
                                    scopes,
                                    true,
                                );
                            }
                        }
                        self.scan(&content[body.clone()], offset + body.start, &nested);
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
        &mut self,
        attrs: &[ParsedAttribute],
        offset: usize,
        host: bool,
        scopes: &[BindingScope],
    ) {
        for attr in attrs {
            let name = &attr.name;
            let Some(value) = &attr.value else { continue };
            let value_offset = offset + attr.value_start;
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
                        let start = value_offset + value.len() - value.trim_start().len() + 1;
                        self.add_binding(expression, start, kind, scopes, true);
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
                self.add_binding(
                    &value[start..end],
                    value_offset + start,
                    kind,
                    scopes,
                    name.starts_with('?'),
                );
                pos = end + 2;
            }
        }
    }

    fn add_binding(
        &mut self,
        expression: &str,
        offset: usize,
        kind: &str,
        scopes: &[BindingScope],
        compound: bool,
    ) {
        let start = offset + expression.len() - expression.trim_start().len();
        let expression = expression.trim();
        let span = SourceSpan {
            start: self.locations.position(start),
            end: self.locations.position(start + expression.len()),
        };
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
        self.bindings.push(BindingMetadata {
            name,
            expression: expression.to_string(),
            kind: kind.to_string(),
            paths,
            scope: scopes.to_vec(),
            value_type: (kind == "repeat" && !compound).then(|| "array".to_string()),
            optional: None,
            span,
        });
    }
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
        let position = |position: SourcePosition| format!(
            "{{\"offset\":{},\"line\":{},\"column\":{}}}",
            position.offset, position.line, position.column,
        );
        format!(
            "{{\"name\":{},\"expression\":{},\"kind\":{},\"paths\":{},\"scope\":[{}],\"type\":{},\"optional\":null,\"span\":{{\"start\":{},\"end\":{}}}}}",
            name, string(&binding.expression), string(&binding.kind), json_string_array(&binding.paths), scopes, value_type,
            position(binding.span.start), position(binding.span.end),
        )
    }).collect::<Vec<_>>();
    format!("[{}]", records.join(","))
}
