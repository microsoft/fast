use microsoft_fast_build::{
    compile_server_artifact, compile_server_assets, compile_server_module, CompiledArtifact,
    Locator, SERVER_COMPILER_ID,
};
use serde_json::Value;
use std::collections::HashMap;

fn locator(entries: &[(&str, &str)]) -> Locator {
    Locator::from_templates(
        entries
            .iter()
            .map(|(name, body)| (name.to_string(), body.to_string()))
            .collect::<HashMap<_, _>>(),
    )
}

fn plan(source: &str) -> Value {
    serde_json::from_str(
        source
            .strip_prefix("export const plan = ")
            .unwrap()
            .strip_suffix(";\n")
            .unwrap(),
    )
    .unwrap()
}

fn opcode(plan: &Value, rule: &Value) -> u64 {
    plan["code"][plan["offsets"][rule.as_u64().unwrap() as usize]
        .as_u64()
        .unwrap() as usize]
        .as_u64()
        .unwrap()
}

#[test]
fn server_assets_are_stable_under_unrelated_registry_and_entry_changes() {
    let first = locator(&[
        ("test-parent", "<test-child>{{label}}</test-child>"),
        ("test-child", "{{child}}"),
        ("z-other", "old unrelated"),
    ]);
    let second = locator(&[
        ("z-other", "new unrelated {{value}}"),
        ("test-child", "{{child}}"),
        (
            "a-new",
            "new component <f-when value=\"{{show}}\">yes</f-when>",
        ),
        ("test-parent", "<test-child>{{label}}</test-child>"),
    ]);
    let entry = "<test-parent></test-parent>";
    let a = compile_server_assets(entry, &first, "helper-one").unwrap();
    let b = compile_server_assets(entry, &second, "helper-two").unwrap();
    for filename in [
        "entry.plan.mjs",
        "component-test-parent.plan.mjs",
        "component-test-child.plan.mjs",
    ] {
        assert_eq!(a.files[filename], b.files[filename], "{filename}");
        assert!(!a.files[filename].contains(SERVER_COMPILER_ID));
        assert!(!a.files[filename].contains("compilerId"));
        assert!(!a.files[filename].contains("runtimeVersion"));
        assert!(!a.files[filename].contains("helper-one"));
    }
    let changed_entry = compile_server_assets("different {{entry}}", &first, "helper-one").unwrap();
    assert_eq!(
        a.files["component-test-parent.plan.mjs"],
        changed_entry.files["component-test-parent.plan.mjs"],
    );
    let changed_child = compile_server_assets(
        entry,
        &locator(&[
            ("test-parent", "<test-child>{{label}}</test-child>"),
            ("test-child", "changed shadow {{other}}"),
            ("z-other", "old unrelated"),
        ]),
        "helper-one",
    )
    .unwrap();
    assert_eq!(
        a.files["entry.plan.mjs"],
        changed_child.files["entry.plan.mjs"]
    );
    assert_eq!(
        a.files["component-test-parent.plan.mjs"],
        changed_child.files["component-test-parent.plan.mjs"],
    );
    assert_eq!(a.entry, "server.mjs");
    let manifest: Value = serde_json::from_str(&a.files["server.manifest.json"]).unwrap();
    assert_eq!(manifest["compilerId"], SERVER_COMPILER_ID);
    assert_eq!(manifest["runtimeVersion"], 4);
    assert_eq!(manifest["runtimeImport"], "helper-one");
    assert_eq!(
        manifest["components"]["test-child"],
        "component-test-child.plan.mjs"
    );
    let serialized: Value = serde_json::from_str(&a.to_json()).unwrap();
    assert_eq!(serialized["entry"], "server.mjs");
}

#[test]
fn server_assets_use_portable_injective_semantic_filenames() {
    let registry = locator(&[
        ("test-a", "lower"),
        ("test-A", "upper"),
        ("test-~41", "tilde"),
        ("test-É", "unicode"),
        ("__proto__", "prototype name"),
        ("test-/..", "path name"),
    ]);
    let assets = compile_server_assets("entry", &registry, "helper").unwrap();
    for filename in [
        "component-test-a.plan.mjs",
        "component-test-~41.plan.mjs",
        "component-test-~7e41.plan.mjs",
        "component-test-~c3~89.plan.mjs",
        "component-__proto__.plan.mjs",
        "component-test-~2f~2e~2e.plan.mjs",
    ] {
        assert!(assets.files.contains_key(filename), "{filename}");
    }
    assert!(assets.files["server.mjs"].contains("[\"__proto__\",c"));
    let portable_names = assets
        .files
        .keys()
        .map(|name| name.to_ascii_lowercase())
        .collect::<std::collections::HashSet<_>>();
    assert_eq!(portable_names.len(), assets.files.len());
}

#[test]
fn server_plans_are_flat_locally_numbered_and_preserve_authored_literals() {
    let registry = locator(&[(
        "test-item",
        "<f-repeat value=\"{{item in items}}\"><f-when value=\"{{item.ok && item.n >= 2}}\"><test-item :items='[{\"ok\":true,\"n\":3}]'>{{item.name}}</test-item></f-when></f-repeat>",
    )]);
    let assets = compile_server_assets(
        "<test-item :items='[{\"ok\":true,\"n\":3}]'></test-item>",
        &registry,
        "helper",
    )
    .unwrap();
    for filename in ["entry.plan.mjs", "component-test-item.plan.mjs"] {
        let value = plan(&assets.files[filename]);
        assert_eq!(value["format"], "fast-server-plan");
        assert_eq!(value["version"], 1);
        assert_eq!(opcode(&value, &value["root"]), 18);
        assert!(value["code"].as_array().unwrap().iter().all(Value::is_i64));
        assert!(value["strings"]
            .as_array()
            .unwrap()
            .iter()
            .all(Value::is_string));
        let offsets = value["offsets"].as_array().unwrap();
        assert_eq!(offsets[0], 0);
        assert!(offsets
            .windows(2)
            .all(|pair| pair[0].as_u64() < pair[1].as_u64()));
        assert!(
            offsets.last().unwrap().as_u64().unwrap()
                < value["code"].as_array().unwrap().len() as u64
        );
        assert!(value["strings"]
            .as_array()
            .unwrap()
            .contains(&Value::from("test-item")));
        assert!(value["strings"]
            .as_array()
            .unwrap()
            .contains(&Value::from("ok")));
        if filename.starts_with("component") {
            assert_eq!(opcode(&value, &value["host"]), 18);
            assert_eq!(
                value["strings"][value["tag"].as_u64().unwrap() as usize],
                "<template shadowrootmode=\"open\" shadowroot=\"open\">",
            );
        } else {
            assert!(value.get("host").is_none());
            assert!(value.get("tag").is_none());
        }
    }
}

#[test]
fn server_module_is_deterministic_and_native_emission_uses_the_same_flat_backend() {
    let registry = locator(&[
        ("test-z", "{{value}}"),
        ("test-a", "<test-z :value=\"{{label}}\"></test-z>"),
    ]);
    let entry = "<test-a></test-a>";
    let source = compile_server_module(entry, &registry, "helper").unwrap();
    assert_eq!(
        source,
        compile_server_module(entry, &registry, "helper").unwrap()
    );
    assert_eq!(source.matches("import ").count(), 1);
    assert!(!source.contains("function "));
    assert!(source.contains("$.createServerRenderer(entryPlan,componentPlans,compilerId)"));
    assert!(
        source.find("$.runtimeVersion !== 4").unwrap()
            < source.find("$.createServerRenderer").unwrap()
    );
    assert!(source.find("[\"test-a\",").unwrap() < source.find("[\"test-z\",").unwrap());
    let bytes = compile_server_artifact(entry, &registry).unwrap();
    let artifact = CompiledArtifact::load(&bytes).unwrap();
    assert_eq!(source, artifact.emit_server_module("helper"));
    let ir: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(ir["version"], 1);
    assert_eq!(ir["runtimeVersion"], 4);
}

#[test]
fn server_assets_eagerly_reject_malformed_unreferenced_components() {
    let registry = locator(&[("unused-broken", "{{unclosed")]);
    let error = compile_server_assets("valid entry", &registry, "helper").unwrap_err();
    assert_eq!(error.template_name(), Some("unused-broken"));
    assert!(compile_server_module("valid entry", &registry, "helper").is_err());
}
