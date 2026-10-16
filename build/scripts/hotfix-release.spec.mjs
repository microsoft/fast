import { strict as assert } from "node:assert";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { preparePublication, verifyPublication } from "./hotfix-registry.mjs";
import { packHotfix, planHotfix, verifyHotfixArtifact } from "./hotfix-release.mjs";
import {
    compareReleaseVersions,
    gitTagExists,
    hotfixTagFor,
    parseReleaseVersion,
} from "./release-metadata.mjs";

const scripts = dirname(fileURLToPath(import.meta.url));
const temporaryRoots = [];

function temporaryRoot() {
    const root = mkdtempSync(join(tmpdir(), "fast-hotfix-test-"));
    temporaryRoots.push(root);
    return root;
}

afterEach(() => {
    for (const root of temporaryRoots.splice(0))
        rmSync(root, { recursive: true, force: true });
});

function git(root, ...args) {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function json(path, value) {
    writeFileSync(path, `${JSON.stringify(value, null, 4)}\n`);
}

function fixture({
    name = "@microsoft/fast-element",
    baseVersion = "3.0.4",
    version = "3.0.5",
    crates = false,
    crateMismatch = false,
    publishConfig,
} = {}) {
    const root = temporaryRoot();
    git(root, "init", "--quiet", "--initial-branch=main");
    git(root, "config", "user.name", "FAST Test");
    git(root, "config", "user.email", "fast-test@example.com");
    git(root, "config", "commit.gpgsign", "false");
    git(root, "config", "tag.gpgsign", "false");
    mkdirSync(join(root, "empty-hooks"));
    git(root, "config", "core.hooksPath", join(root, "empty-hooks"));
    json(join(root, "package.json"), { private: true, workspaces: ["packages/*"] });
    const location = `packages/${name.split("/")[1]}`;
    mkdirSync(join(root, location), { recursive: true });
    const manifest = {
        name,
        version: baseVersion,
        type: "module",
        files: ["index.js"],
        publishConfig,
    };
    json(join(root, location, "package.json"), manifest);
    writeFileSync(join(root, location, "index.js"), "export const value = 'base';\n");
    function cargoVersions(crateVersion) {
        if (!crates) return;
        for (const crateName of ["microsoft-fast-build", "microsoft-fast-convert"]) {
            const directory = join(root, "crates", crateName);
            mkdirSync(directory, { recursive: true });
            const selected =
                crateMismatch && crateVersion === version && crateName.endsWith("convert")
                    ? "0.99.0"
                    : crateVersion;
            writeFileSync(
                join(directory, "Cargo.toml"),
                `[package]\nname = "${crateName}"\nversion = "${selected}"\nedition = "2021"\n[lib]\npath = "lib.rs"\n`,
            );
            writeFileSync(join(directory, "lib.rs"), "pub fn value() -> u8 { 1 }\n");
        }
    }
    cargoVersions(baseVersion);
    git(root, "add", ".");
    git(root, "commit", "--quiet", "-m", "Base release");
    const baseTag = `${name}_v${baseVersion}`;
    git(root, "tag", baseTag);
    git(root, "tag", `deployed/${baseTag}`);
    const baseSha = git(root, "rev-parse", "HEAD");
    git(root, "checkout", "--quiet", "-b", "backport");
    json(join(root, location, "package.json"), { ...manifest, version });
    writeFileSync(join(root, location, "index.js"), "export const value = 'hotfix';\n");
    cargoVersions(version);
    git(root, "add", ".");
    git(root, "commit", "--quiet", "-m", "Reviewed backport and version bump");
    const hotfixTag = hotfixTagFor(name, version);
    git(root, "tag", hotfixTag);
    const sourceSha = git(root, "rev-parse", "HEAD");
    return {
        root,
        name,
        version,
        baseTag,
        baseSha,
        hotfixTag,
        sourceSha,
        plan: () => planHotfix({ root, baseTag, hotfixTag }),
    };
}

function runScript(root, name, args = [], env = {}) {
    return spawnSync(process.execPath, [resolve(scripts, name), ...args], {
        cwd: root,
        encoding: "utf8",
        env: { ...process.env, GH_TOKEN: "", GITHUB_TOKEN: "", ...env },
    });
}

test("release versions are canonical and compare numerically, including prereleases", () => {
    for (const invalid of [
        undefined,
        "03.0.5",
        "3.0.05",
        "3.0.5\n",
        "3.0.5+rebuild",
        "3.0.5-hotfix.01",
        "3.0.5;echo injected",
    ]) {
        assert.throws(() => parseReleaseVersion(invalid), /canonical/);
    }
    for (const [before, after] of [
        ["3.0.9", "3.0.10"],
        ["3.0.5-hotfix.2", "3.0.5-hotfix.10"],
        ["1.0.0-alpha.31", "1.0.0-alpha.32"],
        ["3.0.5-1", "3.0.5-alpha"],
        ["3.0.5-hotfix.1", "3.0.5"],
    ]) {
        assert.equal(compareReleaseVersions(before, after), -1);
        assert.equal(compareReleaseVersions(after, before), 1);
    }
    assert.equal(compareReleaseVersions("3.0.5", "3.0.5"), 0);
});

test("planning pins the backport SHA rather than the pipeline checkout or GITHUB_SHA", () => {
    const f = fixture();
    git(f.root, "checkout", "--quiet", "main");
    const plan = f.plan();
    assert.equal(plan.sourceSha, f.sourceSha);
    assert.equal(plan.pipelineSha, f.baseSha);
    assert.notEqual(plan.sourceSha, plan.pipelineSha);
    assert.equal(plan.npmDistTag, "hotfix-3.0");
    assert.equal(plan.alreadyDeployed, false);
    assert.deepEqual(plan.crates, []);
});

test("planning supports annotated source tags and previously deployed hotfix bases", () => {
    const f = fixture();
    git(f.root, "tag", "--force", "-a", f.hotfixTag, "-m", "Reviewed source");
    assert.equal(f.plan().sourceSha, f.sourceSha);
    git(f.root, "tag", `deployed/${f.hotfixTag}`, f.sourceSha);
    const nextVersion = "3.0.6";
    const path = join(f.root, "packages/fast-element/package.json");
    json(path, { ...JSON.parse(readFileSync(path, "utf8")), version: nextVersion });
    git(f.root, "add", ".");
    git(f.root, "commit", "--quiet", "-m", "Next hotfix");
    const nextTag = hotfixTagFor(f.name, nextVersion);
    git(f.root, "tag", nextTag);
    const plan = planHotfix({ root: f.root, baseTag: f.hotfixTag, hotfixTag: nextTag });
    assert.equal(plan.baseSha, f.sourceSha);
    assert.equal(plan.version, nextVersion);
});

test("planning requires a deployed base and consistent deployment markers", () => {
    const f = fixture();
    git(f.root, "tag", "--delete", `deployed/${f.baseTag}`);
    assert.throws(f.plan, /Required git tag is missing/);
    git(f.root, "tag", `deployed/${f.baseTag}`, f.sourceSha);
    assert.throws(f.plan, /already-published/);
    git(f.root, "tag", "--force", `deployed/${f.baseTag}`, f.baseSha);
    git(f.root, "tag", `deployed/${f.hotfixTag}`, f.baseSha);
    assert.throws(f.plan, /deployment marker moved/);
});

test("planning rejects canonical release collisions", () => {
    const f = fixture();
    git(f.root, "tag", `${f.name}_v${f.version}`);
    assert.throws(f.plan, /cannot reuse a normal release version/);
});

test("planning rejects untagged, malformed, cross-package, and mismatched sources", () => {
    const f = fixture();
    for (const hotfixTag of [
        "main",
        f.sourceSha,
        `${f.name}_v${f.version}`,
        `${f.hotfixTag}\n`,
        `${f.hotfixTag};echo injected`,
        "hotfix/@microsoft/fast-router_v3.0.5",
    ]) {
        assert.throws(() => planHotfix({ root: f.root, baseTag: f.baseTag, hotfixTag }));
    }
    const mismatch = hotfixTagFor(f.name, "3.0.6");
    git(f.root, "tag", mismatch);
    assert.throws(
        () => planHotfix({ root: f.root, baseTag: f.baseTag, hotfixTag: mismatch }),
        /manifest must agree/,
    );
});

test("planning rejects downgrades and changes to major/minor release lines", () => {
    for (const version of ["3.0.3", "3.0.4", "3.1.0", "4.0.0"]) {
        const f = fixture({ version });
        assert.throws(f.plan, /newer version on the selected major\/minor line/);
    }
});

test("planning rejects a source without base ancestry", () => {
    const f = fixture();
    git(f.root, "checkout", "--quiet", "--orphan", "unrelated");
    git(f.root, "add", ".");
    git(f.root, "commit", "--quiet", "-m", "Unrelated history");
    git(f.root, "tag", "--force", f.hotfixTag);
    assert.throws(f.plan, /descend from the base/);
});

test("FAST Build planning includes both crates and rejects a mismatched crate", () => {
    const options = {
        name: "@microsoft/fast-build",
        baseVersion: "0.13.0",
        version: "0.13.1",
        crates: true,
    };
    const f = fixture(options);
    assert.deepEqual(
        f.plan().crates.map(crate => crate.crateName),
        ["microsoft-fast-build", "microsoft-fast-convert"],
    );
    assert.throws(fixture({ ...options, crateMismatch: true }).plan, /Paired crate/);
});

test("packing uses the tagged source and verifies archive identity and checksums", () => {
    const f = fixture();
    const root = join(temporaryRoot(), "artifact");
    const manifest = packHotfix({
        plan: f.plan(),
        root: f.root,
        sourceRoot: f.root,
        artifactRoot: root,
    });
    assert.equal(manifest.sourceSha, f.sourceSha);
    assert.equal(manifest.artifacts.length, 1);
    assert.equal(manifest.artifacts[0].name, f.name);
    assert.equal(existsSync(join(root, ".npmrc")), false);
    assert.equal(manifest.controlFiles, undefined);
    assert.deepEqual(verifyHotfixArtifact(root), manifest);
    const standalone = runScript(
        root,
        join(root, "publish_artifacts_meta/hotfix-release.mjs"),
        ["verify"],
        { FAST_HOTFIX_ARTIFACT_ROOT: root },
    );
    assert.equal(standalone.status, 0, standalone.stderr);
    assert.match(standalone.stdout, /identities and checksums verified/);
    writeFileSync(join(root, manifest.artifacts[0].file), "corrupted");
    assert.throws(() => verifyHotfixArtifact(root), /checksum mismatch/);
});

test("FAST Build packing verifies both real crate archives without registry access", () => {
    const f = fixture({
        name: "@microsoft/fast-build",
        baseVersion: "0.13.0",
        version: "0.13.1",
        crates: true,
    });
    const root = join(temporaryRoot(), "artifact");
    const planPath = join(f.root, "plan.json");
    json(planPath, f.plan());
    const result = runScript(f.root, "hotfix-release.mjs", ["pack"], {
        FAST_HOTFIX_PLAN: planPath,
        FAST_HOTFIX_SOURCE_ROOT: f.root,
        FAST_HOTFIX_ARTIFACT_ROOT: root,
        FAST_RELEASE_SKIP_CRATES: "true",
        CARGO_NET_OFFLINE: "true",
    });
    assert.equal(result.status, 0, result.stderr);
    const manifest = verifyHotfixArtifact(root);
    assert.deepEqual(
        manifest.artifacts.map(artifact => artifact.name),
        ["@microsoft/fast-build", "microsoft-fast-build", "microsoft-fast-convert"],
    );
});

test("packing fails if a source tag moved after planning", () => {
    const f = fixture();
    const plan = f.plan();
    writeFileSync(
        join(f.root, "packages/fast-element/index.js"),
        "export const moved = 1;\n",
    );
    git(f.root, "add", ".");
    git(f.root, "commit", "--quiet", "-m", "Moved source");
    git(f.root, "tag", "--force", f.hotfixTag);
    assert.throws(
        () => packHotfix({ plan, root: f.root, sourceRoot: f.root }),
        /Source tags changed/,
    );
});

test("artifact verification rejects extra publication files and channel tampering", () => {
    const f = fixture();
    const root = join(temporaryRoot(), "artifact");
    const manifest = packHotfix({
        plan: f.plan(),
        root: f.root,
        sourceRoot: f.root,
        artifactRoot: root,
    });
    const extra = join(root, "publish_artifacts_npm/unrelated.tgz");
    writeFileSync(extra, "unrelated");
    assert.throws(() => verifyHotfixArtifact(root), /Unexpected publication assets/);
    rmSync(extra);
    json(join(root, "publish_artifacts_meta/hotfix.json"), {
        ...manifest,
        npmDistTag: "latest",
    });
    assert.throws(() => verifyHotfixArtifact(root), /Invalid hotfix maintenance channel/);
});

test("packed publishConfig cannot override the maintenance channel or registry", () => {
    for (const publishConfig of [
        { tag: "latest" },
        { registry: "https://example.com" },
    ]) {
        const f = fixture({ publishConfig });
        assert.throws(
            () =>
                packHotfix({
                    plan: f.plan(),
                    root: f.root,
                    sourceRoot: f.root,
                    artifactRoot: join(temporaryRoot(), "artifact"),
                }),
            /publishConfig.tag|public npm registry/,
        );
    }
});

test("normal GitHub release creation and Azure discovery exclude hotfix versions", () => {
    const f = fixture();
    for (const args of [[], ["--check-only"]]) {
        const result = runScript(f.root, "create-github-releases.mjs", args);
        assert.equal(result.status, 0, result.stderr);
        assert.match(result.stdout, /Skipping hotfix-only version/);
        assert.doesNotMatch(result.stdout, /Creating release|Packing/);
    }
    // Even an accidentally added canonical tag cannot route a hotfix through GitHub CD.
    git(f.root, "tag", `${f.name}_v${f.version}`);
    const result = runScript(f.root, "download-github-releases.mjs", ["--check-only"], {
        GITHUB_REPOSITORY: "microsoft/fast",
        TF_BUILD: "true",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Skipping hotfix-only version/);
    assert.match(result.stdout, /variable=needsDeployment;isOutput=true]false/);
    git(f.root, "tag", `deployed/${f.hotfixTag}`);
    git(f.root, "tag", "--delete", f.hotfixTag);
    const deletedSourceTag = runScript(f.root, "create-github-releases.mjs", []);
    assert.equal(deletedSourceTag.status, 0, deletedSourceTag.stderr);
    assert.match(deletedSourceTag.stdout, /Skipping hotfix-only version/);
});

test("a governed publication rejects an artifact from a different source before registry access", () => {
    const f = fixture();
    const root = join(temporaryRoot(), "artifact");
    packHotfix({ plan: f.plan(), root: f.root, sourceRoot: f.root, artifactRoot: root });
    const result = runScript(
        root,
        join(root, "publish_artifacts_meta/hotfix-release.mjs"),
        ["prepare-publication"],
        {
            FAST_HOTFIX_ARTIFACT_ROOT: root,
            FAST_HOTFIX_BASE_TAG: f.baseTag,
            FAST_HOTFIX_TAG: f.hotfixTag,
            FAST_HOTFIX_SOURCE_SHA: f.baseSha,
            FAST_HOTFIX_BASE_SHA: f.baseSha,
            npm_config_tag: "hotfix-3.0",
        },
    );
    assert.notEqual(result.status, 0);
    assert.match(
        result.stderr,
        /must match the requested tags and planned source commits/,
    );
});

test("normal missing releases remain detectable and are not confused with historical tags", () => {
    const f = fixture();
    git(f.root, "tag", "--delete", f.hotfixTag);
    const result = runScript(f.root, "create-github-releases.mjs", ["--check-only"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Missing git tag \/ release: 1/);
    assert.match(result.stdout, /@microsoft\/fast-element@3.0.5/);
    const azure = runScript(f.root, "download-github-releases.mjs", ["--check-only"], {
        GITHUB_REPOSITORY: "microsoft/fast",
        TF_BUILD: "true",
    });
    assert.equal(azure.status, 0, azure.stderr);
    assert.match(azure.stdout, /variable=needsDeployment;isOutput=true]false/);
    git(f.root, "tag", `${f.name}_v${f.version}`);
    const released = runScript(f.root, "download-github-releases.mjs", ["--check-only"], {
        GITHUB_REPOSITORY: "microsoft/fast",
        TF_BUILD: "true",
    });
    assert.equal(released.status, 0, released.stderr);
    assert.match(released.stdout, /variable=needsDeployment;isOutput=true]true/);
    assert.match(released.stdout, /variable=npmDistTag;isOutput=true]latest/);
});

test("publishing is blocked outside manual main runs before materializing source", () => {
    const f = fixture();
    for (const env of [
        { BUILD_REASON: "Schedule", BUILD_SOURCEBRANCH: "refs/heads/main" },
        { BUILD_REASON: "Manual", BUILD_SOURCEBRANCH: "refs/heads/feature" },
    ]) {
        const result = runScript(f.root, "hotfix-release.mjs", ["plan"], {
            TF_BUILD: "true",
            ...env,
        });
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /must be manual|definition from main/);
    }
});

test("an already-deployed hotfix skips source materialization and publication", () => {
    const f = fixture();
    git(f.root, "tag", `deployed/${f.hotfixTag}`, f.sourceSha);
    assert.equal(f.plan().alreadyDeployed, true);
    const result = runScript(f.root, "hotfix-release.mjs", ["plan"], {
        TF_BUILD: "true",
        BUILD_REASON: "Manual",
        BUILD_SOURCEBRANCH: "refs/heads/main",
        FAST_HOTFIX_BASE_TAG: f.baseTag,
        FAST_HOTFIX_TAG: f.hotfixTag,
        FAST_HOTFIX_PLAN: join(f.root, "plan.json"),
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /variable=needsDeployment;isOutput=true]false/);
    assert.match(result.stdout, /skipping build and publication/);
});

test("the hotfix tag selects a reviewed branch commit without changing the main checkout", () => {
    const f = fixture();
    writeFileSync(
        join(f.root, "packages/fast-element/index.js"),
        "export const value = 'later';\n",
    );
    git(f.root, "add", ".");
    git(f.root, "commit", "--quiet", "-m", "Later untagged branch work");
    assert.notEqual(git(f.root, "rev-parse", "HEAD"), f.sourceSha);
    git(f.root, "checkout", "--quiet", "main");
    const sourceRoot = join(f.root, "hotfix-source");
    const result = runScript(f.root, "hotfix-release.mjs", ["plan"], {
        TF_BUILD: "true",
        BUILD_REASON: "Manual",
        BUILD_SOURCEBRANCH: "refs/heads/main",
        FAST_HOTFIX_BASE_TAG: f.baseTag,
        FAST_HOTFIX_TAG: f.hotfixTag,
        FAST_HOTFIX_PLAN: join(f.root, "plan.json"),
        FAST_HOTFIX_SOURCE_ROOT: sourceRoot,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(git(sourceRoot, "rev-parse", "HEAD"), f.sourceSha);
    assert.equal(git(f.root, "rev-parse", "HEAD"), f.baseSha);
    assert.equal(
        JSON.parse(
            readFileSync(join(sourceRoot, "packages/fast-element/package.json"), "utf8"),
        ).version,
        f.version,
    );
});

test("deployment markers point to the built source, not the main checkout", () => {
    const f = fixture();
    git(f.root, "checkout", "--quiet", "main");
    const remote = join(temporaryRoot(), "origin.git");
    git(f.root, "init", "--bare", "--quiet", remote);
    git(f.root, "remote", "add", "origin", remote);
    const env = {
        TF_BUILD: "true",
        BUILD_REASON: "Manual",
        BUILD_SOURCEBRANCH: "refs/heads/main",
        FAST_HOTFIX_BASE_TAG: f.baseTag,
        FAST_HOTFIX_TAG: f.hotfixTag,
        FAST_HOTFIX_SOURCE_SHA: f.sourceSha,
        FAST_HOTFIX_BASE_SHA: f.baseSha,
    };
    const local = runScript(f.root, "hotfix-release.mjs", ["mark-deployed"], {
        ...env,
        TF_BUILD: "",
    });
    assert.notEqual(local.status, 0);
    assert.match(local.stderr, /manual Azure pipeline/);
    assert.equal(gitTagExists(`deployed/${f.hotfixTag}`, f.root), false);
    const rejected = runScript(f.root, "hotfix-release.mjs", ["mark-deployed"], {
        ...env,
        FAST_HOTFIX_SOURCE_SHA: f.baseSha,
    });
    assert.notEqual(rejected.status, 0);
    assert.equal(gitTagExists(`deployed/${f.hotfixTag}`, f.root), false);
    const result = runScript(f.root, "hotfix-release.mjs", ["mark-deployed"], env);
    assert.equal(result.status, 0, result.stderr);
    const repeated = runScript(f.root, "hotfix-release.mjs", ["mark-deployed"], env);
    assert.equal(repeated.status, 0, repeated.stderr);
    assert.equal(
        git(
            f.root,
            "--git-dir",
            remote,
            "rev-parse",
            `refs/tags/deployed/${f.hotfixTag}`,
        ),
        f.sourceSha,
    );
});

function registryFixture() {
    const version = "0.13.1";
    const artifacts = [
        {
            kind: "npm",
            name: "@microsoft/fast-build",
            file: "publish_artifacts_npm/build.tgz",
        },
        {
            kind: "crate",
            name: "microsoft-fast-build",
            file: "publish_artifacts_crates/build.crate",
        },
        {
            kind: "crate",
            name: "microsoft-fast-convert",
            file: "publish_artifacts_crates/convert.crate",
        },
    ].map(artifact => {
        const bytes = Buffer.from(artifact.name);
        return {
            ...artifact,
            version,
            sha256: createHash("sha256").update(bytes).digest("hex"),
            integrity: `sha512-${createHash("sha512").update(bytes).digest("base64")}`,
        };
    });
    const manifest = {
        packageName: "@microsoft/fast-build",
        version,
        npmDistTag: "hotfix-0.13",
        artifacts,
    };
    function fetcher({
        published = [],
        channel,
        latest = "0.14.0",
        mismatch = false,
        status,
    } = {}) {
        return async url => {
            assert.match(url, /^https:\/\/(registry\.npmjs\.org|crates\.io)\//);
            let value;
            if (url.endsWith("/dist-tags")) {
                value = {
                    latest,
                    ...(channel ? { [manifest.npmDistTag]: channel } : {}),
                };
            } else {
                const artifact = artifacts.find(item =>
                    url.includes(encodeURIComponent(item.name)),
                );
                assert(artifact, `Unexpected registry URL: ${url}`);
                if (published.includes(artifact.name)) {
                    value =
                        artifact.kind === "npm"
                            ? {
                                  dist: {
                                      integrity:
                                          mismatch === artifact.name
                                              ? "different"
                                              : artifact.integrity,
                                  },
                              }
                            : {
                                  version: {
                                      checksum:
                                          mismatch === artifact.name
                                              ? "different"
                                              : artifact.sha256,
                                  },
                              };
                }
            }
            const code = status ?? (value ? 200 : 404);
            return { status: code, ok: code === 200, json: async () => value };
        };
    }
    return { manifest, artifacts, fetcher };
}

test("registry requests percent-encode scoped package names in both npm URLs", async () => {
    const f = registryFixture();
    const urls = [];
    const fetcher = f.fetcher();
    await preparePublication(f.manifest, async url => {
        urls.push(url);
        return fetcher(url);
    });
    assert.deepEqual(urls, [
        "https://registry.npmjs.org/-/package/%40microsoft%2Ffast-build/dist-tags",
        "https://registry.npmjs.org/%40microsoft%2Ffast-build/0.13.1",
        "https://crates.io/api/v1/crates/microsoft-fast-build/0.13.1",
        "https://crates.io/api/v1/crates/microsoft-fast-convert/0.13.1",
    ]);
});

test("publication requires unused versions instead of recovering a partial publication", async () => {
    for (const name of ["@microsoft/fast-build", "microsoft-fast-convert"]) {
        const f = registryFixture();
        await assert.rejects(
            preparePublication(
                f.manifest,
                f.fetcher({ published: [name], channel: f.manifest.version }),
            ),
            /already published.*manual recovery/,
        );
    }
});

test("verification requires matching npm and crate bytes and the exact maintenance channel", async () => {
    const f = registryFixture();
    const fetcher = f.fetcher({
        published: f.artifacts.map(artifact => artifact.name),
        channel: f.manifest.version,
    });
    await verifyPublication(f.manifest, { fetcher, attempts: 1 });
    await assert.rejects(
        verifyPublication(f.manifest, {
            fetcher: f.fetcher({
                published: f.artifacts.map(artifact => artifact.name),
                channel: "0.13.2",
            }),
            attempts: 1,
        }),
        /no deployment marker/,
    );
});

test("verification rejects different published bytes for npm and each paired crate", async () => {
    const f = registryFixture();
    for (const artifact of f.artifacts) {
        await assert.rejects(
            verifyPublication(f.manifest, {
                fetcher: f.fetcher({
                    published: f.artifacts.map(item => item.name),
                    channel: f.manifest.version,
                    mismatch: artifact.name,
                }),
                attempts: 1,
            }),
            /Published bytes differ/,
        );
    }
});

test("publication fails closed on used versions, latest, and backwards channels", async () => {
    for (const [options, error] of [
        [{ published: ["@microsoft/fast-build"] }, /already published/],
        [{ latest: "0.13.1" }, /unexpectedly owns npm latest/],
        [{ channel: "0.13.2" }, /channel backwards/],
        [{ channel: "0.14.0" }, /outside its maintenance line/],
        [{ status: 500 }, /Registry request failed/],
    ]) {
        const f = registryFixture();
        await assert.rejects(preparePublication(f.manifest, f.fetcher(options)), error);
    }
});

test("registry failures do not become unpublished-version fallbacks", async () => {
    const f = registryFixture();
    for (const status of [401, 403, 429, 500]) {
        await assert.rejects(
            preparePublication(f.manifest, f.fetcher({ status })),
            /Registry request failed/,
        );
    }
    for (const data of [null, []]) {
        await assert.rejects(
            preparePublication(f.manifest, async () => ({
                status: 200,
                ok: true,
                json: async () => data,
            })),
            /Invalid registry metadata/,
        );
    }
    await assert.rejects(
        preparePublication(f.manifest, async () => {
            throw new Error("Network unavailable");
        }),
        /Network unavailable/,
    );
});

test("verification waits for visibility but never marks an unverified publication", async () => {
    const f = registryFixture();
    await assert.rejects(
        verifyPublication(f.manifest, { fetcher: f.fetcher(), attempts: 2, delay: 0 }),
        /no deployment marker/,
    );
    const present = f.fetcher({
        published: f.artifacts.map(artifact => artifact.name),
        channel: f.manifest.version,
    });
    let first = true;
    await verifyPublication(f.manifest, {
        attempts: 2,
        delay: 0,
        fetcher: async (url, options) => {
            if (first) {
                first = false;
                return { status: 404 };
            }
            return present(url, options);
        },
    });
});

test("the manual Azure path always includes publication without GitHub Releases", () => {
    const yaml = readFileSync(
        resolve(scripts, "../../azure-pipelines-hotfix.yml"),
        "utf8",
    );
    assert.match(yaml, /^trigger: none\npr: none\n/);
    assert.match(yaml, /^ {4}- stage: PublishHotfix$/m);
    assert.doesNotMatch(yaml, /name: publish\b|parameters\.publish|FAST_HOTFIX_PUBLISH/);
    assert.match(yaml, /productstate: \$\(npm_config_tag\)/);
    assert.match(yaml, /cargo install wasm-pack --locked/);
    assert.match(yaml, /plan.hasCrates/);
    assert.match(yaml, /eq\(variables\['hasCrates'\], 'true'\)/);
    assert.match(yaml, /type: releaseJob/);
    assert.match(yaml, /eq\(dependencies.Deploy.result, 'Succeeded'\)/);
    assert.match(yaml, /verified.publicationVerified/);
    assert.match(yaml, /persistCredentials: false/);
    assert.doesNotMatch(
        yaml,
        /DownloadGitHubRelease|gh release|create-github-releases|continueOnError|GH_TOKEN|schedules:|pending_npm|pending_crates/,
    );
});
