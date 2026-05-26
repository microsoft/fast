const { existsSync, readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

/**
 * Convert an npm package name into the paired Rust crate name by dropping
 * the leading `@` and replacing `/` with `-`.
 *
 * Example: `@microsoft/fast-build` -> `microsoft-fast-build`.
 */
function npmNameToCrateName(npmName) {
    return npmName.replace(/^@/, "").replace(/\//g, "-");
}

/**
 * Rewrite the `version = "..."` line for a specific `[package]` or
 * `[[package]]` block (matched by the crate name) within Cargo TOML
 * content. Returns the new content, or `null` if no change was made.
 *
 * Hand-rolled (instead of using a TOML library) so beachball.config.js
 * does not pull in any new runtime dependencies.
 */
function rewriteCargoVersion(content, crateName, newVersion, { manifest }) {
    const lines = content.split("\n");
    let inTargetBlock = false;
    let nameMatched = manifest;
    let changed = false;

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();

        if (trimmed.startsWith("[")) {
            if (manifest) {
                inTargetBlock = trimmed === "[package]";
            } else {
                inTargetBlock = trimmed === "[[package]]";
                nameMatched = false;
            }
            continue;
        }

        if (!inTargetBlock) continue;

        if (!manifest && !nameMatched) {
            const nameMatch = /^name\s*=\s*"([^"]+)"/.exec(trimmed);
            if (nameMatch && nameMatch[1] === crateName) {
                nameMatched = true;
                continue;
            }
        }

        if (nameMatched) {
            const versionMatch = /^(\s*version\s*=\s*")([^"]+)(")/.exec(lines[i]);
            if (versionMatch) {
                if (versionMatch[2] !== newVersion) {
                    lines[i] = `${versionMatch[1]}${newVersion}${versionMatch[3]}`;
                    changed = true;
                }
                if (manifest) break;
                inTargetBlock = false;
                nameMatched = false;
            }
        }
    }

    return changed ? lines.join("\n") : null;
}

/**
 * Beachball `postbump` hook: when an npm package with a paired Rust
 * crate is bumped, rewrite the crate's `Cargo.toml` (and matching entry
 * in `Cargo.lock`, if present) so the crate version stays in lock-step
 * with the npm version.
 *
 * Beachball commits any modified files in the same bump commit, so the
 * Cargo updates land in the same PR as the package.json bump.
 */
function syncPairedCrateVersion(packagePath, name, version) {
    const crateName = npmNameToCrateName(name);
    const cargoTomlPath = join(__dirname, "crates", crateName, "Cargo.toml");
    if (!existsSync(cargoTomlPath)) return;

    const updatedToml = rewriteCargoVersion(
        readFileSync(cargoTomlPath, "utf8"),
        crateName,
        version,
        { manifest: true },
    );
    if (updatedToml !== null) {
        writeFileSync(cargoTomlPath, updatedToml);
        console.log(`[beachball] Synced ${cargoTomlPath} to ${version}`);
    }

    const cargoLockPath = join(__dirname, "crates", crateName, "Cargo.lock");
    if (existsSync(cargoLockPath)) {
        const updatedLock = rewriteCargoVersion(
            readFileSync(cargoLockPath, "utf8"),
            crateName,
            version,
            { manifest: false },
        );
        if (updatedLock !== null) {
            writeFileSync(cargoLockPath, updatedLock);
            console.log(`[beachball] Synced ${cargoLockPath} to ${version}`);
        }
    }
}

module.exports = {
    ignorePatterns: [
        ".ignore",
        ".github/",
        ".prettierrc",
        ".vscode/",
        "jest..js",
        "src/e2e/",
        "src/tests/",
        "src/fixtures/**",
        // This one is especially important (otherwise dependabot would be blocked by change file requirements)
        "package-lock.json",
    ],
    packToPath: "publish_artifacts_npm",
    hooks: {
        postbump: syncPairedCrateVersion,
    },
};
