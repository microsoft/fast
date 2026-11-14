import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import * as fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { fixture, outputStats } from "./fixtures.mjs";

const require = createRequire(import.meta.url);
const { compileServerModule } = require("../../server.js");
const runtime = pathToFileURL(require.resolve("../../server-runtime.mjs")).href;
const baseline = JSON.parse(
    readFileSync(
        new URL(
            "../../../../crates/microsoft-fast-build/benches/fixtures/expected-baseline.json",
            import.meta.url,
        ),
        "utf8",
    ),
);

for (const record of baseline) {
    test(`${record.case}/${record.mode}/${record.count}`, async () => {
        const input = fixture(record.case, record.count, record.payload, record.rootKeys);
        const source = compileServerModule(input.entry, input.templates, runtime);
        const server = await import(
            `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
        );
        const html = server.renderEntry(input.state, { markersV2: record.mode === "v2" });
        const {
            case: _case,
            count: _count,
            mode: _mode,
            payload: _payload,
            rootKeys: _root,
            ...expected
        } = record;
        assert.deepEqual(outputStats(html), expected);
    });
}

const benchmark = fileURLToPath(new URL("./server-renderer.mjs", import.meta.url));

async function withBenchmarkDirectory(run) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fast-bench-test-"));
    try {
        await run(directory);
    } finally {
        await fs.rm(directory, { recursive: true, force: true });
    }
}

test("benchmark isolates import, first render and warm render timings", async () => {
    await withBenchmarkDirectory(async directory => {
        const text = "<b>caf\u00e9 \u{1f600}</b>";
        const stateJson = JSON.stringify({ text });
        const preload = path.join(directory, "clock.mjs");
        await fs.writeFile(
            preload,
            `import { performance } from "node:perf_hooks";
globalThis.benchmarkClock = 0;
Object.defineProperty(performance, "now", { value: () => globalThis.benchmarkClock });
const from = Buffer.from;
Buffer.from = function(value, ...args) {
    if (value === ${JSON.stringify(text)}) globalThis.benchmarkClock += 5;
    return from.call(this, value, ...args);
};
const parse = JSON.parse;
JSON.parse = function(value, ...args) {
    if (value === ${JSON.stringify(stateJson)}) globalThis.benchmarkClock += 3;
    return parse.call(this, value, ...args);
};
const stringify = JSON.stringify;
JSON.stringify = function(value, ...args) {
    if (value?.text === ${JSON.stringify(text)}) globalThis.benchmarkClock += 2;
    return stringify.call(this, value, ...args);
};
`,
        );
        await fs.writeFile(
            path.join(directory, "server.mjs"),
            `globalThis.benchmarkClock += 37;
let calls = 0;
export function renderEntry(state) {
    globalThis.benchmarkClock += ++calls === 1 ? 11 : 7;
    return state.text;
}
`,
        );
        await fs.writeFile(
            path.join(directory, "input.json"),
            JSON.stringify({ state: { text } }),
        );
        const result = JSON.parse(
            execFileSync(
                process.execPath,
                [
                    "--import",
                    pathToFileURL(preload).href,
                    benchmark,
                    "--worker=aot",
                    `--directory=${directory}`,
                    "--iterations=3",
                ],
                { encoding: "utf8" },
            ),
        );
        assert.equal(result.firstRenderMs, 11);
        assert.deepEqual(result.renderOptions, {
            markersV2: false,
            attributeNameStrategy: "camelCase",
        });
        assert.equal(result.moduleImportMs, 37);
        assert.equal(result.coldImportAndRenderMs, 48);
        assert.equal(result.warmupIterations, 20);
        assert.equal(result.warmupMs, 140);
        assert.equal(result.warmMsPerRender, 7);
        assert.equal(result.utf8EncodeMs, 5);
        assert.equal(result.warmUtf8MsPerRender, 12);
        assert.equal(result.stateSerializeMs, 2);
        assert.equal(result.stateJsonBytes, Buffer.byteLength(stateJson));
        assert.equal(result.warmJsonUtf8MsPerRender, 15);
        assert.equal(result.coldImportToUtf8Ms, 53);
        const bytes = await fs.readFile(path.join(directory, "rendered.html"));
        assert.deepEqual(bytes, Buffer.from(text));
        assert.equal(result.outputBytes, bytes.length);
        assert.equal(result.outputHash, createHash("sha256").update(bytes).digest("hex"));
        assert.equal(result.warmStringBytesPerSecond, (bytes.length * 1000) / 7);
        assert.equal(result.warmUtf8BytesPerSecond, (bytes.length * 1000) / 12);
        assert.equal(result.warmJsonUtf8BytesPerSecond, (bytes.length * 1000) / 15);
    });
});

test("reused preparation is included in cold delivery but not a fresh JSON request", async () => {
    await withBenchmarkDirectory(async directory => {
        const preload = path.join(directory, "clock.mjs");
        await fs.writeFile(
            preload,
            `import { performance } from "node:perf_hooks";
globalThis.benchmarkClock = 0;
Object.defineProperty(performance, "now", { value: () => globalThis.benchmarkClock });
`,
        );
        await fs.writeFile(path.join(directory, "input.json"), '{"state":{"text":"ok"}}');
        await fs.writeFile(
            path.join(directory, "server.mjs"),
            `globalThis.benchmarkClock += 37;
export function prepareState(state) { globalThis.benchmarkClock += 13; return state; }
export function renderEntryPrepared(state) { globalThis.benchmarkClock += 7; return state.text; }
export function renderEntry(state) { return state.text; }
`,
        );
        for (const mode of ["plain", "prepared", "prepare-per-render"]) {
            const result = JSON.parse(
                execFileSync(
                    process.execPath,
                    [
                        "--import",
                        pathToFileURL(preload).href,
                        benchmark,
                        "--worker=aot",
                        `--directory=${directory}`,
                        "--iterations=2",
                        `--state-mode=${mode}`,
                    ],
                    { encoding: "utf8" },
                ),
            );
            const reused = mode === "prepared";
            if (mode === "plain") {
                assert.equal(result.warmMsPerRender, 0);
                assert.equal(result.warmStringBytesPerSecond, null);
                assert.equal(result.warmUtf8BytesPerSecond, null);
                assert.equal(result.warmJsonUtf8BytesPerSecond, null);
                continue;
            }
            assert.equal(result.prepareStateMs, reused ? 13 : undefined);
            assert.equal(result.coldImportAndRenderMs, reused ? 44 : 57);
            assert.equal(result.coldImportToUtf8Ms, 57);
            assert.equal(result.warmMsPerRender, reused ? 7 : 20);
            assert.equal(result.warmUtf8MsPerRender, reused ? 7 : 20);
            assert.equal(result.warmJsonUtf8MsPerRender, reused ? undefined : 20);
            if (reused) {
                assert.equal(result.warmJsonUtf8BytesPerSecond, undefined);
            }
        }
    });
});

test("benchmark records and applies marker and attribute naming options", async () => {
    await withBenchmarkDirectory(async directory => {
        const input = {
            entry: '<bench-options aria-label="{{label}}"></bench-options>',
            templates: {
                "bench-options": '<p data-label="{{label}}">{{label}}</p>',
            },
            state: { label: "caf\u00e9 \u{1f600} &<>\"'" },
        };
        const source = compileServerModule(input.entry, input.templates, runtime);
        await fs.writeFile(path.join(directory, "input.json"), JSON.stringify(input));
        await fs.writeFile(path.join(directory, "server.mjs"), source);
        const server = await import(pathToFileURL(path.join(directory, "server.mjs")));
        for (const markersV2 of [false, true]) {
            const options = { markersV2, attributeNameStrategy: "none" };
            const expected = server.renderEntry(input.state, options);
            const result = JSON.parse(
                execFileSync(
                    process.execPath,
                    [
                        benchmark,
                        "--worker=aot",
                        `--directory=${directory}`,
                        "--iterations=2",
                        "--warmup=0",
                        "--attribute-name-strategy=none",
                        ...(markersV2 ? ["--markers-v2"] : []),
                    ],
                    { encoding: "utf8" },
                ),
            );
            assert.deepEqual(result.renderOptions, options);
            assert.equal(
                await fs.readFile(path.join(directory, "rendered.html"), "utf8"),
                expected,
            );
            assert.equal(result.outputHash, outputStats(expected).sha256);
            assert.equal(result.outputStructure.hosts, 1);
            assert.equal(result.outputStructure.dsdRoots, 1);
            assert.ok(result.outputStructure.bindings > 0);
            assert.ok(result.outputStructure.attributeMarkers > 0);
        }
    });
});

test("benchmark rejects output changes after the first render", async () => {
    await withBenchmarkDirectory(async directory => {
        await fs.writeFile(path.join(directory, "input.json"), '{"state":{}}');
        for (const [warmup, stableCalls, phase] of [
            [20, 1, "warmup"],
            [0, 1, "warm"],
            [0, 3, "warm UTF-8"],
            [0, 5, "warm JSON-to-UTF-8"],
            [2, 7, "JSON-to-UTF-8 warmup"],
        ]) {
            await fs.writeFile(
                path.join(directory, "server.mjs"),
                `let calls = 0;
export function renderEntry() { return ++calls <= ${stableCalls} ? "cold" : "changed"; }
`,
            );
            assert.throws(
                () =>
                    execFileSync(
                        process.execPath,
                        [
                            benchmark,
                            "--worker=aot",
                            `--directory=${directory}`,
                            `--warmup=${warmup}`,
                            "--iterations=2",
                        ],
                        { encoding: "utf8", stdio: "pipe" },
                    ),
                error => error.stderr.includes(`${phase} output differs`),
            );
        }
    });
});

test("benchmark reports build and delivery phases and creates optional CPU profiles", async () => {
    await withBenchmarkDirectory(async directory => {
        const result = JSON.parse(
            execFileSync(
                process.execPath,
                [
                    benchmark,
                    "--samples=2",
                    "--iterations=2",
                    "--instances=1",
                    "--warmup=0",
                    "--state-mode=all",
                    "--markers-v2",
                    "--attribute-name-strategy=none",
                    `--profile-directory=${path.join(directory, "profiles")}`,
                ],
                { encoding: "utf8" },
            ),
        );
        assert.equal(result.reportVersion, 2);
        assert.equal(result.executionTarget, "generated-javascript");
        assert.deepEqual(result.renderOptions, {
            markersV2: true,
            attributeNameStrategy: "none",
        });
        assert.equal(result.warmupIterations, 0);
        assert.ok(Number.isFinite(result.compilerLoadMs));
        for (const record of Object.values(result.workloads)) {
            assert.ok(Number.isFinite(record.inputWriteMs));
            assert.ok(Number.isFinite(record.compileMs));
            assert.ok(Number.isFinite(record.artifactWriteMs));
            const [first, second] = record.modes.aot;
            assert.equal(first.outputHash, second.outputHash);
            assert.deepEqual(Object.keys(record.modes), [
                "aot",
                "aotPrepared",
                "aotPreparePerRender",
            ]);
            for (const sample of Object.values(record.modes).flat()) {
                assert.equal(sample.outputHash, first.outputHash);
                if (sample.stateMode === "prepared") {
                    assert.ok(sample.prepareStateMs >= 0);
                    assert.ok(sample.memoryAfterPrepare.heapUsed > 0);
                    assert.equal(sample.warmJsonUtf8MsPerRender, undefined);
                } else {
                    assert.ok(sample.warmJsonUtf8MsPerRender >= 0);
                    assert.ok(sample.warmJsonUtf8CpuMsPerRender >= 0);
                }
                assert.equal(sample.stateJsonHash, first.stateJsonHash);
                assert.deepEqual(sample.outputStructure, first.outputStructure);
                assert.ok(sample.outputStructure.dsdRoots >= 0);
                for (const phase of [
                    "workerSetupMs",
                    "inputReadMs",
                    "inputParseMs",
                    "moduleImportMs",
                    "firstRenderMs",
                    "utf8EncodeMs",
                    "outputWriteMs",
                    "workerProcessMs",
                    "warmUtf8MsPerRender",
                    "warmUtf8CpuMsPerRender",
                    "stateSerializeMs",
                    "coldImportToUtf8Ms",
                ]) {
                    assert.ok(Number.isFinite(sample[phase]), `${phase} is missing`);
                    assert.ok(sample[phase] >= 0, `${phase} must be nonnegative`);
                }
                assert.equal(sample.warmupIterations, 0);
                const profile = JSON.parse(await fs.readFile(sample.cpuProfile, "utf8"));
                assert.ok(profile.nodes.length > 0, "CPU profile contains no samples");
            }
        }
    });
});
