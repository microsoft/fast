#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
    formatReleaseTagCsv,
    parseReleaseTagCsv,
    validateReleaseTag,
} from "./release-tag-csv.mjs";

const defaultIdentity = {
    email: "azure-pipelines@microsoft.com",
    name: "Azure Pipelines",
};

export function validateReleaseCommit(commit) {
    if (typeof commit !== "string" || !/^[0-9a-f]{40}$/.test(commit)) {
        throw new Error("RELEASE_COMMIT must be a full lowercase 40-character SHA.");
    }
    return commit;
}

export function gitResult(args, { cwd = process.cwd(), input } = {}) {
    return spawnSync("git", args, {
        cwd,
        encoding: "utf8",
        env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
        input,
        stdio: ["pipe", "pipe", "pipe"],
    });
}

function failure(action, result) {
    const detail = (result.stderr || result.stdout || result.error?.message || "")
        .trim()
        .replaceAll("\n", " ");
    return new Error(`Unable to ${action}${detail ? `: ${detail}` : "."}`);
}

export function localRef(namespace, value) {
    const digest = createHash("sha256").update(value).digest("hex");
    return `refs/azure-pipelines/${namespace}/${digest}`;
}

export function createReleaseTagManager({
    cwd = process.cwd(),
    execute = (args, options) => gitResult(args, { cwd, ...options }),
    identity = defaultIdentity,
    log = console.log,
    now = () => new Date(),
} = {}) {
    function run(args, action, options) {
        const result = execute(args, options);
        if (result.status !== 0) {
            throw failure(action, result);
        }
        return (result.stdout ?? "").trim();
    }

    function validateTagRef(tag) {
        run(["check-ref-format", `refs/tags/${tag}`], `validate release tag ${tag}`);
    }

    function queryRemoteTag(tag) {
        validateTagRef(tag);
        const result = execute([
            "ls-remote",
            "--exit-code",
            "origin",
            `refs/tags/${tag}`,
            `refs/tags/${tag}^{}`,
        ]);
        if (result.status === 2) {
            return false;
        }
        if (result.status !== 0) {
            throw failure(`query release tag ${tag} on origin`, result);
        }
        const refs = (result.stdout ?? "")
            .trim()
            .split("\n")
            .filter(Boolean)
            .map(line => line.split(/\s+/)[1]);
        if (
            refs.length === 0 ||
            refs.some(ref => ref !== `refs/tags/${tag}` && ref !== `refs/tags/${tag}^{}`)
        ) {
            throw new Error(
                `Origin returned an invalid response for release tag ${tag}.`,
            );
        }
        return true;
    }

    function fetchAndPeelTag(tag, namespace) {
        const ref = localRef(namespace, tag);
        run(
            [
                "fetch",
                "--force",
                "--no-tags",
                "--no-recurse-submodules",
                "origin",
                `refs/tags/${tag}:${ref}`,
            ],
            `fetch release tag ${tag} from origin`,
        );
        return run(
            ["rev-parse", "--verify", `${ref}^{commit}`],
            `peel release tag ${tag} to a commit`,
        );
    }

    function verifyRemoteTag(tag, expectedCommit, namespace) {
        if (!queryRemoteTag(tag)) {
            return false;
        }
        const actualCommit = fetchAndPeelTag(tag, namespace);
        if (actualCommit !== expectedCommit) {
            throw new Error(`${tag} points to ${actualCommit}, not ${expectedCommit}.`);
        }
        return true;
    }

    function fetchReleaseCommit(commit) {
        const ref = localRef("commits", commit);
        run(
            [
                "fetch",
                "--force",
                "--no-tags",
                "--no-recurse-submodules",
                "origin",
                `${commit}:${ref}`,
            ],
            `fetch release commit ${commit} from origin`,
        );
        const fetchedCommit = run(
            ["rev-parse", "--verify", `${ref}^{commit}`],
            `verify release commit ${commit}`,
        );
        if (fetchedCommit !== commit) {
            throw new Error(
                `Fetched release commit ${fetchedCommit} does not match ${commit}.`,
            );
        }
        return ref;
    }

    function pushWithRaceCheck(local, remoteTag, expectedCommit, namespace, kind) {
        const push = execute(["push", "origin", `${local}:refs/tags/${remoteTag}`]);
        if (push.status === 0) {
            return;
        }

        try {
            if (verifyRemoteTag(remoteTag, expectedCommit, namespace)) {
                log(
                    `Concurrent release run created ${remoteTag} at the expected commit.`,
                );
                return;
            }
        } catch (error) {
            throw new Error(
                `Concurrent ${kind} verification failed after push rejection: ` +
                    `${error.message}`,
                { cause: error },
            );
        }
        throw failure(`push ${kind} ${remoteTag}`, push);
    }

    function createAnnotatedTag(tag, commitRef) {
        const date = now();
        if (!(date instanceof Date) || Number.isNaN(date.valueOf())) {
            throw new Error("Unable to create release tag with an invalid date.");
        }
        const timestamp = Math.floor(date.valueOf() / 1000);
        const object = run(
            ["rev-parse", "--verify", `${commitRef}^{commit}`],
            `resolve release commit for ${tag}`,
        );
        const tagObject = [
            `object ${object}`,
            "type commit",
            `tag ${tag}`,
            `tagger ${identity.name} <${identity.email}> ${timestamp} +0000`,
            "",
            `Release ${tag}`,
            "",
        ].join("\n");
        const objectId = run(["mktag"], `create annotated tag object for ${tag}`, {
            input: tagObject,
        });
        const ref = localRef("created-release-tags", tag);
        run(["update-ref", ref, objectId], `store annotated tag object for ${tag}`);
        return ref;
    }

    function create(tags, commit) {
        validateReleaseCommit(commit);
        if (!Array.isArray(tags) || tags.length === 0) {
            throw new Error("Release tags must be a non-empty array.");
        }
        formatReleaseTagCsv(tags);
        for (const tag of tags) {
            validateReleaseTag(tag);
            validateTagRef(tag);
        }
        const commitRef = fetchReleaseCommit(commit);

        for (const tag of tags) {
            if (verifyRemoteTag(tag, commit, "existing-release-tags")) {
                log(`${tag} already points to ${commit}.`);
                continue;
            }
            const ref = createAnnotatedTag(tag, commitRef);
            pushWithRaceCheck(ref, tag, commit, "raced-release-tags", "release tag");
        }
    }

    function markDeployed(tags, commit) {
        validateReleaseCommit(commit);
        if (!Array.isArray(tags) || tags.length === 0) {
            throw new Error("Release tags must be a non-empty array.");
        }
        formatReleaseTagCsv(tags);
        for (const tag of tags) {
            validateReleaseTag(tag);
            validateTagRef(tag);
        }

        for (const tag of tags) {
            const deployedTag = `deployed/${tag}`;
            if (verifyRemoteTag(deployedTag, commit, "existing-deployment-markers")) {
                log(`${deployedTag} already marks the expected release.`);
                continue;
            }
            if (!verifyRemoteTag(tag, commit, "source-release-tags")) {
                throw new Error(`Release tag ${tag} does not exist on origin.`);
            }

            const ref = localRef("created-deployment-markers", tag);
            run(["update-ref", ref, commit], `create deployment marker for ${tag}`);
            pushWithRaceCheck(
                ref,
                deployedTag,
                commit,
                "raced-deployment-markers",
                "deployment marker",
            );
        }
    }

    return { create, markDeployed, queryRemoteTag, verifyRemoteTag };
}

function main() {
    const command = process.argv[2];
    if (command !== "create" && command !== "mark-deployed") {
        throw new Error(
            "Usage: manage-release-tags.mjs <create|mark-deployed> with " +
                "RELEASE_COMMIT and RELEASE_TAGS.",
        );
    }
    const commit = validateReleaseCommit(process.env.RELEASE_COMMIT);
    const tags = parseReleaseTagCsv(process.env.RELEASE_TAGS, "RELEASE_TAGS");
    const manager = createReleaseTagManager();
    manager[command === "create" ? "create" : "markDeployed"](tags, commit);
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
