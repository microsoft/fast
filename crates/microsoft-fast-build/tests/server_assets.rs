use microsoft_fast_build::{compile_server_assets, compile_server_module, Locator};

#[test]
fn component_assets_are_local_and_registry_order_independent() {
    let mut locator = Locator::from_templates(Default::default());
    locator.add_template("z-card", "<h2>{{title}}</h2>");
    locator.add_template("a-card", "<z-card></z-card>");
    let before = compile_server_assets("<a-card></a-card>", &locator, "./runtime.mjs").unwrap();
    locator.add_template("0-unrelated", "<p>{{different}}</p>");
    let after = compile_server_assets("<a-card></a-card>", &locator, "./runtime.mjs").unwrap();
    for filename in [
        "entry.plan.mjs",
        "component-a-card.plan.mjs",
        "component-z-card.plan.mjs",
    ] {
        assert_eq!(before.files[filename], after.files[filename]);
    }
    let mut reversed = Locator::from_templates(Default::default());
    reversed.add_template("a-card", "<z-card></z-card>");
    reversed.add_template("z-card", "<h2>{{title}}</h2>");
    assert_eq!(
        before.files,
        compile_server_assets("<a-card></a-card>", &reversed, "./runtime.mjs")
            .unwrap()
            .files
    );
    assert!(!before.files["server.mjs"].contains("const entryPlan ="));
    assert!(!before.files["server.manifest.json"].contains("compilerId"));
}

#[test]
fn component_cycles_remain_symbolic_and_diagnostics_are_eager() {
    let mut locator = Locator::from_templates(Default::default());
    locator.add_template("a-card", "<b-card></b-card>");
    locator.add_template("b-card", "<a-card></a-card>");
    let assets = compile_server_assets("", &locator, "./runtime.mjs").unwrap();
    let manifest: serde_json::Value =
        serde_json::from_str(&assets.files["server.manifest.json"]).unwrap();
    assert_eq!(
        manifest["dependencies"]["component-a-card.plan.mjs"],
        serde_json::json!(["a-card", "b-card"])
    );
    locator.add_template(
        "unused-broken",
        "<f-when value=\"{{false}}\">{{oops</f-when>",
    );
    let single = compile_server_module("", &locator, "./runtime.mjs").unwrap_err();
    let modular = compile_server_assets("", &locator, "./runtime.mjs").unwrap_err();
    assert_eq!(single.code(), modular.code());
    assert_eq!(single.location(), modular.location());
    assert_eq!(single.template_name(), modular.template_name());
}

#[test]
fn semantic_names_cannot_escape_the_deployment_or_collide() {
    let mut locator = Locator::from_templates(Default::default());
    for name in ["x-card", "X-card", "x~2fcard", "x/card", "../x-card", "x-é"] {
        locator.add_template(name, "<p>{{title}}</p>");
    }
    let assets = compile_server_assets("", &locator, "./runtime.mjs").unwrap();
    assert_eq!(assets.files.len(), 9);
    for filename in assets.files.keys() {
        assert!(!filename.contains('/'));
        assert!(!filename.contains('\\'));
        assert!(!filename.starts_with('.'));
    }
}
