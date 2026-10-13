mod fixtures;

use criterion::{black_box, criterion_group, criterion_main, BenchmarkId, Criterion, Throughput};
use microsoft_fast_build::{
    render_entry_template_with_locator, render_entry_with_locator, RenderConfig,
};

fn render(c: &mut Criterion) {
    for markers_v2 in [false, true] {
        let config = RenderConfig::new().with_markers_v2(markers_v2);
        let mode = if markers_v2 { "v2" } else { "v3" };
        for &case in fixtures::CASES {
            let mut group = c.benchmark_group(format!("{case}/{mode}"));
            group.sample_size(10);
            let counts: &[usize] = if case == "many_definitions" {
                &[50, 200, 1_000]
            } else {
                &[1_000, 5_000, 20_000]
            };
            let payloads: &[usize] = if case == "many_definitions" {
                &[1, 20]
            } else {
                &[1]
            };
            let roots: &[usize] = if case.starts_with("large_state") {
                &[0, 200]
            } else {
                &[0]
            };
            for &count in counts {
                for &payload in payloads {
                    for &root_keys in roots {
                        let fixture = fixtures::fixture(case, count, payload, root_keys);
                        let locator = fixture.locator();
                        group.throughput(Throughput::Elements(count as u64));
                        let id = format!("{count}/payload{payload}/root{root_keys}");
                        group.bench_function(BenchmarkId::new("render", &id), |b| {
                            b.iter(|| {
                                render_entry_with_locator(
                                    black_box(&fixture.entry),
                                    black_box(&fixture.state),
                                    &locator,
                                    Some(&config),
                                )
                                .unwrap()
                            })
                        });
                        group.bench_function(
                            BenchmarkId::new("parse_state_and_render", &id),
                            |b| {
                                b.iter(|| {
                                    render_entry_template_with_locator(
                                        black_box(&fixture.entry),
                                        black_box(&fixture.state_json),
                                        &locator,
                                        Some(&config),
                                    )
                                    .unwrap()
                                })
                            },
                        );
                        group.throughput(Throughput::Elements(fixture.templates.len() as u64));
                        group.bench_function(BenchmarkId::new("locator", &id), |b| {
                            b.iter(|| black_box(fixture.locator()))
                        });
                    }
                }
            }
            group.finish();
        }
    }
}

criterion_group!(benches, render);
criterion_main!(benches);
