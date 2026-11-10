use std::collections::{BTreeSet, HashMap};
use std::ops::Range;
use std::sync::Arc;

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::attribute::{is_custom_element, read_tag_name_slice, style_element_end};
use crate::locator::TemplateDefinition;
use crate::plan::{Body, Instruction, RenderPlan};
use crate::{JsonValue, Locator, RenderConfig, RenderError};

/// Version of the portable prepared-instruction format.
pub const PREPARED_FORMAT_VERSION: u32 = 1;
/// Fingerprint of the compiler sources, manifest and dependency lockfile.
pub const PREPARED_COMPILER_ID: &str = env!("FAST_BUILD_COMPILER_ID");

const MAX_BODY_DEPTH: usize = 128;
type Attributes = Vec<(String, Option<String>)>;

/// Immutable, serializable template work. Contains no request state or hydration counters.
pub struct PreparedPiece {
    id: String,
    classification: Vec<(String, bool)>,
    definition: Arc<TemplateDefinition>,
}

#[derive(Serialize)]
struct ArtifactRef<'a> {
    version: u32,
    compiler: &'a str,
    id: &'a str,
    classification: &'a [(String, bool)],
    definition: &'a TemplateDefinition,
    plans: Vec<PlanRef<'a>>,
}

#[derive(Serialize)]
struct PlanRef<'a> {
    offset: usize,
    plan: &'a RenderPlan,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Artifact {
    version: u32,
    compiler: String,
    id: String,
    classification: Vec<(String, bool)>,
    definition: TemplateDefinition,
    plans: Vec<PlanRecord>,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct PlanRecord {
    offset: usize,
    plan: RenderPlan,
}

pub(crate) fn invalid(message: impl Into<String>) -> RenderError {
    RenderError::InvalidPreparedArtifact {
        message: message.into(),
    }
}

fn classifications(source: &str, registry: &Locator) -> Vec<(String, bool)> {
    let mut referenced = BTreeSet::new();
    let mut pos = 0;
    while let Some(relative) = source[pos..].find('<') {
        let at = pos + relative;
        if let Some(end) = style_element_end(source, at) {
            pos = end;
            continue;
        }
        if let Some(name) = read_tag_name_slice(source, at) {
            if is_custom_element(name) {
                referenced.insert(name.to_string());
            }
        }
        pos = at + 1;
    }
    referenced
        .into_iter()
        .map(|name| {
            let registered = registry.has_template(&name);
            (name, registered)
        })
        .collect()
}

fn piece_id(
    content: &str,
    shadow: &Attributes,
    host: &Attributes,
    classification: &[(String, bool)],
) -> String {
    let bytes = serde_json::to_vec(&(
        PREPARED_FORMAT_VERSION,
        PREPARED_COMPILER_ID,
        content,
        shadow,
        host,
        classification,
    ))
    .expect("template inputs are serializable");
    format!("{:x}", Sha256::digest(bytes))
}

impl PreparedPiece {
    /// Compute an identity without compiling instructions. Registry membership only
    /// affects identities for custom element names present in this source.
    pub fn identity(
        content: &str,
        shadow: &Attributes,
        host: &Attributes,
        registered: &[String],
    ) -> String {
        PreparedCompiler::new(registered).identity(content, shadow, host)
    }

    /// Eagerly prepare this template and its structural bodies, preserving deferred errors.
    pub fn compile(
        content: &str,
        shadow: Attributes,
        host: Attributes,
        registered: &[String],
    ) -> Result<Self, RenderError> {
        PreparedCompiler::new(registered).compile(content, shadow, host)
    }

    /// Content/compiler identity, suitable for a content-addressed artifact filename.
    pub fn id(&self) -> &str {
        &self.id
    }

    /// Conservative custom-element dependencies, including skipped structural bodies.
    pub fn dependencies(&self) -> Vec<String> {
        self.classification
            .iter()
            .filter(|(_, registered)| *registered)
            .map(|(name, _)| name.clone())
            .collect()
    }

    /// Serialize actual prepared instructions, not just source or rendered HTML.
    pub fn to_bytes(&self) -> Vec<u8> {
        let mut plans = vec![PlanRef {
            offset: 0,
            plan: self.definition.plan.get().expect("prepared root"),
        }];
        let mut index = 0;
        while index < plans.len() {
            let offset = plans[index].offset;
            let plan = plans[index].plan;
            for body in bodies(plan) {
                plans.push(PlanRef {
                    offset: offset + body.range.start,
                    plan: body.plan.get().expect("prepared body"),
                });
            }
            index += 1;
        }
        serde_json::to_vec(&ArtifactRef {
            version: PREPARED_FORMAT_VERSION,
            compiler: PREPARED_COMPILER_ID,
            id: &self.id,
            classification: &self.classification,
            definition: &self.definition,
            plans,
        })
        .expect("prepared instructions are serializable")
    }

    /// Validate and load an artifact without rescanning or compiling its instructions.
    pub fn from_bytes(bytes: &[u8]) -> Result<Self, RenderError> {
        let artifact: Artifact =
            serde_json::from_slice(bytes).map_err(|error| invalid(error.to_string()))?;
        if artifact.version != PREPARED_FORMAT_VERSION
            || artifact.compiler != PREPARED_COMPILER_ID
        {
            return Err(invalid("incompatible artifact format or compiler"));
        }
        let definition = artifact.definition;
        let authored = definition
            .original_content
            .as_deref()
            .unwrap_or(&definition.content);
        if crate::code_escape::escape_code_sample_elements(authored) != definition.content
        {
            return Err(invalid("artifact source does not match authored content"));
        }
        let registered: Vec<_> = artifact
            .classification
            .iter()
            .filter(|(_, registered)| *registered)
            .map(|(name, _)| name.clone())
            .collect();
        let compiler = PreparedCompiler::new(&registered);
        if classifications(&definition.content, &compiler.locator)
            != artifact.classification
            || piece_id(
                authored,
                &definition.shadowroot_attributes,
                &definition.host_attributes,
                &artifact.classification,
            ) != artifact.id
        {
            return Err(invalid("artifact identity does not match its inputs"));
        }
        let mut plans = HashMap::new();
        for record in artifact.plans {
            if plans.insert(record.offset, record.plan).is_some() {
                return Err(invalid("duplicate prepared body"));
            }
        }
        let root = restore_plan(&mut plans, 0, &definition.content, 0)?;
        if !plans.is_empty() {
            return Err(invalid("unreferenced prepared bodies"));
        }
        definition.plan.set(root).expect("deserialized definition");
        Ok(Self {
            id: artifact.id,
            classification: artifact.classification,
            definition: Arc::new(definition),
        })
    }
}

/// Batch compiler: registry construction is shared across individual template preparations.
pub struct PreparedCompiler {
    locator: Locator,
}

impl PreparedCompiler {
    /// Register names without compiling or expanding their definitions.
    pub fn new(registered: &[String]) -> Self {
        Self {
            locator: Locator::from_templates(
                registered
                    .iter()
                    .map(|name| (name.clone(), String::new()))
                    .collect(),
            ),
        }
    }

    /// Hash authored inputs and the referenced names' registry membership.
    pub fn identity(
        &self,
        content: &str,
        shadow: &Attributes,
        host: &Attributes,
    ) -> String {
        let escaped = crate::code_escape::escape_code_sample_elements(content);
        piece_id(
            content,
            shadow,
            host,
            &classifications(&escaped, &self.locator),
        )
    }

    /// Prepare one piece using this batch's registry classification.
    pub fn compile(
        &self,
        content: &str,
        shadow: Attributes,
        host: Attributes,
    ) -> Result<PreparedPiece, RenderError> {
        let definition = TemplateDefinition::new(content, shadow, host);
        let classification = classifications(&definition.content, &self.locator);
        let id = piece_id(
            content,
            &definition.shadowroot_attributes,
            &definition.host_attributes,
            &classification,
        );
        let plan = RenderPlan::compile(&definition.content, Some(&self.locator));
        prepare_bodies(&plan, &definition.content, &self.locator, 0)?;
        definition.plan.set(plan).expect("new definition");
        Ok(PreparedPiece {
            id,
            classification,
            definition: Arc::new(definition),
        })
    }
}

impl PreparedPiece {
    /// Estimated retained Rust bytes. Excludes allocator overhead and active render output.
    pub fn memory_bytes(&self) -> usize {
        std::mem::size_of::<Self>()
            + self.id.capacity()
            + self.classification.capacity() * std::mem::size_of::<(String, bool)>()
            + self
                .classification
                .iter()
                .map(|(name, _)| name.capacity())
                .sum::<usize>()
            + self.definition.memory_bytes()
    }
}

impl RenderPlan {
    fn memory_bytes(&self) -> usize {
        self.instructions.capacity() * std::mem::size_of::<Instruction>()
            + self
                .instructions
                .iter()
                .map(|instruction| match instruction {
                    Instruction::Tag(tag) => {
                        tag.attributes.memory_bytes() + tag.stripped.capacity()
                    }
                    Instruction::When(when) => when.expression.capacity(),
                    Instruction::Repeat(repeat) => {
                        repeat.variable.capacity() + repeat.collection.capacity()
                    }
                    Instruction::Element(element) => {
                        element.name.capacity()
                            + element.base.capacity()
                            + attributes_bytes(&element.attrs)
                            + element.opening.attributes.memory_bytes()
                            + element.opening.stripped.capacity()
                    }
                    _ => 0,
                })
                .sum::<usize>()
            + bodies(self)
                .map(|body| body.plan.get().map_or(0, RenderPlan::memory_bytes))
                .sum::<usize>()
    }
}

fn attributes_bytes(attributes: &Attributes) -> usize {
    attributes.capacity() * std::mem::size_of::<(String, Option<String>)>()
        + attributes
            .iter()
            .map(|(name, value)| {
                name.capacity() + value.as_ref().map_or(0, String::capacity)
            })
            .sum::<usize>()
}

impl TemplateDefinition {
    fn memory_bytes(&self) -> usize {
        std::mem::size_of::<Self>()
            + self.content.capacity()
            + self.original_content.as_ref().map_or(0, String::capacity)
            + attributes_bytes(&self.shadowroot_attributes)
            + attributes_bytes(&self.host_attributes)
            + self.shadowroot_markup_bytes()
            + self.plan.get().map_or(0, RenderPlan::memory_bytes)
    }
}

fn bodies(plan: &RenderPlan) -> impl Iterator<Item = &Body> {
    plan.instructions
        .iter()
        .filter_map(|instruction| match instruction {
            Instruction::When(when) => Some(&when.body),
            Instruction::Repeat(repeat) => Some(&repeat.body),
            Instruction::Element(element) => element
                .children
                .as_ref()
                .or(element.unclosed_children.as_ref()),
            _ => None,
        })
}

fn prepare_bodies(
    plan: &RenderPlan,
    source: &str,
    locator: &Locator,
    depth: usize,
) -> Result<(), RenderError> {
    if depth > MAX_BODY_DEPTH {
        return Err(invalid("prepared structural nesting exceeds 128 bodies"));
    }
    for body in bodies(plan) {
        prepare_bodies(
            body.plan(source, Some(locator)),
            &source[body.range.clone()],
            locator,
            depth + 1,
        )?;
    }
    Ok(())
}

fn valid_range(source: &str, range: &Range<usize>) -> Result<(), RenderError> {
    source
        .get(range.clone())
        .map(|_| ())
        .ok_or_else(|| invalid("invalid source range"))
}

fn restore_plan(
    plans: &mut HashMap<usize, RenderPlan>,
    offset: usize,
    source: &str,
    depth: usize,
) -> Result<RenderPlan, RenderError> {
    if depth > MAX_BODY_DEPTH {
        return Err(invalid("prepared structural nesting exceeds 128 bodies"));
    }
    let plan = plans
        .remove(&offset)
        .ok_or_else(|| invalid("missing prepared body"))?;
    for instruction in &plan.instructions {
        match instruction {
            Instruction::Literal(range)
            | Instruction::Binding {
                expression: range, ..
            } => {
                valid_range(source, range)?;
            }
            Instruction::Tag(tag) => {
                valid_range(source, &tag.range)?;
                tag.attributes.validate(&source[tag.range.clone()])?;
                if tag.double_bindings > tag.total_bindings
                    || tag.total_bindings > source.len()
                {
                    return Err(invalid("invalid prepared binding count"));
                }
            }
            Instruction::When(when) => valid_range(source, &(when.at..when.after))?,
            Instruction::Repeat(repeat) => {
                valid_range(source, &(repeat.at..repeat.after))?
            }
            Instruction::Element(element) => {
                valid_range(source, &(element.at..element.tag_end))?;
                valid_range(source, &(element.tag_end..element.after))?;
                if element.binding_count > source.len() {
                    return Err(invalid("invalid prepared element binding count"));
                }
                if element.opening.range != (element.at..element.tag_end) {
                    return Err(invalid("invalid prepared element opening"));
                }
                if element.opening.double_bindings > element.opening.total_bindings
                    || element.opening.total_bindings > source.len()
                    || element.children.is_some() == element.unclosed_children.is_some()
                    || element
                        .unclosed_children
                        .as_ref()
                        .is_some_and(|body| body.range != (element.tag_end..element.after))
                {
                    return Err(invalid("invalid prepared authored element content"));
                }
                element
                    .opening
                    .attributes
                    .validate(&source[element.opening.range.clone()])?;
            }
            Instruction::Deferred(directive) => {
                let expected = match directive {
                    crate::directive::Directive::DoubleBrace(_) => "{{",
                    crate::directive::Directive::TripleBrace(_) => "{{{",
                    crate::directive::Directive::When(_) => "<f-when",
                    crate::directive::Directive::Repeat(_) => "<f-repeat",
                    crate::directive::Directive::CustomElement(_) => "<",
                };
                if !source
                    .get(directive.position()..)
                    .is_some_and(|tail| tail.starts_with(expected))
                {
                    return Err(invalid("invalid deferred diagnostic position"));
                }
            }
        }
    }
    for body in bodies(&plan) {
        valid_range(source, &body.range)?;
        if body.range.start == 0 {
            return Err(invalid("prepared body must follow its opening tag"));
        }
        let child = restore_plan(
            plans,
            offset + body.range.start,
            &source[body.range.clone()],
            depth + 1,
        )?;
        body.plan.set(child).expect("uninitialized loaded body");
    }
    Ok(plan)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn piece(source: &str, names: &[String]) -> Arc<PreparedPiece> {
        Arc::new(PreparedPiece::compile(source, vec![], vec![], names).unwrap())
    }

    #[test]
    fn round_tripped_pieces_match_html_chunks_and_fresh_request_state() {
        let names = vec!["test-card".to_string()];
        let source = r#"<code>{{example}}</code><f-repeat value="{{item in items}}"><test-card title="{{item.title}}"><b>{{item.title}}</b></test-card></f-repeat>"#;
        let content = r#"<style>b{content:'{{literal}}'}</style><f-when value="{{shown}}"><b title="{{title}}">{{title}}</b></f-when>"#;
        let entry = piece(source, &names);
        let card = piece(content, &names);
        let entry = Arc::new(PreparedPiece::from_bytes(&entry.to_bytes()).unwrap());
        let card = Arc::new(PreparedPiece::from_bytes(&card.to_bytes()).unwrap());
        let program =
            PreparedProgram::new(entry, HashMap::from([("test-card".into(), card)]))
                .unwrap();
        let locator = Locator::from_templates(HashMap::from([(
            "test-card".into(),
            content.into(),
        )]));
        for markers in [false, true] {
            let config = RenderConfig::new().with_markers_v2(markers);
            for title in ["first<&", "second"] {
                let state = crate::json::parse(&format!(
                    r#"{{"shown":true,"items":[{{"title":"{title}"}}]}}"#
                ))
                .unwrap();
                assert_eq!(
                    program.render(&state, Some(&config)).unwrap(),
                    crate::render_entry_with_locator(
                        source,
                        &state,
                        &locator,
                        Some(&config)
                    )
                    .unwrap(),
                );
                assert_eq!(
                    program.render_stream(&state, Some(&config)).unwrap(),
                    crate::render_entry_stream_with_locator(
                        source,
                        &state,
                        &locator,
                        Some(&config)
                    )
                    .unwrap(),
                );
            }
        }
    }

    #[test]
    fn eager_preparation_keeps_skipped_errors_lazy_and_authored() {
        let source = "<code>{{example}}</code>\r\n<f-when value=\"{{shown}}\">😀{{unfinished</f-when>";
        let entry = piece(source, &[]);
        let program = PreparedProgram::new(
            Arc::new(PreparedPiece::from_bytes(&entry.to_bytes()).unwrap()),
            HashMap::new(),
        )
        .unwrap();
        let hidden = crate::json::parse(r#"{"shown":false}"#).unwrap();
        program.render(&hidden, None).unwrap();
        let shown = crate::json::parse(r#"{"shown":true}"#).unwrap();
        let expected = crate::render_entry_with_locator(
            source,
            &shown,
            &Locator::from_templates(HashMap::new()),
            None,
        )
        .unwrap_err();
        let actual = program.render(&shown, None).unwrap_err();
        assert_eq!(actual.code(), expected.code());
        assert_eq!(actual.location(), expected.location());
        assert_eq!(actual.to_string(), expected.to_string());
    }

    #[test]
    fn flat_artifacts_preserve_deep_bodies_without_json_recursion() {
        let source = format!(
            "{}{{{{title}}}}{}",
            r#"<f-when value="{{shown}}">"#.repeat(40),
            "</f-when>".repeat(40),
        );
        let entry = piece(&source, &[]);
        let loaded = Arc::new(PreparedPiece::from_bytes(&entry.to_bytes()).unwrap());
        let program = PreparedProgram::new(loaded, HashMap::new()).unwrap();
        let state = crate::json::parse(r#"{"shown":true,"title":"nested"}"#).unwrap();
        assert_eq!(program.render(&state, None).unwrap(), "nested");
    }

    #[test]
    fn identities_follow_inputs_and_membership_not_referenced_component_contents() {
        let names = vec!["test-child".to_string()];
        let source = "<test-child></test-child>";
        let first = piece(source, &names);
        assert_eq!(
            first.id(),
            PreparedPiece::identity(source, &vec![], &vec![], &names)
        );
        assert_ne!(first.id(), piece(source, &[]).id());
        assert_eq!(
            first.id(),
            piece(source, &["test-unused".into(), "test-child".into(),]).id()
        );
        let old_child = piece("<b>old</b>", &names);
        let new_child = piece("<b>new</b>", &names);
        assert_ne!(old_child.id(), new_child.id());
        let old = PreparedProgram::new(
            Arc::clone(&first),
            HashMap::from([("test-child".into(), old_child)]),
        )
        .unwrap();
        let new = PreparedProgram::new(
            first,
            HashMap::from([("test-child".into(), new_child)]),
        )
        .unwrap();
        assert!(old
            .render(&crate::empty_state(), None)
            .unwrap()
            .contains("<b>old</b>"));
        assert!(new
            .render(&crate::empty_state(), None)
            .unwrap()
            .contains("<b>new</b>"));
    }

    #[test]
    fn corrupt_incompatible_and_incomplete_artifacts_are_rejected() {
        let entry = piece("<b>😀{{title}}</b>", &[]);
        let original: serde_json::Value =
            serde_json::from_slice(&entry.to_bytes()).unwrap();
        for mutate in [
            |value: &mut serde_json::Value| value["compiler"] = "old-compiler".into(),
            |value: &mut serde_json::Value| value["version"] = 999.into(),
            |value: &mut serde_json::Value| {
                value["plans"][0]["plan"]["instructions"][0]["Tag"]["range"]["end"] =
                    usize::MAX.into()
            },
            |value: &mut serde_json::Value| {
                value["plans"][0]["plan"]["instructions"][1]["Literal"]["start"] =
                    4.into()
            },
            |value: &mut serde_json::Value| value["plans"] = serde_json::json!([]),
        ] {
            let mut artifact = original.clone();
            mutate(&mut artifact);
            let bytes = serde_json::to_vec(&artifact).unwrap();
            assert_eq!(
                PreparedPiece::from_bytes(&bytes).err().unwrap().code(),
                "invalid-prepared-artifact"
            );
        }
        let names = vec!["test-child".into()];
        assert!(PreparedProgram::new(
            piece("<test-child></test-child>", &names),
            HashMap::new()
        )
        .is_err());
    }
}
/// A request/program snapshot. Cloned pieces share immutable instructions, never request state.
pub struct PreparedProgram {
    entry: Arc<PreparedPiece>,
    locator: Locator,
}

impl PreparedProgram {
    /// Render a complete DSD fragment using resolved component state and fresh scopes.
    /// Unknown names are errors even when excluded; known excluded names return empty HTML.
    pub fn render_shadow_root(
        &self,
        name: &str,
        state: &JsonValue,
        config: Option<&RenderConfig>,
    ) -> Result<String, RenderError> {
        crate::render_shadow_root_with_locator(name, state, &self.locator, config)
    }

    /// Link a dependency-closed set of pieces. Missing dependencies are rejected before rendering.
    pub fn new(
        entry: Arc<PreparedPiece>,
        templates: HashMap<String, Arc<PreparedPiece>>,
    ) -> Result<Self, RenderError> {
        for piece in std::iter::once(&entry).chain(templates.values()) {
            for (name, registered) in &piece.classification {
                if *registered != templates.contains_key(name) {
                    return Err(invalid(format!(
                        "registry membership changed for '{name}'"
                    )));
                }
            }
        }
        Ok(Self {
            entry,
            locator: Locator::from_prepared(
                templates
                    .into_iter()
                    .map(|(name, piece)| (name, Arc::clone(&piece.definition)))
                    .collect(),
            ),
        })
    }

    /// Render entry HTML using fresh request state and hydration scopes.
    pub fn render(
        &self,
        state: &JsonValue,
        config: Option<&RenderConfig>,
    ) -> Result<String, RenderError> {
        let default = RenderConfig::default();
        crate::node::render_plan(
            self.entry.definition.plan.get().expect("prepared entry"),
            &self.entry.definition.content,
            state,
            &[],
            Some(&self.locator),
            None,
            true,
            config.unwrap_or(&default),
        )
        .map_err(|error| {
            error.authored(
                self.entry
                    .definition
                    .original_content
                    .as_deref()
                    .unwrap_or(&self.entry.definition.content),
            )
        })
    }

    /// Return the same precomputed chunk boundaries as the existing entry-stream API.
    pub fn render_stream(
        &self,
        state: &JsonValue,
        config: Option<&RenderConfig>,
    ) -> Result<Vec<String>, RenderError> {
        let default = RenderConfig::default();
        crate::streaming::stream_plan(
            self.entry.definition.plan.get().expect("prepared entry"),
            &self.entry.definition.content,
            state,
            &[],
            Some(&self.locator),
            None,
            true,
            config.unwrap_or(&default),
        )
        .map_err(|error| {
            error.authored(
                self.entry
                    .definition
                    .original_content
                    .as_deref()
                    .unwrap_or(&self.entry.definition.content),
            )
        })
    }
}
