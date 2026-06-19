#!/usr/bin/env node
/**
 * Create one GitHub release per non-private workspace whose
 * `${name}_v${version}` tag does not yet exist in git.
 *
 * Invoked by `.github/workflows/cd-github-releases.yml`. The workflow does
 * NOT bump versions or commit source changes — version bumps land on `main`
 * through ordinary human-authored pull requests. This script:
 *
 *   1. Walks the root `package.json` `workspaces` globs to find every
 *      workspace's `package.json` (no `node_modules` required, so the
 *      `--check-only` mode can run before `npm ci`).
 *   2. Skips workspaces whose package.json sets `private: true`.
 *   3. For each remaining workspace, looks for a paired Rust crate at
 *      `crates/<crate-name>/Cargo.toml`, where the crate name is derived
 *      from the npm name by dropping the leading `@` and replacing `/`
 *      with `-` (so `@microsoft/fast-build` -> `microsoft-fast-build`).
 *      When a pair exists, the script errors if the two versions are not
 *      identical, forcing the version-bump PR to keep them in sync.
 *   4. Computes `tag = ${name}_v${version}` (matching beachball's tag
 *      format) and skips the workspace if the git tag already exists
 *      (idempotent across re-runs).
 *   5. Otherwise (when not `--check-only`) packs the npm tarball into
 *      `publish_artifacts_npm/` with `npm pack`, optionally packs the
 *      paired crate into `publish_artifacts_crates/` with
 *      `cargo package`, and creates the GitHub release with both
 *      assets attached (`gh release create --target <sha>`). The `gh`
 *      CLI creates the git tag atomically with the release, so the
 *      tag and the release exist if and only if each other does.
 *
 * Modes:
 *
 *   - default: pack + tag + create any missing releases.
 *   - `--check-only`: only enumerate missing releases. Sets the
 *     `hasMissingReleases` GitHub Actions output (via `$GITHUB_OUTPUT`)
 *     to `"true"` or `"false"`. Performs no packing, no tagging, no
 *     release creation. Safe to run without `node_modules` populated.
 *
 * Set `FAST_RELEASE_SKIP_CRATES=true` to skip paired Rust crate validation and
 * packaging. This is also enabled automatically on `releases/fast-element-v3-rc`,
 * whose RC publishes npm packages only.
 *
 * Authentication: the `gh` CLI reads `GH_TOKEN` from the environment.
 */

import { execFileSync } from "node:child_process";
import {
    appendFileSync,
    copyFileSync,
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";

const NPM_DIR = "publish_artifacts_npm";
const CRATES_DIR = "publish_artifacts_crates";
const CHECK_ONLY = process.argv.includes("--check-only");
const FAST_ELEMENT_V3_RC_BRANCH = "releases/fast-element-v3-rc";

function run(file, args, opts = {}) {
    return execFileSync(file, args, { encoding: "utf8", ...opts });
}

function gitTagExists(tag) {
    try {
        execFileSync("git", ["rev-parse", "--verify", `refs/tags/${tag}`], {
            stdio: "ignore",
        });
        return true;
    } catch {
        return false;
    }
}

function npmNameToCrateName(npmName) {
    return npmName.replace(/^@/, "").replace(/\//g, "-");
}

function currentBranchName() {
    if (process.env.GITHUB_REF_NAME) {
        return process.env.GITHUB_REF_NAME;
    }

    try {
        return run("git", ["rev-parse", "--abbrev-ref", "HEAD"]).trim();
    } catch {
        return "";
    }
}

function shouldSkipCrates() {
    return (
        process.env.FAST_RELEASE_SKIP_CRATES === "true" ||
        currentBranchName() === FAST_ELEMENT_V3_RC_BRANCH
    );
}

function readCargoTomlVersion(cargoTomlPath) {
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

function listPublishableWorkspaces() {
    const rootPkg = JSON.parse(readFileSync("package.json", "utf8"));
    const patterns = rootPkg.workspaces || [];
    const locations = new Set();

    for (const pattern of patterns) {
        if (pattern.endsWith("/*")) {
            const parent = pattern.slice(0, -2);
            if (!existsSync(parent)) continue;
            for (const entry of readdirSync(parent, { withFileTypes: true })) {
                if (entry.isDirectory()) {
                    locations.add(join(parent, entry.name));
                }
            }
        } else {
            locations.add(pattern);
        }
    }

    const workspaces = [];
    for (const location of locations) {
        const pkgPath = join(location, "package.json");
        if (!existsSync(pkgPath)) continue;
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
        if (pkg.private === true) continue;
        if (!pkg.name || !pkg.version) continue;

        const crateName = npmNameToCrateName(pkg.name);
        const cargoTomlPath = join("crates", crateName, "Cargo.toml");
        const hasCrate = existsSync(cargoTomlPath) && !shouldSkipCrates();

        if (hasCrate) {
            const crateVersion = readCargoTomlVersion(cargoTomlPath);
            if (crateVersion !== pkg.version) {
                throw new Error(
                    `Version mismatch for ${pkg.name}: package.json is ${pkg.version} but ${cargoTomlPath} is ${crateVersion}. Update one to match the other.`,
                );
            }
        }

        workspaces.push({
            location,
            name: pkg.name,
            version: pkg.version,
            crateName: hasCrate ? crateName : null,
            cargoTomlPath: hasCrate ? cargoTomlPath : null,
        });
    }

    return workspaces;
}

function setGitHubOutput(name, value) {
    if (!process.env.GITHUB_OUTPUT) return;
    appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

const publishable = listPublishableWorkspaces();
if (shouldSkipCrates()) {
    console.log("Paired Rust crate assets are skipped for this release run.");
}

if (publishable.length === 0) {
    console.log("No publishable workspaces found.");
    setGitHubOutput("hasMissingReleases", "false");
    process.exit(0);
}

const missing = publishable.filter(
    ({ name, version }) => !gitTagExists(`${name}_v${version}`),
);

console.log(`Publishable workspaces:    ${publishable.length}`);
console.log(`With existing git tag:     ${publishable.length - missing.length}`);
console.log(`Missing git tag / release: ${missing.length}`);

if (missing.length > 0) {
    console.log("\nPackages that need a release:");
    for (const { name, version, crateName } of missing) {
        const suffix = crateName ? ` (+ crate ${crateName})` : "";
        console.log(`  - ${name}@${version}${suffix}`);
    }
}

setGitHubOutput("hasMissingReleases", missing.length > 0 ? "true" : "false");

if (CHECK_ONLY || missing.length === 0) {
    process.exit(0);
}

// `--check-only` only enumerates missing releases via local git state,
// but creating releases requires `gh release create`, which needs a
// token. Fail fast here so the workflow surfaces a clear error rather
// than a generic `gh` auth failure mid-loop.
if (!process.env.GH_TOKEN) {
    console.error("GH_TOKEN must be set so the `gh` CLI can create GitHub releases.");
    process.exit(1);
}

mkdirSync(NPM_DIR, { recursive: true });
mkdirSync(CRATES_DIR, { recursive: true });

let created = 0;
let hasErrors = false;

for (const { name, version, location, crateName, cargoTomlPath } of missing) {
    const tag = `${name}_v${version}`;
    const assets = [];

    try {
        console.log(`\nPacking ${name}@${version} from ${location}...`);
        const packJson = run("npm", [
            "pack",
            "--silent",
            "--json",
            `--workspace=${location}`,
            `--pack-destination=${resolve(NPM_DIR)}`,
        ]);
        assets.push(join(NPM_DIR, JSON.parse(packJson)[0].filename));

        if (cargoTomlPath) {
            console.log(`Packaging crate ${crateName}@${version}...`);
            run(
                "cargo",
                [
                    "package",
                    "--no-verify",
                    "--allow-dirty",
                    "--manifest-path",
                    cargoTomlPath,
                ],
                { stdio: "inherit" },
            );
            const srcCrate = join(
                "crates",
                crateName,
                "target",
                "package",
                `${crateName}-${version}.crate`,
            );
            if (!existsSync(srcCrate)) {
                throw new Error(
                    `Expected ${srcCrate} after cargo package, but it does not exist.`,
                );
            }
            const destCrate = join(CRATES_DIR, basename(srcCrate));
            copyFileSync(srcCrate, destCrate);
            assets.push(destCrate);
        }

        const notes = [
            `Nightly release for \`${name}@${version}\`.`,
            "",
            "Version bumps were landed via a regular pull request. The attached",
            "assets will be downloaded and published to npm" +
                (cargoTomlPath ? " and crates.io" : "") +
                " by the nightly Azure release pipeline.",
        ].join("\n");

        // Let `gh release create` create the tag atomically with the
        // release so that "tag exists" and "release exists" are always
        // the same fact. If we created the tag separately and pushed
        // it, and then `gh release create` failed, the next workflow
        // run would think the release was already done (because the
        // tag exists) and skip it forever.
        const targetSha = (
            process.env.GITHUB_SHA || run("git", ["rev-parse", "HEAD"])
        ).trim();

        console.log(`Creating release ${tag} at ${targetSha.slice(0, 7)}...`);
        run(
            "gh",
            [
                "release",
                "create",
                tag,
                ...assets,
                "--target",
                targetSha,
                "--title",
                `${name}@${version}`,
                "--notes",
                notes,
            ],
            { stdio: "inherit" },
        );

        console.log(`Created release ${tag} with ${assets.length} asset(s)`);
        created += 1;
    } catch (error) {
        hasErrors = true;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Failed to release ${name}@${version}: ${message}`);
    }
}

console.log(`\nReleases created: ${created}/${missing.length}`);

if (hasErrors) {
    process.exitCode = 1;
}
