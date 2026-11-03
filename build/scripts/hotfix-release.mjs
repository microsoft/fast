import { strict as assert } from "node:assert";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
    copyFileSync,
    existsSync,
    lstatSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    realpathSync,
    writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { preparePublication, verifyPublication } from "./hotfix-registry.mjs";
import {
    compareReleaseVersions,
    gitTagExists,
    hotfixTagFor,
    listPairedCrates,
    listPublishableWorkspaces,
    pairedCrateNames,
    parseReleaseVersion,
    readCargoPackage,
} from "./release-metadata.mjs";

const tooling = dirname(fileURLToPath(import.meta.url));
const toolNames = ["hotfix-release.mjs", "hotfix-registry.mjs", "release-metadata.mjs"];

function git(root, ...args) {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function tagCommit(root, tag) {
    assert(gitTagExists(tag, root), `Required git tag is missing: ${tag}`);
    return git(root, "rev-parse", "--verify", `refs/tags/${tag}^{commit}`);
}

function hotfixBranchName(root, branch) {
    assert(
        typeof branch === "string" && branch.length > 0,
        "A pushed hotfix branch is required.",
    );
    const name = branch.startsWith("refs/heads/") ? branch.slice(11) : branch;
    assert(
        name !== "main" && !name.startsWith("refs/"),
        "Hotfix source must be a non-main branch, not a tag or another ref.",
    );
    git(root, "check-ref-format", `refs/heads/${name}`);
    return name;
}

function tagPackage(tag) {
    assert(typeof tag === "string", "A version-specific git tag is required.");
    const match = /^(?:hotfix\/)?(@microsoft\/[a-z0-9-]+)_v(.+)$/.exec(tag);
    assert(match && match[0] === tag, "Expected a package-scoped release or hotfix tag.");
    parseReleaseVersion(match[2]);
    return { name: match[1], version: match[2] };
}

function selection(baseTag, hotfixTag) {
    const base = tagPackage(baseTag);
    const hotfix = tagPackage(hotfixTag);
    assert(base.name === hotfix.name, "Base and hotfix must select the same package.");
    assert(
        hotfixTag === hotfixTagFor(hotfix.name, hotfix.version),
        "Hotfix source tags must use the hotfix/ namespace.",
    );
    const before = parseReleaseVersion(base.version);
    const after = parseReleaseVersion(hotfix.version);
    assert(
        before.major === after.major &&
            before.minor === after.minor &&
            compareReleaseVersions(hotfix.version, base.version) > 0,
        "A hotfix must use a newer version on the selected major/minor line.",
    );
    return { base, hotfix, npmDistTag: `hotfix-${after.major}.${after.minor}` };
}

export function planHotfix({ root = ".", baseTag, hotfixTag, hotfixBranch }) {
    hotfixBranch = hotfixBranchName(root, hotfixBranch);
    const { base, hotfix: target, npmDistTag } = selection(baseTag, hotfixTag);
    const workspace = listPublishableWorkspaces(root).find(
        pkg => pkg.name === target.name,
    );
    assert(workspace, "The hotfix package must be a current publishable workspace.");
    const baseSha = tagCommit(root, baseTag);
    const sourceSha = tagCommit(root, hotfixTag);
    assert(
        tagCommit(root, `deployed/${baseTag}`) === baseSha,
        "The base tag must identify an already-published version.",
    );
    const ancestry = spawnSync(
        "git",
        ["merge-base", "--is-ancestor", baseSha, sourceSha],
        {
            cwd: root,
            encoding: "utf8",
        },
    );
    if (ancestry.error) throw ancestry.error;
    assert(
        ancestry.status === 0,
        "The hotfix source must descend from the base release.",
    );
    for (const [sha, pkg] of [
        [baseSha, base],
        [sourceSha, target],
    ]) {
        const manifest = JSON.parse(
            git(root, "show", `${sha}:${workspace.location}/package.json`),
        );
        assert(
            manifest.name === pkg.name &&
                manifest.version === pkg.version &&
                manifest.private !== true,
            "The source package manifest must agree with its tag.",
        );
    }
    assert(
        !gitTagExists(`${target.name}_v${target.version}`, root) &&
            !gitTagExists(`deployed/${target.name}_v${target.version}`, root),
        "A hotfix version cannot reuse a normal release version.",
    );
    const crates = [];
    for (const crateName of pairedCrateNames(target.name)) {
        const cargoTomlPath = `crates/${crateName}/Cargo.toml`;
        if (!git(root, "ls-tree", "--name-only", sourceSha, "--", cargoTomlPath))
            continue;
        const pkg = readCargoPackage(git(root, "show", `${sourceSha}:${cargoTomlPath}`));
        assert(
            pkg.name === crateName && pkg.version === target.version,
            "Paired crate names and versions must agree with the hotfix package.",
        );
        crates.push({ crateName, cargoTomlPath });
    }
    const deployedTag = `deployed/${hotfixTag}`;
    const alreadyDeployed = gitTagExists(deployedTag, root);
    if (alreadyDeployed) {
        assert(
            tagCommit(root, deployedTag) === sourceSha,
            "The deployment marker moved.",
        );
    }
    const plan = {
        schemaVersion: 1,
        baseTag,
        baseSha,
        hotfixTag,
        hotfixBranch,
        sourceSha,
        pipelineSha: git(root, "rev-parse", "HEAD"),
        packageName: target.name,
        packagePath: workspace.location,
        version: target.version,
        npmDistTag,
        crates,
        alreadyDeployed,
    };
    return plan;
}

function digest(path, algorithm) {
    return createHash(algorithm).update(readFileSync(path)).digest();
}

function fileRecord(root, file) {
    return { file, sha256: digest(join(root, file), "sha256").toString("hex") };
}

export function packHotfix({ plan, root = ".", sourceRoot, artifactRoot }) {
    assert.deepEqual(
        plan,
        planHotfix({
            root,
            baseTag: plan.baseTag,
            hotfixTag: plan.hotfixTag,
            hotfixBranch: plan.hotfixBranch,
        }),
        "Source tags changed or the hotfix plan was modified.",
    );
    assert(git(sourceRoot, "rev-parse", "HEAD") === plan.sourceSha);
    assert(
        !existsSync(artifactRoot) || readdirSync(artifactRoot).length === 0,
        "The hotfix artifact directory must be empty.",
    );
    const crates = listPairedCrates(plan.packageName, plan.version, sourceRoot, false);
    assert.deepEqual(crates, plan.crates, "Paired crates changed during the build.");
    const npmDirectory = join(artifactRoot, "publish_artifacts_npm");
    mkdirSync(npmDirectory, { recursive: true });
    const npmArgs = [
        "pack",
        "--ignore-scripts",
        "--json",
        `--workspace=${plan.packagePath}`,
        `--pack-destination=${resolve(npmDirectory)}`,
    ];
    const npmCli = process.env.npm_execpath;
    const packed = JSON.parse(
        execFileSync(
            npmCli ? process.execPath : "npm",
            npmCli ? [npmCli, ...npmArgs] : npmArgs,
            { cwd: sourceRoot, encoding: "utf8" },
        ),
    );
    const npmFilename = `${plan.packageName.replace(/^@/, "").replace("/", "-")}-${plan.version}.tgz`;
    assert(packed.length === 1 && packed[0].filename === npmFilename);
    const artifacts = [
        {
            ...fileRecord(artifactRoot, `publish_artifacts_npm/${npmFilename}`),
            kind: "npm",
            name: plan.packageName,
            version: plan.version,
            integrity: `sha512-${digest(join(npmDirectory, npmFilename), "sha512").toString("base64")}`,
        },
    ];
    for (const { crateName, cargoTomlPath } of plan.crates) {
        const target = join(sourceRoot, "target", "hotfix-package", crateName);
        execFileSync(
            "cargo",
            [
                "package",
                "--no-verify",
                "--allow-dirty",
                "--manifest-path",
                cargoTomlPath,
                "--target-dir",
                target,
            ],
            { cwd: sourceRoot, stdio: "inherit" },
        );
        const filename = `${crateName}-${plan.version}.crate`;
        mkdirSync(join(artifactRoot, "publish_artifacts_crates"), { recursive: true });
        const file = `publish_artifacts_crates/${filename}`;
        copyFileSync(join(target, "package", filename), join(artifactRoot, file));
        artifacts.push({
            ...fileRecord(artifactRoot, file),
            kind: "crate",
            name: crateName,
            version: plan.version,
        });
    }
    const metaDirectory = join(artifactRoot, "publish_artifacts_meta");
    mkdirSync(metaDirectory, { recursive: true });
    for (const name of toolNames) {
        copyFileSync(join(tooling, name), join(metaDirectory, name));
    }
    writeFileSync(
        join(metaDirectory, "hotfix.json"),
        `${JSON.stringify({ ...plan, artifacts }, null, 4)}\n`,
    );
    return verifyHotfixArtifact(artifactRoot);
}

export function verifyHotfixArtifact(root) {
    const manifest = JSON.parse(
        readFileSync(join(root, "publish_artifacts_meta", "hotfix.json"), "utf8"),
    );
    assert(manifest.schemaVersion === 1, "Unsupported hotfix manifest schema.");
    assert(manifest.hotfixBranch === hotfixBranchName(root, manifest.hotfixBranch));
    const { hotfix, npmDistTag } = selection(manifest.baseTag, manifest.hotfixTag);
    assert(manifest.packageName === hotfix.name && manifest.version === hotfix.version);
    assert(manifest.npmDistTag === npmDistTag, "Invalid hotfix maintenance channel.");
    assert(
        manifest.crates.every(
            ({ crateName, cargoTomlPath }) =>
                pairedCrateNames(hotfix.name).includes(crateName) &&
                cargoTomlPath === `crates/${crateName}/Cargo.toml`,
        ),
        "Invalid paired-crate manifest.",
    );
    const expected = [
        `publish_artifacts_npm/${manifest.packageName.replace(/^@/, "").replace("/", "-")}-${manifest.version}.tgz`,
        ...manifest.crates.map(
            crate =>
                `publish_artifacts_crates/${crate.crateName}-${manifest.version}.crate`,
        ),
    ];
    assert.deepEqual(
        manifest.artifacts.map(artifact => artifact.file).sort(),
        expected.sort(),
        "The artifact must contain only the selected npm package and paired crates.",
    );
    for (const { file, sha256 } of manifest.artifacts) {
        assert(
            lstatSync(join(root, file)).isFile(),
            "Artifact files must not be symlinks.",
        );
        assert(
            digest(join(root, file), "sha256").toString("hex") === sha256,
            `Hotfix artifact checksum mismatch: ${file}`,
        );
    }
    for (const directory of ["publish_artifacts_npm", "publish_artifacts_crates"]) {
        const files = expected.filter(file => file.startsWith(`${directory}/`));
        const actual = existsSync(join(root, directory))
            ? readdirSync(join(root, directory)).map(file => `${directory}/${file}`)
            : [];
        assert.deepEqual(actual.sort(), files.sort(), "Unexpected publication assets.");
    }
    for (const artifact of manifest.artifacts) {
        const npm = artifact.file.endsWith(".tgz");
        const member = npm
            ? "package/package.json"
            : `${artifact.name}-${manifest.version}/Cargo.toml`;
        const content = execFileSync("tar", ["-xOf", join(root, artifact.file), member], {
            encoding: "utf8",
        });
        const pkg = npm ? JSON.parse(content) : readCargoPackage(content);
        assert(
            pkg.name === artifact.name &&
                pkg.version === manifest.version &&
                artifact.version === manifest.version &&
                artifact.kind === (npm ? "npm" : "crate") &&
                pkg.private !== true,
            "Packed package identity does not match the hotfix manifest.",
        );
        if (npm) {
            assert(artifact.name === manifest.packageName);
            assert(
                pkg.publishConfig?.tag === undefined ||
                    pkg.publishConfig.tag === manifest.npmDistTag,
                "publishConfig.tag must not override the hotfix maintenance channel.",
            );
            assert(
                pkg.publishConfig?.registry === undefined ||
                    /^https:\/\/registry\.npmjs\.org\/?$/.test(
                        pkg.publishConfig.registry,
                    ),
                "Hotfix npm packages must target the public npm registry.",
            );
            assert(
                artifact.integrity ===
                    `sha512-${digest(join(root, artifact.file), "sha512").toString("base64")}`,
            );
        } else {
            assert(manifest.crates.some(crate => crate.crateName === artifact.name));
        }
    }
    return manifest;
}

function output(name, value) {
    const escaped = String(value)
        .replaceAll("%", "%AZP25")
        .replaceAll("\r", "%0D")
        .replaceAll("\n", "%0A");
    console.log(`##vso[task.setvariable variable=${name};isOutput=true]${escaped}`);
}

function assertPublicationContext(manifest) {
    assert(
        manifest.hotfixBranch ===
            hotfixBranchName(process.cwd(), process.env.FAST_HOTFIX_BRANCH) &&
            manifest.baseTag === process.env.FAST_HOTFIX_BASE_TAG &&
            manifest.hotfixTag === process.env.FAST_HOTFIX_TAG &&
            manifest.baseSha === process.env.FAST_HOTFIX_BASE_SHA &&
            manifest.sourceSha === process.env.FAST_HOTFIX_SOURCE_SHA,
        "The governed artifact must match the requested tags and planned source commits and branch.",
    );
    if (process.env.TF_BUILD) {
        assert(
            process.env.BUILD_REASON === "Manual" &&
                process.env.BUILD_SOURCEBRANCH === "refs/heads/main" &&
                manifest.pipelineSha === process.env.BUILD_SOURCEVERSION,
            "Publication must use the artifact and tooling from this manual central-pipeline run.",
        );
    }
}

async function main() {
    const action = process.argv[2];
    const root = process.cwd();
    const artifactRoot = process.env.FAST_HOTFIX_ARTIFACT_ROOT;
    const planPath = process.env.FAST_HOTFIX_PLAN;
    if (action === "plan" || action === "mark-deployed") {
        if (process.env.TF_BUILD) {
            assert(process.env.BUILD_REASON === "Manual", "Hotfix runs must be manual.");
            assert(
                process.env.BUILD_SOURCEBRANCH === "refs/heads/main",
                "Central tooling must use the pipeline definition from main.",
            );
        }
        const plan = planHotfix({
            root,
            baseTag: process.env.FAST_HOTFIX_BASE_TAG,
            hotfixTag: process.env.FAST_HOTFIX_TAG,
            hotfixBranch: process.env.FAST_HOTFIX_BRANCH,
        });
        if (action === "mark-deployed") {
            assert(
                process.env.TF_BUILD,
                "Deployment markers must be written by the manual Azure pipeline.",
            );
            assert(
                plan.sourceSha === process.env.FAST_HOTFIX_SOURCE_SHA &&
                    plan.baseSha === process.env.FAST_HOTFIX_BASE_SHA,
                "Source tags changed after publication.",
            );
            const tag = `deployed/${plan.hotfixTag}`;
            if (plan.alreadyDeployed) {
                console.log(
                    "Matching deployment marker exists; ensuring it is on origin.",
                );
            } else {
                git(root, "tag", tag, plan.sourceSha);
            }
            git(root, "push", "origin", `refs/tags/${tag}`);
            return;
        }
        if (!plan.alreadyDeployed) {
            const ref = `refs/heads/${plan.hotfixBranch}`;
            const [sha, remoteRef] = git(
                root,
                "ls-remote",
                "--heads",
                "origin",
                ref,
            ).split(/\s+/);
            assert(remoteRef === ref, `Required pushed hotfix branch is missing: ${ref}`);
            assert(
                sha === plan.sourceSha,
                "The pushed hotfix branch head must match the reviewed hotfix tag.",
            );
        }
        console.log(JSON.stringify(plan, null, 4));
        writeFileSync(planPath, `${JSON.stringify(plan, null, 4)}\n`);
        output("needsDeployment", !plan.alreadyDeployed);
        output("sourceSha", plan.sourceSha);
        output("baseSha", plan.baseSha);
        output("packageName", plan.packageName);
        output("npmDistTag", plan.npmDistTag);
        if (plan.alreadyDeployed) {
            console.log("Hotfix already deployed; skipping build and publication.");
        } else {
            const sourceRoot = process.env.FAST_HOTFIX_SOURCE_ROOT;
            assert(
                sourceRoot && !existsSync(sourceRoot),
                "Source directory must be new.",
            );
            git(root, "worktree", "add", "--detach", sourceRoot, plan.sourceSha);
        }
    } else if (action === "pack") {
        packHotfix({
            root,
            plan: JSON.parse(readFileSync(planPath, "utf8")),
            sourceRoot: process.env.FAST_HOTFIX_SOURCE_ROOT,
            artifactRoot,
        });
    } else if (action === "verify") {
        verifyHotfixArtifact(artifactRoot);
        console.log("Hotfix artifact identities and checksums verified.");
    } else if (action === "prepare-publication") {
        const manifest = verifyHotfixArtifact(artifactRoot);
        assertPublicationContext(manifest);
        assert(
            (process.env.npm_config_tag ?? process.env.NPM_CONFIG_TAG) ===
                manifest.npmDistTag,
            "The publisher's npm channel must match the verified artifact.",
        );
        await preparePublication(manifest);
    } else if (action === "verify-publication") {
        const manifest = verifyHotfixArtifact(artifactRoot);
        assertPublicationContext(manifest);
        await verifyPublication(manifest);
        output("publicationVerified", true);
    } else {
        throw new Error(
            "Expected plan, pack, verify, prepare-publication, verify-publication, or mark-deployed.",
        );
    }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main().catch(error => {
        console.error(error);
        process.exitCode = 1;
    });
}
