use std::borrow::Cow;
use std::cell::{Cell, RefCell};
use std::collections::HashMap;
use std::convert::Infallible;
use std::rc::Rc;

use html5ever::interface::{ElementFlags, NodeOrText, QuirksMode, TreeSink};
use html5ever::tendril::StrTendril;
use html5ever::tokenizer::TokenSink;
use html5ever::tree_builder::{TreeBuilder, TreeBuilderOpts};
use html5ever::{Attribute, ExpandedName, QualName};
use html5gum::emitters::html5ever::Html5everEmitter;
use html5gum::{Emitter, ForwardingEmitter, Tokenizer};
use markup5ever_rcdom::{Handle, Node, NodeData, RcDom};

use crate::binding_metadata::SourceLocations;
use crate::RenderError;

const HTML_NAMESPACE: &str = "http://www.w3.org/1999/xhtml";

/// An authored HTML slot declaration, located at its opening `<`.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TemplateSlot {
    /// Decoded slot name; the default slot has an empty name.
    pub name: String,
    /// One-based line in the complete authored HTML input.
    pub line: usize,
    /// One-based UTF-16 column; tabs count as one code unit.
    pub column: usize,
}

/// Inspect a named `<f-template>` without rendering or transforming its source.
///
/// Returns declarations in source order, including repeated names and slots in
/// nested ordinary templates or conditional/repeated content (once per declaration).
/// Other component definitions and nested declarative shadow roots are excluded.
/// Foreign slots are excluded, but HTML integration points are traversed.
///
/// Exactly one matching definition and one direct HTML `<template>` child are
/// required. Selection failures use the existing structured render errors.
pub fn extract_template_slots(
    html: &str,
    template_name: &str,
) -> Result<Vec<TemplateSlot>, RenderError> {
    if template_name.trim().is_empty() {
        return Err(RenderError::InvalidTemplateMetadata {
            message: "slot discovery requires a nonempty template name".into(),
        });
    }
    let parsed = parse(html);
    let mut pending = vec![parsed.dom.document.clone()];
    let mut definitions = Vec::new();
    while let Some(node) = pending.pop() {
        if is_html_element(&node, "f-template")
            && attribute(&node, "name").as_deref() == Some(template_name)
        {
            definitions.push((parsed.offset(&node)?, node.clone()));
        }
        pending.extend(children(&node));
    }
    definitions.sort_by_key(|(offset, _)| *offset);
    let (definition_at, definition) = match definitions.as_slice() {
        [] => {
            return Err(RenderError::UnknownTemplate {
                element: template_name.into(),
            })
        }
        [definition] => definition,
        [_, second, ..] => {
            return Err(RenderError::InvalidTemplateMetadata {
                message: format!("duplicate template name '{template_name}'"),
            }
            .at(html, second.0)
            .in_template(template_name))
        }
    };
    let templates: Vec<_> = definition
        .children
        .borrow()
        .iter()
        .filter(|node| is_html_element(node, "template"))
        .cloned()
        .collect();
    let root = match templates.as_slice() {
        [] => {
            return Err(RenderError::MissingInnerTemplate
                .at(html, *definition_at)
                .in_template(template_name))
        }
        [root] => root,
        [_, second, ..] => {
            return Err(RenderError::MultipleInnerTemplates {
                count: templates.len(),
            }
            .at(html, parsed.offset(second)?)
            .in_template(template_name))
        }
    };
    let mut declarations = Vec::new();
    pending.extend(children(root));
    while let Some(node) = pending.pop() {
        if is_html_element(&node, "f-template")
            || (is_html_element(&node, "template")
                && (attribute(&node, "shadowrootmode").is_some()
                    || attribute(&node, "shadowroot").is_some()))
        {
            continue;
        }
        if is_html_element(&node, "slot") {
            declarations.push((
                parsed.offset(&node)?,
                attribute(&node, "name").unwrap_or_default(),
            ));
        }
        pending.extend(children(&node));
    }
    declarations.sort_by_key(|(offset, _)| *offset);
    let mut locations = SourceLocations::new(html);
    Ok(declarations
        .into_iter()
        .map(|(offset, name)| {
            let position = locations.position(offset);
            TemplateSlot {
                name,
                line: position.line,
                column: position.column,
            }
        })
        .collect())
}

fn is_html_element(node: &Handle, tag: &str) -> bool {
    matches!(&node.data, NodeData::Element { name, .. }
        if name.ns.as_ref() == HTML_NAMESPACE && name.local.as_ref() == tag)
}

fn attribute(node: &Handle, name: &str) -> Option<String> {
    match &node.data {
        NodeData::Element { attrs, .. } => attrs
            .borrow()
            .iter()
            .find(|attr| attr.name.ns.as_ref().is_empty() && attr.name.local.as_ref() == name)
            .map(|attr| attr.value.to_string()),
        _ => None,
    }
}

fn children(node: &Handle) -> Vec<Handle> {
    let mut children = node.children.borrow().clone();
    if let NodeData::Element {
        template_contents, ..
    } = &node.data
    {
        if let Some(contents) = template_contents.borrow().as_ref() {
            children.push(contents.clone());
        }
    }
    children
}

fn parse(html: &str) -> LocatedDom {
    let sink = LocatedDom {
        dom: RcDom::default(),
        tag_start: Rc::new(Cell::new(0)),
        offsets: RefCell::new(HashMap::new()),
    };
    let tag_start = sink.tag_start.clone();
    let mut builder = TreeBuilder::new(
        sink,
        TreeBuilderOpts {
            scripting_enabled: true,
            ..Default::default()
        },
    );
    let emitter = LocatedEmitter {
        inner: Html5everEmitter::new(&mut builder),
        byte: 0,
        tag_start,
    };
    let Ok(()) = Tokenizer::new_with_emitter(html, emitter).finish();
    builder.sink
}

// Keep tokenizer byte positions alongside tree construction rather than
// searching decoded text or serialized/reparented DOM nodes for their source.
struct LocatedEmitter<'a, S: TokenSink> {
    inner: Html5everEmitter<'a, S>,
    byte: usize,
    tag_start: Rc<Cell<usize>>,
}

impl<S: TokenSink> ForwardingEmitter for LocatedEmitter<'_, S> {
    type Token = Infallible;

    fn inner(&mut self) -> &mut impl Emitter<Token = Self::Token> {
        &mut self.inner
    }

    fn move_position(&mut self, offset: isize) {
        self.byte = self.byte.saturating_add_signed(offset);
        Emitter::move_position(&mut self.inner, offset);
    }

    fn start_open_tag(&mut self) {
        self.tag_start.set(self.byte.saturating_sub(1));
        Emitter::start_open_tag(&mut self.inner);
    }
}

struct LocatedDom {
    dom: RcDom,
    tag_start: Rc<Cell<usize>>,
    offsets: RefCell<HashMap<*const Node, usize>>,
}

impl LocatedDom {
    fn offset(&self, node: &Handle) -> Result<usize, RenderError> {
        self.offsets
            .borrow()
            .get(&Rc::as_ptr(node))
            .copied()
            .ok_or_else(|| RenderError::InvalidTemplateMetadata {
                message: "slot discovery requires an authored element location".into(),
            })
    }
}

impl TreeSink for LocatedDom {
    type Handle = Handle;
    type Output = Self;
    type ElemName<'a> = ExpandedName<'a>;

    fn finish(self) -> Self {
        self
    }
    fn parse_error(&self, message: Cow<'static, str>) {
        self.dom.parse_error(message);
    }
    fn get_document(&self) -> Handle {
        self.dom.get_document()
    }
    fn elem_name<'a>(&'a self, node: &'a Handle) -> ExpandedName<'a> {
        self.dom.elem_name(node)
    }

    fn create_element(&self, name: QualName, attrs: Vec<Attribute>, flags: ElementFlags) -> Handle {
        let track = name.ns.as_ref() == HTML_NAMESPACE
            && matches!(name.local.as_ref(), "f-template" | "template" | "slot");
        let node = self.dom.create_element(name, attrs, flags);
        if track {
            self.offsets
                .borrow_mut()
                .insert(Rc::as_ptr(&node), self.tag_start.get());
        }
        node
    }

    fn create_comment(&self, text: StrTendril) -> Handle {
        self.dom.create_comment(text)
    }
    fn create_pi(&self, target: StrTendril, data: StrTendril) -> Handle {
        self.dom.create_pi(target, data)
    }
    fn append(&self, parent: &Handle, child: NodeOrText<Handle>) {
        self.dom.append(parent, child);
    }
    fn append_based_on_parent_node(
        &self,
        element: &Handle,
        previous: &Handle,
        child: NodeOrText<Handle>,
    ) {
        self.dom
            .append_based_on_parent_node(element, previous, child);
    }
    fn append_doctype_to_document(&self, name: StrTendril, public: StrTendril, system: StrTendril) {
        self.dom.append_doctype_to_document(name, public, system);
    }
    fn get_template_contents(&self, node: &Handle) -> Handle {
        self.dom.get_template_contents(node)
    }
    fn same_node(&self, first: &Handle, second: &Handle) -> bool {
        self.dom.same_node(first, second)
    }
    fn set_quirks_mode(&self, mode: QuirksMode) {
        self.dom.set_quirks_mode(mode);
    }
    fn append_before_sibling(&self, sibling: &Handle, node: NodeOrText<Handle>) {
        self.dom.append_before_sibling(sibling, node);
    }
    fn add_attrs_if_missing(&self, node: &Handle, attrs: Vec<Attribute>) {
        self.dom.add_attrs_if_missing(node, attrs);
    }
    fn remove_from_parent(&self, node: &Handle) {
        self.dom.remove_from_parent(node);
    }
    fn reparent_children(&self, node: &Handle, parent: &Handle) {
        self.dom.reparent_children(node, parent);
    }
    fn is_mathml_annotation_xml_integration_point(&self, node: &Handle) -> bool {
        self.dom.is_mathml_annotation_xml_integration_point(node)
    }
    // Inspect authored DSD templates without attaching or consuming their contents.
    fn allow_declarative_shadow_roots(&self, _parent: &Handle) -> bool {
        false
    }
}
