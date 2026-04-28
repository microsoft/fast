// @ts-check

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const FAST_BIN = path.resolve(__dirname, "../bin/fast.js");
const WASM = require("../wasm/microsoft_fast_build.js");

function tmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), "fast-build-test-"));
}

function run(args, cwd) {
    return execFileSync(process.execPath, [FAST_BIN, "build", ...args], {
        cwd,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
    });
}

function runWithStderr(args, cwd) {
    try {
        const stdout = execFileSync(process.execPath, [FAST_BIN, "build", ...args], {
            cwd,
            encoding: "utf8",
            stdio: ["pipe", "pipe", "pipe"],
        });
        return { stdout, stderr: "", exitCode: 0 };
    } catch (e) {
        return {
            stdout: e.stdout || "",
            stderr: e.stderr || "",
            exitCode: e.status,
        };
    }
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
