// @ts-check

const { after, beforeEach, describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const fixturesDir = __dirname;
const packageDir = path.resolve(fixturesDir, "../../..");
const fastBin = path.join(packageDir, "bin", "fast.js");
const outputRoot = path.join(packageDir, "test", ".fixture-output");
const supportedTemplate = path.join(fixturesDir, "supported.html");
const fixtureConfig = path.join(fixturesDir, "fast-convert.config.json");

beforeEach(() => {
    fs.rmSync(outputRoot, { recursive: true, force: true });
    fs.mkdirSync(outputRoot, { recursive: true });
});

after(() => {
    fs.rmSync(outputRoot, { recursive: true, force: true });
});

function outputDir(name) {
    const dir = path.join(outputRoot, name);
    fs.mkdirSync(dir, { recursive: true });
    return dir;
}

function runConvert(args) {
    return execFileSync(process.execPath, [fastBin, "convert", ...args], {
        cwd: packageDir,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
    });
}

function runConvertWithStderr(args) {
    try {
        const stdout = runConvert(args);
        return { stdout, stderr: "", exitCode: 0 };
    } catch (e) {
        return {
            stdout: e.stdout || "",
            stderr: e.stderr || "",
            exitCode: e.status,
        };
    }
}

function assertIncludes(output, expected) {
    assert.ok(
        output.includes(expected),
        `Expected output to include:\n${expected}\n\nActual output:\n${output}`,
    );
}

function assertWebuiOutput(output) {
    assertIncludes(output, '<for each="item in items">');
    assertIncludes(output, '<if condition="item.visible">');
    assertIncludes(output, '<for each="child in item.children">');
    assertIncludes(output, 'f-ref="root"');
    assertIncludes(output, 'f-children="children"');
    assertIncludes(output, 'f-slotted="{slottedNodes}"');
    assertIncludes(output, '@click="{handleRoot($e, $c)}"');
    assertIncludes(output, '@click="{handleChild($e, $c, child.id)}"');
    assert.equal(output.includes("<f-repeat"), false);
    assert.equal(output.includes("<f-when"), false);
}

function assertFastV3TsOutput(output) {
    assertIncludes(output, 'import { html } from "@microsoft/fast-element/html.js";');
    assertIncludes(output, 'import { repeat } from "@microsoft/fast-element/repeat.js";');
    assertIncludes(output, 'import { when } from "@microsoft/fast-element/when.js";');
    assertIncludes(output, 'import { ref } from "@microsoft/fast-element/ref.js";');
    assertIncludes(
        output,
        'import { children } from "@microsoft/fast-element/children.js";',
    );
    assertIncludes(
        output,
        'import { slotted } from "@microsoft/fast-element/slotted.js";',
    );
    assertIncludes(output, 'title="${x => x.title}"');
    assertIncludes(output, '?hidden="${x => x.hidden}"');
    assertIncludes(output, ':value="${x => x.value}"');
    assertIncludes(output, 'data-literal="literal \\${ value } \\`tick\\` \\\\ slash"');
    assertIncludes(output, '${ref("root")}');
    assertIncludes(output, '${children("children")}');
    assertIncludes(output, '${slotted("slottedNodes")}');
    assertIncludes(output, '@click="${(x, c) => x.handleRoot(c.event, c)}"');
    assertIncludes(output, "${repeat(x => x.items, x => html`");
    assertIncludes(output, "${when(x => x.visible, html`");
    assertIncludes(output, "${repeat(x => x.children, x => html`");
    assertIncludes(
        output,
        '@click="${(x, c) => c.parentContext.parent.handleChild(c.event, c, x.id)}"',
    );
    assertIncludes(output, "Literal \\${ sequence, \\`backtick\\`, and \\\\ backslash");
    assert.equal(output.includes("<f-repeat"), false);
    assert.equal(output.includes("<f-when"), false);
}

describe("fast convert fixtures", () => {
    it("loads fixture config and converts webui-prerelease output to a temp location", () => {
        const configOutputDir = outputDir("config");

        runConvert([`--config=${fixtureConfig}`]);

        const outputPath = path.join(configOutputDir, "supported.html");
        const output = fs.readFileSync(outputPath, "utf8");
        assertWebuiOutput(output);
        assert.equal(
            fs.existsSync(path.join(fixturesDir, "supported.webui.html")),
            false,
        );
        assert.equal(
            fs.existsSync(path.join(fixturesDir, "supported.template.ts")),
            false,
        );
    });

    it("lets CLI args override fixture config values for fast-v3-ts", () => {
        const cliOutputDir = outputDir("cli-precedence");
        const outputPath = path.join(cliOutputDir, "supported.template.ts");

        runConvert([
            `--config=${fixtureConfig}`,
            "--syntax=fast-v3-ts",
            `--template=${supportedTemplate}`,
            `--output=${path.join(cliOutputDir, "*.template.ts")}`,
        ]);

        assertFastV3TsOutput(fs.readFileSync(outputPath, "utf8"));
        assert.equal(
            fs.existsSync(path.join(outputRoot, "config", "supported.html")),
            false,
        );
    });

    it("validates overwrite before replacing generated fixture output", () => {
        const overwriteOutputDir = outputDir("overwrite");
        const outputPath = path.join(overwriteOutputDir, "supported.html");
        fs.writeFileSync(outputPath, "stale output", "utf8");

        const blocked = runConvertWithStderr([
            "--syntax=webui-prerelease",
            `--template=${supportedTemplate}`,
            `--output=${outputPath}`,
        ]);

        assert.equal(blocked.exitCode, 1);
        assertIncludes(blocked.stderr, "already exists");
        assert.equal(fs.readFileSync(outputPath, "utf8"), "stale output");

        runConvert([
            "--syntax=webui-prerelease",
            `--template=${supportedTemplate}`,
            `--output=${outputPath}`,
            "--overwrite",
        ]);

        assertWebuiOutput(fs.readFileSync(outputPath, "utf8"));
    });

    it("validates output extensions for fixture conversion", () => {
        const extensionOutputDir = outputDir("extension");
        const result = runConvertWithStderr([
            "--syntax=fast-v3-ts",
            `--template=${supportedTemplate}`,
            `--output=${path.join(extensionOutputDir, "wrong.html")}`,
        ]);

        assert.equal(result.exitCode, 1);
        assertIncludes(result.stderr, 'must use the ".ts" extension');
    });

    it("validates missing output parent directories for fixture conversion", () => {
        const result = runConvertWithStderr([
            "--syntax=webui-prerelease",
            `--template=${supportedTemplate}`,
            `--output=${path.join(outputRoot, "missing-parent", "supported.html")}`,
        ]);

        assert.equal(result.exitCode, 1);
        assertIncludes(result.stderr, "Output parent directory");
        assertIncludes(result.stderr, "not found");
    });

    for (const { name, syntax, outputExtension, expectedMessage } of [
        {
            name: "invalid-repeat",
            syntax: "webui-prerelease",
            outputExtension: ".html",
            expectedMessage: "invalid repeat expression",
        },
        {
            name: "unsupported-f-attribute",
            syntax: "fast-v3-ts",
            outputExtension: ".ts",
            expectedMessage: "unsupported f-* attribute",
        },
        {
            name: "missing-inner-template",
            syntax: "webui-prerelease",
            outputExtension: ".html",
            expectedMessage: "inner '<template>' element",
        },
    ]) {
        it(`surfaces converter validation errors for ${name}`, () => {
            const validationOutputDir = outputDir("validation");
            const result = runConvertWithStderr([
                `--syntax=${syntax}`,
                `--template=${path.join(fixturesDir, "validation", `${name}.html`)}`,
                `--output=${path.join(validationOutputDir, `${name}${outputExtension}`)}`,
            ]);

            assert.equal(result.exitCode, 1);
            assertIncludes(result.stderr, expectedMessage);
        });
    }
});
