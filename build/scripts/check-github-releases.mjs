#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { listPublishableWorkspaces } from "./release-workspaces.mjs";

const defaultRepository = "microsoft/fast";
const apiTimeoutMs = 10000;

function selectedReleaseChecks(manifest, workspaces) {
    if (!Array.isArray(manifest?.packages) || manifest.packages.length === 0) {
        throw new Error("Release manifest contains no packages.");
    }

    const workspaceByName = new Map(
        workspaces.map(workspace => [workspace.name, workspace]),
    );

    return manifest.packages.map(pkg => {
        const workspace = workspaceByName.get(pkg?.name);
        if (!workspace) {
            throw new Error(`Release manifest references unknown package ${pkg?.name}.`);
        }
        if (pkg.tag !== workspace.tag) {
            throw new Error(
                `Release manifest tag for ${workspace.name} does not match the workspace.`,
            );
        }

        return {
            name: workspace.name,
            outputName: `${workspace.prefix}GitHubReleaseExists`,
            tag: pkg.tag,
        };
    });
}

async function githubReleaseExists(
    tag,
    {
        fetchImpl = globalThis.fetch,
        repository = defaultRepository,
        token = process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim(),
        timeoutMs = apiTimeoutMs,
    } = {},
) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const headers = {
        Accept: "application/vnd.github+json",
        "User-Agent": "FAST-CD-Pipeline",
        "X-GitHub-Api-Version": "2022-11-28",
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetchImpl(
            `https://api.github.com/repos/${repository}/releases/tags/${encodeURIComponent(tag)}`,
            {
                headers,
                method: "GET",
                signal: controller.signal,
            },
        );

        if (response.status === 200) {
            const release = await response.json();
            if (!release || typeof release !== "object") {
                throw new Error("response was not a GitHub Release object");
            }
            return true;
        }
        if (response.status === 404) {
            return false;
        }

        const detail = await response.text().catch(() => "");
        throw new Error(
            `GitHub API returned HTTP ${response.status}` +
                `${response.statusText ? ` ${response.statusText}` : ""}` +
                `${detail ? `: ${detail}` : ""}`,
        );
    } catch (error) {
        throw new Error(
            `Failed to query GitHub Release for ${tag}: ${
                error instanceof Error ? error.message : String(error)
            }`,
            { cause: error },
        );
    } finally {
        clearTimeout(timeoutId);
    }
}

function setAzureOutput(name, value) {
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${value}`);
}

async function checkGitHubReleases(
    manifest,
    {
        workspaces,
        releaseExists = githubReleaseExists,
        emitOutput = setAzureOutput,
        log = console.log,
    },
) {
    const results = [];
    for (const release of selectedReleaseChecks(manifest, workspaces)) {
        const exists = await releaseExists(release.tag);
        emitOutput(release.outputName, exists ? "true" : "false");
        log(
            `${release.name}: ${release.tag} ${
                exists ? "already has a GitHub Release" : "does not have a GitHub Release"
            }.`,
        );
        results.push({ ...release, exists });
    }
    return results;
}

async function main() {
    const manifestPath = process.env.RELEASE_MANIFEST_PATH ?? process.argv[2];
    if (!manifestPath) {
        throw new Error(
            "RELEASE_MANIFEST_PATH or a release manifest path argument is required.",
        );
    }

    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    await checkGitHubReleases(manifest, {
        workspaces: listPublishableWorkspaces(),
    });
}

const invokedDirectly =
    process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (invokedDirectly) {
    main().catch(error => {
        console.error(
            `##vso[task.logissue type=error]${
                error instanceof Error ? error.message : String(error)
            }`,
        );
        process.exit(1);
    });
}

export { checkGitHubReleases, githubReleaseExists, selectedReleaseChecks };
