// @ts-check

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const FAST_BIN = path.resolve(__dirname, "../bin/fast.js");

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
        assert.ok(
            output.includes(
                `<template shadowrootmode="closed" shadowroot="closed" shadowrootdelegatesfocus>`,
            ),
            output,
        );
    });
});
