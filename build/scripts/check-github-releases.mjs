#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateReleaseManifestPackages } from "./release-manifest.mjs";
import { listPublishableWorkspaces } from "./release-workspaces.mjs";

const defaultRepository = "microsoft/fast";
const apiTimeoutMs = 10000;
const apiMaxAttempts = 3;
const apiRetryDelayMs = 1000;

function selectedReleaseChecks(manifest, workspaces) {
    validateReleaseManifestPackages(manifest, workspaces);

    return manifest.packages.map(pkg => ({
        assetNames: [
            pkg.npmAsset.fileName,
            ...pkg.crateAssets.map(asset => asset.fileName),
        ],
        name: pkg.name,
        outputName: `${pkg.outputPrefix}GitHubReleaseExists`,
        tag: pkg.tag,
    }));
}

async function githubReleaseExists(
    tag,
    {
        fetchImpl = globalThis.fetch,
        maxAttempts = apiMaxAttempts,
        repository = defaultRepository,
        requiredAssetNames = [],
        retryDelayMs = apiRetryDelayMs,
        sleep = delay => new Promise(resolvePromise => setTimeout(resolvePromise, delay)),
        timeoutMs = apiTimeoutMs,
    } = {},
) {
    if (!Number.isSafeInteger(maxAttempts) || maxAttempts < 1) {
        throw new Error(`Invalid GitHub API maxAttempts: ${maxAttempts}.`);
    }
    if (!Array.isArray(requiredAssetNames)) {
        throw new Error("requiredAssetNames must be an array.");
    }

    const headers = {
        Accept: "application/vnd.github+json",
        "User-Agent": "FAST-CD-Pipeline",
        "X-GitHub-Api-Version": "2022-11-28",
    };

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        let response;
        try {
            response = await fetchImpl(
                `https://api.github.com/repos/${repository}/releases/tags/${encodeURIComponent(tag)}`,
                {
                    headers,
                    method: "GET",
                    signal: controller.signal,
                },
            );
        } catch (error) {
            if (attempt < maxAttempts) {
                await sleep(retryDelayMs * 2 ** (attempt - 1));
                continue;
            }
            throw new Error(
                `Failed to query GitHub Release for ${tag} after ${attempt} ` +
                    `attempt(s): ${error instanceof Error ? error.message : String(error)}`,
                { cause: error },
            );
        } finally {
            clearTimeout(timeoutId);
        }

        if (response.status === 200) {
            const release = await response.json();
            if (
                !release ||
                typeof release !== "object" ||
                release.tag_name !== tag ||
                !Array.isArray(release.assets)
            ) {
                throw new Error(
                    `GitHub Release response for ${tag} is malformed or mismatched.`,
                );
            }
            const uploadedAssets = new Set(
                release.assets.map(asset => asset?.name).filter(Boolean),
            );
            const missingAssets = requiredAssetNames.filter(
                asset => !uploadedAssets.has(asset),
            );
            if (missingAssets.length > 0) {
                throw new Error(
                    `GitHub Release ${tag} is incomplete; missing manifest assets: ` +
                        `${missingAssets.join(", ")}.`,
                );
            }
            return true;
        }
        if (response.status === 404) {
            return false;
        }

        const detail = await response.text().catch(() => "");
        const message =
            `GitHub API returned HTTP ${response.status}` +
            `${response.statusText ? ` ${response.statusText}` : ""}` +
            `${detail ? `: ${detail}` : ""}`;
        const retryable = response.status === 429 || response.status >= 500;
        if (retryable && attempt < maxAttempts) {
            await sleep(retryDelayMs * 2 ** (attempt - 1));
            continue;
        }
        throw new Error(
            `Failed to query GitHub Release for ${tag} after ${attempt} attempt(s): ` +
                message,
        );
    }

    throw new Error(`Failed to query GitHub Release for ${tag}.`);
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
        const exists = await releaseExists(release.tag, {
            requiredAssetNames: release.assetNames,
        });
        emitOutput(release.outputName, exists ? "true" : "false");
        log(
            `${release.name}: ${release.tag} ${
                exists
                    ? "has a complete GitHub Release"
                    : "does not have a GitHub Release"
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
