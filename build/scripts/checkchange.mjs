#!/usr/bin/env node
/**
 * Wrapper around `beachball check` that auto-tolerates version-only
 * `package.json` edits.
 *
 * Background
 * ----------
 * Beachball requires a [change file](https://microsoft.github.io/beachball/concepts/change-files.html)
 * for ANY edit to a publishable workspace's `package.json` — including
 * a single-line `version` bump. FAST does enough hand-bumping
 * (hotfix overrides, paired Rust/npm sync recovery, automation-driven
 * version pins) that requiring a no-op change file by hand each time
 * is friction. This wrapper inspects the branch + staged diff and, for
 * each `packages/<pkg>/package.json` whose ONLY diff is the `version`
 * field, adds `--scope "!packages/<pkg>"` to the `beachball check`
 * invocation. Beachball then treats those packages as out of scope and
 * does not demand a change file for them.
 *
 * The intent is intentionally narrow: any package edit that goes
 * beyond a pure version-line bump (other source files in the package,
 * extra `package.json` fields touched, CHANGELOG.md modified, etc.)
 * keeps the existing requirement.
 *
 * Auto-exclusion conditions (ALL must hold)
 * -----------------------------------------
 * 1. The package directory has exactly one changed file in the
 *    branch+staged diff: `package.json`.
 * 2. The `package.json` diff is exactly one removed line and one added
 *    line, both matching the `"version": "..."` field, with the old
 *    and new versions differing.
 * 3. The package's current `package.json` is NOT `"private": true`
 *    (private workspaces are never published, so beachball already
 *    ignores them — defensive double-check).
 * 4. No change file for this package already exists in `change/`
 *    (respect explicit intent: if the maintainer wrote a change file,
 *    let beachball evaluate it normally).
 *
 * If any condition fails, the package is left in scope and beachball
 * fails as before with its standard hint message.
 *
 * Why scope exclusion instead of auto-generating change files?
 * -----------------------------------------------------------
 * Beachball's "package already has a change file" lookup is a
 * `git diff --diff-filter=A` against the target branch, so a generated
 * `change/*.json` only counts if it is *committed*. A check wrapper
 * mutating git state on every invocation is unacceptable. Scope
 * exclusion is purely in-process, leaves no artifacts, and is
 * auditable through the verbose log this script prints before exec'ing
 * beachball.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const changeDir = join(repoRoot, "change");

const targetBranch = process.env.BEACHBALL_BRANCH || "origin/main";

/**
 * Run a git command capturing stdout. Returns "" on non-zero exit
 * (mirroring beachball's tolerant style for diff-against-merge-base).
 */
function git(args) {
    const result = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8" });
    if (result.status !== 0) {
        return "";
    }
    return result.stdout;
}

/**
 * Get the merge-base of `targetBranch` and HEAD so a single diff
 * covers committed + staged changes against the branch fork point.
 * Falls back to `targetBranch` itself when no merge-base is available
 * (e.g. shallow clone with no shared history yet).
 */
function getMergeBase() {
    const mergeBase = git(["merge-base", targetBranch, "HEAD"]).trim();
    return mergeBase || targetBranch;
}

/**
 * Return the set of changed files (committed-in-branch + staged) as
 * paths relative to the repo root, with forward slashes.
 */
function getChangedFiles(base) {
    const committed = git(["diff", "--name-only", `${base}..HEAD`])
        .split("\n")
        .map(f => f.trim())
        .filter(Boolean);
    const staged = git(["diff", "--name-only", "--cached"])
        .split("\n")
        .map(f => f.trim())
        .filter(Boolean);
    return new Set([...committed, ...staged].map(f => f.split("\\").join("/")));
}

/**
 * Return the unified diff of a single file from `base` to the index
 * (which collapses committed + staged changes into one view).
 * Diff is configured with zero context so the auto-exclude check sees
 * only the actual changed lines.
 */
function getFileDiff(base, file) {
    const result = spawnSync(
        "git",
        ["diff", "--cached", "--unified=0", "--no-color", base, "--", file],
        { cwd: repoRoot, encoding: "utf8" },
    );
    if (result.status !== 0) {
        return "";
    }
    return result.stdout;
}

const versionLineRe = /^[+-]\s*"version"\s*:\s*"([^"]+)"\s*,?\s*$/;

/**
 * Return true iff the file diff body consists of exactly one removed
 * `"version": "X"` line and one added `"version": "Y"` line, with
 * X !== Y. Diff headers, hunk headers, and "no newline" markers are
 * ignored.
 */
function isVersionOnlyDiff(diff) {
    let removed = null;
    let added = null;
    for (const line of diff.split("\n")) {
        if (
            line === "" ||
            line.startsWith("diff ") ||
            line.startsWith("index ") ||
            line.startsWith("--- ") ||
            line.startsWith("+++ ") ||
            line.startsWith("@@") ||
            line.startsWith("\\ ")
        ) {
            continue;
        }
        if (line.startsWith("-")) {
            if (removed !== null) return false;
            const match = versionLineRe.exec(line);
            if (!match) return false;
            removed = match[1];
            continue;
        }
        if (line.startsWith("+")) {
            if (added !== null) return false;
            const match = versionLineRe.exec(line);
            if (!match) return false;
            added = match[1];
            continue;
        }
        return false;
    }
    return removed !== null && added !== null && removed !== added;
}

/**
 * Read the names listed in existing change files in `change/` so we
 * never override an explicit maintainer-written change file.
 */
function getPackagesWithChangeFiles() {
    const names = new Set();
    if (!existsSync(changeDir)) return names;
    for (const file of readdirSync(changeDir)) {
        if (!file.endsWith(".json")) continue;
        try {
            const parsed = JSON.parse(readFileSync(join(changeDir, file), "utf8"));
            const entries = Array.isArray(parsed.changes) ? parsed.changes : [parsed];
            for (const entry of entries) {
                if (entry && typeof entry.packageName === "string") {
                    names.add(entry.packageName);
                }
            }
        } catch {
            // ignore unparseable change files; beachball's own validator will surface them
        }
    }
    return names;
}

/**
 * Read the package name and `private` flag from a workspace's
 * package.json, returning `null` if the file is missing or unparseable
 * (in which case we conservatively decline to auto-exclude).
 */
function readPackageMeta(packageJsonPath) {
    if (!existsSync(packageJsonPath)) return null;
    try {
        const parsed = JSON.parse(readFileSync(packageJsonPath, "utf8"));
        if (typeof parsed.name !== "string") return null;
        return { name: parsed.name, private: parsed.private === true };
    } catch {
        return null;
    }
}

function findAutoExcludablePackages() {
    const base = getMergeBase();
    const changedFiles = getChangedFiles(base);
    if (changedFiles.size === 0) return [];

    const packagesWithChangeFiles = getPackagesWithChangeFiles();

    const candidates = new Map();
    for (const file of changedFiles) {
        const match = /^packages\/([^/]+)\/(.+)$/.exec(file);
        if (!match) continue;
        const [, pkgDir, rest] = match;
        if (!candidates.has(pkgDir)) {
            candidates.set(pkgDir, new Set());
        }
        candidates.get(pkgDir).add(rest);
    }

    const excludable = [];
    for (const [pkgDir, files] of candidates) {
        if (files.size !== 1 || !files.has("package.json")) continue;

        const packageJsonPath = join(repoRoot, "packages", pkgDir, "package.json");
        const meta = readPackageMeta(packageJsonPath);
        if (!meta || meta.private) continue;
        if (packagesWithChangeFiles.has(meta.name)) continue;

        const diff = getFileDiff(base, `packages/${pkgDir}/package.json`);
        if (!isVersionOnlyDiff(diff)) continue;

        excludable.push({ pkgDir, name: meta.name });
    }
    return excludable;
}

function main() {
    const passThroughArgs = process.argv.slice(2);
    const extraScopes = [];

    const excludable = findAutoExcludablePackages();
    if (excludable.length > 0) {
        console.log(
            "[checkchange] Auto-excluding the following packages " +
                "because their only branch diff is a version-line bump in " +
                "package.json (no source changes, no existing change file):",
        );
        for (const { pkgDir, name } of excludable) {
            console.log(`[checkchange]   - ${name} (packages/${pkgDir})`);
            extraScopes.push("--scope", `!packages/${pkgDir}`);
        }
        console.log(
            "[checkchange] If a change file IS desired for one of the " +
                "above (e.g. to emit a changelog entry), run `npm run change` " +
                "and beachball will re-include the package automatically.",
        );
    }

    const beachballArgs = [
        "beachball",
        "check",
        "--scope",
        "!sites/*",
        ...extraScopes,
        "--changehint",
        "Run 'npm run change' to generate a change file",
        ...passThroughArgs,
    ];

    const result = spawnSync("npx", beachballArgs, {
        cwd: repoRoot,
        stdio: "inherit",
    });
    process.exit(result.status ?? 1);
}

main();
