#![cfg(all(feature = "allocation-profiling", not(target_arch = "wasm32")))]

#[path = "../examples/profile-allocations.rs"]
mod harness;

#[test]
fn single_use_entries_do_not_retain_instruction_metadata() {
    let mut options = harness::Options::parse(
        ["--case=url_sink_siblings", "--count=5000"]
            .into_iter()
            .map(str::to_string),
    )
    .unwrap();
    for mode in ["v3", "v2"] {
        options.mode = mode.into();
        let rendered = harness::measure(&options).unwrap();
        assert!(
            rendered["peakLiveBytes"].as_u64().unwrap()
                <= rendered["retainedBytes"].as_u64().unwrap() * 2,
            "one-shot entry metadata must not dominate the render peak: {rendered}",
        );
    }
}

#[test]
fn attributed_children_do_not_copy_unused_root_state() {
    let mut options = harness::Options::parse(
        ["--case=large_state_overlay", "--count=16"]
            .into_iter()
            .map(str::to_string),
    )
    .unwrap();
    for mode in ["v3", "v2"] {
        options.mode = mode.into();
        options.root_keys = 0;
        let small = harness::measure(&options).unwrap();
        options.root_keys = 200;
        let large = harness::measure(&options).unwrap();
        assert_eq!(large["sha256"], small["sha256"]);
        assert_eq!(large["totalBytes"], small["totalBytes"]);
        assert_eq!(large["totalBlocks"], small["totalBlocks"]);
    }
}

#[test]
fn repeated_children_have_subquadratic_allocation_growth() {
    let mut options = harness::Options::parse(
        ["--case=repeat_custom_elements", "--count=100"]
            .into_iter()
            .map(str::to_string),
    )
    .unwrap();
    for mode in ["v3", "v2"] {
        options.mode = mode.into();
        options.count = 100;
        let small = harness::measure(&options).unwrap();
        options.count = 200;
        let large = harness::measure(&options).unwrap();
        assert!(
            large["totalBytes"].as_u64().unwrap()
                < small["totalBytes"].as_u64().unwrap() * 3,
            "doubling repeated children must not copy the full collection per child: {small} -> {large}",
        );
    }
}

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
        // Cold renders retain the output and any lazily compiled locator plans.
        assert!(rendered["retainedBlocks"].as_u64().unwrap() >= 1);
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
