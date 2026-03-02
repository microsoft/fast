import { BENCH_TREE_CONFIG, buildTree, renderTree } from "./tree.js";

/**
 * Run a benchmark by mounting `itemRenderer` once per node in a
 * deterministic random tree (~1 000 nodes).
 *
 * This mirrors tensile-perf's mount test: each tree node creates a
 * wrapper `<div>`, calls `itemRenderer()`, and recurses into children,
 * producing a deeply nested DOM that exercises the component at scale.
 */
export function runBenchmark(itemRenderer: () => HTMLElement): void {
    const container = document.getElementById("container");

    const tree = buildTree(BENCH_TREE_CONFIG);

    performance.mark("bench-start");
    container?.appendChild(renderTree(tree, itemRenderer));
    performance.mark("bench-end");

    signalDone();
}

/**
 * Signal that the benchmark is complete without using the tree harness.
 * Useful for benchmarks that manage their own DOM setup (e.g. hydration).
 */
export function signalDone(): void {
    performance.measure("bench", "bench-start", "bench-end");

    // Wait for the browser to complete layout and paint before signaling done.
    // This ensures CDP tracing captures the full rendering pipeline.
    requestAnimationFrame(() => {
        setTimeout(() => {
            (window as any).__benchmarkDone = true;
        }, 0);
    });
}
