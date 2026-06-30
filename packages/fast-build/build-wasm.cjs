#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const packageDir = __dirname;
const repoRoot = path.resolve(packageDir, "../..");

/**
 * @param {string} command
 * @param {string[]} args
 */
function run(command, args) {
    execFileSync(command, args, {
        cwd: packageDir,
        stdio: "inherit",
    });
}

/**
 * @param {string} crateName
 * @param {string} outDir
 * @param {boolean} required
 */
function buildCrate(crateName, outDir, required) {
    const crateDir = path.join(repoRoot, "crates", crateName);
    const manifest = path.join(crateDir, "Cargo.toml");

    if (!fs.existsSync(manifest)) {
        if (required) {
            throw new Error(`Required crate manifest not found: ${manifest}`);
        }

        process.stdout.write(
            `Skipping ${crateName} WASM build; ${path.relative(repoRoot, manifest)} not found.\n`,
        );
        return;
    }

    run("cargo", ["build", "--manifest-path", manifest]);
    run("wasm-pack", ["build", "--target", "nodejs", crateDir, "--out-dir", outDir]);
}

buildCrate("microsoft-fast-build", path.join(packageDir, "wasm"), true);
buildCrate("microsoft-fast-convert", path.join(packageDir, "wasm", "convert"), true);
