import assert from "node:assert/strict";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { formatAzureBuildNumber } from "./lib/azure-build-number.mjs";
import {
    createReleaseAsset,
    noCratesPlaceholder,
    releaseManifestSchemaVersion,
    validateReleaseArtifacts,
    validateReleaseManifestStructure,
} from "./lib/release-manifest.mjs";
import {
    assertSelectedTagsAreUnreleased,
    formatSelectedReleaseTags,
    parseSelectedReleaseTags,
    resolveSelectedReleaseWorkspaces,
} from "./lib/selected-release-tags.mjs";

const scratchRoot = join(process.cwd(), "build", "scripts", ".release-manifest-tests");
const commit = "a".repeat(40);
const workspaces = [
    { name: "@microsoft/a", tag: "@microsoft/a_v1.0.0" },
    { name: "@microsoft/b", tag: "@microsoft/b_v2.0.0" },
];

function fixture(name, { withCrate = true } = {}) {
    const root = join(scratchRoot, name);
    const npmDirectory = join(root, "npm");
    const crateDirectory = join(root, "crates");
    rmSync(root, { force: true, recursive: true });
    mkdirSync(npmDirectory, { recursive: true });
    mkdirSync(crateDirectory, { recursive: true });

    const npmFile = join(npmDirectory, "package.tgz");
    writeFileSync(npmFile, "npm contents");
    const crateAssets = [];
    if (withCrate) {
        const crateFile = join(crateDirectory, "package.crate");
        writeFileSync(crateFile, "crate contents");
        crateAssets.push(createReleaseAsset("package.crate", crateFile));
    } else {
        writeFileSync(join(crateDirectory, noCratesPlaceholder), "");
    }

    const manifest = {
        schemaVersion: releaseManifestSchemaVersion,
        releaseCommit: commit,
        packages: [
            {
                name: "@microsoft/package",
                version: "1.0.0",
                tag: "@microsoft/package_v1.0.0",
                prefix: "package",
                npmAsset: createReleaseAsset("package.tgz", npmFile),
                crateAssets,
            },
        ],
    };

    return { crateDirectory, manifest, npmDirectory, root };
}

function validate(values, overrides = {}) {
    return validateReleaseArtifacts({
        manifest: values.manifest,
        expectedReleaseCommit: commit,
        sourceBranch: "refs/heads/main",
        validationMode: "false",
        npmDirectory: values.npmDirectory,
        crateDirectory: values.crateDirectory,
        ...overrides,
    });
}

test.after(() => rmSync(scratchRoot, { force: true, recursive: true }));

test("formats build pipeline names from the selected package count", () => {
    assert.equal(formatAzureBuildNumber(0, "build", "123"), "0-build-123");
    assert.equal(formatAzureBuildNumber(4, "build", "456"), "4-build-456");
});

test("formats CD pipeline names from the manifest package count", () => {
    assert.equal(formatAzureBuildNumber(0, "cd", "789"), "0-cd-789");
    assert.equal(formatAzureBuildNumber(2, "cd", "789"), "2-cd-789");
});

test("validates exact npm and crate assets", () => {
    const values = fixture("valid");
    assert.equal(validate(values), values.manifest);
});

test("accepts the crate placeholder only for a release with no crate assets", () => {
    const values = fixture("no-crates", { withCrate: false });
    assert.equal(validate(values), values.manifest);

    rmSync(join(values.crateDirectory, noCratesPlaceholder));
    assert.equal(validate(values), values.manifest);

    writeFileSync(join(values.npmDirectory, noCratesPlaceholder), "");
    assert.throws(() => validate(values), /unexpected artifact/);
});

test("rejects unsupported schemas and malformed commits", () => {
    const values = fixture("schema");
    assert.throws(
        () =>
            validateReleaseManifestStructure({
                ...values.manifest,
                schemaVersion: 2,
            }),
        /unsupported schemaVersion/,
    );
    assert.throws(
        () =>
            validateReleaseManifestStructure({
                ...values.manifest,
                releaseCommit: "not-a-sha",
            }),
        /releaseCommit/,
    );
});

test("rejects empty package lists, duplicate packages, and malformed hashes", () => {
    const empty = fixture("empty");
    empty.manifest.packages = [];
    assert.throws(
        () => validateReleaseManifestStructure(empty.manifest),
        /non-empty array/,
    );

    const duplicate = fixture("duplicate-package");
    duplicate.manifest.packages.push(structuredClone(duplicate.manifest.packages[0]));
    assert.throws(
        () => validateReleaseManifestStructure(duplicate.manifest),
        /package name is duplicated/,
    );

    const hash = fixture("hash");
    hash.manifest.packages[0].npmAsset.sha256 = "A".repeat(64);
    assert.throws(
        () => validateReleaseManifestStructure(hash.manifest),
        /lowercase SHA-256/,
    );
});

test("rejects package tags that do not match the package name and version", () => {
    const mismatch = fixture("mismatched-tag");
    mismatch.manifest.packages[0].tag = "@microsoft/package_v2.0.0";
    assert.throws(
        () => validateReleaseManifestStructure(mismatch.manifest),
        /tag must be @microsoft\/package_v1\.0\.0/,
    );
});

test("rejects unsafe, duplicate, and placeholder asset names", () => {
    for (const fileName of [
        "../package.tgz",
        "nested/package.tgz",
        "nested\\package.tgz",
    ]) {
        const values = fixture(`unsafe-${fileName.replaceAll(/[^a-z]/g, "-")}`);
        values.manifest.packages[0].npmAsset.fileName = fileName;
        assert.throws(
            () => validateReleaseManifestStructure(values.manifest),
            /safe basename/,
        );
    }

    const duplicate = fixture("duplicate");
    duplicate.manifest.packages[0].crateAssets[0].fileName = "package.tgz";
    assert.throws(
        () => validateReleaseManifestStructure(duplicate.manifest),
        /filename is duplicated/,
    );

    const placeholder = fixture("placeholder");
    placeholder.manifest.packages[0].npmAsset.fileName = noCratesPlaceholder;
    assert.throws(
        () => validateReleaseManifestStructure(placeholder.manifest),
        /cannot be a manifest asset/,
    );
});

test("rejects missing, modified, and unexpected files", () => {
    const missing = fixture("missing");
    rmSync(join(missing.npmDirectory, "package.tgz"));
    assert.throws(() => validate(missing), /required artifact is missing/);

    const modified = fixture("modified");
    writeFileSync(join(modified.npmDirectory, "package.tgz"), "modified");
    assert.throws(() => validate(modified), /SHA-256 mismatch/);

    const unexpected = fixture("unexpected");
    writeFileSync(join(unexpected.crateDirectory, "extra.crate"), "extra");
    assert.throws(() => validate(unexpected), /unexpected artifact/);

    const unexpectedDirectory = fixture("unexpected-directory");
    mkdirSync(join(unexpectedDirectory.npmDirectory, "nested"));
    assert.throws(() => validate(unexpectedDirectory), /unexpected artifact/);
});

test("rejects the no-crates placeholder when crate assets are expected", () => {
    const values = fixture("crate-placeholder");
    writeFileSync(join(values.crateDirectory, noCratesPlaceholder), "");
    assert.throws(() => validate(values), /unexpected artifact/);
});

test("binds releases to the selected pipeline resource commit and production branch", () => {
    const values = fixture("source");
    assert.throws(
        () => validate(values, { expectedReleaseCommit: "b".repeat(40) }),
        /does not match selected pipeline resource sourceCommit/,
    );
    assert.throws(
        () => validate(values, { sourceBranch: "refs/heads/feature" }),
        /production releases require sourceBranch refs\/heads\/main/,
    );
    assert.throws(
        () => validate(values, { validationMode: "yes" }),
        /validationMode must be "true" or "false"/,
    );
    assert.equal(
        validate(values, {
            sourceBranch: "refs/heads/feature",
            validationMode: "true",
        }),
        values.manifest,
    );
});

test("formats, parses, and resolves the exact selected tag order", () => {
    const value = formatSelectedReleaseTags([workspaces[1], workspaces[0]]);

    assert.equal(value, "@microsoft/b_v2.0.0,@microsoft/a_v1.0.0");
    assert.deepEqual(parseSelectedReleaseTags(value), [
        "@microsoft/b_v2.0.0",
        "@microsoft/a_v1.0.0",
    ]);
    assert.deepEqual(resolveSelectedReleaseWorkspaces(value, workspaces), [
        workspaces[1],
        workspaces[0],
    ]);
    assert.throws(
        () => formatSelectedReleaseTags([{ tag: "@microsoft/a_v1.0.0,bad" }]),
        /cannot contain commas/,
    );
});

test("rejects a missing, empty, or structurally altered selection", () => {
    assert.throws(
        () => resolveSelectedReleaseWorkspaces(undefined, workspaces),
        /is required/,
    );
    assert.throws(() => resolveSelectedReleaseWorkspaces("", workspaces), /is required/);
    assert.throws(
        () =>
            resolveSelectedReleaseWorkspaces(
                "@microsoft/a_v1.0.0, @microsoft/b_v2.0.0",
                workspaces,
            ),
        /surrounding whitespace.*indexes: 1/,
    );
    assert.throws(
        () =>
            resolveSelectedReleaseWorkspaces(
                "@microsoft/a_v1.0.0,@microsoft/b_v2.0.0,",
                workspaces,
            ),
        /empty tags.*indexes: 2/,
    );
    assert.throws(
        () => resolveSelectedReleaseWorkspaces(" @microsoft/a_v1.0.0", workspaces),
        /surrounding whitespace.*indexes: 0/,
    );
});

test("rejects duplicate, unknown, and comma-containing publishable tags", () => {
    assert.throws(
        () =>
            resolveSelectedReleaseWorkspaces(
                "@microsoft/a_v1.0.0,@microsoft/a_v1.0.0",
                workspaces,
            ),
        /duplicate tags: @microsoft\/a_v1\.0\.0/,
    );
    assert.throws(
        () =>
            resolveSelectedReleaseWorkspaces(
                "@microsoft/a_v1.0.0,@microsoft/unknown_v1.0.0",
                workspaces,
            ),
        /unknown release tags: @microsoft\/unknown_v1\.0\.0/,
    );
    assert.throws(
        () =>
            resolveSelectedReleaseWorkspaces("@microsoft/a_v1.0.0", [
                ...workspaces,
                { tag: "@microsoft/comma_v1.0.0,bad" },
            ]),
        /cannot contain commas/,
    );
});

test("reports every selected tag that appeared on the remote", () => {
    assert.throws(
        () => assertSelectedTagsAreUnreleased(workspaces, () => true),
        new RegExp(
            "Concurrent release detected.*" +
                "@microsoft/a_v1\\.0\\.0, @microsoft/b_v2\\.0\\.0.*" +
                "Refusing to shrink or alter",
        ),
    );

    assert.doesNotThrow(() => assertSelectedTagsAreUnreleased(workspaces, () => false));
});
