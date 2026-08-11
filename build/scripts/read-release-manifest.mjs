#!/usr/bin/env node
/**
 * Read `release-manifest.json` (written by `pack-pending-releases.mjs` in
 * the `FAST - CD Build` pipeline's `BuildArtifacts` stage) and cross-reference
 * it against the workspaces that are publishable right now — from a fresh
 * `checkout: self` in the `FAST - CD` pipeline — to emit one set of Azure
 * Pipelines output variables per currently-publishable workspace:
 *
 *   - `<prefix>NeedsRelease`   - `"true"` when the workspace was packed by
 *     the build pipeline, `"false"` otherwise.
 *   - `<prefix>ReleaseTag`     - the workspace's `${name}_v${version}` tag.
 *   - `<prefix>ReleaseVersion` - the workspace's version.
 *
 * `.ado/pipelines/azure-pipelines-cd.yml` declares one static tagging task
 * and one `GitHubRelease@1` task per known publishable workspace (Azure
 * Pipelines cannot create tasks dynamically from manifest content), each
 * conditioned on that workspace's `<prefix>NeedsRelease` variable.
 *
 * Usage: node build/scripts/read-release-manifest.mjs <path-to-manifest.json>
 */

import { readFileSync } from "node:fs";
import { listPublishableWorkspaces } from "./lib/publishable-workspaces.mjs";

const manifestPath = process.argv[2];
if (!manifestPath) {
    console.error("Usage: read-release-manifest.mjs <path-to-manifest.json>");
    process.exit(1);
}

function setAzureOutput(name, value) {
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${value}`);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

if (!/^[0-9a-f]{40}$/.test(manifest.releaseCommit || "")) {
    console.error(
        `##vso[task.logissue type=error]Invalid release commit in manifest: ${manifest.releaseCommit}`,
    );
    process.exit(1);
}

const packagesByName = new Map((manifest.packages || []).map(pkg => [pkg.name, pkg]));
const publishable = listPublishableWorkspaces();
const publishableNames = new Set(publishable.map(workspace => workspace.name));
let pendingCount = 0;

for (const workspace of publishable) {
    const packed = packagesByName.get(workspace.name);
    const needsRelease = Boolean(packed);
    if (needsRelease) pendingCount += 1;

    setAzureOutput(`${workspace.prefix}NeedsRelease`, needsRelease ? "true" : "false");
    setAzureOutput(`${workspace.prefix}ReleaseTag`, packed ? packed.tag : workspace.tag);
    setAzureOutput(
        `${workspace.prefix}ReleaseVersion`,
        packed ? packed.version : workspace.version,
    );
}

setAzureOutput("releaseCommit", manifest.releaseCommit);
console.log(`Pending releases: ${pendingCount}/${publishable.length}`);

for (const pkg of manifest.packages || []) {
    if (!publishableNames.has(pkg.name)) {
        console.log(
            `##vso[task.logissue type=warning]${pkg.name} was packed but is no longer a publishable workspace on this commit.`,
        );
    }
}

if (pendingCount === 0) {
    console.log(
        "##vso[task.logissue type=error]No packages are pending release, but the CD pipeline was triggered.",
    );
    process.exit(1);
}
