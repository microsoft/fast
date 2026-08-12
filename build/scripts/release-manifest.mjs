import { createHash } from "node:crypto";
import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const releaseManifestSchemaVersion = 1;
export const noCratesPlaceholder = ".no-crates-packed";

const commitPattern = /^[0-9a-f]{40}$/;
const hashPattern = /^[0-9a-f]{64}$/;
const sourceBranchPattern = /^refs\/heads\/[^\s]+$/;
const outputPrefixPattern = /^[a-z][A-Za-z0-9]*$/;
const npmFileNamePattern = /^[A-Za-z0-9][A-Za-z0-9._+-]*\.tgz$/;
const crateFileNamePattern = /^[A-Za-z0-9][A-Za-z0-9._+-]*\.crate$/;

export function sha256File(path) {
    return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function createReleaseAsset(fileName, path) {
    return {
        fileName,
        sha256: sha256File(path),
    };
}

export function validateNpmAssetFileName(fileName) {
    if (typeof fileName !== "string" || !npmFileNamePattern.test(fileName)) {
        throw new Error(`Unsafe npm asset fileName: ${String(fileName)}.`);
    }
    return fileName;
}

function fail(message) {
    throw new Error(`Invalid release manifest: ${message}`);
}

function requireExactKeys(value, expectedKeys, description) {
    const actualKeys = Object.keys(value).sort();
    const sortedExpectedKeys = [...expectedKeys].sort();
    if (
        actualKeys.length !== sortedExpectedKeys.length ||
        actualKeys.some((key, index) => key !== sortedExpectedKeys[index])
    ) {
        fail(`${description} must contain exactly: ${sortedExpectedKeys.join(", ")}.`);
    }
}

function requireString(value, description) {
    if (typeof value !== "string" || value.length === 0) {
        fail(`${description} must be a non-empty string.`);
    }
}

function validateAsset(asset, description, assetNames, fileNamePattern) {
    if (!asset || typeof asset !== "object" || Array.isArray(asset)) {
        fail(`${description} must be an object.`);
    }
    requireExactKeys(asset, ["fileName", "sha256"], description);

    requireString(asset.fileName, `${description}.fileName`);
    if (asset.fileName === noCratesPlaceholder || !fileNamePattern.test(asset.fileName)) {
        fail(`${description}.fileName is unsafe or has the wrong extension.`);
    }
    if (!hashPattern.test(asset.sha256 || "")) {
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
    requireExactKeys(
        manifest,
        ["schemaVersion", "sourceCommit", "sourceBranch", "validationMode", "packages"],
        "root",
    );
    if (manifest.schemaVersion !== releaseManifestSchemaVersion) {
        fail(
            `unsupported schemaVersion ${JSON.stringify(manifest.schemaVersion)}; ` +
                `expected ${releaseManifestSchemaVersion}.`,
        );
    }
    if (!commitPattern.test(manifest.sourceCommit || "")) {
        fail("sourceCommit must be a lowercase 40-character Git SHA.");
    }
    if (!sourceBranchPattern.test(manifest.sourceBranch || "")) {
        fail("sourceBranch must be a full refs/heads/* branch ref.");
    }
    if (typeof manifest.validationMode !== "boolean") {
        fail("validationMode must be a boolean.");
    }
    if (!Array.isArray(manifest.packages)) {
        fail("packages must be an array.");
    }

    const packageNames = new Set();
    const tags = new Set();
    const outputPrefixes = new Set();
    const assetNames = new Set();
    for (const [index, pkg] of manifest.packages.entries()) {
        const description = `packages[${index}]`;
        if (!pkg || typeof pkg !== "object" || Array.isArray(pkg)) {
            fail(`${description} must be an object.`);
        }
        requireExactKeys(
            pkg,
            ["name", "version", "tag", "outputPrefix", "npmAsset", "crateAssets"],
            description,
        );
        for (const field of ["name", "version", "tag", "outputPrefix"]) {
            requireString(pkg[field], `${description}.${field}`);
        }
        if (!outputPrefixPattern.test(pkg.outputPrefix)) {
            fail(`${description}.outputPrefix is invalid.`);
        }
        if (packageNames.has(pkg.name)) {
            fail(`package name is duplicated: ${pkg.name}`);
        }
        if (tags.has(pkg.tag)) {
            fail(`package tag is duplicated: ${pkg.tag}`);
        }
        if (outputPrefixes.has(pkg.outputPrefix)) {
            fail(`package outputPrefix is duplicated: ${pkg.outputPrefix}`);
        }
        packageNames.add(pkg.name);
        tags.add(pkg.tag);
        outputPrefixes.add(pkg.outputPrefix);

        const expectedTag = `${pkg.name}_v${pkg.version}`;
        if (pkg.tag !== expectedTag) {
            fail(`${description}.tag must be ${expectedTag}, got ${pkg.tag}.`);
        }

        validateAsset(
            pkg.npmAsset,
            `${description}.npmAsset`,
            assetNames,
            npmFileNamePattern,
        );
        if (!Array.isArray(pkg.crateAssets)) {
            fail(`${description}.crateAssets must be an array.`);
        }
        for (const [assetIndex, asset] of pkg.crateAssets.entries()) {
            validateAsset(
                asset,
                `${description}.crateAssets[${assetIndex}]`,
                assetNames,
                crateFileNamePattern,
            );
        }
    }

    return manifest;
}

export function createReleaseManifest({
    packages,
    sourceBranch,
    sourceCommit,
    validationMode,
}) {
    return validateReleaseManifestStructure({
        schemaVersion: releaseManifestSchemaVersion,
        sourceCommit,
        sourceBranch,
        validationMode,
        packages,
    });
}

export function validateReleaseManifestPackages(manifest, workspaces) {
    validateReleaseManifestStructure(manifest);
    if (manifest.packages.length === 0) {
        fail("packages must be a non-empty array.");
    }

    const workspaceByName = new Map(
        workspaces.map(workspace => [workspace.name, workspace]),
    );
    for (const pkg of manifest.packages) {
        const workspace = workspaceByName.get(pkg.name);
        if (!workspace) {
            fail(`unknown publishable workspace: ${pkg.name}.`);
        }
        if (
            pkg.version !== workspace.version ||
            pkg.tag !== workspace.tag ||
            pkg.outputPrefix !== workspace.outputPrefix
        ) {
            fail(`${pkg.name} does not match the current workspace definition.`);
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
    expectedSourceCommit,
    expectedSourceBranch,
    expectedValidationMode,
    workspaces,
    npmDirectory,
    crateDirectory,
}) {
    validateReleaseManifestPackages(manifest, workspaces);

    if (!commitPattern.test(expectedSourceCommit || "")) {
        fail("the selected pipeline resource sourceCommit is not a valid Git SHA.");
    }
    if (!sourceBranchPattern.test(expectedSourceBranch || "")) {
        fail("the selected pipeline resource sourceBranch is not a branch ref.");
    }
    if (manifest.sourceCommit !== expectedSourceCommit) {
        fail(
            `sourceCommit ${manifest.sourceCommit} does not match selected pipeline ` +
                `resource sourceCommit ${expectedSourceCommit}.`,
        );
    }
    if (manifest.sourceBranch !== expectedSourceBranch) {
        fail(
            `sourceBranch ${manifest.sourceBranch} does not match selected pipeline ` +
                `resource sourceBranch ${expectedSourceBranch}.`,
        );
    }
    if (expectedValidationMode !== "true" && expectedValidationMode !== "false") {
        fail(
            'expectedValidationMode must be "true" or "false", got ' +
                `${JSON.stringify(expectedValidationMode)}.`,
        );
    }
    if (manifest.validationMode !== (expectedValidationMode === "true")) {
        fail(
            `manifest validationMode ${manifest.validationMode} does not match ` +
                `expectedValidationMode ${expectedValidationMode}.`,
        );
    }
    if (!manifest.validationMode && manifest.sourceBranch !== "refs/heads/main") {
        fail(
            `production releases require sourceBranch refs/heads/main, got ` +
                `${JSON.stringify(manifest.sourceBranch)}.`,
        );
    }

    const npmAssets = manifest.packages.map(pkg => pkg.npmAsset);
    const crateAssets = manifest.packages.flatMap(pkg => pkg.crateAssets);
    validateArtifactDirectory(npmDirectory, npmAssets, false);
    validateArtifactDirectory(crateDirectory, crateAssets, crateAssets.length === 0);

    return manifest;
}
