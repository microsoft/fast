import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
    lifecycleManifest,
    lifecycleOptions,
    measureLifecycle,
    readLifecycleInputs,
} from "./native-lifecycle.mjs";
import { prepareLifecycle } from "./prepare-native-lifecycle.mjs";

const root = path.relative(process.cwd(), path.dirname(fileURLToPath(import.meta.url)));
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const fixture = () => ({
    artifact: Buffer.from("artifact"),
    requests: ["caf\u00e9 \u{1f600}", "second & changed"].map(text => ({
        state: Buffer.from(JSON.stringify({ text })),
        expected: Buffer.from(text),
        expectedString: text,
    })),
    renderOptions: { markersV2: false },
});

for (const mode of ["buffer", "string"]) {
    for (const warmup of [0, 2]) {
        test(`${mode} lifecycle isolates timers and reuses one handle (warmup ${warmup})`, async () => {
            const input = fixture();
            let clock = 0;
            let constructions = 0;
            let verifications = 0;
            const states = [];
            const handles = new Set();
            class Program {
                constructor(artifact, options) {
                    constructions++;
                    clock += 37;
                    assert.equal(artifact, input.artifact);
                    assert.equal(options, input.renderOptions);
                }
                renderEntryJson(state) {
                    handles.add(this);
                    states.push(state);
                    clock +=
                        states.length === 1
                            ? 11
                            : state === input.requests[0].state
                              ? 7
                              : 13;
                    const bytes = Buffer.from(
                        input.requests.find(request => request.state === state).expected,
                    );
                    const decode = bytes.toString.bind(bytes);
                    bytes.toString = (...args) => {
                        clock += 5;
                        return decode(...args);
                    };
                    return bytes;
                }
            }
            const result = await measureLifecycle(
                { ...input, mode, iterations: 3, warmup },
                {
                    now: () => clock,
                    loadHost: async () => {
                        clock += 19;
                        return Program;
                    },
                    verify: (output, request, boundary) => {
                        assert.equal(boundary, mode);
                        if (boundary === "buffer") {
                            assert.ok(Buffer.isBuffer(output));
                            assert.equal(Buffer.compare(output, request.expected), 0);
                        } else {
                            assert.equal(output, request.expectedString);
                        }
                        verifications++;
                        clock += 1000;
                    },
                },
            );
            const decode = mode === "string" ? 5 : 0;
            assert.equal(result.hostImportMs, 19);
            assert.equal(result.programLoadMs, 37);
            assert.equal(result.firstRenderMs, 11 + decode);
            assert.equal(result.warmupMs, warmup * (20 + decode * 2));
            assert.equal(result.warmTotalMs, 3 * (20 + decode * 2));
            assert.equal(result.warmMsPerRequest, 10 + decode);
            const total = 1 + 2 * (1 + warmup + 3);
            assert.deepEqual(result.counts, {
                programConstructions: 1,
                firstRender: 1,
                verificationRequests: 2,
                warmupRequests: warmup * 2,
                measuredRequests: 6,
                totalRequests: total,
                handleReuses: total - 1,
            });
            assert.equal(constructions, 1);
            assert.equal(handles.size, 1);
            assert.equal(verifications, total);
            assert.equal(states[0], input.requests[0].state);
            assert.deepEqual(
                states.slice(1),
                Array.from({ length: 1 + warmup + 3 }, () =>
                    input.requests.map(request => request.state),
                ).flat(),
            );
        });
    }

    test(`${mode} checks intermediate measured outputs, not only the final request`, async () => {
        const input = fixture();
        let calls = 0;
        class Program {
            renderEntryJson(state) {
                calls++;
                if (calls === 4) return Buffer.from("wrong intermediate output");
                return input.requests.find(request => request.state === state).expected;
            }
        }
        await assert.rejects(
            measureLifecycle(
                { ...input, mode, iterations: 2, warmup: 0 },
                { loadHost: async () => Program },
            ),
            /differ/,
        );
        assert.equal(calls, 5);
    });
}

test("lifecycle reads original state bytes and excludes hashing/decoding from I/O timers", async () => {
    const raw = Buffer.from('{"text":"first","text":"caf\u00e9"}');
    const fixturePath = name => path.resolve("fixture", name);
    const files = new Map([
        [fixturePath("program.json"), Buffer.from("artifact")],
        [fixturePath("first.json"), raw],
        [fixturePath("second.json"), Buffer.from('{"text":"second"}')],
        [fixturePath("first.html"), Buffer.from("caf\u00e9")],
        [fixturePath("second.html"), Buffer.from("second")],
    ]);
    const manifest = lifecycleManifest(
        {
            version: 1,
            artifact: "program.json",
            requests: [
                { state: "first.json", expected: "first.html" },
                { state: "second.json", expected: "second.html" },
            ],
        },
        fixturePath("manifest.json"),
    );
    let clock = 0;
    const read = () =>
        readLifecycleInputs(manifest, {
            now: () => clock,
            readFile: async file => {
                clock += 3;
                assert.ok(files.has(file), `Unexpected fixture path: ${file}`);
                return files.get(file);
            },
        });
    const result = await read();
    assert.equal(result.artifactReadMs, 3);
    assert.equal(result.inputReadMs, 12);
    assert.equal(result.requests[0].state, raw);
    assert.equal(result.identities.requests[0].state.sha256, hash(raw));
    assert.notEqual(
        result.identities.requests[0].state.sha256,
        hash(JSON.stringify(JSON.parse(raw.toString("utf8")))),
    );
    files.set(fixturePath("second.json"), Buffer.from(raw));
    await assert.rejects(read(), /byte-distinct/);
    files.set(fixturePath("second.json"), Buffer.from("{}"));
    files.set(fixturePath("first.html"), Buffer.from([0xff]));
    await assert.rejects(read(), /exact UTF-8/);
});

test("lifecycle options and manifests reject malformed controls before native loading", () => {
    for (const argument of [
        "--samples=0",
        "--samples=-1",
        "--iterations=0",
        "--iterations=1.5",
        "--iterations=1e2",
        "--iterations=9007199254740992",
        "--warmup=-1",
        "--warmup=",
        "--worker=unknown",
        "--native-addon=",
        "--output=",
        "--unknown=1",
        "positional",
    ]) {
        assert.throws(() => lifecycleOptions(["--manifest=manifest.json", argument]));
    }
    assert.throws(() => lifecycleOptions([]));
    assert.throws(() => lifecycleOptions(["--manifest=one", "--manifest=two"]));
    assert.throws(() =>
        lifecycleOptions(["--manifest=one", "--worker=buffer", "--output=report.json"]),
    );
    const valid = {
        version: 1,
        artifact: "program.json",
        requests: [
            { state: "a.json", expected: "a.html" },
            { state: "b.json", expected: "b.html" },
        ],
    };
    for (const invalid of [
        null,
        [],
        { ...valid, version: 2 },
        { ...valid, extra: true },
        { ...valid, artifact: "" },
        { ...valid, requests: [] },
        { ...valid, requests: [valid.requests[0]] },
        { ...valid, requests: [{ state: "a" }, { state: "b", expected: "b" }] },
        { ...valid, renderOptions: null },
        { ...valid, renderOptions: { markersV2: "false" } },
        { ...valid, renderOptions: { attributeNameStrategy: "invalid" } },
        { ...valid, renderOptions: { maxSteps: 0 } },
        { ...valid, renderOptions: { maxOutputBytes: -1 } },
        { ...valid, renderOptions: { dsd: [true] } },
        { ...valid, renderOptions: { unknown: true } },
    ]) {
        assert.throws(() => lifecycleManifest(invalid, "/fixture/manifest.json"));
    }
});

test("preparation separates reading, decoding, compiler import, compilation and writing", async () => {
    let clock = 0;
    const writes = [];
    const result = await prepareLifecycle(
        ["--entry=entry.html", "--templates=templates.json", "--artifact=program.json"],
        {
            now: () => clock,
            readFile: async file => {
                clock += 3;
                return Buffer.from(file.endsWith("entry.html") ? "<p>text</p>" : "{}");
            },
            loadCompiler: async () => {
                clock += 19;
                return {
                    compileServerArtifact(entry, templates) {
                        assert.equal(entry, "<p>text</p>");
                        assert.deepEqual(templates, {});
                        clock += 37;
                        return new Uint8Array([1, 2, 3]);
                    },
                };
            },
            writeFile: async (...args) => {
                clock += 7;
                writes.push(args);
            },
        },
    );
    assert.equal(result.sourceReadMs, 6);
    assert.equal(result.sourceDecodeMs, 0);
    assert.equal(result.compilerImportMs, 19);
    assert.equal(result.compileMs, 37);
    assert.equal(result.artifactWriteMs, 7);
    assert.equal(writes.length, 1);
    assert.deepEqual(writes[0][1], Buffer.from([1, 2, 3]));
    assert.deepEqual(writes[0][2], { flag: "wx" });
    for (const argv of [
        [],
        ["--entry=entry.html", "--templates=templates.json", "--artifact="],
        ["--entry=a", "--entry=b", "--templates=c", "--artifact=d"],
        ["--entry=a", "--templates=c", "--artifact=d", "--output=a"],
    ]) {
        await assert.rejects(prepareLifecycle(argv));
    }
});

test("native lifecycle CLI compiles separately and verifies changing requests in isolated workers", async t => {
    const directory = path.join(root, `.lifecycle-test-${process.pid}-${randomUUID()}`);
    await fs.mkdir(directory);
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const entry = path.join(directory, "entry.html");
    const templates = path.join(directory, "templates.json");
    const artifact = path.join(directory, "program.json");
    const preparationOutput = path.join(directory, "preparation.json");
    await fs.writeFile(entry, "<p>{{text}}</p>");
    await fs.writeFile(templates, "{}");
    const preparation = JSON.parse(
        execFileSync(
            process.execPath,
            [
                path.join(root, "prepare-native-lifecycle.mjs"),
                "--entry=" + entry,
                "--templates=" + templates,
                "--artifact=" + artifact,
                "--output=" + preparationOutput,
            ],
            { encoding: "utf8", stdio: "pipe" },
        ),
    );
    assert.deepEqual(
        preparation,
        JSON.parse(await fs.readFile(preparationOutput, "utf8")),
    );
    assert.equal(
        preparation.identities.artifact.sha256,
        hash(await fs.readFile(artifact)),
    );
    const state = '{"text":"ignored","text":"caf\u00e9 \u{1f600} &<>"}';
    await fs.writeFile(path.join(directory, "a.json"), state);
    await fs.writeFile(
        path.join(directory, "a.html"),
        "<p>caf\u00e9 \u{1f600} &amp;&lt;&gt;</p>",
    );
    await fs.writeFile(path.join(directory, "b.json"), '{"text":"Changed"}');
    await fs.writeFile(path.join(directory, "b.html"), "<p>Changed</p>");
    const manifest = path.join(directory, "manifest.json");
    await fs.writeFile(
        manifest,
        JSON.stringify({
            version: 1,
            artifact: "program.json",
            requests: [
                { state: "a.json", expected: "a.html" },
                { state: "b.json", expected: "b.html" },
            ],
        }),
    );
    const guard = path.join(directory, "no-compiler.cjs");
    await fs.writeFile(
        guard,
        [
            'const Module = require("node:module");',
            "const load = Module._load;",
            "Module._load = function(specifier, ...args) {",
            "  if (/(?:server\\.js|microsoft_fast_build(?:\\.js|_bg\\.wasm))$/.test(specifier)) {",
            '    throw new Error("Runtime must not load a source compiler");',
            "  }",
            "  return load.call(this, specifier, ...args);",
            "};",
        ].join("\n"),
    );
    const output = path.join(directory, "report.json");
    const command = [
        path.join(root, "native-lifecycle.mjs"),
        "--manifest=" + manifest,
        "--native-addon=" +
            path.resolve(
                process.env.FAST_NATIVE_ADDON ??
                    fileURLToPath(
                        new URL(
                            "../../../../crates/microsoft-fast-build/target/node-host/fast-build.node",
                            import.meta.url,
                        ),
                    ),
            ),
        "--samples=2",
        "--iterations=2",
        "--warmup=2",
        "--output=" + output,
    ];
    const env = {
        ...process.env,
        NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --require=${JSON.stringify(path.resolve(guard))}`,
    };
    const report = JSON.parse(
        execFileSync(process.execPath, command, {
            encoding: "utf8",
            stdio: "pipe",
            env,
        }),
    );
    assert.deepEqual(report, JSON.parse(await fs.readFile(output, "utf8")));
    assert.equal(report.identities.requests[0].state.sha256, hash(state));
    assert.equal(
        report.identities.artifact.sha256,
        preparation.identities.artifact.sha256,
    );
    assert.deepEqual(
        report.samples.map(({ sample, mode }) => [sample, mode]),
        [
            [1, "buffer"],
            [1, "string"],
            [2, "string"],
            [2, "buffer"],
        ],
    );
    assert.equal(new Set(report.samples.map(sample => sample.workerPid)).size, 4);
    for (const sample of report.samples) {
        assert.equal(sample.counts.programConstructions, 1);
        assert.equal(sample.counts.measuredRequests, 4);
        assert.equal(sample.counts.warmupRequests, 4);
        assert.equal(sample.counts.totalRequests, 11);
        assert.equal(sample.counts.handleReuses, 10);
        assert.ok(sample.nativeAddons.some(addon => addon.path.endsWith(".node")));
        for (const addon of sample.nativeAddons) {
            assert.equal(addon.sha256, hash(await fs.readFile(addon.path)));
        }
        for (const field of [
            "hostImportMs",
            "artifactReadMs",
            "inputReadMs",
            "programLoadMs",
            "firstRenderMs",
            "warmupMs",
            "warmTotalMs",
            "warmMsPerRequest",
        ]) {
            assert.ok(Number.isFinite(sample[field]) && sample[field] >= 0);
        }
    }
    assert.throws(
        () =>
            execFileSync(process.execPath, command, {
                encoding: "utf8",
                stdio: "pipe",
                env,
            }),
        error => /EEXIST/.test(error.stderr),
    );
    await fs.writeFile(path.join(directory, "a.html"), "<p>wrong</p>");
    assert.throws(
        () =>
            execFileSync(process.execPath, command.slice(0, -1), {
                encoding: "utf8",
                stdio: "pipe",
                env,
            }),
        error => /differ/.test(error.stderr),
    );
});
