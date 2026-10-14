#![cfg(all(feature = "allocation-profiling", not(target_arch = "wasm32")))]

#[path = "../examples/profile-allocations.rs"]
mod harness;

#[test]
fn profiler_validates_options_and_isolates_render_and_locator_allocations() {
    let parse = |args: &[&str]| harness::Options::parse(args.iter().map(|arg| arg.to_string()));
    for args in [
        vec!["--count=0"],
        vec!["--count=-1"],
        vec!["--count=no"],
        vec!["--mode=unknown"],
        vec!["--phase=unknown"],
        vec!["--case=unknown"],
        vec!["--payload=20"],
        vec!["--root-keys=200"],
        vec!["--mode=v3", "--mode=v2"],
        vec!["--output="],
        vec!["--unknown=value"],
    ] {
        assert!(parse(&args).is_err(), "{args:?}");
    }
    let mut options = parse(&["--case=many_definitions", "--count=2", "--payload=20"]).unwrap();
    for mode in ["v3", "v2"] {
        options.mode = mode.into();
        options.phase = "render".into();
        let rendered = harness::measure(&options).unwrap();
        assert!(rendered["totalBlocks"].as_u64().unwrap() > 0);
        assert_eq!(rendered["retainedBlocks"], 1);
        assert!(
            rendered["retainedBytes"].as_u64().unwrap()
                >= rendered["outputBytes"].as_u64().unwrap()
        );
        assert!(
            rendered["peakLiveBytes"].as_u64().unwrap()
                >= rendered["retainedBytes"].as_u64().unwrap()
        );
        options.phase = "parse_state_and_render".into();
        let parsed = harness::measure(&options).unwrap();
        assert_eq!(parsed["sha256"], rendered["sha256"]);
        assert!(parsed["totalBytes"].as_u64().unwrap() > rendered["totalBytes"].as_u64().unwrap());
        options.phase = "locator".into();
        let located = harness::measure(&options).unwrap();
        assert_eq!(located["sha256"], rendered["sha256"]);
        assert!(located["totalBytes"].as_u64().unwrap() > 0);
        assert!(located["totalBytes"].as_u64().unwrap() < rendered["totalBytes"].as_u64().unwrap());
        assert!(located["retainedBlocks"].as_u64().unwrap() > 1);
    }
}
