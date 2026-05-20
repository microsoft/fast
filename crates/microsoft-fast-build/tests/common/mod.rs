use microsoft_fast_build::{render_template, Locator, JsonValue, RenderError};
use std::collections::HashMap;

pub fn ok(template: &str, state: &str) -> String {
    render_template(template, state, None)
        .unwrap_or_else(|e| panic!("unexpected error: {e}"))
}

pub fn err(template: &str, state: &str) -> RenderError {
    render_template(template, state, None)
        .expect_err("expected an error but rendering succeeded")
}

pub fn make_locator(entries: &[(&str, &str)]) -> Locator {
    let mut templates = HashMap::new();
    for (name, content) in entries {
        templates.insert((*name).to_string(), (*content).to_string());
    }
    Locator::from_templates(templates)
}

/// Build a `Locator` where each entry specifies host attributes that should be
/// merged onto the rendered host element opening tag. `host_attrs` mirrors the
/// shape produced by `<f-template>` parsing: `(name, Option<value>)` pairs in
/// source order. `None` denotes a static boolean attribute (no `=`).
pub fn make_locator_with_host_attrs(
    entries: &[(&str, &str, &[(&str, Option<&str>)])],
) -> Locator {
    let mut templates: HashMap<
        String,
        (
            String,
            Vec<(String, Option<String>)>,
            Vec<(String, Option<String>)>,
        ),
    > = HashMap::new();
    for (name, content, host_attrs) in entries {
        let host = host_attrs
            .iter()
            .map(|(n, v)| ((*n).to_string(), v.map(|s| s.to_string())))
            .collect();
        templates.insert(
            (*name).to_string(),
            ((*content).to_string(), Vec::new(), host),
        );
    }
    Locator::from_template_definitions(templates)
}

pub fn empty_root() -> JsonValue {
    JsonValue::Object(HashMap::new())
}
