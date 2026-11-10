const assert = require("node:assert/strict");
const { createHash, randomUUID } = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const { test } = require("node:test");
const { pathToFileURL } = require("node:url");
const wasm = require("../wasm/microsoft_fast_build.js");

const fixtureRoot = path.join(__dirname, "fixtures/prepared-vite");

async function fixture(t) {
    // Keep build products inside the repository, with cleanup limited to this test's path.
    const root = path.join(fixtureRoot, `.work-${randomUUID()}`);
    await fs.mkdir(root);
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    for (const file of [
        "home.html",
        "account.html",
        "card.html",
        "badge.html",
        "server.mjs",
        "client.mjs",
    ]) {
        await fs.copyFile(path.join(fixtureRoot, file), path.join(root, file));
    }
    const { siteConfig, entries, templates } = await import(
        pathToFileURL(path.join(fixtureRoot, "site.mjs")).href
    );
    return { root, siteConfig, entries, templates };
}

function deferred() {
    let resolve;
    const promise = new Promise(done => {
        resolve = done;
    });
    return { promise, resolve };
}

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

async function filesUnder(directory) {
    const result = [];
    for (const item of await fs.readdir(directory, { withFileTypes: true })) {
        const file = path.join(directory, item.name);
        if (item.isDirectory()) {
            result.push(...(await filesUnder(file)));
        } else {
            result.push(file);
        }
    }
    return result;
}

test("Vite SSR emits relocatable transformed artifacts shared across entries", async t => {
    const { build } = await import("vite");
    const { root, siteConfig, entries, templates } = await fixture(t);
    const { config, plugin } = siteConfig(root);
    await build(config);
    const transformed = plugin.api.sources;
    assert.match(transformed.get(path.join(root, "card.html")), /Vite transformed/);
    assert.doesNotMatch(transformed.get(path.join(root, "card.html")), /__BUILD_LABEL__/);
    const expectedTemplates = Object.fromEntries(
        Object.entries(templates).map(([name, { file, ...metadata }]) => [
            name,
            { ...metadata, content: transformed.get(path.join(root, file)) },
        ]),
    );
    const relocated = path.join(root, "relocated");
    await fs.rename(path.join(root, "output"), relocated);
    // Serving must not read any original entry or component source.
    for (const file of [...Object.values(entries), "card.html", "badge.html"]) {
        await fs.rm(path.join(root, file));
    }
    const serverFile = path.join(relocated, "server.mjs");
    const bundle = await fs.readFile(serverFile, "utf8");
    assert.doesNotMatch(bundle, /__BUILD_LABEL__|compileArtifacts|prepared_compiler_id/);
    assert.equal(bundle.includes(root), false, "server has no baked-in source path");
    const { openSite } = await import(pathToFileURL(serverFile).href);
    const loads = new Map();
    const { runtime, manifest } = await openSite({
        loadArtifact: async (id, read) => {
            loads.set(id, (loads.get(id) ?? 0) + 1);
            return read();
        },
    });
    t.after(() => runtime.dispose());
    assert.equal(manifest.version, 2);
    assert.equal(manifest.compiler, wasm.prepared_compiler_id());
    assert.deepEqual(Object.keys(manifest.entries).sort(), ["account", "home"]);
    assert.equal(runtime.generation, manifest.generation);
    for (const markersV2 of [false, true]) {
        for (const entry of Object.keys(entries)) {
            const state = { title: `${entry} <&` };
            for (const stream of [false, true]) {
                const expected = wasm.render_entry_with_templates(
                    transformed.get(path.join(root, entries[entry])),
                    JSON.stringify(expectedTemplates),
                    JSON.stringify(state),
                    "camelCase",
                    stream,
                    markersV2,
                );
                assert.deepEqual(
                    await runtime.render(entry, state, {
                        markersV2,
                        stream,
                        attributeNameStrategy: "camelCase",
                    }),
                    stream ? JSON.parse(expected) : expected,
                );
            }
        }
    }
    for (const name of ["demo-card", "demo-badge"]) {
        assert.equal(loads.get(manifest.templates[name]), 1, `${name} shares its cache`);
    }
    assert.ok(runtime.memoryUsage.pieces > 0);

    await t.test(
        "nested native fragments, hydration and request-local DSD selection",
        async () => {
            for (const markersV2 of [false, true]) {
                const state = { title: "resolved fragment", label: "inherited label" };
                assert.equal(
                    await runtime.renderShadowRoot("demo-card", state, { markersV2 }),
                    wasm.render_shadow_root(
                        "demo-card",
                        JSON.stringify(expectedTemplates),
                        JSON.stringify(state),
                        undefined,
                        markersV2,
                    ),
                );
            }
            const excluded = await runtime.render(
                "home",
                { title: "light only" },
                { dsd: [] },
            );
            assert.match(excluded, /<demo-card title="light only"><i>/);
            assert.match(excluded, /authored light only/);
            assert.doesNotMatch(excluded, /role="article"|shadowroot|Vite transformed/);
            const selective = await runtime.render(
                "home",
                { title: "outer only" },
                { dsd: ["demo-card"] },
            );
            assert.match(selective, /shadowrootmode="open"/);
            assert.doesNotMatch(
                selective,
                /shadowrootmode="closed"|role="status"|<strong>/,
            );
            assert.equal(
                await runtime.renderShadowRoot("demo-badge", {}, { dsd: [] }),
                "",
            );
            assert.match(
                await runtime.render("account", { title: "still registered" }),
                /shadowrootmode="closed"/,
            );
        },
    );
    await runtime.dispose();

    // Recompute the manifest hash: this must reject compiler identity, not a stale hash.
    const manifestFile = path.join(relocated, "prepared/manifest.json");
    const { generation: previousGeneration, ...incompatible } = manifest;
    assert.equal(
        createHash("sha256")
            .update(JSON.stringify(canonical(incompatible)))
            .digest("hex"),
        previousGeneration,
    );
    incompatible.compiler = "0".repeat(64);
    const generation = createHash("sha256")
        .update(JSON.stringify(canonical(incompatible)))
        .digest("hex");
    assert.notEqual(generation, previousGeneration);
    await fs.writeFile(manifestFile, JSON.stringify({ ...incompatible, generation }));
    await assert.rejects(openSite(), /compiler|[Ii]ncompat/);
    await fs.writeFile(manifestFile, JSON.stringify(manifest));
    const missing = path.join(
        relocated,
        `prepared/${manifest.entries.home}.fast-artifact.json`,
    );
    await fs.rm(missing);
    const broken = await openSite();
    t.after(() => broken.runtime.dispose());
    await assert.rejects(broken.runtime.render("home"), /ENOENT|[Mm]issing/);
});

test("minimal Vite client output has no prepared data, server runtime or Node imports", async t => {
    const { build } = await import("vite");
    const { root, siteConfig } = await fixture(t);
    const { config } = siteConfig(root);
    config.build = {
        outDir: path.join(root, "client-output"),
        emptyOutDir: false,
        minify: false,
        rollupOptions: { input: path.join(root, "client.mjs") },
    };
    await build(config);
    const files = await filesUnder(config.build.outDir);
    assert.ok(files.some(file => file.endsWith(".js")));
    assert.equal(
        files.some(file => /prepared|fast-artifact|manifest/.test(path.basename(file))),
        false,
    );
    for (const file of files) {
        assert.doesNotMatch(
            await fs.readFile(file, "utf8"),
            /fast-build|createPreparedRuntime|node:|__vite-browser-external|Vite transformed|shadowrootmode/,
        );
    }
});

test("Vite HMR publishes atomically, pins requests and drains on server close", async t => {
    const { createServer } = await import("vite");
    const { root, siteConfig } = await fixture(t);
    const started = deferred();
    const release = deferred();
    let loadStarted = started;
    let loadGate = release;
    let intercept = true;
    const { config, plugin } = siteConfig(root, {
        maxMemoryBytes: 0,
        loadArtifact: async (_id, read) => {
            if (intercept) {
                intercept = false;
                loadStarted.resolve();
                await loadGate.promise;
            }
            return read();
        },
    });
    config.server = { middlewareMode: true, hmr: false, watch: null };
    const server = await createServer(config);
    t.after(async () => {
        release.resolve();
        loadGate.resolve();
        await server.close();
    });
    const runtime = await plugin.api.prepare();
    assert.ok(plugin.api.sources.size >= 4, "Vite transform pipeline is responsive");
    const oldGeneration = runtime.generation;
    const old = runtime.render("home", { title: "old request" });
    await started.promise;
    const card = path.join(root, "card.html");
    const original = await fs.readFile(card, "utf8");
    const update = () => plugin.handleHotUpdate({ file: card, server });
    await fs.writeFile(card, original.replace("__BUILD_LABEL__", "replacement"));
    await update();
    assert.notEqual(runtime.generation, oldGeneration);
    assert.match(
        await runtime.render("account", { title: "new request" }),
        /replacement/,
    );
    release.resolve();
    const oldHtml = await old;
    assert.match(oldHtml, /Vite transformed/);
    assert.doesNotMatch(oldHtml, /replacement/);

    const validGeneration = runtime.generation;
    await fs.writeFile(card, "__BUILD_ERROR__");
    await assert.rejects(update(), /preprocessing failed/i);
    assert.equal(runtime.generation, validGeneration);
    assert.match(await runtime.render("home"), /replacement/);
    await fs.writeFile(card, original.replace("__BUILD_LABEL__", "recovered"));
    await update();
    assert.match(await runtime.render("home"), /recovered/);

    // A close must await this request instead of freeing its native pieces early.
    const draining = deferred();
    const finish = deferred();
    intercept = true;
    loadStarted = draining;
    loadGate = finish;
    const pending = runtime.render("account", { title: "finishing" });
    await draining.promise;
    const closing = server.close();
    let closed = false;
    closing.then(() => {
        closed = true;
    });
    await plugin.api.shutdownStarted;
    assert.equal(closed, false, "server close waits for the blocked request");
    finish.resolve();
    assert.match(await pending, /finishing/);
    await closing;
    assert.equal(runtime.memoryUsage.pieces, 0);
    await assert.rejects(async () => runtime.render("home"), /dispos/i);
});

test("Vite's artifact store retires drained snapshots without deleting shared or ABA pieces", async t => {
    const { createServer } = await import("vite");
    const { root, siteConfig } = await fixture(t);
    const started = deferred();
    const release = deferred();
    let blocked = false;
    const { config, plugin } = siteConfig(root, {
        maxMemoryBytes: 0,
        loadArtifact: async (_id, read) => {
            if (!blocked) {
                blocked = true;
                started.resolve();
                await release.promise;
            }
            return read();
        },
    });
    config.server = { middlewareMode: true, hmr: false, watch: null };
    const server = await createServer(config);
    t.after(async () => {
        release.resolve();
        await server.close();
    });
    const runtime = await plugin.api.prepare();
    const originalSnapshot = runtime.snapshot;
    const originalIds = plugin.api.artifactIds;
    const card = path.join(root, "card.html");
    const original = await fs.readFile(card, "utf8");
    const pending = runtime.render("home", { title: "pinned old request" });
    await started.promise;
    async function update(content) {
        await fs.writeFile(card, content);
        await plugin.handleHotUpdate({ file: card, server });
    }

    await update(original.replace("__BUILD_LABEL__", "replacement"));
    const replacement = runtime.snapshot;
    const replacementIds = plugin.api.artifactIds;
    assert.equal(replacementIds.size, originalIds.size + 1);
    for (const id of originalIds) {
        assert.ok(replacementIds.has(id), "blocked old artifact loads remain possible");
    }
    await update(original);
    assert.equal(runtime.generation, originalSnapshot.generation);
    assert.notEqual(runtime.snapshot, originalSnapshot, "ABA is a distinct activation");
    await replacement.drained;
    assert.deepEqual(plugin.api.artifactIds, originalIds);
    assert.equal(plugin.api.snapshotCount, 2, "both equal-generation activations live");

    await update(original.replace("__BUILD_LABEL__", "current"));
    assert.equal(plugin.api.artifactIds.size, originalIds.size + 1);
    release.resolve();
    assert.match(await pending, /Vite transformed/);
    await originalSnapshot.drained;
    assert.equal(plugin.api.artifactIds.size, originalIds.size);
    assert.equal(plugin.api.snapshotCount, 1);
    for (let index = 0; index < 32; index++) {
        await update(original.replace("__BUILD_LABEL__", `update-${index}`));
        assert.equal(plugin.api.artifactIds.size, originalIds.size);
        assert.equal(plugin.api.snapshotCount, 1);
        assert.match(await runtime.render("home"), new RegExp(`update-${index}`));
    }
    await server.close();
    assert.equal(plugin.api.artifactIds.size, 0);
    assert.equal(plugin.api.snapshotCount, 0);
});

test("Vite close drains serialized HMR transforms and rejects new updates", async t => {
    const { createServer } = await import("vite");
    const { root, siteConfig } = await fixture(t);
    const { config, plugin } = siteConfig(root);
    const started = deferred();
    const release = deferred();
    const trace = [];
    let gateTransforms = false;
    config.plugins.unshift({
        name: "fixture:gated-update-transform",
        async transform(_code, id) {
            if (!gateTransforms) {
                return;
            }
            if (id === path.join(root, "card.html") + "?prepared-source") {
                trace.push("card:start");
                started.resolve();
                await release.promise;
                trace.push("card:end");
            } else if (id === path.join(root, "badge.html") + "?prepared-source") {
                trace.push("badge");
            }
        },
    });
    config.server = { middlewareMode: true, hmr: false, watch: null };
    const server = await createServer(config);
    const operations = [];
    t.after(async () => {
        release.resolve();
        await Promise.allSettled(operations);
        await server.close();
    });
    const runtime = await plugin.api.prepare();
    const originalGeneration = runtime.generation;
    gateTransforms = true;
    const card = path.join(root, "card.html");
    const badge = path.join(root, "badge.html");
    await fs.writeFile(card, "<h2>queued card {{title}}</h2><demo-badge></demo-badge>");
    const first = plugin.handleHotUpdate({ file: card, server });
    operations.push(first);
    await started.promise;
    await fs.writeFile(badge, "<strong>queued badge {{title}}</strong>");
    const second = plugin.handleHotUpdate({ file: badge, server });
    operations.push(second);

    // Invoke the lifecycle directly: Vite's own pending-transform drain must not
    // hide a plugin that disposes its runtime before an accepted update finishes.
    const closing = plugin.closeBundle();
    operations.push(closing);
    await assert.rejects(plugin.handleHotUpdate({ file: card, server }), /dispos/i);
    assert.equal(runtime.generation, originalGeneration);
    release.resolve();
    await Promise.all(operations);
    assert.deepEqual(trace, ["card:start", "card:end", "badge"]);
    assert.notEqual(runtime.generation, originalGeneration);
    assert.match(plugin.api.sources.get(badge), /queued badge/);
    assert.equal(runtime.memoryUsage.pieces, 0);
    assert.equal(plugin.api.artifactIds.size, 0);
    assert.equal(plugin.api.snapshotCount, 0);
    await assert.rejects(async () => runtime.render("home"), /dispos/i);
    await assert.rejects(plugin.api.prepare(), /dispos/i);
});
