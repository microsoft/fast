import { strict as assert } from "node:assert";
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
    const data = await response.json();
    assert(
        data && typeof data === "object" && !Array.isArray(data),
        `Invalid registry metadata: ${url}`,
    );
    return data;
}

function artifactUrl(artifact) {
    const registry =
        artifact.kind === "npm"
            ? "https://registry.npmjs.org"
            : "https://crates.io/api/v1/crates";
    return `${registry}/${encodeURIComponent(artifact.name)}/${artifact.version}`;
}

async function distTags(manifest, fetcher) {
    const url = `https://registry.npmjs.org/-/package/${encodeURIComponent(manifest.packageName)}/dist-tags`;
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

export async function preparePublication(manifest, fetcher = fetch) {
    const channel = await distTags(manifest, fetcher);
    assert(
        !channel || compareReleaseVersions(channel, manifest.version) <= 0,
        "Refusing to move the maintenance channel backwards.",
    );
    for (const artifact of manifest.artifacts) {
        assert(
            (await registryJson(artifactUrl(artifact), fetcher)) === null,
            `${artifact.name}@${artifact.version} is already published; stop for manual recovery.`,
        );
    }
    console.log("Selected npm and crate versions are unused; publication may proceed.");
}

export async function verifyPublication(
    manifest,
    { fetcher = fetch, attempts = 12, delay = 10_000 } = {},
) {
    for (let attempt = 1; attempt <= attempts; attempt++) {
        let complete = true;
        for (const artifact of manifest.artifacts) {
            const pkg = await registryJson(artifactUrl(artifact), fetcher);
            if (!pkg) {
                complete = false;
                continue;
            }
            assert(
                (artifact.kind === "npm"
                    ? pkg.dist?.integrity
                    : pkg.version?.checksum) ===
                    (artifact.kind === "npm" ? artifact.integrity : artifact.sha256),
                `Published bytes differ for ${artifact.name}@${artifact.version}.`,
            );
        }
        const channel = await distTags(manifest, fetcher);
        if (complete && channel === manifest.version) {
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
