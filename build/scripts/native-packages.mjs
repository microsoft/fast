import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
export const nativeTargets = Object.freeze({
    "darwin-arm64": { os: "darwin", cpu: "arm64", triple: "aarch64-apple-darwin" },
    "darwin-x64": { os: "darwin", cpu: "x64", triple: "x86_64-apple-darwin" },
    "linux-arm64": {
        os: "linux",
        cpu: "arm64",
        libc: "glibc",
        triple: "aarch64-unknown-linux-gnu",
    },
    "linux-x64": {
        os: "linux",
        cpu: "x64",
        libc: "glibc",
        triple: "x86_64-unknown-linux-gnu",
    },
    "win32-arm64": { os: "win32", cpu: "arm64", triple: "aarch64-pc-windows-msvc" },
    "win32-x64": { os: "win32", cpu: "x64", triple: "x86_64-pc-windows-msvc" },
});

export function readJson(path) {
    return JSON.parse(readFileSync(path, "utf8"));
}

export function sourceRevision() {
    return execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: repoRoot,
        encoding: "utf8",
    }).trim();
}

export function nodeApiVersion() {
    const cargo = readFileSync(
        new URL("../../crates/microsoft-fast-build/Cargo.toml", import.meta.url),
        "utf8",
    );
    const match = cargo.match(/^napi\s*=.*features\s*=\s*\["napi(\d+)"\]/m);
    if (!match) throw new Error("Cannot determine Node-API requirement from Cargo.toml.");
    return Number(match[1]);
}

export function validateNativeVersions() {
    const parent = readJson(
        new URL("../../packages/fast-build/package.json", import.meta.url),
    );
    const root = readJson(new URL("../../package.json", import.meta.url));
    const expectedNames = Object.keys(nativeTargets).map(
        target => `@microsoft/fast-build-${target}`,
    );
    for (const pkg of [parent, root]) {
        const names = Object.keys(pkg.optionalDependencies ?? {}).filter(name =>
            name.startsWith("@microsoft/fast-build-"),
        );
        if (
            names.length !== expectedNames.length ||
            names.some(name => !expectedNames.includes(name))
        ) {
            throw new Error(
                "FAST Build must declare exactly the supported native packages.",
            );
        }
    }
    for (const [target, platform] of Object.entries(nativeTargets)) {
        const pkg = readJson(
            new URL(
                `../../packages/fast-build/native/${target}/package.json`,
                import.meta.url,
            ),
        );
        if (
            pkg.name !== `@microsoft/fast-build-${target}` ||
            pkg.version !== parent.version ||
            parent.optionalDependencies?.[pkg.name] !== parent.version ||
            root.optionalDependencies?.[pkg.name] !==
                `file:packages/fast-build/native/${target}`
        ) {
            throw new Error(
                `Native package ${pkg.name} must exactly match ${parent.version}.`,
            );
        }
        if (
            pkg.fastBuild?.target !== target ||
            pkg.fastBuild?.nodeApi !== nodeApiVersion() ||
            JSON.stringify(pkg.os) !== JSON.stringify([platform.os]) ||
            JSON.stringify(pkg.cpu) !== JSON.stringify([platform.cpu]) ||
            JSON.stringify(pkg.libc) !==
                JSON.stringify(platform.libc ? [platform.libc] : undefined)
        ) {
            throw new Error(
                `Native package ${pkg.name} has incorrect platform metadata.`,
            );
        }
    }
    return parent;
}

export function validateNativeArtifact(identity, tarball, target, version, revision) {
    if (
        !Object.hasOwn(nativeTargets, target) ||
        identity.packageName !== `@microsoft/fast-build-${target}` ||
        identity.version !== version ||
        identity.sourceRevision !== revision ||
        identity.target !== target ||
        identity.napi !== nodeApiVersion() ||
        identity.sha256 !== createHash("sha256").update(tarball).digest("hex")
    ) {
        throw new Error(
            `Native tarball for ${target} does not match the reviewed release.`,
        );
    }
}

export function validateGlibcVersions(output) {
    const versions = [...new Set(output.match(/\bGLIBC_[A-Za-z0-9_.]+/g))];
    if (versions.length === 0) {
        throw new Error("readelf did not report any GLIBC symbol requirements.");
    }
    for (const version of versions) {
        const match = /^GLIBC_(\d+)\.(\d+)(?:\.(\d+))?$/.exec(version);
        const [major, minor, patch] = match
            ? match.slice(1).map(value => Number(value ?? 0))
            : [];
        if (
            !match ||
            major > 2 ||
            (major === 2 && (minor > 35 || (minor === 35 && patch > 0)))
        ) {
            throw new Error(`Native addon requires ${version}; maximum is GLIBC_2.35.`);
        }
    }
}
