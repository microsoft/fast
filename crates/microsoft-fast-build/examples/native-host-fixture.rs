//! Untimed source-proof fixture generation for the optional Node host tests.
use microsoft_fast_build::{compile_server_artifact, CompiledArtifact, Locator};

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
    println!(
        "{}",
        serde_json::json!({
            "artifact": String::from_utf8(artifact).unwrap(),
            "source": program.emit_server_module("__FAST_TEST_RUNTIME__"),
        })
    );
}
