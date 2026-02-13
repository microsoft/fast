import { buildTree, renderTree, SIZE_PRESETS } from "./tree.js";

/**
 * Run a benchmark by mounting `itemRenderer` once per node in a
 * deterministic random tree.
 *
 * The tree size can be controlled via the `?size=` query parameter
 * (`xs` | `s` | `m` | `l` | `xl`; default `m` ≈ 1 000 nodes).
 * This mirrors tensile-perf's mount test: each tree node creates a
 * wrapper `<div>`, calls `itemRenderer()`, and recurses into children,
 * producing a deeply nested DOM that exercises the component at scale.
 */
export function runBenchmark(itemRenderer: () => HTMLElement): void {
    const container = document.getElementById("container");

    const params = new URLSearchParams(window.location.search);
    const sizeName = params.get("size") ?? "m";
    const config = SIZE_PRESETS[sizeName] ?? SIZE_PRESETS.m;
    const tree = buildTree(config);

    performance.mark("bench-start");
    container?.appendChild(renderTree(tree, itemRenderer));
    performance.mark("bench-end");

    performance.measure("bench", "bench-start", "bench-end");

    // Wait for the browser to complete layout and paint before signaling done.
    // This ensures CDP tracing captures the full rendering pipeline.
    requestAnimationFrame(() => {
        setTimeout(() => {
            (window as any).__benchmarkDone = true;
        }, 0);
    });
}
