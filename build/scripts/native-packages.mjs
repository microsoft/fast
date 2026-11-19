import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
export const nativeTargets = Object.freeze({
    "darwin-arm64": { os: "darwin", cpu: "arm64", triple: "aarch64-apple-darwin" },
    "darwin-x64": { os: "darwin", cpu: "x64", triple: "x86_64-apple-darwin" },
    "linux-arm64-gnu": {
        os: "linux",
        cpu: "arm64",
        libc: "glibc",
        triple: "aarch64-unknown-linux-gnu",
    },
    "linux-x64-gnu": {
        os: "linux",
        cpu: "x64",
        libc: "glibc",
        triple: "x86_64-unknown-linux-gnu",
    },
    "win32-arm64-msvc": { os: "win32", cpu: "arm64", triple: "aarch64-pc-windows-msvc" },
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

export function validateNativePipelines(pipeline, workflow) {
    const targets = Object.keys(nativeTargets);
    const runners = {
        "darwin-arm64": ["macos-15", "macos-15"],
        "darwin-x64": ["macos-15-intel", "macos-15-intel"],
        "linux-arm64-gnu": ["ubuntu-22.04", "ubuntu-24.04-arm"],
        "linux-x64-gnu": ["ubuntu-22.04", "ubuntu-22.04"],
        "win32-arm64-msvc": ["windows-11-arm", "windows-11-arm"],
        "win32-x64-msvc": ["windows-2022", "windows-2022"],
    };
    const expectedLoop = `for target in ${targets.join(" ")}; do`;
    if (
        !pipeline.includes(expectedLoop) ||
        !pipeline.includes(`if [ "$count" -ne ${targets.length} ]; then`)
    ) {
        throw new Error("Azure CD must require exactly all six native tarballs.");
    }
    const jobs = workflow.split(/^ {2}qualify:/m);
    for (const [index, job] of jobs.entries()) {
        const entries = [...job.matchAll(/^\s+- \{ target: ([^}]+)\}/gm)].map(match => {
            const [target, ...fields] = match[1].trim().split(", ");
            return {
                target,
                ...Object.fromEntries(fields.map(field => field.split(": "))),
            };
        });
        if (
            jobs.length !== 2 ||
            entries.length !== targets.length ||
            new Set(entries.map(entry => entry.target)).size !== targets.length
        ) {
            throw new Error(
                "Native build and qualification matrices must cover six targets.",
            );
        }
        for (const entry of entries) {
            const platform = nativeTargets[entry.target];
            const crossBuild = index === 0 && entry.target === "linux-arm64-gnu";
            if (
                !platform ||
                entry.os !== runners[entry.target][index] ||
                entry.arch !== (crossBuild ? "x64" : platform.cpu) ||
                (index === 0 && entry.triple !== platform.triple) ||
                (index === 1 && entry.platform !== platform.os)
            ) {
                throw new Error(
                    `Native matrix does not execute the correct target: ${entry.target}.`,
                );
            }
        }
    }
    if (
        !jobs[0].includes("node build/scripts/check-native-glibc.mjs") ||
        !jobs[0].includes('if [[ "$TARGET" == linux-* ]]; then') ||
        !jobs[0].includes(
            "CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc",
        ) ||
        !jobs[1].includes("name: unqualified-native-${{ matrix.target }}") ||
        !jobs[1].includes("name: native-${{ matrix.target }}") ||
        !jobs[1].includes("process.arch !== process.env.EXPECTED_ARCH")
    ) {
        throw new Error(
            "Native qualification must use the built target artifact and Linux baseline.",
        );
    }
}
