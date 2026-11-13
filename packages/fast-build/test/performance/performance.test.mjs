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
        const preload = path.join(directory, "clock.mjs");
        await fs.writeFile(
            preload,
            `import { performance } from "node:perf_hooks";
globalThis.benchmarkClock = 0;
Object.defineProperty(performance, "now", { value: () => globalThis.benchmarkClock });
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
        assert.equal(result.moduleImportMs, 37);
        assert.equal(result.coldImportAndRenderMs, 48);
        assert.equal(result.warmupIterations, 20);
        assert.equal(result.warmupMs, 140);
        assert.equal(result.warmMsPerRender, 7);
        const bytes = await fs.readFile(path.join(directory, "rendered.html"));
        assert.deepEqual(bytes, Buffer.from(text));
        assert.equal(result.outputBytes, bytes.length);
        assert.equal(result.outputHash, createHash("sha256").update(bytes).digest("hex"));
    });
});

test("benchmark rejects output changes after the first render", async () => {
    await withBenchmarkDirectory(async directory => {
        await fs.writeFile(path.join(directory, "input.json"), '{"state":{}}');
        await fs.writeFile(
            path.join(directory, "server.mjs"),
            `let calls = 0;
export function renderEntry() { return ++calls === 1 ? "cold" : "changed"; }
`,
        );
        for (const warmup of [20, 0]) {
            assert.throws(
                () =>
                    execFileSync(
                        process.execPath,
                        [
                            benchmark,
                            "--worker=aot",
                            `--directory=${directory}`,
                            `--warmup=${warmup}`,
                        ],
                        { encoding: "utf8", stdio: "pipe" },
                    ),
                error =>
                    error.stderr.includes(
                        `${warmup === 0 ? "warm" : "warmup"} output differs`,
                    ),
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
                    `--profile-directory=${path.join(directory, "profiles")}`,
                ],
                { encoding: "utf8" },
            ),
        );
        assert.equal(result.reportVersion, 2);
        assert.equal(result.warmupIterations, 0);
        assert.ok(Number.isFinite(result.compilerLoadMs));
        for (const record of Object.values(result.workloads)) {
            assert.ok(Number.isFinite(record.inputWriteMs));
            assert.ok(Number.isFinite(record.compileMs));
            assert.ok(Number.isFinite(record.artifactWriteMs));
            const [first, second] = record.modes.aot;
            assert.equal(first.outputHash, second.outputHash);
            for (const sample of record.modes.aot) {
                for (const phase of [
                    "workerSetupMs",
                    "inputReadMs",
                    "inputParseMs",
                    "moduleImportMs",
                    "firstRenderMs",
                    "utf8EncodeMs",
                    "outputWriteMs",
                    "workerProcessMs",
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
