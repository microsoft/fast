//! Immutable native execution of compiler artifacts; never parses template HTML.
use crate::{content::write_html_escaped, JsonValue as J, Locator, RenderError};
use serde::de::{Deserialize, Deserializer, MapAccess, SeqAccess, Visitor};
use serde_json::{json, Value as V};
use std::borrow::Cow;
use std::collections::HashMap;
use std::fmt::Write;
use std::sync::Arc;
mod plan;
use plan::{
    Attribute, Comparison, Component, Condition, Dynamic, Operand, Operation, Plan, Segment, Tag,
};

/// Attribute-to-state mapping for custom element attributes.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub enum AttributeNameStrategy {
    #[default]
    CamelCase,
    None,
}

/// Request-local options. Limits bound recursive component expansion and output.
#[derive(Clone, Debug)]
pub struct NativeRenderOptions {
    pub markers_v2: bool,
    /// `None` selects every component; an empty vector selects none.
    pub dsd: Option<Vec<String>>,
    pub attribute_name_strategy: AttributeNameStrategy,
    pub max_output_bytes: usize,
    pub max_steps: usize,
}

impl Default for NativeRenderOptions {
    fn default() -> Self {
        Self {
            markers_v2: false,
            dsd: None,
            attribute_name_strategy: AttributeNameStrategy::CamelCase,
            max_output_bytes: 64 * 1024 * 1024,
            max_steps: 1_000_000,
        }
    }
}

/// Recoverable artifact, state, lookup or resource-limit failure.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct NativeRenderError {
    pub code: &'static str,
    pub message: String,
}

impl std::fmt::Display for NativeRenderError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}
impl std::error::Error for NativeRenderError {}

fn error(code: &'static str, message: impl Into<String>) -> NativeRenderError {
    NativeRenderError {
        code,
        message: message.into(),
    }
}
fn invalid() -> NativeRenderError {
    error(
        "invalid-artifact",
        "Malformed FAST server executable artifact",
    )
}

/// An owned, immutable validated state snapshot, independent of any artifact.
/// Clones share storage; dropping the final clone releases it.
#[derive(Clone, Debug)]
pub struct PreparedState {
    values: Arc<J>,
}

impl PreparedState {
    /// Validate, normalize and copy without retaining or modifying caller data.
    pub fn new(state: &J) -> Result<Self, NativeRenderError> {
        Ok(Self {
            values: Arc::new(normalized(state, 0, &mut 1_000_000)?),
        })
    }

    /// Parse and validate JSON once into an owned snapshot.
    pub fn from_json(json: &str) -> Result<Self, NativeRenderError> {
        Ok(Self {
            values: Arc::new(parse_render_state(json)?),
        })
    }
}

/// Compile ahead of time to a versioned executable artifact, not template metadata.
pub fn compile_server_artifact(entry: &str, locator: &Locator) -> Result<Vec<u8>, RenderError> {
    let ir = crate::server_ir::lower(entry, locator)?;
    let templates: serde_json::Map<String, V> = locator
        .template_names()
        .map(|name| {
            let attributes = |values: &[(String, Option<String>)]| -> Vec<V> {
                values
                    .iter()
                    .map(|(name, value)| json!({"name":name,"value":value}))
                    .collect()
            };
            (
                name.to_owned(),
                json!({
                    "content":locator.authored_template(name).unwrap(),
                    "shadowrootAttributes":attributes(locator.get_shadowroot_attributes(name)),
                    "hostAttributes":attributes(locator.get_host_attributes(name)),
                    "formatVersion":1,
                }),
            )
        })
        .collect();
    let bytes = json!({
        "format":"fast-server-native",
        "version":crate::server_plan::NATIVE_VERSION,
        "inputs":{"entry":entry,"templates":templates},
        "program":crate::server_plan::encode(&ir),
    })
    .to_string()
    .into_bytes();
    CompiledArtifact::load(&bytes).map_err(|error| RenderError::InvalidTemplateMetadata {
        message: error.to_string(),
    })?;
    Ok(bytes)
}

/// A validated, immutable, `Send + Sync` executable. Clones share owned artifact
/// storage; requests own all transient state and output. No JavaScript is used.
/// Compile authored templates with [`crate::compile_server_artifact`] and deploy
/// the resulting JSON data independently of this shared execution engine.
#[derive(Clone, Debug)]
pub struct CompiledArtifact {
    plan: Arc<Plan>,
}

impl CompiledArtifact {
    /// Load without HTML/expression parsing. Supports the hash-free `fast-server-native`
    /// semantic schemas 1 and 2, independently of private execution layouts.
    /// Schema 2 embeds build inputs, which are discarded before plan decoding.
    pub fn load(bytes: &[u8]) -> Result<Self, NativeRenderError> {
        if bytes.len() > 64 * 1024 * 1024 {
            return Err(error("invalid-artifact", "Artifact exceeds 64 MiB"));
        }
        let mut ir: V = serde_json::from_slice(bytes).map_err(|_| invalid())?;
        if ir["format"] != "fast-server-native"
            // Decoder support is explicit, not coupled to the current emitter version.
            || !matches!(ir["version"].as_u64(), Some(1 | 2))
        {
            return Err(error(
                "incompatible-artifact",
                "Unsupported FAST server artifact format/schema; native loader supports fast-server-native schemas 1 and 2",
            ));
        }
        let program = if ir["version"] == 2 {
            let envelope = ir.as_object().ok_or_else(invalid)?;
            if envelope.len() != 4
                || !envelope.contains_key("program")
                || !Self::valid_artifact_inputs(&ir["inputs"])
            {
                return Err(invalid());
            }
            ir["program"].take()
        } else {
            let plan = ir.as_object_mut().ok_or_else(invalid)?;
            plan.remove("format");
            plan.remove("version");
            std::mem::take(&mut ir)
        };
        drop(ir);
        Ok(Self {
            plan: Arc::new(Plan::load(&program).map_err(|_| invalid())?),
        })
    }

    fn valid_artifact_inputs(inputs: &V) -> bool {
        let Some(inputs) = inputs.as_object() else {
            return false;
        };
        inputs.len() == 2
            && inputs.get("entry").is_some_and(V::is_string)
            && (inputs.get("templates").is_some_and(V::is_object)
                || inputs
                    .get("templateSources")
                    .and_then(V::as_array)
                    .is_some_and(|sources| sources.iter().all(V::is_string)))
    }

    pub fn render_entry(
        &self,
        state: &J,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        self.render(self.plan.entry, state, options, true)
    }

    /// Parse, fully validate and render fresh owned JSON without a snapshot copy.
    pub fn render_entry_json(
        &self,
        json: &str,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        let state = parse_render_state(json)?;
        self.execute(self.plan.entry, &state, options, true)
    }

    /// Fresh JSON rendering with template-context root-host rules.
    pub fn render_template_json(
        &self,
        json: &str,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        let state = parse_render_state(json)?;
        self.execute(self.plan.entry, &state, options, false)
    }

    /// Parse and validate before resolving the named host, matching typed input.
    pub fn render_host_json(
        &self,
        name: &str,
        json: &str,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        let state = parse_render_state(json)?;
        self.execute(self.component(name)?.host, &state, options, true)
    }

    /// Fresh JSON rendering of only the selected component's DSD.
    pub fn render_shadow_json(
        &self,
        name: &str,
        json: &str,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        let state = parse_render_state(json)?;
        self.execute_shadow(name, &state, options)
    }

    /// Root template mode preserves the non-entry host attribute contract.
    pub fn render_template(
        &self,
        state: &J,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        self.render(self.plan.entry, state, options, false)
    }

    /// Render without repeating validation or copying the snapshot's root.
    pub fn render_entry_prepared(
        &self,
        state: &PreparedState,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        self.execute(self.plan.entry, &state.values, options, true)
    }

    /// Prepared-state rendering with template-context root-host rules.
    pub fn render_template_prepared(
        &self,
        state: &PreparedState,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        self.execute(self.plan.entry, &state.values, options, false)
    }

    pub fn render_host(
        &self,
        name: &str,
        state: &J,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        let state = normalized(state, 0, &mut 1_000_000)?;
        let component = self.component(name)?;
        self.execute(component.host, &state, options, true)
    }

    /// Render a named host using an immutable validated snapshot.
    pub fn render_host_prepared(
        &self,
        name: &str,
        state: &PreparedState,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        self.execute(self.component(name)?.host, &state.values, options, true)
    }

    /// Return only DSD for resolved component state (no attribute overlay/host).
    pub fn render_shadow(
        &self,
        name: &str,
        state: &J,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        let state = normalized(state, 0, &mut 1_000_000)?;
        self.execute_shadow(name, &state, options)
    }

    /// Render only DSD using an immutable validated snapshot.
    pub fn render_shadow_prepared(
        &self,
        name: &str,
        state: &PreparedState,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        self.execute_shadow(name, &state.values, options)
    }

    fn execute_shadow(
        &self,
        name: &str,
        state: &J,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        let component = self.component(name)?;
        if !selected(options, name) {
            return Ok(String::new());
        }
        let mut executor = Executor::new(&self.plan, options);
        executor.push(&component.tag)?;
        executor.body(
            component.shadow,
            &Frame {
                base: Some(state),
                values: ScopeValues::new(0),
                parent: None,
            },
            None,
            &mut Some(0),
            false,
            0,
        )?;
        executor.push("</template>")?;
        Ok(executor.out)
    }

    fn component(&self, name: &str) -> Result<&Component, NativeRenderError> {
        self.plan
            .names
            .get(name)
            .map(|id| &self.plan.components[*id])
            .ok_or_else(|| error("missing-template", format!("Unknown component: {name}")))
    }

    fn render(
        &self,
        id: usize,
        state: &J,
        options: &NativeRenderOptions,
        entry: bool,
    ) -> Result<String, NativeRenderError> {
        let state = normalized(state, 0, &mut 1_000_000)?;
        self.execute(id, &state, options, entry)
    }

    fn execute(
        &self,
        id: usize,
        state: &J,
        options: &NativeRenderOptions,
        entry: bool,
    ) -> Result<String, NativeRenderError> {
        let mut executor = Executor::new(&self.plan, options);
        executor.body(
            id,
            &Frame {
                base: Some(state),
                values: ScopeValues::new(0),
                parent: None,
            },
            None,
            &mut None,
            entry,
            0,
        )?;
        Ok(executor.out)
    }
}

/// Parse request JSON with finite numbers and a bounded nesting depth.
pub fn parse_render_state(json: &str) -> Result<J, NativeRenderError> {
    let state: RequestValue =
        serde_json::from_str(json).map_err(|e| error("invalid-state", e.to_string()))?;
    // Count retained values after duplicate-key replacement. Parse errors, including
    // invalid unused/overwritten Unicode and numbers, still precede budget errors.
    fn validate(v: &J, depth: usize, remaining: &mut usize) -> Result<(), NativeRenderError> {
        if depth > 64 || *remaining == 0 {
            return Err(error("invalid-state", "State exceeds nesting/node limits"));
        }
        *remaining -= 1;
        match v {
            J::Array(values) => {
                for value in values {
                    validate(value, depth + 1, remaining)?;
                }
            }
            J::Object(values) => {
                for value in values.values() {
                    validate(value, depth + 1, remaining)?;
                }
            }
            _ => {}
        }
        Ok(())
    }
    validate(&state.0, 0, &mut 1_000_000)?;
    Ok(state.0)
}

// Deserialize directly into request storage, without an intermediate serde value
// tree, map conversion, string/key copies or a second normalized snapshot.
struct RequestValue(J);

impl<'de> Deserialize<'de> for RequestValue {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        struct RequestVisitor;
        impl<'de> Visitor<'de> for RequestVisitor {
            type Value = RequestValue;

            fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
                formatter.write_str("JSON state")
            }
            fn visit_unit<E: serde::de::Error>(self) -> Result<Self::Value, E> {
                Ok(RequestValue(J::Null))
            }
            fn visit_bool<E: serde::de::Error>(self, value: bool) -> Result<Self::Value, E> {
                Ok(RequestValue(J::Bool(value)))
            }
            fn visit_i64<E: serde::de::Error>(self, value: i64) -> Result<Self::Value, E> {
                self.visit_f64(value as f64)
            }
            fn visit_u64<E: serde::de::Error>(self, value: u64) -> Result<Self::Value, E> {
                self.visit_f64(value as f64)
            }
            fn visit_f64<E: serde::de::Error>(self, value: f64) -> Result<Self::Value, E> {
                if !value.is_finite() {
                    return Err(E::custom("State numbers must be finite"));
                }
                Ok(RequestValue(J::Number(if value == 0.0 {
                    0.0
                } else {
                    value
                })))
            }
            fn visit_str<E: serde::de::Error>(self, value: &str) -> Result<Self::Value, E> {
                Ok(RequestValue(J::String(value.into())))
            }
            fn visit_string<E: serde::de::Error>(self, value: String) -> Result<Self::Value, E> {
                Ok(RequestValue(J::String(value)))
            }
            fn visit_seq<A: SeqAccess<'de>>(self, mut seq: A) -> Result<Self::Value, A::Error> {
                let mut values = Vec::new();
                while let Some(RequestValue(value)) = seq.next_element()? {
                    values.push(value);
                }
                Ok(RequestValue(J::Array(values)))
            }
            fn visit_map<A: MapAccess<'de>>(self, mut map: A) -> Result<Self::Value, A::Error> {
                let mut values = HashMap::new();
                while let Some((key, RequestValue(value))) =
                    map.next_entry::<String, RequestValue>()?
                {
                    values.insert(key, value);
                }
                Ok(RequestValue(J::Object(values)))
            }
        }
        deserializer.deserialize_any(RequestVisitor)
    }
}

fn normalized(state: &J, depth: usize, remaining: &mut usize) -> Result<J, NativeRenderError> {
    if depth > 64 || *remaining == 0 {
        return Err(error("invalid-state", "State exceeds nesting/node limits"));
    }
    *remaining -= 1;
    Ok(match state {
        J::Number(n) if !n.is_finite() => {
            return Err(error("invalid-state", "State numbers must be finite"))
        }
        J::Number(n) => J::Number(if *n == 0.0 { 0.0 } else { *n }),
        J::Array(v) => J::Array(
            v.iter()
                .map(|v| normalized(v, depth + 1, remaining))
                .collect::<Result<_, _>>()?,
        ),
        J::Object(v) => J::Object(
            v.iter()
                .map(|(k, v)| Ok((k.clone(), normalized(v, depth + 1, remaining)?)))
                .collect::<Result<_, NativeRenderError>>()?,
        ),
        v => v.clone(),
    })
}

fn selected(options: &NativeRenderOptions, name: &str) -> bool {
    options
        .dsd
        .as_ref()
        .is_none_or(|names| names.iter().any(|n| n == name))
}

enum ScopeValues<'a> {
    Inline([Option<(&'a str, Cow<'a, J>)>; 4]),
    Map(HashMap<&'a str, Cow<'a, J>>),
}

impl<'a> ScopeValues<'a> {
    fn new(properties: usize) -> Self {
        if properties <= 4 {
            Self::Inline(std::array::from_fn(|_| None))
        } else {
            Self::Map(HashMap::new())
        }
    }

    fn get(&self, key: &str) -> Option<&Cow<'a, J>> {
        match self {
            Self::Inline(entries) => entries
                .iter()
                .flatten()
                .find(|(name, _)| *name == key)
                .map(|(_, value)| value),
            Self::Map(values) => values.get(key),
        }
    }

    fn get_or_insert_with(
        &mut self,
        key: &'a str,
        initialize: impl FnOnce() -> Cow<'a, J>,
    ) -> &mut Cow<'a, J> {
        match self {
            Self::Inline(entries) => {
                let index = entries
                    .iter()
                    .position(|entry| entry.as_ref().is_none_or(|(name, _)| *name == key))
                    .expect("inline scope covers the component's property count");
                &mut entries[index].get_or_insert_with(|| (key, initialize())).1
            }
            Self::Map(values) => values.entry(key).or_insert_with(initialize),
        }
    }

    fn insert(&mut self, key: &'a str, value: Cow<'a, J>) {
        *self.get_or_insert_with(key, || Cow::Owned(J::Null)) = value;
    }
}

struct Frame<'a> {
    base: Option<&'a J>,
    values: ScopeValues<'a>,
    parent: Option<&'a Frame<'a>>,
}
struct LoopFrame<'a> {
    prefix: &'a [String],
    item: &'a J,
    index: J,
    parent: Option<&'a LoopFrame<'a>>,
}
type Loops<'a> = Option<&'a LoopFrame<'a>>;

fn nested<'a>(value: &'a J, path: &[Segment]) -> Option<Cow<'a, J>> {
    let mut value = value;
    for (at, key) in path.iter().enumerate() {
        match value {
            J::Array(values) => {
                if key.key == "length" {
                    return (at == path.len() - 1)
                        .then_some(Cow::Owned(J::Number(values.len() as f64)));
                }
                value = values.get(key.array_index?)?;
            }
            J::Object(values) => value = values.get(&key.key)?,
            _ => return None,
        }
    }
    Some(Cow::Borrowed(value))
}

fn get<'a>(root: &'a Frame<'a>, mut loops: Loops<'a>, path: &[Segment]) -> Option<Cow<'a, J>> {
    while let Some(current) = loops {
        if path[0].key == "$index" {
            return nested(&current.index, &path[1..]);
        }
        if current.prefix.len() <= path.len()
            && current.prefix.iter().zip(path).all(|(a, b)| a == &b.key)
        {
            return nested(current.item, &path[current.prefix.len()..]);
        }
        loops = current.parent;
    }
    let mut frame = Some(root);
    while let Some(current) = frame {
        if let Some(value) = current.values.get(path[0].key.as_str()) {
            return nested(value, &path[1..]);
        }
        if let Some(base) = current.base {
            let val = nested(base, path);
            if val.is_some()
                || matches!(base, J::Object(values) if values.contains_key(&path[0].key))
            {
                return val;
            }
        }
        frame = current.parent;
    }
    None
}

fn text(value: Option<&J>) -> Cow<'_, str> {
    match value {
        None | Some(J::Null) => "".into(),
        Some(J::Bool(v)) => v.to_string().into(),
        Some(J::Number(v)) => {
            if *v == 0.0 {
                "0".into()
            } else {
                v.to_string().into()
            }
        }
        Some(J::String(v)) => Cow::Borrowed(v),
        Some(J::Array(_)) => "[Array]".into(),
        Some(J::Object(_)) => "[Object]".into(),
    }
}
fn truthy(value: Option<&J>) -> bool {
    match value {
        None | Some(J::Null) => false,
        Some(J::Bool(v)) => *v,
        Some(J::Number(v)) => *v != 0.0 && !v.is_nan(),
        Some(J::String(v)) => !v.is_empty(),
        _ => true,
    }
}
fn operand<'a>(v: &'a Operand, root: &'a Frame<'a>, loops: Loops<'a>) -> Option<Cow<'a, J>> {
    match v {
        Operand::Path(path) => get(root, loops, path),
        Operand::Value(value) => Some(Cow::Borrowed(value)),
    }
}
fn numeric(v: &J) -> Option<f64> {
    match v {
        J::Number(v) => Some(*v),
        J::Bool(v) => Some(if *v { 1.0 } else { 0.0 }),
        J::String(v) => v.parse().ok(),
        _ => None,
    }
}
fn equal(a: &J, b: &J) -> bool {
    match (a, b) {
        (J::Null, J::Null) => true,
        (J::Bool(a), J::Bool(b)) => a == b,
        (J::Number(a), J::Number(b)) => a == b,
        (J::String(a), J::String(b)) => a == b,
        (J::String(_), J::Bool(_) | J::Number(_)) | (J::Bool(_) | J::Number(_), J::String(_)) => {
            text(Some(a)) == text(Some(b))
        }
        _ => false,
    }
}
fn condition(v: &Condition, root: &Frame<'_>, loops: Loops<'_>) -> bool {
    use Comparison::*;
    match v {
        Condition::Or(a, b) => condition(a, root, loops) || condition(b, root, loops),
        Condition::And(a, b) => condition(a, root, loops) && condition(b, root, loops),
        Condition::Not(path) => !truthy(get(root, loops, path).as_deref()),
        Condition::Truthy(path) => truthy(get(root, loops, path).as_deref()),
        Condition::Compare(op, path, value) => {
            let a = get(root, loops, path);
            let b = operand(value, root, loops);
            match (a, b) {
                (Some(a), Some(b)) => {
                    if matches!(op, Equal | NotEqual) {
                        return equal(&a, &b) == (*op == Equal);
                    }
                    let order = match (numeric(&a), numeric(&b)) {
                        (Some(a), Some(b)) => {
                            if a < b {
                                -1
                            } else if a > b {
                                1
                            } else {
                                0
                            }
                        }
                        _ => match text(Some(&a)).cmp(&text(Some(&b))) {
                            std::cmp::Ordering::Less => -1,
                            std::cmp::Ordering::Equal => 0,
                            std::cmp::Ordering::Greater => 1,
                        },
                    };
                    match op {
                        Greater => order > 0,
                        Less => order < 0,
                        GreaterEqual => order >= 0,
                        _ => order <= 0,
                    }
                }
                (None, None) => matches!(op, Equal | GreaterEqual | LessEqual),
                _ => *op == NotEqual,
            }
        }
    }
}

struct Decimal {
    bytes: [u8; usize::MAX.ilog10() as usize + 1],
    start: usize,
}

impl Decimal {
    fn new(mut value: usize) -> Self {
        let mut decimal = Self {
            bytes: [0; usize::MAX.ilog10() as usize + 1],
            start: usize::MAX.ilog10() as usize + 1,
        };
        loop {
            decimal.start -= 1;
            decimal.bytes[decimal.start] = b'0' + (value % 10) as u8;
            value /= 10;
            if value == 0 {
                return decimal;
            }
        }
    }

    fn as_str(&self) -> &str {
        std::str::from_utf8(&self.bytes[self.start..]).expect("decimal digits are UTF-8")
    }
}

enum HydrationMarker {
    Legacy(Decimal),
    Binding(Decimal),
    Composite(Decimal, Decimal),
}

impl HydrationMarker {
    fn parts(&self) -> [&str; 4] {
        match self {
            Self::Legacy(count) => ["data-fe=\"", count.as_str(), "\"", ""],
            Self::Binding(index) => ["data-fe-b-", index.as_str(), "", ""],
            Self::Composite(index, count) => ["data-fe-c-", index.as_str(), "-", count.as_str()],
        }
    }

    fn matches_name(&self, name: &str) -> bool {
        if matches!(self, Self::Legacy(_)) {
            return name == "data-fe";
        }
        let mut remaining = name;
        for part in self.parts() {
            let Some(rest) = remaining.strip_prefix(part) else {
                return false;
            };
            remaining = rest;
        }
        remaining.is_empty()
    }
}

struct Executor<'a> {
    plan: &'a Plan,
    options: &'a NativeRenderOptions,
    out: String,
    steps: usize,
}

impl Write for Executor<'_> {
    fn write_str(&mut self, text: &str) -> std::fmt::Result {
        self.push(text).map_err(|_| std::fmt::Error)
    }
}

impl<'a> Executor<'a> {
    fn new(plan: &'a Plan, options: &'a NativeRenderOptions) -> Self {
        Self {
            plan,
            options,
            out: String::new(),
            steps: 0,
        }
    }
    fn push(&mut self, text: &str) -> Result<(), NativeRenderError> {
        if text.len() > self.options.max_output_bytes.saturating_sub(self.out.len()) {
            return Err(error("render-limit", "Output byte limit exceeded"));
        }
        self.out.push_str(text);
        Ok(())
    }
    fn push_parts(&mut self, parts: &[&str]) -> Result<(), NativeRenderError> {
        // Keep each formerly atomic marker append within the budget before
        // writing its first span, including the surrounding space/tag ending.
        let length = parts
            .iter()
            .try_fold(0usize, |length, part| length.checked_add(part.len()))
            .filter(|length| {
                *length <= self.options.max_output_bytes.saturating_sub(self.out.len())
            })
            .ok_or_else(|| error("render-limit", "Output byte limit exceeded"))?;
        // Match a single push_str's output-buffer growth without a marker String.
        self.out.reserve(length);
        for part in parts {
            self.push(part)?;
        }
        Ok(())
    }
    fn tick(&mut self) -> Result<(), NativeRenderError> {
        if self.steps >= self.options.max_steps {
            return Err(error("render-limit", "Execution step limit exceeded"));
        }
        self.steps += 1;
        Ok(())
    }
    fn value(&mut self, value: Option<&J>, escaped: bool) -> Result<(), NativeRenderError> {
        let text = match value {
            None | Some(J::Null) => "",
            Some(J::Bool(true)) => "true",
            Some(J::Bool(false)) => "false",
            Some(J::Number(n)) => {
                return if *n == 0.0 {
                    self.push("0")
                } else {
                    self.number(*n)
                }
            }
            Some(J::String(v)) => v,
            Some(J::Array(_)) => "[Array]",
            Some(J::Object(_)) => "[Object]",
        };
        if escaped {
            write_html_escaped(text, |span| self.push(span))
        } else {
            self.push(text)
        }
    }
    fn number(&mut self, n: f64) -> Result<(), NativeRenderError> {
        write!(self, "{n}").map_err(|_| error("render-limit", "Output byte limit exceeded"))
    }
    fn attr(
        &mut self,
        v: &Attribute,
        root: &Frame<'_>,
        loops: Loops<'_>,
    ) -> Result<(), NativeRenderError> {
        match v {
            Attribute::Literal(value) => self.push(value),
            Attribute::Conditional(test, value) => {
                if condition(test, root, loops) {
                    self.push(value)?;
                }
                Ok(())
            }
            Attribute::Bound {
                name,
                path,
                boolean,
                property,
            } => {
                let val = get(root, loops, path);
                if *boolean {
                    if let Some(J::Bool(value)) = val.as_deref() {
                        if *value {
                            self.push(" ")?;
                            self.push(name)?;
                        }
                        return Ok(());
                    }
                }
                match val.as_deref() {
                    None | Some(J::Null) => return Ok(()),
                    Some(J::Array(_) | J::Object(_)) if *property => return Ok(()),
                    _ => {}
                }
                self.push(" ")?;
                self.push(name)?;
                self.push("=\"")?;
                match val.as_deref() {
                    Some(J::Number(n)) if *property => self.number(*n)?,
                    value => self.value(value, true)?,
                }
                self.push("\"")
            }
            Attribute::Quoted(name, parts) => {
                // A missing later binding suppresses the whole attribute, even when
                // an earlier value would exceed the output budget.
                for part in parts {
                    if let plan::Part::Segment(path) = part {
                        let value = get(root, loops, path);
                        if matches!(value.as_deref(), None | Some(J::Null)) {
                            return Ok(());
                        }
                    }
                }
                self.push(" ")?;
                self.push(name)?;
                self.push("=\"")?;
                for part in parts {
                    if let plan::Part::Literal(text) = part {
                        let mut start = 0;
                        for (at, _) in text.match_indices('"') {
                            self.push(&text[start..at])?;
                            self.push("&quot;")?;
                            start = at + 1;
                        }
                        self.push(&text[start..])?;
                    } else if let plan::Part::Segment(path) = part {
                        self.value(get(root, loops, path).as_deref(), true)?;
                    }
                }
                self.push("\"")
            }
        }
    }
    fn attrs(
        &mut self,
        values: &[Attribute],
        root: &Frame<'_>,
        loops: Loops<'_>,
    ) -> Result<(), NativeRenderError> {
        for value in values {
            self.tick()?;
            self.attr(value, root, loops)?;
        }
        Ok(())
    }
    fn marker(
        &mut self,
        scope: &mut Option<usize>,
        count: usize,
        ending: &str,
    ) -> Result<HydrationMarker, NativeRenderError> {
        let at = scope.as_mut().unwrap();
        let index = *at;
        *at = at
            .checked_add(count)
            .ok_or_else(|| error("render-limit", "Hydration index overflow"))?;
        let marker = if self.options.markers_v2 {
            if count == 1 {
                HydrationMarker::Binding(Decimal::new(index))
            } else {
                HydrationMarker::Composite(Decimal::new(index), Decimal::new(count))
            }
        } else {
            HydrationMarker::Legacy(Decimal::new(count))
        };
        let [a, b, c, d] = marker.parts();
        self.push_parts(&[" ", a, b, c, d, ending])?;
        Ok(marker)
    }
    fn boundary(
        &mut self,
        scope: &Option<usize>,
        kind: &str,
        index: usize,
        repeat: bool,
    ) -> Result<(), NativeRenderError> {
        if scope.is_none() {
            return Ok(());
        }
        if self.options.markers_v2 {
            let index = Decimal::new(index);
            let (prefix, suffix) = if repeat {
                ("<!--fe-repeat$$", "$$fe-repeat-->")
            } else {
                ("<!--fe-b$$", "$$fast-build$$fe-b-->")
            };
            self.push_parts(&[prefix, kind, "$$", index.as_str(), suffix])
        } else {
            self.push(match (repeat, kind) {
                (true, "start") => "<!--fe:r-->",
                (true, _) => "<!--fe:/r-->",
                (false, "start") => "<!--fe:b-->",
                _ => "<!--fe:/b-->",
            })
        }
    }
    fn tag(
        &mut self,
        v: &Tag,
        root: &Frame<'_>,
        loops: Loops<'_>,
        scope: &mut Option<usize>,
    ) -> Result<(), NativeRenderError> {
        if scope.is_none() {
            self.attrs(&v.plain, root, loops)
        } else {
            self.attrs(&v.hydrated, root, loops)?;
            let count = v.count;
            if count > 0 {
                self.marker(scope, count, &v.ending)?;
            }
            Ok(())
        }
    }
    fn body(
        &mut self,
        id: usize,
        root: &Frame<'_>,
        loops: Loops<'_>,
        scope: &mut Option<usize>,
        entry: bool,
        depth: usize,
    ) -> Result<(), NativeRenderError> {
        if depth > 128 {
            return Err(error(
                "render-limit",
                "Component/body nesting exceeds 128 levels",
            ));
        }
        for op in &self.plan.bodies[id] {
            self.tick()?;
            match op {
                Operation::Literal(value) => self.push(value)?,
                Operation::Tag(tag) => self.tag(tag, root, loops, scope)?,
                Operation::Call(id) => self.body(*id, root, loops, scope, entry, depth + 1)?,
                Operation::Dynamic(op) => {
                    let op = op.as_ref();
                    // Repeat validation precedes opening hydration markers.
                    let collection = if let Dynamic::Repeat { path, .. } = op {
                        get(root, loops, path)
                    } else {
                        None
                    };
                    let items = if let Dynamic::Repeat { diagnostic, .. } = op {
                        match collection.as_deref() {
                            None => &[][..],
                            Some(J::Array(v)) => v,
                            _ => {
                                return Err(error(
                                    "repeat-not-array",
                                    format!("repeat binding '{diagnostic}' is not an array"),
                                ))
                            }
                        }
                    } else {
                        &[][..]
                    };
                    let binding = scope.unwrap_or(0);
                    if let Some(index) = scope {
                        *index += 1;
                    }
                    self.boundary(scope, "start", binding, false)?;
                    if let Dynamic::Binding(path, escape) = op {
                        self.value(get(root, loops, path).as_deref(), *escape)?;
                    } else if let Dynamic::When(test, body) = op {
                        if condition(test, root, loops) {
                            self.body(*body, root, loops, &mut scope.map(|_| 0), false, depth + 1)?;
                        }
                    } else if let Dynamic::Repeat { alias, body, .. } = op {
                        for (i, item) in items.iter().enumerate() {
                            self.tick()?;
                            self.boundary(scope, "start", i, true)?;
                            let child_loops = LoopFrame {
                                prefix: alias,
                                item,
                                index: J::Number(i as f64),
                                parent: loops,
                            };
                            self.body(
                                *body,
                                root,
                                Some(&child_loops),
                                &mut scope.map(|_| 0),
                                false,
                                depth + 1,
                            )?;
                            self.boundary(scope, "end", i, true)?;
                        }
                    }
                    self.boundary(scope, "end", binding, false)?;
                }
                Operation::Element(el) => {
                    let component = &self.plan.components[el.component];
                    let name = &component.name;
                    if !selected(self.options, name) {
                        self.tag(&el.opening, root, loops, scope)?;
                        self.body(el.body, root, loops, scope, entry, depth + 1)?;
                        self.push(&el.closing)?;
                        continue;
                    }
                    let props = &el.props;
                    let mut values = ScopeValues::new(props.len());
                    for prop in props {
                        self.tick()?;
                        let path = &prop.keys[if self.options.attribute_name_strategy
                            == AttributeNameStrategy::CamelCase
                        {
                            0
                        } else {
                            1
                        }];
                        let key = path[0].key.as_str();
                        let val = operand(&prop.value, root, loops).unwrap_or(Cow::Owned(J::Null));
                        if prop.group.is_none() {
                            values.insert(key, val);
                        } else {
                            let value = values.get_or_insert_with(key, || {
                                get(root, None, path)
                                    .unwrap_or(Cow::Owned(J::Object(HashMap::new())))
                            });
                            if matches!(value.as_ref(), J::Object(_)) {
                                if let J::Object(group) = value.to_mut() {
                                    group.insert(
                                        prop.group.as_ref().unwrap().clone(),
                                        val.into_owned(),
                                    );
                                }
                            }
                        }
                    }
                    let child = Frame {
                        base: None,
                        values,
                        parent: (root.base.is_none() || matches!(root.base, Some(J::Object(_))))
                            .then_some(root),
                    };
                    let child = if props.is_empty() { root } else { &child };
                    // JS computes shadow before host attributes. Keep error ordering
                    // while retaining a single bounded output allocation.
                    let shadow_start = self.out.len();
                    self.body(
                        component.shadow,
                        child,
                        None,
                        &mut Some(0),
                        false,
                        depth + 1,
                    )?;
                    let shadow = self.out.split_off(shadow_start);
                    let hydration_attribute = if entry {
                        self.attrs(&el.entry, root, loops)?;
                        None
                    } else {
                        self.attrs(&el.normal, root, loops)?;
                        if scope.is_some() && el.count != 0 {
                            Some(self.marker(scope, el.count, "")?)
                        } else {
                            None
                        }
                    };
                    for (key, value) in &el.defaults {
                        self.tick()?;
                        if !hydration_attribute
                            .as_ref()
                            .is_some_and(|marker| marker.matches_name(key))
                        {
                            self.attr(value, child, None)?;
                        }
                    }
                    self.push(">")?;
                    self.push(&component.tag)?;
                    self.push(&shadow)?;
                    self.push("</template>")?;
                    self.body(el.body, root, loops, scope, false, depth + 1)?;
                    self.push(&component.closing)?;
                }
            }
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn marker_artifact() -> CompiledArtifact {
        CompiledArtifact::load(
            &compile_server_artifact("", &Locator::from_templates(HashMap::new())).unwrap(),
        )
        .unwrap()
    }

    #[test]
    fn marker_decimal_covers_usize_and_width_boundaries() {
        let mut values = vec![0, 1, usize::MAX - 1, usize::MAX];
        let mut power = 10usize;
        loop {
            values.extend([power - 1, power, power + 1]);
            let Some(next) = power.checked_mul(10) else {
                break;
            };
            power = next;
        }
        for value in values {
            assert_eq!(Decimal::new(value).as_str(), value.to_string());
        }
    }

    #[test]
    fn marker_appends_preserve_bulk_push_capacity_and_failed_preflight_storage() {
        let artifact = marker_artifact();
        for v2 in [false, true] {
            let compare = |expected: &str,
                           append: &dyn Fn(&mut Executor<'_>) -> Result<(), NativeRenderError>| {
                for capacity in [0usize, 1, 7, 8, 15, 16, 31, 32, 63, 64, 127, 128, 255, 256] {
                    for prefix_length in [
                        0,
                        capacity / 2,
                        capacity.saturating_sub(1),
                        capacity,
                    ] {
                        let prefix = "x".repeat(prefix_length);
                        let options = NativeRenderOptions {
                            markers_v2: v2,
                            max_output_bytes: prefix.len() + expected.len(),
                            ..Default::default()
                        };
                        let make_executor = |options| {
                            let mut executor = Executor::new(&artifact.plan, options);
                            executor.out = String::with_capacity(capacity);
                            executor.push(&prefix).unwrap();
                            executor
                        };
                        let mut bulk = make_executor(&options);
                        let mut spans = make_executor(&options);
                        bulk.push(expected).unwrap();
                        append(&mut spans).unwrap();
                        assert_eq!(spans.out, bulk.out);
                        assert_eq!(spans.out.len(), bulk.out.len());
                        assert_eq!(
                            spans.out.capacity(),
                            bulk.out.capacity(),
                            "v2={v2}, marker={expected}, capacity={capacity}, prefix={prefix_length}"
                        );

                        let short = NativeRenderOptions {
                            max_output_bytes: options.max_output_bytes - 1,
                            ..options.clone()
                        };
                        let mut failed = make_executor(&short);
                        let before = (failed.out.len(), failed.out.capacity());
                        assert_eq!(
                            append(&mut failed).unwrap_err().message,
                            "Output byte limit exceeded"
                        );
                        assert_eq!((failed.out.len(), failed.out.capacity()), before);
                        assert_eq!(failed.out, prefix);
                    }
                }
            };
            for (index, count) in [
                (0, 1),
                (9, 1),
                (10, 9),
                (99, 10),
                (100, 100),
                (usize::MAX - 1, 1),
                (0, usize::MAX),
            ] {
                let attribute = if !v2 {
                    format!("data-fe=\"{count}\"")
                } else if count == 1 {
                    format!("data-fe-b-{index}")
                } else {
                    format!("data-fe-c-{index}-{count}")
                };
                for ending in ["", ">", " />"] {
                    compare(&format!(" {attribute}{ending}"), &|executor| {
                        executor.marker(&mut Some(index), count, ending).map(|_| ())
                    });
                }
            }
            for repeat in [false, true] {
                for kind in ["start", "end"] {
                    for index in [0, 9, 10, 99, 100, usize::MAX] {
                        let marker = if v2 {
                            if repeat {
                                format!("<!--fe-repeat$${kind}$${index}$$fe-repeat-->")
                            } else {
                                format!("<!--fe-b$${kind}$${index}$$fast-build$$fe-b-->")
                            }
                        } else {
                            match (repeat, kind) {
                                (true, "start") => "<!--fe:r-->".to_owned(),
                                (true, _) => "<!--fe:/r-->".to_owned(),
                                (false, "start") => "<!--fe:b-->".to_owned(),
                                _ => "<!--fe:/b-->".to_owned(),
                            }
                        };
                        compare(&marker, &|executor| {
                            executor.boundary(&Some(0), kind, index, repeat)
                        });
                    }
                }
            }
        }
    }

    #[test]
    fn markers_preflight_complete_appends_and_keep_index_overflow_precedence() {
        let artifact = marker_artifact();
        for v2 in [false, true] {
            for (index, count) in [
                (0, 1),
                (9, 1),
                (10, 9),
                (99, 10),
                (100, 100),
                (usize::MAX - 1, 1),
                (0, usize::MAX),
            ] {
                let name = if !v2 {
                    "data-fe".to_owned()
                } else if count == 1 {
                    format!("data-fe-b-{index}")
                } else {
                    format!("data-fe-c-{index}-{count}")
                };
                let attribute = if v2 {
                    name.clone()
                } else {
                    format!("{name}=\"{count}\"")
                };
                for ending in ["", ">", " />"] {
                    let expected = format!("é {attribute}{ending}");
                    for max_output_bytes in 2..=expected.len() + 1 {
                        let options = NativeRenderOptions {
                            markers_v2: v2,
                            max_output_bytes,
                            ..Default::default()
                        };
                        let mut executor = Executor::new(&artifact.plan, &options);
                        executor.push("é").unwrap();
                        let mut scope = Some(index);
                        let result = executor.marker(&mut scope, count, ending);
                        assert_eq!(scope, Some(index + count));
                        assert_eq!(executor.steps, 0);
                        if max_output_bytes < expected.len() {
                            let failed = result.err().unwrap();
                            assert_eq!(failed.code, "render-limit");
                            assert_eq!(failed.message, "Output byte limit exceeded");
                            assert_eq!(executor.out, "é");
                        } else {
                            let marker = result.unwrap();
                            assert_eq!(executor.out, expected);
                            assert!(marker.matches_name(&name));
                            assert!(!marker.matches_name(&format!("{name}0")));
                            assert!(!marker.matches_name(&format!("{name}=")));
                            assert!(!marker.matches_name(""));
                        }
                    }
                }
            }
            let options = NativeRenderOptions {
                markers_v2: v2,
                max_output_bytes: 0,
                ..Default::default()
            };
            let mut executor = Executor::new(&artifact.plan, &options);
            let mut scope = Some(usize::MAX);
            assert_eq!(
                executor.marker(&mut scope, 1, ">").err().unwrap().message,
                "Hydration index overflow"
            );
            assert_eq!(scope, Some(usize::MAX));
            assert!(executor.out.is_empty());
        }
    }

    #[test]
    fn boundaries_keep_exact_bytes_and_atomic_limits_without_steps() {
        let artifact = marker_artifact();
        for v2 in [false, true] {
            for repeat in [false, true] {
                for kind in ["start", "end"] {
                    for index in [0, 9, 10, 99, 100, usize::MAX] {
                        let marker = if v2 {
                            if repeat {
                                format!("<!--fe-repeat$${kind}$${index}$$fe-repeat-->")
                            } else {
                                format!("<!--fe-b$${kind}$${index}$$fast-build$$fe-b-->")
                            }
                        } else {
                            match (repeat, kind) {
                                (true, "start") => "<!--fe:r-->".to_owned(),
                                (true, _) => "<!--fe:/r-->".to_owned(),
                                (false, "start") => "<!--fe:b-->".to_owned(),
                                _ => "<!--fe:/b-->".to_owned(),
                            }
                        };
                        for max_output_bytes in 0..=marker.len() + 1 {
                            let options = NativeRenderOptions {
                                markers_v2: v2,
                                max_output_bytes,
                                ..Default::default()
                            };
                            let mut executor = Executor::new(&artifact.plan, &options);
                            executor.boundary(&None, kind, index, repeat).unwrap();
                            assert!(executor.out.is_empty());
                            let result = executor.boundary(&Some(0), kind, index, repeat);
                            if max_output_bytes < marker.len() {
                                assert_eq!(
                                    result.unwrap_err().message,
                                    "Output byte limit exceeded"
                                );
                                assert!(executor.out.is_empty());
                            } else {
                                result.unwrap();
                                assert_eq!(executor.out, marker);
                            }
                            assert_eq!(executor.steps, 0);
                        }
                    }
                }
            }
        }
    }

    #[test]
    fn static_operands_borrow_artifact_storage() {
        let value = Operand::Value(J::Object(HashMap::from([(
            "items".into(),
            J::Array(vec![J::String("retained literal".repeat(100))]),
        )])));
        let root = Frame {
            base: None,
            values: ScopeValues::new(0),
            parent: None,
        };
        let resolved = operand(&value, &root, None).unwrap();
        let Operand::Value(expected) = &value else {
            unreachable!()
        };
        assert!(matches!(resolved, Cow::Borrowed(_)));
        assert!(std::ptr::eq(resolved.as_ref(), expected));
    }
}
