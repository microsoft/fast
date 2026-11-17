const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { compileServerArtifact, writeServerArtifact } = require("../server.js");
const { loadNativeHost } = require("../native-host.mjs");

const Program = loadNativeHost(process.env.FAST_NATIVE_ADDON);
const serverPath = require.resolve("../server.js");
const cliPath = path.resolve(__dirname, "../bin/fast.js");
const inputs = { entry: "<p>{{title}}</p>", templates: {} };

async function inDirectory(run) {
    const directory = fs.mkdtempSync(path.join(__dirname, ".server-assets-"));
    try {
        await run(directory);
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
}

function snapshot(output) {
    fs.utimesSync(output, new Date(946684800000), new Date(946684800000));
    return { bytes: fs.readFileSync(output), mtimeMs: fs.statSync(output).mtimeMs };
}

function unchanged(output, before) {
    assert.deepEqual(fs.readFileSync(output), before.bytes);
    assert.equal(fs.statSync(output).mtimeMs, before.mtimeMs);
}

function render(bytes, state = {}) {
    return new Program(bytes)
        .renderEntryJson(Buffer.from(JSON.stringify(state)))
        .toString("utf8");
}

const disableCompiler = `
    const Module = require("node:module");
    const load = Module._load;
    Module._load = function(request, ...args) {
        if (/wasm|microsoft_fast_build/i.test(request)) throw Error("compiler disabled");
        return load.call(this, request, ...args);
    };
    for (const name of ["compile", "compileStreaming", "instantiate", "instantiateStreaming"])
        WebAssembly[name] = () => { throw Error("compiler disabled"); };
`;

function withoutCompiler(output, source, options = {}) {
    return JSON.parse(
        execFileSync(
            process.execPath,
            [
                "-e",
                `${disableCompiler}
        const request = JSON.parse(process.argv[1]);
        const result = require(request.serverPath).writeServerArtifact(
            request.output, request.source, request.options);
        process.stdout.write(JSON.stringify(result));
    `,
                JSON.stringify({ serverPath, output, source, options }),
            ],
            {
                encoding: "utf8",
                timeout: 10000,
            },
        ),
    );
}

function cli(directory, command, args, compilerDisabled = false) {
    return execFileSync(
        process.execPath,
        compilerDisabled
            ? [
                  "-e",
                  `${disableCompiler}
            const request = JSON.parse(process.argv[1]);
            process.argv = [process.execPath, request.cliPath, request.command, ...request.args];
            require(request.cliPath);
        `,
                  JSON.stringify({ cliPath, command, args }),
              ]
            : [cliPath, command, ...args],
        {
            cwd: directory,
            encoding: "utf8",
            timeout: 10000,
            stdio: ["ignore", "pipe", "pipe"],
        },
    );
}

test("one artifact retains canonical inputs and a directly executable program", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        assert.deepEqual(writeServerArtifact(output, inputs), { reused: false });
        const envelope = JSON.parse(fs.readFileSync(output));
        assert.deepEqual(Object.keys(envelope).sort(), [
            "format",
            "inputs",
            "program",
            "version",
        ]);
        assert.equal(envelope.format, "fast-server-native");
        assert.equal(envelope.version, 2);
        assert.deepEqual(envelope.inputs, inputs);
        assert.ok(Array.isArray(envelope.program.entry));
        assert.equal(
            render(fs.readFileSync(output), { title: "A & B" }),
            "<p>A &amp; B</p>",
        );
        assert.deepEqual(fs.readdirSync(directory), ["server.artifact.json"]);
    });
});

test("unchanged embedded inputs reuse exact bytes without a compiler", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        writeServerArtifact(output, inputs);
        const before = snapshot(output);
        assert.deepEqual(withoutCompiler(output, inputs), { reused: true });
        unchanged(output, before);
        fs.unlinkSync(output);
        assert.throws(() => withoutCompiler(output, inputs));
        assert.deepEqual(fs.readdirSync(directory), []);
        assert.deepEqual(writeServerArtifact(output, inputs), { reused: false });
        assert.deepEqual(fs.readFileSync(output), before.bytes);
    });
});

test("directly compiled artifacts can qualify for persistent reuse", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        const source = {
            entry: "<test-card></test-card>",
            templates: { "test-card": "<b>{{title}}</b>" },
        };
        fs.writeFileSync(output, compileServerArtifact(source.entry, source.templates));
        const before = snapshot(output);
        assert.deepEqual(withoutCompiler(output, source), { reused: true });
        unchanged(output, before);
    });
});

test("changed inputs require overwrite and compilation failures preserve the old artifact", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        writeServerArtifact(output, inputs);
        const before = snapshot(output);
        const changed = { ...inputs, entry: "<strong>{{title}}</strong>" };
        assert.throws(() => writeServerArtifact(output, changed), {
            code: "server-asset-overwrite-required",
        });
        assert.throws(() =>
            writeServerArtifact(output, { entry: "{{}}" }, { overwrite: true }),
        );
        unchanged(output, before);
        fs.chmodSync(output, 0o600);
        assert.deepEqual(writeServerArtifact(output, changed, { overwrite: true }), {
            reused: false,
        });
        assert.equal(fs.statSync(output).mode & 0o777, 0o600);
        assert.equal(
            render(fs.readFileSync(output), { title: "Next" }),
            "<strong>Next</strong>",
        );
        assert.deepEqual(fs.readdirSync(directory), ["server.artifact.json"]);
    });
});

test("malformed envelopes fail closed even with overwrite permission", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        const valid = JSON.parse(
            Buffer.from(compileServerArtifact(inputs.entry)).toString(),
        );
        for (const damaged of [
            "{broken",
            Buffer.from([0xff]),
            JSON.stringify({ ...valid, version: 99 }),
            JSON.stringify({ ...valid, unknown: true }),
            JSON.stringify({ ...valid, inputs: null }),
            JSON.stringify({ ...valid, inputs: { entry: 3, templates: {} } }),
            JSON.stringify({ ...valid, program: {} }),
        ]) {
            fs.writeFileSync(output, damaged);
            const before = snapshot(output);
            for (const overwrite of [false, true])
                assert.throws(() => writeServerArtifact(output, inputs, { overwrite }), {
                    code: "invalid-server-artifact",
                });
            unchanged(output, before);
        }
    });
});

test("reuse does not assert that a valid edited program still matches the embedded source", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        writeServerArtifact(output, inputs);
        const envelope = JSON.parse(fs.readFileSync(output));
        envelope.program.entry = [{ type: "literal", html: "<p>Edited</p>" }];
        fs.writeFileSync(output, JSON.stringify(envelope));
        const before = snapshot(output);
        assert.deepEqual(withoutCompiler(output, inputs), { reused: true });
        unchanged(output, before);
        assert.equal(render(before.bytes, { title: "Original" }), "<p>Edited</p>");
    });
});

test("fresh and reused returned snapshots remain independently owned", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        for (const reused of [false, true]) {
            const result = writeServerArtifact(output, inputs, { includeBytes: true });
            assert.equal(result.reused, reused);
            assert.deepEqual(Buffer.from(result.bytes), fs.readFileSync(output));
            result.bytes.fill(0);
            assert.equal(
                render(fs.readFileSync(output), { title: "Owned" }),
                "<p>Owned</p>",
            );
        }
    });
});

test("canonical metadata excludes derived fields but preserves authored content and attribute order", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        const definition = {
            content: "<b>{{title}}</b>",
            hostAttributes: [
                { name: "title", value: "{{title}}" },
                { name: "disabled", value: null },
            ],
            shadowrootAttributes: [{ name: "shadowrootmode", value: "open" }],
        };
        const source = {
            ...inputs,
            templates: { "z-card": definition, "a-card": "<i>{{title}}</i>" },
        };
        writeServerArtifact(output, source);
        const before = snapshot(output);
        const reordered = {
            ...inputs,
            templates: {
                "a-card": { content: source.templates["a-card"], formatVersion: 1 },
                "z-card": {
                    ...definition,
                    formatVersion: 1,
                    bindings: [{ expression: "derived" }],
                },
            },
        };
        assert.equal(withoutCompiler(output, reordered).reused, true);
        unchanged(output, before);
        for (const changed of [
            { ...definition, hostAttributes: [...definition.hostAttributes].reverse() },
            { ...definition, content: "<b> {{title}}</b>" },
            { ...definition, hostAttributes: [{ name: "disabled", value: "" }] },
        ]) {
            assert.throws(() =>
                writeServerArtifact(output, {
                    ...source,
                    templates: { ...source.templates, "z-card": changed },
                }),
            );
            unchanged(output, before);
        }
    });
});

test("raw registries reuse before parsing and preserve duplicate-source multiplicity", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        const first =
            '<f-template name="first-card"><template>{{title}}</template></f-template>';
        const second =
            '<f-template name="second-card"><template><b>{{title}}</b></template></f-template>';
        const source = {
            entry: "<first-card></first-card>",
            templateSources: [first, second],
        };
        writeServerArtifact(output, source);
        const before = snapshot(output);
        assert.deepEqual(
            JSON.parse(before.bytes).inputs.templateSources,
            [first, second].sort(),
        );
        assert.equal(
            withoutCompiler(output, { ...source, templateSources: [second, first] })
                .reused,
            true,
        );
        for (const templateSources of [
            [first, second, second],
            [first, `${second}\n`],
        ]) {
            assert.throws(() =>
                writeServerArtifact(output, { ...source, templateSources }),
            );
            unchanged(output, before);
        }
        assert.throws(
            () =>
                writeServerArtifact(
                    output,
                    { ...source, templateSources: [first, first] },
                    { overwrite: true },
                ),
            /Duplicate template/,
        );
        unchanged(output, before);
    });
});

test("stage-write, flush and rename failures leave the previous artifact untouched", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        for (const existing of [false, true])
            for (const failure of ["write", "flush", "rename"]) {
                if (existing) writeServerArtifact(output, inputs);
                const before = existing ? snapshot(output) : null;
                execFileSync(
                    process.execPath,
                    [
                        "-e",
                        `
                const assert = require("node:assert/strict");
                const fs = require("node:fs");
                const request = JSON.parse(process.argv[1]);
                const writer = require(request.serverPath);
                let staging;
                const open = fs.openSync;
                fs.openSync = function(filename, ...args) {
                    const fd = open.call(this, filename, ...args);
                    if (String(filename).endsWith(".stage")) staging = fd;
                    return fd;
                };
                const method = {write:"writeFileSync",flush:"fsyncSync",rename:"renameSync"}[request.failure];
                const original = fs[method];
                fs[method] = function(first, ...args) {
                    if (request.failure === "rename" ? args[0] === request.output : first === staging)
                        throw Error("injected publication failure");
                    return original.call(this, first, ...args);
                };
                assert.throws(() => writer.writeServerArtifact(request.output,
                    {entry:"<strong>{{title}}</strong>"}, {overwrite:true}), /injected/);
            `,
                        JSON.stringify({ serverPath, output, failure }),
                    ],
                    { timeout: 10000 },
                );
                if (before) {
                    unchanged(output, before);
                    fs.unlinkSync(output);
                } else assert.equal(fs.existsSync(output), false);
                assert.deepEqual(fs.readdirSync(directory), []);
            }
    });
});

test("foreign locks and non-regular output paths are not replaced", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        const lock = `${output}.lock`;
        fs.writeFileSync(lock, "another writer");
        assert.throws(() => writeServerArtifact(output, inputs), {
            code: "server-asset-locked",
        });
        assert.equal(fs.readFileSync(lock, "utf8"), "another writer");
        fs.unlinkSync(lock);
        fs.mkdirSync(output);
        assert.throws(() => writeServerArtifact(output, inputs), {
            code: "invalid-server-artifact",
        });
        assert.deepEqual(fs.readdirSync(directory), ["server.artifact.json"]);
    });
});

test("build reuses raw-source artifacts across state/options changes and recompiles deleted artifacts", async () => {
    await inDirectory(directory => {
        const output = path.join(directory, "server.artifact.json");
        fs.writeFileSync(
            path.join(directory, "entry.html"),
            "<my-card></my-card><p>{{title}}</p>",
        );
        fs.writeFileSync(
            path.join(directory, "templates.html"),
            '<f-template name="my-card"><template><h2>{{title}}</h2></template></f-template>',
        );
        fs.writeFileSync(path.join(directory, "state.json"), '{"title":"First"}');
        const args = [
            "--entry=entry.html",
            "--templates=templates.html",
            "--state=state.json",
            "--output=output.html",
            "--server-artifact=server.artifact.json",
        ];
        cli(directory, "build", args);
        const before = snapshot(output);
        assert.deepEqual(JSON.parse(before.bytes).inputs, {
            entry: fs.readFileSync(path.join(directory, "entry.html"), "utf8"),
            templateSources: [
                fs.readFileSync(path.join(directory, "templates.html"), "utf8"),
            ],
        });
        fs.writeFileSync(path.join(directory, "state.json"), '{"title":"Fresh & next"}');
        cli(
            directory,
            "build",
            [...args, "--markers_v2", "--attribute-name-strategy=none"],
            true,
        );
        assert.match(
            fs.readFileSync(path.join(directory, "output.html"), "utf8"),
            /Fresh &amp; next/,
        );
        unchanged(output, before);
        fs.writeFileSync(path.join(directory, "state.json"), '{"invalid":1e999}');
        assert.throws(() => cli(directory, "build", args, true));
        unchanged(output, before);
        fs.writeFileSync(path.join(directory, "state.json"), "{}");
        fs.unlinkSync(output);
        assert.throws(() => cli(directory, "build", args, true));
        cli(directory, "build", args);
        assert.deepEqual(fs.readFileSync(output), before.bytes);
        assert.equal(fs.existsSync(`${output}.inputs.json`), false);
    });
});

test("build failures preserve rendered HTML and the last valid artifact", async () => {
    await inDirectory(directory => {
        const artifact = path.join(directory, "server.artifact.json");
        const html = path.join(directory, "output.html");
        fs.writeFileSync(path.join(directory, "entry.html"), "<my-card></my-card>");
        const definition =
            '<f-template name="my-card"><template>Good</template></f-template>';
        fs.writeFileSync(path.join(directory, "templates.html"), definition);
        const args = [
            "--entry=entry.html",
            "--templates=templates.html",
            "--output=output.html",
            "--server-artifact=server.artifact.json",
        ];
        cli(directory, "build", args);
        const before = snapshot(artifact);
        const rendered = snapshot(html);
        for (const bad of [
            "",
            definition + definition,
            '<f-template name="my-card"><template>{{}}</template></f-template>',
        ]) {
            fs.writeFileSync(path.join(directory, "templates.html"), bad);
            assert.throws(() => cli(directory, "build", args));
            unchanged(artifact, before);
            unchanged(html, rendered);
        }
        fs.writeFileSync(path.join(directory, "templates.html"), definition);
        fs.writeFileSync(artifact, "{corrupt");
        assert.throws(() => cli(directory, "build", args));
        unchanged(html, rendered);
    });
});

test("persistent config resolves artifact paths and rejects input/output/lock collisions", async () => {
    await inDirectory(directory => {
        const config = path.join(directory, "config");
        fs.mkdirSync(config);
        fs.writeFileSync(path.join(config, "entry.html"), "<p>Config</p>");
        fs.writeFileSync(
            path.join(config, "build.json"),
            JSON.stringify({
                entry: "entry.html",
                output: "output.html",
                "server-artifact": "server.artifact.json",
            }),
        );
        const args = ["--config=config/build.json"];
        cli(directory, "build", args);
        const output = path.join(config, "server.artifact.json");
        const before = snapshot(output);
        cli(directory, "build", args, true);
        for (const option of [
            "--server-artifact=",
            "--server-artifact=wrong.js",
            "--output=config/server.artifact.json",
            "--entry=config/server.artifact.json",
            "--output=config/server.artifact.json.lock",
        ])
            assert.throws(() => cli(directory, "build", [...args, option]));
        unchanged(output, before);
    });
});

test("build renders its owned snapshot when another writer replaces the published path", async () => {
    await inDirectory(directory => {
        fs.writeFileSync(path.join(directory, "entry.html"), "<p>Own snapshot</p>");
        const args = [
            "--entry=entry.html",
            "--output=output.html",
            "--server-artifact=server.artifact.json",
        ];
        execFileSync(
            process.execPath,
            [
                "-e",
                `
            const fs = require("node:fs");
            const request = JSON.parse(process.argv[1]);
            const writer = require(request.serverPath);
            const write = writer.writeServerArtifact;
            writer.writeServerArtifact = function(...args) {
                const result = write(...args);
                fs.writeFileSync(args[0], writer.compileServerArtifact("<p>Another build</p>"));
                return result;
            };
            process.argv = [process.execPath, request.cliPath, "build", ...request.args];
            require(request.cliPath);
        `,
                JSON.stringify({ serverPath, cliPath, args }),
            ],
            { cwd: directory, timeout: 10000 },
        );
        assert.equal(
            fs.readFileSync(path.join(directory, "output.html"), "utf8"),
            "<p>Own snapshot</p>",
        );
        cli(directory, "build", args);
        assert.equal(
            fs.readFileSync(path.join(directory, "output.html"), "utf8"),
            "<p>Own snapshot</p>",
        );
    });
});

test("registry conversion defaults to one artifact and retains explicit overwrite permission", async () => {
    await inDirectory(directory => {
        fs.writeFileSync(
            path.join(directory, "templates.html"),
            '<f-template name="my-card"><template>Hello</template></f-template>',
        );
        const args = ["--syntax=server-native", "--templates=templates.html"];
        cli(directory, "convert", args);
        const output = path.join(directory, "server.artifact.json");
        const before = snapshot(output);
        assert.throws(() => cli(directory, "convert", args, true));
        cli(directory, "convert", [...args, "--overwrite"], true);
        unchanged(output, before);
        assert.deepEqual(fs.readdirSync(directory).sort(), [
            "server.artifact.json",
            "templates.html",
        ]);
    });
});
