import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import * as fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadNativeHost } from "../../native-host.mjs";
import { fixture, outputStats } from "./fixtures.mjs";

const require = createRequire(import.meta.url);
const { compileServerArtifact } = require("../../server.js");
const Program = loadNativeHost(process.env.FAST_NATIVE_ADDON);
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
    test(record.case + "/" + record.mode + "/" + record.count, () => {
        const input = fixture(record.case, record.count, record.payload, record.rootKeys);
        const server = new Program(
            Buffer.from(compileServerArtifact(input.entry, input.templates)),
            { markersV2: record.mode === "v2" },
        );
        const html = server
            .renderEntryJson(Buffer.from(JSON.stringify(input.state)))
            .toString("utf8");
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
test("native benchmark isolates loading, rendering and optional string decoding", async t => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fast-native-bench-test-"));
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const text = "<b>caf\u00e9 \u{1f600}</b>";
    await fs.writeFile(path.join(directory, "server.artifact.json"), text);
    await fs.writeFile(
        path.join(directory, "input.json"),
        JSON.stringify({ state: { text } }),
    );
    const preload = path.join(directory, "clock.cjs");
    await fs.writeFile(
        preload,
        [
            'const { performance } = require("node:perf_hooks");',
            'const Module = require("node:module");',
            "globalThis.benchmarkClock = 0;",
            'Object.defineProperty(performance, "now", { value: () => globalThis.benchmarkClock });',
            "const load = Module._load;",
            "Module._load = function(request, ...args) {",
            '  if (!request.endsWith("/native-host.mjs")) return load.call(this, request, ...args);',
            "  return { loadNativeHost: () => class {",
            "    constructor(bytes) { globalThis.benchmarkClock += 37; this.bytes = bytes; this.calls = 0; }",
            "    renderEntryJson() { globalThis.benchmarkClock += ++this.calls === 1 ? 11 : 7; return this.bytes; }",
            "  } };",
            "};",
            "const decode = Buffer.prototype.toString;",
            "Buffer.prototype.toString = function(...args) {",
            "  const value = decode.apply(this, args);",
            "  if (value === " +
                JSON.stringify(text) +
                ") globalThis.benchmarkClock += 5;",
            "  return value;",
            "};",
        ].join("\n"),
    );
    for (const warmup of [0, 2]) {
        const result = JSON.parse(
            execFileSync(
                process.execPath,
                [
                    "--require",
                    preload,
                    benchmark,
                    "--worker=native",
                    "--directory=" + directory,
                    "--native-addon=mock",
                    "--iterations=3",
                    "--warmup=" + warmup,
                ],
                { encoding: "utf8" },
            ),
        );
        assert.equal(result.programLoadMs, 37);
        assert.equal(result.firstRenderMs, 11);
        assert.equal(result.coldLoadAndRenderMs, 48);
        assert.equal(result.outputDecodeMs, 5);
        assert.equal(result.warmupMs, warmup * 7);
        assert.equal(result.warmMsPerRender, 7);
        assert.equal(result.warmStringMsPerRender, 12);
        assert.equal(result.outputBytes, Buffer.byteLength(text));
        assert.equal(
            await fs.readFile(path.join(directory, "rendered.html"), "utf8"),
            text,
        );
    }
});

test("native benchmark rejects invalid measurement controls", () => {
    for (const argument of ["--iterations=0", "--warmup=-1", "--worker=unknown"]) {
        assert.throws(() =>
            execFileSync(
                process.execPath,
                [benchmark, "--worker=native", "--directory=unused", argument],
                { stdio: "pipe" },
            ),
        );
    }
});
