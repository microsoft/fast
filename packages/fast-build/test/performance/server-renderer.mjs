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
    const source = JSON.parse(
        await fs.readFile(path.join(args.directory, "input.json"), "utf8"),
    );
    const iterations = integer("iterations");
    const memoryBefore = process.memoryUsage();
    const start = performance.now();
    let render;
    let wasm;
    let program;
    if (args.worker === "aot") {
        const module = await import(
            pathToFileURL(path.join(args.directory, "server.mjs")).href
        );
        render = () => module.renderEntry(source.state);
    } else {
        wasm = require("../../wasm/microsoft_fast_build.js");
        if (args.worker === "prepared") {
            const pieces = JSON.parse(
                await fs.readFile(path.join(args.directory, "pieces.json"), "utf8"),
            );
            const entry = wasm.PreparedPiece.load(Buffer.from(pieces.entry, "base64"));
            program = new wasm.PreparedProgram(entry);
            entry.free();
            for (const [name, bytes] of Object.entries(pieces.templates)) {
                const piece = wasm.PreparedPiece.load(Buffer.from(bytes, "base64"));
                program.add_template(name, piece);
                piece.free();
            }
            render = () => program.render(JSON.stringify(source.state), "", false, false);
        } else {
            const templates = JSON.stringify(source.templates);
            render = () =>
                wasm.render_entry_with_templates(
                    source.entry,
                    templates,
                    JSON.stringify(source.state),
                );
        }
    }
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
    const wasmLinearBytes = wasm?.__wasm?.memory?.buffer.byteLength ?? null;
    program?.free();
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
            wasmLinearBytes,
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
    const wasm = require("../../wasm/microsoft_fast_build.js");
    const { compileServerModule } = require("../../server.js");
    const runtime = pathToFileURL(require.resolve("../../server-runtime.mjs")).href;
    const workloads = {
        static: {
            entry: "<bench-static></bench-static>".repeat(instances),
            templates: { "bench-static": "<h2>Static</h2><p>No bindings</p>" },
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
            const compiler = new wasm.PreparedCompiler(
                JSON.stringify(Object.keys(input.templates)),
            );
            const entry = compiler.compile(JSON.stringify(input.entry));
            const pieces = {
                entry: Buffer.from(entry.serialize()).toString("base64"),
                templates: {},
            };
            entry.free();
            for (const [name, template] of Object.entries(input.templates)) {
                const piece = compiler.compile(JSON.stringify(template));
                pieces.templates[name] = Buffer.from(piece.serialize()).toString(
                    "base64",
                );
                piece.free();
            }
            compiler.free();
            await fs.writeFile(
                path.join(directory, "pieces.json"),
                JSON.stringify(pieces),
            );
            const record = {
                generatedBytes: Buffer.byteLength(source),
                preparedBytes: Buffer.byteLength(JSON.stringify(pieces)),
                modes: { aot: [], direct: [], prepared: [] },
            };
            let expected;
            for (let sample = 0; sample < samples; sample++) {
                const modes = ["aot", "direct", "prepared"];
                // Rotate order to avoid consistently favoring one backend.
                for (let offset = 0; offset < modes.length; offset++) {
                    const mode = modes[(sample + offset) % modes.length];
                    const result = JSON.parse(
                        execFileSync(
                            process.execPath,
                            [
                                "--expose-gc",
                                fileURLToPath(import.meta.url),
                                `--worker=${mode}`,
                                `--directory=${directory}`,
                                `--iterations=${args.iterations}`,
                            ],
                            { encoding: "utf8" },
                        ),
                    );
                    expected ??= result.outputHash;
                    assert.equal(
                        result.outputHash,
                        expected,
                        `${name}/${mode} output differs`,
                    );
                    record.modes[mode].push(result);
                }
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
