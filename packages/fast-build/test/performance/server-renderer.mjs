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
        output: { type: "string" },
    },
});
const hash = text => createHash("sha256").update(text).digest("hex");
const integer = name => {
    const value = Number(args[name]);
    assert.ok(Number.isSafeInteger(value) && value > 0, `${name} must be positive`);
    return value;
};

if (args.worker) {
    await worker();
} else {
    await main();
}

async function worker() {
    assert.equal(args.worker, "aot", "Only the AOT backend is supported.");
    const source = JSON.parse(
        await fs.readFile(path.join(args.directory, "input.json"), "utf8"),
    );
    const iterations = integer("iterations");
    const memoryBefore = process.memoryUsage();
    const start = performance.now();
    const module = await import(
        pathToFileURL(path.join(args.directory, "server.mjs")).href
    );
    const render = () => module.renderEntry(source.state);
    const html = render();
    const firstRenderMs = performance.now() - start;
    const memoryAfterFirst = process.memoryUsage();
    for (let index = 0; index < 20; index++) {
        render();
    }
    globalThis.gc?.();
    const memoryWarm = process.memoryUsage();
    let gcCount = 0;
    let gcMs = 0;
    const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
            gcCount++;
            gcMs += entry.duration;
        }
    });
    observer.observe({ entryTypes: ["gc"] });
    const cpu = process.cpuUsage();
    const warmStart = performance.now();
    for (let index = 0; index < iterations; index++) {
        render();
    }
    const warmMs = performance.now() - warmStart;
    const cpuUsed = process.cpuUsage(cpu);
    await new Promise(resolve => setImmediate(resolve));
    await new Promise(resolve => setImmediate(resolve));
    observer.disconnect();
    const memoryAfterWarm = process.memoryUsage();
    globalThis.gc?.();
    const memoryRetained = process.memoryUsage();
    console.log(
        JSON.stringify({
            firstRenderMs,
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
            outputBytes: Buffer.byteLength(html),
            outputHash: hash(html),
        }),
    );
}

async function main() {
    const samples = integer("samples");
    const instances = integer("instances");
    integer("iterations");
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fast-server-bench-"));
    const { compileServerModule } = require("../../server.js");
    const runtime = pathToFileURL(require.resolve("../../server-runtime.mjs")).href;
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
        node: process.version,
        platform: `${process.platform}/${process.arch}`,
        samples,
        instances,
        runtimeBytes: (await fs.stat(require.resolve("../../server-runtime.mjs"))).size,
        wasmBytes: (
            await fs.stat(require.resolve("../../wasm/microsoft_fast_build_bg.wasm"))
        ).size,
        workloads: {},
    };
    try {
        for (const [name, input] of Object.entries(workloads)) {
            await fs.writeFile(path.join(directory, "input.json"), JSON.stringify(input));
            const source = compileServerModule(input.entry, input.templates, runtime);
            await fs.writeFile(path.join(directory, "server.mjs"), source);
            const record = {
                generatedBytes: Buffer.byteLength(source),
                modes: { aot: [] },
            };
            let expected;
            for (let sample = 0; sample < samples; sample++) {
                const result = JSON.parse(
                    execFileSync(
                        process.execPath,
                        [
                            "--expose-gc",
                            fileURLToPath(import.meta.url),
                            "--worker=aot",
                            `--directory=${directory}`,
                            `--iterations=${args.iterations}`,
                        ],
                        { encoding: "utf8" },
                    ),
                );
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
