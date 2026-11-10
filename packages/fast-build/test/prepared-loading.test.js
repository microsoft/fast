// @ts-check
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { test } = require("node:test");
const { compileArtifacts, createPreparedRuntime } = require("../prepared.js");
const wasm = require("../wasm/microsoft_fast_build.js");

const source =
    '<test-parent title="{{title}}"><test-light title="{{title}}">' +
    "<i>{{title}}</i></test-light></test-parent>";
const templates = {
    "test-parent": {
        content: "<test-shadow></test-shadow>",
        hostAttributes: [{ name: "role", value: "article" }],
    },
    "test-shadow": "<test-deep></test-deep>",
    "test-deep": "<b>hidden</b>",
    "test-light": {
        content: "<strong>{{title}}</strong>",
        shadowrootAttributes: [{ name: "shadowrootmode", value: "closed" }],
    },
    "test-unused": "unused",
};

function fixture(
    t,
    compiled = compileArtifacts({ entries: { home: source }, templates }),
) {
    const loads = [];
    const runtime = createPreparedRuntime({
        manifest: compiled.manifest,
        maxMemoryBytes: 0,
        async loadArtifact(id) {
            loads.push(id);
            const bytes = compiled.artifacts.get(id);
            if (!bytes) {
                throw new Error(`Missing artifact ${id}`);
            }
            return bytes;
        },
    });
    t.after(() => runtime.dispose());
    return { runtime, loads, ...compiled };
}

test("no DSD loads only entry while mixed selection retains caller-owned light descendants", async t => {
    const { runtime, loads, manifest } = fixture(t);
    for (const markersV2 of [false, true]) {
        loads.length = 0;
        const html = await runtime.render(
            "home",
            { title: "caller" },
            {
                dsd: [],
                markersV2,
            },
        );
        assert.deepEqual(loads, [manifest.entries.home]);
        assert.doesNotMatch(html, /shadowroot|role=|hidden|strong/);
        assert.match(html, /<i>.*caller/);

        loads.length = 0;
        const mixed = await runtime.render(
            "home",
            { title: "caller" },
            {
                dsd: ["test-light", "test-deep"],
                markersV2,
            },
        );
        assert.deepEqual(
            new Set(loads),
            new Set([manifest.entries.home, manifest.templates["test-light"]]),
        );
        assert.match(mixed, /shadowrootmode="closed"/);
        assert.match(mixed, /<strong>.*caller/);
        assert.doesNotMatch(mixed, /hidden|role=/);
        assert.doesNotMatch(mixed, /<test-shadow|<test-deep/);
        const fragment = await runtime.renderShadowRoot(
            "test-deep",
            {},
            { dsd: ["test-deep"], markersV2 },
        );
        assert.match(fragment, /^<template[^>]*><b>hidden<\/b><\/template>$/);
        assert.equal(runtime.memoryUsage.pieces, 0);
    }
});

test("default selection loads the full reachable graph, not unrelated definitions", async t => {
    const { runtime, loads, manifest } = fixture(t);
    await runtime.render("home", { title: "all" });
    assert.deepEqual(
        new Set(loads),
        new Set([
            manifest.entries.home,
            ...["test-parent", "test-shadow", "test-deep", "test-light"].map(
                name => manifest.templates[name],
            ),
        ]),
    );
});

test("selected fragments load their own policy graph and excluded known roots do no I/O", async t => {
    const { runtime, loads, manifest } = fixture(t);
    assert.equal(await runtime.renderShadowRoot("test-parent", {}, { dsd: [] }), "");
    assert.deepEqual(loads, []);
    await assert.rejects(runtime.renderShadowRoot("unknown", {}, { dsd: [] }), /Unknown/);
    await assert.rejects(
        runtime.renderShadowRoot(
            "test-parent",
            {},
            {
                dsd: [],
                attributeNameStrategy: "invalid",
            },
        ),
        { code: "invalid-attribute-name-strategy" },
    );
    const circular = {};
    circular.self = circular;
    assert.throws(() => runtime.renderShadowRoot("test-parent", circular, { dsd: [] }));
    assert.deepEqual(loads, []);
    const fragment = await runtime.renderShadowRoot(
        "test-parent",
        {},
        {
            dsd: ["test-parent", "test-deep"],
        },
    );
    assert.deepEqual(loads, [manifest.templates["test-parent"]]);
    assert.match(fragment, /^<template/);
    assert.doesNotMatch(fragment, /hidden|role=|<test-parent/);
    assert.throws(
        () => wasm.validate_prepared_request("not-json", undefined, false, "[]"),
        { code: "invalid-state-json" },
    );
});

test("pruned entry HTML, exact chunks and fragments match complete native programs", async t => {
    const { runtime, artifacts, manifest } = fixture(t);
    const pieces = new Map(
        [...artifacts].map(([id, bytes]) => [id, wasm.PreparedPiece.load(bytes)]),
    );
    const program = new wasm.PreparedProgram(pieces.get(manifest.entries.home));
    for (const [name, id] of Object.entries(manifest.templates)) {
        program.add_template(name, pieces.get(id));
    }
    t.after(() => {
        program.free();
        for (const piece of pieces.values()) {
            piece.free();
        }
    });
    const state = { title: "state<&" };
    for (const markersV2 of [false, true]) {
        for (const attributeNameStrategy of ["none", "camelCase"]) {
            for (const dsd of [[], ["test-light"], ["test-parent", "test-deep"]]) {
                for (const stream of [false, true]) {
                    const expected = program.render(
                        JSON.stringify(state),
                        attributeNameStrategy,
                        stream,
                        markersV2,
                        JSON.stringify(dsd),
                    );
                    assert.deepEqual(
                        await runtime.render("home", state, {
                            dsd,
                            stream,
                            markersV2,
                            attributeNameStrategy,
                        }),
                        stream ? JSON.parse(expected) : expected,
                    );
                }
                for (const name of ["test-parent", "test-light"]) {
                    assert.equal(
                        await runtime.renderShadowRoot(name, state, {
                            dsd,
                            markersV2,
                            attributeNameStrategy,
                        }),
                        program.render_shadow_root(
                            name,
                            JSON.stringify(state),
                            attributeNameStrategy,
                            markersV2,
                            JSON.stringify(dsd),
                        ),
                    );
                }
            }
        }
    }
});

test("missing and corrupt unused bytes are ignored but actually required bytes fail", async t => {
    for (const corrupt of [false, true]) {
        const compiled = compileArtifacts({ entries: { home: source }, templates });
        const id = compiled.manifest.templates["test-parent"];
        if (corrupt) {
            compiled.artifacts.set(id, new Uint8Array([0]));
        } else {
            compiled.artifacts.delete(id);
        }
        const { runtime, loads } = fixture(t, compiled);
        await runtime.render("home", {}, { dsd: [] });
        assert.equal(loads.includes(id), false);
        assert.equal(await runtime.renderShadowRoot("test-parent", {}, { dsd: [] }), "");
        await assert.rejects(
            runtime.render("home"),
            corrupt ? { code: "invalid-prepared-artifact" } : /Missing artifact/,
        );
        await assert.rejects(
            runtime.renderShadowRoot("test-parent"),
            corrupt ? { code: "invalid-prepared-artifact" } : /Missing artifact/,
        );
    }
});

test("selected transitive dependencies fail strictly while excluded transitive bytes are untouched", async t => {
    const compiled = compileArtifacts({ entries: { home: source }, templates });
    const missing = compiled.manifest.templates["test-shadow"];
    compiled.artifacts.delete(missing);
    const { runtime, loads } = fixture(t, compiled);
    await runtime.render("home", {}, { dsd: ["test-parent", "test-deep"] });
    assert.equal(loads.includes(missing), false);
    await assert.rejects(
        runtime.render("home", {}, { dsd: ["test-parent", "test-shadow"] }),
        /Missing artifact/,
    );
    await assert.rejects(
        runtime.renderShadowRoot(
            "test-parent",
            {},
            {
                dsd: ["test-parent", "test-shadow"],
            },
        ),
        /Missing artifact/,
    );
    assert.equal(loads.includes(missing), true);
});

function canonical(value) {
    if (Array.isArray(value)) {
        return value.map(canonical);
    }
    if (value !== null && typeof value === "object") {
        return Object.fromEntries(
            Object.keys(value)
                .sort()
                .map(key => [key, canonical(value[key])]),
        );
    }
    return value;
}

function resign(manifest) {
    const { generation, ...contents } = manifest;
    manifest.generation = createHash("sha256")
        .update(JSON.stringify(canonical(contents)))
        .digest("hex");
}

test("full registry classification and global manifest references remain strict under no DSD", async t => {
    const compiled = compileArtifacts({ entries: { home: source }, templates });
    const unregistered = compileArtifacts({ entries: { home: source }, templates: {} });
    const id = unregistered.manifest.entries.home;
    compiled.manifest.entries.home = id;
    compiled.manifest.pieces[id] = unregistered.manifest.pieces[id];
    compiled.artifacts.set(id, unregistered.artifacts.get(id));
    resign(compiled.manifest);
    const { runtime } = fixture(t, compiled);
    await assert.rejects(runtime.render("home", {}, { dsd: [] }), {
        code: "invalid-prepared-artifact",
    });
    compiled.manifest.pieces[compiled.manifest.templates["test-unused"]].dependencies = [
        "missing-component",
    ];
    resign(compiled.manifest);
    assert.throws(
        () =>
            createPreparedRuntime({
                manifest: compiled.manifest,
                loadArtifact: async () => new Uint8Array(),
            }),
        { code: "invalid-prepared-artifact" },
    );
});

test("policy pruning does not prune state-dependent branches or evaluate skipped diagnostics", async t => {
    const compiled = compileArtifacts({
        entries: {
            home: '<f-when value="{{shown}}"><test-parent></test-parent>{{unfinished</f-when>',
        },
        templates,
    });

    const { runtime, loads, manifest } = fixture(t, compiled);
    assert.equal(
        await runtime.render("home", { shown: false }, { dsd: ["test-parent"] }),
        "",
    );
    assert.deepEqual(
        new Set(loads),
        new Set([manifest.entries.home, manifest.templates["test-parent"]]),
    );
    loads.length = 0;
    assert.equal(await runtime.render("home", { shown: false }, { dsd: [] }), "");
    assert.deepEqual(loads, [manifest.entries.home]);
    await assert.rejects(
        runtime.render("home", { shown: true }, { dsd: [] }),
        error =>
            error.code !== "invalid-prepared-artifact" && typeof error.line === "number",
    );
});

test("prepared nested diagnostics retain the supplied definition's source coordinates", async t => {
    const compiled = compileArtifacts({
        entries: { home: "<test-parent></test-parent>" },
        templates: {
            "test-parent": "<test-child></test-child>",
            "test-child": "<h2>child</h2>\r\n<f-when>invalid</f-when>",
        },
    });
    const { runtime } = fixture(t, compiled);
    for (const markersV2 of [false, true]) {
        await assert.rejects(runtime.render("home", {}, { markersV2 }), {
            code: "missing-value-attribute",
            templateName: "test-child",
            line: 2,
            column: 1,
            length: "<f-when>".length,
        });
    }
});
