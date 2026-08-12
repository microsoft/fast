#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseReleaseTags } from "./selected-release-tags.mjs";

function runGit(args, { allowMissing = false } = {}) {
    try {
        return execFileSync("git", args, { encoding: "utf8" });
    } catch (error) {
        if (allowMissing && error?.status === 2) {
            return null;
        }
        throw error;
    }
}

function validateInputs(releaseTags, releaseCommit, git) {
    if (!/^[0-9a-f]{40}$/.test(releaseCommit || "")) {
        throw new Error("RELEASE_COMMIT must be a lowercase 40-character Git SHA.");
    }
    const tags = parseReleaseTags(releaseTags, "RELEASE_TAGS");
    for (const tag of tags) {
        git(["check-ref-format", `refs/tags/${tag}`]);
    }
    return tags;
}

function readRemoteTagCommit(tag, localRef, git) {
    const remote = git(
        ["ls-remote", "--exit-code", "origin", `refs/tags/${tag}`, `refs/tags/${tag}^{}`],
        { allowMissing: true },
    );
    if (remote === null) {
        return null;
    }

    git(["fetch", "--force", "origin", `refs/tags/${tag}:${localRef}`]);
    return git(["rev-parse", `${localRef}^{}`]).trim();
}

function verifyCommit(tag, actualCommit, expectedCommit, context = "") {
    if (actualCommit !== expectedCommit) {
        throw new Error(
            `${context}${tag} points to ${actualCommit}, not ${expectedCommit}.`,
        );
    }
}

function pushTagWithRaceCheck({
    tag,
    expectedCommit,
    localRef,
    git,
    log,
    successMessage,
}) {
    try {
        git(["push", "origin", `refs/tags/${tag}`]);
        return;
    } catch (pushError) {
        const racedCommit = readRemoteTagCommit(tag, localRef, git);
        if (racedCommit === null) {
            throw pushError;
        }
        verifyCommit(tag, racedCommit, expectedCommit, "Concurrent tag ");
        log(successMessage);
    }
}

function createReleaseTags({
    releaseTags,
    releaseCommit,
    git = runGit,
    log = console.log,
}) {
    const tags = validateInputs(releaseTags, releaseCommit, git);
    git(["fetch", "--no-tags", "origin", releaseCommit]);
    git(["config", "user.name", "Azure Pipelines"]);
    git(["config", "user.email", "azure-pipelines@microsoft.com"]);

    for (const tag of tags) {
        const localRef = `refs/azure-release-tags/${tag}`;
        const existingCommit = readRemoteTagCommit(tag, localRef, git);
        if (existingCommit !== null) {
            verifyCommit(tag, existingCommit, releaseCommit);
            log(`${tag} already points to ${releaseCommit}.`);
            continue;
        }

        git(["tag", "-a", tag, releaseCommit, "-m", `Release ${tag}`]);
        pushTagWithRaceCheck({
            tag,
            expectedCommit: releaseCommit,
            localRef,
            git,
            log,
            successMessage: `Concurrent release run created ${tag} at the expected commit.`,
        });
    }
}

function markReleaseTagsDeployed({
    releaseTags,
    releaseCommit,
    git = runGit,
    log = console.log,
}) {
    const tags = validateInputs(releaseTags, releaseCommit, git);

    for (const releaseTag of tags) {
        const deployedTag = `deployed/${releaseTag}`;
        const localRef = `refs/azure-deployment-tags/${releaseTag}`;
        const existingCommit = readRemoteTagCommit(deployedTag, localRef, git);
        if (existingCommit !== null) {
            verifyCommit(deployedTag, existingCommit, releaseCommit);
            log(`${deployedTag} already marks the expected release.`);
            continue;
        }

        const releaseRef = `refs/azure-release-tags/${releaseTag}`;
        const actualReleaseCommit = readRemoteTagCommit(releaseTag, releaseRef, git);
        if (actualReleaseCommit === null) {
            throw new Error(`Release tag ${releaseTag} does not exist on origin.`);
        }
        verifyCommit(releaseTag, actualReleaseCommit, releaseCommit);

        git(["tag", deployedTag, releaseRef]);
        pushTagWithRaceCheck({
            tag: deployedTag,
            expectedCommit: releaseCommit,
            localRef,
            git,
            log,
            successMessage: `Concurrent release run created ${deployedTag} at the expected commit.`,
        });
    }
}

function main() {
    const mode = process.argv[2];
    const options = {
        releaseTags: process.env.RELEASE_TAGS,
        releaseCommit: process.env.RELEASE_COMMIT,
    };

    if (mode === "create") {
        createReleaseTags(options);
        return;
    }
    if (mode === "mark-deployed") {
        markReleaseTagsDeployed(options);
        return;
    }
    throw new Error("Usage: manage-release-tags.mjs <create|mark-deployed>");
}

const invokedDirectly =
    process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (invokedDirectly) {
    try {
        main();
    } catch (error) {
        console.error(
            `##vso[task.logissue type=error]${
                error instanceof Error ? error.message : String(error)
            }`,
        );
        process.exit(1);
    }
}

export { createReleaseTags, markReleaseTagsDeployed, readRemoteTagCommit };
