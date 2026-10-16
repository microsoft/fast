import { strict as assert } from "node:assert";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { basename, join } from "node:path";
import { setTimeout } from "node:timers/promises";
import { compareReleaseVersions, parseReleaseVersion } from "./release-metadata.mjs";

async function registryJson(url, fetcher) {
    const response = await fetcher(url, {
        headers: {
            "User-Agent": "FAST hotfix pipeline (https://github.com/microsoft/fast)",
        },
        signal: AbortSignal.timeout(30_000),
    });
    if (response.status === 404) return null;
    assert(response.ok, `Registry request failed (${response.status}): ${url}`);
    return response.json();
}

function npmUrl(name) {
    return `https://registry.npmjs.org/${name.replace("/", "%2f")}`;
}

async function publishedArtifact(artifact, fetcher) {
    const url =
        artifact.kind === "npm"
            ? `${npmUrl(artifact.name)}/${artifact.version}`
            : `https://crates.io/api/v1/crates/${artifact.name}/${artifact.version}`;
    const pkg = await registryJson(url, fetcher);
    if (!pkg) return false;
    const checksum =
        artifact.kind === "npm" ? pkg.dist?.integrity : pkg.version?.checksum;
    assert(
        checksum === (artifact.kind === "npm" ? artifact.integrity : artifact.sha256),
        `Published bytes differ for ${artifact.name}@${artifact.version}; refusing to overwrite.`,
    );
    return true;
}

async function distTags(manifest, fetcher) {
    const url = `https://registry.npmjs.org/-/package/${manifest.packageName.replace("/", "%2f")}/dist-tags`;
    const tags = await registryJson(url, fetcher);
    assert(tags && typeof tags === "object", "The base npm package must already exist.");
    assert(
        tags.latest !== manifest.version,
        "The hotfix unexpectedly owns npm latest; stop and investigate before marking deployed.",
    );
    const channel = tags[manifest.npmDistTag];
    if (channel !== undefined) {
        const before = parseReleaseVersion(channel);
        const after = parseReleaseVersion(manifest.version);
        assert(
            before.major === after.major && before.minor === after.minor,
            "The hotfix channel points outside its maintenance line.",
        );
    }
    return channel;
}

export async function preparePublication(manifest, root, fetcher = fetch) {
    const npmRoot = join(root, "pending_npm");
    const cratesRoot = join(root, "pending_crates");
    assert(
        !existsSync(npmRoot) && !existsSync(cratesRoot),
        "Pending-publication directories must be new; retry the job with the original artifact.",
    );
    const channel = await distTags(manifest, fetcher);
    const pending = [];
    for (const artifact of manifest.artifacts) {
        const published = await publishedArtifact(artifact, fetcher);
        console.log(
            `${artifact.name}@${artifact.version}: ${published ? "matching published bytes; skip" : "not published"}`,
        );
        if (!published) pending.push(artifact);
        if (artifact.kind === "npm") {
            if (published) {
                assert(
                    channel && compareReleaseVersions(channel, manifest.version) >= 0,
                    "Published hotfix bytes have no matching or newer maintenance channel.",
                );
            } else {
                assert(
                    !channel || compareReleaseVersions(channel, manifest.version) <= 0,
                    "Refusing to move the maintenance channel backwards.",
                );
            }
        }
    }
    for (const artifact of pending) {
        const directory = artifact.kind === "npm" ? npmRoot : cratesRoot;
        mkdirSync(directory, { recursive: true });
        copyFileSync(join(root, artifact.file), join(directory, basename(artifact.file)));
    }
    return {
        npm: pending.some(artifact => artifact.kind === "npm"),
        crates: pending.some(artifact => artifact.kind === "crate"),
    };
}

export async function verifyPublication(
    manifest,
    { fetcher = fetch, attempts = 12, delay = 10_000 } = {},
) {
    for (let attempt = 1; attempt <= attempts; attempt++) {
        let complete = true;
        for (const artifact of manifest.artifacts) {
            if (!(await publishedArtifact(artifact, fetcher))) complete = false;
        }
        const channel = await distTags(manifest, fetcher);
        if (
            complete &&
            channel &&
            compareReleaseVersions(channel, manifest.version) >= 0
        ) {
            console.log(
                "All hotfix registry bytes and the maintenance channel verified.",
            );
            return;
        }
        console.log(`Hotfix publication is not yet visible (${attempt}/${attempts}).`);
        if (attempt < attempts) await setTimeout(delay);
    }
    throw new Error(
        "Publication could not be verified; no deployment marker will be written.",
    );
}
