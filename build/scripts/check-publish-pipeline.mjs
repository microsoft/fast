#!/usr/bin/env node
/**
 * Guardrail for Azure CD coverage.
 *
 * `pack-pending-releases.mjs` discovers publishable workspaces dynamically,
 * but `.ado/pipelines/azure-pipelines-cd.yml` must declare one static
 * `GitHubRelease@1` task (plus matching `PublishRelease` stage variables)
 * per package, because Azure Pipelines cannot create tasks from runtime
 * manifest content. This script keeps those surfaces in sync.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
    listPublishableWorkspaces,
    repoRoot,
    VersionDriftError,
} from "./lib/publishable-workspaces.mjs";

const pipelinePath = join(repoRoot, ".ado", "pipelines", "azure-pipelines-cd.yml");

function getStepBlocks(pipeline, stepHeader) {
    const lines = pipeline.split(/\r?\n/);
    const blocks = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.includes(stepHeader)) continue;

        const indent = line.match(/^(\s*)-/)?.[1].length;
        if (indent === undefined) continue;

        const block = [];
        for (let j = i; j < lines.length; j++) {
            const current = lines[j];
            const nextStep = current.match(
                /^(\s*)- (checkout|script|task|template|download):/,
            );
            if (j > i && nextStep && nextStep[1].length === indent) {
                break;
            }
            block.push(current);
        }
        blocks.push(block.join("\n"));
    }

    return blocks;
}

function validateUniquePrefixes(workspaces) {
    const seen = new Map();
    const failures = [];

    for (const workspace of workspaces) {
        const previous = seen.get(workspace.prefix);
        if (previous) {
            failures.push(
                `${workspace.name} and ${previous.name} both map to Azure output prefix '${workspace.prefix}'. Rename one package or update the prefix mapping.`,
            );
        } else {
            seen.set(workspace.prefix, workspace);
        }
    }

    return failures;
}

const pipeline = readFileSync(pipelinePath, "utf8");

let publishable;
try {
    publishable = listPublishableWorkspaces();
} catch (error) {
    if (error instanceof VersionDriftError) {
        console.error("[check-publish-pipeline] " + error.message);
        process.exit(1);
    }
    throw error;
}

const releaseBlocks = getStepBlocks(pipeline, "- task: GitHubRelease@1");
const failures = validateUniquePrefixes(publishable);

for (const { name, prefix } of publishable) {
    const needsVariable = `${prefix}NeedsRelease: $[ stageDependencies.PrepareRelease.Validate.outputs['release.${prefix}NeedsRelease'] ]`;
    const tagVariable = `${prefix}ReleaseTag: $[ stageDependencies.PrepareRelease.Validate.outputs['release.${prefix}ReleaseTag'] ]`;
    const versionVariable = `${prefix}ReleaseVersion: $[ stageDependencies.PrepareRelease.Validate.outputs['release.${prefix}ReleaseVersion'] ]`;
    // The release-tag-exists clause is what makes rerunning a partially
    // failed `PublishGitHub` job safe (see that job's comments in
    // azure-pipelines-cd.yml): it must be present alongside the
    // `NeedsRelease` check on every task, not just some of them.
    const condition = `condition: and(succeeded(), eq(variables['${prefix}NeedsRelease'], 'true'), eq(variables['releaseTagCheck.${prefix}ReleaseTagExists'], 'false'))`;
    const tag = `tag: $(${prefix}ReleaseTag)`;

    if (!pipeline.includes(needsVariable)) {
        failures.push(
            `Missing PublishRelease stage variable for ${name}: ${needsVariable}`,
        );
    }

    if (!pipeline.includes(tagVariable)) {
        failures.push(
            `Missing PublishRelease stage variable for ${name}: ${tagVariable}`,
        );
    }

    if (!pipeline.includes(versionVariable)) {
        failures.push(
            `Missing PublishRelease stage variable for ${name}: ${versionVariable}`,
        );
    }

    const hasReleaseTask = releaseBlocks.some(
        block =>
            block.includes(`Create ${name} GitHub Release`) &&
            block.includes(condition) &&
            block.includes("gitHubConnection: fast") &&
            block.includes("repositoryName: microsoft/fast") &&
            block.includes("tagSource: userSpecifiedTag") &&
            block.includes(tag),
    );

    if (!hasReleaseTask) {
        failures.push(
            `Missing GitHubRelease@1 task for ${name}. Add a task conditioned on '${prefix}NeedsRelease' and using '$(${prefix}ReleaseTag)'.`,
        );
    }
}

if (failures.length > 0) {
    console.error("[check-publish-pipeline] Azure CD publish coverage is incomplete.");
    console.error(
        "Every non-private workspace must be represented in .ado/pipelines/azure-pipelines-cd.yml. See .github/workflows/README.md > Adding a publishable package.",
    );
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log(
    `[check-publish-pipeline] Verified Azure CD coverage for ${publishable.length} publishable workspace(s).`,
);
