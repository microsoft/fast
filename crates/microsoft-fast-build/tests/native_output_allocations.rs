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
    static ALLOCATION_CALLS: Cell<usize> = const { Cell::new(0) };
}

fn record(allocated: usize, freed: usize) {
    let _ = ALLOCATIONS.try_with(|stats| {
        let (active, live, peak) = stats.get();
        if active {
            if allocated != 0 {
                ALLOCATION_CALLS.with(|calls| calls.set(calls.get() + 1));
            }
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

#[test]
fn small_component_property_scopes_do_not_allocate_per_sibling() {
    let locator = Locator::from_templates(HashMap::from([(
        "scope-row".into(),
        "<span>{{a}}/{{b}}/{{c}}/{{d}}</span>".into(),
    )]));
    let state = PreparedState::from_json(
        &serde_json::json!({
            "a":"a", "b":"b", "c":"c", "d":"d",
            "rows":vec![true; 256],
        })
        .to_string(),
    )
    .unwrap();
    let render = |attributes: &str| {
        let artifact = CompiledArtifact::load(
            &compile_server_artifact(
                &format!("<f-repeat value=\"{{{{row in rows}}}}\"><scope-row{attributes}></scope-row></f-repeat>"),
                &locator,
            )
            .unwrap(),
        )
        .unwrap();
        ALLOCATION_CALLS.with(|calls| calls.set(0));
        ALLOCATIONS.with(|stats| stats.set((true, 0, 0)));
        let result = artifact.render_entry_prepared(&state, &Default::default());
        ALLOCATIONS.with(|stats| stats.set((false, 0, 0)));
        let calls = ALLOCATION_CALLS.with(Cell::get);
        (result.unwrap(), calls)
    };
    let (_, plain_calls) = render("");
    let (_, bound_calls) = render(r#" :a="{{a}}" :b="{{b}}" :c="{{c}}" :d="{{d}}""#);
    assert!(
        bound_calls <= plain_calls + 4,
        "small property scopes allocated per sibling: plain={plain_calls}, bound={bound_calls}"
    );
}

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

fn load_retained(bytes: &[u8]) -> (CompiledArtifact, usize) {
    ALLOCATIONS.with(|stats| stats.set((true, 0, 0)));
    let artifact = CompiledArtifact::load(bytes);
    let live = ALLOCATIONS.with(|stats| {
        let (_, live, _) = stats.replace((false, 0, 0));
        live
    });
    (artifact.unwrap(), live)
}

#[test]
fn unused_templates_do_not_increase_retained_native_plan_storage() {
    let source = |unused: usize| {
        let templates = (0..unused)
            .map(|index| {
                (
                    format!("unused-{index}"),
                    serde_json::json!([{"type":"literal","html":"unused"}]),
                )
            })
            .collect::<serde_json::Map<_, _>>();
        serde_json::to_vec(&serde_json::json!({
            "format":"fast-server-native","version":1,
            "entry":[{"type":"literal","html":"retained"}],
            "templates":templates,"components":{}
        }))
        .unwrap()
    };
    let single_source = source(0);
    let many_source = source(2000);
    let (single, single_retained) = load_retained(&single_source);
    let (many, many_retained) = load_retained(&many_source);
    assert!(
        many_retained <= single_retained,
        "unused FAST templates increased retained plan storage: single={single_retained}, many={many_retained}"
    );
    assert_eq!(
        single.render_entry_json("{}", &Default::default()).unwrap(),
        "retained"
    );
    assert_eq!(
        many.render_entry_json("{}", &Default::default()).unwrap(),
        "retained"
    );
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
