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

#[cfg(any(target_os = "macos", target_os = "linux"))]
fn cpu_ns() -> Option<u64> {
    #[repr(C)]
    struct Timespec {
        seconds: std::ffi::c_long,
        nanoseconds: std::ffi::c_long,
    }
    extern "C" {
        fn clock_gettime(clock: i32, time: *mut Timespec) -> i32;
    }
    let mut time = Timespec {
        seconds: 0,
        nanoseconds: 0,
    };
    let clock = if cfg!(target_os = "macos") { 12 } else { 2 };
    (unsafe { clock_gettime(clock, &mut time) } == 0)
        .then(|| time.seconds as u64 * 1_000_000_000 + time.nanoseconds as u64)
}

#[cfg(not(any(windows, target_os = "macos", target_os = "linux")))]
fn cpu_ns() -> Option<u64> {
    None
}

fn fixture(case: &str) -> Result<(Vec<u8>, String), Box<dyn std::error::Error>> {
    if let Some(kind) = case
        .strip_prefix("optional-bindings-")
        .and_then(|name| name.strip_suffix("-1000"))
    {
        let mut locator = Locator::from_templates(Default::default());
        locator.add_template(
            "optional-root",
            "<f-repeat value=\"{{row in rows}}\"><a href=\"{{optional.url}}\" title=\"link {{optional.title}} end\" ?hidden=\"{{optional.hidden}}\">{{optional.description}}/{{optional.detail}}/{{optional.caption}}</a></f-repeat>",
        );
        let mut state = json!({"rows":vec![true; 1000]});
        match kind {
            "missing" => {}
            "nested" => state["optional"] = json!({}),
            "null" => state["optional"] = json!(null),
            "present" => {
                state["optional"] = json!({
                    "url": "#card", "title": "card", "hidden": false,
                    "description": "description", "detail": "detail", "caption": "caption",
                });
            }
            _ => return Err("Unknown workload".into()),
        }
        return Ok((
            compile_server_artifact("<optional-root></optional-root>", &locator)?,
            state.to_string(),
        ));
    }
    let style_properties = match case {
        "composite-styles-one-1000" => Some(1),
        "composite-styles-1000"
        | "composite-styles-row-1000"
        | "composite-styles-alias-fallback-1000" => Some(4),
        "composite-styles-five-1000" => Some(5),
        _ => None,
    };
    if let Some(properties) = style_properties {
        let row_scoped = case == "composite-styles-row-1000";
        let source = if row_scoped { "row" } else { "theme" };
        let bindings = [
            ("color", "primary"),
            ("background", "background"),
            ("border-color", "border"),
            ("outline-color", "outline"),
            ("box-shadow", "shadow"),
        ];
        let style = bindings[..properties]
            .iter()
            .map(|(name, key)| format!("{name}:{{{{{source}.palette.{key}}}}};"))
            .collect::<String>();
        let mut locator = Locator::from_templates(Default::default());
        locator.add_template(
            "style-root",
            &format!("<f-repeat value=\"{{{{row in rows}}}}\"><i style=\"{style}\">{{{{{source}.label}}}}</i></f-repeat>"),
        );
        let mut state = json!({
            "rows": vec![true; 1000],
            "theme": {
                "label": "card",
                "palette": {
                    "primary": "royalblue", "background": "white", "border": "gray",
                    "outline": "purple", "shadow": "none",
                },
            },
        });
        if row_scoped {
            state["rows"] = json!(vec![state["theme"].clone(); 1000]);
        }
        let mut artifact = compile_server_artifact("<style-root></style-root>", &locator)?;
        if case == "composite-styles-alias-fallback-1000" {
            state["rows"] = json!(vec!["royalblue"; 1000]);
            let mut wire: serde_json::Value = serde_json::from_slice(&artifact)?;
            for body in wire["program"]["templates"]
                .as_object_mut()
                .unwrap()
                .values_mut()
            {
                for operation in body.as_array_mut().unwrap() {
                    if operation["type"] == "repeat" && operation["alias"] == json!(["row"]) {
                        operation["alias"] = json!(["theme", "palette", "primary"]);
                    }
                }
            }
            artifact = serde_json::to_vec(&wire)?;
        }
        return Ok((artifact, state.to_string()));
    }
    let repeat = match case {
        "repeat-components-10" => Some((10, 4, 0, false)),
        "repeat-components-100" => Some((100, 4, 0, false)),
        "repeat-components-1000" => Some((1000, 4, 0, false)),
        "repeat-components-10000" => Some((10000, 4, 0, false)),
        "repeat-plain-10000" => Some((10000, 4, 0, true)),
        "repeat-components-no-props" => Some((1000, 0, 0, false)),
        "repeat-components-one-prop" => Some((1000, 1, 0, false)),
        "repeat-components-many-props" => Some((1000, 12, 0, false)),
        "repeat-components-large-styles" => Some((1000, 4, 4096, false)),
        _ => None,
    };
    if let Some((count, properties, style_bytes, plain)) = repeat {
        let body = format!(
            "<style>:host {{ display: block; }}{}</style><article data-id=\"{{{{id}}}}\" ?data-active=\"{{{{active}}}}\"><a href=\"{{{{url}}}}\">{{{{label}}}}</a><slot></slot></article>",
            " ".repeat(style_bytes),
        );
        let mut attributes = String::new();
        for index in 0..properties {
            let name = match index {
                0 => "id".to_owned(),
                1 => "label".to_owned(),
                2 => "url".to_owned(),
                3 => "?active".to_owned(),
                _ => format!(":extra{index}"),
            };
            let value = match index {
                0 => "row.id".to_owned(),
                1 => "row.label".to_owned(),
                2 => "row.url".to_owned(),
                3 => "row.active".to_owned(),
                _ => "row.detail".to_owned(),
            };
            attributes.push_str(&format!(" {name}=\"{{{{{value}}}}}\""));
        }
        let mut locator = Locator::from_templates(Default::default());
        locator.add_template("repeat-card", &body);
        let row = if plain {
            "<article data-id=\"{{row.id}}\" ?data-active=\"{{row.active}}\"><a href=\"{{row.url}}\">{{row.label}}</a>{{row.detail}}</article>".to_owned()
        } else {
            format!("<repeat-card{attributes}>{{{{row.detail}}}}</repeat-card>")
        };
        locator.add_template(
            "repeat-root",
            &format!("<f-repeat value=\"{{{{row in rows}}}}\">{row}</f-repeat>"),
        );
        let state = json!({
            "id": 0, "label": "Root", "url": "#root", "active": true,
            "rows": (0..count).map(|id| json!({
                "id": id, "label": format!("Row {id}"), "url": format!("#row-{id}"),
                "active": id % 2 == 0, "detail": format!("Detail {id}"),
            })).collect::<Vec<_>>(),
        })
        .to_string();
        return Ok((
            compile_server_artifact("<repeat-root></repeat-root>", &locator)?,
            state,
        ));
    }
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
        return Err("Usage: native-shadow-benchmark <workload[-markers-v2]> <fresh-json|prepared> <timing|memory> <iterations> <owned-output-file>".into());
    }
    let iterations: usize = args[3].parse()?;
    if iterations == 0
        || !matches!(args[1].as_str(), "fresh-json" | "prepared")
        || !matches!(args[2].as_str(), "timing" | "memory")
    {
        return Err("Invalid boundary, pass, or iteration count".into());
    }
    let markers_v2 = args[0].ends_with("-markers-v2");
    let case = args[0].strip_suffix("-markers-v2").unwrap_or(&args[0]);
    let (artifact_bytes, state_json) = fixture(case)?;
    begin_memory();
    let artifact_result = CompiledArtifact::load(&artifact_bytes);
    let artifact_memory = end_memory();
    let artifact = artifact_result?;
    begin_memory();
    let prepared_result = PreparedState::from_json(&state_json);
    let prepared_memory = end_memory();
    let prepared = prepared_result?;
    let options = NativeRenderOptions {
        markers_v2,
        ..Default::default()
    };
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
