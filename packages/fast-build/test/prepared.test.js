// @ts-check
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { setTimeout: delay } = require("node:timers/promises");

const typescript = require("typescript");

const { loadRenderer, prepareRenderer } = require("../prepared.js");
const wasm = require("../wasm/microsoft_fast_build.js");

async function fixture(t) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "fast-prepared-"));
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
        before.entry,
        before.templates["test-parent"],
        before.templates["test-unused"],
    ];
    const mtimes = await Promise.all(
        unchanged.map(id => fs.stat(path.join(cacheDirectory, `${id}.fastpiece`))),
    );
    await renderer.refresh({
        templates: {
            "test-parent": "<test-child></test-child>",
            "test-child": "<b>new</b>",
            "test-unused": "<i>unused</i>",
        },
    });
    const after = await manifest(renderer);
    assert.notEqual(after.generation, before.generation);
    assert.notEqual(after.templates["test-child"], before.templates["test-child"]);
    assert.equal(after.templates["test-parent"], before.templates["test-parent"]);
    assert.equal(after.templates["test-unused"], before.templates["test-unused"]);
    for (const [index, id] of unchanged.entries()) {
        assert.equal(
            (await fs.stat(path.join(cacheDirectory, `${id}.fastpiece`))).mtimeMs,
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
    assert.equal(added.entry, before.entry);
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
    const filename = path.join(cacheDirectory, `${old.entry}.fastpiece`);
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
    const filename = path.join(cacheDirectory, `${snapshot.entry}.fastpiece`);
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
        path.join(cacheDirectory, `${snapshot.templates["test-unused"]}.fastpiece`),
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
        path.join(cacheDirectory, `${snapshot.templates["test-card"]}.fastpiece`),
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
        import { prepareRenderer, loadRenderer } from ${JSON.stringify(api)};
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
