#!/usr/bin/env node
/**
 * Bumps the Rust crate version based on conventional commits since the last
 * Beachball-generated release tag, then packages the crate into publish_artifacts/cargo/.
 *
 * Beachball tags use the format: {package-name}_v{version}
 * e.g. microsoft-fast-build_v0.1.0
 *
 * Version bump rules (conventional commits):
 *   BREAKING CHANGE / feat!: / fix!: / refactor!: / chore!:  → major
 *   feat:                                                      → minor
 *   anything else                                              → patch
 *
 * Only commits that touch crates/microsoft-fast-build/ are considered.
 * If no such commits exist since the last Beachball tag, the script exits without change.
 */
import { execSync } from "node:child_process";
import { copyFileSync, globSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const crateDir = join(repoRoot, "crates", "microsoft-fast-build");
const cargoTomlPath = join(crateDir, "Cargo.toml");
const outputDir = join(repoRoot, "publish_artifacts", "cargo");

function getCurrentVersion() {
    const content = readFileSync(cargoTomlPath, "utf-8");
    const match = content.match(/^version\s*=\s*"([^"]+)"/m);
    if (!match) throw new Error("Could not find version in Cargo.toml");
    return match[1];
}

function parseVersion(version) {
    const [major, minor, patch] = version.split(".").map(Number);
    return { major, minor, patch };
}

function getCommitsSinceLastTag(crateName) {
    // Beachball generates tags in the format {package-name}_v{version}.
    // Find the latest matching tag rather than constructing one from the
    // current Cargo.toml version, which may diverge from the last release.
    const latestTag =
        execSync(
            `git -C "${repoRoot}" tag --list "${crateName}_v*" --sort=-version:refname`,
            { encoding: "utf-8" },
        )
            .trim()
            .split("\n")[0] || null;

    const range = latestTag ? `${latestTag}..HEAD` : "HEAD";
    const log = execSync(
        `git -C "${repoRoot}" log ${range} --pretty=format:"%s%n%b" -- crates/microsoft-fast-build/`,
        { encoding: "utf-8" },
    );
    return log.trim();
}

function determineBump(commits) {
    if (!commits) return null;

    if (
        /BREAKING CHANGE/m.test(commits) ||
        /^(feat|fix|refactor|chore)!(\([^)]*\))?:/m.test(commits)
    ) {
        return "major";
    }
    if (/^feat(\([^)]*\))?:/m.test(commits)) {
        return "minor";
    }
    return "patch";
}

function bumpVersion(version, bump) {
    const { major, minor, patch } = parseVersion(version);
    switch (bump) {
        case "major":
            return `${major + 1}.0.0`;
        case "minor":
            return `${major}.${minor + 1}.0`;
        case "patch":
            return `${major}.${minor}.${patch + 1}`;
    }
}

function updateCargoToml(newVersion) {
    let content = readFileSync(cargoTomlPath, "utf-8");
    content = content.replace(/^(version\s*=\s*)"[^"]+"/m, `$1"${newVersion}"`);
    writeFileSync(cargoTomlPath, content);
}

function packageCrate(version) {
    mkdirSync(outputDir, { recursive: true });
    execSync(
        `cargo package --manifest-path "${cargoTomlPath}" --no-verify --allow-dirty`,
        { stdio: "inherit" },
    );
    const targetPackageDir = join(crateDir, "target", "package");
    const crateFiles = globSync(`microsoft-fast-build-${version}.crate`, {
        cwd: targetPackageDir,
    });
    if (crateFiles.length === 0) {
        throw new Error(`Could not find packaged .crate file in ${targetPackageDir}`);
    }
    for (const file of crateFiles) {
        copyFileSync(join(targetPackageDir, file), join(outputDir, file));
        console.log(`Packaged ${file} → ${outputDir}`);
    }
}

const currentVersion = getCurrentVersion();
const commits = getCommitsSinceLastTag("microsoft-fast-build");
const bump = determineBump(commits);

if (!bump) {
    console.log("No changes to Rust crate since last release, skipping.");
    process.exit(0);
}

const newVersion = bumpVersion(currentVersion, bump);
console.log(`Bumping microsoft-fast-build: ${currentVersion} → ${newVersion} (${bump})`);

updateCargoToml(newVersion);
packageCrate(newVersion);
console.log(`Rust crate microsoft-fast-build@${newVersion} packaged to ${outputDir}/`);
