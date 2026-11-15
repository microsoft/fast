import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const require = createRequire(import.meta.url);
const { values: args } = parseArgs({
    options: {
        definitions: { type: "string", default: "200" },
        entries: { type: "string", default: "10" },
        spans: { type: "string", default: "8" },
        samples: { type: "string", default: "5" },
        iterations: { type: "string", default: "100" },
        warmup: { type: "string", default: "20" },
        measure: { type: "boolean", default: false },
        order: { type: "string", default: "single-first" },
        worker: { type: "string" },
    },
});
const integer = name => {
    const value = Number(args[name]);
    assert.ok(Number.isSafeInteger(value) && value > 0, `Invalid ${name}`);
    return value;
};
const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = pathToFileURL(require.resolve("../../server-runtime.mjs")).href;
assert.ok(["single-first", "modular-first"].includes(args.order), "Invalid pair order.");

if (args.worker) {
    const iterations = integer("iterations");
    const warmup = integer("warmup");
    const request = JSON.parse(fs.readFileSync(path.join(args.worker, "request.json")));
    const start = performance.now();
    const modules = [];
    for (const entry of request.entries) {
        modules.push(await import(pathToFileURL(path.join(args.worker, entry)).href));
    }
    const importMs = performance.now() - start;
    const first = performance.now();
    const outputs = modules.map(module => module.renderEntry(request.state));
    const firstRenderMs = performance.now() - first;
    assert.deepEqual(outputs, request.expected);
    const encode = performance.now();
    const buffers = outputs.map(output => Buffer.from(output));
    const firstUtf8EncodeMs = performance.now() - encode;
    for (let i = 0; i < warmup; i++) {
        for (const module of modules) module.renderEntry(request.state);
    }
    let renderedBytes = 0;
    const warm = performance.now();
    for (let i = 0; i < iterations; i++) {
        for (const module of modules)
            renderedBytes += module.renderEntry(request.state).length;
    }
    const warmBatchMs = (performance.now() - warm) / iterations;
    assert.equal(
        renderedBytes,
        outputs.reduce((total, output) => total + output.length, 0) * iterations,
    );
    console.log(
        JSON.stringify({
            importMs,
            firstRenderMs,
            importAndFirstRenderMs: importMs + firstRenderMs,
            firstUtf8EncodeMs,
            importRenderToUtf8Ms: importMs + firstRenderMs + firstUtf8EncodeMs,
            warmBatchMs,
            outputBytes: buffers.reduce((bytes, output) => bytes + output.length, 0),
            memory: process.memoryUsage(),
        }),
    );
} else {
    const {
        compileServerAssets,
        compileServerModule,
        writeServerAssets,
        writeServerModule,
    } = require("../../server.js");
    const definitions = integer("definitions");
    const entryCount = integer("entries");
    const templates = Object.fromEntries(
        Array.from({ length: definitions }, (_, index) => [
            `bench-card-${index}`,
            `<h2>${index}:{{title}}</h2>${"<span>static</span>".repeat(integer("spans"))}`,
        ]),
    );
    const entries = Array.from(
        { length: entryCount },
        (_, index) =>
            `<main data-entry="${index}">${Object.keys(templates)
                .map(name => `<${name}></${name}>`)
                .join("")}</main>`,
    );
    const state = { title: "Request & é" };
    const single = {};
    const modular = {};
    const timer = action => {
        if (!args.measure) return [action(), null];
        const start = performance.now();
        const result = action();
        return [result, performance.now() - start];
    };
    const compile = { singleMs: [], modularMs: [] };
    const [, compilerLoadMs] = timer(() => require("../../wasm/microsoft_fast_build.js"));
    for (const [index, entry] of entries.entries()) {
        let singleResult;
        let modularResult;
        const singleCompile = () => {
            singleResult = timer(() => compileServerModule(entry, templates, runtime));
        };
        const modularCompile = () => {
            modularResult = timer(() => compileServerAssets(entry, templates, runtime));
        };
        if (args.order === "single-first") {
            singleCompile();
            modularCompile();
        } else {
            modularCompile();
            singleCompile();
        }
        const [source, singleMs] = singleResult;
        const [assets, modularMs] = modularResult;
        if (args.measure) {
            compile.singleMs.push(singleMs);
            compile.modularMs.push(modularMs);
        }
        single[`entry-${index}.mjs`] = source;
        for (const [name, source] of Object.entries(assets.files)) {
            if (name.startsWith("component-")) {
                if (Object.hasOwn(modular, name)) assert.equal(modular[name], source);
                modular[name] = source;
            } else if (name === "entry.plan.mjs") {
                modular[`entry-${index}.plan.mjs`] = source;
            } else if (name === "server.mjs") {
                modular[`entry-${index}.mjs`] = source.replace(
                    "./entry.plan.mjs",
                    `./entry-${index}.plan.mjs`,
                );
            } else {
                const manifest = JSON.parse(source);
                manifest.entry = `entry-${index}.mjs`;
                manifest.entryPlan = `entry-${index}.plan.mjs`;
                manifest.dependencies[manifest.entryPlan] =
                    manifest.dependencies["entry.plan.mjs"];
                delete manifest.dependencies["entry.plan.mjs"];
                modular[`entry-${index}.manifest.json`] = `${JSON.stringify(manifest)}\n`;
            }
        }
    }
    const before = compileServerAssets(entries[0], templates, runtime);
    const after = compileServerAssets(
        entries[0],
        { ...templates, "aaa-unrelated": "<p>new</p>" },
        runtime,
    );
    const changed = Object.keys(before.files).filter(
        name => before.files[name] !== after.files[name],
    );
    assert.deepEqual(changed.sort(), ["server.manifest.json", "server.mjs"]);
    const bytes = files =>
        Object.values(files).reduce(
            (total, source) => total + Buffer.byteLength(source),
            0,
        );
    const report = {
        measured: args.measure,
        pairOrder: args.order,
        compilerLoadMs: args.measure ? compilerLoadMs : undefined,
        node: process.version,
        definitions,
        entries: entryCount,
        spansPerDefinition: integer("spans"),
        singleBytes: bytes(single),
        sharedModularBytes: bytes(modular),
        singleModuleCount: Object.keys(single).length,
        sharedModularModuleCount: Object.keys(modular).filter(name =>
            name.endsWith(".mjs"),
        ).length,
        unrelatedRegistryChangedFiles: changed,
        componentBytes: bytes(
            Object.fromEntries(
                Object.entries(modular).filter(([name]) => name.startsWith("component-")),
            ),
        ),
        compile: args.measure ? compile : undefined,
        samples: { single: [], modular: [] },
        note: "Shared component source/ESM parsing, not shared prepared execution closures. Each warm batch renders all entries; no state conversion or UTF-8 encoding is included.",
    };
    if (args.measure) {
        const directory = fs.mkdtempSync(path.join(here, ".modular-assets-bench-"));
        try {
            const expected = [];
            for (const source of Object.values(single)) {
                const module = await import(
                    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
                );
                expected.push(module.renderEntry(state));
            }
            for (const [layout, files] of Object.entries({ single, modular })) {
                const target = path.join(directory, layout);
                fs.mkdirSync(target);
                for (const [name, source] of Object.entries(files))
                    fs.writeFileSync(path.join(target, name), source);
                fs.writeFileSync(
                    path.join(target, "request.json"),
                    JSON.stringify({
                        entries: entries.map((_, index) => `entry-${index}.mjs`),
                        state,
                        expected,
                    }),
                );
            }
            for (let sample = 0; sample < integer("samples"); sample++) {
                for (const layout of sample % 2
                    ? ["modular", "single"]
                    : ["single", "modular"]) {
                    report.samples[layout].push(
                        JSON.parse(
                            execFileSync(
                                process.execPath,
                                [
                                    fileURLToPath(import.meta.url),
                                    `--worker=${path.join(directory, layout)}`,
                                    `--iterations=${integer("iterations")}`,
                                    `--warmup=${integer("warmup")}`,
                                ],
                                { encoding: "utf8" },
                            ),
                        ),
                    );
                }
            }
            report.managedReuseMs = {};
            report.managedDiskBytes = {};
            for (const [layout, writer] of Object.entries({
                single: writeServerModule,
                modular: writeServerAssets,
            })) {
                const managed = path.join(directory, `managed-${layout}`);
                const target =
                    layout === "single" ? path.join(managed, "server.mjs") : managed;
                const input = { entry: entries[0], templates };
                const options = { runtimeImport: runtime };
                writer(target, input, options);
                let reused = 0;
                const start = performance.now();
                for (let i = 0; i < integer("iterations"); i++) {
                    if (writer(target, input, options).reused) reused++;
                }
                report.managedReuseMs[layout] =
                    (performance.now() - start) / integer("iterations");
                assert.equal(reused, integer("iterations"));
                report.managedDiskBytes[layout] = fs
                    .readdirSync(managed)
                    .reduce(
                        (total, name) =>
                            total + fs.statSync(path.join(managed, name)).size,
                        0,
                    );
            }
        } finally {
            fs.rmSync(directory, { recursive: true, force: true });
        }
    }
    console.log(JSON.stringify(report, null, 4));
}
