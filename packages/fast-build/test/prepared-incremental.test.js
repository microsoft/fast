// @ts-check
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { test } = require("node:test");

const { compileArtifacts } = require("../prepared.js");
const wasm = require("../wasm/microsoft_fast_build.js");

/** @param {import("node:test").TestContext} t */
function observe(t) {
    const originalCompile = wasm.PreparedCompiler.prototype.compile;
    const originalLoad = wasm.PreparedPiece.load;
    const counts = { compilations: 0, loads: 0, failAt: Infinity };
    wasm.PreparedCompiler.prototype.compile = function (...args) {
        counts.compilations++;
        if (counts.compilations === counts.failAt) {
            throw new Error("Preparation failed.");
        }
        return originalCompile.apply(this, args);
    };
    wasm.PreparedPiece.load = function (...args) {
        counts.loads++;
        return originalLoad.apply(this, args);
    };
    t.after(() => {
        wasm.PreparedCompiler.prototype.compile = originalCompile;
        wasm.PreparedPiece.load = originalLoad;
    });
    return counts;
}

/** @param {any} value @returns {any} */
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

/** @param {import("../prepared.js").PreparedManifest} manifest */
function resign(manifest) {
    const { generation: _, ...contents } = manifest;
    manifest.generation = createHash("sha256")
        .update(JSON.stringify(canonical(contents)))
        .digest("hex");
}

test("public incremental preparation compiles only changed content and metadata", t => {
    const counts = observe(t);
    const sources = {
        entries: { main: "<test-parent></test-parent>" },
        templates: {
            "test-parent": "<test-child></test-child>",
            "test-child": {
                content: "<b>before</b>",
                hostAttributes: [{ name: "role", value: "article" }],
                shadowrootAttributes: [{ name: "shadowrootmode", value: "open" }],
            },
            "test-unused": "<i>unused</i>",
        },
    };
    let previous = compileArtifacts(sources);
    assert.equal(counts.compilations, 4);
    const original = structuredClone(previous);
    const unchanged = compileArtifacts(sources, { previous });
    assert.equal(counts.compilations, 4);
    assert.equal(counts.loads, 0);
    assert.deepEqual(unchanged, previous);
    assert.notEqual(unchanged.manifest, previous.manifest);
    assert.notEqual(unchanged.artifacts, previous.artifacts);
    for (const [id, bytes] of unchanged.artifacts) {
        assert.notEqual(bytes, previous.artifacts.get(id));
        assert.notEqual(unchanged.manifest.pieces[id], previous.manifest.pieces[id]);
    }
    previous = unchanged;
    for (const update of [
        () => {
            sources.templates["test-child"].content = "<b>after</b>";
        },
        () => {
            sources.templates["test-child"].hostAttributes[0].value = "region";
        },
        () => {
            sources.templates["test-child"].shadowrootAttributes[0].value = "closed";
        },
    ]) {
        update();
        /** @type {number} */
        const before = counts.compilations;
        const next = compileArtifacts(sources, { previous });
        assert.equal(counts.compilations - before, 1);
        assert.equal(next.manifest.entries.main, previous.manifest.entries.main);
        assert.equal(
            next.manifest.templates["test-parent"],
            previous.manifest.templates["test-parent"],
        );
        assert.notEqual(
            next.manifest.templates["test-child"],
            previous.manifest.templates["test-child"],
        );
        previous = next;
    }
    assert.equal(counts.loads, 0);
    assert.deepEqual(structuredClone(unchanged), original);
});

test("registry membership invalidates only callers mentioning the changed names", t => {
    const counts = observe(t);
    /** @type {Record<string, string>} */
    const templates = { "test-parent": "<test-child></test-child>" };
    const sources = {
        entries: {
            main: "<test-parent></test-parent>",
            other: "<p>stable</p>",
        },
        templates,
    };
    let previous = compileArtifacts(sources);
    assert.equal(counts.compilations, 3);
    const original = previous;
    templates["test-unrelated"] = "<aside>unrelated</aside>";
    let next = compileArtifacts(sources, { previous });
    assert.equal(counts.compilations, 4);
    assert.deepEqual(next.manifest.entries, previous.manifest.entries);
    assert.equal(
        next.manifest.templates["test-parent"],
        previous.manifest.templates["test-parent"],
    );
    previous = next;
    delete templates["test-unrelated"];
    next = compileArtifacts(sources, { previous });
    assert.equal(counts.compilations, 4);
    assert.equal(next.manifest.generation, original.manifest.generation);
    previous = next;
    templates["test-child"] = "<b>child</b>";
    next = compileArtifacts(sources, { previous });
    assert.equal(counts.compilations, 6);
    assert.deepEqual(next.manifest.entries, previous.manifest.entries);
    assert.notEqual(
        next.manifest.templates["test-parent"],
        previous.manifest.templates["test-parent"],
    );
    previous = next;
    delete templates["test-child"];
    next = compileArtifacts(sources, { previous });
    assert.equal(counts.compilations, 7);
    assert.equal(next.manifest.generation, original.manifest.generation);
    assert.equal(counts.loads, 0);
});

test("previous results validate compatibility, complete bytes and native provenance", t => {
    const counts = observe(t);
    const sources = {
        entries: { main: "<test-child></test-child>" },
        templates: { "test-child": "<b>child</b>" },
    };
    const previous = compileArtifacts(sources);
    const original = structuredClone(previous);
    const id = previous.manifest.entries.main;
    const copied = compileArtifacts(sources, { previous: structuredClone(previous) });
    assert.equal(counts.compilations, 2);
    assert.equal(counts.loads, 2);
    assert.deepEqual(copied, previous);
    compileArtifacts(sources, { previous: copied });
    assert.equal(counts.loads, 2);
    /** @type {((value: import("../prepared.js").PreparedArtifacts) => void)[]} */
    const damage = [
        value => {
            value.manifest.compiler = "incompatible";
        },
        value => {
            value.manifest.version = /** @type {2} */ (1);
        },
        value => {
            value.artifacts.delete(id);
        },
        value => {
            const bytes = value.artifacts.get(id);
            assert.ok(bytes);
            bytes[0] ^= 1;
        },
        value => {
            value.manifest.pieces[id].dependencies = [];
            resign(value.manifest);
        },
        value => {
            const bytes = new Uint8Array([0]);
            value.artifacts.set(id, bytes);
            value.manifest.pieces[id].checksum = createHash("sha256")
                .update(bytes)
                .digest("hex");
            resign(value.manifest);
        },
    ];
    for (const mutate of damage) {
        const invalid = compileArtifacts(sources, { previous });
        mutate(invalid);
        assert.throws(() => compileArtifacts(sources, { previous: invalid }), {
            code: "invalid-prepared-artifact",
        });
        assert.equal(counts.compilations, 2);
    }
    assert.deepEqual(structuredClone(previous), original);
});

test("failed candidate preparation leaves the previous complete result reusable", t => {
    const counts = observe(t);
    const sources = {
        entries: { main: "<test-child></test-child>" },
        templates: { "test-child": "<b>before</b>" },
    };
    const previous = compileArtifacts(sources);
    const original = structuredClone(previous);
    counts.failAt = counts.compilations + 2;
    assert.throws(
        () =>
            compileArtifacts(
                {
                    entries: { main: "<main><test-child></test-child></main>" },
                    templates: { "test-child": "<b>after</b>" },
                },
                { previous },
            ),
        /Preparation failed/,
    );
    assert.deepEqual(structuredClone(previous), original);
    const before = counts.compilations;
    assert.deepEqual(compileArtifacts(sources, { previous }), previous);
    assert.equal(counts.compilations, before);
    assert.equal(counts.loads, 0);
});
