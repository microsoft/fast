//! Untimed source-proof fixture generation for the optional Node host tests.
use microsoft_fast_build::{compile_server_artifact, compile_server_module, Locator};

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
    let source =
        compile_server_module("<test-card></test-card>", &locator, "__FAST_TEST_RUNTIME__")
            .unwrap();
    println!(
        "{}",
        serde_json::json!({
            "crateVersion": env!("CARGO_PKG_VERSION"),
            "artifact": String::from_utf8(artifact).unwrap(),
            "source": source,
        })
    );
}
