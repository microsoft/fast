use crate::{Locator, RenderError};
use serde_json::{json, Map, Value};
use std::collections::{BTreeMap, BTreeSet, HashMap};

/// Compile trusted declarative templates through the shared executable IR to ESM.
pub fn compile_server_module(
    entry: &str,
    locator: &Locator,
    runtime_import: &str,
) -> Result<String, RenderError> {
    let ir = crate::server_ir::lower(entry, locator)?;
    Ok(emit(&ir, runtime_import))
}

pub(crate) fn emit(ir: &Value, runtime_import: &str) -> String {
    let plan = crate::server_plan::encode(ir, "fast-server-js", crate::server_plan::JS_VERSION);
    format!(
        "import * as $ from {};\n\
         const plan = {plan};\n\
         const {{prepareState,renderEntry,renderTemplate,renderHost,renderShadow,renderEntryPrepared,renderTemplatePrepared,renderHostPrepared,renderShadowPrepared,components}} = $.createServerRenderer(plan);\n\
         export {{prepareState,renderEntry,renderTemplate,renderHost,renderShadow,renderEntryPrepared,renderTemplatePrepared,renderHostPrepared,renderShadowPrepared,components}};\n",
        serde_json::to_string(runtime_import).unwrap(),
    )
}

/// A complete server ESM deployment with semantic filenames and template references.
#[derive(Debug)]
pub struct ServerAssets {
    /// The module exposing the ordinary and prepared rendering APIs.
    pub entry: String,
    /// Relative filenames and UTF-8 contents, including the dependency manifest.
    pub files: BTreeMap<String, String>,
}

fn component_filename(name: &str) -> String {
    let mut safe = String::new();
    for byte in name.bytes() {
        if byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'-' || byte == b'_' {
            safe.push(byte as char);
        } else {
            safe.push_str(&format!("~{byte:02x}"));
        }
    }
    format!("component-{safe}.plan.mjs")
}

struct ModuleTemplates<'a> {
    source: &'a Value,
    prefix: String,
    names: HashMap<String, String>,
    templates: Map<String, Value>,
    dependencies: BTreeSet<String>,
}

impl ModuleTemplates<'_> {
    fn template(&mut self, original: &str) -> String {
        if let Some(name) = self.names.get(original) {
            return name.clone();
        }
        let name = format!("{}template{}", self.prefix, self.names.len());
        self.names.insert(original.into(), name.clone());
        let body = self.body(&self.source[original].clone());
        self.templates.insert(name.clone(), body);
        name
    }

    fn body(&mut self, body: &Value) -> Value {
        body.as_array()
            .unwrap()
            .iter()
            .map(|op| {
                let mut op = op.clone();
                let reference = match op["type"].as_str().unwrap() {
                    "template" => Some("name"),
                    "when" | "repeat" => Some("template"),
                    "element" => {
                        self.dependencies.insert(op["name"].as_str().unwrap().into());
                        Some("body")
                    }
                    "component" => {
                        self.dependencies.insert(op["name"].as_str().unwrap().into());
                        None
                    }
                    _ => None,
                };
                if let Some(field) = reference {
                    op[field] = json!(self.template(op[field].as_str().unwrap()));
                }
                op
            })
            .collect()
    }
}

/// Compile a whole registry into optional semantic data modules using the ordinary executor.
///
/// Each module owns its reachable templates with stable, disjoint names. Component
/// references remain symbolic, including cycles and externally supplied elements.
pub fn compile_server_assets(
    entry: &str,
    locator: &Locator,
    runtime_import: &str,
) -> Result<ServerAssets, RenderError> {
    let ir = crate::server_ir::lower(entry, locator)?;
    let plan = crate::server_plan::encode(&ir, "fast-server-js", crate::server_plan::JS_VERSION);
    let mut files = BTreeMap::new();
    let mut dependencies = BTreeMap::new();
    let mut components = BTreeMap::new();
    let mut imports = String::from("import {plan as entryPlan} from \"./entry.plan.mjs\";\n");
    let mut registry = Vec::new();
    let mut modules = vec![(None, "entry.plan.mjs".to_string())];
    for name in plan["components"].as_object().unwrap().keys() {
        let filename = component_filename(name);
        components.insert(name.clone(), filename.clone());
        modules.push((Some(name.as_str()), filename));
    }
    for (name, filename) in modules {
        let mut local = ModuleTemplates {
            source: &plan["templates"],
            prefix: name.map_or_else(
                || "entry:".into(),
                |name| format!("component:{}:", serde_json::to_string(name).unwrap()),
            ),
            names: HashMap::new(),
            templates: Map::new(),
            dependencies: BTreeSet::new(),
        };
        let mut component_refs = Map::new();
        let entry = if let Some(name) = name {
            let root = local.template(plan["components"][name].as_str().unwrap());
            component_refs.insert(name.into(), json!(root));
            json!([])
        } else {
            local.body(&plan["entry"])
        };
        let data = json!({
            "format":"fast-server-js", "version":crate::server_plan::JS_VERSION,
            "entry":entry, "templates":local.templates, "components":component_refs,
        });
        dependencies.insert(filename.clone(), local.dependencies);
        files.insert(filename.clone(), format!("export const plan = {data};\n"));
        if name.is_some() {
            let index = registry.len();
            imports.push_str(&format!(
                "import {{plan as c{index}}} from {};\n",
                serde_json::to_string(&format!("./{filename}")).unwrap(),
            ));
            registry.push(format!("c{index}"));
        }
    }
    imports.push_str(&format!(
        "const componentPlans = [{}];\n\
         const plan = {{format:entryPlan.format,version:entryPlan.version,entry:entryPlan.entry,\
         templates:Object.assign({{}},entryPlan.templates,...componentPlans.map(p=>p.templates)),\
         components:Object.fromEntries(componentPlans.flatMap(p=>Object.entries(p.components)))}};\n",
        registry.join(","),
    ));
    files.insert(
        "server.mjs".into(),
        format!(
            "import * as $ from {};\n\
             {imports}\
             const {{prepareState,renderEntry,renderTemplate,renderHost,renderShadow,renderEntryPrepared,renderTemplatePrepared,renderHostPrepared,renderShadowPrepared,components}} = $.createServerRenderer(plan);\n\
             export {{prepareState,renderEntry,renderTemplate,renderHost,renderShadow,renderEntryPrepared,renderTemplatePrepared,renderHostPrepared,renderShadowPrepared,components}};\n",
            serde_json::to_string(runtime_import).unwrap(),
        ),
    );
    files.insert(
        "server.manifest.json".into(),
        format!(
            "{}\n",
            json!({
                "format":"fast-server-manifest", "version":1,
                "planFormat":"fast-server-js", "planVersion":crate::server_plan::JS_VERSION,
                "runtimeImport":runtime_import, "entry":"server.mjs",
                "entryPlan":"entry.plan.mjs", "components":components, "dependencies":dependencies,
            }),
        ),
    );
    Ok(ServerAssets {
        entry: "server.mjs".into(),
        files,
    })
}
