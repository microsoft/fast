#!/usr/bin/env node
/**
 * Finalize the FAST Element v3 RC package versions.
 *
 * This script is intentionally local-only. It runs Beachball's `bump` command
 * to consume change files and generate changelog entries, then rewrites the
 * package versions to the explicit RC plan for this branch. It never invokes
 * publish, release creation, tag creation, or push commands.
 *
 * Default mode is a disposable dry run:
 *
 *   node build/scripts/finalize-fast-element-v3-rc.mjs
 *
 * To apply changes to the current worktree:
 *
 *   node build/scripts/finalize-fast-element-v3-rc.mjs --apply
 *
 * TODO #7595: Remove this RC-only finalizer before merging
 * `releases/fast-element-v3-rc` back to `main` after FAST Element 3.x stable
 * has been released. See https://github.com/microsoft/fast/issues/7595.
 */

import { execFileSync } from "node:child_process";
import {
    copyFileSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(scriptPath), "..", "..");
const args = new Set(process.argv.slice(2));

const APPLY = args.has("--apply");
const KEEP = args.has("--keep");
const ALLOW_SCRIPT_OVERRIDES = args.has("--allow-script-overrides");
const ALLOW_NON_RC_REF = args.has("--allow-non-rc-ref");
const REF = readArg("--ref") ?? "HEAD";
const TARGET_RC_BRANCH = "releases/fast-element-v3-rc";
const TARGET_RC_REF = readArg("--target-ref") ?? `origin/${TARGET_RC_BRANCH}`;
// TODO #7595: Remove branch-suffixed RC versioning before merge-back to main.
// Single source for the branch-cut date used by companion versions and npm dist-tag.
const RC_BRANCH_CUT_DATE = "2026-06-15";
const RC_DATE = formatRcDate(RC_BRANCH_CUT_DATE);
const RC_SUFFIX = `fast-element-v3-rc-${RC_DATE}`;
const RC_DIST_TAG = `rc-${RC_DATE}`;

const packageOrder = [
    "@microsoft/fast-build",
    "@microsoft/fast-element",
    "@microsoft/fast-router",
    "@microsoft/fast-test-harness",
];

const packagePaths = {
    "@microsoft/fast-build": "packages/fast-build",
    "@microsoft/fast-element": "packages/fast-element",
    "@microsoft/fast-router": "packages/fast-router",
    "@microsoft/fast-test-harness": "packages/fast-test-harness",
};

const privateWorkspaceDependencyPaths = [
    "examples/csr/todo-app",
    "examples/csr/todo-mobx-app",
    "examples/ssr/chat-app",
    "examples/ssr/webui-todo-app",
    "sites/benchmarks",
    "sites/website",
];

function readArg(name) {
    const index = process.argv.indexOf(name);
    return index === -1 ? undefined : process.argv[index + 1];
}

function run(file, commandArgs, options = {}) {
    return execFileSync(file, commandArgs, {
        cwd: options.cwd ?? repoRoot,
        encoding: "utf8",
        stdio: options.stdio ?? "pipe",
        env: options.env ?? process.env,
    });
}

function git(commandArgs, options = {}) {
    return run("git", commandArgs, options).trim();
}

function gitSucceeds(commandArgs, options = {}) {
    try {
        execFileSync("git", commandArgs, {
            cwd: options.cwd ?? repoRoot,
            stdio: "ignore",
        });
        return true;
    } catch {
        return false;
    }
}

function readJson(path) {
    return JSON.parse(readFileSync(path, "utf8"));
}

function readJsonIndent(path) {
    const content = readFileSync(path, "utf8");
    const match = /^\n?([ \t]+)"/m.exec(content);
    return match?.[1] ?? "  ";
}

function formatRcDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error(`Invalid RC branch-cut date ${value}. Expected YYYY-MM-DD.`);
    }

    return value.replaceAll("-", "");
}

function writeJson(path, value) {
    writeFileSync(path, `${JSON.stringify(value, null, readJsonIndent(path))}\n`);
}

function packageJsonPath(packageName) {
    return join(repoRoot, packagePaths[packageName], "package.json");
}

function changelogJsonPath(packageName) {
    return join(repoRoot, packagePaths[packageName], "CHANGELOG.json");
}

function changelogMdPath(packageName) {
    return join(repoRoot, packagePaths[packageName], "CHANGELOG.md");
}

function getPackage(packageName) {
    return readJson(packageJsonPath(packageName));
}

function setDependency(pkg, section, dependencyName, version) {
    if (pkg[section]?.[dependencyName] !== undefined) {
        pkg[section][dependencyName] = version;
    }
}

function ensureCleanWorktree() {
    const status = run("git", ["status", "--porcelain"], { cwd: repoRoot });
    const ignored = new Set([
        "build/scripts/create-github-releases.mjs",
        "build/scripts/finalize-fast-element-v3-rc.mjs",
    ]);
    const dirty = status
        .split("\n")
        .filter(Boolean)
        .filter(line => {
            const file = line.slice(3);
            return !(ALLOW_SCRIPT_OVERRIDES && ignored.has(file));
        });

    if (dirty.length > 0) {
        throw new Error(
            "The worktree must be clean before finalizing the RC.\n" +
                "Commit, stash, or discard existing changes first.",
        );
    }
}

function ensureRcBaseRef(ref) {
    if (ALLOW_NON_RC_REF) {
        return;
    }

    let targetSha;
    let refSha;
    try {
        targetSha = git(["rev-parse", "--verify", TARGET_RC_REF]);
        refSha = git(["rev-parse", "--verify", ref]);
    } catch {
        throw new Error(
            `Unable to resolve ${TARGET_RC_REF} and ${ref}. Fetch the RC branch or pass --target-ref/--allow-non-rc-ref.`,
        );
    }

    if (!gitSucceeds(["merge-base", "--is-ancestor", targetSha, refSha])) {
        throw new Error(
            `${ref} is not based on ${TARGET_RC_REF}. The FAST Element v3 RC finalizer only runs on branches snapped from ${TARGET_RC_BRANCH}. Pass --allow-non-rc-ref to override intentionally.`,
        );
    }
}

function ensureChangeFilesExist() {
    const changeDir = join(repoRoot, "change");
    if (!existsSync(changeDir)) {
        throw new Error("No change/ directory exists. Nothing is available to bump.");
    }

    const files = readdirSync(changeDir).filter(file => file.endsWith(".json"));
    if (files.length === 0) {
        throw new Error("No change/*.json files exist. Nothing is available to bump.");
    }
}

function createTemporaryBeachballConfig() {
    const tempDir = mkdtempSync(join(tmpdir(), "fast-element-v3-rc-beachball-"));
    const configPath = join(tempDir, "beachball.config.cjs");
    const content = [
        `const baseConfig = require(${JSON.stringify(join(repoRoot, "beachball.config.js"))});`,
        "",
        "module.exports = {",
        "  ...baseConfig,",
        "  scope: [",
        '    "packages/fast-element",',
        '    "packages/fast-build",',
        '    "packages/fast-router",',
        '    "packages/fast-test-harness",',
        "  ],",
        "  hooks: {},",
        `  tag: ${JSON.stringify(RC_DIST_TAG)},`,
        `  defaultNpmTag: ${JSON.stringify(RC_DIST_TAG)},`,
        "};",
        "",
    ].join("\n");

    writeFileSync(configPath, content);
    return { configPath, tempDir };
}

function removeTemporaryBeachballConfig({ tempDir }) {
    rmSync(tempDir, { recursive: true, force: true });
}

function runBeachballBump() {
    const config = createTemporaryBeachballConfig();
    try {
        run(
            "npx",
            [
                "beachball",
                "bump",
                "--config-path",
                config.configPath,
                "--no-fetch",
                "--scope",
                "packages/fast-element",
                "--scope",
                "packages/fast-build",
                "--scope",
                "packages/fast-router",
                "--scope",
                "packages/fast-test-harness",
                "--yes",
            ],
            { cwd: repoRoot, stdio: "inherit" },
        );
    } finally {
        removeTemporaryBeachballConfig(config);
    }
}

function appendSuffix(version) {
    return version.includes(RC_SUFFIX) ? version : `${version}-${RC_SUFFIX}`;
}

function computeFinalVersions() {
    const rawVersions = Object.fromEntries(
        packageOrder.map(packageName => [packageName, getPackage(packageName).version]),
    );

    const fastElementVersion = rawVersions["@microsoft/fast-element"];
    if (!/^3\.0\.0-rc\.\d+$/.test(fastElementVersion)) {
        throw new Error(
            `Expected @microsoft/fast-element to be a 3.0.0 RC after Beachball, got ${fastElementVersion}.`,
        );
    }

    return {
        "@microsoft/fast-build": appendSuffix(rawVersions["@microsoft/fast-build"]),
        "@microsoft/fast-element": fastElementVersion,
        "@microsoft/fast-router": appendSuffix(rawVersions["@microsoft/fast-router"]),
        "@microsoft/fast-test-harness": appendSuffix(
            rawVersions["@microsoft/fast-test-harness"],
        ),
    };
}

function parseFastElementRcNumber(version) {
    const match = /^3\.0\.0-rc\.(\d+)$/.exec(version);
    if (!match) {
        throw new Error(
            `Expected @microsoft/fast-element to be a 3.0.0 RC, got ${version}.`,
        );
    }

    return Number(match[1]);
}

function assertFastElementRcAdvanced(beforeVersion, afterVersion) {
    const before = parseFastElementRcNumber(beforeVersion);
    const after = parseFastElementRcNumber(afterVersion);

    if (after <= before) {
        throw new Error(
            `Expected @microsoft/fast-element RC version to advance beyond ${beforeVersion}, got ${afterVersion}. Check that prerelease change files are present before finalizing.`,
        );
    }
}

function rewritePackageVersions(finalVersions) {
    for (const packageName of packageOrder) {
        const pkg = getPackage(packageName);
        pkg.version = finalVersions[packageName];

        switch (packageName) {
            case "@microsoft/fast-element":
                setDependency(
                    pkg,
                    "devDependencies",
                    "@microsoft/fast-build",
                    finalVersions["@microsoft/fast-build"],
                );
                break;
            case "@microsoft/fast-router":
                setDependency(
                    pkg,
                    "devDependencies",
                    "@microsoft/fast-element",
                    finalVersions["@microsoft/fast-element"],
                );
                setDependency(
                    pkg,
                    "peerDependencies",
                    "@microsoft/fast-element",
                    finalVersions["@microsoft/fast-element"],
                );
                break;
            case "@microsoft/fast-test-harness":
                for (const section of ["devDependencies", "peerDependencies"]) {
                    setDependency(
                        pkg,
                        section,
                        "@microsoft/fast-build",
                        finalVersions["@microsoft/fast-build"],
                    );
                    setDependency(
                        pkg,
                        section,
                        "@microsoft/fast-element",
                        finalVersions["@microsoft/fast-element"],
                    );
                }
                break;
        }

        writeJson(packageJsonPath(packageName), pkg);
    }
}

function rewritePrivateWorkspaceDependencies(finalVersions) {
    for (const packagePath of privateWorkspaceDependencyPaths) {
        const path = join(repoRoot, packagePath, "package.json");
        if (!existsSync(path)) {
            continue;
        }

        const pkg = readJson(path);

        for (const section of ["dependencies", "devDependencies", "peerDependencies"]) {
            setDependency(
                pkg,
                section,
                "@microsoft/fast-element",
                finalVersions["@microsoft/fast-element"],
            );

            if (
                pkg[section]?.["@microsoft/fast-build"] !== undefined &&
                pkg[section]["@microsoft/fast-build"] !== "*"
            ) {
                setDependency(
                    pkg,
                    section,
                    "@microsoft/fast-build",
                    finalVersions["@microsoft/fast-build"],
                );
            }
        }

        writeJson(path, pkg);
    }
}

function rewriteChangelogJson(packageName, finalVersions, rawVersions) {
    const path = changelogJsonPath(packageName);
    if (!existsSync(path)) {
        return;
    }

    const changelog = readJson(path);
    const latest = changelog.entries?.[0];
    if (!latest) {
        return;
    }

    latest.version = finalVersions[packageName];
    latest.tag = `${packageName}_v${finalVersions[packageName]}`;
    rewriteChangelogComments(latest.comments, finalVersions, rawVersions);
    writeJson(path, changelog);
}

function rewriteChangelogComments(value, finalVersions, rawVersions) {
    if (Array.isArray(value)) {
        for (const item of value) {
            rewriteChangelogComments(item, finalVersions, rawVersions);
        }
        return;
    }

    if (value && typeof value === "object") {
        for (const [key, child] of Object.entries(value)) {
            if (key === "comment" && typeof child === "string") {
                value[key] = rewriteVersionReferences(child, finalVersions, rawVersions);
            } else {
                rewriteChangelogComments(child, finalVersions, rawVersions);
            }
        }
    }
}

function rewriteChangelogMd(packageName, finalVersions, rawVersions) {
    const path = changelogMdPath(packageName);
    if (!existsSync(path)) {
        return;
    }

    let content = readFileSync(path, "utf8");
    const rawVersion = rawVersions[packageName];
    const finalVersion = finalVersions[packageName];
    content = content.replace(`## ${rawVersion}\n`, `## ${finalVersion}\n`);
    content = rewriteChangelogSection(content, finalVersion, section =>
        rewriteVersionReferences(section, finalVersions, rawVersions),
    );
    writeFileSync(path, content);
}

function rewriteChangelogSection(content, version, rewrite) {
    const heading = `## ${version}\n`;
    const start = content.indexOf(heading);
    if (start === -1) {
        throw new Error(`Could not find generated changelog heading ${heading.trim()}.`);
    }

    const nextHeading = content.indexOf("\n## ", start + heading.length);
    const end = nextHeading === -1 ? content.length : nextHeading;

    return (
        content.slice(0, start) + rewrite(content.slice(start, end)) + content.slice(end)
    );
}

function rewriteVersionReferences(input, finalVersions, rawVersions) {
    let output = input;
    for (const packageName of packageOrder) {
        output = output.replaceAll(
            `${packageName} to v${rawVersions[packageName]}`,
            `${packageName} to v${finalVersions[packageName]}`,
        );
    }
    return output;
}

function rewriteChangelogs(finalVersions, rawVersions) {
    for (const packageName of packageOrder) {
        rewriteChangelogJson(packageName, finalVersions, rawVersions);
        rewriteChangelogMd(packageName, finalVersions, rawVersions);
    }
}

function updateLockfile() {
    run(
        "npm",
        ["install", "--package-lock-only", "--ignore-scripts", "--no-audit", "--no-fund"],
        { cwd: repoRoot, stdio: "inherit" },
    );
}

function readCargoVersion() {
    const cargoToml = readFileSync(
        join(repoRoot, "crates/microsoft-fast-build/Cargo.toml"),
        "utf8",
    );
    const match = /^\s*version\s*=\s*"([^"]+)"/m.exec(cargoToml);

    if (!match) {
        throw new Error("Could not read microsoft-fast-build Cargo.toml version.");
    }

    return match[1];
}

function verifyFinalState(finalVersions, initialCrateVersion) {
    for (const packageName of packageOrder) {
        const pkg = getPackage(packageName);
        if (pkg.version !== finalVersions[packageName]) {
            throw new Error(
                `${packageName} version is ${pkg.version}, expected ${finalVersions[packageName]}.`,
            );
        }
    }

    const crateVersion = readCargoVersion();
    if (crateVersion !== initialCrateVersion) {
        throw new Error(
            `microsoft-fast-build Cargo.toml changed from ${initialCrateVersion} to ${crateVersion}. The v3 RC finalizer must not version the Rust crate.`,
        );
    }

    const lock = readJson(join(repoRoot, "package-lock.json"));
    for (const packageName of packageOrder) {
        const location = packagePaths[packageName];
        const entry = lock.packages?.[location];
        if (entry?.version !== finalVersions[packageName]) {
            throw new Error(
                `${location} lockfile version is ${entry?.version}, expected ${finalVersions[packageName]}.`,
            );
        }
    }
}

function printVersionTable(finalVersions) {
    console.log("\nFAST Element v3 RC final versions:");
    for (const packageName of packageOrder) {
        console.log(`  - ${packageName}@${finalVersions[packageName]}`);
    }
    console.log(`\nRC branch-cut date: ${RC_BRANCH_CUT_DATE} (${RC_DATE})`);
    console.log(`\nUse npm dist-tag: ${RC_DIST_TAG}`);
    console.log("Rust crate packaging is intentionally excluded for this RC branch.");
}

function previewReleases() {
    console.log(
        "\nRelease preview (check-only; no packing, tags, releases, or publishing):",
    );
    run("node", ["build/scripts/create-github-releases.mjs", "--check-only"], {
        cwd: repoRoot,
        stdio: "inherit",
        env: {
            ...process.env,
            FAST_RELEASE_SKIP_CRATES: "true",
        },
    });
}

function applyFinalizer() {
    ensureRcBaseRef("HEAD");
    ensureCleanWorktree();
    ensureChangeFilesExist();

    const baselineVersions = Object.fromEntries(
        packageOrder.map(packageName => [packageName, getPackage(packageName).version]),
    );
    const initialCrateVersion = readCargoVersion();

    runBeachballBump();

    const rawVersions = Object.fromEntries(
        packageOrder.map(packageName => [packageName, getPackage(packageName).version]),
    );
    assertFastElementRcAdvanced(
        baselineVersions["@microsoft/fast-element"],
        rawVersions["@microsoft/fast-element"],
    );
    const finalVersions = computeFinalVersions();

    rewritePackageVersions(finalVersions);
    rewritePrivateWorkspaceDependencies(finalVersions);
    rewriteChangelogs(finalVersions, rawVersions);
    updateLockfile();
    verifyFinalState(finalVersions, initialCrateVersion);
    printVersionTable(finalVersions);
    previewReleases();
}

function dryRun() {
    ensureRcBaseRef(REF);

    let temp;
    let repoDir;

    try {
        gitSucceeds(["worktree", "prune"]);
        temp = mkdtempSync(join(tmpdir(), "fast-element-v3-rc-finalizer-"));
        repoDir = join(temp, "repo");
        console.log(`Creating disposable worktree at ${repoDir}`);
        run("git", ["worktree", "add", "--detach", repoDir, REF], {
            cwd: repoRoot,
            stdio: "inherit",
        });

        for (const file of [
            "build/scripts/finalize-fast-element-v3-rc.mjs",
            "build/scripts/create-github-releases.mjs",
        ]) {
            const dest = join(repoDir, file);
            mkdirSync(dirname(dest), { recursive: true });
            copyFileSync(join(repoRoot, file), dest);
        }

        run(
            process.execPath,
            [
                join(repoDir, "build/scripts/finalize-fast-element-v3-rc.mjs"),
                "--apply",
                "--allow-script-overrides",
            ],
            { cwd: repoDir, stdio: "inherit" },
        );
        console.log("\nDry-run diff summary:");
        run("git", ["--no-pager", "diff", "--stat"], { cwd: repoDir, stdio: "inherit" });
    } finally {
        if (KEEP) {
            if (repoDir) {
                console.log(`Keeping disposable worktree: ${repoDir}`);
            }
        } else {
            if (repoDir && existsSync(repoDir)) {
                try {
                    run("git", ["worktree", "remove", "--force", repoDir], {
                        cwd: repoRoot,
                        stdio: "inherit",
                    });
                } catch (error) {
                    console.warn(
                        `Could not remove disposable worktree ${repoDir}: ${
                            error instanceof Error ? error.message : String(error)
                        }`,
                    );
                    gitSucceeds(["worktree", "prune"]);
                }
            }

            if (temp) {
                rmSync(temp, { recursive: true, force: true });
            }
        }
    }
}

try {
    if (APPLY) {
        applyFinalizer();
    } else {
        dryRun();
    }
} catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
}
