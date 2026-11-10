import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import * as fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { fixture, outputStats } from "./fixtures.mjs";

const script = fileURLToPath(import.meta.url);
const require = createRequire(import.meta.url);
const { values: args } = parseArgs({
    options: {
        samples: { type: "string", default: "5" },
        warmup: { type: "string", default: "3" },
        instances: { type: "string", default: "200" },
        definitions: { type: "string", default: "64" },
        entries: { type: "string", default: "8" },
        "cache-bytes": { type: "string", default: "32768" },
        "startup-samples": { type: "string", default: "3" },
        output: { type: "string" },
        worker: { type: "boolean", default: false },
        help: { type: "boolean", default: false },
    },
});

if (args.help) {
    console.log(`Prepared renderer lifecycle benchmark (no timing thresholds).
Run from the repository root:
  npm run bench:prepared -w @microsoft/fast-build -- --output=prepared-results.json
Options: --samples=5 --warmup=3 --instances=200 --definitions=64 --entries=8
         --cache-bytes=32768 --startup-samples=3 --output=<new JSON file>
Definitions is per entry in the low-reuse workload. Counts must be positive;
warmup and cache-bytes may be zero. Output files are never overwritten.
See test/performance/PREPARED.md for measurement boundaries.`);
} else if (args.worker) {
    // Nothing above this point imports the prepared module or WASM.
    const before = snapshot();
    const start = performance.now();
    await import("../../prepared.js");
    const afterPreparedImport = performance.now();
    const wasm = require("../../wasm/microsoft_fast_build.js");
    const afterWasmRequire = performance.now();
    console.log(
        JSON.stringify({
            preparedImportIncludingWasmMs: afterPreparedImport - start,
            cachedWasmRequireMs: afterWasmRequire - afterPreparedImport,
            compiler: wasm.prepared_compiler_id(),
            memoryBefore: before,
            memoryAfter: snapshot(wasm),
        }),
    );
} else {
    await main();
}

function integer(name, minimum = 1) {
    const value = Number(args[name]);
    assert.ok(
        Number.isSafeInteger(value) && value >= minimum,
        `--${name} must be an integer >= ${minimum}`,
    );
    return value;
}

function snapshot(wasm) {
    const memory = wasm?.memory ?? wasm?.__wasm?.memory;
    return {
        ...process.memoryUsage(),
        wasmLinearBufferBytes:
            memory instanceof WebAssembly.Memory ? memory.buffer.byteLength : null,
    };
}

function memoryDelta(before, after) {
    return Object.fromEntries(
        Object.keys(after).map(key => [
            key,
            before[key] === null || after[key] === null ? null : after[key] - before[key],
        ]),
    );
}

function median(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function summarize(measurements) {
    return {
        samples: measurements.length,
        medianWallMs: median(measurements.map(item => item.wallMs)),
        medianCpuMs: median(measurements.map(item => item.cpuMs)),
        measurements,
    };
}

async function timed(run, wasm) {
    const memoryBefore = snapshot(wasm);
    const cpu = process.cpuUsage();
    const start = performance.now();
    const value = await run();
    const wallMs = performance.now() - start;
    const elapsedCpu = process.cpuUsage(cpu);
    const memoryAfter = snapshot(wasm);
    return {
        value,
        measurement: {
            wallMs,
            cpuMs: (elapsedCpu.user + elapsedCpu.system) / 1000,
            memoryBefore,
            memoryAfter,
            memoryDelta: memoryDelta(memoryBefore, memoryAfter),
        },
    };
}

async function sample(count, run, wasm) {
    const measurements = [];
    for (let index = 0; index < count; index++) {
        const { measurement } = await timed(run, wasm);
        measurements.push(measurement);
    }
    return summarize(measurements);
}

function workloads(config) {
    const repeated = fixture("repeat_custom_elements", config.instances);
    const repeatedEntries = {};
    const distinctEntries = {};
    const definitions = {};
    for (let index = 0; index < config.entries; index++) {
        repeatedEntries[`entry-${index}`] =
            `<main data-entry="${index}">${repeated.entry}</main>`;
        let entry = "";
        for (let definition = 0; definition < config.definitions; definition++) {
            const name = `bench-unique-${index}-${definition}`;
            definitions[name] = `<span data-definition="${name}">{{label}}</span>`;
            entry += `<${name}></${name}>`;
        }
        distinctEntries[`entry-${index}`] = entry;
    }
    return [
        {
            name: "repeated-components",
            entries: repeatedEntries,
            templates: repeated.templates,
            state: repeated.state,
        },
        {
            name: "high-definition-count-low-reuse",
            entries: distinctEntries,
            templates: definitions,
            state: { label: 'Definition & <"value"> caf\u00e9' },
        },
    ];
}

function legacy(wasm, input, entry, templatesJson, options) {
    return wasm.render_entry_with_templates(
        input.entries[entry],
        templatesJson,
        JSON.stringify(input.state),
        "camelCase",
        options.stream ?? false,
        options.markersV2 ?? false,
    );
}

async function parity(api, wasm, input, compiled) {
    const runtime = api.createPreparedRuntime({
        manifest: compiled.manifest,
        loadArtifact: async id => compiled.artifacts.get(id),
    });
    const records = [];
    try {
        const templatesJson = JSON.stringify(input.templates);
        for (const entry of Object.keys(input.entries)) {
            for (const markersV2 of [false, true]) {
                const options = { markersV2, attributeNameStrategy: "camelCase" };
                const expected = legacy(wasm, input, entry, templatesJson, options);
                const expectedChunks = JSON.parse(
                    legacy(wasm, input, entry, templatesJson, {
                        ...options,
                        stream: true,
                    }),
                );
                const actual = await runtime.render(entry, input.state, options);
                const chunks = await runtime.render(entry, input.state, {
                    ...options,
                    stream: true,
                });
                assert.equal(actual, expected, `${input.name}/${entry}/HTML`);
                assert.deepEqual(chunks, expectedChunks, `${input.name}/${entry}/chunks`);
                assert.equal(chunks.join(""), actual);
                records.push({
                    entry,
                    mode: markersV2 ? "v2" : "v3",
                    ...outputStats(actual),
                    chunks: chunks.length,
                    chunksSha256: createHash("sha256")
                        .update(JSON.stringify(chunks))
                        .digest("hex"),
                });
            }
        }
    } finally {
        await runtime.dispose();
    }
    return records;
}

async function writeArtifacts(directory, compiled) {
    await fs.mkdir(directory, { recursive: true });
    for (const [id, bytes] of compiled.artifacts) {
        await fs.writeFile(path.join(directory, `${id}.fast-artifact.json`), bytes, {
            flag: "wx",
        });
    }
    await fs.writeFile(
        path.join(directory, "manifest.json"),
        JSON.stringify(compiled.manifest),
        { flag: "wx" },
    );
}

function loader(directory) {
    const stats = { calls: 0, bytes: 0 };
    return {
        stats,
        loadArtifact: async id => {
            const bytes = await fs.readFile(
                path.join(directory, `${id}.fast-artifact.json`),
            );
            stats.calls++;
            stats.bytes += bytes.byteLength;
            return bytes;
        },
    };
}

function usage(runtime) {
    return structuredClone(runtime.memoryUsage);
}

async function retention(api, wasm, input, compiled, directory, budget, samples) {
    const names = Object.keys(input.entries);
    const loads = loader(directory);
    const runtimes = [];
    const runtime = api.createPreparedRuntime({
        manifest: compiled.manifest,
        loadArtifact: loads.loadArtifact,
        ...(budget === null ? {} : { maxMemoryBytes: budget }),
    });
    const initialMemory = snapshot(wasm);
    const sweeps = [];
    try {
        for (let sweep = 0; sweep < 2; sweep++) {
            const calls = loads.stats.calls;
            const bytes = loads.stats.bytes;
            const result = await timed(async () => {
                for (const name of names) {
                    await runtime.render(name, input.state);
                }
            }, wasm);
            sweeps.push({
                ...result.measurement,
                loads: loads.stats.calls - calls,
                loadedArtifactBytes: loads.stats.bytes - bytes,
                retained: usage(runtime),
            });
        }
        const reloads = [];
        for (let index = 0; index < samples; index++) {
            // Age the first entry out where the chosen budget makes that possible.
            for (const name of names.slice(1)) {
                await runtime.render(name, input.state);
            }
            const calls = loads.stats.calls;
            const result = await timed(() => runtime.render(names[0], input.state), wasm);
            reloads.push({
                ...result.measurement,
                artifactLoads: loads.stats.calls - calls,
                retained: usage(runtime),
            });
        }
        if (budget === 0) {
            assert.ok(reloads.every(item => item.artifactLoads > 0));
            assert.equal(runtime.memoryUsage.bytes, 0);
        }
        const sharedRetained = usage(runtime);
        const sharedProcessMemory = snapshot(wasm);
        await runtime.dispose();
        const distinctBefore = snapshot(wasm);
        const distinctLoads = loader(directory);
        for (const name of names) {
            const isolated = api.createPreparedRuntime({
                // Every cache validates the same full deployment manifest.
                manifest: compiled.manifest,
                loadArtifact: distinctLoads.loadArtifact,
                ...(budget === null ? {} : { maxMemoryBytes: budget }),
            });
            runtimes.push(isolated);
            await isolated.render(name, input.state);
        }
        const distinctRetained = runtimes.map(usage);
        return {
            maxMemoryBytes: budget,
            budgetLabel: budget === null ? "runtime-default-32-MiB" : `${budget}-bytes`,
            sweeps,
            revisitFirstEntry: summarize(reloads),
            sharedRetained,
            sharedProcessMemoryDelta: memoryDelta(initialMemory, sharedProcessMemory),
            distinctPerEntryCaches: {
                cacheCount: runtimes.length,
                retained: distinctRetained,
                summedEstimatedRustBytes: distinctRetained.reduce(
                    (total, item) => total + item.bytes,
                    0,
                ),
                artifactLoads: distinctLoads.stats.calls,
                processMemoryDelta: memoryDelta(distinctBefore, snapshot(wasm)),
            },
        };
    } finally {
        await runtime.dispose();
        await Promise.all(runtimes.map(item => item.dispose()));
    }
}

async function benchmark(api, wasm, input, compiled, directory, config) {
    const entry = Object.keys(input.entries)[0];
    const templatesJson = JSON.stringify(input.templates);
    const preparation = await sample(
        config.samples,
        () =>
            api.compileArtifacts({
                entries: input.entries,
                templates: input.templates,
            }),
        wasm,
    );
    const persistence = await timed(() => writeArtifacts(directory, compiled), wasm);
    const coldMeasurements = [];
    for (let index = 0; index < config.samples; index++) {
        const loads = loader(directory);
        let runtime;
        try {
            const result = await timed(async () => {
                const manifest = JSON.parse(
                    await fs.readFile(path.join(directory, "manifest.json"), "utf8"),
                );
                runtime = api.createPreparedRuntime({
                    manifest,
                    loadArtifact: loads.loadArtifact,
                });
                return runtime.render(entry, input.state);
            }, wasm);
            coldMeasurements.push({
                ...result.measurement,
                artifactLoads: loads.stats.calls,
                loadedArtifactBytes: loads.stats.bytes,
                retained: usage(runtime),
            });
        } finally {
            await runtime?.dispose();
        }
    }
    const modes = [];
    for (const markersV2 of [false, true]) {
        for (const stream of [false, true]) {
            const options = { markersV2, stream, attributeNameStrategy: "camelCase" };
            const loads = loader(directory);
            const creation = await timed(
                () =>
                    api.createPreparedRuntime({
                        manifest: compiled.manifest,
                        loadArtifact: loads.loadArtifact,
                    }),
                wasm,
            );
            const runtime = creation.value;
            try {
                // Always prime the cache, even when JIT warmup is explicitly zero.
                await runtime.render(entry, input.state, options);
                for (let index = 0; index < config.warmup; index++) {
                    await runtime.render(entry, input.state, options);
                    legacy(wasm, input, entry, templatesJson, options);
                }
                const beforeLoads = loads.stats.calls;
                const prepared = await sample(
                    config.samples,
                    () => runtime.render(entry, input.state, options),
                    wasm,
                );
                const legacyOneShot = await sample(
                    config.samples,
                    () => legacy(wasm, input, entry, templatesJson, options),
                    wasm,
                );
                assert.equal(loads.stats.calls, beforeLoads);
                modes.push({
                    mode: markersV2 ? "v2" : "v3",
                    output: stream ? "exact-chunks" : "HTML",
                    manifestValidationAndRuntimeCreation: creation.measurement,
                    prepared,
                    legacyOneShot,
                    retained: usage(runtime),
                });
            } finally {
                await runtime.dispose();
            }
        }
    }
    const caches = [];
    for (const budget of [...new Set([null, 0, config.cacheBytes])]) {
        caches.push(
            await retention(
                api,
                wasm,
                input,
                compiled,
                directory,
                budget,
                config.samples,
            ),
        );
    }
    return {
        name: input.name,
        entryCount: Object.keys(input.entries).length,
        templateCount: Object.keys(input.templates).length,
        timedEntry: entry,
        compiler: compiled.manifest.compiler,
        manifestVersion: compiled.manifest.version,
        generation: compiled.manifest.generation,
        sourceBytes:
            Object.values(input.entries).reduce(
                (total, html) => total + Buffer.byteLength(html),
                0,
            ) + Buffer.byteLength(templatesJson),
        artifactBytes: [...compiled.artifacts.values()].reduce(
            (total, bytes) => total + bytes.byteLength,
            0,
        ),
        artifactCount: compiled.artifacts.size,
        manifestBytes: Buffer.byteLength(JSON.stringify(compiled.manifest)),
        preparation,
        filesystemPersistence: persistence.measurement,
        diskLoadAndFirstRender: summarize(coldMeasurements),
        warmedRendering: modes,
        retention: caches,
    };
}

async function main() {
    const config = {
        samples: integer("samples"),
        warmup: integer("warmup", 0),
        instances: integer("instances"),
        definitions: integer("definitions"),
        entries: integer("entries"),
        cacheBytes: integer("cache-bytes", 0),
        startupSamples: integer("startup-samples"),
    };
    if (args.output) {
        assert.ok(!readable(args.output), `Refusing to overwrite ${args.output}`);
    }
    const api = await import("../../prepared.js");
    assert.equal(
        typeof api.compileArtifacts,
        "function",
        "Rebuild prepared runtime first",
    );
    assert.equal(typeof api.createPreparedRuntime, "function");
    const wasm = require("../../wasm/microsoft_fast_build.js");
    const inputs = workloads(config);
    const compiled = inputs.map(input =>
        api.compileArtifacts({ entries: input.entries, templates: input.templates }),
    );
    const parityRecords = [];
    for (let index = 0; index < inputs.length; index++) {
        parityRecords.push({
            workload: inputs[index].name,
            records: await parity(api, wasm, inputs[index], compiled[index]),
        });
    }
    console.error("HTML and exact-chunk parity passed for every entry in v2 and v3.");
    const startup = [];
    for (let index = 0; index < config.startupSamples; index++) {
        const start = performance.now();
        const child = spawnSync(process.execPath, [script, "--worker"], {
            encoding: "utf8",
            timeout: 60_000,
            maxBuffer: 1024 * 1024,
        });
        assert.equal(child.status, 0, child.stderr || String(child.error));
        startup.push({
            freshProcessLaunchThroughExitMs: performance.now() - start,
            ...JSON.parse(child.stdout),
        });
    }
    // Owned, uniquely named scratch storage under cwd; never a system temp directory.
    const directory = path.resolve(`.prepared-bench-${randomUUID()}`);
    const records = [];
    try {
        for (let index = 0; index < inputs.length; index++) {
            console.error(`Measuring ${inputs[index].name}...`);
            records.push(
                await benchmark(
                    api,
                    wasm,
                    inputs[index],
                    compiled[index],
                    path.join(directory, String(index)),
                    config,
                ),
            );
        }
    } finally {
        await fs.rm(directory, { recursive: true, force: true });
    }
    const report = {
        schemaVersion: 1,
        benchmark: "prepared-renderer-lifecycle",
        generatedAt: new Date().toISOString(),
        configuration: config,
        provenance: {
            commit: execFileSync("git", ["rev-parse", "HEAD"], {
                encoding: "utf8",
            }).trim(),
            dirty: Boolean(
                execFileSync("git", ["status", "--porcelain"], {
                    encoding: "utf8",
                }).trim(),
            ),
            wasmSha256: createHash("sha256")
                .update(
                    readFileSync(
                        new URL(
                            "../../wasm/microsoft_fast_build_bg.wasm",
                            import.meta.url,
                        ),
                    ),
                )
                .digest("hex"),
            packageVersion: require("../../package.json").version,
            compiler: wasm.prepared_compiler_id(),
            buildProfile: "Not inferred; build separately and record build command.",
            node: process.version,
            versions: process.versions,
            execArgv: process.execArgv,
            platform: process.platform,
            release: os.release(),
            arch: process.arch,
            cpu: os.cpus()[0]?.model,
            logicalCpus: os.cpus().length,
            totalMemoryBytes: os.totalmem(),
        },
        boundaries: {
            parity: "Untimed, all entries, legacy/prepared HTML and exact chunks, v2/v3.",
            startup:
                "Fresh child processes; parent wall includes launch, harness imports, import/WASM initialization, reporting and exit. Child import timer excludes Node and harness startup.",
            preparation:
                "Repeated synchronous compileArtifacts CPU/wall, after parity/JIT initialization; no filesystem writes.",
            persistence:
                "One async write of generated files and manifest; no fsync, no durable-storage guarantee.",
            diskCold:
                "Fresh empty runtime cache; timer includes disk manifest read/parse, full validation/runtime creation, artifact reads/imports, state serialization and first v3 HTML render. WASM already initialized; OS page cache is NOT flushed.",
            warm: "Runtime creation/full manifest validation reported separately per mode; preparation and priming excluded. Prepared host serializes state on each request; legacy serializes state per call but reuses serialized template map. Legacy stream returns JSON text; prepared returns decoded chunks, as their public APIs specify.",
            retention:
                "Sequential requests; one shared full-manifest runtime versus one full-manifest runtime per entry. Revisit loads=0 means no eviction for that budget/workload, not measured reload.",
            state: "One unmodified state object per workload; each call captures/serializes fresh request state, with no mutation or retained output. No concurrent requests.",
            memory: "Process before/after snapshots and deltas, not allocation peaks; no forced GC. Rust retained bytes are runtime estimates, not RSS. WASM buffer is null when not publicly exposed and may not shrink after dispose. No active-allocation peak instrumentation.",
            ordering:
                "Fixed workload/mode/lane order; no statistical significance or speedup claim. All raw samples retained, medians use midpoint averaging for even counts.",
        },
        parity: parityRecords,
        processColdInitialization: {
            samples: startup.length,
            medianProcessLaunchThroughExitMs: median(
                startup.map(item => item.freshProcessLaunchThroughExitMs),
            ),
            medianPreparedImportIncludingWasmMs: median(
                startup.map(item => item.preparedImportIncludingWasmMs),
            ),
            measurements: startup,
        },
        records,
    };
    const json = `${JSON.stringify(report, null, 2)}\n`;
    if (args.output) {
        writeFileSync(args.output, json, { flag: "wx" });
        console.error(`Wrote ${args.output}`);
    } else {
        process.stdout.write(json);
    }
}

function readable(filename) {
    try {
        readFileSync(filename);
        return true;
    } catch (error) {
        if (error.code === "ENOENT") {
            return false;
        }
        throw error;
    }
}
