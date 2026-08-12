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
 *      `build/scripts/release-workspaces.mjs` for the npm-name ->
 *      crate-name mapping, including the `@microsoft/fast-build` bundle).
 *      Errors if a paired crate's version does not match the npm package's
 *      version.
 *   4. In `--check-only`, a workspace is selected when its
 *      `${name}_v${version}` tag does not yet exist on `origin` — or, when
 *      `VALIDATION_MODE=true` (driven by the pipelines'
 *      `validationMode` parameter), every publishable workspace is selected.
 *      The exact selected tag list is handed to the later packing stage.
 *
 * Modes:
 *
 *   - `--check-only`: enumerate selected workspaces and emit Azure Pipelines
 *     outputs (`shouldBuild` and the comma-separated `selectedReleaseTags`)
 *     when running under Azure Pipelines (`$TF_BUILD` set). Performs no
 *     packing. Safe to run without `node_modules` populated. Also used for
 *     the local `CONTRIBUTING.md` "preview what CD will publish" step.
 *   - default: requires `SELECTED_RELEASE_TAGS` and packs exactly those
 *     workspaces into
 *     `publish_artifacts_npm/`, packs any paired Rust crates into
 *     `publish_artifacts_crates/`, and writes
 *     `publish_artifacts_meta/release-manifest.json` describing exactly
 *     what was packed (schema version, source commit and branch, validation
 *     mode, name, version, tag, output prefix, and SHA-256 for every npm/crate
 *     asset) for the downstream
 *     `validate-release-artifacts.mjs` step.
 *
 * Set `FAST_RELEASE_SKIP_CRATES=true` to skip paired Rust crate validation
 * and packaging.
 */

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { updateAzureBuildNumber } from "./azure-build-number.mjs";
import { createReleaseAsset, createReleaseManifest } from "./release-manifest.mjs";
import {
    gitTagExistsOnRemote,
    listPublishableWorkspaces,
    repoRoot,
    VersionDriftError,
} from "./release-workspaces.mjs";
import {
    assertSelectedTagsAreUnreleased,
    formatSelectedReleaseTags,
    resolveSelectedReleaseWorkspaces,
} from "./selected-release-tags.mjs";

const NPM_DIR = join(repoRoot, "publish_artifacts_npm");
const CRATES_DIR = join(repoRoot, "publish_artifacts_crates");
const META_DIR = join(repoRoot, "publish_artifacts_meta");
const MANIFEST_PATH = join(META_DIR, "release-manifest.json");
const CHECK_ONLY = process.argv.includes("--check-only");
const VALIDATION_MODE = process.env.VALIDATION_MODE === "true";

function command(name) {
    return process.platform === "win32" && name === "npm" ? "npm.cmd" : name;
}

function run(file, args, opts = {}) {
    return execFileSync(command(file), args, {
        cwd: repoRoot,
        encoding: "utf8",
        ...opts,
    });
}

function parsePackOutput(output) {
    const packages = JSON.parse(output);
    if (!Array.isArray(packages) || packages.length === 0 || !packages[0].filename) {
        throw new Error(`Unexpected npm pack output: ${output}`);
    }
    return packages[0].filename;
}

function setAzureOutput(name, value) {
    if (!process.env.TF_BUILD) return;
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${value}`);
}

function isSelected(workspace) {
    if (VALIDATION_MODE) return true;
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
if (VALIDATION_MODE && CHECK_ONLY) {
    console.log(
        "Validation mode: every publishable workspace is selected, " +
            "regardless of whether its release tag already exists.",
    );
}

let selected;
if (CHECK_ONLY) {
    selected = publishable.filter(isSelected);
} else {
    try {
        selected = resolveSelectedReleaseWorkspaces(
            process.env.SELECTED_RELEASE_TAGS,
            publishable,
        );
    } catch (error) {
        logError(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }

    if (!VALIDATION_MODE) {
        try {
            assertSelectedTagsAreUnreleased(selected, gitTagExistsOnRemote);
        } catch (error) {
            logError(error instanceof Error ? error.message : String(error));
            process.exit(1);
        }
    }
}

console.log(`Publishable workspaces: ${publishable.length}`);
console.log(`Selected release:       ${selected.length}`);

if (selected.length > 0) {
    console.log("\nPackages selected for release:");
    for (const { name, version, tag, crates } of selected) {
        const suffix =
            crates.length > 0
                ? ` (+ crates ${crates.map(crate => crate.crateName).join(", ")})`
                : "";
        console.log(`  - ${name}@${version} [${tag}]${suffix}`);
    }
}

if (CHECK_ONLY) {
    setAzureOutput("shouldBuild", selected.length > 0 ? "true" : "false");
    setAzureOutput("selectedReleaseTags", formatSelectedReleaseTags(selected));

    // Emit build number only once during the initial check-only selection phase,
    // not again during the later packing phase. This prevents the build name from
    // changing if new tags appear on origin between the check and pack stages.
    // This happens even with zero publishable workspaces to ensure the build name
    // is always set consistently.
    updateAzureBuildNumber(selected.length, "build");
    process.exit(0);
}

for (const directory of [NPM_DIR, CRATES_DIR, META_DIR]) {
    rmSync(directory, { force: true, recursive: true });
    mkdirSync(directory, { recursive: true });
}

const manifestPackages = [];
let hasErrors = false;

for (const { name, version, tag, outputPrefix, location, crates } of selected) {
    try {
        console.log(`\nPacking ${name}@${version} from ${location}...`);
        const packJson = run("npm", [
            "pack",
            "--silent",
            "--json",
            `--workspace=${location}`,
            `--pack-destination=${resolve(NPM_DIR)}`,
        ]);
        const npmTarball = parsePackOutput(packJson);
        const npmAsset = createReleaseAsset(npmTarball, join(NPM_DIR, npmTarball));

        const crateAssets = [];
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
            crateAssets.push(createReleaseAsset(basename(srcCrate), destCrate));
        }

        manifestPackages.push({
            name,
            version,
            tag,
            outputPrefix,
            npmAsset,
            crateAssets,
        });
        console.log(`Packed ${name}@${version} (${1 + crateAssets.length} asset(s))`);
    } catch (error) {
        hasErrors = true;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Failed to pack ${name}@${version}: ${message}`);
    }
}

if (manifestPackages.every(pkg => pkg.crateAssets.length === 0)) {
    // Guarantee `publish_artifacts_crates` always has at least one file so
    // `PublishPipelineArtifact@1` (and any downstream `DownloadPipelineArtifact@2`)
    // never has to handle a truly-empty directory. The `PublishRelease`
    // stage's `Publish` job strips this placeholder back out before
    // invoking the release template, so an all-npm batch still ends up
    // treated as "no crate assets to publish".
    writeFileSync(join(CRATES_DIR, ".no-crates-packed"), "");
}

const sourceCommit = (
    process.env.BUILD_SOURCEVERSION || run("git", ["rev-parse", "HEAD"])
).trim();
if (!/^[0-9a-f]{40}$/.test(sourceCommit)) {
    throw new Error(`Invalid source commit: ${sourceCommit}`);
}
const sourceBranch = (
    process.env.BUILD_SOURCEBRANCH ||
    run("git", ["rev-parse", "--symbolic-full-name", "HEAD"])
).trim();

writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify(
        createReleaseManifest({
            packages: manifestPackages,
            sourceBranch,
            sourceCommit,
            validationMode: VALIDATION_MODE,
        }),
        null,
        4,
    )}\n`,
);

console.log(`\nPacked: ${manifestPackages.length}/${selected.length}`);
console.log(`Manifest written to ${MANIFEST_PATH}`);

if (hasErrors) {
    process.exitCode = 1;
}
