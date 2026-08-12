#!/usr/bin/env node
/**
 * Read `release-manifest.json` (written by `pack-pending-releases.mjs` in
 * the `FAST - CD Build` pipeline's `BuildArtifacts` stage) and cross-reference
 * it against the workspaces that are publishable right now — from a fresh
 * `checkout: self` in the `FAST - CD` pipeline — to emit one set of Azure
 * Pipelines output variables per currently-publishable workspace:
 *
 *   - `<prefix>Included`       - `"true"` when the workspace was packed by
 *     the build pipeline, `"false"` otherwise.
 *   - `<prefix>ReleaseTag`     - the workspace's `${name}_v${version}` tag.
 *   - `<prefix>ReleaseVersion` - the workspace's version.
 *   - `releaseTags`            - the validated manifest tags as a strict
 *     comma-separated list.
 *
 * `.ado/pipelines/azure-pipelines-cd.yml` creates tags from the generic
 * `releaseTags` list. It still declares one `GitHubRelease@1` task per known
 * publishable workspace because Azure Pipelines cannot create tasks
 * dynamically from manifest content.
 *
 * Before emitting outputs, validates the manifest and downloaded artifact
 * directories against the selected pipeline resource metadata supplied in
 * the environment.
 *
 * Usage: node build/scripts/read-release-manifest.mjs <path-to-manifest.json>
 */

import { readFileSync } from "node:fs";
import { formatAzureBuildNumber } from "./lib/azure-build-number.mjs";
import { listPublishableWorkspaces } from "./lib/publishable-workspaces.mjs";
import { validateReleaseArtifacts } from "./lib/release-manifest.mjs";
import { formatSelectedReleaseTags } from "./lib/selected-release-tags.mjs";

const manifestPath = process.argv[2];
if (!manifestPath) {
    console.error("Usage: read-release-manifest.mjs <path-to-manifest.json>");
    process.exit(1);
}

function setAzureOutput(name, value) {
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${value}`);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const publishable = listPublishableWorkspaces();
try {
    validateReleaseArtifacts({
        manifest,
        expectedReleaseCommit: process.env.RELEASE_BUILD_SOURCE_COMMIT,
        expectedValidationMode: process.env.EXPECTED_VALIDATION_MODE,
        sourceBranch: process.env.RELEASE_BUILD_SOURCE_BRANCH,
        workspaces: publishable,
        npmDirectory: process.env.NPM_ARTIFACT_DIR,
        crateDirectory: process.env.CRATE_ARTIFACT_DIR,
    });
} catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`##vso[task.logissue type=error]${message}`);
    process.exit(1);
}
const selectedPackages = manifest.packages || [];
setAzureOutput("releaseTags", formatSelectedReleaseTags(selectedPackages));

const buildId = process.env.BUILD_BUILDID || "local";
console.log(
    `##vso[build.updatebuildnumber]${formatAzureBuildNumber(
        selectedPackages.length,
        "cd",
        buildId,
    )}`,
);

const packagesByName = new Map(selectedPackages.map(pkg => [pkg.name, pkg]));
let pendingCount = 0;

for (const workspace of publishable) {
    const packed = packagesByName.get(workspace.name);
    const included = Boolean(packed);
    if (included) pendingCount += 1;

    setAzureOutput(`${workspace.prefix}Included`, included ? "true" : "false");
    setAzureOutput(`${workspace.prefix}ReleaseTag`, packed ? packed.tag : workspace.tag);
    setAzureOutput(
        `${workspace.prefix}ReleaseVersion`,
        packed ? packed.version : workspace.version,
    );
}

setAzureOutput("releaseCommit", manifest.releaseCommit);
console.log(`Pending releases: ${pendingCount}/${publishable.length}`);

if (pendingCount === 0) {
    console.log(
        "##vso[task.logissue type=error]No packages are pending release, but the CD pipeline was triggered.",
    );
    process.exit(1);
}
