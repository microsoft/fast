// @ts-check

const { describe, it, beforeEach, afterEach, after } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const FAST_BIN = path.resolve(__dirname, "../bin/fast.js");
const WASM = require("../wasm/microsoft_fast_build.js");
const WASM_MODULE = path.resolve(__dirname, "../wasm/microsoft_fast_build.js");
const CONVERT_WASM_MODULE = path.resolve(
    __dirname,
    "../wasm/convert/microsoft_fast_convert.js",
);
const WASM_STUB = path.resolve(__dirname, "wasm-stub.cjs");
const TEST_TEMP_ROOT = path.join(__dirname, ".test-output");

function tmpDir() {
    fs.mkdirSync(TEST_TEMP_ROOT, { recursive: true });
    return fs.realpathSync(fs.mkdtempSync(path.join(TEST_TEMP_ROOT, "case-")));
}

after(() => {
    fs.rmSync(TEST_TEMP_ROOT, { recursive: true, force: true });
});

function run(args, cwd) {
    return runNode(args, cwd);
}

function runNode(args, cwd, nodeArgs = [], env = process.env) {
    return runFast(["build", ...args], cwd, nodeArgs, env);
}

function runFast(args, cwd, nodeArgs = [], env = process.env) {
    return execFileSync(process.execPath, [...nodeArgs, FAST_BIN, ...args], {
        cwd,
        encoding: "utf8",
        env,
        stdio: ["pipe", "pipe", "pipe"],
    });
}

function runWithStderr(args, cwd) {
    return runFastWithStderr(["build", ...args], cwd);
}

function runFastWithStderr(args, cwd, nodeArgs = [], env = process.env) {
    try {
        const stdout = runFast(args, cwd, nodeArgs, env);
        return { stdout, stderr: "", exitCode: 0 };
    } catch (e) {
        return {
            stdout: e.stdout || "",
            stderr: e.stderr || "",
            exitCode: e.status,
        };
    }
}

function writeWasmStub(dir) {
    const record = path.join(dir, "wasm-calls.json");

    return {
        preload: WASM_STUB,
        record,
        env: {
            ...process.env,
            FAST_BUILD_WASM_STUB_MODULE: WASM_MODULE,
            FAST_BUILD_WASM_STUB_RECORD: record,
        },
    };
}

function writeConvertWasmStub(dir) {
    const record = path.join(dir, "convert-wasm-calls.json");

    return {
        preload: WASM_STUB,
        record,
        env: {
            ...process.env,
            FAST_CONVERT_WASM_STUB_MODULE: CONVERT_WASM_MODULE,
            FAST_BUILD_WASM_STUB_RECORD: record,
        },
    };
}

function runWithStubbedWasm(args, cwd) {
    const { preload, record, env } = writeWasmStub(cwd);
    const stdout = runNode(args, cwd, ["--require", preload], env);
    const calls = JSON.parse(fs.readFileSync(record, "utf8"));

    return { stdout, calls };
}

function runConvertWithStubbedWasm(args, cwd) {
    const { preload, record, env } = writeConvertWasmStub(cwd);
    const stdout = runFast(["convert", ...args], cwd, ["--require", preload], env);
    const calls = JSON.parse(fs.readFileSync(record, "utf8"));

    return { stdout, calls };
}

function runConvertWithStderr(args, cwd, stubWasm = false) {
    if (!stubWasm) {
        return runFastWithStderr(["convert", ...args], cwd);
    }

    const { preload, env } = writeConvertWasmStub(cwd);
    return runFastWithStderr(["convert", ...args], cwd, ["--require", preload], env);
}

function writeFixture(dir, { entry, state, output, config, configName }) {
    fs.writeFileSync(
        path.join(dir, "entry.html"),
        entry || "<html><body><h1>{{title}}</h1></body></html>",
    );
    fs.writeFileSync(path.join(dir, "state.json"), state || '{"title":"Hello"}');
    if (config) {
        fs.writeFileSync(
            path.join(dir, configName || "fast-build.config.json"),
            JSON.stringify(config),
        );
    }
}

describe("CLI help", () => {
    it("lists both subcommands from top-level help", () => {
        const stdout = runFast(["--help"], __dirname);

        assert.ok(stdout.includes("build"));
        assert.ok(stdout.includes("convert"));
    });

    it("prints build command help without dispatching to WASM", () => {
        const stdout = runFast(["build", "--help"], __dirname);

        assert.ok(stdout.includes("Usage: fast build"));
        assert.ok(stdout.includes("--entry"));
    });

    it("prints convert command help without dispatching to WASM", () => {
        const stdout = runFast(["convert", "--help"], __dirname);

        assert.ok(stdout.includes("Usage: fast convert"));
        assert.ok(stdout.includes("--syntax"));
    });
});

describe("convert CLI", () => {
    /** @type {string} */
    let dir;

    beforeEach(() => {
        dir = tmpDir();
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it("converts with CLI args and the default webui output suffix", () => {
        fs.writeFileSync(
            path.join(dir, "example.html"),
            '<f-template name="my-el"><template>Hello</template></f-template>',
        );

        const { stdout, calls } = runConvertWithStubbedWasm(
            ["--syntax=webui-prerelease", "--template=example.html"],
            dir,
        );
        const output = fs.readFileSync(path.join(dir, "example.webui.html"), "utf8");

        assert.equal(stdout, "Converted: example.webui.html\n");
        assert.equal(
            output,
            'converted:webui-prerelease:<f-template name="my-el"><template>Hello</template></f-template>',
        );
        assert.deepEqual(calls, [
            {
                name: "convert_template",
                template:
                    '<f-template name="my-el"><template>Hello</template></f-template>',
                syntax: "webui-prerelease",
            },
        ]);
    });

    it("converts with the generated converter WASM when available", {
        skip: !fs.existsSync(CONVERT_WASM_MODULE),
    }, () => {
        fs.writeFileSync(
            path.join(dir, "example.html"),
            '<f-template name="my-el"><template>Hello</template></f-template>',
        );

        const stdout = runFast(
            [
                "convert",
                "--syntax=webui-prerelease",
                "--template=example.html",
                "--output=actual.html",
            ],
            dir,
        );

        assert.equal(stdout, "Converted: actual.html\n");
        assert.equal(
            fs.readFileSync(path.join(dir, "actual.html"), "utf8"),
            "<template>Hello</template>",
        );
    });

    it("replaces * in output paths with the input basename", () => {
        fs.mkdirSync(path.join(dir, "templates"));
        fs.mkdirSync(path.join(dir, "generated"));
        fs.writeFileSync(
            path.join(dir, "templates", "card.html"),
            '<f-template name="card"><template>Card</template></f-template>',
        );

        const { stdout } = runConvertWithStubbedWasm(
            [
                "--syntax=fast-v3-ts",
                "--template=templates/card.html",
                "--output=generated/*.template.ts",
            ],
            dir,
        );

        assert.equal(stdout, "Converted: generated/card.template.ts\n");
        assert.ok(fs.existsSync(path.join(dir, "generated", "card.template.ts")));
    });

    it("loads config paths relative to the config file directory", () => {
        const projectDir = path.join(dir, "project");
        fs.mkdirSync(path.join(projectDir, "out"), { recursive: true });
        fs.writeFileSync(
            path.join(projectDir, "template.html"),
            '<f-template name="configured"><template>Configured</template></f-template>',
        );
        fs.writeFileSync(
            path.join(projectDir, "fast-convert.config.json"),
            JSON.stringify({
                syntax: "webui-prerelease",
                template: "template.html",
                output: "out/*.html",
            }),
        );

        runConvertWithStubbedWasm(["--config=project/fast-convert.config.json"], dir);

        assert.ok(fs.existsSync(path.join(projectDir, "out", "template.html")));
    });

    it("lets CLI args override config values", () => {
        fs.mkdirSync(path.join(dir, "generated"));
        fs.writeFileSync(
            path.join(dir, "config.html"),
            '<f-template name="config"><template>Config</template></f-template>',
        );
        fs.writeFileSync(
            path.join(dir, "cli.html"),
            '<f-template name="cli"><template>CLI</template></f-template>',
        );
        fs.writeFileSync(
            path.join(dir, "fast-convert.config.json"),
            JSON.stringify({
                syntax: "webui-prerelease",
                template: "config.html",
                output: "config.webui.html",
            }),
        );

        runConvertWithStubbedWasm(
            [
                "--syntax=fast-v3-ts",
                "--template=cli.html",
                "--output=generated/*.template.ts",
            ],
            dir,
        );

        assert.ok(fs.existsSync(path.join(dir, "generated", "cli.template.ts")));
        assert.ok(!fs.existsSync(path.join(dir, "config.webui.html")));
    });

    it("prevents overwriting unless --overwrite is present", () => {
        fs.writeFileSync(
            path.join(dir, "example.html"),
            '<f-template name="my-el"><template>Hello</template></f-template>',
        );
        fs.writeFileSync(path.join(dir, "example.webui.html"), "old");

        const result = runConvertWithStderr(
            ["--syntax=webui-prerelease", "--template=example.html"],
            dir,
        );

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("already exists"));
        assert.equal(
            fs.readFileSync(path.join(dir, "example.webui.html"), "utf8"),
            "old",
        );
    });

    it("uses --overwrite even when config overwrite is false", () => {
        fs.writeFileSync(
            path.join(dir, "example.html"),
            '<f-template name="my-el"><template>Hello</template></f-template>',
        );
        fs.writeFileSync(path.join(dir, "example.webui.html"), "old");
        fs.writeFileSync(
            path.join(dir, "fast-convert.config.json"),
            JSON.stringify({
                syntax: "webui-prerelease",
                template: "example.html",
                overwrite: false,
            }),
        );

        runConvertWithStubbedWasm(["--overwrite"], dir);

        assert.notEqual(
            fs.readFileSync(path.join(dir, "example.webui.html"), "utf8"),
            "old",
        );
    });
});

describe("convert validation", () => {
    /** @type {string} */
    let dir;

    beforeEach(() => {
        dir = tmpDir();
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it("requires syntax", () => {
        const result = runConvertWithStderr(["--template=example.html"], dir);

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("Missing required --syntax"));
    });

    it("rejects invalid syntax", () => {
        fs.writeFileSync(path.join(dir, "example.html"), "<template></template>");
        const result = runConvertWithStderr(
            ["--syntax=unknown", "--template=example.html"],
            dir,
        );

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("Invalid --syntax"));
        assert.ok(result.stderr.includes("webui-prerelease"));
        assert.ok(result.stderr.includes("fast-v3-ts"));
    });

    it("requires template", () => {
        const result = runConvertWithStderr(["--syntax=webui-prerelease"], dir);

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("Missing required --template"));
    });

    it("requires an existing template file", () => {
        const result = runConvertWithStderr(
            ["--syntax=webui-prerelease", "--template=missing.html"],
            dir,
        );

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("Template file"));
        assert.ok(result.stderr.includes("not found"));
    });

    it("requires an html template extension", () => {
        fs.writeFileSync(path.join(dir, "example.txt"), "text");
        const result = runConvertWithStderr(
            ["--syntax=webui-prerelease", "--template=example.txt"],
            dir,
        );

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes('must use the ".html" extension'));
    });

    it("rejects template directory paths", () => {
        fs.mkdirSync(path.join(dir, "directory.html"));
        const result = runConvertWithStderr(
            ["--syntax=webui-prerelease", "--template=directory.html"],
            dir,
        );

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("is not a file"));
    });

    it("requires the output extension for the selected syntax", () => {
        fs.writeFileSync(path.join(dir, "example.html"), "<template></template>");
        const result = runConvertWithStderr(
            ["--syntax=fast-v3-ts", "--template=example.html", "--output=example.html"],
            dir,
        );

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes('must use the ".ts" extension'));
    });

    it("requires the output parent directory to exist", () => {
        fs.writeFileSync(path.join(dir, "example.html"), "<template></template>");
        const result = runConvertWithStderr(
            [
                "--syntax=webui-prerelease",
                "--template=example.html",
                "--output=missing/example.html",
            ],
            dir,
        );

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("Output parent directory"));
        assert.ok(result.stderr.includes("not found"));
    });

    it("rejects output directory paths", () => {
        fs.writeFileSync(path.join(dir, "example.html"), "<template></template>");
        fs.mkdirSync(path.join(dir, "output.html"));
        const result = runConvertWithStderr(
            [
                "--syntax=webui-prerelease",
                "--template=example.html",
                "--output=output.html",
            ],
            dir,
        );

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("is a directory"));
    });

    it("rejects non-boolean overwrite config values", () => {
        fs.writeFileSync(
            path.join(dir, "fast-convert.config.json"),
            '{"overwrite":"true"}',
        );
        const result = runConvertWithStderr([], dir);

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes('Value for "overwrite"'));
        assert.ok(result.stderr.includes("must be a boolean"));
    });
});

describe("config file loading", () => {
    /** @type {string} */
    let dir;

    beforeEach(() => {
        dir = tmpDir();
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it("loads default fast-build.config.json from CWD", () => {
        writeFixture(dir, {
            config: {
                entry: "entry.html",
                state: "state.json",
                output: "out.html",
            },
        });
        run([], dir);
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        assert.ok(output.includes("Hello"));
    });

    it("proceeds without error when no default config exists", () => {
        writeFixture(dir, {});
        run(["--entry=entry.html", "--state=state.json", "--output=out.html"], dir);
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        assert.ok(output.includes("Hello"));
    });

    it("loads an explicit --config file", () => {
        writeFixture(dir, {
            config: {
                entry: "entry.html",
                state: "state.json",
                output: "out.html",
            },
            configName: "custom.json",
        });
        run(["--config=custom.json"], dir);
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        assert.ok(output.includes("Hello"));
    });

    it("errors when explicit --config file does not exist", () => {
        writeFixture(dir, {});
        const result = runWithStderr(["--config=nonexistent.json"], dir);
        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("not found"));
    });

    it("CLI arguments override config values", () => {
        writeFixture(dir, {
            config: {
                entry: "entry.html",
                state: "state.json",
                output: "config-out.html",
            },
        });
        run(["--output=cli-out.html"], dir);
        assert.ok(fs.existsSync(path.join(dir, "cli-out.html")));
        assert.ok(!fs.existsSync(path.join(dir, "config-out.html")));
    });

    it("resolves config paths relative to config file directory", () => {
        const subDir = path.join(dir, "sub");
        fs.mkdirSync(subDir);
        writeFixture(subDir, {
            config: {
                entry: "entry.html",
                state: "state.json",
                output: "out.html",
            },
        });
        run(["--config=sub/fast-build.config.json"], dir);
        assert.ok(fs.existsSync(path.join(subDir, "out.html")));
    });
});

describe("config validation", () => {
    /** @type {string} */
    let dir;

    beforeEach(() => {
        dir = tmpDir();
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it("rejects unknown keys", () => {
        writeFixture(dir, {});
        fs.writeFileSync(path.join(dir, "fast-build.config.json"), '{"badkey":"val"}');
        const result = runWithStderr([], dir);
        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes('Unknown key "badkey"'));
    });

    it("rejects non-string values", () => {
        writeFixture(dir, {});
        fs.writeFileSync(path.join(dir, "fast-build.config.json"), '{"entry":123}');
        const result = runWithStderr([], dir);
        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("must be a string"));
    });

    it("rejects arrays", () => {
        writeFixture(dir, {});
        fs.writeFileSync(path.join(dir, "fast-build.config.json"), "[]");
        const result = runWithStderr([], dir);
        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("must contain a JSON object"));
    });

    it("rejects invalid JSON", () => {
        writeFixture(dir, {});
        fs.writeFileSync(path.join(dir, "fast-build.config.json"), "{bad json");
        const result = runWithStderr([], dir);
        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("Failed to parse"));
    });

    it("rejects non-boolean stream config values", () => {
        writeFixture(dir, {
            config: {
                entry: "entry.html",
                state: "state.json",
                output: "out.html",
                stream: "true",
            },
        });
        const result = runWithStderr([], dir);
        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes('Value for "stream"'));
        assert.ok(result.stderr.includes("must be a boolean"));
    });
});

describe("backward compatibility", () => {
    /** @type {string} */
    let dir;

    beforeEach(() => {
        dir = tmpDir();
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it("works with only CLI args and no config file", () => {
        writeFixture(dir, {});
        run(["--entry=entry.html", "--state=state.json", "--output=out.html"], dir);
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        assert.ok(output.includes("Hello"));
    });

    it("merges partial config with CLI args", () => {
        writeFixture(dir, {
            config: { entry: "entry.html" },
        });
        run(["--state=state.json", "--output=out.html"], dir);
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        assert.ok(output.includes("Hello"));
    });

    it("writes output and prints Built when --stream=false", () => {
        writeFixture(dir, {});
        const stdout = run(
            [
                "--entry=entry.html",
                "--state=state.json",
                "--output=out.html",
                "--stream=false",
            ],
            dir,
        );
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");

        assert.equal(stdout, "Built: out.html\n");
        assert.ok(output.includes("Hello"));
    });
});

describe("stream config", () => {
    /** @type {string} */
    let dir;

    beforeEach(() => {
        dir = tmpDir();
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it("streams when stream is true in config", () => {
        writeFixture(dir, {
            config: {
                entry: "entry.html",
                state: "state.json",
                output: "out.html",
                stream: true,
            },
        });

        const { stdout, calls } = runWithStubbedWasm([], dir);
        const renderCall = calls.find(
            call => call.name === "render_entry_with_templates",
        );

        assert.equal(stdout, "<h1>Hello</h1>");
        assert.ok(!stdout.includes("Built:"));
        assert.ok(!fs.existsSync(path.join(dir, "out.html")));
        assert.ok(renderCall);
        assert.equal(renderCall.stream, true);
    });

    it("lets --stream override stream false in config", () => {
        writeFixture(dir, {
            config: {
                entry: "entry.html",
                state: "state.json",
                output: "out.html",
                stream: false,
            },
        });

        const { stdout, calls } = runWithStubbedWasm(["--stream"], dir);
        const renderCall = calls.find(
            call => call.name === "render_entry_with_templates",
        );

        assert.equal(stdout, "<h1>Hello</h1>");
        assert.ok(!fs.existsSync(path.join(dir, "out.html")));
        assert.ok(renderCall);
        assert.equal(renderCall.stream, true);
    });

    it("lets --stream=false override stream true in config", () => {
        writeFixture(dir, {
            config: {
                entry: "entry.html",
                state: "state.json",
                output: "out.html",
                stream: true,
            },
        });

        const { stdout, calls } = runWithStubbedWasm(["--stream=false"], dir);
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");

        assert.equal(stdout, `Built: ${fs.realpathSync(path.join(dir, "out.html"))}\n`);
        assert.equal(output, "<h1>Non-stream</h1>");
        assert.ok(calls.some(call => call.name === "render"));
        assert.ok(!calls.some(call => call.stream === true));
    });
});

describe("stream output", () => {
    /** @type {string} */
    let dir;

    beforeEach(() => {
        dir = tmpDir();
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it("treats valueless --stream as true and streams without templates", () => {
        writeFixture(dir, {});
        const { stdout, calls } = runWithStubbedWasm(
            ["--stream", "--entry=entry.html", "--state=state.json", "--output=out.html"],
            dir,
        );
        const renderCall = calls.find(
            call => call.name === "render_entry_with_templates",
        );

        assert.equal(stdout, "<h1>Hello</h1>");
        assert.ok(!stdout.includes("Built:"));
        assert.ok(!fs.existsSync(path.join(dir, "out.html")));
        assert.ok(renderCall);
        assert.equal(renderCall.templatesJson, "{}");
        assert.equal(renderCall.stream, true);
        assert.ok(!calls.some(call => call.name === "render"));
    });

    it("streams with templates through render_entry_with_templates stream flag", () => {
        fs.writeFileSync(
            path.join(dir, "entry.html"),
            '<my-el text="{{title}}"></my-el>',
        );
        fs.writeFileSync(path.join(dir, "state.json"), '{"title":"Hello"}');
        fs.writeFileSync(
            path.join(dir, "templates.html"),
            '<f-template name="my-el"><span>{{text}}</span></f-template>',
        );

        const { stdout, calls } = runWithStubbedWasm(
            [
                "--stream",
                "--entry=entry.html",
                "--state=state.json",
                "--templates=templates.html",
                "--attribute-name-strategy=none",
            ],
            dir,
        );
        const renderCall = calls.find(
            call => call.name === "render_entry_with_templates",
        );
        assert.ok(renderCall);
        const templates = JSON.parse(renderCall.templatesJson);

        assert.equal(stdout, "<my-el>Hello</my-el>");
        assert.equal(templates["my-el"].content, "<span>{{text}}</span>");
        assert.deepEqual(templates["my-el"].shadowrootAttributes, [
            { name: "shadowrootmode", value: "open" },
        ]);
        assert.equal(renderCall.attributeNameStrategy, "none");
        assert.equal(renderCall.stream, true);
        assert.ok(calls.some(call => call.name === "parse_f_templates"));
    });
});

describe("template shadowroot attributes", () => {
    /** @type {string} */
    let dir;

    beforeEach(() => {
        dir = tmpDir();
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it("forwards f-template shadowroot attributes through the CLI", () => {
        writeFixture(dir, {
            entry: "<my-el></my-el>",
            state: "{}",
        });
        fs.mkdirSync(path.join(dir, "templates"));
        fs.writeFileSync(
            path.join(dir, "templates", "my-el.html"),
            `<f-template name="my-el" shadowrootmode="closed" shadowrootdelegatesfocus>
                <template><span>shadow</span></template>
            </f-template>`,
        );

        run(
            [
                "--templates=templates/*.html",
                "--entry=entry.html",
                "--state=state.json",
                "--output=out.html",
            ],
            dir,
        );

        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        const templateMatch = output.match(/<template\b[^>]*>/);
        assert.ok(templateMatch, output);
        const templateTag = templateMatch[0];
        assert.ok(templateTag.includes(`shadowrootmode="closed"`), output);
        assert.ok(templateTag.includes(`shadowroot="closed"`), output);
        assert.ok(templateTag.includes("shadowrootdelegatesfocus"), output);
    });
});

describe("no state behavior", () => {
    /** @type {string} */
    let dir;

    beforeEach(() => {
        dir = tmpDir();
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it("uses an empty object when state is omitted", () => {
        fs.writeFileSync(
            path.join(dir, "entry.html"),
            '<h1>{{title}}</h1><div class="{{missing}}"></div>',
        );
        run(["--entry=entry.html", "--output=out.html"], dir);
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        assert.equal(output, "<h1></h1><div></div>");
    });

    it("treats missing f-repeat lists as empty when state is omitted", () => {
        fs.writeFileSync(
            path.join(dir, "entry.html"),
            '<ul><f-repeat value="{{item in items}}"><li>{{item}}</li></f-repeat></ul>',
        );
        run(["--entry=entry.html", "--output=out.html"], dir);
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        assert.equal(output, "<ul></ul>");
    });

    it("ignores state.json when state is omitted", () => {
        fs.writeFileSync(
            path.join(dir, "entry.html"),
            '<h1>{{title}}</h1><div class="{{missing}}"></div>',
        );
        fs.writeFileSync(
            path.join(dir, "state.json"),
            '{"title":"This should not render","missing":"also-ignored"}',
        );
        run(["--entry=entry.html", "--output=out.html"], dir);
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        assert.equal(output, "<h1></h1><div></div>");
    });

    it("loads an explicit state file", () => {
        fs.writeFileSync(path.join(dir, "entry.html"), "<h1>{{title}}</h1>");
        fs.writeFileSync(path.join(dir, "state.json"), '{"title":"Hello"}');
        run(["--entry=entry.html", "--state=state.json", "--output=out.html"], dir);
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        assert.equal(output, "<h1>Hello</h1>");
    });

    it("errors when an explicit CLI state file is missing", () => {
        fs.writeFileSync(path.join(dir, "entry.html"), "<h1>{{title}}</h1>");
        const result = runWithStderr(
            ["--entry=entry.html", "--state=missing.json", "--output=out.html"],
            dir,
        );
        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes('State file "missing.json" not found'));
    });

    it("errors when an explicit CLI state path is empty", () => {
        fs.writeFileSync(path.join(dir, "entry.html"), "<h1>{{title}}</h1>");
        const result = runWithStderr(
            ["--entry=entry.html", "--state=", "--output=out.html"],
            dir,
        );
        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("State file (no path provided) not found"));
    });

    it("errors when an explicit config state file is missing", () => {
        fs.writeFileSync(path.join(dir, "entry.html"), "<h1>{{title}}</h1>");
        fs.writeFileSync(path.join(dir, "state.json"), '{"title":"Default ignored"}');
        fs.writeFileSync(
            path.join(dir, "fast-build.config.json"),
            JSON.stringify({
                entry: "entry.html",
                state: "missing.json",
                output: "out.html",
            }),
        );
        const result = runWithStderr([], dir);
        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes("State file"));
        assert.ok(result.stderr.includes("missing.json"));
        assert.ok(result.stderr.includes("not found"));
    });

    it("omits missing attributes and empty-renders missing content", () => {
        fs.writeFileSync(path.join(dir, "entry.html"), "<test-element></test-element>");
        fs.writeFileSync(
            path.join(dir, "templates.html"),
            [
                '<f-template name="test-element"><template>',
                '<input class="{{ foo.bar }}" aria-label="{{foo.bar}}">',
                "<p>{{ foo.bar }}</p>",
                "</template></f-template>",
            ].join(""),
        );

        run(
            ["--entry=entry.html", "--templates=templates.html", "--output=out.html"],
            dir,
        );
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        assert.ok(!output.includes("class="));
        assert.ok(!output.includes("aria-label="));
        assert.ok(output.includes("<p>"));
    });

    it("uses entry-template rendering when custom element templates are loaded", () => {
        fs.writeFileSync(
            path.join(dir, "entry.html"),
            '<test-element list="{{items}}"></test-element>',
        );
        fs.writeFileSync(path.join(dir, "state.json"), '{"items":["one","two"]}');
        fs.writeFileSync(
            path.join(dir, "templates.html"),
            [
                '<f-template name="test-element"><template>',
                '<f-repeat value="{{item in list}}"><span>{{item}}</span></f-repeat>',
                "</template></f-template>",
            ].join(""),
        );

        run(
            [
                "--entry=entry.html",
                "--state=state.json",
                "--templates=templates.html",
                "--output=out.html",
            ],
            dir,
        );
        const output = fs.readFileSync(path.join(dir, "out.html"), "utf8");
        assert.ok(!output.includes("list="), output);
        assert.ok(output.includes("one"), output);
        assert.ok(output.includes("two"), output);
    });
});

describe("WASM optional state", () => {
    it("render accepts omitted state", () => {
        assert.equal(WASM.render("<p>{{missing}}</p>"), "<p></p>");
        assert.equal(WASM.render('<div class="{{missing}}"></div>'), "<div></div>");
    });

    it("render accepts missing dot paths with omitted or empty state", () => {
        assert.equal(WASM.render("<p>{{ foo.bar }}</p>"), "<p></p>");
        assert.equal(WASM.render("<p>{{ foo.bar }}</p>", "{}"), "<p></p>");
        assert.equal(WASM.render('<div class="{{ foo.bar }}"></div>'), "<div></div>");
        assert.equal(
            WASM.render('<div class="{{ foo.bar }}"></div>', "{}"),
            "<div></div>",
        );
    });

    it("render treats missing f-repeat lists as empty arrays", () => {
        assert.equal(
            WASM.render(
                '<f-repeat value="{{item in items}}"><span>{{item}}</span></f-repeat>',
            ),
            "",
        );
        assert.equal(
            WASM.render(
                '<f-repeat value="{{item in items.list}}"><span>{{item}}</span></f-repeat>',
                "{}",
            ),
            "",
        );
    });

    it("render_with_templates accepts omitted state", () => {
        const result = WASM.render_with_templates(
            "<test-element></test-element>",
            JSON.stringify({
                "test-element": '<input class="{{foo.bar}}"><span>{{ foo.bar }}</span>',
            }),
        );
        assert.ok(!result.includes("class="));
        assert.ok(result.includes("<span>"));
    });

    it("render_entry_with_templates renders entry custom elements from root state", () => {
        const result = WASM.render_entry_with_templates(
            "<test-element></test-element>",
            JSON.stringify({
                "test-element": "<span>{{ foo.bar }}</span>",
            }),
            JSON.stringify({ foo: { bar: "Hello" } }),
        );
        assert.ok(result.includes("Hello"));
    });

    it("exports both template renderers with distinct root tag handling", () => {
        const templates = JSON.stringify({
            "test-element": "<span>{{ list }}</span>",
        });
        const state = JSON.stringify({ list: ["one", "two"] });
        const entry = '<test-element list="{{list}}"></test-element>';

        const templateResult = WASM.render_with_templates(entry, templates, state);
        const entryResult = WASM.render_entry_with_templates(entry, templates, state);

        assert.ok(templateResult.includes('list="[Array]"'), templateResult);
        assert.ok(!entryResult.includes("list="), entryResult);
    });

    it("render_with_templates accepts a strategy when state is omitted", () => {
        const result = WASM.render_with_templates(
            '<test-element foo-bar="Hello"></test-element>',
            JSON.stringify({
                "test-element": "<span>{{foo-bar}}</span>",
            }),
            undefined,
            "none",
        );
        assert.ok(result.includes("Hello"));
    });

    it("render_entry_with_templates accepts a strategy when state is omitted", () => {
        const result = WASM.render_entry_with_templates(
            '<test-element foo-bar="Hello"></test-element>',
            JSON.stringify({
                "test-element": "<span>{{foo-bar}}</span>",
            }),
            undefined,
            "none",
        );
        assert.ok(result.includes("Hello"));
    });
});
