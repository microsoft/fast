import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import {
    checkGitHubReleases,
    githubReleaseExists,
    selectedReleaseChecks,
} from "./check-github-releases.mjs";
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
import { createReleaseTags, markReleaseTagsDeployed } from "./manage-release-tags.mjs";

const scratchRoot = join(process.cwd(), "build", "scripts", ".release-manifest-tests");
const commit = "a".repeat(40);
const workspaces = [
    { name: "@microsoft/a", prefix: "a", tag: "@microsoft/a_v1.0.0" },
    { name: "@microsoft/b", prefix: "b", tag: "@microsoft/b_v2.0.0" },
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
        validationMode: false,
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
        expectedValidationMode: "false",
        sourceBranch: "refs/heads/main",
        workspaces: [
            {
                name: "@microsoft/package",
                prefix: "package",
                tag: "@microsoft/package_v1.0.0",
                version: "1.0.0",
            },
        ],
        npmDirectory: values.npmDirectory,
        crateDirectory: values.crateDirectory,
        ...overrides,
    });
}

function createGitHarness(initialRemoteTags = {}, raceOnPush = {}) {
    const commands = [];
    const localRefs = new Map();
    const localTags = new Map();
    const remoteTags = new Map(Object.entries(initialRemoteTags));
    const racedTags = new Set();

    function git(args, { allowMissing = false } = {}) {
        commands.push(args);
        const [command, ...rest] = args;

        if (command === "check-ref-format" || command === "config") {
            return "";
        }
        if (command === "ls-remote") {
            const tag = rest[2].replace("refs/tags/", "");
            if (remoteTags.has(tag)) {
                return `${remoteTags.get(tag)}\trefs/tags/${tag}\n`;
            }
            if (allowMissing) {
                return null;
            }
            throw new Error(`Missing remote tag ${tag}`);
        }
        if (command === "fetch" && rest[0] === "--no-tags") {
            return "";
        }
        if (command === "fetch" && rest[0] === "--force") {
            const [source, destination] = rest[2].split(":");
            const tag = source.replace("refs/tags/", "");
            localRefs.set(destination, remoteTags.get(tag));
            return "";
        }
        if (command === "rev-parse") {
            const ref = rest[0].replace(/\^\{\}$/, "");
            return `${localRefs.get(ref) ?? localTags.get(ref)}\n`;
        }
        if (command === "tag") {
            if (rest[0] === "-a") {
                localTags.set(`refs/tags/${rest[1]}`, rest[2]);
            } else {
                localTags.set(
                    `refs/tags/${rest[0]}`,
                    localRefs.get(rest[1]) ?? localTags.get(rest[1]),
                );
            }
            return "";
        }
        if (command === "push") {
            const tag = rest[1].replace("refs/tags/", "");
            if (raceOnPush[tag] && !racedTags.has(tag)) {
                remoteTags.set(tag, raceOnPush[tag]);
                racedTags.add(tag);
                throw new Error(`Push race for ${tag}`);
            }
            remoteTags.set(tag, localTags.get(rest[1]));
            return "";
        }

        throw new Error(`Unexpected git command: ${args.join(" ")}`);
    }

    return { commands, git, remoteTags };
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
    assert.throws(
        () =>
            validateReleaseManifestStructure({
                ...values.manifest,
                validationMode: "false",
            }),
        /validationMode must be a boolean/,
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
        () => validate(values, { expectedValidationMode: "yes" }),
        /expectedValidationMode must be "true" or "false"/,
    );
    assert.throws(
        () => validate(values, { expectedValidationMode: "true" }),
        /manifest validationMode false does not match expectedValidationMode true/,
    );
    values.manifest.validationMode = true;
    assert.equal(
        validate(values, {
            sourceBranch: "refs/heads/feature",
            expectedValidationMode: "true",
        }),
        values.manifest,
    );
});

test("binds manifest packages to current publishable workspaces", () => {
    const values = fixture("workspaces");
    assert.throws(
        () => validate(values, { workspaces: [] }),
        /unknown publishable workspace/,
    );
    assert.throws(
        () =>
            validate(values, {
                workspaces: [
                    {
                        name: "@microsoft/package",
                        prefix: "different",
                        tag: "@microsoft/package_v1.0.0",
                        version: "1.0.0",
                    },
                ],
            }),
        /does not match the current workspace definition/,
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

test("maps selected manifest packages to GitHub release output names", () => {
    assert.deepEqual(
        selectedReleaseChecks(
            {
                packages: [
                    { name: workspaces[1].name, tag: workspaces[1].tag },
                    { name: workspaces[0].name, tag: workspaces[0].tag },
                ],
            },
            workspaces,
        ),
        [
            {
                name: workspaces[1].name,
                outputName: "bGitHubReleaseExists",
                tag: workspaces[1].tag,
            },
            {
                name: workspaces[0].name,
                outputName: "aGitHubReleaseExists",
                tag: workspaces[0].tag,
            },
        ],
    );
});

test("rejects unknown packages and mismatched tags during GitHub release checks", () => {
    assert.throws(
        () =>
            selectedReleaseChecks(
                { packages: [{ name: "@microsoft/unknown", tag: "unknown_v1.0.0" }] },
                workspaces,
            ),
        /unknown package/,
    );
    assert.throws(
        () =>
            selectedReleaseChecks(
                { packages: [{ name: workspaces[0].name, tag: workspaces[1].tag }] },
                workspaces,
            ),
        /does not match the workspace/,
    );
});

test("emits existing and missing GitHub release outputs", async () => {
    const outputs = [];
    const queried = [];
    const results = await checkGitHubReleases(
        {
            packages: [
                { name: workspaces[0].name, tag: workspaces[0].tag },
                { name: workspaces[1].name, tag: workspaces[1].tag },
            ],
        },
        {
            workspaces,
            releaseExists: async tag => {
                queried.push(tag);
                return tag === workspaces[0].tag;
            },
            emitOutput: (name, value) => outputs.push([name, value]),
            log() {},
        },
    );

    assert.deepEqual(queried, [workspaces[0].tag, workspaces[1].tag]);
    assert.deepEqual(outputs, [
        ["aGitHubReleaseExists", "true"],
        ["bGitHubReleaseExists", "false"],
    ]);
    assert.deepEqual(
        results.map(({ tag, exists }) => ({ tag, exists })),
        [
            { tag: workspaces[0].tag, exists: true },
            { tag: workspaces[1].tag, exists: false },
        ],
    );
});

test("distinguishes existing and missing GitHub releases", async () => {
    assert.equal(
        await githubReleaseExists(workspaces[0].tag, {
            fetchImpl: async () => ({
                json: async () => ({ tag_name: workspaces[0].tag }),
                status: 200,
            }),
        }),
        true,
    );
    assert.equal(
        await githubReleaseExists(workspaces[0].tag, {
            fetchImpl: async () => ({ status: 404 }),
        }),
        false,
    );
});

test("authenticates GitHub release checks when a token is available", async () => {
    await githubReleaseExists(workspaces[0].tag, {
        repository: "microsoft/example",
        token: "test-token",
        fetchImpl: async (url, options) => {
            assert.equal(
                url,
                `https://api.github.com/repos/microsoft/example/releases/tags/${encodeURIComponent(workspaces[0].tag)}`,
            );
            assert.equal(options.headers.Authorization, "Bearer test-token");
            assert.ok(options.signal instanceof AbortSignal);
            return { status: 404 };
        },
    });
});

test("fails explicitly when the GitHub release API fails", async () => {
    await assert.rejects(
        githubReleaseExists(workspaces[0].tag, {
            fetchImpl: async () => ({
                status: 403,
                statusText: "Forbidden",
                text: async () => "rate limited",
            }),
        }),
        /Failed to query GitHub Release.*HTTP 403 Forbidden: rate limited/,
    );
    await assert.rejects(
        githubReleaseExists(workspaces[0].tag, {
            fetchImpl: async () => {
                throw new Error("network down");
            },
        }),
        /Failed to query GitHub Release.*network down/,
    );
});

test("creates release tags from the validated tag list", () => {
    const harness = createGitHarness();
    const messages = [];

    createReleaseTags({
        releaseTags: workspaces.map(workspace => workspace.tag).join(","),
        releaseCommit: commit,
        git: harness.git,
        log: message => messages.push(message),
    });

    assert.equal(harness.remoteTags.get(workspaces[0].tag), commit);
    assert.equal(harness.remoteTags.get(workspaces[1].tag), commit);
    assert.deepEqual(messages, []);
});

test("accepts existing release tags only at the validated commit", () => {
    const valid = createGitHarness({ [workspaces[0].tag]: commit });
    assert.doesNotThrow(() =>
        createReleaseTags({
            releaseTags: workspaces[0].tag,
            releaseCommit: commit,
            git: valid.git,
            log() {},
        }),
    );

    const invalid = createGitHarness({ [workspaces[0].tag]: "b".repeat(40) });
    assert.throws(
        () =>
            createReleaseTags({
                releaseTags: workspaces[0].tag,
                releaseCommit: commit,
                git: invalid.git,
                log() {},
            }),
        /points to .* not/,
    );
});

test("accepts a concurrent release tag push at the validated commit", () => {
    const harness = createGitHarness({}, { [workspaces[0].tag]: commit });
    const messages = [];

    createReleaseTags({
        releaseTags: workspaces[0].tag,
        releaseCommit: commit,
        git: harness.git,
        log: message => messages.push(message),
    });

    assert.equal(harness.remoteTags.get(workspaces[0].tag), commit);
    assert.deepEqual(messages, [
        `Concurrent release run created ${workspaces[0].tag} at the expected commit.`,
    ]);
});

test("creates deployment markers from verified release tags", () => {
    const harness = createGitHarness({
        [workspaces[0].tag]: commit,
        [workspaces[1].tag]: commit,
    });

    markReleaseTagsDeployed({
        releaseTags: workspaces.map(workspace => workspace.tag).join(","),
        releaseCommit: commit,
        git: harness.git,
        log() {},
    });

    assert.equal(harness.remoteTags.get(`deployed/${workspaces[0].tag}`), commit);
    assert.equal(harness.remoteTags.get(`deployed/${workspaces[1].tag}`), commit);
});

test("rejects deployment markers when their release tag moved", () => {
    const harness = createGitHarness({
        [workspaces[0].tag]: "b".repeat(40),
    });

    assert.throws(
        () =>
            markReleaseTagsDeployed({
                releaseTags: workspaces[0].tag,
                releaseCommit: commit,
                git: harness.git,
                log() {},
            }),
        /points to .* not/,
    );
});

test("keeps the Azure publication sequence and shared tag scripts wired", () => {
    const pipeline = readFileSync(
        new URL("../../.ado/pipelines/azure-pipelines-cd.yml", import.meta.url),
        "utf8",
    );
    const publish = pipeline.indexOf("- job: Publish");
    const markDeployed = pipeline.indexOf("- job: MarkDeployed");
    const publishGitHub = pipeline.indexOf("- job: PublishGitHub");

    assert.ok(publish > 0);
    assert.ok(publish < markDeployed);
    assert.ok(markDeployed < publishGitHub);
    assert.match(pipeline, /- stage: ValidateArtifacts/);
    assert.doesNotMatch(pipeline, /- stage: PrepareRelease/);
    assert.match(pipeline, /manage-release-tags\.mjs create/);
    assert.match(pipeline, /manage-release-tags\.mjs mark-deployed/);
    assert.match(pipeline, /fastBuildIncluded/);
    assert.doesNotMatch(pipeline, /NeedsRelease/);
});
