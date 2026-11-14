import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";
import { fixture, outputStats } from "../performance/fixtures.mjs";

const require = createRequire(import.meta.url);
const { compileServerArtifact, compileServerModule } = require("../../server.js");
const addonPath = fileURLToPath(
    new URL(
        "../../../../crates/microsoft-fast-build-node/target/release/fast-build.node",
        import.meta.url,
    ),
);
const { NativeProgram, compilerId } = require(addonPath);
const runtime = pathToFileURL(require.resolve("../../server-runtime.mjs")).href;
const json = value => Buffer.from(JSON.stringify(value));
const templates = {
    "test-parent": {
        content:
            '<f-repeat value="{{item in items}}"><test-child :item="{{item}}" data-x="{{item.name}}">{{$index}}</test-child></f-repeat><slot>static</slot>',
        hostAttributes: [{ name: "title", value: "default & title" }],
    },
    "test-child": "{{item.name}}/{{dataset.x}}/{{dataset.inherited}}",
};
const entry = '<test-parent title="{{label}}"></test-parent>';

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
    test(`native frozen output: ${record.case}/${record.mode}/${record.count}`, () => {
        const input = fixture(record.case, record.count, record.payload, record.rootKeys);
        const program = new NativeProgram(
            Buffer.from(compileServerArtifact(input.entry, input.templates)),
        );
        const output = program.renderEntry(
            json(input.state),
            json({ markersV2: record.mode === "v2" }),
        );
        const {
            case: _case,
            mode: _mode,
            count: _count,
            payload: _payload,
            rootKeys: _root,
            ...expected
        } = record;
        assert.deepEqual(outputStats(output.toString("utf8")), expected);
    });
}

test("native buffers match JavaScript bytes for all targets and option modes", async () => {
    const artifact = Buffer.from(compileServerArtifact(entry, templates));
    assert.equal(JSON.parse(artifact).compilerId, compilerId());
    const native = new NativeProgram(artifact);
    const source = compileServerModule(entry, templates, runtime);
    const javascript = await import(
        `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
    );
    for (const state of [
        {
            label: "<&",
            items: [{ name: "caf\u00e9 \u{1f600}" }, null],
            dataset: { inherited: "yes" },
        },
        { label: null, items: [] },
    ]) {
        for (const markersV2 of [false, true]) {
            for (const attributeNameStrategy of ["camelCase", "none"]) {
                for (const dsd of [undefined, [], ["test-parent"], ["test-child"]]) {
                    const options = { markersV2, attributeNameStrategy, dsd };
                    for (const target of [
                        "renderEntry",
                        "renderTemplate",
                        "renderHost",
                        "renderShadow",
                    ]) {
                        const args =
                            target === "renderHost" || target === "renderShadow"
                                ? ["test-parent"]
                                : [];
                        const actual = native[target](
                            ...args,
                            json(state),
                            json(options),
                        );
                        assert.ok(Buffer.isBuffer(actual));
                        assert.deepEqual(
                            actual,
                            Buffer.from(javascript[target](...args, state, options)),
                        );
                    }
                }
            }
        }
    }
});

test("artifact storage and returned buffers do not retain or mutate request inputs", () => {
    const bytes = Buffer.from(compileServerArtifact("{{value}}", {}));
    let native = new NativeProgram(bytes);
    bytes.fill(0);
    const state = json({ value: "first" });
    const output = native.renderEntry(state);
    state.fill(0);
    assert.deepEqual(native.renderEntry(json({})), Buffer.alloc(0));
    assert.equal(native.renderEntry(json({ value: "second" })).toString(), "second");
    output[0] = 88;
    assert.equal(native.renderEntry(json({ value: "first" })).toString(), "first");
    native = null;
    globalThis.gc?.();
    assert.equal(output.toString(), "Xirst");
});

test("native failures preserve codes and limits without poisoning later requests", () => {
    const bytes = Buffer.from(
        compileServerArtifact(
            '<f-repeat value="{{item in items}}">{{item}}</f-repeat>',
            {},
        ),
    );
    const native = new NativeProgram(bytes);
    const code = expected => error => error.code === expected;
    assert.throws(
        () => new NativeProgram(Buffer.from("invalid")),
        code("invalid-artifact"),
    );
    const stale = JSON.parse(bytes);
    stale.compilerId = "stale";
    assert.throws(() => new NativeProgram(json(stale)), code("incompatible-artifact"));
    assert.throws(() => native.renderEntry(Buffer.from([0xff])), code("invalid-state"));
    assert.throws(() => native.renderEntry(Buffer.from("{")), code("invalid-state"));
    assert.throws(
        () => native.renderEntry(json({ items: false })),
        code("repeat-not-array"),
    );
    assert.throws(
        () => native.renderEntry(json({ items: [] }), json({ unknown: true })),
        code("invalid-options"),
    );
    assert.throws(
        () => native.renderEntry(json({ items: [1] }), json({ maxSteps: 0 })),
        code("render-limit"),
    );
    assert.throws(
        () => native.renderEntry(json({ items: ["long"] }), json({ maxOutputBytes: 1 })),
        code("render-limit"),
    );
    assert.throws(() => native.renderHost("missing", json({})), code("missing-template"));
    let deep = {};
    for (let index = 0; index < 65; index++) deep = { value: deep };
    assert.throws(() => native.renderEntry(json(deep)), code("invalid-state"));
    assert.equal(native.renderEntry(json({ items: ["safe"] })).toString(), "safe");
});

test("independent Node workers reuse native artifacts without request leakage", async () => {
    const artifact = Buffer.from(compileServerArtifact("{{value}}", {}));
    const outputs = await Promise.all(
        ["one", "two", "three"].map(
            value =>
                new Promise((resolve, reject) => {
                    const worker = new Worker(
                        `
                const { parentPort, workerData } = require("node:worker_threads");
                const { NativeProgram } = require(workerData.addonPath);
                const native = new NativeProgram(Buffer.from(workerData.artifact));
                for (let i = 0; i < 10; i++) native.renderEntry(Buffer.from('{"value":"warm"}'));
                parentPort.postMessage(native.renderEntry(Buffer.from(JSON.stringify({value:workerData.value}))).toString());
            `,
                        { eval: true, workerData: { addonPath, artifact, value } },
                    );
                    worker.once("message", resolve);
                    worker.once("error", reject);
                    worker.once("exit", code => {
                        if (code !== 0) reject(new Error(`worker exit ${code}`));
                    });
                }),
        ),
    );
    assert.deepEqual(outputs, ["one", "two", "three"]);
});

test("opt-in benchmark reports native load phases and matched JSON-to-UTF-8 output", () => {
    const result = JSON.parse(
        execFileSync(
            process.execPath,
            [
                fileURLToPath(
                    new URL("../performance/server-renderer.mjs", import.meta.url),
                ),
                "--samples=1",
                "--iterations=2",
                "--instances=2",
                "--warmup=0",
                `--native=${addonPath}`,
            ],
            { encoding: "utf8" },
        ),
    );
    for (const record of Object.values(result.workloads)) {
        assert.ok(record.artifactBytes > 0);
        const aot = record.modes.aot[0];
        const native = record.modes.native[0];
        assert.equal(native.outputHash, aot.outputHash);
        assert.equal(native.outputBytes, aot.outputBytes);
        assert.equal(native.utf8EncodeMs, 0);
        for (const sample of [aot, native]) {
            for (const phase of [
                "artifactReadMs",
                "artifactLoadMs",
                "stateEncodeMs",
                "warmJsonToUtf8MsPerRender",
                "warmJsonToUtf8CpuMsPerRender",
            ]) {
                assert.ok(Number.isFinite(sample[phase]) && sample[phase] >= 0, phase);
            }
        }
    }
});
