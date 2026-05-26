#!/usr/bin/env node
/**
 * Download GitHub release assets whose `${name}_v${version}` git tag has
 * no `deployed/<tag>` counterpart, and sort them into separate folders
 * for the publish template:
 *
 *   - `.tgz`   -> `publish_artifacts_npm/`
 *   - `.crate` -> `publish_artifacts_crates/`
 *
 * Invoked by `azure-pipelines-cd.yml` before the existing
 * `FAST.Release.PipelineTemplate` runs. We use a `deployed/<tag>` git
 * marker tag instead of `npm view` / `cargo search` because external
 * calls from 1ES agents to npm/crates.io are unreliable (per the
 * webui Azure-pipeline guidance).
 *
 * After a successful publish the Azure pipeline pushes the
 * `deployed/<tag>` marker tag for each release that was published; the
 * next run sees it via `git tag -l` and skips that release.
 *
 * Modes:
 *
 *   - default: download assets for every undeployed release. Writes the
 *     processed tag list to `publish_artifacts_meta/undeployed-tags.txt`
 *     so the Azure pipeline can push `deployed/<tag>` markers after the
 *     publish template completes.
 *   - `--check-only`: enumerate undeployed releases only. Sets the
 *     `needsDeployment` and `undeployedTags` Azure Pipelines output
 *     variables (when running under `TF_BUILD`). No downloads.
 *
 * Inputs:
 *
 *   - `GITHUB_REPOSITORY` env var (`owner/repo`) — required.
 *   - `GH_TOKEN` env var — required for non-`--check-only` mode so the
 *     `gh` CLI can authenticate.
 *
 * The script never reads any package.json or Cargo.toml: the
 * source of truth for "what should be published" is the set of git
 * tags. This keeps the script working on a freshly-cloned 1ES agent
 * with no `node_modules` or cargo registry.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const NPM_DIR = "publish_artifacts_npm";
const CRATES_DIR = "publish_artifacts_crates";
const META_DIR = "publish_artifacts_meta";
const STAGE_DIR = "publish_artifacts_stage";

const CHECK_ONLY = process.argv.includes("--check-only");

const repo = process.env.GITHUB_REPOSITORY;
if (!repo) {
    console.error("GITHUB_REPOSITORY must be set to owner/repo");
    process.exit(1);
}

function run(file, args, opts = {}) {
    return execFileSync(file, args, { encoding: "utf8", ...opts });
}

function listGitTags() {
    return run("git", ["tag", "--list"])
        .split("\n")
        .map(t => t.trim())
        .filter(Boolean);
}

function setAzureOutput(name, value) {
    if (!process.env.TF_BUILD) return;
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${value}`);
}

const allTags = listGitTags();
const deployed = new Set(
    allTags.filter(t => t.startsWith("deployed/")).map(t => t.slice("deployed/".length)),
);
const releaseTags = allTags.filter(t => /_v\d+\.\d+/.test(t));
const undeployed = releaseTags.filter(t => !deployed.has(t)).sort();

console.log(`Release tags total:        ${releaseTags.length}`);
console.log(`Already deployed:          ${releaseTags.length - undeployed.length}`);
console.log(`Undeployed:                ${undeployed.length}`);

if (undeployed.length > 0) {
    console.log("\nUndeployed tags:");
    for (const tag of undeployed) {
        console.log(`  - ${tag}`);
    }
}

setAzureOutput("needsDeployment", undeployed.length > 0 ? "true" : "false");
setAzureOutput("undeployedTags", undeployed.join(","));

if (CHECK_ONLY || undeployed.length === 0) {
    process.exit(0);
}

mkdirSync(NPM_DIR, { recursive: true });
mkdirSync(CRATES_DIR, { recursive: true });
mkdirSync(META_DIR, { recursive: true });

let hasErrors = false;
const processed = [];

for (const tag of undeployed) {
    try {
        console.log(`\nDownloading assets for ${tag}...`);
        mkdirSync(STAGE_DIR, { recursive: true });
        run(
            "gh",
            ["release", "download", tag, "--repo", repo, "--dir", STAGE_DIR, "--clobber"],
            { stdio: "inherit" },
        );

        for (const file of readdirSync(STAGE_DIR)) {
            const src = join(STAGE_DIR, file);
            if (file.endsWith(".tgz")) {
                renameSync(src, join(NPM_DIR, file));
            } else if (file.endsWith(".crate")) {
                renameSync(src, join(CRATES_DIR, file));
            } else {
                console.warn(`  Ignoring unknown asset type: ${file}`);
            }
        }

        processed.push(tag);
    } catch (error) {
        hasErrors = true;
        console.error(`Failed to download release ${tag}:`, error.message);
    }
}

writeFileSync(
    join(META_DIR, "undeployed-tags.txt"),
    processed.join("\n") + (processed.length ? "\n" : ""),
);

console.log(`\nProcessed ${processed.length}/${undeployed.length} release(s).`);
console.log(`Tag list written to ${join(META_DIR, "undeployed-tags.txt")}`);

if (hasErrors) {
    process.exitCode = 1;
}
