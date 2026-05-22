#!/usr/bin/env node
/**
 * Download GitHub release tarballs whose `${name}@${version}` has not yet
 * been published to npm.
 *
 * Invoked by `azure-pipelines-cd.yml` before the existing
 * `FAST.Release.PipelineTemplate` publishes from `publish_artifacts/`. For
 * every GitHub release in `$GITHUB_REPOSITORY` whose tag matches beachball's
 * `${name}_v${version}` format, we ask npm whether that exact version is
 * already published. Anything missing has its `.tgz` assets downloaded into
 * `publish_artifacts/` so the downstream 1ES template can `npm publish` them.
 *
 * Authentication: the `gh` CLI reads `GH_TOKEN` from the environment.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const PUBLISH_DIR = "publish_artifacts";

const repo = process.env.GITHUB_REPOSITORY;
if (!repo) {
    console.error("GITHUB_REPOSITORY must be set to owner/repo");
    process.exit(1);
}

function run(file, args, opts = {}) {
    return execFileSync(file, args, { encoding: "utf8", ...opts });
}

function isPublishedToNpm(name, version) {
    try {
        const out = execFileSync(
            "npm",
            ["view", `${name}@${version}`, "version", "--json"],
            {
                encoding: "utf8",
                stdio: ["ignore", "pipe", "ignore"],
            },
        ).trim();
        return out.length > 0;
    } catch {
        // npm view exits non-zero for E404; treat as not published.
        return false;
    }
}

mkdirSync(PUBLISH_DIR, { recursive: true });

const releasesJson = run("gh", [
    "release",
    "list",
    "--repo",
    repo,
    "--limit",
    "1000",
    "--json",
    "tagName",
]);
const tags = JSON.parse(releasesJson).map(r => r.tagName);

let downloaded = 0;
let hasErrors = false;

for (const tag of tags) {
    const sep = tag.lastIndexOf("_v");
    if (sep === -1) {
        console.log(`Skipping non-beachball release tag: ${tag}`);
        continue;
    }

    const name = tag.slice(0, sep);
    const version = tag.slice(sep + 2);

    try {
        if (isPublishedToNpm(name, version)) {
            console.log(`Already on npm: ${name}@${version}`);
            continue;
        }

        console.log(`Downloading ${name}@${version} assets...`);
        run(
            "gh",
            [
                "release",
                "download",
                tag,
                "--repo",
                repo,
                "--pattern",
                "*.tgz",
                "--dir",
                PUBLISH_DIR,
                "--clobber",
            ],
            { stdio: "inherit" },
        );
        downloaded += 1;
    } catch (error) {
        hasErrors = true;
        console.error(`Failed to process release ${tag}:`, error.message);
    }
}

if (downloaded === 0 && !hasErrors) {
    console.log(
        "No new releases to publish — all GitHub releases already match versions on npm.",
    );
} else {
    console.log(`Downloaded assets for ${downloaded} release(s).`);
}

if (hasErrors) {
    process.exitCode = 1;
}
