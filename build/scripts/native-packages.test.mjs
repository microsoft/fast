import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import {
    nativeTargets,
    validateGlibcVersions,
    validateNativeArtifact,
    validateNativePipelines,
    validateNativeVersions,
} from "./native-packages.mjs";

const require = createRequire(import.meta.url);
const config = readFileSync(
    new URL("../../beachball.config.js", import.meta.url),
    "utf8",
);

test("the six native packages, root local pins and lockfile stay in sync", () => {
    assert.deepEqual(Object.keys(nativeTargets), [
        "darwin-arm64",
        "darwin-x64",
        "linux-arm64-gnu",
        "linux-x64-gnu",
        "win32-arm64-msvc",
        "win32-x64-msvc",
    ]);
    const parent = validateNativeVersions();
    const lock = JSON.parse(
        readFileSync(new URL("../../package-lock.json", import.meta.url), "utf8"),
    );
    assert.deepEqual(
        lock.packages["packages/fast-build"].optionalDependencies,
        parent.optionalDependencies,
    );
    const root = JSON.parse(
        readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
    );
    assert.deepEqual(lock.packages[""].optionalDependencies, root.optionalDependencies);
    assert.deepEqual(
        Object.keys(lock.packages)
            .filter(path => path.startsWith("packages/fast-build/native/"))
            .map(path => path.split("/").at(-1)),
        Object.keys(nativeTargets),
    );
    for (const [target, platform] of Object.entries(nativeTargets)) {
        const path = `packages/fast-build/native/${target}`;
        assert.equal(lock.packages[path].version, parent.version);
        assert.deepEqual(lock.packages[path].os, [platform.os]);
        assert.deepEqual(lock.packages[path].cpu, [platform.cpu]);
    }
});

test("source builder accepts all matching Rust triples and rejects version skew", () => {
    const builderUrl = new URL(
        "../../packages/fast-build/build-native-host.mjs",
        import.meta.url,
    );
    const source = readFileSync(builderUrl, "utf8")
        .replace(/^import .*;\n/gm, "")
        .replaceAll("import.meta.url", JSON.stringify(builderUrl.href));
    const parent = validateNativeVersions();
    for (const [target, platform] of Object.entries(nativeTargets)) {
        const native = JSON.parse(
            readFileSync(
                new URL(
                    `../../packages/fast-build/native/${target}/package.json`,
                    import.meta.url,
                ),
                "utf8",
            ),
        );
        function build(pkg, triple = platform.triple) {
            const writes = new Map();
            vm.runInNewContext(source, {
                URL,
                fileURLToPath,
                resolve,
                process: {
                    argv: [
                        "node",
                        fileURLToPath(builderUrl),
                        "--package",
                        target,
                        "--target",
                        triple,
                        "--addon",
                        "fixture.node",
                    ],
                    env: {},
                },
                execFileSync: () => "reviewed\n",
                copyFileSync() {},
                mkdirSync() {},
                readFileSync(path) {
                    const location = String(path).replaceAll("\\", "/");
                    if (location.endsWith(`/native/${target}/package.json`)) {
                        return JSON.stringify(pkg);
                    }
                    if (location.endsWith("/package.json")) return JSON.stringify(parent);
                    if (location.endsWith("/Cargo.toml")) {
                        return 'napi = { version = "3", features = ["napi8"] }';
                    }
                    throw new Error(`Unexpected builder read: ${location}`);
                },
                writeFileSync: (path, content) => writes.set(path, content),
                console: { log() {} },
            });
            return writes;
        }
        const writes = build(native);
        const identity = [...writes].find(([path]) => path.endsWith("native-build.json"));
        assert.equal(JSON.parse(identity[1]).target, target);
        assert.equal(JSON.parse(identity[1]).version, parent.version);
        assert.throws(
            () => build({ ...native, version: "0.0.0" }),
            /exactly match the parent/,
        );
        assert.throws(() => build(native, "wrong-triple"), /does not match/);
    }
});

test("Linux symbol qualification rejects requirements newer than GLIBC_2.35", () => {
    assert.doesNotThrow(() =>
        validateGlibcVersions("Name: GLIBC_2.2.5 Name: GLIBC_2.9 Name: GLIBC_2.35"),
    );
    for (const version of ["GLIBC_2.36", "GLIBC_2.35.1", "GLIBC_3.0", "GLIBC_PRIVATE"]) {
        assert.throws(() => validateGlibcVersions(`Name: ${version}`), /maximum/);
    }
    assert.throws(
        () => validateGlibcVersions("not an ELF version table"),
        /did not report/,
    );
});

test("pipeline guard requires six qualified target artifacts and Linux baseline checks", () => {
    const azure = readFileSync(
        new URL("../../azure-pipelines-cd.yml", import.meta.url),
        "utf8",
    );
    const workflow = readFileSync(
        new URL("../../.github/workflows/native-packages.yml", import.meta.url),
        "utf8",
    );
    assert.doesNotThrow(() => validateNativePipelines(azure, workflow));
    for (const modified of [
        azure.replace('"$count" -ne 6', '"$count" -ne 5'),
        azure.replace("linux-arm64-gnu linux-x64-gnu", "linux-x64-gnu"),
    ]) {
        assert.throws(() => validateNativePipelines(modified, workflow), /six/);
    }
    for (const modified of [
        workflow.replace("target: linux-arm64-gnu", "target: linux-x64-gnu"),
        workflow.replace("os: macos-15,", "os: macos-14,"),
        workflow.replace(
            "os: windows-11-arm, arch: arm64",
            "os: windows-2022, arch: x64",
        ),
        workflow.replace(
            "os: ubuntu-24.04-arm, arch: arm64",
            "os: ubuntu-22.04, arch: x64",
        ),
        workflow.replace("node build/scripts/check-native-glibc.mjs", "echo skipped"),
        workflow.replace(
            'if [[ "$TARGET" == linux-* ]]; then',
            'if [[ "$TARGET" == linux-x64-gnu ]]; then',
        ),
        workflow.replaceAll(
            "name: unqualified-native-${{ matrix.target }}",
            "name: wrong-artifact",
        ),
        workflow.replaceAll("process.arch !== process.env.EXPECTED_ARCH", "false"),
    ]) {
        assert.throws(() => validateNativePipelines(azure, modified));
    }
});

test("release verification rejects replaced tarballs and mismatched native provenance", () => {
    const tarball = Buffer.from("qualified archive");
    const identity = {
        packageName: "@microsoft/fast-build-linux-arm64-gnu",
        version: "0.22.0",
        target: "linux-arm64-gnu",
        sourceRevision: "reviewed",
        napi: 8,
        sha256: createHash("sha256").update(tarball).digest("hex"),
    };
    const verify = (metadata, bytes = tarball) =>
        validateNativeArtifact(metadata, bytes, "linux-arm64-gnu", "0.22.0", "reviewed");
    assert.doesNotThrow(() => verify(identity));
    assert.throws(() => verify(identity, Buffer.from("replacement")), /reviewed release/);
    for (const [field, value] of [
        ["version", "0.21.0"],
        ["sourceRevision", "unreviewed"],
        ["target", "linux-x64-gnu"],
        ["packageName", "@other/binary"],
        ["napi", 9],
    ]) {
        assert.throws(() => verify({ ...identity, [field]: value }), /reviewed release/);
    }
});

test("Beachball bump synchronizes native manifests, exact pins, lockfile and Rust versions", () => {
    const root = "/fixture";
    const targets = [
        "darwin-arm64",
        "darwin-x64",
        "linux-arm64-gnu",
        "linux-x64-gnu",
        "win32-arm64-msvc",
        "win32-x64-msvc",
    ];
    const dependencies = Object.fromEntries(
        targets.map(target => [`@microsoft/fast-build-${target}`, "^0.21.0"]),
    );
    const files = new Map([
        [
            join(root, "packages/fast-build/package.json"),
            JSON.stringify({
                name: "@microsoft/fast-build",
                version: "0.22.0",
                optionalDependencies: dependencies,
            }),
        ],
    ]);
    const packages = { "packages/fast-build": { optionalDependencies: dependencies } };
    for (const target of targets) {
        const path = `packages/fast-build/native/${target}`;
        files.set(
            join(root, path, "package.json"),
            JSON.stringify({
                name: `@microsoft/fast-build-${target}`,
                version: "0.21.0",
                fastBuild: { target, nodeApi: 8 },
            }),
        );
        packages[path] = { version: "0.21.0", optional: true };
    }
    files.set(join(root, "package-lock.json"), JSON.stringify({ packages }));
    for (const crate of ["microsoft-fast-build", "microsoft-fast-convert"]) {
        files.set(
            join(root, `crates/${crate}/Cargo.toml`),
            `[package]\nname = "${crate}"\nversion = "0.21.0"\n`,
        );
        files.set(
            join(root, `crates/${crate}/Cargo.lock`),
            `[[package]]\nname = "${crate}"\nversion = "0.21.0"\n\n[[package]]\nname = "unrelated"\nversion = "1.0.0"\n`,
        );
    }
    const context = {
        __dirname: root,
        module: { exports: {} },
        console: { log() {} },
        require(name) {
            if (name !== "node:fs") return require(name);
            return {
                existsSync: path => files.has(path),
                readFileSync: path => files.get(path),
                writeFileSync: (path, content) => files.set(path, content),
            };
        },
    };
    vm.runInNewContext(config, context);
    context.module.exports.hooks.postbump(
        "/fixture/packages/fast-build",
        "@microsoft/fast-build",
        "0.22.0",
    );
    const parent = JSON.parse(files.get(join(root, "packages/fast-build/package.json")));
    const lock = JSON.parse(files.get(join(root, "package-lock.json")));
    for (const target of targets) {
        const name = `@microsoft/fast-build-${target}`;
        const path = `packages/fast-build/native/${target}`;
        assert.equal(parent.optionalDependencies[name], "0.22.0");
        assert.equal(
            lock.packages["packages/fast-build"].optionalDependencies[name],
            "0.22.0",
        );
        assert.equal(lock.packages[path].version, "0.22.0");
        assert.equal(
            JSON.parse(files.get(join(root, path, "package.json"))).version,
            "0.22.0",
        );
    }
    for (const crate of ["microsoft-fast-build", "microsoft-fast-convert"]) {
        assert.match(
            files.get(join(root, `crates/${crate}/Cargo.toml`)),
            /version = "0.22.0"/,
        );
        const lock = files.get(join(root, `crates/${crate}/Cargo.lock`));
        assert.match(lock, /version = "0.22.0"/);
        assert.match(lock, /name = "unrelated"\nversion = "1.0.0"/);
    }
});
