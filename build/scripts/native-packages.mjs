import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
export const nativeTargets = Object.freeze({
    "darwin-arm64": { os: "darwin", cpu: "arm64", triple: "aarch64-apple-darwin" },
    "darwin-x64": { os: "darwin", cpu: "x64", triple: "x86_64-apple-darwin" },
    "linux-x64-gnu": {
        os: "linux",
        cpu: "x64",
        libc: "glibc",
        triple: "x86_64-unknown-linux-gnu",
    },
    "linux-x64-musl": {
        os: "linux",
        cpu: "x64",
        libc: "musl",
        triple: "x86_64-unknown-linux-musl",
    },
    "win32-x64-msvc": { os: "win32", cpu: "x64", triple: "x86_64-pc-windows-msvc" },
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
    for (const target of Object.keys(nativeTargets)) {
        const pkg = readJson(
            new URL(
                `../../packages/fast-build/native/${target}/package.json`,
                import.meta.url,
            ),
        );
        if (
            pkg.version !== parent.version ||
            parent.optionalDependencies?.[pkg.name] !== parent.version
        ) {
            throw new Error(
                `Native package ${pkg.name} must exactly match ${parent.version}.`,
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
