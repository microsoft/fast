import { createHash } from "node:crypto";
import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

export const releaseManifestSchemaVersion = 1;
export const noCratesPlaceholder = ".no-crates-packed";

export function sha256File(path) {
    return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function createReleaseAsset(fileName, path) {
    return {
        fileName,
        sha256: sha256File(path),
    };
}

function fail(message) {
    throw new Error(`Invalid release manifest: ${message}`);
}

function requireString(value, description) {
    if (typeof value !== "string" || value.length === 0) {
        fail(`${description} must be a non-empty string.`);
    }
}

function validateAsset(asset, description, assetNames) {
    if (!asset || typeof asset !== "object" || Array.isArray(asset)) {
        fail(`${description} must be an object.`);
    }

    requireString(asset.fileName, `${description}.fileName`);
    if (asset.fileName === noCratesPlaceholder) {
        fail(`${noCratesPlaceholder} cannot be a manifest asset.`);
    }
    if (
        asset.fileName === "." ||
        asset.fileName === ".." ||
        basename(asset.fileName) !== asset.fileName ||
        !/^[A-Za-z0-9][A-Za-z0-9._+-]*$/.test(asset.fileName)
    ) {
        fail(`${description}.fileName must be a safe basename: ${asset.fileName}`);
    }
    if (!/^[0-9a-f]{64}$/.test(asset.sha256 || "")) {
        fail(`${description}.sha256 must be a lowercase SHA-256 hash.`);
    }
    if (assetNames.has(asset.fileName)) {
        fail(`asset filename is duplicated: ${asset.fileName}`);
    }
    assetNames.add(asset.fileName);
}

export function validateReleaseManifestStructure(manifest) {
    if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
        fail("root must be an object.");
    }
    if (manifest.schemaVersion !== releaseManifestSchemaVersion) {
        fail(
            `unsupported schemaVersion ${JSON.stringify(manifest.schemaVersion)}; ` +
                `expected ${releaseManifestSchemaVersion}.`,
        );
    }
    if (!/^[0-9a-f]{40}$/.test(manifest.releaseCommit || "")) {
        fail(`releaseCommit must be a lowercase 40-character Git SHA.`);
    }
    if (!Array.isArray(manifest.packages) || manifest.packages.length === 0) {
        fail("packages must be a non-empty array.");
    }

    const packageNames = new Set();
    const assetNames = new Set();
    for (const [index, pkg] of manifest.packages.entries()) {
        const description = `packages[${index}]`;
        if (!pkg || typeof pkg !== "object" || Array.isArray(pkg)) {
            fail(`${description} must be an object.`);
        }
        for (const field of ["name", "version", "tag", "prefix"]) {
            requireString(pkg[field], `${description}.${field}`);
        }
        if (packageNames.has(pkg.name)) {
            fail(`package name is duplicated: ${pkg.name}`);
        }
        packageNames.add(pkg.name);
        const expectedTag = `${pkg.name}_v${pkg.version}`;
        if (pkg.tag !== expectedTag) {
            fail(`${description}.tag must be ${expectedTag}, got ${pkg.tag}.`);
        }

        validateAsset(pkg.npmAsset, `${description}.npmAsset`, assetNames);
        if (!Array.isArray(pkg.crateAssets)) {
            fail(`${description}.crateAssets must be an array.`);
        }
        for (const [assetIndex, asset] of pkg.crateAssets.entries()) {
            validateAsset(asset, `${description}.crateAssets[${assetIndex}]`, assetNames);
        }
    }

    return manifest;
}

function validateArtifactDirectory(directory, expectedAssets, allowPlaceholder) {
    const expectedNames = new Set(expectedAssets.map(asset => asset.fileName));
    const entries = readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
        if (allowPlaceholder && entry.name === noCratesPlaceholder && entry.isFile()) {
            continue;
        }
        if (!entry.isFile() || !expectedNames.has(entry.name)) {
            fail(`unexpected artifact in ${directory}: ${entry.name}`);
        }
    }

    for (const asset of expectedAssets) {
        const path = join(directory, asset.fileName);
        let stat;
        try {
            stat = lstatSync(path);
        } catch {
            fail(`required artifact is missing: ${path}`);
        }
        if (!stat.isFile()) {
            fail(`required artifact is not a regular file: ${path}`);
        }
        const actualHash = sha256File(path);
        if (actualHash !== asset.sha256) {
            fail(
                `SHA-256 mismatch for ${path}: expected ${asset.sha256}, got ${actualHash}.`,
            );
        }
    }
}

export function validateReleaseArtifacts({
    manifest,
    expectedReleaseCommit,
    sourceBranch,
    validationMode,
    npmDirectory,
    crateDirectory,
}) {
    validateReleaseManifestStructure(manifest);

    if (!/^[0-9a-f]{40}$/.test(expectedReleaseCommit || "")) {
        fail("the selected pipeline resource sourceCommit is not a valid Git SHA.");
    }
    if (manifest.releaseCommit !== expectedReleaseCommit) {
        fail(
            `releaseCommit ${manifest.releaseCommit} does not match selected pipeline ` +
                `resource sourceCommit ${expectedReleaseCommit}.`,
        );
    }
    if (validationMode !== "true" && validationMode !== "false") {
        fail(
            `validationMode must be "true" or "false", got ${JSON.stringify(validationMode)}.`,
        );
    }
    if (validationMode === "false" && sourceBranch !== "refs/heads/main") {
        fail(
            `production releases require sourceBranch refs/heads/main, got ` +
                `${JSON.stringify(sourceBranch)}.`,
        );
    }

    const npmAssets = manifest.packages.map(pkg => pkg.npmAsset);
    const crateAssets = manifest.packages.flatMap(pkg => pkg.crateAssets);
    validateArtifactDirectory(npmDirectory, npmAssets, false);
    validateArtifactDirectory(crateDirectory, crateAssets, crateAssets.length === 0);

    return manifest;
}
