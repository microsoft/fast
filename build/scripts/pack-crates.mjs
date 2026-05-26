#!/usr/bin/env node
/**
 * Pack every paired Rust crate into `publish_artifacts_crates/`.
 *
 * Companion to beachball's `--no-publish` mode (which packs npm
 * workspaces into `publish_artifacts_npm/`). Wired into the
 * `publish-ci` npm script so that a single `npm run publish-ci`
 * produces both npm tarballs and crate archives for local
 * end-to-end testing of the publish flow.
 *
 * Mirrors the workspace discovery / crate-pairing logic used by
 * `create-github-releases.mjs`: the paired crate name is the npm
 * name with the leading `@` dropped and `/` replaced by `-`. The
 * script is a no-op for npm packages without a paired crate, and
 * errors out if the crate version disagrees with the npm version.
 */

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const CRATES_DIR = "publish_artifacts_crates";

function run(file, args, opts = {}) {
    return execFileSync(file, args, { encoding: "utf8", ...opts });
}

function npmNameToCrateName(npmName) {
    return npmName.replace(/^@/, "").replace(/\//g, "-");
}

function readCargoTomlVersion(cargoTomlPath) {
    const content = readFileSync(cargoTomlPath, "utf8");
    let inPackage = false;
    for (const rawLine of content.split("\n")) {
        const line = rawLine.trim();
        if (line.startsWith("[")) {
            inPackage = line === "[package]";
            continue;
        }
        if (!inPackage) continue;
        const m = /^version\s*=\s*"([^"]+)"/.exec(line);
        if (m) return m[1];
    }
    return null;
}

function listWorkspaceLocations() {
    const rootPkg = JSON.parse(readFileSync("package.json", "utf8"));
    const locations = new Set();
    for (const pattern of rootPkg.workspaces || []) {
        if (pattern.endsWith("/*")) {
            const parent = pattern.slice(0, -2);
            if (!existsSync(parent)) continue;
            for (const entry of readdirSync(parent, { withFileTypes: true })) {
                if (entry.isDirectory()) locations.add(join(parent, entry.name));
            }
        } else {
            locations.add(pattern);
        }
    }
    return [...locations];
}

const pairs = [];
for (const location of listWorkspaceLocations()) {
    const pkgPath = join(location, "package.json");
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    if (pkg.private === true) continue;
    if (!pkg.name || !pkg.version) continue;

    const crateName = npmNameToCrateName(pkg.name);
    const cargoTomlPath = join("crates", crateName, "Cargo.toml");
    if (!existsSync(cargoTomlPath)) continue;

    const crateVersion = readCargoTomlVersion(cargoTomlPath);
    if (crateVersion !== pkg.version) {
        throw new Error(
            `Version mismatch for ${pkg.name}: package.json is ${pkg.version} but ${cargoTomlPath} is ${crateVersion}. Update one to match the other.`,
        );
    }

    pairs.push({ name: pkg.name, version: pkg.version, crateName, cargoTomlPath });
}

if (pairs.length === 0) {
    console.log("No paired crates to pack.");
    process.exit(0);
}

mkdirSync(CRATES_DIR, { recursive: true });
const destRoot = resolve(CRATES_DIR);

for (const { name, version, crateName, cargoTomlPath } of pairs) {
    console.log(`\nPackaging crate ${crateName}@${version} (paired with ${name})...`);
    run(
        "cargo",
        ["package", "--no-verify", "--allow-dirty", "--manifest-path", cargoTomlPath],
        {
            stdio: "inherit",
        },
    );
    const srcCrate = join(
        "crates",
        crateName,
        "target",
        "package",
        `${crateName}-${version}.crate`,
    );
    if (!existsSync(srcCrate)) {
        throw new Error(
            `Expected ${srcCrate} after cargo package, but it does not exist.`,
        );
    }
    const destCrate = join(destRoot, basename(srcCrate));
    copyFileSync(srcCrate, destCrate);
    console.log(`  -> ${destCrate}`);
}

console.log(`\nPacked ${pairs.length} crate(s) into ${CRATES_DIR}/`);
