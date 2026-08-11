#!/usr/bin/env node
/**
 * Enumerate FAST's publishable npm workspaces and, for every workspace whose
 * `${name}_v${version}` tag does not yet exist on `origin`, pack its npm
 * tarball (and any paired Rust crates) so the Azure `FAST - CD Build` pipeline
 * can hand the packed assets to the `FAST - CD` pipeline for signing and
 * publishing.
 *
 * This script does NOT create GitHub releases, git tags, or npm/crates.io
 * publishes itself — those are owned by Azure Pipelines
 * (`.ado/pipelines/azure-pipelines-build.yml` and
 * `.ado/pipelines/azure-pipelines-cd.yml`) so that release credentials never
 * leave the Azure environment. It does NOT bump versions or commit source
 * changes either — version bumps land on `main` through ordinary
 * human-authored pull requests (see CONTRIBUTING.md > Publishing).
 *
 * FAST is multi-package, so there is no single "the release version": each
 * publishable workspace gets its own `${name}_v${version}` tag, so "pending"
 * is evaluated per package, and a build can pack zero or more packages at
 * once.
 *
 *   1. Walks the root `package.json` `workspaces` globs to find every
 *      workspace's `package.json` (no `node_modules` required, so
 *      `--check-only` can run before `npm ci`).
 *   2. Skips workspaces whose package.json sets `private: true`.
 *   3. For each remaining workspace, looks for paired Rust crates at
 *      `crates/<crate-name>/Cargo.toml` (see
 *      `build/scripts/lib/publishable-workspaces.mjs` for the npm-name ->
 *      crate-name mapping, including the `@microsoft/fast-build` bundle).
 *      Errors if a paired crate's version does not match the npm package's
 *      version.
 *   4. A workspace is "pending" when its `${name}_v${version}` tag does not
 *      yet exist on `origin` — or, when `ALLOW_EXISTING_RELEASE=true`
 *      (driven by the pipelines' `validationMode` parameter), every
 *      publishable workspace is treated as pending so its artifact contract
 *      can be rebuilt and validated without publishing.
 *
 * Modes:
 *
 *   - `--check-only`: only enumerate pending workspaces and emit Azure
 *     Pipelines outputs (`##vso[task.setvariable ...]`) when running under
 *     Azure Pipelines (`$TF_BUILD` set). Performs no packing. Safe to run
 *     without `node_modules` populated. Also used for the local
 *     `CONTRIBUTING.md` "preview what CD will publish" step.
 *   - default: packs the npm tarball for every pending workspace into
 *     `publish_artifacts_npm/`, packs any paired Rust crates into
 *     `publish_artifacts_crates/`, and writes
 *     `publish_artifacts_meta/release-manifest.json` describing exactly
 *     what was packed (name, version, tag, npm tarball filename, crate
 *     filenames) for the downstream `read-release-manifest.mjs` step.
 *
 * Set `FAST_RELEASE_SKIP_CRATES=true` to skip paired Rust crate validation
 * and packaging.
 */

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import {
    gitTagExistsOnRemote,
    listPublishableWorkspaces,
    VersionDriftError,
} from "./lib/publishable-workspaces.mjs";

const NPM_DIR = "publish_artifacts_npm";
const CRATES_DIR = "publish_artifacts_crates";
const META_DIR = "publish_artifacts_meta";
const MANIFEST_PATH = join(META_DIR, "release-manifest.json");
const CHECK_ONLY = process.argv.includes("--check-only");
const ALLOW_EXISTING_RELEASE = process.env.ALLOW_EXISTING_RELEASE === "true";

function run(file, args, opts = {}) {
    return execFileSync(file, args, { encoding: "utf8", ...opts });
}

function setAzureOutput(name, value) {
    if (!process.env.TF_BUILD) return;
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${value}`);
}

function isPending(workspace) {
    if (ALLOW_EXISTING_RELEASE) return true;
    return !gitTagExistsOnRemote(workspace.tag);
}

function logError(message) {
    if (process.env.TF_BUILD) {
        console.error(`##vso[task.logissue type=error]${message}`);
    } else {
        console.error(message);
    }
}

let publishable;
try {
    publishable = listPublishableWorkspaces();
} catch (error) {
    if (error instanceof VersionDriftError) {
        logError(error.message);
        process.exit(1);
    }
    throw error;
}
if (process.env.FAST_RELEASE_SKIP_CRATES === "true") {
    console.log("Paired Rust crate assets are skipped for this release run.");
}
if (ALLOW_EXISTING_RELEASE) {
    console.log(
        "Validation mode: every publishable workspace is treated as pending, " +
            "regardless of whether its release tag already exists.",
    );
}

if (publishable.length === 0) {
    console.log("No publishable workspaces found.");
    setAzureOutput("shouldBuild", "false");
    process.exit(0);
}

const pending = publishable.filter(isPending);

console.log(`Publishable workspaces: ${publishable.length}`);
console.log(`Pending release:        ${pending.length}`);

if (pending.length > 0) {
    console.log("\nPackages pending release:");
    for (const { name, version, tag, crates } of pending) {
        const suffix =
            crates.length > 0
                ? ` (+ crates ${crates.map(crate => crate.crateName).join(", ")})`
                : "";
        console.log(`  - ${name}@${version} [${tag}]${suffix}`);
    }
}

if (process.env.TF_BUILD) {
    console.log(
        `##vso[build.updatebuildnumber]release-prep-${process.env.BUILD_BUILDID || "local"}`,
    );
}
setAzureOutput("shouldBuild", pending.length > 0 ? "true" : "false");

if (CHECK_ONLY) {
    process.exit(0);
}

if (pending.length === 0) {
    // This mode only runs once the earlier `--check-only` step already
    // observed at least one pending workspace and gated the `BuildArtifacts`
    // stage on it (`shouldBuild == 'true'`) — so reaching this point with
    // zero pending workspaces means every previously-pending workspace's
    // release tag appeared on `origin` in the window between that check
    // and this pack step. That is almost always a concurrent release run
    // (another `FAST - CD Build`/`FAST - CD` execution) winning the race, not a
    // normal "nothing to do" outcome, so fail loudly here instead of
    // silently exiting without writing `release-manifest.json` (which would
    // otherwise surface later as a confusing "file not found" error when the
    // pipeline tries to copy that manifest out of this job).
    logError(
        "No packages are pending release, but pack-pending-releases.mjs was invoked " +
            "in packing mode after an earlier check found pending packages. This " +
            "indicates a concurrent release run already tagged every previously-pending " +
            "workspace between the check-only step and this pack step. Re-run 'FAST - CD " +
            "Build' if packages are still expected to be pending.",
    );
    process.exit(1);
}

mkdirSync(NPM_DIR, { recursive: true });
mkdirSync(CRATES_DIR, { recursive: true });
mkdirSync(META_DIR, { recursive: true });

const manifestPackages = [];
let hasErrors = false;

for (const { name, version, tag, prefix, location, crates } of pending) {
    try {
        console.log(`\nPacking ${name}@${version} from ${location}...`);
        const packJson = run("npm", [
            "pack",
            "--silent",
            "--json",
            `--workspace=${location}`,
            `--pack-destination=${resolve(NPM_DIR)}`,
        ]);
        const npmTarball = JSON.parse(packJson)[0].filename;

        const crateFiles = [];
        for (const { crateName, cargoTomlPath } of crates) {
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
                dirname(cargoTomlPath),
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
            crateFiles.push(basename(srcCrate));
        }

        manifestPackages.push({ name, version, tag, prefix, npmTarball, crateFiles });
        console.log(`Packed ${name}@${version} (${1 + crateFiles.length} asset(s))`);
    } catch (error) {
        hasErrors = true;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Failed to pack ${name}@${version}: ${message}`);
    }
}

if (manifestPackages.every(pkg => pkg.crateFiles.length === 0)) {
    // Guarantee `publish_artifacts_crates` always has at least one file so
    // `PublishPipelineArtifact@1` (and any downstream `DownloadPipelineArtifact@2`)
    // never has to handle a truly-empty directory. The `PublishRelease`
    // stage's `Publish` job strips this placeholder back out before
    // invoking the release template, so an all-npm batch still ends up
    // treated as "no crate assets to publish".
    writeFileSync(join(CRATES_DIR, ".no-crates-packed"), "");
}

const releaseCommit = (
    process.env.BUILD_SOURCEVERSION || run("git", ["rev-parse", "HEAD"])
).trim();

writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify({ releaseCommit, packages: manifestPackages }, null, 4)}\n`,
);

console.log(`\nPacked: ${manifestPackages.length}/${pending.length}`);
console.log(`Manifest written to ${MANIFEST_PATH}`);

if (hasErrors) {
    process.exitCode = 1;
}
