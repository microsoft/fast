import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Worker } from "node:worker_threads";
import { loadNativeHost, serializeNativeState } from "../native-host.mjs";
import { createNativeHostAdapter } from "./performance/native-host-adapter.mjs";

const addon = process.env.FAST_NATIVE_ADDON;
const fixtureExecutable = process.env.FAST_NATIVE_FIXTURE;
assert.ok(
    addon && fixtureExecutable,
    "Set Cargo-emitted FAST_NATIVE_ADDON and FAST_NATIVE_FIXTURE",
);
const fixture = JSON.parse(execFileSync(fixtureExecutable, { encoding: "utf8" }));
assert.equal(
    fixture.crateVersion,
    JSON.parse(readFileSync(new URL("../package.json", import.meta.url))).version,
    "Build the fixture from matching current crate/package sources",
);
const artifact = Buffer.from(fixture.artifact);
const NativeProgram = loadNativeHost(addon);
const runtime = new URL("../server-runtime.mjs", import.meta.url).href;
const source = fixture.source.replace("__FAST_TEST_RUNTIME__", runtime);
const js = await import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
const state = { label: "<&\"'😀", items: ["α", null, -0, { x: 1 }] };
const json = serializeNativeState(state);

function render(program, context, input, options) {
    return context === "Entry" || context === "Template"
        ? program[`render${context}Json`](input, options)
        : program[`render${context}Json`]("test-card", input, options);
}
function jsRender(context, input, options) {
    return context === "Entry" || context === "Template"
        ? js[`render${context}`](input, options)
        : js[`render${context}`]("test-card", input, options);
}
const contexts = ["Entry", "Template", "Host", "Shadow"];
const frozenShadow =
    '<template shadowrootmode="open" shadowroot="open"><h2 title="&lt;&amp;&quot;&#39;😀" data-fe="1"><!--fe:b-->&lt;&amp;&quot;&#39;😀<!--fe:/b--></h2><!--fe:b--><!--fe:r--><!--fe:b-->α<!--fe:/b-->/<!--fe:b-->0<!--fe:/b--><!--fe:/r--><!--fe:r--><!--fe:b--><!--fe:/b-->/<!--fe:b-->1<!--fe:/b--><!--fe:/r--><!--fe:r--><!--fe:b-->0<!--fe:/b-->/<!--fe:b-->2<!--fe:/b--><!--fe:/r--><!--fe:r--><!--fe:b-->[Object]<!--fe:/b-->/<!--fe:b-->3<!--fe:/b--><!--fe:/r--><!--fe:/b--></template>';

test("published entrypoint and untimed boundary adapters expose the tested facade", async () => {
    const published = await import("@microsoft/fast-build/native-host.mjs");
    assert.equal(published.loadNativeHost, loadNativeHost);
    for (const context of contexts) {
        const adapter = createNativeHostAdapter({
            addonPath: addon,
            artifact,
            context,
            name: "test-card",
        });
        const expected = jsRender(context, state);
        assert.deepEqual(
            adapter.renderJsonBuffer(Buffer.from(json)),
            Buffer.from(expected),
        );
        assert.equal(adapter.renderJsonString(json), expected);
        assert.deepEqual(adapter.renderObjectBuffer(state), Buffer.from(expected));
        assert.equal(adapter.renderObjectString(state), expected);
    }
});

test("source-built semantic schema 1 addon and generated JS agree across four contexts", () => {
    const program = new NativeProgram(artifact);
    const plan = JSON.parse(fixture.artifact);
    assert.equal(plan.format, "fast-server-native");
    assert.equal(plan.version, 1);
    assert.ok(Array.isArray(plan.entry));
    assert.ok(Array.isArray(plan.templates[plan.components["test-card"]]));
    for (const context of contexts) {
        const frozen =
            context === "Shadow"
                ? frozenShadow
                : `<test-card>${frozenShadow}</test-card>`;
        assert.deepEqual(render(program, context, json), Buffer.from(frozen));
        assert.equal(jsRender(context, state), frozen);
        for (const options of [
            {},
            { markersV2: true },
            { dsd: [] },
            { attributeNameStrategy: "none" },
        ]) {
            for (const input of [json, Buffer.from(json)]) {
                assert.deepEqual(
                    render(program, context, input, JSON.stringify(options)),
                    Buffer.from(jsRender(context, state, options)),
                );
            }
        }
    }
});

test("rejects full malformed JSON/UTF8/Unicode/numeric graphs with recovery", () => {
    const program = new NativeProgram(artifact);
    const invalid = [
        "{",
        "{} trailing",
        '{"unused":"\\ud800"}',
        '{"\\udfff":0}',
        '{"unused":1e999}',
        '{"unused":1e999,"unused":0}',
        '{"unused":"\\ud800","unused":0}',
        '{"unused":NaN}',
        '{"unused":undefined}',
        Buffer.from([0xc0, 0xaf]),
        Buffer.from([0xed, 0xa0, 0x80]),
        Buffer.from([0xf4, 0x90, 0x80, 0x80]),
        "\ud800",
        `{"unused":${"[".repeat(65)}0${"]".repeat(65)}}`,
    ];
    for (const context of contexts) {
        for (const input of invalid) {
            assert.throws(() => render(program, context, input), {
                code: "invalid-state",
            });
            assert.deepEqual(
                render(program, context, json),
                Buffer.from(jsRender(context, state)),
            );
        }
        assert.deepEqual(
            render(program, context, '{"label":-0}'),
            render(program, context, '{"label":0}'),
        );
    }
});

test("objects require explicit full-graph validation without getters/classes/toJSON", () => {
    let calls = 0;
    const getter = {
        get unused() {
            calls++;
            return 1;
        },
    };
    const cyclic = {};
    cyclic.self = cyclic;
    const extraArray = [];
    extraArray.x = 1;
    for (const invalid of [
        getter,
        new Date(),
        new (class State {})(),
        { unused: undefined },
        { unused: Infinity },
        { unused: NaN },
        { unused: "\udfff" },
        { "\ud800": 1 },
        cyclic,
        Array(2),
        extraArray,
        {
            toJSON() {
                calls++;
                return {};
            },
        },
        Object.defineProperty({}, "hidden", { value: 1 }),
        { [Symbol("key")]: 1 },
    ]) {
        assert.throws(() => serializeNativeState(invalid), { code: "invalid-state" });
    }
    assert.equal(calls, 0);
    assert.equal(serializeNativeState({ value: -0 }), '{"value":0}');
    assert.throws(() => new NativeProgram(artifact).renderEntryJson(state), {
        code: "invalid-state",
    });
    const previous = Array.prototype.toJSON;
    try {
        Array.prototype.toJSON = () => {
            calls++;
            return [];
        };
        assert.equal(serializeNativeState([1, 2]), "[1,2]");
        assert.equal(calls, 0);
    } finally {
        if (previous === undefined) delete Array.prototype.toJSON;
        else Array.prototype.toJSON = previous;
    }
});

test("budget and option failures return no partial output and preserve first error", () => {
    const program = new NativeProgram(artifact);
    for (const context of contexts) {
        for (const options of [{ maxOutputBytes: 1 }, { maxSteps: 0 }]) {
            assert.throws(() => render(program, context, json, JSON.stringify(options)), {
                code: "render-limit",
            });
        }
        for (const options of [
            "{",
            '{"unknown":true}',
            '{"maxSteps":-1}',
            '{"maxOutputBytes":1.5}',
            '{"markersV2":1}',
            '{"dsd":[1]}',
            '{"attributeNameStrategy":"bad"}',
            Buffer.from([0xff]),
            "\ud800",
            {},
        ]) {
            assert.throws(() => render(program, context, "{", options), {
                code: "invalid-state",
            });
            assert.throws(() => render(program, context, json, options), {
                code: "invalid-options",
            });
        }
        assert.deepEqual(
            render(program, context, json),
            Buffer.from(jsRender(context, state)),
        );
    }
    assert.throws(() => program.renderHostJson("missing", "{"), {
        code: "invalid-state",
    });
    assert.throws(() => program.renderHostJson("missing", json), {
        code: "missing-template",
    });
});

test("artifact rejection is explicit and caller bytes are not retained", () => {
    assert.throws(() => loadNativeHost(`${addon}.missing`), { code: "MODULE_NOT_FOUND" });
    for (const malformed of [
        "{}",
        "{",
        JSON.stringify({ ...JSON.parse(fixture.artifact), version: 2 }),
    ]) {
        assert.throws(() => new NativeProgram(Buffer.from(malformed)));
    }
    const unsupported = { ...JSON.parse(fixture.artifact), version: 2 };
    assert.throws(() => new NativeProgram(Buffer.from(JSON.stringify(unsupported))), {
        code: "incompatible-artifact",
    });
    const { entry: _entry, ...missingEntry } = JSON.parse(fixture.artifact);
    assert.throws(() => new NativeProgram(Buffer.from(JSON.stringify(missingEntry))), {
        code: "invalid-artifact",
    });
    const brokenReference = {
        ...JSON.parse(fixture.artifact),
        entry: [{ type: "template", name: "missing-template" }],
    };
    assert.throws(() => new NativeProgram(Buffer.from(JSON.stringify(brokenReference))), {
        code: "invalid-artifact",
    });
    const bytes = Buffer.from(artifact);
    const program = new NativeProgram(bytes);
    bytes.fill(0);
    const input = Buffer.from(json);
    const output = program.renderEntryJson(input);
    input.fill(0);
    assert.deepEqual(output, Buffer.from(js.renderEntry(state)));
});

test("shared backing stores are rejected before native reads, with request recovery", async () => {
    const shared = new SharedArrayBuffer(
        Math.max(artifact.length, Buffer.byteLength(json)),
    );
    const bytes = Buffer.from(shared);
    const shadowed = Buffer.from(shared);
    Object.defineProperty(shadowed, "buffer", {
        get() {
            throw new Error("The intrinsic backing-store check must not invoke getters.");
        },
    });
    const control = new SharedArrayBuffer(4);
    const signal = new Int32Array(control);
    const worker = new Worker(
        `
        const { parentPort, workerData, threadId } = require("node:worker_threads");
        const bytes = new Uint8Array(workerData.shared);
        const signal = new Int32Array(workerData.control);
        parentPort.postMessage("ready");
        while (Atomics.load(signal, 0) === 0) bytes[0] ^= 1;
    `,
        { eval: true, workerData: { shared, control } },
    );
    const exited = new Promise((resolve, reject) => {
        worker.once("error", reject);
        worker.once("exit", code =>
            code === 0 ? resolve() : reject(new Error(`worker exit ${code}`)),
        );
    });
    try {
        await new Promise((resolve, reject) => {
            worker.once("message", resolve);
            worker.once("error", reject);
        });
        const program = new NativeProgram(artifact);
        for (const input of [bytes, shadowed]) {
            assert.throws(() => new NativeProgram(input), { code: "invalid-artifact" });
            for (const context of contexts) {
                assert.throws(() => render(program, context, input), {
                    code: "invalid-state",
                });
                assert.throws(() => render(program, context, "{", input), {
                    code: "invalid-state",
                });
                assert.throws(() => render(program, context, json, input), {
                    code: "invalid-options",
                });
                assert.deepEqual(
                    render(program, context, json),
                    Buffer.from(jsRender(context, state)),
                );
            }
        }
        assert.throws(() => new NativeProgram(new Uint8Array(shared)), {
            code: "invalid-artifact",
        });
        assert.throws(() => program.renderEntryJson(new Uint8Array(shared)), {
            code: "invalid-state",
        });
    } finally {
        Atomics.store(signal, 0, 1);
        await exited;
    }
});

test("owned output survives program collection, forced GC and independent workers", async () => {
    assert.equal(typeof global.gc, "function");
    const expected = Buffer.from(js.renderEntry(state));
    const retained = [];
    for (let index = 0; index < 64; index++) {
        retained.push(
            new NativeProgram(Buffer.from(artifact)).renderEntryJson(Buffer.from(json)),
        );
    }
    global.gc();
    for (const bytes of retained) assert.deepEqual(bytes, expected);
    const module = new URL("../native-host.mjs", import.meta.url).href;
    const workers = Array.from(
        { length: 4 },
        () =>
            new Worker(
                `
        const { parentPort, workerData } = require("node:worker_threads");
        (async () => {
            const { loadNativeHost } = await import(workerData.module);
            const Program = loadNativeHost(workerData.addon);
            const p = new Program(Buffer.from(workerData.artifact));
            for (let i = 0; i < 32; i++) p.renderEntryJson(workerData.json);
            parentPort.postMessage({
                threadId,
                output: p.renderEntryJson(workerData.json).toString("base64"),
            });
        })().catch(e => { throw e; });
    `,
                { eval: true, workerData: { module, addon, artifact, json } },
            ),
    );
    const threadIds = new Set(workers.map(worker => worker.threadId));
    assert.equal(threadIds.size, 4);
    await Promise.all(
        workers.map(
            worker =>
                new Promise((resolve, reject) => {
                    let messages = 0;
                    const threadId = worker.threadId;
                    worker.on("message", result => {
                        messages++;
                        assert.equal(result.threadId, threadId);
                        assert.deepEqual(Buffer.from(result.output, "base64"), expected);
                    });
                    worker.once("error", reject);
                    worker.once("exit", code => {
                        if (code !== 0 || messages !== 1) {
                            reject(
                                new Error(
                                    `worker exit ${code}, proof messages ${messages}`,
                                ),
                            );
                        } else {
                            resolve();
                        }
                    });
                }),
        ),
    );
    global.gc();
    for (const bytes of retained) assert.deepEqual(bytes, expected);
    assert.ok(readFileSync(addon).length > 0);
});
