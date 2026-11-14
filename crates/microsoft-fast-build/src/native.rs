//! Immutable native execution of compiler artifacts; never parses template HTML.
use crate::{
    content::{html_escape, write_html_escaped},
    JsonValue as J, Locator, RenderError,
};
use serde_json::Value as V;
use std::collections::HashMap;
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

/// Compile ahead of time to a versioned executable artifact, not template metadata.
pub fn compile_server_artifact(entry: &str, locator: &Locator) -> Result<Vec<u8>, RenderError> {
    let bytes = crate::server_ir::lower(entry, locator)?
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

    /// Load without HTML/expression parsing. Exact compiler/helper/version identity
    /// is required. Deploy artifacts and their matching native library together.
    pub fn load(bytes: &[u8]) -> Result<Self, NativeRenderError> {
        if bytes.len() > 64 * 1024 * 1024 {
            return Err(error("invalid-artifact", "Artifact exceeds 64 MiB"));
        }
        let ir: V = serde_json::from_slice(bytes).map_err(|_| invalid())?;
        if ir["format"] != "fast-server"
            || ir["version"] != crate::server_ir::ARTIFACT_VERSION
            || ir["runtimeVersion"] != crate::SERVER_RUNTIME_VERSION
            || ir["compilerId"] != crate::SERVER_COMPILER_ID
        {
            return Err(error(
                "incompatible-artifact",
                "Regenerate with the deployed FAST compiler/native library",
            ));
        }
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
            state,
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
        let component = self.component(name)?;
        if !selected(options, name) {
            return Ok(String::new());
        }
        let mut executor = Executor::new(&self.ir, options);
        executor.push(component["tag"].as_str().unwrap())?;
        executor.body(
            component["shadow"].as_u64().unwrap() as usize,
            &Frame {
                values: state,
                parent: None,
            },
            &[],
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
        self.execute(id, state, options, entry)
    }

    fn execute(
        &self,
        id: usize,
        state: J,
        options: &NativeRenderOptions,
        entry: bool,
    ) -> Result<String, NativeRenderError> {
        let mut executor = Executor::new(&self.ir, options);
        executor.body(
            id,
            &Frame {
                values: state,
                parent: None,
            },
            &[],
            &mut None,
            entry,
            0,
        )?;
        Ok(executor.out)
    }
}

/// Parse request JSON with finite numbers and a bounded nesting depth.
pub fn parse_render_state(json: &str) -> Result<J, NativeRenderError> {
    let value: V = serde_json::from_str(json).map_err(|e| error("invalid-state", e.to_string()))?;
    fn convert(v: V) -> J {
        match v {
            V::Null => J::Null,
            V::Bool(v) => J::Bool(v),
            V::Number(v) => J::Number(v.as_f64().unwrap()),
            V::String(v) => J::String(v),
            V::Array(v) => J::Array(v.into_iter().map(convert).collect()),
            V::Object(v) => J::Object(v.into_iter().map(|(k, v)| (k, convert(v))).collect()),
        }
    }
    normalized(&convert(value), 0, &mut 1_000_000)
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
    values: J,
    parent: Option<&'a Frame<'a>>,
}
type Loops = [(Vec<String>, J)];

fn nested(value: &J, path: &[V]) -> Option<J> {
    let mut value = value;
    for (at, key) in path.iter().enumerate() {
        let key = string(key);
        match value {
            J::Array(values) => {
                if key == "length" {
                    return (at == path.len() - 1).then_some(J::Number(values.len() as f64));
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
    Some(value.clone())
}

fn get(root: &Frame<'_>, loops: &Loops, path: &V) -> Option<J> {
    let path = array(path);
    for (prefix, value) in loops.iter().rev() {
        if prefix.len() <= path.len() && prefix.iter().zip(path).all(|(a, b)| a == string(b)) {
            return nested(value, &path[prefix.len()..]);
        }
    }
    let mut frame = Some(root);
    while let Some(current) = frame {
        let val = nested(&current.values, path);
        if val.is_some()
            || matches!(&current.values, J::Object(values) if values.contains_key(string(&path[0])))
        {
            return val;
        }
        frame = current.parent;
    }
    None
}

fn text(value: Option<&J>) -> String {
    match value {
        None | Some(J::Null) => String::new(),
        Some(J::Bool(v)) => v.to_string(),
        Some(J::Number(v)) => {
            if *v == 0.0 {
                "0".into()
            } else {
                v.to_string()
            }
        }
        Some(J::String(v)) => v.clone(),
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
fn operand(v: &V, root: &Frame<'_>, loops: &Loops) -> Option<J> {
    if v[0] == "path" {
        get(root, loops, &v[1])
    } else {
        Some(decoded(&v[1]))
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
fn condition(v: &V, root: &Frame<'_>, loops: &Loops) -> bool {
    match string(&v[0]) {
        "||" => condition(&v[1], root, loops) | condition(&v[2], root, loops),
        "&&" => condition(&v[1], root, loops) & condition(&v[2], root, loops),
        "not" => !truthy(get(root, loops, &v[1]).as_ref()),
        "truthy" => truthy(get(root, loops, &v[1]).as_ref()),
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

fn attr(v: &V, root: &Frame<'_>, loops: &Loops) -> String {
    match string(&v[0]) {
        "literal" => string(&v[1]).into(),
        "conditional" => {
            if condition(&v[1], root, loops) {
                string(&v[2]).into()
            } else {
                String::new()
            }
        }
        "attribute" => {
            let val = get(root, loops, &v[2]);
            let name = string(&v[1]);
            if v[3] == true {
                if let Some(J::Bool(value)) = val {
                    return if value {
                        format!(" {name}")
                    } else {
                        String::new()
                    };
                }
            }
            match val.as_ref() {
                None | Some(J::Null) => String::new(),
                Some(J::Array(_) | J::Object(_)) if v[4] == true => String::new(),
                Some(J::Number(n)) if v[4] == true => {
                    format!(" {name}=\"{}\"", html_escape(&n.to_string()))
                }
                val => format!(" {name}=\"{}\"", html_escape(&text(val))),
            }
        }
        "quoted" => {
            let mut out = String::new();
            for part in array(&v[2]) {
                if part[0] == "literal" {
                    out.push_str(string(&part[1]));
                } else {
                    let value = get(root, loops, &part[1]);
                    if value.is_none() || matches!(value, Some(J::Null)) {
                        return String::new();
                    }
                    out.push_str(&html_escape(&text(value.as_ref())));
                }
            }
            format!(" {}=\"{}\"", string(&v[1]), out.replace('"', "&quot;"))
        }
        _ => unreachable!("validated attribute"),
    }
}

struct Executor<'a> {
    ir: &'a V,
    options: &'a NativeRenderOptions,
    out: String,
    steps: usize,
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
    fn attrs(
        &mut self,
        values: &V,
        root: &Frame<'_>,
        loops: &Loops,
    ) -> Result<(), NativeRenderError> {
        for value in array(values) {
            self.tick()?;
            self.push(&attr(value, root, loops))?;
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
        loops: &Loops,
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
        loops: &Loops,
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
                    let items = if op[0] == "repeat" {
                        match get(root, loops, &op[2]) {
                            None => Vec::new(),
                            Some(J::Array(v)) => v,
                            _ => {
                                return Err(error(
                                    "repeat-not-array",
                                    format!("repeat binding '{}' is not an array", string(&op[3])),
                                ))
                            }
                        }
                    } else {
                        Vec::new()
                    };
                    let binding = scope.unwrap_or(0);
                    if let Some(index) = scope {
                        *index += 1;
                    }
                    self.boundary(scope, "start", binding, false)?;
                    if op[0] == "binding" {
                        let text = text(get(root, loops, &op[1]).as_ref());
                        if op[2] == true {
                            write_html_escaped(&text, |span| self.push(span))?;
                        } else {
                            self.push(&text)?;
                        }
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
                        for (i, item) in items.into_iter().enumerate() {
                            self.tick()?;
                            self.boundary(scope, "start", i, true)?;
                            let mut child_loops = loops.to_vec();
                            child_loops.push((
                                array(&op[1]).iter().map(|v| string(v).into()).collect(),
                                item,
                            ));
                            child_loops.push((vec!["$index".into()], J::Number(i as f64)));
                            self.body(
                                index(&op[4]),
                                root,
                                &child_loops,
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
                        let val = operand(&prop[3], root, loops).unwrap_or(J::Null);
                        if prop[2].is_null() {
                            values.insert(key.into(), val);
                        } else {
                            let value = values.entry(key.to_string()).or_insert_with(|| {
                                get(root, &[], &serde_json::json!([key]))
                                    .unwrap_or(J::Object(HashMap::new()))
                            });
                            if let J::Object(group) = value {
                                group.insert(string(&prop[2]).into(), val);
                            }
                        }
                    }
                    let child = Frame {
                        values: J::Object(values),
                        parent: matches!(root.values, J::Object(_)).then_some(root),
                    };
                    let child = if props.is_empty() { root } else { &child };
                    // JS computes shadow before host attributes. Keep error ordering
                    // while retaining a single bounded output allocation.
                    let shadow_start = self.out.len();
                    self.body(
                        index(&self.ir["components"][name]["shadow"]),
                        child,
                        &[],
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
                            self.push(&attr(&default[1], child, &[]))?;
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
    if !fields(
        ir,
        &[
            "format",
            "version",
            "compilerId",
            "runtimeVersion",
            "entry",
            "bodies",
            "components",
        ],
    ) {
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
