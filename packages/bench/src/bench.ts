import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { type ChildProcess, spawn } from "node:child_process";
import { type CDPSession, chromium } from "@playwright/test";
import {
    computeStats,
    parseTraceEvents,
    TRACE_CATEGORIES,
    type TraceEvent,
    type TraceMetrics,
} from "./trace.ts";

const benchmarksDir = resolve(import.meta.dirname);
const BENCHMARKS = readdirSync(benchmarksDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

const ITERATIONS = parseInt(process.env.BENCH_ITERATIONS ?? "50", 10);
const useDist = process.env.BENCH_DIST === "true";
const port = useDist ? 5174 : 5173;
const baseUrl = `http://localhost:${port}`;

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
        client.on("Tracing.dataCollected", payload => {
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
        Min: stat.min.toFixed(3),
        Median: stat.median.toFixed(3),
        Mean: stat.mean.toFixed(3),
        P95: stat.p95.toFixed(3),
        Max: stat.max.toFixed(3),
    };
}

async function isServerRunning(url: string): Promise<boolean> {
    try {
        const res = await fetch(url);
        return res.ok;
    } catch {
        return false;
    }
}

async function waitForServer(url: string, timeout = 30_000): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (await isServerRunning(url)) {
            return;
        }
        await new Promise(r => setTimeout(r, 250));
    }
    throw new Error(`Server at ${url} did not start within ${timeout}ms`);
}

function startServer(): ChildProcess {
    const args = useDist ? ["start"] : ["run", "serve"];
    return spawn("npm", args, {
        cwd: resolve(import.meta.dirname, ".."),
        stdio: "pipe",
    });
}

const PER_ITERATION_TIMEOUT = 30_000;

async function main(): Promise<void> {
    let server: ChildProcess | null = null;

    if (!(await isServerRunning(baseUrl))) {
        server = startServer();
        console.log(`Starting server at ${baseUrl}...`);
        await waitForServer(baseUrl);
    }

    console.log(
        `Running ${BENCHMARKS.length} benchmark(s) × ${ITERATIONS} iteration(s).\n`
    );

    const browser = await chromium.launch();

    try {
        const context = await browser.newContext();

        // Warm up: navigate to each benchmark once so the browser has compiled
        // and cached scripts, JIT'd hot paths, and resolved network resources
        // before we start collecting real measurements.
        console.log("Warming up...");
        const warmupPage = await context.newPage();
        for (const benchName of BENCHMARKS) {
            await warmupPage.goto(`${baseUrl}/${benchName}/`);
            await warmupPage.waitForFunction(
                () => (window as any).__benchmarkDone === true,
                null,
                { timeout: PER_ITERATION_TIMEOUT }
            );
        }
        await warmupPage.close();

        const results: BenchmarkResult[] = [];

        for (const benchName of BENCHMARKS) {
            process.stdout.write(`  ${benchName}...`);
            const metrics: TraceMetrics[] = [];
            const page = await context.newPage();

            for (let i = 0; i < ITERATIONS; i++) {
                const client = await page.context().newCDPSession(page);

                await client.send("Tracing.start", {
                    categories: TRACE_CATEGORIES.join(","),
                    options: "sampling-frequency=10000",
                });

                await page.goto(`${baseUrl}/${benchName}/`);
                await page.waitForFunction(
                    () => (window as any).__benchmarkDone === true,
                    null,
                    { timeout: PER_ITERATION_TIMEOUT }
                );

                const events = await collectTrace(client);
                metrics.push(parseTraceEvents(events));

                await client.detach();
            }

            await page.close();

            results.push({
                name: benchName,
                scripting: computeStats(metrics.map(m => m.scripting)),
                layout: computeStats(metrics.map(m => m.layout)),
                styleRecalc: computeStats(metrics.map(m => m.styleRecalc)),
                paint: computeStats(metrics.map(m => m.paint)),
                total: computeStats(metrics.map(m => m.total)),
                userMeasure: computeStats(metrics.map(m => m.userMeasure)),
            });

            console.log(" done");
        }

        for (const r of results) {
            console.log(`\n=== ${r.name} (ms) ===\n`);
            console.table({
                Scripting: formatStat(r.scripting),
                Layout: formatStat(r.layout),
                "Style Recalc": formatStat(r.styleRecalc),
                Paint: formatStat(r.paint),
                "Total (trace)": formatStat(r.total),
                "User Measure": formatStat(r.userMeasure),
            });
        }
    } finally {
        await browser.close();
        server?.kill();
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
