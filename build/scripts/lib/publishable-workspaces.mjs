/**
 * Shared helpers for enumerating FAST's publishable npm workspaces and their
 * paired Rust crates.
 *
 * Used by the Azure release pipeline scripts (`pack-pending-releases.mjs`
 * and `read-release-manifest.mjs`) so that "what is publishable" and "how
 * does an npm name map to a crate name / Azure variable prefix" are defined
 * in exactly one place.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Absolute path to the repository root, resolved from this file's own
 * location (`build/scripts/lib/`) rather than `process.cwd()`. Every
 * filesystem lookup in this module is anchored here so `listPublishableWorkspaces()`
 * behaves identically no matter which directory the calling script (or a
 * test) happens to be invoked from.
 */
export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

/**
 * Thrown when a publishable npm workspace's `package.json` version disagrees
 * with a paired Rust crate's `Cargo.toml` version. Callers should catch this
 * specifically and print `error.message` (no stack trace) rather than
 * letting it surface as an uncaught exception, since it represents an
 * actionable authoring mistake rather than a programming bug.
 */
export class VersionDriftError extends Error {
    constructor(message) {
        super(message);
        this.name = "VersionDriftError";
    }
}

/** Convert an npm package name into its paired Rust crate name, e.g.
 * `@microsoft/fast-build` -> `microsoft-fast-build`. */
export function npmNameToCrateName(npmName) {
    return npmName.replace(/^@/, "").replace(/\//g, "-");
}

// `@microsoft/fast-build` bundles both `microsoft-fast-build` and
// `microsoft-fast-convert` into a single release.
const bundledCratesByPackage = new Map([
    ["@microsoft/fast-build", ["microsoft-fast-build", "microsoft-fast-convert"]],
]);

export function npmNameToCrateNames(npmName) {
    return bundledCratesByPackage.get(npmName) ?? [npmNameToCrateName(npmName)];
}

/** Convert an npm package name into a camelCase Azure Pipelines variable
 * prefix, e.g. `@microsoft/fast-build` -> `fastBuild`. */
export function npmNameToOutputPrefix(npmName) {
    return npmNameToCrateName(npmName)
        .replace(/^microsoft-/, "")
        .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

export function shouldSkipCrates() {
    return process.env.FAST_RELEASE_SKIP_CRATES === "true";
}

export function readCargoTomlVersion(cargoTomlPath) {
    const content = readFileSync(cargoTomlPath, "utf8");
    let inPackage = false;
    for (const rawLine of content.split("\n")) {
        const line = rawLine.trim();
        if (line.startsWith("[")) {
            inPackage = line === "[package]";
            continue;
        }
        if (!inPackage) continue;
        const m = /^version\s*=\s*"([^"]+)"/.exec(line);
        if (m) return m[1];
    }
    return null;
}

/**
 * Resolve the paired Rust crates for `pkgName`, verifying each crate's
 * `Cargo.toml` version matches `pkgVersion`. Every mismatch found is
 * collected into `mismatches` instead of throwing immediately, so a caller
 * enumerating many workspaces can report every version-drift problem in one
 * pass rather than stopping at the first one.
 */
export function listPairedCrates(pkgName, pkgVersion, mismatches = []) {
    if (shouldSkipCrates()) return [];

    const crates = [];
    for (const crateName of npmNameToCrateNames(pkgName)) {
        const cargoTomlPath = join(repoRoot, "crates", crateName, "Cargo.toml");
        if (!existsSync(cargoTomlPath)) continue;

        const crateVersion = readCargoTomlVersion(cargoTomlPath);
        if (crateVersion !== pkgVersion) {
            mismatches.push(
                `${pkgName}: package.json is ${pkgVersion} but ${cargoTomlPath} is ${crateVersion}.`,
            );
            continue;
        }

        crates.push({ crateName, cargoTomlPath });
    }

    return crates;
}

/**
 * Walk the root `package.json` `workspaces` globs and return every
 * non-private workspace with a `name` and `version`, including its paired
 * Rust crates (if any). Requires no `npm ci` / `node_modules`. Resolved
 * entirely against `repoRoot`, so this works no matter what `process.cwd()`
 * happens to be. Results are sorted deterministically by package name so
 * output ordering (manifest contents, Azure output variable emission order,
 * log output) is stable across OSes/filesystems, which vary in the order
 * `readdirSync` returns directory entries.
 *
 * Throws a single aggregated `VersionDriftError` if any workspace's paired
 * crate version disagrees with its npm package version — every mismatch
 * found across all workspaces is collected and reported together, rather
 * than throwing (and hiding subsequent mismatches) at the first one found.
 */
export function listPublishableWorkspaces() {
    const rootPkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
    const patterns = rootPkg.workspaces || [];
    const locations = new Set();

    for (const pattern of patterns) {
        if (pattern.endsWith("/*")) {
            const parent = join(repoRoot, pattern.slice(0, -2));
            if (!existsSync(parent)) continue;
            for (const entry of readdirSync(parent, { withFileTypes: true })) {
                if (entry.isDirectory()) {
                    locations.add(join(parent, entry.name));
                }
            }
        } else {
            locations.add(join(repoRoot, pattern));
        }
    }

    const mismatches = [];
    const workspaces = [];
    for (const location of locations) {
        const pkgPath = join(location, "package.json");
        if (!existsSync(pkgPath)) continue;
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
        if (pkg.private === true) continue;
        if (!pkg.name || !pkg.version) continue;

        const crates = listPairedCrates(pkg.name, pkg.version, mismatches);

        workspaces.push({
            location,
            name: pkg.name,
            version: pkg.version,
            tag: `${pkg.name}_v${pkg.version}`,
            prefix: npmNameToOutputPrefix(pkg.name),
            crates,
        });
    }

    if (mismatches.length > 0) {
        throw new VersionDriftError(
            "Paired npm/crate version drift detected. Update one side to match " +
                `the other for each of the following:\n${mismatches.map(m => `  - ${m}`).join("\n")}`,
        );
    }

    workspaces.sort((a, b) => a.name.localeCompare(b.name));

    return workspaces;
}

function run(file, args, opts = {}) {
    return execFileSync(file, args, { encoding: "utf8", cwd: repoRoot, ...opts });
}

/**
 * Check whether `refs/tags/<tag>` (or its dereferenced annotated-tag
 * counterpart) exists on `origin`, without requiring a full/unshallow local
 * clone, so shallow 1ES agent checkouts work correctly.
 */
export function gitTagExistsOnRemote(tag) {
    try {
        const out = run("git", [
            "ls-remote",
            "--exit-code",
            "origin",
            `refs/tags/${tag}`,
            `refs/tags/${tag}^{}`,
        ]);
        return out.trim().length > 0;
    } catch (error) {
        // `git ls-remote --exit-code` exits with 2 when no refs match.
        if (error?.status === 2) return false;
        throw error;
    }
}
