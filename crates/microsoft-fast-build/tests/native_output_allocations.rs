use microsoft_fast_build::{
    compile_server_artifact, CompiledArtifact, JsonValue, Locator, NativeRenderOptions,
    PreparedState,
};
use std::alloc::{GlobalAlloc, Layout, System};
use std::cell::Cell;
use std::collections::HashMap;

struct RequestAllocator;

thread_local! {
    static ALLOCATIONS: Cell<(bool, usize, usize)> = const { Cell::new((false, 0, 0)) };
}

fn record(allocated: usize, freed: usize) {
    let _ = ALLOCATIONS.try_with(|stats| {
        let (active, live, peak) = stats.get();
        if active {
            let live = live.saturating_sub(freed) + allocated;
            stats.set((true, live, peak.max(live)));
        }
    });
}

unsafe impl GlobalAlloc for RequestAllocator {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        let result = System.alloc(layout);
        if !result.is_null() {
            record(layout.size(), 0);
        }
        result
    }

    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        record(0, layout.size());
        System.dealloc(ptr, layout);
    }

    unsafe fn realloc(&self, ptr: *mut u8, layout: Layout, size: usize) -> *mut u8 {
        let result = System.realloc(ptr, layout, size);
        if !result.is_null() {
            record(size, layout.size());
        }
        result
    }
}

#[global_allocator]
static ALLOCATOR: RequestAllocator = RequestAllocator;

fn render_peak(artifact: &CompiledArtifact, state: &PreparedState) -> (String, usize) {
    let options = NativeRenderOptions {
        max_output_bytes: 7,
        ..Default::default()
    };
    ALLOCATIONS.with(|stats| stats.set((true, 0, 0)));
    let output = artifact.render_entry_prepared(state, &options);
    let peak = ALLOCATIONS.with(|stats| {
        let (_, _, peak) = stats.replace((false, 0, 0));
        peak
    });
    (output.unwrap(), peak)
}

#[test]
fn suppressed_composites_do_not_accumulate_cloned_container_graphs() {
    let payload = JsonValue::Array(
        (0..64)
            .map(|_| JsonValue::String("é&".repeat(4096)))
            .collect(),
    );
    let state = PreparedState::new(&JsonValue::Object(HashMap::from([
        ("array".into(), payload.clone()),
        (
            "object".into(),
            JsonValue::Object(HashMap::from([("nested".into(), payload)])),
        ),
        ("later".into(), JsonValue::Null),
    ])))
    .unwrap();
    let locator = Locator::from_templates(HashMap::new());
    let compile = |operands: usize| {
        let parts = "{{array}}/{{object}}/".repeat(operands);
        CompiledArtifact::load(
            &compile_server_artifact(&format!("<i title=\"{parts}{{{{later}}}}\"></i>"), &locator)
                .unwrap(),
        )
        .unwrap()
    };
    let single = compile(1);
    let many = compile(32);
    let (single_output, single_peak) = render_peak(&single, &state);
    let (many_output, many_peak) = render_peak(&many, &state);
    assert_eq!(single_output, "<i></i>");
    assert_eq!(many_output, single_output);
    assert!(
        many_peak < single_peak * 2,
        "composite operands retained container graphs: single={single_peak}, many={many_peak}"
    );
    assert_eq!(render_peak(&many, &state).0, "<i></i>");
}
