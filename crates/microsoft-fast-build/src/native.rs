//! Immutable native execution of compiler artifacts; never parses template HTML.
use crate::{content::write_html_escaped, JsonValue as J, Locator, RenderError};
use serde::de::{Deserialize, Deserializer, MapAccess, SeqAccess, Visitor};
use serde_json::Value as V;
use std::borrow::Cow;
use std::collections::HashMap;
use std::fmt::Write;
use std::sync::Arc;

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
    let bytes = crate::server_plan::encode(
        &ir,
        "fast-server-native",
        crate::server_plan::NATIVE_VERSION,
    )
    .to_string()
    .into_bytes();
    CompiledArtifact::load(&bytes).map_err(|error| RenderError::InvalidTemplateMetadata {
        message: error.to_string(),
    })?;
    Ok(bytes)
}

/// A validated, immutable, `Send + Sync` executable. Clones share owned artifact
/// storage; requests own all transient state and output. No JavaScript is used.
#[derive(Clone, Debug)]
pub struct CompiledArtifact {
    ir: Arc<V>,
}

impl CompiledArtifact {
    /// Emit the JavaScript target from this exact validated executable IR.
    /// This is build-time code generation, not native execution of JavaScript.
    pub fn emit_server_module(&self, runtime_import: &str) -> String {
        crate::aot::emit(&self.ir, runtime_import)
    }

    /// Load without HTML/expression parsing. Supports the hash-free `fast-server-native`
    /// semantic schema 1, independently of private execution layouts.
    /// Experimental layouts and unknown schemas require explicit regeneration.
    pub fn load(bytes: &[u8]) -> Result<Self, NativeRenderError> {
        if bytes.len() > 64 * 1024 * 1024 {
            return Err(error("invalid-artifact", "Artifact exceeds 64 MiB"));
        }
        let ir: V = serde_json::from_slice(bytes).map_err(|_| invalid())?;
        if ir["format"] != "fast-server-native"
            // Decoder support is explicit, not coupled to the current emitter version.
            || !matches!(ir["version"].as_u64(), Some(1))
        {
            return Err(error(
                "incompatible-artifact",
                "Unsupported FAST server artifact format/schema; native loader supports fast-server-native schema 1",
            ));
        }
        let ir = crate::server_plan::decode(ir).map_err(|_| invalid())?;
        validate_artifact(&ir)?;
        Ok(Self { ir: Arc::new(ir) })
    }

    pub fn render_entry(
        &self,
        state: &J,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        self.render(
            self.ir["entry"].as_u64().unwrap() as usize,
            state,
            options,
            true,
        )
    }

    /// Parse, fully validate and render fresh owned JSON without a snapshot copy.
    pub fn render_entry_json(
        &self,
        json: &str,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        let state = parse_render_state(json)?;
        self.execute(index(&self.ir["entry"]), &state, options, true)
    }

    /// Fresh JSON rendering with template-context root-host rules.
    pub fn render_template_json(
        &self,
        json: &str,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        let state = parse_render_state(json)?;
        self.execute(index(&self.ir["entry"]), &state, options, false)
    }

    /// Parse and validate before resolving the named host, matching typed input.
    pub fn render_host_json(
        &self,
        name: &str,
        json: &str,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        let state = parse_render_state(json)?;
        self.execute(index(&self.component(name)?["host"]), &state, options, true)
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
        self.render(
            self.ir["entry"].as_u64().unwrap() as usize,
            state,
            options,
            false,
        )
    }

    /// Render without repeating validation or copying the snapshot's root.
    pub fn render_entry_prepared(
        &self,
        state: &PreparedState,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        self.execute(index(&self.ir["entry"]), &state.values, options, true)
    }

    /// Prepared-state rendering with template-context root-host rules.
    pub fn render_template_prepared(
        &self,
        state: &PreparedState,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        self.execute(index(&self.ir["entry"]), &state.values, options, false)
    }

    pub fn render_host(
        &self,
        name: &str,
        state: &J,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        let state = normalized(state, 0, &mut 1_000_000)?;
        let component = self.component(name)?;
        self.execute(
            component["host"].as_u64().unwrap() as usize,
            &state,
            options,
            true,
        )
    }

    /// Render a named host using an immutable validated snapshot.
    pub fn render_host_prepared(
        &self,
        name: &str,
        state: &PreparedState,
        options: &NativeRenderOptions,
    ) -> Result<String, NativeRenderError> {
        self.execute(
            index(&self.component(name)?["host"]),
            &state.values,
            options,
            true,
        )
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
        let mut executor = Executor::new(&self.ir, options);
        executor.push(component["tag"].as_str().unwrap())?;
        executor.body(
            component["shadow"].as_u64().unwrap() as usize,
            &Frame {
                base: Some(state),
                values: HashMap::new(),
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

    fn component(&self, name: &str) -> Result<&V, NativeRenderError> {
        self.ir["components"]
            .get(name)
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
        let mut executor = Executor::new(&self.ir, options);
        executor.body(
            id,
            &Frame {
                base: Some(state),
                values: HashMap::new(),
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

struct Frame<'a> {
    base: Option<&'a J>,
    values: HashMap<&'a str, Cow<'a, J>>,
    parent: Option<&'a Frame<'a>>,
}
struct LoopFrame<'a> {
    prefix: &'a [V],
    item: &'a J,
    index: J,
    parent: Option<&'a LoopFrame<'a>>,
}
type Loops<'a> = Option<&'a LoopFrame<'a>>;

fn nested<'a>(value: &'a J, path: &[V]) -> Option<Cow<'a, J>> {
    let mut value = value;
    for (at, key) in path.iter().enumerate() {
        let key = string(key);
        match value {
            J::Array(values) => {
                if key == "length" {
                    return (at == path.len() - 1)
                        .then_some(Cow::Owned(J::Number(values.len() as f64)));
                }
                let digits = key.strip_prefix('+').unwrap_or(key);
                if digits.is_empty() || !digits.bytes().all(|b| b.is_ascii_digit()) {
                    return None;
                }
                value = values.get(digits.parse::<usize>().ok()?)?;
            }
            J::Object(values) => value = values.get(key)?,
            _ => return None,
        }
    }
    Some(Cow::Borrowed(value))
}

fn get<'a>(root: &'a Frame<'a>, mut loops: Loops<'a>, path: &V) -> Option<Cow<'a, J>> {
    let path = array(path);
    while let Some(current) = loops {
        if string(&path[0]) == "$index" {
            return nested(&current.index, &path[1..]);
        }
        if current.prefix.len() <= path.len()
            && current.prefix.iter().zip(path).all(|(a, b)| a == b)
        {
            return nested(current.item, &path[current.prefix.len()..]);
        }
        loops = current.parent;
    }
    let mut frame = Some(root);
    while let Some(current) = frame {
        if let Some(value) = current.values.get(string(&path[0])) {
            return nested(value, &path[1..]);
        }
        if let Some(base) = current.base {
            let val = nested(base, path);
            if val.is_some()
                || matches!(base, J::Object(values) if values.contains_key(string(&path[0])))
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
fn operand<'a>(v: &V, root: &'a Frame<'a>, loops: Loops<'a>) -> Option<Cow<'a, J>> {
    if v[0] == "path" {
        get(root, loops, &v[1])
    } else {
        Some(Cow::Owned(decoded(&v[1])))
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
fn condition(v: &V, root: &Frame<'_>, loops: Loops<'_>) -> bool {
    match string(&v[0]) {
        "||" => condition(&v[1], root, loops) | condition(&v[2], root, loops),
        "&&" => condition(&v[1], root, loops) & condition(&v[2], root, loops),
        "not" => !truthy(get(root, loops, &v[1]).as_deref()),
        "truthy" => truthy(get(root, loops, &v[1]).as_deref()),
        "compare" => {
            let a = get(root, loops, &v[2]);
            let b = operand(&v[3], root, loops);
            let op = string(&v[1]);
            match (a, b) {
                (Some(a), Some(b)) => {
                    if op == "==" || op == "!=" {
                        return equal(&a, &b) == (op == "==");
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
                        ">" => order > 0,
                        "<" => order < 0,
                        ">=" => order >= 0,
                        _ => order <= 0,
                    }
                }
                (None, None) => matches!(op, "==" | ">=" | "<="),
                _ => op == "!=",
            }
        }
        _ => unreachable!("validated condition"),
    }
}

struct Executor<'a> {
    ir: &'a V,
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
    fn new(ir: &'a V, options: &'a NativeRenderOptions) -> Self {
        Self {
            ir,
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
    fn attr(&mut self, v: &V, root: &Frame<'_>, loops: Loops<'_>) -> Result<(), NativeRenderError> {
        match string(&v[0]) {
            "literal" => self.push(string(&v[1])),
            "conditional" => {
                if condition(&v[1], root, loops) {
                    self.push(string(&v[2]))?;
                }
                Ok(())
            }
            "attribute" => {
                let val = get(root, loops, &v[2]);
                if v[3] == true {
                    if let Some(J::Bool(value)) = val.as_deref() {
                        if *value {
                            self.push(" ")?;
                            self.push(string(&v[1]))?;
                        }
                        return Ok(());
                    }
                }
                match val.as_deref() {
                    None | Some(J::Null) => return Ok(()),
                    Some(J::Array(_) | J::Object(_)) if v[4] == true => return Ok(()),
                    _ => {}
                }
                self.push(" ")?;
                self.push(string(&v[1]))?;
                self.push("=\"")?;
                match val.as_deref() {
                    Some(J::Number(n)) if v[4] == true => self.number(*n)?,
                    value => self.value(value, true)?,
                }
                self.push("\"")
            }
            "quoted" => {
                // A missing later binding suppresses the whole attribute, even when
                // an earlier value would exceed the output budget.
                let mut values = Vec::new();
                for part in array(&v[2]) {
                    if part[0] != "literal" {
                        let value = get(root, loops, &part[1]);
                        if matches!(value.as_deref(), None | Some(J::Null)) {
                            return Ok(());
                        }
                        values.push(value.unwrap());
                    }
                }
                self.push(" ")?;
                self.push(string(&v[1]))?;
                self.push("=\"")?;
                let mut values = values.iter();
                for part in array(&v[2]) {
                    if part[0] == "literal" {
                        let text = string(&part[1]);
                        let mut start = 0;
                        for (at, _) in text.match_indices('"') {
                            self.push(&text[start..at])?;
                            self.push("&quot;")?;
                            start = at + 1;
                        }
                        self.push(&text[start..])?;
                    } else {
                        self.value(values.next().map(|value| value.as_ref()), true)?;
                    }
                }
                self.push("\"")
            }
            _ => unreachable!("validated attribute"),
        }
    }
    fn attrs(
        &mut self,
        values: &V,
        root: &Frame<'_>,
        loops: Loops<'_>,
    ) -> Result<(), NativeRenderError> {
        for value in array(values) {
            self.tick()?;
            self.attr(value, root, loops)?;
        }
        Ok(())
    }
    fn marker(
        &mut self,
        scope: &mut Option<usize>,
        count: usize,
    ) -> Result<String, NativeRenderError> {
        let at = scope.as_mut().unwrap();
        let index = *at;
        *at = at
            .checked_add(count)
            .ok_or_else(|| error("render-limit", "Hydration index overflow"))?;
        let marker = if self.options.markers_v2 {
            if count == 1 {
                format!("data-fe-b-{index}")
            } else {
                format!("data-fe-c-{index}-{count}")
            }
        } else {
            format!("data-fe=\"{count}\"")
        };
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
        let text = if self.options.markers_v2 {
            if repeat {
                format!("<!--fe-repeat$${kind}$${index}$$fe-repeat-->")
            } else {
                format!("<!--fe-b$${kind}$${index}$$fast-build$$fe-b-->")
            }
        } else {
            match (repeat, kind) {
                (true, "start") => "<!--fe:r-->",
                (true, _) => "<!--fe:/r-->",
                (false, "start") => "<!--fe:b-->",
                _ => "<!--fe:/b-->",
            }
            .into()
        };
        self.push(&text)
    }
    fn tag(
        &mut self,
        v: &V,
        root: &Frame<'_>,
        loops: Loops<'_>,
        scope: &mut Option<usize>,
    ) -> Result<(), NativeRenderError> {
        if scope.is_none() {
            self.attrs(&v["plain"], root, loops)
        } else {
            self.attrs(&v["hydrated"], root, loops)?;
            let count = index(&v["count"]);
            if count > 0 {
                let marker = self.marker(scope, count)?;
                self.push(&format!(" {marker}{}", string(&v["ending"])))?;
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
        for op in array(&self.ir["bodies"][id]) {
            self.tick()?;
            match string(&op[0]) {
                "literal" => self.push(string(&op[1]))?,
                "tag" => self.tag(&op[1], root, loops, scope)?,
                "call" => self.body(index(&op[1]), root, loops, scope, entry, depth + 1)?,
                "binding" | "when" | "repeat" => {
                    // Repeat validation precedes opening hydration markers.
                    let collection = if op[0] == "repeat" {
                        get(root, loops, &op[2])
                    } else {
                        None
                    };
                    let items = if op[0] == "repeat" {
                        match collection.as_deref() {
                            None => &[][..],
                            Some(J::Array(v)) => v,
                            _ => {
                                return Err(error(
                                    "repeat-not-array",
                                    format!("repeat binding '{}' is not an array", string(&op[3])),
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
                    if op[0] == "binding" {
                        self.value(get(root, loops, &op[1]).as_deref(), op[2] == true)?;
                    } else if op[0] == "when" {
                        if condition(&op[1], root, loops) {
                            self.body(
                                index(&op[2]),
                                root,
                                loops,
                                &mut scope.map(|_| 0),
                                false,
                                depth + 1,
                            )?;
                        }
                    } else {
                        for (i, item) in items.iter().enumerate() {
                            self.tick()?;
                            self.boundary(scope, "start", i, true)?;
                            let child_loops = LoopFrame {
                                prefix: array(&op[1]),
                                item,
                                index: J::Number(i as f64),
                                parent: loops,
                            };
                            self.body(
                                index(&op[4]),
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
                "element" => {
                    let el = &op[1];
                    let name = string(&el["name"]);
                    if !selected(self.options, name) {
                        self.tag(&el["opening"], root, loops, scope)?;
                        self.body(index(&el["body"]), root, loops, scope, entry, depth + 1)?;
                        self.push(string(&el["closing"]))?;
                        continue;
                    }
                    let props = array(&el["props"]);
                    let mut values = HashMap::new();
                    for prop in props {
                        self.tick()?;
                        let key = string(
                            &prop[if self.options.attribute_name_strategy
                                == AttributeNameStrategy::CamelCase
                            {
                                0
                            } else {
                                1
                            }],
                        );
                        let val = operand(&prop[3], root, loops).unwrap_or(Cow::Owned(J::Null));
                        if prop[2].is_null() {
                            values.insert(key, val);
                        } else {
                            let value = values.entry(key).or_insert_with(|| {
                                get(root, None, &serde_json::json!([key]))
                                    .unwrap_or(Cow::Owned(J::Object(HashMap::new())))
                            });
                            if matches!(value.as_ref(), J::Object(_)) {
                                if let J::Object(group) = value.to_mut() {
                                    group.insert(string(&prop[2]).into(), val.into_owned());
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
                        index(&self.ir["components"][name]["shadow"]),
                        child,
                        None,
                        &mut Some(0),
                        false,
                        depth + 1,
                    )?;
                    let shadow = self.out.split_off(shadow_start);
                    let hydration_attribute = if entry {
                        self.attrs(&el["entry"], root, loops)?;
                        None
                    } else {
                        self.attrs(&el["normal"], root, loops)?;
                        if scope.is_some() && el["count"] != 0 {
                            let marker = self.marker(scope, index(&el["count"]))?;
                            self.push(&format!(" {marker}"))?;
                            Some(marker.split('=').next().unwrap().to_string())
                        } else {
                            None
                        }
                    };
                    for default in array(&el["defaults"]) {
                        self.tick()?;
                        if hydration_attribute.as_deref() != Some(string(&default[0])) {
                            self.attr(&default[1], child, None)?;
                        }
                    }
                    self.push(">")?;
                    self.push(string(&el["shadowTag"]))?;
                    self.push(&shadow)?;
                    self.push("</template>")?;
                    self.body(index(&el["body"]), root, loops, scope, false, depth + 1)?;
                    self.push(&format!("</{name}>"))?;
                }
                _ => unreachable!("validated opcode"),
            }
        }
        Ok(())
    }
}

fn validate_artifact(ir: &V) -> Result<(), NativeRenderError> {
    fn fields(v: &V, names: &[&str]) -> bool {
        v.as_object().is_some_and(|obj| {
            obj.len() == names.len() && names.iter().all(|n| obj.contains_key(*n))
        })
    }
    fn path(v: &V) -> bool {
        v.as_array()
            .is_some_and(|a| !a.is_empty() && a.iter().all(V::is_string))
    }
    fn shape(v: &V, len: usize) -> bool {
        v.as_array().is_some_and(|a| a.len() == len)
    }
    fn val(v: &V, depth: usize) -> bool {
        if depth > 64 {
            return false;
        }
        match v[0].as_str() {
            Some("null") => shape(v, 1),
            Some("bool") => shape(v, 2) && v[1].is_boolean(),
            Some("number") => {
                shape(v, 2) && v[1].as_str().is_some_and(|s| s.parse::<f64>().is_ok())
            }
            Some("string") => shape(v, 2) && v[1].is_string(),
            Some("array") => {
                shape(v, 2)
                    && v[1]
                        .as_array()
                        .is_some_and(|a| a.iter().all(|v| val(v, depth + 1)))
            }
            Some("object") => {
                shape(v, 2)
                    && v[1]
                        .as_object()
                        .is_some_and(|a| a.values().all(|v| val(v, depth + 1)))
            }
            _ => false,
        }
    }
    fn operand(v: &V) -> bool {
        shape(v, 2)
            && match v[0].as_str() {
                Some("path") => path(&v[1]),
                Some("value") => val(&v[1], 0),
                _ => false,
            }
    }
    fn cond(v: &V, depth: usize) -> bool {
        if depth > 64 {
            return false;
        }
        match v[0].as_str() {
            Some("||" | "&&") => shape(v, 3) && cond(&v[1], depth + 1) && cond(&v[2], depth + 1),
            Some("not" | "truthy") => shape(v, 2) && path(&v[1]),
            Some("compare") => {
                shape(v, 4)
                    && matches!(v[1].as_str(), Some("==" | "!=" | ">=" | "<=" | ">" | "<"))
                    && path(&v[2])
                    && operand(&v[3])
            }
            _ => false,
        }
    }
    fn attr(v: &V) -> bool {
        match v[0].as_str() {
            Some("literal") => shape(v, 2) && v[1].is_string(),
            Some("conditional") => shape(v, 3) && cond(&v[1], 0) && v[2].is_string(),
            Some("attribute") => {
                shape(v, 5)
                    && v[1].is_string()
                    && path(&v[2])
                    && v[3].is_boolean()
                    && v[4].is_boolean()
            }
            Some("quoted") => {
                shape(v, 3)
                    && v[1].is_string()
                    && v[2].as_array().is_some_and(|parts| {
                        parts.iter().all(|p| {
                            shape(p, 2)
                                && match p[0].as_str() {
                                    Some("literal") => p[1].is_string(),
                                    Some("segment") => path(&p[1]),
                                    _ => false,
                                }
                        })
                    })
            }
            _ => false,
        }
    }
    fn attrs(v: &V) -> bool {
        v.as_array().is_some_and(|a| a.iter().all(attr))
    }
    fn count(v: &V) -> bool {
        v.as_u64().is_some_and(|v| v <= 1_000_000)
    }
    fn tag(v: &V) -> bool {
        fields(v, &["plain", "hydrated", "count", "ending"])
            && attrs(&v["plain"])
            && attrs(&v["hydrated"])
            && count(&v["count"])
            && v["ending"].is_string()
    }
    if !fields(ir, &["entry", "bodies", "components"]) {
        return Err(invalid());
    }
    let bodies = ir["bodies"].as_array().ok_or_else(invalid)?;
    if bodies.is_empty() || bodies.len() > 1_000_000 {
        return Err(invalid());
    }
    let reference = |v: &V| v.as_u64().is_some_and(|i| i < bodies.len() as u64);
    if !reference(&ir["entry"]) {
        return Err(invalid());
    }
    let components = ir["components"].as_object().ok_or_else(invalid)?;
    for (name, c) in components {
        if name.is_empty()
            || !fields(c, &["shadow", "host", "tag"])
            || !reference(&c["shadow"])
            || !reference(&c["host"])
            || !c["tag"].is_string()
        {
            return Err(invalid());
        }
    }
    let mut total = 0usize;
    for body in bodies {
        for op in body.as_array().ok_or_else(invalid)? {
            total += 1;
            if total > 1_000_000 {
                return Err(invalid());
            }
            let valid = match op[0].as_str() {
                Some("literal") => shape(op, 2) && op[1].is_string(),
                Some("tag") => shape(op, 2) && tag(&op[1]),
                Some("call") => shape(op, 2) && reference(&op[1]),
                Some("binding") => shape(op, 3) && path(&op[1]) && op[2].is_boolean(),
                Some("when") => shape(op, 3) && cond(&op[1], 0) && reference(&op[2]),
                Some("repeat") => {
                    shape(op, 5)
                        && path(&op[1])
                        && path(&op[2])
                        && op[3].is_string()
                        && reference(&op[4])
                }
                Some("element") => {
                    let el = &op[1];
                    shape(op, 2)
                        && fields(
                            el,
                            &[
                                "name",
                                "body",
                                "closing",
                                "opening",
                                "props",
                                "entry",
                                "normal",
                                "count",
                                "defaults",
                                "shadowTag",
                            ],
                        )
                        && el["name"]
                            .as_str()
                            .is_some_and(|n| components.contains_key(n))
                        && reference(&el["body"])
                        && el["closing"].is_string()
                        && tag(&el["opening"])
                        && attrs(&el["entry"])
                        && attrs(&el["normal"])
                        && count(&el["count"])
                        && el["shadowTag"].is_string()
                        && el["props"].as_array().is_some_and(|a| {
                            a.iter().all(|p| {
                                shape(p, 4)
                                    && p[0].is_string()
                                    && p[1].is_string()
                                    && (p[2].is_null() || p[2].is_string())
                                    && operand(&p[3])
                            })
                        })
                        && el["defaults"].as_array().is_some_and(|a| {
                            a.iter()
                                .all(|p| shape(p, 2) && p[0].is_string() && attr(&p[1]))
                        })
                }
                _ => false,
            };
            if !valid {
                return Err(invalid());
            }
        }
    }
    Ok(())
}
