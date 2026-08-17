#!/usr/bin/env node
/**
 * Read `release-manifest.json` (written by `prepare-release-artifacts.mjs` in
 * the `FAST - CD Build` pipeline's `BuildArtifacts` stage) and cross-reference
 * it against the workspaces that are publishable right now — from a fresh
 * `checkout: self` in the `FAST - CD` pipeline — to emit one set of Azure
 * Pipelines output variables per currently-publishable workspace:
 *
 *   - `<outputPrefix>Included`       - `"true"` when the workspace was packed
 *     by the build pipeline, `"false"` otherwise.
 *   - `<outputPrefix>ReleaseTag`     - the workspace's `${name}_v${version}`
 *     tag.
 *   - `<outputPrefix>ReleaseVersion` - the workspace's version.
 *   - `releaseTags`                  - the validated manifest tags as a strict
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
 * Usage: node build/scripts/validate-release-artifacts.mjs <path-to-manifest.json>
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { updateAzureBuildNumber } from "./azure-build-number.mjs";
import { validateReleaseArtifacts } from "./release-manifest.mjs";
import { listPublishableWorkspaces } from "./release-workspaces.mjs";
import { formatSelectedReleaseTags } from "./selected-release-tags.mjs";

function setAzureOutput(name, value) {
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${value}`);
}

export function runValidation({
    manifestPath,
    environment = process.env,
    listWorkspaces = listPublishableWorkspaces,
    log = console.log,
    logError = console.error,
    readManifest = path => JSON.parse(readFileSync(path, "utf8")),
    setOutput = setAzureOutput,
    updateBuildNumber = updateAzureBuildNumber,
} = {}) {
    if (!manifestPath) {
        logError("Usage: validate-release-artifacts.mjs <path-to-manifest.json>");
        return 1;
    }

    try {
        const manifest = readManifest(manifestPath);
        const publishable = listWorkspaces();
        validateReleaseArtifacts({
            manifest,
            expectedSourceCommit: environment.RELEASE_BUILD_SOURCE_COMMIT,
            expectedSourceBranch: environment.RELEASE_BUILD_SOURCE_BRANCH,
            expectedValidationMode: environment.EXPECTED_VALIDATION_MODE,
            workspaces: publishable,
            npmDirectory: environment.NPM_ARTIFACT_DIR,
            crateDirectory: environment.CRATE_ARTIFACT_DIR,
        });

        const selectedPackages = manifest.packages || [];
        setOutput("releaseTags", formatSelectedReleaseTags(selectedPackages));
        updateBuildNumber(selectedPackages.length, "cd");

        const packagesByName = new Map(selectedPackages.map(pkg => [pkg.name, pkg]));
        let pendingCount = 0;

        for (const workspace of publishable) {
            const packed = packagesByName.get(workspace.name);
            const included = Boolean(packed);
            if (included) pendingCount += 1;

            setOutput(`${workspace.outputPrefix}Included`, included ? "true" : "false");
            setOutput(
                `${workspace.outputPrefix}ReleaseTag`,
                packed ? packed.tag : workspace.tag,
            );
            setOutput(
                `${workspace.outputPrefix}ReleaseVersion`,
                packed ? packed.version : workspace.version,
            );
        }

        setOutput("releaseCommit", manifest.sourceCommit);
        log(`Pending releases: ${pendingCount}/${publishable.length}`);

        if (pendingCount === 0) {
            throw new Error(
                "No packages are pending release, but the CD pipeline was triggered.",
            );
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logError(`##vso[task.logissue type=error]${message}`);
        return 1;
    }

    return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
    process.exitCode = runValidation({ manifestPath: process.argv[2] });
}
