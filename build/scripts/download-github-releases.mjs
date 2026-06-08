#!/usr/bin/env node
/**
 * Download GitHub release assets whose `${name}_v${version}` GitHub release
 * has no `deployed/<tag>` counterpart, and sort them into separate folders
 * for the publish template:
 *
 *   - `.tgz`   -> `publish_artifacts_npm/`
 *   - `.crate` -> `publish_artifacts_crates/`
 *
 * Invoked by `azure-pipelines-cd.yml` before the existing
 * `FAST.Release.PipelineTemplate` runs. We use a `deployed/<tag>` git
 * marker tag instead of `npm view` / `cargo search` because external
 * calls from 1ES agents to npm/crates.io are unreliable.
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
 *   - `GH_TOKEN` env var — required in Azure so the `gh` CLI can enumerate
 *     releases and download assets.
 *
 * The script never reads any package.json or Cargo.toml: the
 * source of truth for "what should be published" is the set of actual GitHub
 * releases. This keeps historical bare beachball tags from being treated as
 * deployable releases while still working on a freshly-cloned 1ES agent with
 * no `node_modules` or cargo registry.
 */

import { execFileSync } from "node:child_process";
import {
    mkdirSync,
    readdirSync,
    renameSync,
    rmSync,
    unlinkSync,
    writeFileSync,
} from "node:fs";
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

// Azure Pipelines must provide `GH_TOKEN` because both modes enumerate GitHub
// Releases through `gh api`. Local check-only runs may still use an existing
// `gh auth login` session; default mode requires the token explicitly because
// it downloads publish assets.
if (!process.env.GH_TOKEN && (process.env.TF_BUILD || !CHECK_ONLY)) {
    const action = CHECK_ONLY ? "list GitHub releases" : "download release assets";
    console.error(`GH_TOKEN must be set so the \`gh\` CLI can ${action}.`);
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

function listGitHubReleases() {
    const output = run("gh", [
        "api",
        "--paginate",
        `repos/${repo}/releases`,
        "--jq",
        ".[] | { tagName: .tag_name, isDraft: .draft } | @json",
    ]);

    return output
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => JSON.parse(line));
}

function setAzureOutput(name, value) {
    if (!process.env.TF_BUILD) return;
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${value}`);
}

const allTags = listGitTags();
const deployed = new Set(
    allTags.filter(t => t.startsWith("deployed/")).map(t => t.slice("deployed/".length)),
);
// Match beachball's release tag format: `${name}_v${major}.${minor}.${patch}`,
// where the version is the publishable portion (`1.0.0` or `1.0.0-alpha.3`).
// Anchored at the end of the tag name so trailing junk (e.g. a stray
// suffix accidentally appended after a real version) does not get
// misclassified as a release. We enumerate actual GitHub releases here,
// so historical bare beachball tags are not deployment candidates.
const RELEASE_TAG_RE = /_v\d+\.\d+\.\d+(?:-[\w.-]+)?$/;
const githubReleases = listGitHubReleases();
const releaseTags = githubReleases
    .filter(({ tagName, isDraft }) => !isDraft && RELEASE_TAG_RE.test(tagName))
    .map(({ tagName }) => tagName)
    .sort();
const undeployed = releaseTags.filter(t => !deployed.has(t)).sort();

console.log(`GitHub releases total:     ${githubReleases.length}`);
console.log(`Package releases:          ${releaseTags.length}`);
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

// Clear the publish artifact directories before recreating them so a
// re-run (locally or after a partially-failed Azure attempt) cannot
// pick up stale `.tgz` / `.crate` files from a previous invocation.
for (const dir of [NPM_DIR, CRATES_DIR, META_DIR]) {
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
}

let hasErrors = false;
const processed = [];

for (const tag of undeployed) {
    try {
        console.log(`\nDownloading assets for ${tag}...`);
        // Clear the stage dir before each iteration so leftover unknown-type
        // files from a previous release are not reprocessed (or warned about
        // repeatedly).
        rmSync(STAGE_DIR, { recursive: true, force: true });
        mkdirSync(STAGE_DIR, { recursive: true });
        run(
            "gh",
            ["release", "download", tag, "--repo", repo, "--dir", STAGE_DIR, "--clobber"],
            { stdio: "inherit" },
        );

        let foundAssets = 0;
        for (const file of readdirSync(STAGE_DIR)) {
            const src = join(STAGE_DIR, file);
            if (file.endsWith(".tgz")) {
                renameSync(src, join(NPM_DIR, file));
                foundAssets += 1;
            } else if (file.endsWith(".crate")) {
                renameSync(src, join(CRATES_DIR, file));
                foundAssets += 1;
            } else {
                console.warn(`  Ignoring unknown asset type: ${file}`);
                unlinkSync(src);
            }
        }

        // Refuse to mark a tag as processed if its release had no
        // recognised publish assets. Otherwise the Azure pipeline would
        // push the `deployed/<tag>` marker, and the (presumably broken)
        // release would never be retried.
        if (foundAssets === 0) {
            throw new Error(
                `Release ${tag} contained no .tgz or .crate assets; refusing to mark as deployed.`,
            );
        }

        processed.push(tag);
    } catch (error) {
        hasErrors = true;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Failed to download release ${tag}: ${message}`);
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
