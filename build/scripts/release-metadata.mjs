import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, sep } from "node:path";

export function gitTagExists(tag, root = ".") {
    const result = spawnSync(
        "git",
        ["show-ref", "--verify", "--quiet", `refs/tags/${tag}`],
        {
            cwd: root,
            encoding: "utf8",
        },
    );
    if (result.error) throw result.error;
    if (result.status === 0) return true;
    if (result.status === 1) return false;
    throw new Error(`Unable to inspect git tag: ${result.stderr.trim()}`);
}

export function hotfixTagFor(name, version) {
    return `hotfix/${name}_v${version}`;
}

export function parseReleaseVersion(version) {
    if (typeof version !== "string" || version.length > 128) {
        throw new Error("Expected a canonical release version without build metadata.");
    }
    const match =
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(
            version,
        );
    if (
        !match ||
        match[0] !== version ||
        match[4]?.split(".").some(part => /^\d+$/.test(part) && /^0\d/.test(part))
    ) {
        throw new Error("Expected a canonical release version without build metadata.");
    }
    return { major: match[1], minor: match[2], patch: match[3], prerelease: match[4] };
}

export function compareReleaseVersions(left, right) {
    const a = parseReleaseVersion(left);
    const b = parseReleaseVersion(right);
    for (const key of ["major", "minor", "patch"]) {
        if (BigInt(a[key]) !== BigInt(b[key]))
            return BigInt(a[key]) > BigInt(b[key]) ? 1 : -1;
    }
    if (a.prerelease === b.prerelease) return 0;
    if (!a.prerelease) return 1;
    if (!b.prerelease) return -1;
    const aParts = a.prerelease.split(".");
    const bParts = b.prerelease.split(".");
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        if (aParts[i] === undefined) return -1;
        if (bParts[i] === undefined) return 1;
        if (aParts[i] === bParts[i]) continue;
        const aNumeric = /^\d+$/.test(aParts[i]);
        const bNumeric = /^\d+$/.test(bParts[i]);
        if (aNumeric && bNumeric) return BigInt(aParts[i]) > BigInt(bParts[i]) ? 1 : -1;
        if (aNumeric !== bNumeric) return aNumeric ? -1 : 1;
        return aParts[i] > bParts[i] ? 1 : -1;
    }
    return 0;
}

export function excludeHotfixWorkspaces(workspaces, root = ".") {
    return workspaces.filter(({ name, version }) => {
        const tag = hotfixTagFor(name, version);
        if (!gitTagExists(tag, root) && !gitTagExists(`deployed/${tag}`, root))
            return true;
        console.log(
            `Skipping hotfix-only version ${name}@${version}: no GitHub release.`,
        );
        return false;
    });
}

export function readCargoPackage(content) {
    let inPackage = false;
    const pkg = {};
    for (const rawLine of content.split("\n")) {
        const line = rawLine.trim();
        if (line.startsWith("[")) {
            inPackage = line === "[package]";
            continue;
        }
        if (!inPackage) continue;
        const match = /^(name|version)\s*=\s*"([^"]+)"/.exec(line);
        if (match) pkg[match[1]] = match[2];
    }
    return pkg;
}

export function pairedCrateNames(name) {
    return name === "@microsoft/fast-build"
        ? ["microsoft-fast-build", "microsoft-fast-convert"]
        : [name.replace(/^@/, "").replace(/\//g, "-")];
}

export function listPairedCrates(
    name,
    version,
    root = ".",
    skip = process.env.FAST_RELEASE_SKIP_CRATES === "true",
) {
    if (skip) return [];
    const crates = [];
    for (const crateName of pairedCrateNames(name)) {
        const cargoTomlPath = `crates/${crateName}/Cargo.toml`;
        if (!existsSync(join(root, cargoTomlPath))) continue;
        const pkg = readCargoPackage(readFileSync(join(root, cargoTomlPath), "utf8"));
        if (pkg.version !== version) {
            throw new Error(
                `Version mismatch for ${name}: package.json is ${version} ` +
                    `but ${cargoTomlPath} is ${pkg.version}. Update one to match the other.`,
            );
        }
        crates.push({ crateName, cargoTomlPath });
    }
    return crates;
}

export function listPublishableWorkspaces(root = ".") {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const locations = new Set();
    for (const pattern of pkg.workspaces || []) {
        if (pattern.endsWith("/*")) {
            const parent = pattern.slice(0, -2);
            if (!existsSync(join(root, parent))) continue;
            for (const entry of readdirSync(join(root, parent), {
                withFileTypes: true,
            })) {
                if (entry.isDirectory()) {
                    locations.add(join(parent, entry.name).split(sep).join("/"));
                }
            }
        } else {
            locations.add(pattern);
        }
    }
    const workspaces = [];
    for (const location of locations) {
        const path = join(root, location, "package.json");
        if (!existsSync(path)) continue;
        const workspace = JSON.parse(readFileSync(path, "utf8"));
        if (workspace.private === true || !workspace.name || !workspace.version) continue;
        workspaces.push({
            location,
            name: workspace.name,
            version: workspace.version,
        });
    }
    return workspaces;
}
