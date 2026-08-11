#!/usr/bin/env node
/**
 * For every package recorded in `release-manifest.json`, check whether its
 * GitHub Release already exists on `microsoft/fast`, independent of the
 * `NeedsRelease` variable computed earlier.
 *
 * `.ado/pipelines/azure-pipelines-cd.yml`'s `PublishGitHub` job runs
 * `GitHubRelease@1` with `action: create` and `tagSource: userSpecifiedTag`.
 * If that job partially fails (e.g. one package's `GitHubRelease@1` task
 * succeeds after another already succeeded) and a maintainer reruns the
 * failed job, Azure Pipelines reruns every task in the job, including the
 * `GitHubRelease@1` tasks that already succeeded — which would fail trying
 * to recreate a release that already exists.
 *
 * This script's `${prefix}GitHubReleaseExists` output lets each
 * `GitHubRelease@1` task's condition skip packages whose release is already
 * on GitHub, so rerunning the job is safe.
 *
 * Uses Node 22's global fetch to query the public GitHub REST API, avoiding
 * authentication requirements and gh CLI dependencies.
 *
 * Usage: node build/scripts/check-github-releases.mjs <path-to-manifest.json>
 */

import { readFileSync } from "node:fs";

const manifestPath = process.argv[2];
if (!manifestPath) {
    console.error("Usage: check-github-releases.mjs <path-to-manifest.json>");
    process.exit(1);
}

function setAzureOutput(name, value) {
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${value}`);
}

async function githubReleaseExists(tag) {
    const encodedTag = encodeURIComponent(tag);
    const url = `https://api.github.com/repos/microsoft/fast/releases/tags/${encodedTag}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/vnd.github+json",
                "User-Agent": "FAST-CD-Pipeline",
            },
        });

        // 200 = release exists
        if (response.status === 200) {
            try {
                const data = await response.json();
                if (!data || typeof data !== "object") {
                    throw new Error("Response is not a valid release object");
                }
                return true;
            } catch (parseError) {
                console.error(
                    `##vso[task.logissue type=error]Failed to parse GitHub API response for ${tag}: ${parseError.message}`,
                );
                process.exit(1);
            }
        }

        // 404 = release does not exist
        if (response.status === 404) {
            return false;
        }

        // Rate limiting or other API error
        if (response.status === 403) {
            const remaining = response.headers.get("x-ratelimit-remaining");
            const reset = response.headers.get("x-ratelimit-reset");
            const resetDate = reset ? new Date(parseInt(reset, 10) * 1000) : "unknown";
            console.error(
                `##vso[task.logissue type=error]GitHub API rate limit exceeded. Remaining: ${remaining}, resets at: ${resetDate}`,
            );
            process.exit(1);
        }

        // Any other HTTP error
        const errorText = await response.text().catch(() => "(empty response)");
        console.error(
            `##vso[task.logissue type=error]GitHub API error (${response.status}) for ${tag}: ${errorText}`,
        );
        process.exit(1);
    } catch (error) {
        // Network error, timeout, or fetch failure
        console.error(
            `##vso[task.logissue type=error]Failed to check GitHub release ${tag}: ${error.message}`,
        );
        process.exit(1);
    }
}

async function main() {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

    for (const { name, tag, prefix } of manifest.packages || []) {
        const exists = await githubReleaseExists(tag);
        console.log(
            `${name}: ${tag} ${exists ? "already has GitHub Release" : "GitHub Release not yet created"}`,
        );
        setAzureOutput(`${prefix}GitHubReleaseExists`, exists ? "true" : "false");
    }
}

main().catch(error => {
    console.error(`##vso[task.logissue type=error]Unexpected error: ${error.message}`);
    process.exit(1);
});
