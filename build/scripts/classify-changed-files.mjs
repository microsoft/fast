#!/usr/bin/env node
/**
 * Decides how much of CI a pull request actually needs.
 *
 * Reads the pull request's changed files on stdin (one path per line, as
 * `git diff --name-only` prints them) and emits two flags. Both are inverted,
 * so a missing or unparsable answer means "run everything":
 *
 *   docs_only  the pull request changes prose only, so there is nothing to test
 *   lage_noop  the pull request changes only paths `lage.config.js` ignores, so
 *              `lage build --since` would map them to no package and build
 *              nothing anyway
 *
 * `lage_noop` implies `docs_only`. When `GITHUB_OUTPUT` is set the flags are
 * appended to it as step outputs; the decision is always echoed to stdout so it
 * is visible in the workflow log.
 *
 * The single source of truth for the classification is this file. The workflows
 * that consume it are `.github/workflows/ci-validate-pr.yml`,
 * `ci-validate-platforms.yml` and `ci-validate-rust.yml`; see
 * `.github/workflows/README.md` for how each one gates on the result.
 */

import { appendFileSync } from "node:fs";

/**
 * Generated markdown is not documentation. Nothing but `lage build` followed by
 * `test:validation` can prove a generated file is current, so a pull request
 * that touches one must run the full pipeline even though it looks like prose.
 *
 * - `*.api.md`                      api-extractor (`npm run doc`)
 * - `SIZES.md`                      packages/fast-element/scripts/measure-sizes.js
 * - `export-sizes.md`               sites/website/scripts/generate-docs.cjs
 * - `path-exports.md`               packages/fast-element/scripts/check-path-exports-docs.js
 * - `CHANGELOG.md`                  beachball
 * - `sites/website/src/docs/N.x/api/**`  sites/website/scripts/generate-docs.cjs
 */
const GENERATED = [
    /\.api\.md$/,
    /(^|\/)SIZES\.md$/,
    /(^|\/)export-sizes\.md$/,
    /(^|\/)path-exports\.md$/,
    /(^|\/)CHANGELOG\.md$/,
    /^sites\/website\/src\/docs\/[0-9]+\.x\/api\//,
];

/**
 * Prose allowlist. Anything that is not on it is treated as code.
 *
 * Markdown covers the file patterns the request asked for without naming
 * directories: `.github/ISSUE_TEMPLATE/**`, `.github/skills/**` and `specs/**`
 * hold markdown and nothing else. `LICENSE` has no extension and needs its own
 * entry. Beachball change files are pure release metadata.
 */
const PROSE = [/\.mdx?$/, /^LICENSE$/, /^change\/[^/]+\.json$/];

/**
 * Mirrors `lage.config.js` `ignore: ["change/**", "*.md", ".github/**", "LICENSE"]`.
 * workspace-tools evaluates those globs with micromatch, so `*.md` matches
 * root-level markdown only: markdown under `packages/<name>/docs` and under
 * `sites/website` still maps to a package, and `lage build --since` still builds
 * the wasm bundle, the 11ty site and the generated api docs for them.
 */
const LAGE_IGNORED = [/^[^/]+\.md$/, /^LICENSE$/, /^change\//, /^\.github\//];

function matches(patterns, file) {
    return patterns.some(pattern => pattern.test(file));
}

/**
 * @param {string[]} files paths relative to the repository root
 * @returns {{ docsOnly: boolean, lageNoop: boolean, reason: string }}
 */
export function classifyChangedFiles(files) {
    const changed = files.map(file => file.trim()).filter(Boolean);

    // Fail open: a pull request we cannot see the contents of runs everything.
    if (changed.length === 0) {
        return { docsOnly: false, lageNoop: false, reason: "empty-diff" };
    }

    if (changed.some(file => matches(GENERATED, file))) {
        return {
            docsOnly: false,
            lageNoop: false,
            reason: "touches-generated-markdown",
        };
    }

    if (changed.some(file => !matches(PROSE, file))) {
        return { docsOnly: false, lageNoop: false, reason: "non-doc-files-present" };
    }

    if (changed.some(file => !matches(LAGE_IGNORED, file))) {
        return { docsOnly: true, lageNoop: false, reason: "docs-only-lage-builds" };
    }

    return { docsOnly: true, lageNoop: true, reason: "docs-only-lage-noop" };
}

async function readStdin() {
    const chunks = [];

    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }

    return Buffer.concat(chunks).toString("utf8");
}

async function main() {
    const files = (await readStdin()).split("\n");
    const { docsOnly, lageNoop, reason } = classifyChangedFiles(files);
    const output = `docs_only=${docsOnly}\nlage_noop=${lageNoop}\n`;

    if (process.env.GITHUB_OUTPUT) {
        appendFileSync(process.env.GITHUB_OUTPUT, output);
    }

    process.stdout.write(`${output}reason=${reason}\n`);
}

// Only run the CLI when invoked directly, so the tests can import the classifier.
if (process.argv[1]?.endsWith("classify-changed-files.mjs")) {
    await main();
}
