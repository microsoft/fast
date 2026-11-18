import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { Worker } from "node:worker_threads";
import { loadNativeHost } from "../native-host.mjs";
import { createNativeHostAdapter } from "./performance/native-host-adapter.mjs";

const addon = process.env.FAST_NATIVE_ADDON;
const fixtureExecutable = process.env.FAST_NATIVE_FIXTURE;
assert.ok(addon, "Configure FAST_NATIVE_ADDON with the source-built Node addon.");
const fixture = JSON.parse(
    fixtureExecutable
        ? execFileSync(fixtureExecutable, { encoding: "utf8" })
        : execFileSync(
              "cargo",
              [
                  "run",
                  "--offline",
                  "--locked",
                  "--quiet",
                  "--manifest-path",
                  fileURLToPath(
                      new URL(
                          "../../../crates/microsoft-fast-build/Cargo.toml",
                          import.meta.url,
                      ),
                  ),
                  "--example",
                  "native-host-fixture",
              ],
              { encoding: "utf8", timeout: 120_000 },
          ),
);
assert.equal(
    fixture.crateVersion,
    JSON.parse(readFileSync(new URL("../package.json", import.meta.url))).version,
    "Build the fixture from matching current crate/package sources",
);
const artifact = Buffer.from(fixture.artifact);
const NativeProgram = loadNativeHost(addon);
const state = { label: "<&\"'😀", items: ["α", null, -0, { x: 1 }] };
const json = JSON.stringify(state);
const input = Buffer.from(json);

function render(program, context, input) {
    return context === "Entry" || context === "Template"
        ? program[`render${context}Json`](input)
        : program[`render${context}Json`]("test-card", input);
}
function expectedRender(context, input, options = {}) {
    assert.deepEqual(input, state);
    const output = fixture.outputs.find(record =>
        isDeepStrictEqual(record.options, options),
    );
    assert.ok(output, "matching native Rust fixture options");
    return output.values[context];
}
const contexts = ["Entry", "Template", "Host", "Shadow"];
const frozenShadow =
    '<template shadowrootmode="open"><h2 title="&lt;&amp;&quot;&#39;😀" data-fe="1"><!--fe:b-->&lt;&amp;&quot;&#39;😀<!--fe:/b--></h2><!--fe:b--><!--fe:r--><!--fe:b-->α<!--fe:/b-->/<!--fe:b-->0<!--fe:/b--><!--fe:/r--><!--fe:r--><!--fe:b--><!--fe:/b-->/<!--fe:b-->1<!--fe:/b--><!--fe:/r--><!--fe:r--><!--fe:b-->0<!--fe:/b-->/<!--fe:b-->2<!--fe:/b--><!--fe:/r--><!--fe:r--><!--fe:b-->[Object]<!--fe:/b-->/<!--fe:b-->3<!--fe:/b--><!--fe:/r--><!--fe:/b--></template>';

test("native addon identifies its compiler release and Node/artifact API", () => {
    assert.deepEqual(createRequire(import.meta.url)(addon).nativeHostInfo(), {
        version: fixture.crateVersion,
        napiVersion: 8,
        artifactFormat: "fast-server-native",
        artifactSchemas: [1, 2],
    });
});

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
        const expected = expectedRender(context, state);
        assert.deepEqual(adapter.renderBuffer(input), Buffer.from(expected));
        assert.equal(adapter.renderString(input), expected);
    }
});

test("consolidated semantic schema 2 hosting preserves frozen bytes in all four contexts", () => {
    const program = new NativeProgram(artifact);
    const plan = JSON.parse(fixture.artifact);
    assert.equal(plan.format, "fast-server-native");
    assert.equal(plan.version, 2);
    assert.ok(Array.isArray(plan.program.entry));
    assert.ok(
        Array.isArray(plan.program.templates[plan.program.components["test-card"]]),
    );
    for (const context of contexts) {
        const frozen =
            context === "Shadow"
                ? frozenShadow
                : `<test-card>${frozenShadow}</test-card>`;
        assert.deepEqual(render(program, context, input), Buffer.from(frozen));
        assert.equal(expectedRender(context, state), frozen);
        for (const options of [
            {},
            { markersV2: true },
            { dsd: [] },
            { attributeNameStrategy: "none" },
        ]) {
            assert.deepEqual(
                render(new NativeProgram(artifact, options), context, input),
                Buffer.from(expectedRender(context, state, options)),
            );
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
        `{"unused":${"[".repeat(65)}0${"]".repeat(65)}}`,
    ].map(value => Buffer.from(value));
    invalid.push(
        Buffer.from([0xc0, 0xaf]),
        Buffer.from([0xed, 0xa0, 0x80]),
        Buffer.from([0xf4, 0x90, 0x80, 0x80]),
    );
    for (const context of contexts) {
        for (const invalidInput of invalid) {
            assert.throws(() => render(program, context, invalidInput), {
                code: "invalid-state",
            });
            assert.deepEqual(
                render(program, context, input),
                Buffer.from(expectedRender(context, state)),
            );
        }
        assert.deepEqual(
            render(program, context, Buffer.from('{"label":-0}')),
            render(program, context, Buffer.from('{"label":0}')),
        );
    }
});

test("configuration is copied once without invoking getters or toJSON", () => {
    const options = { markersV2: true, dsd: ["test-card"] };
    const expected = Buffer.from(expectedRender("Entry", state, options));
    const program = new NativeProgram(artifact, options);
    options.markersV2 = false;
    options.dsd.length = 0;
    assert.deepEqual(program.renderEntryJson(input), expected);
    assert.deepEqual(
        new NativeProgram(artifact, options).renderEntryJson(input),
        Buffer.from(expectedRender("Entry", state, options)),
    );

    let calls = 0;
    const getter = {
        get markersV2() {
            calls++;
            return true;
        },
    };
    const dsd = [];
    Object.defineProperty(dsd, 0, {
        enumerable: true,
        get() {
            calls++;
            return "test-card";
        },
    });
    for (const invalid of [
        getter,
        { dsd },
        new Date(),
        new Proxy(
            {},
            {
                ownKeys() {
                    calls++;
                    return [];
                },
            },
        ),
        {
            toJSON() {
                calls++;
                return {};
            },
        },
        Object.defineProperty({}, "markersV2", { value: true }),
        { [Symbol("key")]: 1 },
    ]) {
        assert.throws(() => new NativeProgram(artifact, invalid), {
            code: "invalid-options",
        });
    }
    assert.equal(calls, 0);
    const previous = Array.prototype.toJSON;
    try {
        Array.prototype.toJSON = () => {
            calls++;
            return [];
        };
        const configured = new NativeProgram(artifact, { dsd: ["test-card"] });
        assert.deepEqual(
            configured.renderEntryJson(input),
            Buffer.from(expectedRender("Entry", state)),
        );
        assert.equal(calls, 0);
    } finally {
        if (previous === undefined) delete Array.prototype.toJSON;
        else Array.prototype.toJSON = previous;
    }
});

test("constructor options are strict and request budgets reset after every call", () => {
    const program = new NativeProgram(artifact);
    for (const options of [
        null,
        [],
        "{}",
        { unknown: true },
        { maxSteps: -1 },
        { maxSteps: Number.MAX_SAFE_INTEGER + 1 },
        { maxOutputBytes: 1.5 },
        { markersV2: 1 },
        { dsd: [1] },
        { dsd: ["\ud800"] },
        { dsd: Array(1) },
        { dsd: Object.assign([], { extra: true }) },
        { attributeNameStrategy: "bad" },
    ]) {
        assert.throws(() => new NativeProgram(artifact, options), {
            code: "invalid-options",
        });
    }
    for (const context of contexts) {
        for (const options of [{ maxOutputBytes: 1 }, { maxSteps: 0 }]) {
            const limited = new NativeProgram(artifact, options);
            assert.throws(() => render(limited, context, input), {
                code: "render-limit",
            });
        }
        for (const invalid of [
            json,
            state,
            new Uint8Array(input),
            new Proxy(input, {}),
        ]) {
            assert.throws(() => render(program, context, invalid), {
                code: "invalid-state",
            });
        }
        const expected = Buffer.from(expectedRender(context, state));
        const bounded = new NativeProgram(artifact, { maxOutputBytes: expected.length });
        const oversized = Buffer.from(
            JSON.stringify({ ...state, label: "x".repeat(expected.length + 1) }),
        );
        assert.throws(() => render(bounded, context, oversized), {
            code: "render-limit",
        });
        for (let index = 0; index < 3; index++) {
            assert.deepEqual(render(bounded, context, input), expected);
        }
    }
    assert.throws(() => program.renderEntryJson(input, { maxSteps: 0 }), {
        code: "invalid-options",
    });
    assert.throws(() => program.renderHostJson("missing", Buffer.from("{")), {
        code: "invalid-state",
    });
    assert.throws(() => program.renderHostJson("missing", input), {
        code: "missing-template",
    });
});

test("artifact rejection is explicit and caller bytes are not retained", () => {
    assert.throws(
        () => loadNativeHost(`${addon}.missing`),
        error => {
            assert.equal(error.code, "native-load-failed");
            assert.equal(error.cause.code, "MODULE_NOT_FOUND");
            return true;
        },
    );
    for (const malformed of [
        "{}",
        "{",
        JSON.stringify({ ...JSON.parse(fixture.artifact), version: 99 }),
    ]) {
        assert.throws(() => new NativeProgram(Buffer.from(malformed)));
    }
    const unsupported = { ...JSON.parse(fixture.artifact), version: 99 };
    assert.throws(() => new NativeProgram(Buffer.from(JSON.stringify(unsupported))), {
        code: "incompatible-artifact",
    });
    const missingEntry = JSON.parse(fixture.artifact);
    delete missingEntry.program.entry;
    assert.throws(() => new NativeProgram(Buffer.from(JSON.stringify(missingEntry))), {
        code: "invalid-artifact",
    });
    const brokenReference = JSON.parse(fixture.artifact);
    brokenReference.program.entry = [{ type: "template", name: "missing-template" }];
    assert.throws(() => new NativeProgram(Buffer.from(JSON.stringify(brokenReference))), {
        code: "invalid-artifact",
    });
    const bytes = Buffer.from(artifact);
    const program = new NativeProgram(bytes);
    bytes.fill(0);
    const input = Buffer.from(json);
    const output = program.renderEntryJson(input);
    input.fill(0);
    assert.deepEqual(output, Buffer.from(expectedRender("Entry", state)));
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
        const { parentPort, workerData } = require("node:worker_threads");
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
                assert.deepEqual(
                    render(program, context, Buffer.from(json)),
                    Buffer.from(expectedRender(context, state)),
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

test("owned output survives program collection, forced GC and independent workers", async t => {
    assert.equal(typeof global.gc, "function");
    const expected = Buffer.from(expectedRender("Entry", state));
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
        const { parentPort, workerData, threadId } = require("node:worker_threads");
        const { registerHooks } = require("node:module");
        registerHooks({
            resolve(specifier, context, next) {
                if (specifier.includes("/wasm/") || specifier.endsWith("/server.js")) {
                    throw new Error("Native request execution must not load the compiler.");
                }
                return next(specifier, context);
            },
        });
        (async () => {
            const { loadNativeHost } = await import(workerData.module);
            const Program = loadNativeHost(workerData.addon);
            const p = new Program(Buffer.from(workerData.artifact));
            const input = Buffer.from(workerData.json);
            for (let i = 0; i < 32; i++) p.renderEntryJson(input);
            parentPort.postMessage({
                threadId,
                output: p.renderEntryJson(input).toString("base64"),
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
                            t.diagnostic(
                                JSON.stringify({
                                    workerThreadId: threadId,
                                    messages,
                                    exitCode: code,
                                    outputBytes: expected.length,
                                }),
                            );
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
