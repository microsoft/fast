#!/usr/bin/env node
/**
 * Download unpublished GitHub release tarballs for the Azure npm publish stage.
 *
 * `azure-pipelines-cd.yml` invokes this script after `npm ci` and before the
 * `FAST.Release.PipelineTemplate.yml@fastPipelines` template. The script lists
 * GitHub releases for the configured repository, selects beachball-style tags,
 * skips package versions that already exist on npm, and downloads each attached
 * `.tgz` release asset into `publish_artifacts/` for the Azure-owned npm
 * publishing template to consume.
 */

import { resolve } from "node:path";
import {
    downloadReleaseAsset,
    isPublishedToNpm,
    listAllReleases,
    PUBLISH_ARTIFACTS_DIR,
    parseReleaseTag,
    resolveRepository,
    resolveToken,
} from "./release-utils.mjs";

/**
 * @param {unknown} error
 * @returns {string}
 */
function formatError(error) {
    if (error instanceof Error) {
        return error.stack || error.message;
    }
    return String(error);
}

async function main() {
    const { owner, repo } = resolveRepository();
    const token = resolveToken();
    const releases = await listAllReleases({ token, owner, repo });

    let downloadedTarballs = 0;
    let hadError = false;
    const downloadedReleaseTags = new Set();

    for (const release of releases) {
        const tag = release?.tag_name;
        if (typeof tag !== "string") {
            console.debug("Skipping release without a string tag_name.");
            continue;
        }

        const parsed = parseReleaseTag(tag);
        if (!parsed) {
            console.debug(`Skipping non-beachball release tag: ${tag}`);
            continue;
        }

        const { packageName, version } = parsed;

        try {
            if (isPublishedToNpm(packageName, version)) {
                console.log(`Already on npm: ${packageName}@${version}`);
                continue;
            }

            const tgzAssets = (
                Array.isArray(release.assets) ? release.assets : []
            ).filter(
                asset => typeof asset?.name === "string" && asset.name.endsWith(".tgz"),
            );

            if (tgzAssets.length === 0) {
                console.warn(
                    `No .tgz assets found for ${packageName}@${version} (${tag}).`,
                );
                continue;
            }

            for (const asset of tgzAssets) {
                try {
                    const destPath = resolve(
                        process.cwd(),
                        PUBLISH_ARTIFACTS_DIR,
                        asset.name,
                    );
                    await downloadReleaseAsset({
                        token,
                        owner,
                        repo,
                        assetId: asset.id,
                        destPath,
                    });
                    downloadedTarballs += 1;
                    downloadedReleaseTags.add(tag);
                    console.log(`Downloaded ${packageName}@${version}: ${destPath}`);
                } catch (error) {
                    hadError = true;
                    console.error(
                        `Failed to download asset ${asset.name} for ${packageName}@${version}: ${formatError(error)}`,
                    );
                }
            }
        } catch (error) {
            hadError = true;
            console.error(`Failed to process release ${tag}: ${formatError(error)}`);
        }
    }

    console.log(
        `Downloaded ${downloadedTarballs} tarballs for ${downloadedReleaseTags.size} releases.`,
    );

    if (downloadedTarballs === 0 && !hadError) {
        console.log(
            "No new releases to publish — all GitHub releases already match versions on npm.",
        );
    }

    if (hadError) {
        process.exitCode = 1;
    }
}

await main();
