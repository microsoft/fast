import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { PerformanceObserver, performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { fixture, outputStats } from "./fixtures.mjs";

const require = createRequire(import.meta.url);
const { values: args } = parseArgs({
    options: {
        worker: { type: "string" },
        directory: { type: "string" },
        samples: { type: "string", default: "3" },
        iterations: { type: "string", default: "100" },
        instances: { type: "string", default: "200" },
        warmup: { type: "string", default: "20" },
        "profile-directory": { type: "string" },
        "native-addon": { type: "string" },
        "markers-v2": { type: "boolean", default: false },
        "attribute-name-strategy": { type: "string", default: "camelCase" },
        output: { type: "string" },
    },
});
const addonPath = args["native-addon"] ?? process.env.FAST_NATIVE_ADDON;
assert.ok(addonPath, "Configure --native-addon or FAST_NATIVE_ADDON.");
assert.ok(
    ["camelCase", "none"].includes(args["attribute-name-strategy"]),
    "Invalid attribute name strategy.",
);
const renderOptions = {
    markersV2: args["markers-v2"],
    attributeNameStrategy: args["attribute-name-strategy"],
};
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
function integer(name, minimum = 1) {
    const value = Number(args[name]);
    assert.ok(
        Number.isSafeInteger(value) && value >= minimum,
        name + " must be " + (minimum === 0 ? "nonnegative" : "positive"),
    );
    return value;
}

if (args.worker) await worker();
else await main();

async function worker() {
    assert.equal(args.worker, "native", "Worker requires the native Node host.");
    const iterations = integer("iterations");
    const warmupIterations = integer("warmup", 0);
    let start = performance.now();
    const input = await fs.readFile(path.join(args.directory, "input.json"), "utf8");
    const inputReadMs = performance.now() - start;
    start = performance.now();
    const source = JSON.parse(input);
    const inputParseMs = performance.now() - start;
    start = performance.now();
    const stateJson = JSON.stringify(source.state);
    const stateSerializeMs = performance.now() - start;
    start = performance.now();
    const state = Buffer.from(stateJson, "utf8");
    const stateEncodeMs = performance.now() - start;
    start = performance.now();
    const artifact = await fs.readFile(path.join(args.directory, "server.json"));
    const artifactReadMs = performance.now() - start;
    const memoryBefore = process.memoryUsage();
    start = performance.now();
    const { loadNativeHost } = require("../../native-host.mjs");
    const Program = loadNativeHost(addonPath);
    const addonLoadMs = performance.now() - start;
    start = performance.now();
    const program = new Program(artifact, renderOptions);
    const programLoadMs = performance.now() - start;
    const render = () => program.renderEntryJson(state);
    start = performance.now();
    const bytes = render();
    const firstRenderMs = performance.now() - start;
    assert.ok(Buffer.isBuffer(bytes));
    const memoryAfterFirst = process.memoryUsage();
    start = performance.now();
    const html = bytes.toString("utf8");
    const outputDecodeMs = performance.now() - start;
    start = performance.now();
    await fs.writeFile(path.join(args.directory, "rendered.html"), bytes);
    const outputWriteMs = performance.now() - start;
    let latest = bytes;
    start = performance.now();
    for (let index = 0; index < warmupIterations; index++) latest = render();
    const warmupMs = performance.now() - start;
    assert.equal(hash(latest), hash(bytes));
    globalThis.gc?.();
    const memoryWarm = process.memoryUsage();
    let gcCount = 0;
    let gcMs = 0;
    let warmStart = 0;
    let warmEnd = 0;
    const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
            if (entry.startTime >= warmStart && entry.startTime < warmEnd) {
                gcCount++;
                gcMs += entry.duration;
            }
        }
    });
    observer.observe({ entryTypes: ["gc"] });
    const cpu = process.cpuUsage();
    warmStart = performance.now();
    for (let index = 0; index < iterations; index++) latest = render();
    warmEnd = performance.now();
    const cpuUsed = process.cpuUsage(cpu);
    assert.equal(hash(latest), hash(bytes));
    await new Promise(resolve => setImmediate(resolve));
    await new Promise(resolve => setImmediate(resolve));
    observer.disconnect();
    const memoryAfterWarm = process.memoryUsage();
    globalThis.gc?.();
    const memoryRetained = process.memoryUsage();
    start = performance.now();
    let latestString;
    for (let index = 0; index < iterations; index++)
        latestString = render().toString("utf8");
    const warmStringMsPerRender = (performance.now() - start) / iterations;
    assert.equal(latestString, html);
    const warmMsPerRender = (warmEnd - warmStart) / iterations;
    const { outputBytes: _bytes, sha256: _hash, ...structure } = outputStats(html);
    console.log(
        JSON.stringify({
            reportVersion: 3,
            executionTarget: "native-node-host",
            requestInput: "json-buffer",
            requestOutput: "owned-buffer",
            renderOptions,
            inputReadMs,
            inputParseMs,
            stateSerializeMs,
            stateEncodeMs,
            artifactReadMs,
            stateJsonBytes: state.length,
            stateJsonHash: hash(state),
            addonLoadMs,
            programLoadMs,
            firstRenderMs,
            coldLoadAndRenderMs: addonLoadMs + programLoadMs + firstRenderMs,
            outputDecodeMs,
            outputWriteMs,
            warmupMs,
            warmupIterations,
            warmMsPerRender,
            warmStringMsPerRender,
            cpuMsPerRender: (cpuUsed.user + cpuUsed.system) / 1000 / iterations,
            warmBytesPerSecond:
                warmMsPerRender > 0 ? (bytes.length * 1000) / warmMsPerRender : null,
            iterations,
            gcCount,
            gcMs,
            memoryBefore,
            memoryAfterFirst,
            memoryWarm,
            memoryAfterWarm,
            memoryRetained,
            outputBytes: bytes.length,
            outputHash: hash(bytes),
            outputStructure: {
                ...structure,
                dsdRoots: (html.match(/<template shadowrootmode=/g) ?? []).length,
            },
        }),
    );
}

async function main() {
    const samples = integer("samples");
    const instances = integer("instances");
    const iterations = integer("iterations");
    const warmupIterations = integer("warmup", 0);
    let profileDirectory;
    if (args["profile-directory"]) {
        const directory = path.resolve(args["profile-directory"]);
        await fs.mkdir(directory, { recursive: true });
        profileDirectory = await fs.mkdtemp(path.join(directory, "fast-server-profile-"));
    }
    const compilerStart = performance.now();
    const { compileServerArtifact } = require("../../server.js");
    require("../../wasm/microsoft_fast_build.js");
    const compilerLoadMs = performance.now() - compilerStart;
    const workloadStart = performance.now();
    const workloads = {
        static: {
            entry: "<bench-static></bench-static>".repeat(instances),
            templates: { "bench-static": "<h2>Static</h2><p>No bindings</p>" },
            state: {},
        },
        largeStaticTemplates: {
            entry: Array.from(
                { length: instances },
                (_, index) => `<bench-static-${index}></bench-static-${index}>`,
            ).join(""),
            templates: Object.fromEntries(
                Array.from({ length: instances }, (_, index) => [
                    `bench-static-${index}`,
                    `<h2>Definition ${index}</h2>${(
                        '<section class="panel"><p>' +
                            "Static text &amp; markup ".repeat(20) +
                            "</p><br /></section>\n"
                    ).repeat(20)}<b>{{label}}</b>`,
                ]),
            ),
            state: { label: "Small bound region & escaped text" },
        },
        uniqueHosts: {
            entry: Array.from(
                { length: instances },
                (_, index) =>
                    `<bench-unique index="${index}" data-label="item-${index}" style="--index:${index}"></bench-unique>`,
            ).join(""),
            templates: {
                "bench-unique":
                    '<article title="{{index}}">{{index}}/{{dataset.label}}</article>',
            },
            state: {},
        },
        bindings: fixture("plain_bound_elements", instances),
        escapedBindings: {
            entry: '<f-repeat value="{{item in items}}"><p title="{{item}}">{{item}}</p></f-repeat>',
            templates: {},
            state: {
                items: Array.from(
                    { length: instances },
                    (_, index) => `${index}: ${"caf\u00e9 \u{1f600} &<>\"'".repeat(100)}`,
                ),
            },
        },
        deepPaths: {
            entry: "<p>{{profile.name}}/{{profile.items.+00.title}}/{{profile.items.length}}</p>".repeat(
                instances,
            ),
            templates: {},
            state: { profile: { name: "Deep & escaped", items: [{ title: "First" }] } },
        },
        nestedRepeats: {
            entry: '<f-repeat value="{{group in groups}}"><f-repeat value="{{row in group.rows}}"><f-repeat value="{{cell in row.cells}}"><p>{{group.name}}/{{row.name}}/{{cell.name}}/{{$index}}/{{label}}</p></f-repeat></f-repeat></f-repeat>',
            templates: {},
            state: {
                label: "Root & fallback",
                groups: Array.from({ length: instances }, (_, group) => ({
                    name: `Group ${group}`,
                    rows: Array.from({ length: 3 }, (_, row) => ({
                        name: `Row ${row}`,
                        cells: Array.from({ length: 3 }, (_, cell) => ({
                            name: `Cell ${cell}`,
                        })),
                    })),
                })),
            },
        },
        repeated: fixture("repeat_custom_elements", instances),
        nested: {
            entry: "<bench-root></bench-root>".repeat(instances),
            templates: {
                "bench-root": '<bench-branch label="{{label}}"></bench-branch>',
                "bench-branch":
                    '<section><bench-leaf label="{{label}}"></bench-leaf></section>',
                "bench-leaf": "<p>{{label}}</p>",
            },
            state: { label: "Nested & escaped" },
        },
        largeState: fixture("large_state_overlay", instances, 1, 2000),
    };

    const results = {
        reportVersion: 3,
        executionTarget: "native-node-host",
        renderOptions,
        node: process.version,
        platform: process.platform + "/" + process.arch,
        samples,
        instances,
        iterations,
        warmupIterations,
        compilerLoadMs,
        workloadSetupMs: performance.now() - workloadStart,
        profileDirectory,
        addonBytes: (await fs.stat(addonPath)).size,
        wasmBytes: (
            await fs.stat(require.resolve("../../wasm/microsoft_fast_build_bg.wasm"))
        ).size,
        workloads: {},
    };
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fast-server-bench-"));
    try {
        for (const [name, input] of Object.entries(workloads)) {
            await fs.writeFile(path.join(directory, "input.json"), JSON.stringify(input));
            const start = performance.now();
            const artifact = compileServerArtifact(input.entry, input.templates);
            const compileMs = performance.now() - start;
            await fs.writeFile(path.join(directory, "server.json"), artifact);
            const record = { compileMs, artifactBytes: artifact.length, samples: [] };
            const expectedStateHash = hash(JSON.stringify(input.state));
            let expected;
            for (let sample = 0; sample < samples; sample++) {
                const profileName = name + "-" + (sample + 1) + ".cpuprofile";
                const processStart = performance.now();
                const response = execFileSync(
                    process.execPath,
                    [
                        "--expose-gc",
                        ...(profileDirectory
                            ? [
                                  "--cpu-prof",
                                  "--cpu-prof-dir=" + profileDirectory,
                                  "--cpu-prof-name=" + profileName,
                              ]
                            : []),
                        fileURLToPath(import.meta.url),
                        "--worker=native",
                        "--directory=" + directory,
                        "--iterations=" + iterations,
                        "--warmup=" + warmupIterations,
                        "--native-addon=" + addonPath,
                        ...(renderOptions.markersV2 ? ["--markers-v2"] : []),
                        "--attribute-name-strategy=" +
                            renderOptions.attributeNameStrategy,
                    ],
                    {
                        encoding: "utf8",
                        env: { ...process.env, NODE_DISABLE_COMPILE_CACHE: "1" },
                    },
                );
                const result = {
                    ...JSON.parse(response),
                    workerProcessMs: performance.now() - processStart,
                };
                assert.equal(result.stateJsonHash, expectedStateHash);
                expected ??= result.outputHash;
                assert.equal(result.outputHash, expected);
                if (profileDirectory) {
                    result.cpuProfile = path.join(profileDirectory, profileName);
                    await fs.stat(result.cpuProfile);
                }
                record.samples.push(result);
            }
            results.workloads[name] = record;
        }
        const output = JSON.stringify(results, null, 2) + "\n";
        if (args.output) await fs.writeFile(args.output, output, { flag: "wx" });
        else process.stdout.write(output);
    } finally {
        await fs.rm(directory, { recursive: true, force: true });
    }
}
