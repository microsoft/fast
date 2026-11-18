//! Complete-owned-output shadow benchmark. Timing and allocation passes are separate.
//! Run without arguments for usage; setup, validation and output I/O are not render time.
use microsoft_fast_build::{
    compile_server_artifact, CompiledArtifact, Locator, NativeRenderOptions, PreparedState,
};
use serde_json::json;
use std::alloc::{GlobalAlloc, Layout, System};
use std::hint::black_box;
use std::sync::atomic::{AtomicBool, AtomicIsize, AtomicUsize, Ordering::Relaxed};
use std::time::Instant;

struct Meter;
static ACTIVE: AtomicBool = AtomicBool::new(false);
static ALLOCS: AtomicUsize = AtomicUsize::new(0);
static REALLOCS: AtomicUsize = AtomicUsize::new(0);
static BYTES: AtomicUsize = AtomicUsize::new(0);
static LIVE: AtomicIsize = AtomicIsize::new(0);
static PEAK: AtomicUsize = AtomicUsize::new(0);

fn allocated(bytes: usize) {
    BYTES.fetch_add(bytes, Relaxed);
    let live = LIVE.fetch_add(bytes as isize, Relaxed) + bytes as isize;
    PEAK.fetch_max(live.max(0) as usize, Relaxed);
}

// Only this single-threaded diagnostic executable installs the allocator shim.
// Realloc counts the full new requested capacity, not just capacity growth.
unsafe impl GlobalAlloc for Meter {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        let ptr = System.alloc(layout);
        if !ptr.is_null() && ACTIVE.load(Relaxed) {
            ALLOCS.fetch_add(1, Relaxed);
            allocated(layout.size());
        }
        ptr
    }

    unsafe fn alloc_zeroed(&self, layout: Layout) -> *mut u8 {
        let ptr = System.alloc_zeroed(layout);
        if !ptr.is_null() && ACTIVE.load(Relaxed) {
            ALLOCS.fetch_add(1, Relaxed);
            allocated(layout.size());
        }
        ptr
    }

    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        if ACTIVE.load(Relaxed) {
            LIVE.fetch_sub(layout.size() as isize, Relaxed);
        }
        System.dealloc(ptr, layout);
    }

    unsafe fn realloc(&self, ptr: *mut u8, layout: Layout, size: usize) -> *mut u8 {
        let next = System.realloc(ptr, layout, size);
        if !next.is_null() && ACTIVE.load(Relaxed) {
            REALLOCS.fetch_add(1, Relaxed);
            LIVE.fetch_sub(layout.size() as isize, Relaxed);
            allocated(size);
        }
        next
    }
}

#[global_allocator]
static ALLOCATOR: Meter = Meter;

fn begin_memory() {
    assert!(!ACTIVE.load(Relaxed));
    ALLOCS.store(0, Relaxed);
    REALLOCS.store(0, Relaxed);
    BYTES.store(0, Relaxed);
    LIVE.store(0, Relaxed);
    PEAK.store(0, Relaxed);
    ACTIVE.store(true, Relaxed);
}

fn end_memory() -> serde_json::Value {
    ACTIVE.store(false, Relaxed);
    json!({
        "allocationCalls": ALLOCS.load(Relaxed),
        "reallocationCalls": REALLOCS.load(Relaxed),
        "allocatedRequestedBytes": BYTES.load(Relaxed),
        "peakLiveRequestedBytes": PEAK.load(Relaxed),
        "retainedRequestedBytes": LIVE.load(Relaxed),
    })
}

#[cfg(windows)]
fn cpu_ns() -> Option<u64> {
    #[repr(C)]
    #[derive(Default)]
    struct FileTime {
        low: u32,
        high: u32,
    }
    #[link(name = "kernel32")]
    extern "system" {
        fn GetCurrentProcess() -> *mut std::ffi::c_void;
        fn GetProcessTimes(
            process: *mut std::ffi::c_void,
            creation: *mut FileTime,
            exit: *mut FileTime,
            kernel: *mut FileTime,
            user: *mut FileTime,
        ) -> i32;
    }
    let (mut creation, mut exit, mut kernel, mut user) = (
        FileTime::default(),
        FileTime::default(),
        FileTime::default(),
        FileTime::default(),
    );
    let ok = unsafe {
        GetProcessTimes(
            GetCurrentProcess(),
            &mut creation,
            &mut exit,
            &mut kernel,
            &mut user,
        )
    };
    (ok != 0).then(|| {
        let ticks = |time: FileTime| ((time.high as u64) << 32) | time.low as u64;
        (ticks(kernel) + ticks(user)) * 100
    })
}

#[cfg(not(windows))]
fn cpu_ns() -> Option<u64> {
    None
}

fn fixture(case: &str) -> Result<(Vec<u8>, String), Box<dyn std::error::Error>> {
    let mut locator = Locator::from_templates(Default::default());
    let state = json!({
        "label": "<&\"'😀 café",
        "url": "https://example.test/?a=1&b=2",
        "items": vec![json!({"label": "<&\"'😀 café"}); 256],
    })
    .to_string();
    let entry = match case {
        "wide-siblings" | "empty-shadows" => {
            let body = if case == "empty-shadows" {
                String::new()
            } else {
                format!("<span>{{{{label}}}}</span>{}", "s".repeat(512))
            };
            locator.add_template("bench-leaf", &body);
            "<f-repeat value=\"{{item in items}}\"><bench-leaf :label=\"{{item.label}}\"></bench-leaf></f-repeat>".to_owned()
        }
        "small-page" => {
            locator.add_template("bench-small", "<p>{{label}}</p>");
            "<main><bench-small></bench-small></main>".to_owned()
        }
        "deep-nested" | "mixed-light-shadow" | "mostly-static" | "binding-heavy" => {
            let depth = match case {
                "deep-nested" => 32,
                "binding-heavy" => 16,
                _ => 12,
            };
            for index in (0..depth).rev() {
                let child = if index + 1 == depth {
                    "<b>leaf {{label}}</b>".to_owned()
                } else if case == "mixed-light-shadow" {
                    format!(
                        "<bench-node-{} title=\"{{{{label}}}}\"><em>light {{{{label}}}}</em><bench-light></bench-light></bench-node-{}>",
                        index + 1, index + 1
                    )
                } else {
                    format!("<bench-node-{0}></bench-node-{0}>", index + 1)
                };
                let content = match case {
                    "binding-heavy" => {
                        "<a href=\"{{url}}\" title=\"prefix {{label}} suffix\">{{label}}</a>"
                            .repeat(96)
                    }
                    "mostly-static" => format!("<section>{}</section>", "s".repeat(8192)),
                    "mixed-light-shadow" => "<header>{{label}}</header><slot></slot>".to_owned(),
                    _ => format!("<section>{}</section>", "s".repeat(2048)),
                };
                locator.add_template(&format!("bench-node-{index}"), &(content + &child));
            }
            locator.add_template("bench-light", "<i>{{label}}</i>");
            "<main><bench-node-0></bench-node-0></main>".to_owned()
        }
        _ => return Err("Unknown workload".into()),
    };
    let state = if case == "wide-siblings" || case == "empty-shadows" {
        state
    } else {
        // Small pages must not accidentally measure a large unused state tree.
        json!({"label":"<&\"'😀 café", "url":"https://example.test/?a=1&b=2"}).to_string()
    };
    Ok((compile_server_artifact(&entry, &locator)?, state))
}

fn hash(bytes: &[u8]) -> String {
    let mut value = 0xcbf29ce484222325u64;
    for byte in bytes {
        value = (value ^ u64::from(*byte)).wrapping_mul(0x100000001b3);
    }
    format!("{value:016x}")
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<_> = std::env::args().skip(1).collect();
    if args.len() != 5 {
        return Err("Usage: native-shadow-benchmark <deep-nested|wide-siblings|mixed-light-shadow|mostly-static|binding-heavy|empty-shadows|small-page> <fresh-json|prepared> <timing|memory> <iterations> <owned-output-file>".into());
    }
    let iterations: usize = args[3].parse()?;
    if iterations == 0
        || !matches!(args[1].as_str(), "fresh-json" | "prepared")
        || !matches!(args[2].as_str(), "timing" | "memory")
    {
        return Err("Invalid boundary, pass, or iteration count".into());
    }
    let (artifact_bytes, state_json) = fixture(&args[0])?;
    begin_memory();
    let artifact_result = CompiledArtifact::load(&artifact_bytes);
    let artifact_memory = end_memory();
    let artifact = artifact_result?;
    begin_memory();
    let prepared_result = PreparedState::from_json(&state_json);
    let prepared_memory = end_memory();
    let prepared = prepared_result?;
    let options = NativeRenderOptions::default();
    let render = || {
        if args[1] == "fresh-json" {
            artifact.render_entry_json(black_box(&state_json), black_box(&options))
        } else {
            artifact.render_entry_prepared(black_box(&prepared), black_box(&options))
        }
    };
    let expected = artifact.render_entry_json(&state_json, &options)?;
    assert!(!expected.is_empty());
    assert_eq!(
        artifact.render_entry_prepared(&prepared, &options)?,
        expected
    );
    std::fs::write(&args[4], expected.as_bytes())?;
    for _ in 0..20 {
        assert_eq!(black_box(render()?), expected);
    }
    let mut samples = Vec::with_capacity(iterations);
    let mut memory_samples = Vec::with_capacity(iterations);
    let cpu_start = cpu_ns();
    let loop_start = Instant::now();
    for _ in 0..iterations {
        if args[2] == "memory" {
            begin_memory();
            let result = black_box(render());
            let live_with_output = LIVE.load(Relaxed);
            // End tracking before verification so assertion formatting cannot pollute it.
            ACTIVE.store(false, Relaxed);
            let output = result?;
            assert_eq!(output, expected);
            ACTIVE.store(true, Relaxed);
            drop(output);
            let sample = end_memory();
            assert_eq!(sample["retainedRequestedBytes"], 0);
            memory_samples.push(json!({
                "request": sample,
                "liveWithOwnedOutputRequestedBytes": live_with_output,
            }));
        } else {
            let start = Instant::now();
            let result = black_box(render());
            let elapsed = start.elapsed().as_nanos();
            // Every complete result is consumed and byte-checked, outside the call timer.
            assert_eq!(result?, expected);
            samples.push(elapsed);
        }
    }
    let loop_wall_ns = loop_start.elapsed().as_nanos();
    let loop_cpu_ns = cpu_ns().zip(cpu_start).map(|(end, start)| end - start);
    samples.sort_unstable();
    println!(
        "{}",
        json!({
            "version": 1, "case": args[0], "boundary": args[1], "pass": args[2],
            "iterations": iterations, "warmupCalls": 20,
            "stateBytes": state_json.len(), "artifactBytes": artifact_bytes.len(),
            "outputBytes": expected.len(), "outputFnv1a64": hash(expected.as_bytes()),
            "artifactFnv1a64": hash(&artifact_bytes), "stateFnv1a64": hash(state_json.as_bytes()),
            "medianRenderNs": samples.get(samples.len() / 2),
            "meanRenderNs": (!samples.is_empty()).then(|| samples.iter().sum::<u128>() as f64 / samples.len() as f64),
            "minRenderNs": samples.first(), "maxRenderNs": samples.last(),
            "loopWallNsIncludesVerificationAndDrop": loop_wall_ns,
            "loopCpuNsIncludesVerificationAndDrop": loop_cpu_ns,
            "artifactLoadMemory": artifact_memory, "preparedStateMemory": prepared_memory,
            "memorySamples": memory_samples, "copiedBytes": null,
            "result": "complete independently owned UTF-8 String",
        })
    );
    Ok(())
}
