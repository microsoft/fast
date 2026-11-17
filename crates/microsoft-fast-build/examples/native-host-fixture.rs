//! Untimed source-proof fixtures for native Node hosting.
use microsoft_fast_build::{
    compile_server_artifact, AttributeNameStrategy, CompiledArtifact, Locator, NativeRenderOptions,
};

fn main() {
    let locator = Locator::from_templates(
        [(
            "test-card".to_owned(),
            "<h2 title=\"{{label}}\">{{label}}</h2><f-repeat value=\"{{item in items}}\">{{item}}/{{$index}}</f-repeat>".to_owned(),
        )]
        .into_iter()
        .collect(),
    );
    let artifact = compile_server_artifact("<test-card></test-card>", &locator).unwrap();
    let program = CompiledArtifact::load(&artifact).unwrap();
    let state = r#"{"label":"<&\"'\ud83d\ude00","items":["\u03b1",null,0,{"x":1}]}"#;
    let mut outputs = Vec::new();
    for options in [
        serde_json::json!({}),
        serde_json::json!({"markersV2":true}),
        serde_json::json!({"dsd":[]}),
        serde_json::json!({"attributeNameStrategy":"none"}),
        serde_json::json!({"markersV2":true,"dsd":["test-card"]}),
        serde_json::json!({"markersV2":false,"dsd":[]}),
        serde_json::json!({"dsd":["test-card"]}),
    ] {
        let render_options = NativeRenderOptions {
            markers_v2: options["markersV2"].as_bool().unwrap_or(false),
            attribute_name_strategy: match options["attributeNameStrategy"].as_str() {
                Some("none") => AttributeNameStrategy::None,
                _ => AttributeNameStrategy::CamelCase,
            },
            dsd: options["dsd"].as_array().map(|names| {
                names
                    .iter()
                    .map(|name| name.as_str().unwrap().to_owned())
                    .collect()
            }),
            ..Default::default()
        };
        outputs.push(serde_json::json!({
            "options":options,
            "values":{
                "Entry":program.render_entry_json(state, &render_options).unwrap(),
                "Template":program.render_template_json(state, &render_options).unwrap(),
                "Host":program.render_host_json("test-card", state, &render_options).unwrap(),
                "Shadow":program.render_shadow_json("test-card", state, &render_options).unwrap(),
            },
        }));
    }
    println!(
        "{}",
        serde_json::json!({
            "crateVersion": env!("CARGO_PKG_VERSION"),
            "artifact": String::from_utf8(artifact).unwrap(),
            "outputs": outputs,
        })
    );
}
