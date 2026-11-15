const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { pathToFileURL } = require("node:url");
const {
    compileServerAssets,
    compileServerModule,
    writeServerArtifact,
    writeServerAssets,
    writeServerModule,
} = require("../server.js");

const runtime = pathToFileURL(require.resolve("../server-runtime.mjs")).href;
const serverPath = require.resolve("../server.js");
const cliPath = path.resolve(__dirname, "../bin/fast.js");
const targets = [
    { name: "module", method: "writeServerModule", write: writeServerModule, ext: "mjs" },
    {
        name: "native",
        method: "writeServerArtifact",
        write: writeServerArtifact,
        ext: "fast",
    },
];
const inputs = {
    entry: "<p>{{title}}</p>",
    templates: { "unused-card": "<span>{{title}}</span>" },
};

test("modular assets isolate component bytes and match every render context", async () => {
    await inDirectory(async directory => {
        const definitions = {
            "asset-parent": {
                content:
                    '<f-repeat value="{{item in items}}"><asset-child :item="{{item}}" data-key="{{item.name}}">{{item.name}}/{{$index}}</asset-child></f-repeat><f-when value="{{show}}">{{{raw}}}</f-when>',
                hostAttributes: [{ name: "title", value: "{{title}}" }],
            },
            "asset-child": {
                content: "<b>{{item.name}}/{{dataset.key}}</b>",
                hostAttributes: [{ name: "role", value: "group" }],
                shadowrootAttributes: [{ name: "shadowrootmode", value: "open" }],
            },
        };
        const entry = '<asset-parent title="{{title}}"></asset-parent>';
        const assets = compileServerAssets(entry, definitions, runtime);
        for (let attempt = 0; attempt < 2; attempt++) {
            const fresh = execFileSync(
                process.execPath,
                [
                    "-e",
                    "const {compileServerAssets}=require(process.argv[1]); process.stdout.write(JSON.stringify(compileServerAssets(...JSON.parse(process.argv[2]))));",
                    serverPath,
                    JSON.stringify([entry, definitions, runtime]),
                ],
                { encoding: "utf8" },
            );
            assert.deepEqual(JSON.parse(fresh), assets);
        }
        const reversed = compileServerAssets(
            entry,
            Object.fromEntries(Object.entries(definitions).reverse()),
            runtime,
        );
        assert.deepEqual(assets, reversed);
        const unrelated = compileServerAssets(
            entry,
            { ...definitions, "aaa-unrelated": "<p>{{unused}}</p>" },
            runtime,
        );
        for (const filename of [
            "entry.plan.mjs",
            "component-asset-parent.plan.mjs",
            "component-asset-child.plan.mjs",
        ]) {
            assert.equal(assets.files[filename], unrelated.files[filename]);
        }
        const changed = compileServerAssets(
            entry,
            {
                ...definitions,
                "asset-child": {
                    ...definitions["asset-child"],
                    content: "<em>{{item.name}}</em>",
                },
            },
            runtime,
        );
        assert.equal(
            assets.files["component-asset-parent.plan.mjs"],
            changed.files["component-asset-parent.plan.mjs"],
        );
        assert.notEqual(
            assets.files["component-asset-child.plan.mjs"],
            changed.files["component-asset-child.plan.mjs"],
        );
        const changedDefaults = compileServerAssets(
            entry,
            {
                ...definitions,
                "asset-child": {
                    ...definitions["asset-child"],
                    hostAttributes: [{ name: "role", value: "note" }],
                },
            },
            runtime,
        );
        assert.notEqual(
            assets.files["component-asset-parent.plan.mjs"],
            changedDefaults.files["component-asset-parent.plan.mjs"],
        );
        const deployment = path.join(directory, "modular");
        writeServerAssets(
            deployment,
            { entry, templates: definitions },
            { runtimeImport: runtime },
        );
        const modular = await import(
            pathToFileURL(path.join(deployment, assets.entry)).href
        );
        const single = await import(
            `data:text/javascript;base64,${Buffer.from(
                compileServerModule(entry, definitions, runtime),
            ).toString("base64")}`
        );
        for (const state of [
            {
                title: '&<"é',
                items: [{ name: "<one>" }, { name: "two" }],
                show: true,
                raw: "<i>raw</i>",
            },
            { title: null, items: [], show: false, raw: "" },
        ]) {
            for (const markersV2 of [false, true]) {
                for (const dsd of [undefined, [], ["asset-child"]]) {
                    const configuration = { markersV2, dsd };
                    const prepared = modular.prepareState(state);
                    for (const method of [
                        "renderEntry",
                        "renderTemplate",
                        "renderHost",
                        "renderShadow",
                    ]) {
                        const args =
                            method === "renderHost" || method === "renderShadow"
                                ? ["asset-parent", state, configuration]
                                : [state, configuration];
                        assert.equal(modular[method](...args), single[method](...args));
                        args[args.length - 2] = prepared;
                        assert.equal(
                            modular[`${method}Prepared`](...args),
                            single[`${method}Prepared`](...args),
                        );
                    }
                }
            }
        }
        assert.equal(
            writeServerAssets(
                deployment,
                { entry, templates: definitions },
                { runtimeImport: runtime },
            ).reused,
            true,
        );
        const childTable = await import(
            pathToFileURL(path.join(deployment, "component-asset-child.plan.mjs")).href
        );
        childTable.plan.strings.fill("mutated after loading");
        const request = { title: "isolated", items: [{ name: "first" }], show: false };
        assert.equal(modular.renderEntry(request), single.renderEntry(request));
    });
});

test("modular publication is immutable, source-free and fail-closed across upgrades", async () => {
    await inDirectory(async directory => {
        const destination = path.join(directory, "deployment");
        const configuration = { runtimeImport: runtime };
        writeServerAssets(destination, inputs, configuration);
        const before = Object.fromEntries(
            fs.readdirSync(destination).map(filename => {
                const full = path.join(destination, filename);
                fs.utimesSync(full, new Date(946684800000), new Date(946684800000));
                return [filename, snapshot(full)];
            }),
        );
        const script = `${disableCompiler}
            const {writeServerAssets} = require(process.argv[1]);
            const result = writeServerAssets(process.argv[2], JSON.parse(process.argv[3]), {runtimeImport:process.argv[4]});
            assert.equal(result.reused, true);
            import(require("node:url").pathToFileURL(process.argv[2] + "/server.mjs").href).then(module => {
                assert.equal(module.renderEntry({title:"source & free"}), "<p>source &amp; free</p>");
            }).catch(error => { console.error(error); process.exitCode = 1; });`;
        execFileSync(process.execPath, [
            "-e",
            script,
            serverPath,
            destination,
            JSON.stringify(inputs),
            runtime,
        ]);
        for (const [filename, recorded] of Object.entries(before)) {
            unchanged(path.join(destination, filename), recorded);
        }
        assert.throws(
            () =>
                writeServerAssets(
                    destination,
                    { ...inputs, entry: "<b>{{title}}</b>" },
                    configuration,
                ),
            { code: "server-asset-new-destination-required" },
        );
        assert.throws(
            () =>
                writeServerAssets(destination, inputs, {
                    runtimeImport: "./different.mjs",
                }),
            { code: "server-asset-configuration-mismatch" },
        );
        assert.throws(
            () =>
                writeServerAssets(destination, inputs, {
                    ...configuration,
                    overwrite: true,
                }),
            { code: "invalid-server-asset-options" },
        );
        const dependency = path.join(destination, "component-unused-card.plan.mjs");
        fs.appendFileSync(dependency, "\n");
        assert.throws(() => writeServerAssets(destination, inputs, configuration), {
            code: "server-asset-output-mismatch",
        });
        fs.writeFileSync(dependency, before["component-unused-card.plan.mjs"].bytes);
        fs.unlinkSync(dependency);
        assert.throws(() => writeServerAssets(destination, inputs, configuration), {
            code: "server-asset-output-mismatch",
        });
        await assert.rejects(
            import(pathToFileURL(path.join(destination, "server.mjs")).href),
            {
                code: "ERR_MODULE_NOT_FOUND",
            },
        );
    });
});

test("failed modular staging never publishes a partial directory", async () => {
    await inDirectory(async directory => {
        const destination = path.join(directory, "deployment");
        const write = fs.writeFileSync;
        let writes = 0;
        fs.writeFileSync = function (filename, ...args) {
            if (++writes === 3) throw new Error("injected modular write failure");
            return write.call(this, filename, ...args);
        };
        try {
            assert.throws(
                () => writeServerAssets(destination, inputs, { runtimeImport: runtime }),
                /injected modular write failure/,
            );
        } finally {
            fs.writeFileSync = write;
        }
        assert.deepEqual(fs.readdirSync(directory), []);
    });
});

test("modular linking validates unused tables eagerly but permits symbolic component cycles", async () => {
    await inDirectory(async directory => {
        const definitions = {
            "cycle-a": "<cycle-b></cycle-b>",
            "cycle-b": "<cycle-a></cycle-a>",
        };
        const destination = path.join(directory, "valid");
        writeServerAssets(
            destination,
            { entry: "<cycle-a></cycle-a>", templates: definitions },
            { runtimeImport: runtime },
        );
        const module = await import(
            pathToFileURL(path.join(destination, "server.mjs")).href
        );
        assert.equal(module.renderEntry({}, { dsd: [] }), "<cycle-a></cycle-a>");
        const broken = path.join(directory, "broken");
        writeServerAssets(broken, inputs, { runtimeImport: runtime });
        fs.writeFileSync(
            path.join(broken, "component-unused-card.plan.mjs"),
            `export const plan = ${JSON.stringify({
                format: "fast-server-plan",
                version: 1,
                strings: [],
                code: [18, 0],
                offsets: [0],
                root: 0,
                host: 0,
                tag: 0,
            })};\n`,
        );
        await assert.rejects(
            import(pathToFileURL(path.join(broken, "server.mjs")).href),
            /Invalid or incompatible FAST server plan/,
        );
        const malformed = path.join(directory, "malformed");
        assert.throws(() =>
            writeServerAssets(
                malformed,
                {
                    entry: "",
                    templates: { unused: '<f-when value="{{false}}">{{oops</f-when>' },
                },
                { runtimeImport: runtime },
            ),
        );
        assert.equal(fs.existsSync(malformed), false);
    });
});

test("modular assets preserve historical declarative fixture bytes", async () => {
    const { createHash } = require("node:crypto");
    const wasm = require("../wasm/microsoft_fast_build.js");
    const baseline = require("./server-baseline.json");
    const root = path.resolve(__dirname, "../../fast-element/test/declarative/fixtures");
    await inDirectory(async directory => {
        const configs = fs
            .readdirSync(root, { recursive: true })
            .filter(filename => path.basename(filename) === "fast-build.config.json");
        for (const [index, filename] of configs.entries()) {
            const fixture = path.dirname(path.join(root, filename));
            const config = JSON.parse(fs.readFileSync(path.join(root, filename), "utf8"));
            const entry = fs.readFileSync(
                path.resolve(fixture, config.entry || "entry.html"),
                "utf8",
            );
            const templates = Object.fromEntries(
                JSON.parse(
                    wasm.parse_f_templates(
                        fs.readFileSync(path.join(fixture, "templates.html"), "utf8"),
                    ),
                )
                    .filter(template => template.name)
                    .map(({ name, ...metadata }) => [name, metadata]),
            );
            const state = config.state
                ? JSON.parse(fs.readFileSync(path.resolve(fixture, config.state), "utf8"))
                : {};
            const destination = path.join(directory, `fixture-${index}`);
            writeServerAssets(
                destination,
                { entry, templates },
                { runtimeImport: runtime },
            );
            const module = await import(
                pathToFileURL(path.join(destination, "server.mjs")).href
            );
            for (const markersV2 of [false, true]) {
                const options = {
                    markersV2,
                    attributeNameStrategy: config["attribute-name-strategy"],
                };
                const key = createHash("sha256")
                    .update(JSON.stringify([entry, templates, state, options]))
                    .digest("hex");
                assert.ok(
                    Object.hasOwn(baseline, key),
                    `Missing historical fixture: ${filename}`,
                );
                assert.equal(
                    createHash("sha256")
                        .update(module.renderEntry(state, options))
                        .digest("hex"),
                    baseline[key],
                    filename,
                );
            }
        }
    });
});

async function inDirectory(run) {
    const directory = fs.mkdtempSync(path.join(__dirname, ".server-assets-"));
    try {
        await run(directory);
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
}

function options(target, extra = {}) {
    return target.name === "module" ? { runtimeImport: runtime, ...extra } : extra;
}

function snapshot(filename) {
    return {
        bytes: fs.readFileSync(filename),
        mtimeMs: fs.statSync(filename).mtimeMs,
    };
}

function stampPair(output, manifest) {
    fs.utimesSync(output, new Date(946684800000), new Date(946684800000));
    fs.utimesSync(manifest, new Date(978307200000), new Date(978307200000));
    return { output: snapshot(output), manifest: snapshot(manifest) };
}

function unchanged(filename, before) {
    assert.deepEqual(fs.readFileSync(filename), before.bytes);
    assert.equal(fs.statSync(filename).mtimeMs, before.mtimeMs);
}

function assertOnlyAssets(directory, output, manifest) {
    assert.deepEqual(
        fs.readdirSync(directory).sort(),
        [path.basename(output), path.basename(manifest)].sort(),
        "no staging files or owned locks remain",
    );
}

const disableCompiler = `
    const assert = require("node:assert/strict");
    const fs = require("node:fs");
    const Module = require("node:module");
    const load = Module._load;
    Module._load = function(request, ...args) {
        if (/wasm|microsoft_fast_build/i.test(request)) {
            throw new Error("compiler disabled: " + request);
        }
        return load.call(this, request, ...args);
    };
    const read = fs.readFileSync;
    fs.readFileSync = function(filename, ...args) {
        if (String(filename).endsWith(".wasm")) {
            throw new Error("compiler disabled: WASM bytes");
        }
        return read.call(this, filename, ...args);
    };
    for (const name of ["compile", "compileStreaming", "instantiate", "instantiateStreaming"]) {
        WebAssembly[name] = () => { throw new Error("compiler disabled: WebAssembly"); };
    }
`;

function withoutCompiler(target, output, source, configuration = options(target)) {
    const result = execFileSync(
        process.execPath,
        [
            "-e",
            `${disableCompiler}
            const request = JSON.parse(process.argv[1]);
            const server = require(request.serverPath);
            const result = server[request.method](
                request.output, request.inputs, request.options
            );
            assert.throws(() => require("../wasm/microsoft_fast_build.js"), /compiler disabled/);
            process.stdout.write(JSON.stringify(result));`,
            JSON.stringify({
                serverPath,
                method: target.method,
                output,
                inputs: source,
                options: configuration,
            }),
        ],
        { encoding: "utf8", timeout: 10_000 },
    );
    return JSON.parse(result);
}

function withRenameFailure(target, output, source, failRollback = false) {
    execFileSync(
        process.execPath,
        [
            "-e",
            `
            const assert = require("node:assert/strict");
            const fs = require("node:fs");
            const { syncBuiltinESMExports } = require("node:module");
            const request = JSON.parse(process.argv[1]);
            const manifest = request.output + ".inputs.json";
            const originalOutput = fs.readFileSync(request.output);
            const originalManifest = fs.readFileSync(manifest);
            const rename = fs.renameSync;
            let publicationFailed = false;
            let rollbackFailed = false;
            fs.renameSync = function(source, destination) {
                if (destination === manifest && !publicationFailed) {
                    assert.notDeepEqual(fs.readFileSync(request.output), originalOutput,
                        "output was replaced before manifest publication");
                    publicationFailed = true;
                    throw Object.assign(new Error("injected manifest publication failure"),
                        { code: "EIO" });
                }
                if (request.failRollback && publicationFailed &&
                    destination === request.output) {
                    rollbackFailed = true;
                    throw Object.assign(new Error("injected output rollback failure"),
                        { code: "EIO" });
                }
                return rename.call(this, source, destination);
            };
            syncBuiltinESMExports();
            const server = require(request.serverPath);
            const write = server[request.method];
            assert.throws(() => write(request.output, request.inputs, request.options));
            assert.equal(publicationFailed, true, "manifest publication was attempted");
            assert.equal(rollbackFailed, request.failRollback);
            fs.renameSync = rename;
            syncBuiltinESMExports();
            assert.deepEqual(fs.readFileSync(manifest), originalManifest);
            if (request.failRollback) {
                assert.notDeepEqual(fs.readFileSync(request.output), originalOutput);
                assert.throws(
                    () => write(request.output, request.originalInputs, request.options),
                    error => error.code === "server-asset-output-mismatch"
                );
            } else {
                assert.deepEqual(fs.readFileSync(request.output), originalOutput);
            }
            `,
            JSON.stringify({
                serverPath,
                method: target.method,
                output,
                inputs: source,
                originalInputs: inputs,
                options: options(target, { overwrite: true }),
                failRollback,
            }),
        ],
        { encoding: "utf8", timeout: 10_000, stdio: "pipe" },
    );
}

function assertHashFree(value) {
    if (value && typeof value === "object") {
        for (const [key, child] of Object.entries(value)) {
            assert.doesNotMatch(key, /compiler|hash|checksum|fingerprint/i);
            assertHashFree(child);
        }
    }
}

function containsValue(value, expected) {
    return (
        value === expected ||
        (value !== null &&
            typeof value === "object" &&
            Object.values(value).some(child => containsValue(child, expected)))
    );
}

async function rendered(output, state, revision = "") {
    const module = await import(`${pathToFileURL(output).href}${revision}`);
    return module.renderEntry(state);
}

for (const target of targets) {
    test(`${target.name} assets reuse exact persisted bytes in a compiler-free fresh process`, async () => {
        await inDirectory(async directory => {
            const output = path.join(directory, `server.${target.ext}`);
            const result = target.write(output, inputs, options(target));
            assert.deepEqual(result, {
                reused: false,
                manifestPath: `${output}.inputs.json`,
            });
            const manifest = result.manifestPath;
            const original = stampPair(output, manifest);
            const record = JSON.parse(original.manifest.bytes);
            assertHashFree(record);
            assert.ok(
                containsValue(record, original.output.bytes.toString("base64")),
                "the sidecar retains exact output bytes, not a digest",
            );
            if (target.name === "module") {
                assert.equal(
                    await rendered(output, { title: "A & B" }),
                    "<p>A &amp; B</p>",
                );
                assert.doesNotMatch(
                    original.output.bytes.toString(),
                    /compiler|hash|checksum|fingerprint/i,
                );
            } else {
                const artifact = JSON.parse(original.output.bytes);
                assert.equal(artifact.format, "fast-server-native");
                assert.equal(artifact.version, 1);
                assertHashFree(artifact);
                assert.ok(Array.isArray(artifact.entry));
                assert.equal(typeof artifact.templates, "object");
            }
            assert.deepEqual(withoutCompiler(target, output, inputs), {
                reused: true,
                manifestPath: manifest,
            });
            unchanged(output, original.output);
            unchanged(manifest, original.manifest);
            assertOnlyAssets(directory, output, manifest);
        });
    });

    test(`${target.name} restores a missing output from its exact snapshot without compilation`, async () => {
        await inDirectory(async directory => {
            const output = path.join(directory, `server.${target.ext}`);
            const { manifestPath } = target.write(output, inputs, options(target));
            const original = stampPair(output, manifestPath);
            fs.unlinkSync(output);
            assert.deepEqual(withoutCompiler(target, output, inputs), {
                reused: true,
                manifestPath,
            });
            assert.deepEqual(fs.readFileSync(output), original.output.bytes);
            unchanged(manifestPath, original.manifest);
            assertOnlyAssets(directory, output, manifestPath);
        });
    });

    test(`${target.name} changes require overwrite and failed compilation preserves both files`, async () => {
        await inDirectory(async directory => {
            const output = path.join(directory, `server.${target.ext}`);
            const { manifestPath } = target.write(output, inputs, options(target));
            const original = stampPair(output, manifestPath);
            const changed = { ...inputs, entry: "<strong>{{title}}</strong>" };
            assert.throws(() => target.write(output, changed, options(target)));
            unchanged(output, original.output);
            unchanged(manifestPath, original.manifest);
            const invalid = {
                entry: "<p>{{title}}</p>",
                templates: { "broken-card": '<f-when value="{{false}}">{{}}</f-when>' },
            };
            assert.throws(() =>
                target.write(output, invalid, options(target, { overwrite: true })),
            );
            unchanged(output, original.output);
            unchanged(manifestPath, original.manifest);
            assertOnlyAssets(directory, output, manifestPath);
            assert.deepEqual(
                target.write(output, changed, options(target, { overwrite: true })),
                { reused: false, manifestPath },
            );
            assert.notDeepEqual(fs.readFileSync(output), original.output.bytes);
            assert.notDeepEqual(fs.readFileSync(manifestPath), original.manifest.bytes);
            if (target.name === "module") {
                assert.equal(
                    await rendered(output, { title: "Changed & rendered" }, "?changed"),
                    "<strong>Changed &amp; rendered</strong>",
                );
            }
            assert.equal(withoutCompiler(target, output, changed).reused, true);
            assertOnlyAssets(directory, output, manifestPath);
        });
    });

    test(`${target.name} corrupt output and malformed or unsupported sidecars fail closed`, async () => {
        for (const damage of ["output", "malformed", "unsupported", "snapshot"]) {
            await inDirectory(async directory => {
                const output = path.join(directory, `server.${target.ext}`);
                const { manifestPath } = target.write(output, inputs, options(target));
                if (damage === "output") {
                    fs.appendFileSync(output, "\ncorrupted");
                } else {
                    const record = JSON.parse(fs.readFileSync(manifestPath));
                    fs.writeFileSync(
                        manifestPath,
                        damage === "malformed"
                            ? "{broken"
                            : JSON.stringify(
                                  damage === "unsupported"
                                      ? { ...record, version: 999 }
                                      : {
                                            ...record,
                                            outputBase64: "%%%invalid-base64%%%",
                                        },
                              ),
                    );
                }
                const before = stampPair(output, manifestPath);
                for (const overwrite of [false, true]) {
                    assert.throws(() =>
                        target.write(output, inputs, options(target, { overwrite })),
                    );
                    unchanged(output, before.output);
                    unchanged(manifestPath, before.manifest);
                }
                assertOnlyAssets(directory, output, manifestPath);
            });
        }
    });

    test(`${target.name} unmanaged outputs need explicit adoption permission`, async () => {
        await inDirectory(async directory => {
            const output = path.join(directory, `server.${target.ext}`);
            fs.writeFileSync(output, "legacy unmanaged output");
            const original = snapshot(output);
            assert.throws(() => target.write(output, inputs, options(target)));
            unchanged(output, original);
            assert.deepEqual(fs.readdirSync(directory), [path.basename(output)]);
            const result = target.write(
                output,
                inputs,
                options(target, { overwrite: true }),
            );
            assert.equal(result.reused, false);
            assert.notDeepEqual(fs.readFileSync(output), original.bytes);
            assert.equal(withoutCompiler(target, output, inputs).reused, true);
            assertOnlyAssets(directory, output, result.manifestPath);
        });
    });

    test(`${target.name} manifest publication failure restores both assets and cleans owned files`, async () => {
        await inDirectory(async directory => {
            const output = path.join(directory, `server.${target.ext}`);
            const { manifestPath } = target.write(output, inputs, options(target));
            const before = stampPair(output, manifestPath);
            withRenameFailure(target, output, {
                ...inputs,
                entry: "<strong>{{title}}</strong>",
            });
            assert.deepEqual(fs.readFileSync(output), before.output.bytes);
            assert.deepEqual(fs.readFileSync(manifestPath), before.manifest.bytes);
            assertOnlyAssets(directory, output, manifestPath);
            assert.equal(withoutCompiler(target, output, inputs).reused, true);
        });
    });

    test(`${target.name} rollback failure leaves a detectable pair that future writes reject`, async () => {
        await inDirectory(async directory => {
            const output = path.join(directory, `server.${target.ext}`);
            const { manifestPath } = target.write(output, inputs, options(target));
            withRenameFailure(
                target,
                output,
                { ...inputs, entry: "<strong>{{title}}</strong>" },
                true,
            );
            assertOnlyAssets(directory, output, manifestPath);
        });
    });

    test(`${target.name} rejected writes preserve an existing foreign output lock`, async () => {
        await inDirectory(async directory => {
            const output = path.join(directory, `server.${target.ext}`);
            const { manifestPath } = target.write(output, inputs, options(target));
            const before = stampPair(output, manifestPath);
            const lock = `${output}.lock`;
            fs.writeFileSync(lock, "another writer owns this lock", { flag: "wx" });
            fs.utimesSync(lock, new Date(1009843200000), new Date(1009843200000));
            const foreign = snapshot(lock);
            assert.throws(
                () =>
                    target.write(
                        output,
                        { ...inputs, entry: "<strong>{{title}}</strong>" },
                        options(target, { overwrite: true }),
                    ),
                error => error.code === "server-asset-locked",
            );
            unchanged(output, before.output);
            unchanged(manifestPath, before.manifest);
            unchanged(lock, foreign);
            assert.deepEqual(
                fs.readdirSync(directory).sort(),
                [output, manifestPath, lock]
                    .map(filename => path.basename(filename))
                    .sort(),
            );
        });
    });

    test(`${target.name} registry order and derived metadata do not invalidate authored inputs`, async () => {
        await inDirectory(async directory => {
            const output = path.join(directory, `server.${target.ext}`);
            const authored = {
                entry: "<p>{{title}}</p>",
                templates: {
                    "z-card": {
                        content: "<b>{{title}}</b>",
                        hostAttributes: [
                            { name: "title", value: "{{title}}" },
                            { name: "disabled", value: null },
                        ],
                        shadowrootAttributes: [{ name: "shadowrootmode", value: "open" }],
                    },
                    "a-card": "<i>{{title}}</i>",
                },
            };
            const { manifestPath } = target.write(output, authored, options(target));
            const before = stampPair(output, manifestPath);
            const reordered = {
                entry: authored.entry,
                templates: {
                    "a-card": {
                        content: authored.templates["a-card"],
                        formatVersion: 1,
                        hostAttributes: [],
                        shadowrootAttributes: [],
                    },
                    "z-card": {
                        ...authored.templates["z-card"],
                        formatVersion: 1,
                        bindings: [{ expression: "compiler-derived-change" }],
                        provenance: { filename: "renamed.html", timestamp: 123 },
                    },
                },
            };
            assert.equal(withoutCompiler(target, output, reordered).reused, true);
            unchanged(output, before.output);
            unchanged(manifestPath, before.manifest);
            const record = JSON.parse(before.manifest.bytes);
            assert.equal(record.inputs.entry, authored.entry);
            assert.deepEqual(record.inputs.templates["z-card"], {
                content: authored.templates["z-card"].content,
                hostAttributes: authored.templates["z-card"].hostAttributes,
                shadowrootAttributes: authored.templates["z-card"].shadowrootAttributes,
                formatVersion: 1,
            });
            for (const definition of [
                {
                    ...reordered.templates["z-card"],
                    hostAttributes: [
                        ...authored.templates["z-card"].hostAttributes,
                    ].reverse(),
                },
                {
                    ...reordered.templates["z-card"],
                    hostAttributes: [
                        { name: "title", value: "{{title}}" },
                        { name: "disabled", value: "" },
                    ],
                },
                {
                    ...reordered.templates["z-card"],
                    content: "<b> {{title}}</b>",
                },
            ]) {
                assert.throws(() =>
                    target.write(
                        output,
                        {
                            ...reordered,
                            templates: { ...reordered.templates, "z-card": definition },
                        },
                        options(target),
                    ),
                );
                unchanged(output, before.output);
                unchanged(manifestPath, before.manifest);
            }
        });
    });

    test(`${target.name} raw sources reuse before parsing while preserving multiplicity`, async () => {
        await inDirectory(async directory => {
            const output = path.join(directory, `server.${target.ext}`);
            const first =
                '<f-template name="first-card"><template>{{title}}</template></f-template>';
            const second =
                '<f-template name="second-card"><template><b>{{title}}</b></template></f-template>';
            const raw = {
                entry: "<first-card></first-card>",
                templateSources: [first, second],
            };
            const { manifestPath } = target.write(output, raw, options(target));
            const before = stampPair(output, manifestPath);
            assert.deepEqual(JSON.parse(before.manifest.bytes).inputs, {
                entry: raw.entry,
                templateSources: [...raw.templateSources].sort(),
            });
            assert.equal(
                withoutCompiler(target, output, {
                    ...raw,
                    templateSources: [second, first],
                }).reused,
                true,
            );
            for (const templateSources of [
                [first, second, second],
                [first, `${second}\n`],
            ]) {
                assert.throws(() =>
                    target.write(output, { ...raw, templateSources }, options(target)),
                );
                unchanged(output, before.output);
                unchanged(manifestPath, before.manifest);
            }
        });
    });
}

test("changing an authored component regenerates a module that renders its new template", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.mjs");
        const initial = {
            entry: "<changing-card></changing-card>",
            templates: { "changing-card": "<p>{{title}}</p>" },
        };
        const { manifestPath } = writeServerModule(output, initial, {
            runtimeImport: runtime,
        });
        const oldModule = await import(pathToFileURL(output).href);
        assert.match(
            oldModule.renderHost("changing-card", { title: "Template & state" }),
            /<p><!--fe:b-->Template &amp; state<!--fe:\/b--><\/p>/,
        );
        const before = stampPair(output, manifestPath);
        const changed = {
            ...initial,
            templates: { "changing-card": "<strong>{{title}}</strong>" },
        };
        assert.equal(
            writeServerModule(output, changed, {
                runtimeImport: runtime,
                overwrite: true,
            }).reused,
            false,
        );
        assert.notDeepEqual(fs.readFileSync(output), before.output.bytes);
        const newModule = await import(`${pathToFileURL(output).href}?new-template`);
        assert.match(
            newModule.renderHost("changing-card", { title: "Template & state" }),
            /<strong><!--fe:b-->Template &amp; state<!--fe:\/b--><\/strong>/,
        );
        assert.doesNotMatch(
            newModule.renderHost("changing-card", { title: "Template & state" }),
            /<p>/,
        );
        assertOnlyAssets(directory, output, manifestPath);
    });
});

test("managed assets reject runtime import or target-kind changes even with overwrite", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.mjs");
        const { manifestPath } = writeServerModule(output, inputs, {
            runtimeImport: runtime,
        });
        const before = stampPair(output, manifestPath);
        for (const overwrite of [false, true]) {
            assert.throws(() =>
                writeServerModule(output, inputs, {
                    runtimeImport: `${runtime}?changed-runtime`,
                    overwrite,
                }),
            );
            assert.throws(() => writeServerArtifact(output, inputs, { overwrite }));
            unchanged(output, before.output);
            unchanged(manifestPath, before.manifest);
        }
        assertOnlyAssets(directory, output, manifestPath);
    });
});

test("CLI raw-source hits keep the overwrite gate and never load the compiler or parser", async () => {
    await inDirectory(async directory => {
        const input = path.join(directory, "templates.html");
        const output = path.join(directory, "server.mjs");
        fs.writeFileSync(
            input,
            '<f-template name="cli-card"><template><p>{{title}}</p></template></f-template>',
        );
        const args = [
            "convert",
            "--syntax=server-js",
            `--templates=${input}`,
            `--output=${output}`,
        ];
        execFileSync(process.execPath, [cliPath, ...args], { timeout: 10_000 });
        const manifest = `${output}.inputs.json`;
        const before = stampPair(output, manifest);
        const script = `${disableCompiler}
            process.argv = [process.execPath, ${JSON.stringify(cliPath)},
                ...JSON.parse(process.argv[1])];
            require(${JSON.stringify(cliPath)});`;
        assert.throws(() =>
            execFileSync(process.execPath, ["-e", script, JSON.stringify(args)], {
                stdio: "pipe",
                timeout: 10_000,
            }),
        );
        execFileSync(
            process.execPath,
            ["-e", script, JSON.stringify([...args, "--overwrite"])],
            { stdio: "pipe", timeout: 10_000 },
        );
        unchanged(output, before.output);
        unchanged(manifest, before.manifest);
        const module = await import(pathToFileURL(output).href);
        assert.match(
            module.renderHost("cli-card", { title: "CLI & reuse" }),
            /CLI &amp; reuse/,
        );
        assert.deepEqual(
            fs.readdirSync(directory).sort(),
            ["templates.html", "server.mjs", "server.mjs.inputs.json"].sort(),
        );
    });
});
