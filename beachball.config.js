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

const bundledCratesByPackage = new Map([
    ["@microsoft/fast-build", ["microsoft-fast-build", "microsoft-fast-convert"]],
]);

function npmNameToCrateNames(npmName) {
    return bundledCratesByPackage.get(npmName) ?? [npmNameToCrateName(npmName)];
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
 * Beachball `postbump` hook: when an npm package with paired Rust
 * crates is bumped, rewrite each crate's `Cargo.toml` (and matching entry
 * in `Cargo.lock`, if present). FAST Build's native package manifests,
 * exact optional pins and npm lock entries also stay in lock-step.
 *
 * Beachball commits any modified files in the same bump commit, so the
 * Cargo updates land in the same PR as the package.json bump.
 */
function syncPairedCrateVersion(packagePath, name, version) {
    if (name === "@microsoft/fast-build") {
        const parentPath = join(__dirname, "packages/fast-build/package.json");
        const parent = JSON.parse(readFileSync(parentPath, "utf8"));
        for (const nativeName of Object.keys(parent.optionalDependencies ?? {})) {
            if (!nativeName.startsWith("@microsoft/fast-build-")) continue;
            parent.optionalDependencies[nativeName] = version;
            const target = nativeName.replace("@microsoft/fast-build-", "");
            const nativePath = join(
                __dirname,
                "packages/fast-build/native",
                target,
                "package.json",
            );
            const native = JSON.parse(readFileSync(nativePath, "utf8"));
            native.version = version;
            writeFileSync(nativePath, `${JSON.stringify(native, null, 2)}\n`);
        }
        writeFileSync(parentPath, `${JSON.stringify(parent, null, 2)}\n`);
        // Beachball updates the npm lock before postbump. Preserve exact pins there too.
        const lockPath = join(__dirname, "package-lock.json");
        const lock = JSON.parse(readFileSync(lockPath, "utf8"));
        const entry = lock.packages?.["packages/fast-build"];
        if (entry) {
            entry.optionalDependencies = { ...parent.optionalDependencies };
            for (const target of Object.keys(parent.optionalDependencies)) {
                const location = `packages/fast-build/native/${target.replace("@microsoft/fast-build-", "")}`;
                if (lock.packages[location]) lock.packages[location].version = version;
            }
            writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
        }
    }
    for (const crateName of npmNameToCrateNames(name)) {
        const cargoTomlPath = join(__dirname, "crates", crateName, "Cargo.toml");
        if (!existsSync(cargoTomlPath)) continue;

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
}

// `npm run checkchange` is wrapped by `build/scripts/checkchange.mjs`,
// which can skip `beachball check` for maintainer-authored manual bump
// branches (see CONTRIBUTING.md > "Manual version bumps"). The
// `ignorePatterns` and `hooks` below still apply when beachball runs.
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
        "**/test/declarative/fixtures/**",
        // This one is especially important (otherwise dependabot would be blocked by change file requirements)
        "package-lock.json",
    ],
    hooks: {
        postbump: syncPairedCrateVersion,
    },
};
