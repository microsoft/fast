import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "@playwright/test";
import type { CDPSession } from "@playwright/test";
import {
    computeStats,
    parseTraceEvents,
    TRACE_CATEGORIES,
    type TraceEvent,
    type TraceMetrics,
} from "./trace.js";

const benchmarksDir = resolve(import.meta.dirname);
const BENCHMARKS = readdirSync(benchmarksDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

const ITERATIONS = parseInt(process.env.BENCH_ITERATIONS ?? "10", 10);

interface BenchmarkResult {
    name: string;
    scripting: ReturnType<typeof computeStats>;
    layout: ReturnType<typeof computeStats>;
    styleRecalc: ReturnType<typeof computeStats>;
    paint: ReturnType<typeof computeStats>;
    total: ReturnType<typeof computeStats>;
    userMeasure: ReturnType<typeof computeStats>;
}

/**
 * Collect trace events via a CDP session. Returns parsed events captured
 * between `Tracing.start` and `Tracing.end`.
 */
async function collectTrace(client: CDPSession): Promise<TraceEvent[]> {
    const events: TraceEvent[] = [];

    return new Promise((resolve, reject) => {
        client.on("Tracing.dataCollected", (payload) => {
            events.push(...(payload.value as unknown as TraceEvent[]));
        });

        client.on("Tracing.tracingComplete", () => {
            resolve(events);
        });

        client.send("Tracing.end").catch(reject);
    });
}

function formatStat(stat: ReturnType<typeof computeStats>): Record<string, string> {
    return {
        "Min": stat.min.toFixed(3),
        "Median": stat.median.toFixed(3),
        "Mean": stat.mean.toFixed(3),
        "P95": stat.p95.toFixed(3),
        "Max": stat.max.toFixed(3),
    };
}

// Allow enough time for heavy benchmarks (e.g. render mounts ~100K elements
// per iteration). Scale the per-test timeout with the iteration count.
const PER_ITERATION_TIMEOUT = 30_000;
const TEST_TIMEOUT = ITERATIONS * PER_ITERATION_TIMEOUT;

test.describe("Benchmarks", () => {
    test.describe.configure({ mode: "serial" });

    const results: BenchmarkResult[] = [];

    for (const benchName of BENCHMARKS) {
        test(benchName, async ({ page }) => {
            test.setTimeout(TEST_TIMEOUT);

            const metrics: TraceMetrics[] = [];

            for (let i = 0; i < ITERATIONS; i++) {
                const client = await page.context().newCDPSession(page);

                await client.send("Tracing.start", {
                    categories: TRACE_CATEGORIES.join(","),
                    options: "sampling-frequency=10000",
                });

                await page.goto(`/${benchName}/`);
                await page.waitForFunction(
                    () => (window as any).__benchmarkDone === true,
                    null,
                    { timeout: PER_ITERATION_TIMEOUT }
                );

                const events = await collectTrace(client);
                metrics.push(parseTraceEvents(events));

                await client.detach();
            }

            results.push({
                name: benchName,
                scripting: computeStats(metrics.map(m => m.scripting)),
                layout: computeStats(metrics.map(m => m.layout)),
                styleRecalc: computeStats(metrics.map(m => m.styleRecalc)),
                paint: computeStats(metrics.map(m => m.paint)),
                total: computeStats(metrics.map(m => m.total)),
                userMeasure: computeStats(metrics.map(m => m.userMeasure)),
            });
        });
    }

    test.afterAll(() => {
        if (results.length === 0) {
            return;
        }

        for (const r of results) {
            console.log(`\n=== ${r.name} (ms) ===\n`);
            console.table({
                "Scripting": formatStat(r.scripting),
                "Layout": formatStat(r.layout),
                "Style Recalc": formatStat(r.styleRecalc),
                "Paint": formatStat(r.paint),
                "Total (trace)": formatStat(r.total),
                "User Measure": formatStat(r.userMeasure),
            });
        }
    });
});
