// @ts-check

// Regression coverage for https://github.com/microsoft/fast/issues/7705.
//
// `fast convert --syntax=fast-v3-ts` can combine more than one differently
// named `ref`/`children`/`slotted` directive in a single template (see
// `supported.html`). Once a real, non-`any` `TSource` is supplied, TypeScript
// infers `TSource` from *all* interpolated directive values collectively, so
// this combination is exactly the shape that broke before `CaptureType`'s
// generic parameters were restored (#7577 / #7584). This test type-checks the
// `--type-source` output against a concrete element type with distinct
// property names for each directive, so a future regression in either the
// converter or `CaptureType` itself fails here instead of silently drifting
// out of sync.

const { after, before, describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const fixturesDir = __dirname;
const packageDir = path.resolve(fixturesDir, "../../..");
const repoRoot = path.resolve(packageDir, "../..");
const fastBin = path.join(packageDir, "bin", "fast.js");
const supportedTemplate = path.join(fixturesDir, "supported.html");
const outputDir = path.join(packageDir, "test", ".fixture-output-type-source");

const typescript = require(path.join(repoRoot, "node_modules", "typescript"));

const FIXTURE_ELEMENT_SOURCE = `
export class FixtureCard {
    root!: HTMLElement;
    children!: HTMLElement[];
    slottedNodes!: Node[];
    title!: string;
    hidden!: boolean;
    value!: string;
    items!: {
        name: string;
        visible: boolean;
        count: number;
        children: { label: string; id: string }[];
    }[];
    handleRoot(e: Event, c: unknown): void {}
    handleChild(e: Event, c: unknown, id: string): void {}
}
`;

before(() => {
    fs.rmSync(outputDir, { recursive: true, force: true });
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
        path.join(outputDir, "fixture-card.ts"),
        FIXTURE_ELEMENT_SOURCE,
        "utf8",
    );
});

after(() => {
    fs.rmSync(outputDir, { recursive: true, force: true });
});

function runConvert(args) {
    return execFileSync(process.execPath, [fastBin, "convert", ...args], {
        cwd: packageDir,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
    });
}

/**
 * @param {string[]} fileNames
 * @returns {import("typescript").Diagnostic[]}
 */
function typeCheck(fileNames) {
    const program = typescript.createProgram(fileNames, {
        target: typescript.ScriptTarget.ES2020,
        module: typescript.ModuleKind.ESNext,
        moduleResolution: typescript.ModuleResolutionKind.Bundler,
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        types: [],
    });

    return typescript.getPreEmitDiagnostics(program);
}

function formatDiagnostics(diagnostics) {
    return typescript.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCurrentDirectory: () => outputDir,
        getCanonicalFileName: fileName => fileName,
        getNewLine: () => "\n",
    });
}

describe("fast convert --type-source", () => {
    it("emits an html<TypeSource> call that type-checks against a concrete element type with distinct directive property names", () => {
        const outputPath = path.join(outputDir, "supported.template.ts");

        runConvert([
            "--syntax=fast-v3-ts",
            `--template=${supportedTemplate}`,
            `--output=${outputPath}`,
            "--type-source=FixtureCard",
            "--type-source-import=./fixture-card.js",
        ]);

        const output = fs.readFileSync(outputPath, "utf8");
        assert.ok(
            output.includes('import type { FixtureCard } from "./fixture-card.js";'),
        );
        assert.ok(output.includes("export const template = html<FixtureCard>`"));

        const diagnostics = typeCheck([
            outputPath,
            path.join(outputDir, "fixture-card.ts"),
        ]);

        assert.equal(
            diagnostics.length,
            0,
            `Expected no type errors, got:\n${formatDiagnostics(diagnostics)}`,
        );
    });

    it("fails to type-check when a directive property name does not exist on TSource", () => {
        const outputPath = path.join(outputDir, "mismatched.template.ts");

        runConvert([
            "--syntax=fast-v3-ts",
            `--template=${supportedTemplate}`,
            `--output=${outputPath}`,
            "--type-source=FixtureCard",
            "--type-source-import=./fixture-card.js",
        ]);

        let content = fs.readFileSync(outputPath, "utf8");
        content = content.replace('ref("root")', 'ref("doesNotExist")');
        fs.writeFileSync(outputPath, content, "utf8");

        const diagnostics = typeCheck([
            outputPath,
            path.join(outputDir, "fixture-card.ts"),
        ]);

        assert.ok(
            diagnostics.length > 0,
            "Expected a type error for a directive property name absent from TSource",
        );
    });
});
