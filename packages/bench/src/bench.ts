import { mkdirSync, readdirSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { type ChildProcess, spawn } from "node:child_process";
import { type CDPSession, chromium } from "@playwright/test";
import {
    computeStats,
    parseTraceEvents,
    toMetricSeries,
    TRACE_CATEGORIES,
    TRACE_METRIC_KEYS,
    type TraceEvent,
    type TraceMetricKey,
    type TraceMetrics,
    type TraceMetricSeries,
} from "./trace.ts";
import { renderHtmlReport } from "./report.ts";
import { METRIC_LABELS } from "./chart.ts";

const benchmarksDir = resolve(import.meta.dirname, "scenarios");

/**
 * Discover benchmark paths. Each scenario directory contains variant
 * subdirectories (e.g. `fe/`, `fhtml/`), each with its own `index.html`.
 * Returns paths like `"basic/fe"`, `"basic/fhtml"`.
 */
function discoverBenchmarks(): string[] {
    const results: string[] = [];

    for (const scenario of readdirSync(benchmarksDir, { withFileTypes: true })) {
        if (!scenario.isDirectory()) {
            continue;
        }

        const scenarioDir = resolve(benchmarksDir, scenario.name);
        const variants = readdirSync(scenarioDir, { withFileTypes: true }).filter(d =>
            d.isDirectory()
        );

        if (variants.length > 0) {
            for (const variant of variants) {
                results.push(`${scenario.name}/${variant.name}`);
            }
        }
    }

    return results;
}

/**
 * Filter benchmarks by CLI args. Each arg is matched as a substring
 * against the benchmark name (e.g. "basic" matches "basic/fe",
 * "basic/fhtml", etc.). No args means run everything.
 */
function filterBenchmarks(all: string[]): string[] {
    const filters = process.argv.slice(2);
    if (filters.length === 0) {
        return all;
    }
    return all.filter(name => filters.some(f => name.includes(f)));
}

const BENCHMARKS = filterBenchmarks(discoverBenchmarks());

if (BENCHMARKS.length === 0) {
    const filters = process.argv.slice(2);
    console.error(`No benchmarks matched: ${filters.join(", ")}`);
    process.exit(1);
}

const ITERATIONS = parseInt(process.env.BENCH_ITERATIONS ?? "50", 10);
const port = 5174;
const baseUrl = `http://localhost:${port}`;

interface BenchmarkResult {
    name: string;
    iterations: TraceMetricSeries;
    stats: Record<TraceMetricKey, ReturnType<typeof computeStats>>;
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
        GeoMean: stat.geoMean.toFixed(3),
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
    return spawn("npm", ["start"], {
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

    const browser = await chromium.launch({
        args: [
            // Prevent Chrome from throttling or skipping paint timing in headless
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            "--disable-background-timer-throttling",
            "--disable-features=BackForwardCache",
        ],
    });

    try {
        const context = await browser.newContext();

        const results: BenchmarkResult[] = [];

        for (let b = 0, bLength = BENCHMARKS.length; b < bLength; b++) {
            const benchName = BENCHMARKS[b];
            console.log(
                `  [${b + 1}/${bLength}] ${benchName} (${ITERATIONS} iterations)`
            );
            const metrics: TraceMetrics[] = [];

            // Warm up: run the benchmark once without tracing so the
            // browser has compiled scripts, JIT'd hot paths, and
            // resolved network resources for this page.
            const warmupPage = await context.newPage();
            await warmupPage.goto(`${baseUrl}/${benchName}/`);
            await warmupPage.waitForFunction(
                () => (window as any).__benchmarkDone === true,
                null,
                { timeout: PER_ITERATION_TIMEOUT }
            );
            await warmupPage.close();

            for (let i = 0; i < ITERATIONS; i++) {
                if (ITERATIONS > 1) {
                    process.stdout.write(`\r    iteration ${i + 1}/${ITERATIONS}`);
                }

                // Use a fresh page per iteration so Chrome treats each
                // navigation as a brand-new page load and reliably emits
                // FCP/LCP timing events.
                const page = await context.newPage();
                const client = await page.context().newCDPSession(page);

                // Enable lifecycle events so we can wait for FCP before
                // stopping the trace.
                await client.send("Page.enable");

                // Wait for FCP via whichever signal fires first: CDP
                // lifecycle event or Performance API entry.
                const fcpPromise = Promise.race([
                    new Promise<void>(resolve => {
                        client.on("Page.lifecycleEvent", (params: any) => {
                            if (params.name === "firstContentfulPaint") {
                                resolve();
                            }
                        });
                    }),
                    page.waitForFunction(
                        () =>
                            performance.getEntriesByName("first-contentful-paint")
                                .length > 0,
                        null,
                        { timeout: PER_ITERATION_TIMEOUT }
                    ),
                ]);

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

                // Wait for Chrome to finalize FCP before stopping the trace.
                await fcpPromise;

                const events = await collectTrace(client);
                metrics.push(parseTraceEvents(events));

                await client.detach();
                await page.close();
            }

            if (ITERATIONS > 1) {
                process.stdout.write("\r");
            }

            const iterations = toMetricSeries(metrics);
            const stats = {} as Record<TraceMetricKey, ReturnType<typeof computeStats>>;
            for (const key of TRACE_METRIC_KEYS) {
                stats[key] = computeStats(iterations[key]);
            }

            results.push({ name: benchName, iterations, stats });

            console.log(`    done (median: ${stats.total.median.toFixed(1)}ms)`);
        }

        for (const r of results) {
            console.log(`\n=== ${r.name} (ms) ===\n`);
            const table: Record<string, Record<string, string>> = {};
            for (const key of TRACE_METRIC_KEYS) {
                table[METRIC_LABELS[key]] = formatStat(r.stats[key]);
            }
            console.table(table);
        }

        const outDir = resolve(import.meta.dirname, "..", "results");
        mkdirSync(outDir, { recursive: true });

        const reportData = results.map(r => ({
            name: r.name,
            iterations: r.iterations,
            stats: r.stats,
        }));
        const html = renderHtmlReport(reportData, {
            metrics: [...TRACE_METRIC_KEYS],
        });

        const ts = new Date().toISOString().replace(/[:T]/g, "-").replace(/\..+/, "");
        const filename = `${ts}.html`;
        const htmlPath = resolve(outDir, filename);
        writeFileSync(htmlPath, html);

        // Symlink latest.html → this run
        const latestPath = resolve(outDir, "latest.html");
        try {
            unlinkSync(latestPath);
        } catch {
            // ignore if it doesn't exist
        }
        symlinkSync(basename(htmlPath), latestPath);

        console.log(`\n  Report: ${htmlPath}`);
        console.log(`  Latest: ${latestPath}`);
    } finally {
        await browser.close();
        server?.kill();
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
