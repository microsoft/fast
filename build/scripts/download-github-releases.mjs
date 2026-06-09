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
 * The script reads workspace package manifests and paired Cargo manifests only:
 * the source of truth for "what should be published" is the current workspace
 * versions plus matching release tags. This keeps historical bare beachball tags
 * from being treated as deployable releases while still working on a
 * freshly-cloned 1ES agent with no `node_modules` or cargo registry.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

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

function npmNameToCrateName(npmName) {
    return npmName.replace(/^@/, "").replace(/\//g, "-");
}

function npmNameToOutputPrefix(npmName) {
    return npmNameToCrateName(npmName)
        .replace(/^microsoft-/, "")
        .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
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
        const hasCrate = existsSync(cargoTomlPath);

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
            tag: `${pkg.name}_v${pkg.version}`,
            outputPrefix: npmNameToOutputPrefix(pkg.name),
        });
    }

    return workspaces;
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
const publishable = listPublishableWorkspaces();
const releaseCandidates = publishable
    .filter(({ tag }) => tagSet.has(tag))
    .sort((a, b) => a.tag.localeCompare(b.tag));
const undeployed = releaseCandidates.filter(({ tag }) => !deployed.has(tag));
const undeployedTagSet = new Set(undeployed.map(({ tag }) => tag));

console.log(`Publishable workspaces:    ${publishable.length}`);
console.log(`Current release tags:      ${releaseCandidates.length}`);
console.log(`Already deployed:          ${releaseCandidates.length - undeployed.length}`);
console.log(`Undeployed:                ${undeployed.length}`);

if (undeployed.length > 0) {
    console.log("\nUndeployed tags:");
    for (const { tag } of undeployed) {
        console.log(`  - ${tag}`);
    }
}

setAzureOutput("needsDeployment", undeployed.length > 0 ? "true" : "false");
setAzureOutput("undeployedTags", undeployed.map(({ tag }) => tag).join(","));
for (const workspace of publishable) {
    setAzureOutput(`${workspace.outputPrefix}ReleaseTag`, workspace.tag);
    setAzureOutput(
        `${workspace.outputPrefix}NeedsDeployment`,
        undeployedTagSet.has(workspace.tag) ? "true" : "false",
    );
}
