import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { PerformanceObserver, performance } from "node:perf_hooks";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { fixture } from "./fixtures.mjs";

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
        output: { type: "string" },
    },
});
const hash = text => createHash("sha256").update(text).digest("hex");
const integer = (name, minimum = 1) => {
    const value = Number(args[name]);
    assert.ok(
        Number.isSafeInteger(value) && value >= minimum,
        `${name} must be ${minimum === 0 ? "nonnegative" : "positive"}`,
    );
    return value;
};

if (args.worker) {
    await worker();
} else {
    await main();
}

async function worker() {
    const workerSetupMs = performance.now();
    assert.equal(args.worker, "aot", "Only the AOT backend is supported.");
    const readStart = performance.now();
    const input = await fs.readFile(path.join(args.directory, "input.json"), "utf8");
    const inputReadMs = performance.now() - readStart;
    const parseStart = performance.now();
    const source = JSON.parse(input);
    const inputParseMs = performance.now() - parseStart;
    const iterations = integer("iterations");
    const warmupIterations = integer("warmup", 0);
    const memoryBefore = process.memoryUsage();
    const importStart = performance.now();
    const module = await import(
        pathToFileURL(path.join(args.directory, "server.mjs")).href
    );
    const moduleImportMs = performance.now() - importStart;
    const render = () => module.renderEntry(source.state);
    const firstStart = performance.now();
    const html = render();
    const firstRenderMs = performance.now() - firstStart;
    const memoryAfterFirst = process.memoryUsage();
    const output = await writeOutput(html);
    let latest = html;
    const warmupStart = performance.now();
    for (let index = 0; index < warmupIterations; index++) {
        latest = render();
    }
    const warmupMs = performance.now() - warmupStart;
    assert.equal(latest, html, "warmup output differs from first render");
    globalThis.gc?.();
    const memoryWarm = process.memoryUsage();
    let gcCount = 0;
    let gcMs = 0;
    let warmStart;
    let warmEnd;
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
    for (let index = 0; index < iterations; index++) {
        latest = render();
    }
    warmEnd = performance.now();
    const warmMs = warmEnd - warmStart;
    const cpuUsed = process.cpuUsage(cpu);
    assert.equal(latest, html, "warm output differs from first render");
    await new Promise(resolve => setImmediate(resolve));
    await new Promise(resolve => setImmediate(resolve));
    observer.disconnect();
    const memoryAfterWarm = process.memoryUsage();
    globalThis.gc?.();
    const memoryRetained = process.memoryUsage();
    console.log(
        JSON.stringify({
            reportVersion: 2,
            workerSetupMs,
            inputReadMs,
            inputParseMs,
            moduleImportMs,
            firstRenderMs,
            coldImportAndRenderMs: moduleImportMs + firstRenderMs,
            warmupMs,
            warmupIterations,
            warmMsPerRender: warmMs / iterations,
            cpuMsPerRender: (cpuUsed.user + cpuUsed.system) / 1000 / iterations,
            iterations,
            gcCount,
            gcMs,
            memoryBefore,
            memoryAfterFirst,
            memoryWarm,
            memoryAfterWarm,
            memoryRetained,
            ...output,
        }),
    );
}

async function writeOutput(html) {
    const encodeStart = performance.now();
    const bytes = Buffer.from(html, "utf8");
    const utf8EncodeMs = performance.now() - encodeStart;
    const writeStart = performance.now();
    await fs.writeFile(path.join(args.directory, "rendered.html"), bytes);
    const outputWriteMs = performance.now() - writeStart;
    return {
        utf8EncodeMs,
        outputWriteMs,
        outputBytes: bytes.length,
        outputHash: hash(bytes),
    };
}

async function main() {
    const samples = integer("samples");
    const instances = integer("instances");
    const iterations = integer("iterations");
    const warmupIterations = integer("warmup", 0);
    let profileDirectory;
    if (args["profile-directory"]) {
        const root = path.resolve(args["profile-directory"]);
        await fs.mkdir(root, { recursive: true });
        profileDirectory = await fs.mkdtemp(path.join(root, "fast-server-profile-"));
    }
    const compilerStart = performance.now();
    const { compileServerModule } = require("../../server.js");
    require("../../wasm/microsoft_fast_build.js");
    const compilerLoadMs = performance.now() - compilerStart;
    const runtime = pathToFileURL(require.resolve("../../server-runtime.mjs")).href;
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
        reportVersion: 2,
        node: process.version,
        platform: `${process.platform}/${process.arch}`,
        samples,
        instances,
        iterations,
        warmupIterations,
        compilerLoadMs,
        workloadSetupMs: performance.now() - workloadStart,
        profileDirectory,
        runtimeBytes: (await fs.stat(require.resolve("../../server-runtime.mjs"))).size,
        wasmBytes: (
            await fs.stat(require.resolve("../../wasm/microsoft_fast_build_bg.wasm"))
        ).size,
        workloads: {},
    };
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fast-server-bench-"));
    try {
        for (const [name, input] of Object.entries(workloads)) {
            const inputStart = performance.now();
            await fs.writeFile(path.join(directory, "input.json"), JSON.stringify(input));
            const inputWriteMs = performance.now() - inputStart;
            const compileStart = performance.now();
            const source = compileServerModule(input.entry, input.templates, runtime);
            const compileMs = performance.now() - compileStart;
            const writeStart = performance.now();
            await fs.writeFile(path.join(directory, "server.mjs"), source);
            const artifactWriteMs = performance.now() - writeStart;
            const record = {
                inputWriteMs,
                compileMs,
                artifactWriteMs,
                generatedBytes: Buffer.byteLength(source),
                modes: { aot: [] },
            };
            let expected;
            for (let sample = 0; sample < samples; sample++) {
                const profileName = `${name}-${sample + 1}.cpuprofile`;
                const processStart = performance.now();
                const response = execFileSync(
                    process.execPath,
                    [
                        "--expose-gc",
                        ...(profileDirectory
                            ? [
                                  "--cpu-prof",
                                  `--cpu-prof-dir=${profileDirectory}`,
                                  `--cpu-prof-name=${profileName}`,
                              ]
                            : []),
                        fileURLToPath(import.meta.url),
                        "--worker=aot",
                        `--directory=${directory}`,
                        `--iterations=${iterations}`,
                        `--warmup=${warmupIterations}`,
                    ],
                    {
                        encoding: "utf8",
                        env: { ...process.env, NODE_DISABLE_COMPILE_CACHE: "1" },
                    },
                );
                const workerProcessMs = performance.now() - processStart;
                const result = { ...JSON.parse(response), workerProcessMs };
                if (profileDirectory) {
                    result.cpuProfile = path.join(profileDirectory, profileName);
                    await fs.stat(result.cpuProfile);
                }
                expected ??= result.outputHash;
                assert.equal(result.outputHash, expected, `${name}/aot output differs`);
                record.modes.aot.push(result);
            }
            results.workloads[name] = record;
        }
        const output = `${JSON.stringify(results, null, 2)}\n`;
        if (args.output) {
            await fs.writeFile(args.output, output, { flag: "wx" });
        } else {
            process.stdout.write(output);
        }
    } finally {
        await fs.rm(directory, { recursive: true, force: true });
    }
}
