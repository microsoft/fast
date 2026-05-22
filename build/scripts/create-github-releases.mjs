#!/usr/bin/env node
/**
 * Create one GitHub release per non-private workspace whose
 * `${name}_v${version}` tag does not yet exist as a GitHub release.
 *
 * Invoked by `.github/workflows/cd-github-releases.yml`. The workflow does
 * NOT bump versions or commit anything — version bumps land on `main`
 * through ordinary human-authored pull requests. This script:
 *
 *   1. Lists workspaces via `npm query '.workspace' --json`.
 *   2. Skips workspaces whose package.json sets `private: true`.
 *   3. For each remaining workspace, computes
 *      `tag = ${name}_v${version}` (matching beachball's tag format).
 *   4. Skips it if a GitHub release with that tag already exists, which
 *      makes the script idempotent across re-runs.
 *   5. Otherwise packs the workspace into `publish_artifacts/` with
 *      `npm pack` and creates the release with the tarball attached.
 *
 * Authentication: the `gh` CLI reads `GH_TOKEN` from the environment.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const PUBLISH_DIR = "publish_artifacts";

function run(file, args, opts = {}) {
    return execFileSync(file, args, { encoding: "utf8", ...opts });
}

function releaseExists(tag) {
    try {
        execFileSync("gh", ["release", "view", tag, "--json", "id"], { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

mkdirSync(PUBLISH_DIR, { recursive: true });

const workspaces = JSON.parse(run("npm", ["query", ".workspace", "--json"]));
const publishable = workspaces.filter(w => w.private !== true);

if (publishable.length === 0) {
    console.log("No publishable workspaces found.");
    process.exit(0);
}

let created = 0;
let skipped = 0;
let hasErrors = false;

for (const { name, version, location } of publishable) {
    const tag = `${name}_v${version}`;

    if (releaseExists(tag)) {
        console.log(`Skipping ${name}@${version}: release already exists`);
        skipped += 1;
        continue;
    }

    try {
        console.log(`Packing ${name}@${version} from ${location}...`);
        const packJson = run("npm", [
            "pack",
            "--silent",
            "--json",
            `--workspace=${location}`,
            `--pack-destination=${resolve(PUBLISH_DIR)}`,
        ]);
        const tarball = join(PUBLISH_DIR, JSON.parse(packJson)[0].filename);

        const notes = [
            `Nightly release for \`${name}@${version}\`.`,
            "",
            "Version bumps were landed via a regular pull request. The attached tarball",
            "will be downloaded and published to npm by the nightly Azure release pipeline.",
        ].join("\n");

        run(
            "gh",
            [
                "release",
                "create",
                tag,
                tarball,
                "--title",
                `${name}@${version}`,
                "--notes",
                notes,
            ],
            { stdio: "inherit" },
        );

        console.log(`Created release ${tag}`);
        created += 1;
    } catch (error) {
        hasErrors = true;
        console.error(`Failed to release ${name}@${version}:`, error.message);
    }
}

console.log(`\nReleases created: ${created}, skipped (already exist): ${skipped}`);

if (hasErrors) {
    process.exitCode = 1;
}
