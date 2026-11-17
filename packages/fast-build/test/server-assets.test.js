const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { writeServerArtifact } = require("../server.js");
const { loadNativeHost } = require("../native-host.mjs");
const NativeProgram = loadNativeHost(process.env.FAST_NATIVE_ADDON);
function renderFixture(artifact, context, state = {}, options, name, json = false) {
    const program = new NativeProgram(artifact, options);
    const input = Buffer.from(json ? state : JSON.stringify(state), "utf8");
    const method = "render" + context + "Json";
    return (
        context === "Host" || context === "Shadow"
            ? program[method](name, input)
            : program[method](input)
    ).toString("utf8");
}
const serverPath = require.resolve("../server.js");
const cliPath = path.resolve(__dirname, "../bin/fast.js");
const inputs = {
    entry: "<p>{{title}}</p>",
    templates: { "unused-card": "<span>{{title}}</span>" },
};
async function inDirectory(run) {
    const directory = fs.mkdtempSync(path.join(__dirname, ".server-assets-"));
    try {
        await run(directory);
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
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
function withoutCompiler(output, source, configuration = {}) {
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
                method: "writeServerArtifact",
                output,
                inputs: source,
                options: configuration,
            }),
        ],
        { encoding: "utf8", timeout: 10000 },
    );
    return JSON.parse(result);
}
function build(directory, args, compilerDisabled = false) {
    return execFileSync(
        process.execPath,
        compilerDisabled
            ? [
                  "-e",
                  `${disableCompiler}
                  const request = JSON.parse(process.argv[1]);
                  process.argv = [process.execPath, request.cliPath, "build", ...request.args];
                  require(request.cliPath);`,
                  JSON.stringify({ cliPath, args }),
              ]
            : [cliPath, "build", ...args],
        { cwd: directory, encoding: "utf8", timeout: 10000 },
    );
}
test("build retains raw-source plans across state/options changes and restores missing outputs without a compiler", async () => {
    await inDirectory(directory => {
        const entry = path.join(directory, "entry.html");
        const templates = path.join(directory, "templates.html");
        const state = path.join(directory, "state.json");
        const output = path.join(directory, "output.html");
        const module = path.join(directory, "page.json");
        fs.writeFileSync(entry, "<my-card></my-card><p>{{title}}</p>");
        fs.writeFileSync(
            templates,
            '<f-template name="my-card"><template><h2>{{title}}</h2></template></f-template>' +
                '<f-template name="unused-card"><template><em>{{title}}</em></template></f-template>',
        );
        fs.writeFileSync(state, '{"title":"Cold 😀"}');
        const args = [
            "--entry=entry.html",
            "--templates=templates.html",
            "--state=state.json",
            "--output=output.html",
        ];
        build(directory, args);
        const expected = fs.readFileSync(output);
        build(directory, [...args, "--server-artifact=page.json"]);
        assert.deepEqual(fs.readFileSync(output), expected);
        const manifest = `${module}.inputs.json`;
        const before = stampPair(module, manifest);
        const plan = JSON.parse(before.output.bytes.toString("utf8"));
        assert.deepEqual(Object.keys(plan.components).sort(), ["my-card", "unused-card"]);
        for (const reference of Object.values(plan.components)) {
            assert.equal(typeof reference, "string");
            const body = plan.templates[reference];
            assert.match(body[0].html, /^<template shadowrootmode=/);
            assert.deepEqual(body.at(-1), { type: "literal", html: "</template>" });
        }
        const recorded = JSON.parse(before.manifest.bytes);
        assert.deepEqual(recorded.inputs, {
            entry: fs.readFileSync(entry, "utf8"),
            templateSources: [fs.readFileSync(templates, "utf8")],
        });
        assert.equal(recorded.inputs.state, undefined);
        fs.writeFileSync(state, '{"title":"Fresh & next"}');
        build(directory, [...args, "--markers_v2", "--attribute-name-strategy=none"]);
        const changedExpected = fs.readFileSync(output);
        fs.unlinkSync(output);
        build(
            directory,
            [
                ...args,
                "--server-artifact=page.json",
                "--markers_v2",
                "--attribute-name-strategy=none",
            ],
            true,
        );
        assert.deepEqual(fs.readFileSync(output), changedExpected);
        unchanged(module, before.output);
        unchanged(manifest, before.manifest);
        fs.unlinkSync(module);
        build(directory, [...args, "--server-artifact=page.json"], true);
        assert.deepEqual(fs.readFileSync(module), before.output.bytes);
        unchanged(manifest, before.manifest);
        fs.writeFileSync(
            templates,
            '<f-template name="my-card"><template><strong>{{title}}</strong></template></f-template>',
        );
        assert.throws(() =>
            build(directory, [...args, "--server-artifact=page.json"], true),
        );
        assert.deepEqual(fs.readFileSync(module), before.output.bytes);
        build(directory, args);
        const fallbackExpected = fs.readFileSync(output);
        build(directory, [...args, "--server-artifact=page.json"]);
        assert.deepEqual(fs.readFileSync(output), fallbackExpected);
        assert.notDeepEqual(fs.readFileSync(manifest), before.manifest.bytes);
        build(directory, [...args, "--server-artifact=page.json"], true);
        fs.appendFileSync(entry, "<footer>{{title}}</footer>");
        build(directory, [...args, "--server-artifact=page.json"]);
        build(directory, args);
        const entryExpected = fs.readFileSync(output);
        build(directory, [...args, "--server-artifact=page.json"], true);
        assert.deepEqual(fs.readFileSync(output), entryExpected);
        const retained = fs.readFileSync(module);
        fs.unlinkSync(manifest);
        assert.throws(() =>
            build(directory, [...args, "--server-artifact=page.json"], true),
        );
        assert.deepEqual(fs.readFileSync(module), retained);
        build(directory, [...args, "--server-artifact=page.json"]);
        assert.deepEqual(fs.readFileSync(output), entryExpected);
        build(directory, [...args, "--server-artifact=page.json"], true);
    });
});
test("build rejects duplicate names and empty explicit registries without replacing outputs", async () => {
    await inDirectory(directory => {
        fs.writeFileSync(path.join(directory, "entry.html"), "<my-card></my-card>");
        for (const [file, content] of [
            ["first.html", "<p>first</p>"],
            ["last.html", "<b>last</b>"],
        ]) {
            fs.writeFileSync(
                path.join(directory, file),
                `<f-template name="my-card"><template>${content}</template></f-template>`,
            );
        }
        fs.writeFileSync(path.join(directory, "empty.html"), "");
        fs.writeFileSync(
            path.join(directory, "nameless.html"),
            "<f-template><template>Skipped</template></f-template>",
        );
        const args = ["--entry=entry.html", "--output=output.html"];
        const output = path.join(directory, "output.html");
        const module = path.join(directory, "page.json");
        build(directory, [
            ...args,
            "--templates=first.html",
            "--server-artifact=page.json",
        ]);
        const before = stampPair(module, `${module}.inputs.json`);
        const html = snapshot(output);
        for (const [pattern, message] of [
            ["first.html,last.html", /Duplicate template name/],
            ["last.html,first.html", /Duplicate template name/],
            ["first.html,first.html", /Duplicate template name/],
            ["", /at least one named template/],
            ["missing/*.html", /at least one named template/],
            ["empty.html", /at least one named template/],
            ["nameless.html", /at least one named template/],
        ]) {
            for (const persistent of [[], ["--server-artifact=page.json"]]) {
                assert.throws(
                    () =>
                        build(directory, [
                            ...args,
                            `--templates=${pattern}`,
                            ...persistent,
                        ]),
                    error => message.test(error.stderr.toString()),
                );
                unchanged(output, html);
                unchanged(module, before.output);
                unchanged(`${module}.inputs.json`, before.manifest);
            }
        }
    });
});
test("build cache reuses strict raw sources across registry order changes", async () => {
    await inDirectory(directory => {
        fs.writeFileSync(
            path.join(directory, "entry.html"),
            "<first-card></first-card><last-card></last-card>",
        );
        for (const name of ["first", "last"]) {
            fs.writeFileSync(
                path.join(directory, `${name}.html`),
                `<f-template name="${name}-card"><template>${name}</template></f-template>`,
            );
        }
        const args = ["--entry=entry.html", "--output=output.html"];
        build(directory, [
            ...args,
            "--templates=first.html,last.html",
            "--server-artifact=page.json",
        ]);
        const module = path.join(directory, "page.json");
        const before = stampPair(module, `${module}.inputs.json`);
        const expected = fs.readFileSync(path.join(directory, "output.html"));
        build(
            directory,
            [...args, "--templates=last.html,first.html", "--server-artifact=page.json"],
            true,
        );
        assert.deepEqual(fs.readFileSync(path.join(directory, "output.html")), expected);
        unchanged(module, before.output);
        unchanged(`${module}.inputs.json`, before.manifest);
    });
});
test("build allows omitted templates and reuses entry-only modules without a compiler", async () => {
    await inDirectory(directory => {
        fs.writeFileSync(path.join(directory, "entry.html"), "<p>empty registry</p>");
        const args = ["--entry=entry.html", "--output=output.html"];
        build(directory, args);
        build(directory, [...args, "--server-artifact=page.json"]);
        build(directory, [...args, "--server-artifact=page.json"], true);
        assert.equal(
            fs.readFileSync(path.join(directory, "output.html"), "utf8"),
            "<p>empty registry</p>",
        );
    });
});
test("build cache fails closed for corrupt pairs, runtime changes and mixed targets without replacing HTML", async () => {
    await inDirectory(directory => {
        fs.writeFileSync(path.join(directory, "entry.html"), "<p>{{title}}</p>");
        const args = [
            "--entry=entry.html",
            "--output=output.html",
            "--server-artifact=page.json",
        ];
        const module = path.join(directory, "page.json");
        const manifest = `${module}.inputs.json`;
        build(directory, args);
        const originalModule = fs.readFileSync(module);
        const originalManifest = fs.readFileSync(manifest);
        const sentinel = "Do not replace on failure";
        fs.writeFileSync(path.join(directory, "output.html"), sentinel);
        for (const mutate of [
            () => fs.writeFileSync(manifest, "{broken"),
            () => fs.appendFileSync(module, "\n// changed"),
            () => {
                const metadata = JSON.parse(originalManifest);
                metadata.unknown = true;
                fs.writeFileSync(manifest, JSON.stringify(metadata));
            },
            () => {
                const metadata = JSON.parse(originalManifest);
                metadata.version = 99;
                fs.writeFileSync(manifest, JSON.stringify(metadata));
            },
        ]) {
            mutate();
            assert.throws(() => build(directory, args));
            assert.equal(
                fs.readFileSync(path.join(directory, "output.html"), "utf8"),
                sentinel,
            );
            fs.writeFileSync(module, originalModule);
            fs.writeFileSync(manifest, originalManifest);
        }
        build(directory, args, true);
    });
});
test("persistent build config resolves module paths and still validates every request and authored body", async () => {
    await inDirectory(directory => {
        const configDirectory = path.join(directory, "config");
        fs.mkdirSync(configDirectory);
        fs.writeFileSync(path.join(configDirectory, "entry.html"), "<p>{{title}}</p>");
        fs.writeFileSync(path.join(configDirectory, "state.json"), '{"title":"Valid"}');
        fs.writeFileSync(
            path.join(configDirectory, "build.json"),
            JSON.stringify({
                entry: "entry.html",
                state: "state.json",
                output: "output.html",
                "server-artifact": "page.json",
                templates: "templates.html",
            }),
        );
        fs.writeFileSync(
            path.join(configDirectory, "templates.html"),
            '<f-template name="unused-card"><template><p>unused</p></template></f-template>',
        );
        const args = ["--config=config/build.json"];
        build(directory, args);
        const module = path.join(configDirectory, "page.json");
        const previous = stampPair(module, `${module}.inputs.json`);
        fs.writeFileSync(path.join(configDirectory, "state.json"), '{"bad":1e999}');
        assert.throws(() => build(directory, args, true));
        unchanged(module, previous.output);
        unchanged(`${module}.inputs.json`, previous.manifest);
        fs.writeFileSync(
            path.join(configDirectory, "state.json"),
            '{"title":"Recovered"}',
        );
        build(directory, args, true);
        assert.match(
            fs.readFileSync(path.join(configDirectory, "output.html"), "utf8"),
            /Recovered/,
        );
        fs.writeFileSync(
            path.join(configDirectory, "templates.html"),
            '<f-template name="unused-card"><template><f-when value="{{false}}">{{}}</f-when></template></f-template>',
        );
        assert.throws(() => build(directory, args));
        unchanged(module, previous.output);
        unchanged(`${module}.inputs.json`, previous.manifest);
        assert.throws(() => build(directory, [...args, "--server-artifact="]));
        assert.throws(() => build(directory, [...args, "--server-artifact=wrong.js"]));
        assert.throws(() => build(directory, [...args, "--output=config/page.json"]));
        assert.throws(() => build(directory, [...args, "--entry=config/page.json"]));
        unchanged(module, previous.output);
    });
});
test("build renders the writer-owned snapshot if another writer replaces the path after publication", async () => {
    await inDirectory(directory => {
        fs.writeFileSync(path.join(directory, "entry.html"), "<p>{{title}}</p>");
        fs.writeFileSync(path.join(directory, "state.json"), '{"title":"Own snapshot"}');
        const args = [
            "--entry=entry.html",
            "--state=state.json",
            "--output=output.html",
            "--server-artifact=page.json",
        ];
        execFileSync(
            process.execPath,
            [
                "-e",
                `const request = JSON.parse(process.argv[1]);
            const fs = require("node:fs");
            const writer = require(request.serverPath);
            const write = writer.writeServerArtifact;
            writer.writeServerArtifact = function(...args) {
                const result = write(...args);
                fs.writeFileSync(args[0],
                    writer.compileServerArtifact("<p>Another build</p>"));
                return result;
            };
            process.argv = [process.execPath, request.cliPath, "build", ...request.args];
            require(request.cliPath);`,
                JSON.stringify({ cliPath, serverPath, args }),
            ],
            { cwd: directory },
        );
        assert.match(
            fs.readFileSync(path.join(directory, "output.html"), "utf8"),
            /Own snapshot/,
        );
        assert.throws(() => build(directory, args));
    });
});
test("writer output snapshots are owned on both fresh writes and exact reuse", async () => {
    await inDirectory(directory => {
        {
            const output = path.join(directory, "snapshot.json");
            const configuration = { includeBytes: true };
            const cold = writeServerArtifact(output, inputs, configuration);
            assert.equal(cold.reused, false);
            assert.deepEqual(Buffer.from(cold.bytes), fs.readFileSync(output));
            cold.bytes.fill(0);
            const expected = fs.readFileSync(output);
            const hit = writeServerArtifact(output, inputs, configuration);
            assert.equal(hit.reused, true);
            assert.deepEqual(Buffer.from(hit.bytes), expected);
            hit.bytes.fill(0);
            assert.deepEqual(fs.readFileSync(output), expected);
        }
    });
});
function withRenameFailure(output, source, failRollback = false) {
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
                method: "writeServerArtifact",
                output,
                inputs: source,
                originalInputs: inputs,
                options: { overwrite: true },
                failRollback,
            }),
        ],
        { encoding: "utf8", timeout: 10000, stdio: "pipe" },
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
function rendered(output, state) {
    return renderFixture(fs.readFileSync(output), "Entry", state);
}
test("native assets reuse exact persisted bytes in a compiler-free fresh process", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.json");
        const result = writeServerArtifact(output, inputs, {});
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
        assert.equal(rendered(output, { title: "A & B" }), "<p>A &amp; B</p>");
        const artifact = JSON.parse(original.output.bytes);
        assert.equal(artifact.format, "fast-server-native");
        assert.equal(artifact.version, 1);
        assertHashFree(artifact);
        assert.ok(Array.isArray(artifact.entry));
        assert.equal(typeof artifact.templates, "object");
        assert.deepEqual(withoutCompiler(output, inputs), {
            reused: true,
            manifestPath: manifest,
        });
        unchanged(output, original.output);
        unchanged(manifest, original.manifest);
        assertOnlyAssets(directory, output, manifest);
    });
});
test("native restores a missing output from its exact snapshot without compilation", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.json");
        const { manifestPath } = writeServerArtifact(output, inputs, {});
        const original = stampPair(output, manifestPath);
        fs.unlinkSync(output);
        assert.deepEqual(withoutCompiler(output, inputs), {
            reused: true,
            manifestPath,
        });
        assert.deepEqual(fs.readFileSync(output), original.output.bytes);
        unchanged(manifestPath, original.manifest);
        assertOnlyAssets(directory, output, manifestPath);
    });
});
test("native changes require overwrite and failed compilation preserves both files", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.json");
        const { manifestPath } = writeServerArtifact(output, inputs, {});
        const original = stampPair(output, manifestPath);
        const changed = { ...inputs, entry: "<strong>{{title}}</strong>" };
        assert.throws(() => writeServerArtifact(output, changed, {}));
        unchanged(output, original.output);
        unchanged(manifestPath, original.manifest);
        const invalid = {
            entry: "<p>{{title}}</p>",
            templates: { "broken-card": '<f-when value="{{false}}">{{}}</f-when>' },
        };
        assert.throws(() => writeServerArtifact(output, invalid, { overwrite: true }));
        unchanged(output, original.output);
        unchanged(manifestPath, original.manifest);
        assertOnlyAssets(directory, output, manifestPath);
        assert.deepEqual(writeServerArtifact(output, changed, { overwrite: true }), {
            reused: false,
            manifestPath,
        });
        assert.notDeepEqual(fs.readFileSync(output), original.output.bytes);
        assert.notDeepEqual(fs.readFileSync(manifestPath), original.manifest.bytes);
        assert.equal(
            rendered(output, { title: "Changed & rendered" }),
            "<strong>Changed &amp; rendered</strong>",
        );
        assert.equal(withoutCompiler(output, changed).reused, true);
        assertOnlyAssets(directory, output, manifestPath);
    });
});
test("native corrupt output and malformed or unsupported sidecars fail closed", async () => {
    for (const damage of ["output", "malformed", "unsupported", "snapshot"]) {
        await inDirectory(async directory => {
            const output = path.join(directory, "server.json");
            const { manifestPath } = writeServerArtifact(output, inputs, {});
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
                assert.throws(() => writeServerArtifact(output, inputs, { overwrite }));
                unchanged(output, before.output);
                unchanged(manifestPath, before.manifest);
            }
            assertOnlyAssets(directory, output, manifestPath);
        });
    }
});
test("native unmanaged outputs need explicit adoption permission", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.json");
        fs.writeFileSync(output, "legacy unmanaged output");
        const original = snapshot(output);
        assert.throws(() => writeServerArtifact(output, inputs, {}));
        unchanged(output, original);
        assert.deepEqual(fs.readdirSync(directory), [path.basename(output)]);
        const result = writeServerArtifact(output, inputs, { overwrite: true });
        assert.equal(result.reused, false);
        assert.notDeepEqual(fs.readFileSync(output), original.bytes);
        assert.equal(withoutCompiler(output, inputs).reused, true);
        assertOnlyAssets(directory, output, result.manifestPath);
    });
});
test("native manifest publication failure restores both assets and cleans owned files", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.json");
        const { manifestPath } = writeServerArtifact(output, inputs, {});
        const before = stampPair(output, manifestPath);
        withRenameFailure(output, {
            ...inputs,
            entry: "<strong>{{title}}</strong>",
        });
        assert.deepEqual(fs.readFileSync(output), before.output.bytes);
        assert.deepEqual(fs.readFileSync(manifestPath), before.manifest.bytes);
        assertOnlyAssets(directory, output, manifestPath);
        assert.equal(withoutCompiler(output, inputs).reused, true);
    });
});
test("native rollback failure leaves a detectable pair that future writes reject", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.json");
        const { manifestPath } = writeServerArtifact(output, inputs, {});
        withRenameFailure(
            output,
            { ...inputs, entry: "<strong>{{title}}</strong>" },
            true,
        );
        assertOnlyAssets(directory, output, manifestPath);
    });
});
test("native rejected writes preserve an existing foreign output lock", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.json");
        const { manifestPath } = writeServerArtifact(output, inputs, {});
        const before = stampPair(output, manifestPath);
        const lock = `${output}.lock`;
        fs.writeFileSync(lock, "another writer owns this lock", { flag: "wx" });
        fs.utimesSync(lock, new Date(1009843200000), new Date(1009843200000));
        const foreign = snapshot(lock);
        assert.throws(
            () =>
                writeServerArtifact(
                    output,
                    { ...inputs, entry: "<strong>{{title}}</strong>" },
                    { overwrite: true },
                ),
            error => error.code === "server-asset-locked",
        );
        unchanged(output, before.output);
        unchanged(manifestPath, before.manifest);
        unchanged(lock, foreign);
        assert.deepEqual(
            fs.readdirSync(directory).sort(),
            [output, manifestPath, lock].map(filename => path.basename(filename)).sort(),
        );
    });
});
test("native registry order and derived metadata do not invalidate authored inputs", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.json");
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
        const { manifestPath } = writeServerArtifact(output, authored, {});
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
        assert.equal(withoutCompiler(output, reordered).reused, true);
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
                writeServerArtifact(
                    output,
                    {
                        ...reordered,
                        templates: { ...reordered.templates, "z-card": definition },
                    },
                    {},
                ),
            );
            unchanged(output, before.output);
            unchanged(manifestPath, before.manifest);
        }
    });
});
test("native raw sources reuse before parsing while preserving multiplicity", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.json");
        const first =
            '<f-template name="first-card"><template>{{title}}</template></f-template>';
        const second =
            '<f-template name="second-card"><template><b>{{title}}</b></template></f-template>';
        const raw = {
            entry: "<first-card></first-card>",
            templateSources: [first, second],
        };
        const { manifestPath } = writeServerArtifact(output, raw, {});
        const before = stampPair(output, manifestPath);
        assert.deepEqual(JSON.parse(before.manifest.bytes).inputs, {
            entry: raw.entry,
            templateSources: [...raw.templateSources].sort(),
        });
        assert.equal(
            withoutCompiler(output, {
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
                writeServerArtifact(output, { ...raw, templateSources }, {}),
            );
            unchanged(output, before.output);
            unchanged(manifestPath, before.manifest);
        }
    });
});
test("changing an authored component regenerates a module that renders its new template", async () => {
    await inDirectory(async directory => {
        const output = path.join(directory, "server.json");
        const initial = {
            entry: "<changing-card></changing-card>",
            templates: { "changing-card": "<p>{{title}}</p>" },
        };
        const { manifestPath } = writeServerArtifact(output, initial, {});
        const oldModule = fs.readFileSync(output);
        assert.match(
            renderFixture(
                oldModule,
                "Host",
                { title: "Template & state" },
                undefined,
                "changing-card",
            ),
            /<p><!--fe:b-->Template &amp; state<!--fe:\/b--><\/p>/,
        );
        const before = stampPair(output, manifestPath);
        const changed = {
            ...initial,
            templates: { "changing-card": "<strong>{{title}}</strong>" },
        };
        assert.equal(
            writeServerArtifact(output, changed, {
                overwrite: true,
            }).reused,
            false,
        );
        assert.notDeepEqual(fs.readFileSync(output), before.output.bytes);
        const newModule = fs.readFileSync(output);
        assert.match(
            renderFixture(
                newModule,
                "Host",
                { title: "Template & state" },
                undefined,
                "changing-card",
            ),
            /<strong><!--fe:b-->Template &amp; state<!--fe:\/b--><\/strong>/,
        );
        assert.doesNotMatch(
            renderFixture(
                newModule,
                "Host",
                { title: "Template & state" },
                undefined,
                "changing-card",
            ),
            /<p>/,
        );
        assertOnlyAssets(directory, output, manifestPath);
    });
});
test("CLI raw-source hits keep the overwrite gate and never load the compiler or parser", async () => {
    await inDirectory(async directory => {
        const input = path.join(directory, "templates.html");
        const output = path.join(directory, "server.json");
        fs.writeFileSync(
            input,
            '<f-template name="cli-card"><template><p>{{title}}</p></template></f-template>',
        );
        const args = [
            "convert",
            "--syntax=server-native",
            `--templates=${input}`,
            `--output=${output}`,
        ];
        execFileSync(process.execPath, [cliPath, ...args], { timeout: 10000 });
        const manifest = `${output}.inputs.json`;
        const before = stampPair(output, manifest);
        const script = `${disableCompiler}
            process.argv = [process.execPath, ${JSON.stringify(cliPath)},
                ...JSON.parse(process.argv[1])];
            require(${JSON.stringify(cliPath)});`;
        assert.throws(() =>
            execFileSync(process.execPath, ["-e", script, JSON.stringify(args)], {
                stdio: "pipe",
                timeout: 10000,
            }),
        );
        execFileSync(
            process.execPath,
            ["-e", script, JSON.stringify([...args, "--overwrite"])],
            { stdio: "pipe", timeout: 10000 },
        );
        unchanged(output, before.output);
        unchanged(manifest, before.manifest);
        const module = fs.readFileSync(output);
        assert.match(
            renderFixture(
                module,
                "Host",
                { title: "CLI & reuse" },
                undefined,
                "cli-card",
            ),
            /CLI &amp; reuse/,
        );
        assert.deepEqual(
            fs.readdirSync(directory).sort(),
            ["templates.html", "server.json", "server.json.inputs.json"].sort(),
        );
    });
});
