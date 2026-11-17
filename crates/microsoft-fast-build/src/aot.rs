use crate::{Locator, RenderError};
use serde_json::Value;

/// Compile trusted declarative templates through the shared executable IR to ESM.
pub fn compile_server_module(
    entry: &str,
    locator: &Locator,
    runtime_import: &str,
) -> Result<String, RenderError> {
    let ir = crate::server_ir::lower(entry, locator)?;
    Ok(emit(&ir, runtime_import))
}

fn emit(ir: &Value, runtime_import: &str) -> String {
    let plan = crate::server_plan::encode(ir, "fast-server-js", crate::server_plan::JS_VERSION);
    format!(
        "import * as $ from {};\n\
         const plan = {plan};\n\
         const {{prepareState,renderEntry,renderTemplate,renderHost,renderShadow,renderEntryPrepared,renderTemplatePrepared,renderHostPrepared,renderShadowPrepared,components}} = $.createServerRenderer(plan);\n\
         export {{prepareState,renderEntry,renderTemplate,renderHost,renderShadow,renderEntryPrepared,renderTemplatePrepared,renderHostPrepared,renderShadowPrepared,components}};\n",
        serde_json::to_string(runtime_import).unwrap(),
    )
}
