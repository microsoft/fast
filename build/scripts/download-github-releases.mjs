#!/usr/bin/env node
/**
 * Detect current publishable workspaces whose `${name}_v${version}` release tag
 * has no `deployed/<tag>` counterpart.
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
 * The Azure pipeline uses this script during its Check stage, then downloads
 * release assets through `DownloadGitHubRelease@0` using the repo's GitHub
 * service connection. This avoids direct GitHub API calls from this script and
 * keeps the flow aligned with the WebUI CD pipeline.
 *
 * Inputs:
 *
 *   - `GITHUB_REPOSITORY` env var (`owner/repo`) — required.
 *   - `FAST_RELEASE_SKIP_CRATES=true` — skips paired Rust crate validation.
 *
 * The script reads workspace package manifests and paired Cargo manifests only:
 * the source of truth for "what should be published" is the current workspace
 * versions plus matching release tags. This keeps historical bare beachball tags
 * from being treated as deployable releases while still working on a
 * freshly-cloned 1ES agent with no `node_modules` or cargo registry.
 * Versions with a matching `hotfix/${name}_v${version}` tag are excluded:
 * their artifacts belong exclusively to the manual Azure hotfix pipeline.
 *
 * Most workspaces map to at most one crate by name convention.
 * `@microsoft/fast-build` intentionally maps to both `microsoft-fast-build`
 * and `microsoft-fast-convert`, but still uses one npm package release tag
 * and one Azure download task.
 */

import { execFileSync } from "node:child_process";
import {
    excludeHotfixWorkspaces,
    listPairedCrates,
    listPublishableWorkspaces,
} from "./release-metadata.mjs";

const CHECK_ONLY = process.argv.includes("--check-only");
if (!CHECK_ONLY) {
    console.error(
        "download-github-releases.mjs only supports --check-only; Azure Pipelines downloads assets with DownloadGitHubRelease@0.",
    );
    process.exit(1);
}

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

function shouldSkipCrates() {
    return process.env.FAST_RELEASE_SKIP_CRATES === "true";
}

function npmNameToOutputPrefix(npmName) {
    return npmName
        .replace(/^@/, "")
        .replace(/\//g, "-")
        .replace(/^microsoft-/, "")
        .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function setAzureOutput(name, value) {
    if (!process.env.TF_BUILD) return;
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${value}`);
}

const allTags = listGitTags();
const tagSet = new Set(allTags);
const deployed = new Set(
    allTags.filter(t => t.startsWith("deployed/")).map(t => t.slice("deployed/".length)),
);
const publishable = excludeHotfixWorkspaces(listPublishableWorkspaces()).map(
    workspace => {
        listPairedCrates(workspace.name, workspace.version);
        return {
            ...workspace,
            tag: `${workspace.name}_v${workspace.version}`,
            outputPrefix: npmNameToOutputPrefix(workspace.name),
        };
    },
);
if (shouldSkipCrates()) {
    console.log("Paired Rust crate assets are skipped for this deployment check.");
}
const releaseCandidates = publishable
    .filter(({ tag }) => tagSet.has(tag))
    .sort((a, b) => a.tag.localeCompare(b.tag));
const undeployed = releaseCandidates.filter(({ tag }) => !deployed.has(tag));
const undeployedTagSet = new Set(undeployed.map(({ tag }) => tag));
const npmDistTag = "latest";

console.log(`Publishable workspaces:    ${publishable.length}`);
console.log(`Current release tags:      ${releaseCandidates.length}`);
console.log(`Already deployed:          ${releaseCandidates.length - undeployed.length}`);
console.log(`Undeployed:                ${undeployed.length}`);
console.log(`npm dist-tag:              ${npmDistTag}`);

if (undeployed.length > 0) {
    console.log("\nUndeployed tags:");
    for (const { tag } of undeployed) {
        console.log(`  - ${tag}`);
    }
}

setAzureOutput("needsDeployment", undeployed.length > 0 ? "true" : "false");
setAzureOutput("undeployedTags", undeployed.map(({ tag }) => tag).join(","));
setAzureOutput("npmDistTag", npmDistTag);
for (const workspace of publishable) {
    setAzureOutput(`${workspace.outputPrefix}ReleaseTag`, workspace.tag);
    setAzureOutput(
        `${workspace.outputPrefix}NeedsDeployment`,
        undeployedTagSet.has(workspace.tag) ? "true" : "false",
    );
}
