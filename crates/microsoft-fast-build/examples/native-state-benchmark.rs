//! Deterministic native state-ownership selectors; run only under a quiet lease.
use microsoft_fast_build::{
    compile_server_artifact, parse_render_state, CompiledArtifact, Locator, NativeRenderOptions,
    PreparedState,
};
use serde_json::json;
use std::time::Instant;

fn fixture(
    case: &str,
    count: usize,
    payload_bytes: usize,
) -> Result<(CompiledArtifact, String), Box<dyn std::error::Error>> {
    let payload = "x".repeat(payload_bytes);
    let item = json!({"label":"<&😀", "payload":payload});
    let group = json!({"label":"outer", "payload":payload, "items":vec![item.clone(); 4]});
    let state_json = if case == "lookup" {
        json!({"value":item}).to_string()
    } else {
        json!({"groups":vec![group; count]}).to_string()
    };
    let mut locator = Locator::from_templates(Default::default());
    locator.add_template("bench-leaf", "{{item.label}}/{{group.label}}");
    let entry = match case {
        "lookup" => "<f-when value=\"{{value}}\">{{value.label}}</f-when>".repeat(count),
        "repeat" => "<f-repeat value=\"{{group in groups}}\"><f-repeat value=\"{{item in group.items}}\">{{group.label}}/{{item.label}}/{{$index}}</f-repeat></f-repeat>".into(),
        "same-alias" => "<f-repeat value=\"{{item in groups}}\"><f-repeat value=\"{{item in item.items}}\">{{item.label}}/{{$index}}</f-repeat>{{item.label}}</f-repeat>".into(),
        "overlay" => "<f-repeat value=\"{{group in groups}}\"><f-repeat value=\"{{item in group.items}}\"><bench-leaf :item=\"{{item}}\" :group=\"{{group}}\"></bench-leaf></f-repeat></f-repeat>".into(),
        _ => return Err("Unknown native case".into()),
    };
    let artifact = CompiledArtifact::load(&compile_server_artifact(&entry, &locator)?)?;
    Ok((artifact, state_json))
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<_> = std::env::args().skip(1).collect();
    if args.len() != 5 {
        return Err("Usage: native-state-benchmark <lookup|repeat|same-alias|overlay> <fresh-json|typed|prepared> <count> <payload-bytes> <iterations>".into());
    }
    let count: usize = args[2].parse()?;
    let payload_bytes: usize = args[3].parse()?;
    let iterations: usize = args[4].parse()?;
    if count == 0 || iterations == 0 {
        return Err("count and iterations must be nonzero".into());
    }
    if !matches!(args[1].as_str(), "fresh-json" | "typed" | "prepared") {
        return Err("Unknown native boundary".into());
    }
    let (artifact, state_json) = fixture(&args[0], count, payload_bytes)?;
    let state = parse_render_state(&state_json)?;
    let prepared = PreparedState::from_json(&state_json)?;
    let options = NativeRenderOptions::default();
    let expected = artifact.render_entry_json(&state_json, &options)?;
    let mut samples = Vec::with_capacity(iterations);
    for _ in 0..iterations {
        let start = Instant::now();
        let result = match args[1].as_str() {
            "fresh-json" => artifact.render_entry_json(&state_json, &options),
            "typed" => artifact.render_entry(&state, &options),
            _ => artifact.render_entry_prepared(&prepared, &options),
        };
        let elapsed = start.elapsed().as_nanos();
        // Verification and result destruction are outside the measured call.
        assert_eq!(result?, expected);
        samples.push(elapsed);
    }
    samples.sort_unstable();
    println!(
        "{}",
        json!({
            "case":args[0], "boundary":args[1], "count":count,
            "payloadBytes":payload_bytes, "iterations":iterations,
            "stateBytes":state_json.len(), "outputBytes":expected.len(),
            "medianNs":samples[iterations / 2],
            "minNs":samples[0], "maxNs":samples[iterations - 1],
            "warmupCalls":1, "result":"owned UTF-8 String",
            "allocationCounters":null
        })
    );
    Ok(())
}

#[test]
fn selectors_hold_output_constant_while_scaling_request_payloads() {
    for case in ["lookup", "repeat", "same-alias", "overlay"] {
        let (small, small_json) = fixture(case, 3, 0).unwrap();
        let (large, large_json) = fixture(case, 3, 1024).unwrap();
        assert!(large_json.len() > small_json.len());
        let options = NativeRenderOptions::default();
        let expected = small.render_entry_json(&small_json, &options).unwrap();
        assert!(!expected.is_empty());
        assert_eq!(
            large.render_entry_json(&large_json, &options).unwrap(),
            expected
        );
        let typed = parse_render_state(&large_json).unwrap();
        let prepared = PreparedState::from_json(&large_json).unwrap();
        assert_eq!(large.render_entry(&typed, &options).unwrap(), expected);
        assert_eq!(
            large.render_entry_prepared(&prepared, &options).unwrap(),
            expected
        );
    }
}
