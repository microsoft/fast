#!/usr/bin/env node
/**
 * Create one GitHub release per packed tarball.
 *
 * Invoked by `.github/workflows/cd-github-releases.yml` after `npm run
 * publish-ci` has bumped versions, committed, pushed git tags, and packed
 * tarballs into `publish_artifacts/`. For each tarball we:
 *
 *   1. Read the package's name and version from the embedded package.json
 *      (via `tar`).
 *   2. Use the beachball tag format `${name}_v${version}` so the GitHub
 *      release tag matches the git tag beachball already created (see
 *      beachball's generateTag.js).
 *   3. Skip if a release with that tag already exists (idempotent).
 *   4. Otherwise create the release and upload the tarball as its asset.
 *
 * Authentication: the `gh` CLI reads `GH_TOKEN` from the environment.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

const PUBLISH_DIR = "publish_artifacts";

function run(file, args, opts = {}) {
    return execFileSync(file, args, { encoding: "utf8", ...opts });
}

function exists(file, args) {
    try {
        execFileSync(file, args, { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

if (!existsSync(PUBLISH_DIR)) {
    console.log(`No ${PUBLISH_DIR}/ directory; nothing to release.`);
    process.exit(0);
}

const tarballs = readdirSync(PUBLISH_DIR)
    .filter(f => f.endsWith(".tgz"))
    .sort()
    .map(f => join(PUBLISH_DIR, f));

if (tarballs.length === 0) {
    console.log(`No tarballs found in ${PUBLISH_DIR}; nothing to release.`);
    process.exit(0);
}

let hasErrors = false;

for (const tarball of tarballs) {
    try {
        const pkgJson = run("tar", ["-O", "-xzf", tarball, "package/package.json"]);
        const { name, version } = JSON.parse(pkgJson);
        const tag = `${name}_v${version}`;

        if (exists("gh", ["release", "view", tag, "--json", "id"])) {
            console.log(`Skipping ${name}@${version}: release already exists`);
            continue;
        }

        const notes = [
            `Nightly release for \`${name}@${version}\`.`,
            "",
            "The attached tarball will be published to npm by the nightly Azure release pipeline.",
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

        console.log(`Created release ${tag} with asset ${basename(tarball)}`);
    } catch (error) {
        hasErrors = true;
        console.error(`Failed to release ${tarball}:`, error.message);
    }
}

if (hasErrors) {
    process.exitCode = 1;
}
