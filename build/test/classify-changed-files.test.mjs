import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifyChangedFiles } from "../scripts/classify-changed-files.mjs";

/**
 * `docsOnly` gates the test steps, `lageNoop` gates the build steps.
 * `lageNoop` implies `docsOnly`: a change that lage would not build is, by
 * construction, a change with nothing to test.
 */
function classify(files) {
    const result = classifyChangedFiles(files);

    if (result.lageNoop) {
        assert.equal(
            result.docsOnly,
            true,
            `lageNoop implies docsOnly, but got ${JSON.stringify(result)}`,
        );
    }

    return result;
}

describe("classifyChangedFiles", () => {
    describe("fails open", () => {
        it("treats an empty file list as a full run", () => {
            assert.deepEqual(classify([]), {
                docsOnly: false,
                lageNoop: false,
                reason: "empty-diff",
            });
        });
    });

    describe("documentation with no lage target", () => {
        // lage.config.js `ignore` — these paths map to no package, so
        // `lage build --since` would run nothing even if we let it.
        const cases = [
            ["root markdown", "README.md"],
            ["root markdown", "CONTRIBUTING.md"],
            ["the license", "LICENSE"],
            ["beachball change files", "change/@microsoft-fast-element-abc123.json"],
            ["issue templates", ".github/ISSUE_TEMPLATE/bug-report.md"],
            ["repository skills", ".github/skills/rust/SKILL.md"],
        ];

        for (const [label, file] of cases) {
            it(`skips build and test for ${label}: ${file}`, () => {
                assert.deepEqual(classify([file]), {
                    docsOnly: true,
                    lageNoop: true,
                    reason: "docs-only-lage-noop",
                });
            });
        }

        it("skips build and test when every file is lage-ignored prose", () => {
            assert.deepEqual(
                classify([
                    "README.md",
                    "LICENSE",
                    ".github/ISSUE_TEMPLATE/rfc.md",
                    "change/@microsoft-fast-element-abc123.json",
                ]),
                { docsOnly: true, lageNoop: true, reason: "docs-only-lage-noop" },
            );
        });
    });

    describe("documentation that lage still builds", () => {
        // Prose inside a workspace: nothing to test, but `lage build --since`
        // maps it to a package, so the build must still run for
        // `test:validation` to have something to check.
        const cases = [
            ["package docs", "packages/fast-element/docs/introduction.md"],
            ["package readme", "packages/fast-element/README.md"],
            ["website prose", "sites/website/src/docs/3.x/guide/getting-started.md"],
            ["specs", "specs/design-tokens.md"],
        ];

        for (const [label, file] of cases) {
            it(`skips only the tests for ${label}: ${file}`, () => {
                assert.deepEqual(classify([file]), {
                    docsOnly: true,
                    lageNoop: false,
                    reason: "docs-only-lage-builds",
                });
            });
        }
    });

    describe("generated markdown is not documentation", () => {
        // Only `lage build` followed by `test:validation` can prove these are
        // current, so they must never be classified as prose.
        const cases = [
            ["api-extractor report", "packages/fast-element/temp/fast-element.api.md"],
            ["bundle sizes", "packages/fast-element/SIZES.md"],
            ["export sizes", "sites/website/src/docs/3.x/resources/export-sizes.md"],
            ["path exports", "sites/website/src/docs/3.x/advanced/path-exports.md"],
            ["generated api docs", "sites/website/src/docs/3.x/api/fast-element.html.md"],
            ["beachball changelog", "packages/fast-element/CHANGELOG.md"],
        ];

        for (const [label, file] of cases) {
            it(`runs the full pipeline for ${label}: ${file}`, () => {
                assert.deepEqual(classify([file]), {
                    docsOnly: false,
                    lageNoop: false,
                    reason: "touches-generated-markdown",
                });
            });
        }

        it("runs the full pipeline when prose is mixed with generated markdown", () => {
            assert.deepEqual(classify(["README.md", "packages/fast-element/SIZES.md"]), {
                docsOnly: false,
                lageNoop: false,
                reason: "touches-generated-markdown",
            });
        });
    });

    describe("code", () => {
        const cases = [
            ["source", "packages/fast-element/src/index.ts"],
            ["workflows", ".github/workflows/ci-validate-pr.yml"],
            ["rust", "crates/microsoft-fast-build/src/lib.rs"],
            ["package manifests", "packages/fast-element/package.json"],
            ["nested json", "change/nested/not-a-change-file.json"],
        ];

        for (const [label, file] of cases) {
            it(`runs the full pipeline for ${label}: ${file}`, () => {
                assert.deepEqual(classify([file]), {
                    docsOnly: false,
                    lageNoop: false,
                    reason: "non-doc-files-present",
                });
            });
        }

        it("runs the full pipeline when docs are mixed with code", () => {
            assert.deepEqual(
                classify(["README.md", "packages/fast-element/src/index.ts"]),
                { docsOnly: false, lageNoop: false, reason: "non-doc-files-present" },
            );
        });
    });

    describe("input hygiene", () => {
        it("ignores blank lines from the git plumbing", () => {
            assert.deepEqual(classify(["", "README.md", "  ", ""]), {
                docsOnly: true,
                lageNoop: true,
                reason: "docs-only-lage-noop",
            });
        });

        it("treats a list of only blank lines as an empty diff", () => {
            assert.deepEqual(classify(["", "   "]), {
                docsOnly: false,
                lageNoop: false,
                reason: "empty-diff",
            });
        });
    });
});
