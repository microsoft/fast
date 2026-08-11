#!/usr/bin/env node
/**
 * For every package recorded in `release-manifest.json`, freshly check (via
 * `git ls-remote origin`) whether its `${name}_v${version}` release tag
 * already exists on `origin` — independent of whatever
 * `read-release-manifest.mjs` observed earlier in the `PrepareRelease` stage.
 *
 * `.ado/pipelines/azure-pipelines-cd.yml`'s `PublishGitHub` job runs
 * `GitHubRelease@1` with `action: create` and `tagSource: userSpecifiedTag`,
 * which creates the tag as part of creating the release (so no separate
 * pre-publish tagging step exists — see that pipeline's `PublishRelease`
 * stage comment for why). If that job partially fails (e.g. one package's
 * `GitHubRelease@1` task fails after another package's already succeeded)
 * and a maintainer reruns the failed job, Azure Pipelines reruns every task
 * in the job, including the `GitHubRelease@1` tasks that already succeeded —
 * which would otherwise fail trying to recreate a release (and tag) that
 * already exists. This script's `${prefix}ReleaseTagExists` output lets each
 * `GitHubRelease@1` task's `condition` skip packages whose tag is already
 * there, so rerunning the job is safe.
 *
 * Usage: node build/scripts/check-release-tags.mjs <path-to-manifest.json>
 */

import { readFileSync } from "node:fs";
import { gitTagExistsOnRemote } from "./lib/publishable-workspaces.mjs";

const manifestPath = process.argv[2];
if (!manifestPath) {
    console.error("Usage: check-release-tags.mjs <path-to-manifest.json>");
    process.exit(1);
}

function setAzureOutput(name, value) {
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${value}`);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

for (const { name, tag, prefix } of manifest.packages || []) {
    const exists = gitTagExistsOnRemote(tag);
    console.log(
        `${name}: ${tag} ${exists ? "already exists (release already published)" : "not yet created"}`,
    );
    setAzureOutput(`${prefix}ReleaseTagExists`, exists ? "true" : "false");
}
