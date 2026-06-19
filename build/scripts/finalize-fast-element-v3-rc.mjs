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
const REF = readArg("--ref") ?? "HEAD";
const RC_SUFFIX = "fast-element-v3-rc-20260616";
const RC_DIST_TAG = "rc-20260616";

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

function readJson(path) {
    return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
    writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
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
    content = rewriteVersionReferences(content, finalVersions, rawVersions);
    writeFileSync(path, content);
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

function verifyFinalState(finalVersions) {
    for (const packageName of packageOrder) {
        const pkg = getPackage(packageName);
        if (pkg.version !== finalVersions[packageName]) {
            throw new Error(
                `${packageName} version is ${pkg.version}, expected ${finalVersions[packageName]}.`,
            );
        }
    }

    const cargoToml = readFileSync(
        join(repoRoot, "crates/microsoft-fast-build/Cargo.toml"),
        "utf8",
    );
    if (!/version\s*=\s*"0\.7\.0"/.test(cargoToml)) {
        throw new Error(
            "microsoft-fast-build Cargo.toml changed. The v3 RC finalizer must not version the Rust crate.",
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
    ensureCleanWorktree();
    ensureChangeFilesExist();

    runBeachballBump();

    const rawVersions = Object.fromEntries(
        packageOrder.map(packageName => [packageName, getPackage(packageName).version]),
    );
    const finalVersions = computeFinalVersions();

    rewritePackageVersions(finalVersions);
    rewriteChangelogs(finalVersions, rawVersions);
    updateLockfile();
    verifyFinalState(finalVersions);
    printVersionTable(finalVersions);
    previewReleases();
}

function dryRun() {
    const temp = mkdtempSync(join(tmpdir(), "fast-element-v3-rc-finalizer-"));
    const repoDir = join(temp, "repo");
    console.log(`Creating disposable worktree at ${repoDir}`);
    run("git", ["worktree", "add", "--detach", repoDir, REF], {
        cwd: repoRoot,
        stdio: "inherit",
    });

    try {
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
            console.log(`Keeping disposable worktree: ${repoDir}`);
        } else {
            run("git", ["worktree", "remove", "--force", repoDir], {
                cwd: repoRoot,
                stdio: "inherit",
            });
            rmSync(temp, { recursive: true, force: true });
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
