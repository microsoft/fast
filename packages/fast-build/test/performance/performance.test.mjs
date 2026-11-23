import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import * as fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadNativeHost } from "../../native-host.mjs";
import { fixture, outputStats, stateValidationFixture } from "./fixtures.mjs";

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
test("native benchmark preserves raw duplicate-key state and its identity", async t => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fast-state-bench-test-"));
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const output = path.join(directory, "report.json");
    execFileSync(
        process.execPath,
        [
            benchmark,
            "--native-addon=" + process.env.FAST_NATIVE_ADDON,
            "--instances=3",
            "--workloads=stateValidationDuplicate",
            "--samples=1",
            "--iterations=1",
            "--warmup=0",
            "--output=" + output,
        ],
        { encoding: "utf8", stdio: "pipe" },
    );
    const report = JSON.parse(await fs.readFile(output, "utf8"));
    const input = stateValidationFixture(3, "duplicate");
    const hash = value => createHash("sha256").update(value).digest("hex");
    const stateHash = report.workloads.stateValidationDuplicate.samples[0].stateJsonHash;
    assert.equal(stateHash, hash(input.stateJson));
    assert.notEqual(stateHash, hash(JSON.stringify(input.state)));
});

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
        const profiles = path.join(directory, "profiles");
        if (warmup) await fs.mkdir(profiles);
        const result = JSON.parse(
            execFileSync(
                process.execPath,
                [
                    "--expose-gc",
                    "--require",
                    preload,
                    benchmark,
                    "--worker=native",
                    "--directory=" + directory,
                    "--native-addon=mock",
                    "--iterations=3",
                    "--warmup=" + warmup,
                    ...(warmup
                        ? [
                              "--profile-directory=" + profiles,
                              "--profile-phase=all",
                              "--profile-duration-ms=3",
                          ]
                        : []),
                ],
                { encoding: "utf8", stdio: "pipe" },
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
        assert.deepEqual(
            result.profiles.map(profile => profile.phase),
            warmup ? ["load", "buffer", "string", "decode"] : [],
        );
        for (const profile of result.profiles) {
            assert.equal(profile.instrumented, true);
            assert.equal(profile.outputHash, result.outputHash);
            assert.ok(profile.iterations > 0);
            const cpu = JSON.parse(await fs.readFile(profile.cpuProfile, "utf8"));
            assert.ok(cpu.nodes.length > 0);
            assert.ok(cpu.endTime >= cpu.startTime);
        }
        assert.equal(
            await fs.readFile(path.join(directory, "rendered.html"), "utf8"),
            text,
        );
    }
    if (["darwin", "linux"].includes(process.platform)) {
        const profiles = path.join(directory, "missing-native-profiler");
        await fs.mkdir(profiles);
        assert.throws(
            () =>
                execFileSync(
                    process.execPath,
                    [
                        "--expose-gc",
                        "--require",
                        preload,
                        benchmark,
                        "--worker=native",
                        "--directory=" + directory,
                        "--native-addon=mock",
                        "--iterations=1",
                        "--warmup=0",
                        "--profile-directory=" + profiles,
                        "--profile-phase=buffer",
                        "--profile-duration-ms=3",
                        "--native-profiler=" +
                            (process.platform === "darwin" ? "sample" : "perf"),
                    ],
                    {
                        encoding: "utf8",
                        stdio: "pipe",
                        env: { ...process.env, PATH: "" },
                    },
                ),
            error => /ENOENT/.test(error.stderr),
            "Missing native profilers must fail, not silently produce a V8-only report",
        );
    }
});

test("native benchmark rejects invalid measurement controls", () => {
    for (const argument of [
        "--iterations=0",
        "--warmup=-1",
        "--worker=unknown",
        "--profile-phase=unknown",
        "--profile-duration-ms=0",
        "--profile-duration-ms=60001",
        "--native-profiler=unknown",
        "--native-profiler=sample",
    ]) {
        assert.throws(() =>
            execFileSync(
                process.execPath,
                [benchmark, "--worker=native", "--directory=unused", argument],
                { stdio: "pipe" },
            ),
        );
    }
});

test("native profiling selects workloads and retains verified phase profiles", async t => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fast-native-profiles-"));
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const output = path.join(directory, "report.json");
    execFileSync(
        process.execPath,
        [
            benchmark,
            "--native-addon=" + process.env.FAST_NATIVE_ADDON,
            "--workloads=static,largeStaticTemplates,shortCircuitConditions,literalProperties",
            "--samples=1",
            "--instances=2",
            "--iterations=2",
            "--warmup=1",
            "--profile-directory=" + directory,
            "--profile-phase=all",
            "--profile-duration-ms=3",
            "--output=" + output,
        ],
        { encoding: "utf8", timeout: 60_000 },
    );
    const report = JSON.parse(await fs.readFile(output, "utf8"));
    assert.deepEqual(Object.keys(report.workloads), [
        "static",
        "largeStaticTemplates",
        "shortCircuitConditions",
        "literalProperties",
    ]);
    assert.equal(report.profiling.phase, "all");
    assert.match(report.addonSha256, /^[a-f0-9]{64}$/);
    for (const workload of Object.values(report.workloads)) {
        assert.match(workload.artifactSha256, /^[a-f0-9]{64}$/);
        const [sample] = workload.samples;
        assert.deepEqual(
            sample.profiles.map(profile => profile.phase),
            ["load", "buffer", "string", "decode"],
        );
        for (const profile of sample.profiles) {
            assert.equal(profile.outputHash, sample.outputHash);
            const cpu = JSON.parse(await fs.readFile(profile.cpuProfile, "utf8"));
            assert.ok(cpu.nodes.length > 0);
        }
    }
    for (const workloads of ["unknown", "static,static", ""]) {
        assert.throws(
            () =>
                execFileSync(process.execPath, [benchmark, "--workloads=" + workloads], {
                    encoding: "utf8",
                    stdio: "pipe",
                }),
            error => /Unknown or duplicate workloads/.test(error.stderr),
        );
    }
});
