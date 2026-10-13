import assert from "node:assert/strict";
import { execFileSync, fork } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { cases, fixture, outputStats } from "./fixtures.mjs";

const { values: args } = parseArgs({
    options: {
        child: { type: "string" },
        case: { type: "string" },
        counts: { type: "string", default: "1000,5000,20000" },
        samples: { type: "string", default: "3" },
        "warmup-count": { type: "string", default: "1000" },
        output: { type: "string" },
        compare: { type: "string" },
        golden: { type: "string" },
        "check-scaling": { type: "boolean", default: false },
    },
});
const wasm = createRequire(import.meta.url)("../../wasm/microsoft_fast_build.js");

for (const path of [args.output, args.golden]) {
    if (path && existsSync(path)) {
        throw new Error(`Refusing to overwrite existing benchmark output: ${path}`);
    }
}

function render(input, mode, stream = false) {
    return wasm.render_entry_with_templates(
        input.entry,
        JSON.stringify(input.templates),
        JSON.stringify(input.state),
        "camelCase",
        stream,
        mode === "v2",
    );
}

if (args.child) {
    const request = JSON.parse(args.child);
    const input = fixture(request.case, request.count, request.payload, request.rootKeys);
    const stringifyStart = process.hrtime.bigint();
    const templatesJson = JSON.stringify(input.templates);
    const stateJson = JSON.stringify(input.state);
    const stringifyMs = Number(process.hrtime.bigint() - stringifyStart) / 1e6;
    const run = () =>
        wasm.render_entry_with_templates(
            input.entry,
            templatesJson,
            stateJson,
            "camelCase",
            false,
            request.mode === "v2",
        );
    const warmupInstances = Math.min(request.count, request.warmupCount);
    render(
        fixture(request.case, warmupInstances, request.payload, request.rootKeys),
        request.mode,
    );
    global.gc();
    const memoryBefore = process.memoryUsage();
    const cpuBefore = process.cpuUsage();
    const start = process.hrtime.bigint();
    const html = run();
    const wallMs = Number(process.hrtime.bigint() - start) / 1e6;
    const cpu = process.cpuUsage(cpuBefore);
    const memoryAfter = process.memoryUsage();
    const stats = outputStats(html);
    process.send({
        ...request,
        warmupInstances,
        ...stats,
        inputBytes:
            Buffer.byteLength(input.entry) +
            Buffer.byteLength(templatesJson) +
            Buffer.byteLength(stateJson),
        wallMs,
        cpuMs: (cpu.user + cpu.system) / 1000,
        stringifyMs,
        memoryBefore,
        memoryAfter,
        // Node reports ru_maxrss in KiB on both macOS and Linux.
        peakRssBytes: process.resourceUsage().maxRSS * 1024,
    });
    process.disconnect();
} else if (args.golden) {
    const records = [];
    for (const caseName of cases) {
        for (const count of [0, 1, 2, 1000]) {
            for (const mode of ["v3", "v2"]) {
                const input = fixture(
                    caseName,
                    count,
                    caseName === "many_definitions" ? 20 : 1,
                    20,
                );
                const html = render(input, mode);
                const chunks = JSON.parse(render(input, mode, true));
                assert.equal(chunks.join(""), html);
                records.push({
                    case: caseName,
                    count,
                    mode,
                    payload: caseName === "many_definitions" ? 20 : 1,
                    rootKeys: 20,
                    ...outputStats(html),
                });
            }
        }
    }
    writeFileSync(args.golden, `${JSON.stringify(records, null, 2)}\n`, { flag: "wx" });
} else {
    const counts = args.counts.split(",").map(Number);
    const samples = Number(args.samples);
    const warmupCount = Number(args["warmup-count"]);
    assert.ok(
        counts.every(n => Number.isSafeInteger(n) && n > 0),
        "Counts must be positive integers",
    );
    assert.ok(
        Number.isSafeInteger(samples) && samples > 0,
        "Samples must be a positive integer",
    );
    assert.ok(
        Number.isSafeInteger(warmupCount) && warmupCount > 0,
        "Warmup count must be a positive integer",
    );
    const selected = args.case ? [args.case] : cases;
    assert.ok(
        selected.every(name => cases.includes(name)),
        "Unknown case",
    );
    const records = [];
    const provenance = {
        fastCommit: execFileSync("git", ["rev-parse", "HEAD"], {
            encoding: "utf8",
        }).trim(),
        worktreeDirty:
            execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim()
                .length > 0,
        wasmSha256: createHash("sha256")
            .update(
                readFileSync(
                    new URL("../../wasm/microsoft_fast_build_bg.wasm", import.meta.url),
                ),
            )
            .digest("hex"),
    };
    const baseline = args.compare
        ? JSON.parse(readFileSync(args.compare, "utf8"))
        : undefined;
    for (const caseName of selected) {
        const sizes = caseName === "many_definitions" ? [50, 200, 1000] : counts;
        const payloads = caseName === "many_definitions" ? [1, 20] : [1];
        const roots = caseName.startsWith("large_state") ? [0, 200] : [0];
        for (const count of sizes) {
            for (const payload of payloads) {
                for (const rootKeys of roots) {
                    for (const mode of ["v3", "v2"]) {
                        const request = {
                            case: caseName,
                            count,
                            payload,
                            rootKeys,
                            mode,
                            warmupCount,
                        };
                        const measurements = [];
                        for (let i = 0; i < samples; ++i) {
                            measurements.push(await measure(request));
                        }
                        measurements.sort((a, b) => a.wallMs - b.wallMs);
                        const median = measurements[Math.floor(samples / 2)];
                        const rssSamples = measurements
                            .map(m => m.sampledPeakRssBytes)
                            .filter(value => value !== null);
                        const record = {
                            ...median,
                            samples,
                            medianMs: median.wallMs,
                            p95Ms: measurements[Math.ceil(samples * 0.95) - 1].wallMs,
                            peakRssBytes: Math.max(
                                ...measurements.map(m => m.peakRssBytes),
                            ),
                            sampledPeakRssBytes: rssSamples.length
                                ? Math.max(...rssSamples)
                                : null,
                            outputMBPerSecond: median.outputBytes / median.wallMs / 1000,
                            elementsPerSecond: (count / median.wallMs) * 1000,
                            bytesPerElement: median.outputBytes / count,
                        };
                        records.push(record);
                        const previous = baseline?.records.find(
                            r => key(r) === key(record),
                        );
                        if (baseline) {
                            assert.ok(previous, `Missing baseline: ${key(record)}`);
                            assert.equal(
                                record.sha256,
                                previous.sha256,
                                `HTML parity: ${key(record)}`,
                            );
                            assert.equal(record.outputBytes, previous.outputBytes);
                        }
                        console.error(
                            `${key(record)}: ${record.medianMs.toFixed(2)} ms${previous ? ` (${(previous.medianMs / record.medianMs).toFixed(2)}x faster)` : ""}`,
                        );
                    }
                }
            }
        }
    }
    const report = {
        schemaVersion: 1,
        ...provenance,
        crateVersion: createRequire(import.meta.url)("../../package.json").version,
        profile: "wasm-pack release (package build defaults)",
        runtime: { node: process.version, v8: process.versions.v8 },
        target: {
            platform: process.platform,
            arch: process.arch,
            cpu: os.cpus()[0].model,
        },
        records,
    };
    if (args.output) {
        writeFileSync(args.output, `${JSON.stringify(report, null, 2)}\n`, {
            flag: "wx",
        });
    } else {
        console.log(JSON.stringify(report, null, 2));
    }
    if (args["check-scaling"]) {
        for (const mode of ["v3", "v2"]) {
            const times = [1000, 5000, 20000].map(count =>
                records.find(
                    r =>
                        r.case === "url_sink_siblings" &&
                        r.count === count &&
                        r.mode === mode,
                ),
            );
            assert.ok(
                times.every(Boolean),
                "Scaling requires the URL case at 1000, 5000, 20000",
            );
            const ratio = times[2].medianMs / times[1].medianMs;
            // Differences cancel a fixed setup intercept: (20k - 5k)/(5k - 1k) = 3.75.
            const slopeRatio =
                (times[2].medianMs - times[1].medianMs) /
                (times[1].medianMs - times[0].medianMs);
            assert.ok(
                slopeRatio > 0,
                `${mode}: non-increasing timings; collect more samples`,
            );
            let low = 0.01;
            let high = 4;
            for (let i = 0; i < 50; ++i) {
                const power = (low + high) / 2;
                const predicted = (20 ** power - 5 ** power) / (5 ** power - 1);
                if (predicted < slopeRatio) low = power;
                else high = power;
            }
            const exponent = (low + high) / 2;
            console.error(
                `${mode}: 20k/5k=${ratio.toFixed(2)}, fitted exponent=${exponent.toFixed(2)}`,
            );
            assert.ok(ratio <= 5, `${mode}: 20k/5k ${ratio.toFixed(2)} exceeds 5`);
            assert.ok(
                exponent <= 1.15,
                `${mode}: exponent ${exponent.toFixed(2)} exceeds 1.15`,
            );
        }
    }
}

function key(record) {
    return `${record.case}/${record.mode}/${record.count}/payload${record.payload}/root${record.rootKeys}`;
}

function measure(request) {
    return new Promise((resolve, reject) => {
        const child = fork(
            fileURLToPath(import.meta.url),
            ["--child", JSON.stringify(request)],
            {
                execArgv: ["--expose-gc"],
                stdio: ["ignore", "ignore", "inherit", "ipc"],
            },
        );
        let result;
        let peak = 0;
        const timer = setInterval(() => {
            if (process.platform === "linux") {
                try {
                    const status = readFileSync(`/proc/${child.pid}/status`, "utf8");
                    const rss = status.match(/^VmRSS:\s+(\d+)\s+kB/m);
                    if (rss) peak = Math.max(peak, Number(rss[1]) * 1024);
                } catch (error) {
                    if (error.code !== "ENOENT" && error.code !== "ESRCH") {
                        clearInterval(timer);
                        child.kill();
                        reject(error);
                    }
                }
            } else if (process.platform === "darwin") {
                try {
                    const rss = execFileSync(
                        "ps",
                        ["-o", "rss=", "-p", String(child.pid)],
                        {
                            encoding: "utf8",
                        },
                    ).trim();
                    if (rss) peak = Math.max(peak, Number(rss) * 1024);
                } catch (error) {
                    if (error.status !== 1) {
                        clearInterval(timer);
                        child.kill();
                        reject(error);
                    }
                }
            }
        }, 100);
        child.on("message", message => {
            result = message;
        });
        child.on("error", error => {
            clearInterval(timer);
            reject(error);
        });
        child.on("exit", code => {
            clearInterval(timer);
            if (code !== 0 || !result) {
                reject(new Error(`Benchmark child exited with code ${code}`));
            } else {
                resolve({ ...result, sampledPeakRssBytes: peak || null });
            }
        });
    });
}
