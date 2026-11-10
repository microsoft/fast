// @ts-check
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const { test } = require("node:test");
const { setTimeout: delay } = require("node:timers/promises");

const typescript = require("typescript");

const {
    compileArtifacts,
    createPreparedRuntime,
    loadRenderer,
    prepareRenderer,
} = require("../prepared.js");
const wasm = require("../wasm/microsoft_fast_build.js");

async function fixture(t) {
    const root = await fs.mkdtemp(path.join(__dirname, ".fast-prepared-"));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    return { root, cacheDirectory: path.join(root, "pieces") };
}

async function manifest(renderer) {
    return JSON.parse(await fs.readFile(renderer.manifestPath, "utf8"));
}

test("prepared pieces preserve HTML, exact chunks, metadata and request isolation", async t => {
    const { cacheDirectory } = await fixture(t);
    const entry =
        '<f-repeat value="{{item in items}}"><test-card title="{{item.title}}">' +
        "<i>{{item.title}}</i></test-card></f-repeat>";
    const templates = {
        "test-card": {
            content:
                "<code>{{literal}}</code>" +
                '<f-when value="{{shown}}"><b title="{{title}}">{{title}}</b></f-when>',
            shadowrootAttributes: [{ name: "shadowrootmode", value: "closed" }],
            hostAttributes: [{ name: "role", value: "article" }],
        },
        "test-unused": "<b>unused</b>",
    };
    const renderer = await prepareRenderer({ entry, templates, cacheDirectory });
    t.after(() => renderer.dispose());
    for (const markersV2 of [false, true]) {
        for (const attributeNameStrategy of ["none", "camelCase"]) {
            for (const title of ["first<&", "second"]) {
                const state = { shown: true, items: [{ title }, { title: "other" }] };
                for (const stream of [false, true]) {
                    const expected = wasm.render_entry_with_templates(
                        entry,
                        JSON.stringify(templates),
                        JSON.stringify(state),
                        attributeNameStrategy,
                        stream,
                        markersV2,
                    );
                    assert.deepEqual(
                        await renderer.render(state, {
                            stream,
                            markersV2,
                            attributeNameStrategy,
                        }),
                        stream ? JSON.parse(expected) : expected,
                    );
                }
            }
        }
    }
});

test("generated pieces reload in a fresh process without sources and after eviction", async t => {
    const { root, cacheDirectory } = await fixture(t);
    const entryFile = path.join(root, "entry.html");
    const templatesFile = path.join(root, "templates.html");
    await fs.writeFile(entryFile, "<test-card></test-card>");
    await fs.writeFile(
        templatesFile,
        '<f-template name="test-card"><template><b>{{title}}</b></template></f-template>',
    );
    const prepared = await prepareRenderer({
        entryFile,
        templateFiles: [templatesFile],
        cacheDirectory,
        maxMemoryBytes: 0,
    });
    await prepared.dispose();
    await fs.rm(entryFile);
    await fs.rm(templatesFile);
    const renderer = await loadRenderer({
        manifestPath: prepared.manifestPath,
        maxMemoryBytes: 0,
    });
    t.after(() => renderer.dispose());
    for (const title of ["first", "second"]) {
        const output = await renderer.render({ title });
        assert.match(output, new RegExp(title));
        assert.equal(renderer.memoryUsage.bytes, 0);
        assert.equal(renderer.memoryUsage.pieces, 0);
    }
    const child = spawnSync(
        process.execPath,
        [
            "-e",
            `const {loadRenderer} = require(${JSON.stringify(path.resolve(__dirname, "../prepared.js"))});
            (async () => {
                const renderer = await loadRenderer({manifestPath: process.argv[1]});
                try { process.stdout.write(await renderer.render({title:"fresh-process"})); }
                finally { await renderer.dispose(); }
            })().catch(error => { console.error(error); process.exitCode = 1; });`,
            prepared.manifestPath,
        ],
        { encoding: "utf8" },
    );
    assert.equal(child.status, 0, child.stderr);
    assert.match(child.stdout, /fresh-process/);
});

test("refresh regenerates changed pieces but not unchanged callers or unused pieces", async t => {
    const { cacheDirectory } = await fixture(t);
    const renderer = await prepareRenderer({
        entry: "<test-parent></test-parent>",
        templates: {
            "test-parent": "<test-child></test-child>",
            "test-child": "<b>old</b>",
            "test-unused": "<i>unused</i>",
        },
        cacheDirectory,
    });
    t.after(() => renderer.dispose());
    const before = await manifest(renderer);
    const unchanged = [
        before.entries.default,
        before.templates["test-parent"],
        before.templates["test-unused"],
    ];
    const mtimes = await Promise.all(
        unchanged.map(id =>
            fs.stat(path.join(cacheDirectory, `${id}.fast-artifact.json`)),
        ),
    );
    const originalLoad = wasm.PreparedPiece.load;
    const originalCompile = wasm.PreparedCompiler.prototype.compile;
    let loads = 0;
    let compilations = 0;
    wasm.PreparedPiece.load = function (...args) {
        loads++;
        return originalLoad.apply(this, args);
    };
    wasm.PreparedCompiler.prototype.compile = function (...args) {
        compilations++;
        return originalCompile.apply(this, args);
    };
    try {
        await renderer.refresh({
            templates: {
                "test-parent": "<test-child></test-child>",
                "test-child": "<b>new</b>",
                "test-unused": "<i>unused</i>",
            },
        });
        assert.equal(loads, 0);
        assert.equal(compilations, 1);
    } finally {
        wasm.PreparedPiece.load = originalLoad;
        wasm.PreparedCompiler.prototype.compile = originalCompile;
    }
    const after = await manifest(renderer);
    assert.notEqual(after.generation, before.generation);
    assert.notEqual(after.templates["test-child"], before.templates["test-child"]);
    assert.equal(after.templates["test-parent"], before.templates["test-parent"]);
    assert.equal(after.templates["test-unused"], before.templates["test-unused"]);
    for (const [index, id] of unchanged.entries()) {
        assert.equal(
            (await fs.stat(path.join(cacheDirectory, `${id}.fast-artifact.json`)))
                .mtimeMs,
            mtimes[index].mtimeMs,
        );
    }
    assert.match(await renderer.render(), /<b>new<\/b>/);
    assert.equal(
        (await fs.readdir(cacheDirectory)).some(name => name.endsWith(".tmp")),
        false,
    );
});

test("registry additions, removals and host metadata regenerate affected pieces", async t => {
    const { cacheDirectory } = await fixture(t);
    const entry = "<test-parent></test-parent>";
    const parent = "<test-child></test-child>";
    const renderer = await prepareRenderer({
        entry,
        templates: { "test-parent": parent },
        cacheDirectory,
    });
    t.after(() => renderer.dispose());
    const before = await manifest(renderer);
    await renderer.refresh({
        templates: {
            "test-parent": parent,
            "test-child": {
                content: "<b>child</b>",
                hostAttributes: [{ name: "role", value: "button" }],
            },
        },
    });
    const added = await manifest(renderer);
    assert.equal(added.entries.default, before.entries.default);
    assert.notEqual(added.templates["test-parent"], before.templates["test-parent"]);
    assert.match(await renderer.render(), /<test-child role="button">/);
    await renderer.refresh({
        templates: {
            "test-parent": parent,
            "test-child": {
                content: "<b>child</b>",
                hostAttributes: [{ name: "role", value: "region" }],
                shadowrootAttributes: [{ name: "shadowrootmode", value: "closed" }],
            },
        },
    });
    const metadata = await manifest(renderer);
    assert.notEqual(metadata.templates["test-child"], added.templates["test-child"]);
    assert.equal(metadata.templates["test-parent"], added.templates["test-parent"]);
    assert.match(
        await renderer.render(),
        /<test-child role="region"><template shadowrootmode="closed"/,
    );
    await renderer.refresh({ templates: { "test-parent": parent } });
    assert.equal(
        (await manifest(renderer)).templates["test-parent"],
        before.templates["test-parent"],
    );
    assert.doesNotMatch(await renderer.render(), /<b>child<\/b>/);
});

test("in-flight requests pin an old snapshot while a refresh publishes replacements", async t => {
    const { cacheDirectory } = await fixture(t);
    const renderer = await prepareRenderer({
        entry: "<test-card></test-card>",
        templates: { "test-card": "<b>old</b>" },
        cacheDirectory,
        maxMemoryBytes: 0,
    });
    t.after(() => renderer.dispose());
    const old = await manifest(renderer);
    const filename = path.join(
        cacheDirectory,
        `${old.entries.default}.fast-artifact.json`,
    );
    const original = fs.readFile;
    let unblock;
    const gate = new Promise(resolve => {
        unblock = resolve;
    });
    let began;
    const started = new Promise(resolve => {
        began = resolve;
    });
    let intercepted = false;
    fs.readFile = async function (file, ...args) {
        if (file === filename && !intercepted) {
            intercepted = true;
            began();
            await gate;
        }
        return original.call(this, file, ...args);
    };
    t.after(() => {
        fs.readFile = original;
        unblock();
    });
    const pending = renderer.render();
    await started;
    await renderer.refresh({ templates: { "test-card": "<b>new</b>" } });
    unblock();
    assert.match(await pending, /<b>old<\/b>/);
    fs.readFile = original;
    assert.match(await renderer.render(), /<b>new<\/b>/);
    assert.equal(renderer.memoryUsage.bytes, 0);
});

test("failed refreshes preserve the active snapshot and copied input definitions", async t => {
    const { cacheDirectory } = await fixture(t);
    const templates = { "test-card": "<b>original</b>" };
    const renderer = await prepareRenderer({
        entry: "<test-card></test-card>",
        templates,
        cacheDirectory,
    });
    t.after(() => renderer.dispose());
    const generation = renderer.generation;
    templates["test-card"] = "<b>external mutation</b>";
    await renderer.refresh();
    assert.equal(renderer.generation, generation);
    await assert.rejects(
        renderer.refresh({
            templates: { "test-card": { content: "bad", formatVersion: 999 } },
        }),
        { code: "invalid-template-metadata" },
    );
    assert.equal(renderer.generation, generation);
    assert.match(await renderer.render(), /original/);
});

test("corrupt pieces fail closed and source refresh repairs durable artifacts", async t => {
    const { cacheDirectory } = await fixture(t);
    const renderer = await prepareRenderer({
        entry: "<b>{{title}}</b>",
        cacheDirectory,
        maxMemoryBytes: 0,
    });
    t.after(() => renderer.dispose());
    const snapshot = await manifest(renderer);
    const filename = path.join(
        cacheDirectory,
        `${snapshot.entries.default}.fast-artifact.json`,
    );
    await fs.writeFile(filename, "{}");
    await assert.rejects(renderer.render(), { code: "invalid-prepared-artifact" });
    assert.equal(renderer.memoryUsage.bytes, 0);
    await renderer.refresh();
    assert.equal(await renderer.render({ title: "repaired" }), "<b>repaired</b>");
    const input = JSON.parse(await fs.readFile(renderer.manifestPath, "utf8"));
    input.compiler = "old";
    await fs.writeFile(renderer.manifestPath, JSON.stringify(input));
    await assert.rejects(loadRenderer({ manifestPath: renderer.manifestPath }), {
        code: "invalid-prepared-artifact",
    });
});

test("concurrent cold loads share leases and disposal waits for active requests", async t => {
    const { cacheDirectory } = await fixture(t);
    const renderer = await prepareRenderer({
        entry: "<test-card></test-card>",
        templates: { "test-card": "<b>{{title}}</b>" },
        cacheDirectory,
        maxMemoryBytes: 0,
    });
    const original = fs.readFile;
    const reads = new Map();
    fs.readFile = function (file, ...args) {
        reads.set(file, (reads.get(file) ?? 0) + 1);
        return original.call(this, file, ...args);
    };
    t.after(() => {
        fs.readFile = original;
    });
    const renders = Array.from({ length: 10 }, (_, title) => renderer.render({ title }));
    const disposed = renderer.dispose();
    const results = await Promise.all(renders);
    for (const [index, result] of results.entries()) {
        assert.match(result, new RegExp(`>${index}<!--fe:/b-->`));
    }
    await disposed;
    assert.deepEqual(renderer.memoryUsage, { bytes: 0, pieces: 0, pendingLoads: 0 });
    assert.equal(reads.size, 2);
    assert.ok([...reads.values()].every(count => count === 1));
    assert.throws(() => renderer.render(), /disposed/);
    await renderer.dispose();
});

test("bounded caches preload dependency cycles but do not load unreachable definitions", async t => {
    const { cacheDirectory } = await fixture(t);
    const renderer = await prepareRenderer({
        entry: "<test-card></test-card>",
        templates: {
            "test-card": '<f-when value="{{shown}}"><test-card></test-card></f-when>',
            "test-unused": "<i>unreachable</i>",
        },
        cacheDirectory,
        maxMemoryBytes: 1000,
    });
    t.after(() => renderer.dispose());
    const snapshot = await manifest(renderer);
    await fs.rm(
        path.join(
            cacheDirectory,
            `${snapshot.templates["test-unused"]}.fast-artifact.json`,
        ),
    );
    assert.match(await renderer.render({ shown: false }), /<test-card>/);
    assert.ok(renderer.memoryUsage.bytes <= 1000);
    await renderer.dispose();
    const reader = await loadRenderer({
        manifestPath: renderer.manifestPath,
        maxMemoryBytes: 1000,
    });
    t.after(() => reader.dispose());
    await fs.writeFile(
        path.join(
            cacheDirectory,
            `${snapshot.templates["test-card"]}.fast-artifact.json`,
        ),
        "{}",
    );
    await assert.rejects(reader.render(), { code: "invalid-prepared-artifact" });
    assert.ok(reader.memoryUsage.bytes <= 1000);
    assert.equal(reader.memoryUsage.pendingLoads, 0);
});

test("published prepared declarations resolve and distinguish HTML from chunks", async t => {
    const { root } = await fixture(t);
    const file = path.join(root, "consumer.mts");
    const api = path.resolve(__dirname, "../prepared.js").replaceAll("\\", "/");
    await fs.writeFile(
        file,
        `
        import { compileArtifacts, createPreparedRuntime, prepareRenderer, loadRenderer } from ${JSON.stringify(api)};
        async function use() {
            const renderer = await prepareRenderer({
                entry: "<test-card></test-card>",
                templates: { "test-card": { content: "<b>{{title}}</b>" } },
                cacheDirectory: "./generated",
            });
            const html: string = await renderer.render({title: "request"});
            const chunks: string[] = await renderer.render({}, {stream: true});
            // @ts-expect-error HTML rendering does not return chunks.
            const invalid: string[] = await renderer.render();
            await renderer.refresh({templates: {"test-card": "<b>new</b>"}});
            await renderer.dispose();
            const loaded = await loadRenderer({manifestPath: "./generated/manifest.json"});
            await loaded.dispose();
            const {manifest, artifacts} = compileArtifacts({
                entries: {home: "<test-card></test-card>"},
                templates: {"test-card": {content: "<b>hello</b>"}},
            });
            const runtime = createPreparedRuntime({
                manifest, loadArtifact: async id => artifacts.get(id)!,
            });
            const page: string = await runtime.render("home", {}, {dsd: []});
            const stream: string[] = await runtime.render("home", {}, {stream: true, dsd: ["test-card"]});
            const fragment: string = await runtime.renderShadowRoot("test-card", {}, {dsd: "all"});
            // @ts-expect-error Fragment rendering does not return chunks.
            const wrong: string[] = await runtime.renderShadowRoot("test-card");
            // @ts-expect-error Fragment rendering does not take streaming options.
            await runtime.renderShadowRoot("test-card", {}, {stream: true});
            runtime.activate(manifest);
            await runtime.dispose();
        }
    `,
    );
    const program = typescript.createProgram([file], {
        module: typescript.ModuleKind.NodeNext,
        moduleResolution: typescript.ModuleResolutionKind.NodeNext,
        target: typescript.ScriptTarget.ESNext,
        strict: true,
        noEmit: true,
        types: [],
    });
    const diagnostics = typescript.getPreEmitDiagnostics(program);
    assert.equal(
        diagnostics.length,
        0,
        diagnostics
            .map(diagnostic =>
                typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
            )
            .join("\n"),
    );
});

test("in-memory multi-entry compilation is deterministic, deduplicated and filesystem independent", async () => {
    const originalRead = fs.readFile;
    const originalWrite = fs.writeFile;
    const originalCompile = wasm.PreparedCompiler.prototype.compile;
    let compilations = 0;
    fs.readFile = async () => {
        throw new Error("unexpected filesystem read");
    };
    fs.writeFile = async () => {
        throw new Error("unexpected filesystem write");
    };
    wasm.PreparedCompiler.prototype.compile = function (...args) {
        compilations++;
        return originalCompile.apply(this, args);
    };
    let runtime;
    try {
        const first = compileArtifacts({
            entries: {
                home: "<test-card></test-card>",
                duplicate: "<test-card></test-card>",
            },
            templates: { "test-unused": "unused", "test-card": "<b>{{title}}</b>" },
        });
        assert.equal(compilations, 3);
        assert.equal(first.manifest.version, 2);
        assert.equal(first.manifest.entries.home, first.manifest.entries.duplicate);
        const second = compileArtifacts({
            templates: { "test-card": "<b>{{title}}</b>", "test-unused": "unused" },
            entries: {
                duplicate: "<test-card></test-card>",
                home: "<test-card></test-card>",
            },
        });
        assert.deepEqual(first.manifest, second.manifest);
        assert.deepEqual(first.artifacts, second.artifacts);
        runtime = createPreparedRuntime({
            manifest: first.manifest,
            loadArtifact: async id => {
                const bytes = first.artifacts.get(id);
                assert.ok(bytes);
                return bytes;
            },
        });
        assert.match(await runtime.render("home", { title: "memory" }), /memory/);
        assert.match(
            (
                await runtime.render("duplicate", { title: "chunks" }, { stream: true })
            ).join(""),
            /chunks/,
        );
    } finally {
        await runtime?.dispose();
        fs.readFile = originalRead;
        fs.writeFile = originalWrite;
        wasm.PreparedCompiler.prototype.compile = originalCompile;
    }
});

test("one runtime shares leases and an aggregate memory budget across entries", async () => {
    const { manifest, artifacts } = compileArtifacts({
        entries: {
            first: "<test-card></test-card>",
            second: "<main><test-card></test-card></main>",
        },
        templates: { "test-card": "<b>{{title}}</b>" },
    });
    const reads = new Map();
    const runtime = createPreparedRuntime({
        manifest,
        maxMemoryBytes: 0,
        loadArtifact: async id => {
            reads.set(id, (reads.get(id) ?? 0) + 1);
            const bytes = artifacts.get(id);
            assert.ok(bytes);
            return bytes;
        },
    });
    try {
        const outputs = await Promise.all([
            runtime.render("first", { title: "one" }),
            runtime.render("second", { title: "two" }),
            runtime.render("first", { title: "three" }),
        ]);
        assert.match(outputs[0], /one/);
        assert.match(outputs[1], /two/);
        assert.match(outputs[2], /three/);
        assert.equal(reads.size, 3);
        assert.ok([...reads.values()].every(count => count === 1));
        assert.deepEqual(runtime.memoryUsage, { bytes: 0, pieces: 0, pendingLoads: 0 });
    } finally {
        await runtime.dispose();
    }
    const sizes = new Map(
        [...artifacts].map(([id, bytes]) => {
            const piece = wasm.PreparedPiece.load(bytes);
            try {
                return [id, piece.memory_bytes];
            } finally {
                piece.free();
            }
        }),
    );
    const budget =
        sizes.get(manifest.templates["test-card"]) +
        Math.max(...Object.values(manifest.entries).map(id => sizes.get(id)));
    const boundedReads = new Map();
    const bounded = createPreparedRuntime({
        manifest,
        maxMemoryBytes: budget,
        loadArtifact: async id => {
            boundedReads.set(id, (boundedReads.get(id) ?? 0) + 1);
            const bytes = artifacts.get(id);
            assert.ok(bytes);
            return bytes;
        },
    });
    try {
        for (const name of ["first", "second", "first"]) {
            await bounded.render(name);
            assert.ok(bounded.memoryUsage.bytes <= budget);
            assert.equal(bounded.memoryUsage.pieces, 2);
        }
        assert.equal(boundedReads.get(manifest.templates["test-card"]), 1);
        assert.equal(boundedReads.get(manifest.entries.first), 2);
        assert.equal(boundedReads.get(manifest.entries.second), 1);
    } finally {
        await bounded.dispose();
    }
});

test("runtime activation copies snapshots, keeps old requests coherent and drains disposal", async () => {
    const first = compileArtifacts({
        entries: { home: "<test-card></test-card>" },
        templates: { "test-card": "old" },
    });
    const second = compileArtifacts({
        entries: { home: "<test-card></test-card>" },
        templates: { "test-card": "new" },
    });
    const artifacts = new Map([...first.artifacts, ...second.artifacts]);
    let unblock;
    const gate = new Promise(resolve => {
        unblock = resolve;
    });
    let started;
    const began = new Promise(resolve => {
        started = resolve;
    });
    let blocked = true;
    let reads = 0;
    const runtime = createPreparedRuntime({
        manifest: first.manifest,
        maxMemoryBytes: 0,
        loadArtifact: async id => {
            reads++;
            if (blocked) {
                blocked = false;
                started();
                await gate;
            }
            const bytes = artifacts.get(id);
            assert.ok(bytes);
            return bytes;
        },
    });
    try {
        first.manifest.templates["test-card"] = "external mutation";
        const pending = runtime.render("home");
        await began;
        const generation = runtime.activate(second.manifest);
        assert.equal(generation, second.manifest.generation);
        second.manifest.templates["test-card"] = "external mutation";
        const next = runtime.render("home");
        const disposing = runtime.dispose();
        assert.throws(() => runtime.activate(second.manifest), /disposed/);
        assert.throws(() => runtime.render("home"), /disposed/);
        unblock();
        assert.match(await pending, />old<\/template>/);
        assert.match(await next, />new<\/template>/);
        await disposing;
        assert.ok(reads > 0);
        assert.deepEqual(runtime.memoryUsage, { bytes: 0, pieces: 0, pendingLoads: 0 });
    } finally {
        unblock();
        await runtime.dispose();
    }
});

test("runtime rejects invalid manifests before I/O and missing or corrupt bytes without compilation", async () => {
    const result = compileArtifacts({ entries: { home: "<b>{{title}}</b>" } });
    let reads = 0;
    const runtime = createPreparedRuntime({
        manifest: result.manifest,
        maxMemoryBytes: 0,
        loadArtifact: async () => {
            reads++;
            return new Uint8Array();
        },
    });
    try {
        for (const invalid of [
            { ...result.manifest, generation: "0".repeat(64) },
            { ...result.manifest, compiler: "old" },
            { ...result.manifest, version: 1 },
            { ...result.manifest, pieces: {} },
        ]) {
            assert.throws(() => runtime.activate(invalid), {
                code: "invalid-prepared-artifact",
            });
            assert.equal(runtime.generation, result.manifest.generation);
        }
        assert.equal(reads, 0);
        await assert.rejects(runtime.render("unknown"), /Unknown prepared entry/);
        await assert.rejects(runtime.render("home"), {
            code: "invalid-prepared-artifact",
        });
        assert.deepEqual(runtime.memoryUsage, { bytes: 0, pieces: 0, pendingLoads: 0 });
        assert.throws(() => runtime.render("home", {}, { dsd: "invalid" }), /dsd/);
    } finally {
        await runtime.dispose();
    }
    const missing = createPreparedRuntime({
        manifest: result.manifest,
        loadArtifact: async () => {
            throw new Error("storage unavailable");
        },
    });
    try {
        await assert.rejects(missing.render("home"), /storage unavailable/);
        assert.equal(missing.memoryUsage.pendingLoads, 0);
    } finally {
        await missing.dispose();
    }
});

test("descriptor changes cannot reuse warm or pending cache records across activation", async t => {
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

    for (const warm of [false, true]) {
        for (const field of ["checksum", "dependencies"]) {
            await t.test(
                `${warm ? "warm" : "pending"} identity, changed ${field}`,
                async () => {
                    const initial = compileArtifacts({
                        entries: { home: "<test-card></test-card>" },
                        templates: { "test-card": "initial" },
                    });
                    const current = compileArtifacts({
                        entries: { home: "<test-card></test-card>" },
                        templates: { "test-card": "current" },
                    });
                    const artifacts = new Map([
                        ...initial.artifacts,
                        ...current.artifacts,
                    ]);
                    const root = current.manifest.entries.home;
                    let unblock;
                    const gate = new Promise(resolve => {
                        unblock = resolve;
                    });
                    let started;
                    const began = new Promise(resolve => {
                        started = resolve;
                    });
                    let blockId;
                    let blocked = false;
                    const reads = new Map();
                    const runtime = createPreparedRuntime({
                        manifest: initial.manifest,
                        loadArtifact: async id => {
                            reads.set(id, (reads.get(id) ?? 0) + 1);
                            if (id === blockId && !blocked) {
                                blocked = true;
                                started();
                                await gate;
                            }
                            const bytes = artifacts.get(id);
                            assert.ok(bytes);
                            return bytes;
                        },
                    });
                    try {
                        if (warm) {
                            assert.match(await runtime.render("home"), /initial/);
                        }
                        runtime.activate(current.manifest);
                        const contradictory = JSON.parse(
                            JSON.stringify(current.manifest),
                        );
                        if (field === "checksum") {
                            contradictory.pieces[root].checksum = "0".repeat(64);
                        } else {
                            contradictory.pieces[root].dependencies = [];
                        }
                        delete contradictory.generation;
                        contradictory.generation = createHash("sha256")
                            .update(JSON.stringify(canonical(contradictory)))
                            .digest("hex");
                        blockId = warm ? current.manifest.templates["test-card"] : root;
                        const pending = runtime.render("home");
                        await began;
                        current.manifest.templates["test-card"] = "external mutation";
                        current.manifest.pieces[root].dependencies.length = 0;
                        runtime.activate(contradictory);
                        // Repairing the caller's object cannot repair the published bad descriptor.
                        contradictory.pieces[root] = structuredClone(
                            initial.manifest.pieces[root],
                        );
                        await assert.rejects(runtime.render("home"), {
                            code: "invalid-prepared-artifact",
                        });
                        assert.equal(runtime.memoryUsage.pendingLoads, 1);
                        const disposing = runtime.dispose();
                        unblock();
                        assert.match(await pending, />current<\/template>/);
                        await disposing;
                        assert.equal(reads.get(root), 2);
                        assert.deepEqual(runtime.memoryUsage, {
                            bytes: 0,
                            pieces: 0,
                            pendingLoads: 0,
                        });
                    } finally {
                        unblock();
                        await runtime.dispose();
                    }
                },
            );
        }
    }
});

test("native selection snapshots allowlists and state before asynchronous artifact loads", async t => {
    const { manifest: snapshot, artifacts } = compileArtifacts({
        entries: { home: "<test-card></test-card>" },
        templates: { "test-card": "<b>{{title}}</b>" },
    });
    for (const fragment of [false, true]) {
        for (const include of [false, true]) {
            await t.test(
                `${fragment ? "fragment" : "entry"} initially ${include ? "included" : "excluded"}`,
                async () => {
                    let unblock;
                    const gate = new Promise(resolve => {
                        unblock = resolve;
                    });
                    let started;
                    const began = new Promise(resolve => {
                        started = resolve;
                    });
                    let blocked = false;
                    const runtime = createPreparedRuntime({
                        manifest: snapshot,
                        loadArtifact: async id => {
                            if (!blocked) {
                                blocked = true;
                                started();
                                await gate;
                            }
                            const bytes = artifacts.get(id);
                            assert.ok(bytes);
                            return bytes;
                        },
                    });
                    try {
                        const dsd = include ? ["test-card"] : [];
                        const state = { title: "captured" };
                        const options = { dsd };
                        const pending = fragment
                            ? runtime.renderShadowRoot("test-card", state, options)
                            : runtime.render("home", state, options);
                        await began;
                        dsd.splice(0, dsd.length, ...(include ? [] : ["test-card"]));
                        state.title = "mutated";
                        unblock();
                        const output = await pending;
                        if (include) {
                            assert.match(output, /shadowrootmode=/);
                            assert.match(output, /captured/);
                            assert.doesNotMatch(output, /mutated/);
                        } else {
                            assert.equal(
                                output,
                                fragment ? "" : "<test-card></test-card>",
                            );
                        }
                    } finally {
                        unblock();
                        await runtime.dispose();
                    }
                },
            );
        }
    }
});

test("filesystem convenience preparation rejects another entry and allows explicit source refresh", async t => {
    const { cacheDirectory } = await fixture(t);
    const renderer = await prepareRenderer({ entry: "<b>first</b>", cacheDirectory });
    t.after(() => renderer.dispose());
    await assert.rejects(
        prepareRenderer({ entry: "<i>second</i>", cacheDirectory }),
        /already owned/,
    );
    assert.equal(await renderer.render(), "<b>first</b>");
    await renderer.refresh({ entry: "<i>second</i>" });
    assert.equal(await renderer.render(), "<i>second</i>");
    await renderer.dispose();
    const restarted = await prepareRenderer({
        entry: "<u>restart rebuild</u>",
        cacheDirectory,
    });
    t.after(() => restarted.dispose());
    assert.equal(await restarted.render(), "<u>restart rebuild</u>");
});

test("filesystem adapters never silently replace a multi-entry deployment", async t => {
    const { cacheDirectory } = await fixture(t);
    await fs.mkdir(cacheDirectory);
    const { manifest: deployment } = compileArtifacts({
        entries: { first: "first", second: "second" },
    });
    const filename = path.join(cacheDirectory, "manifest.json");
    const bytes = JSON.stringify(deployment);
    await fs.writeFile(filename, bytes);
    await assert.rejects(
        prepareRenderer({
            cacheDirectory,
            entry: "replacement",
        }),
        /multi-entry manifest/,
    );
    assert.equal(await fs.readFile(filename, "utf8"), bytes);
    await assert.rejects(
        loadRenderer({ manifestPath: filename }),
        /single default entry/,
    );
});

test("native selection preserves excluded authored hosts and supports component-root fragments", async () => {
    const { manifest, artifacts } = compileArtifacts({
        entries: {
            home: '<test-parent title="{{title}}"><i>{{title}}</i></test-parent>',
            broken: "<test-unrelated></test-unrelated>",
        },
        templates: {
            "test-parent": {
                content: "<b>{{title}}</b><test-child></test-child>",
                hostAttributes: [{ name: "role", value: "article" }],
            },
            "test-child": "<em>{{title}}</em>",
            "test-unrelated": "<strong>unrelated</strong>",
        },
    });
    const reads = new Set();
    const runtime = createPreparedRuntime({
        manifest,
        maxMemoryBytes: 0,
        loadArtifact: async id => {
            reads.add(id);
            assert.notEqual(id, manifest.entries.broken);
            assert.notEqual(id, manifest.templates["test-unrelated"]);
            const bytes = artifacts.get(id);
            assert.ok(bytes);
            return bytes;
        },
    });
    try {
        const excluded = await runtime.render("home", { title: "request" }, { dsd: [] });
        assert.match(excluded, /^<test-parent title="request"><i>/);
        assert.doesNotMatch(excluded, /role=|shadowroot|<b>|<em>/);
        const selected = await runtime.render(
            "home",
            { title: "request" },
            { dsd: ["test-parent"] },
        );
        assert.match(selected, /role="article"/);
        assert.match(selected, /<b>/);
        assert.match(selected, /<test-child><\/test-child>/);
        assert.doesNotMatch(selected, /<em>/);
        const all = await runtime.render("home", { title: "request" });
        assert.match(all, /<em>/);
        assert.deepEqual(
            await runtime.render("home", { title: "request" }, { stream: true, dsd: [] }),
            JSON.parse(
                wasm.render_entry_with_templates(
                    '<test-parent title="{{title}}"><i>{{title}}</i></test-parent>',
                    "{}",
                    JSON.stringify({ title: "request" }),
                    undefined,
                    true,
                    false,
                ),
            ),
        );
        reads.clear();
        const fragment = await runtime.renderShadowRoot("test-parent", {
            title: "fragment",
        });
        assert.match(fragment, /^<template shadowrootmode="open"/);
        assert.match(fragment, /fragment/);
        assert.match(fragment, /<em>/);
        assert.ok(!reads.has(manifest.entries.home));
        assert.deepEqual(
            reads,
            new Set([
                manifest.templates["test-parent"],
                manifest.templates["test-child"],
            ]),
        );
        assert.equal(await runtime.renderShadowRoot("test-parent", {}, { dsd: [] }), "");
        await assert.rejects(
            runtime.renderShadowRoot("unknown", {}, { dsd: [] }),
            /Unknown prepared component/,
        );
    } finally {
        await runtime.dispose();
    }
});

test("development watching follows atomic file replacement and reports invalid updates", {
    timeout: 10000,
}, async t => {
    const { root, cacheDirectory } = await fixture(t);
    const filename = path.join(root, "templates.html");
    await fs.writeFile(
        filename,
        '<f-template name="test-card"><template>old</template></f-template>',
    );
    const errors = [];
    const renderer = await prepareRenderer({
        entry: "<test-card></test-card>",
        templateFiles: [filename],
        cacheDirectory,
        watch: true,
        onError: error => errors.push(error),
    });
    t.after(() => renderer.dispose());
    const oldGeneration = renderer.generation;
    const replacement = path.join(root, "replacement.html");
    await fs.writeFile(
        replacement,
        '<f-template name="test-card"><template>new</template></f-template>',
    );
    await fs.rename(replacement, filename);
    const deadline = Date.now() + 3000;
    while (renderer.generation === oldGeneration && Date.now() < deadline) {
        await delay(10);
    }
    assert.notEqual(renderer.generation, oldGeneration);
    assert.match(await renderer.render(), />new<\/template>/);
    const generation = renderer.generation;
    await fs.writeFile(
        filename,
        '<f-template name="test-card"><template>duplicate</template></f-template>'.repeat(
            2,
        ),
    );
    while (!errors.length && Date.now() < deadline) {
        await delay(10);
    }
    assert.ok(errors.length > 0);
    assert.equal(renderer.generation, generation);
    assert.match(await renderer.render(), />new<\/template>/);
});
