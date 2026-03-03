import { BENCH_TREE_CONFIG, buildTree, renderTree } from "./tree.js";

/**
 * Run a benchmark by mounting `itemRenderer` once per node in a
 * deterministic random tree.
 *
 * This mirrors tensile-perf's mount test: each tree node creates a
 * wrapper `<div>`, calls `itemRenderer()`, and recurses into children,
 * producing a deeply nested DOM that exercises the component at scale.
 *
 * @param itemRenderer - Factory that creates one element per tree node.
 * @param targetSize - Number of tree nodes. Defaults to BENCH_TREE_CONFIG (~1 000).
 */
export function runBenchmark(
    itemRenderer: () => HTMLElement,
    targetSize: number = BENCH_TREE_CONFIG.targetSize
): void {
    const container = document.getElementById("container");

    const config = { ...BENCH_TREE_CONFIG, targetSize };
    const tree = buildTree(config);

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

    const { port1, port2 } = new MessageChannel();
    port1.onmessage = () => {
        (window as any).__benchmarkDone = true;
    };

    // Wait for the browser to complete layout and paint before signaling done.
    // rAF fires before paint; the MessageChannel callback fires after paint
    // completes, similar to the `afterframe` library used by tensile-perf.
    requestAnimationFrame(() => {
        port2.postMessage(undefined);
    });
}
