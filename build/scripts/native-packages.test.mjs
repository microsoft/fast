import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import test from "node:test";
import vm from "node:vm";
import { validateNativeArtifact } from "./native-packages.mjs";

const require = createRequire(import.meta.url);
const config = readFileSync(
    new URL("../../beachball.config.js", import.meta.url),
    "utf8",
);

test("release verification rejects replaced tarballs and mismatched native provenance", () => {
    const tarball = Buffer.from("qualified archive");
    const identity = {
        packageName: "@microsoft/fast-build-linux-x64-musl",
        version: "0.22.0",
        target: "linux-x64-musl",
        sourceRevision: "reviewed",
        napi: 8,
        sha256: createHash("sha256").update(tarball).digest("hex"),
    };
    const verify = (metadata, bytes = tarball) =>
        validateNativeArtifact(metadata, bytes, "linux-x64-musl", "0.22.0", "reviewed");
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
        "linux-x64-gnu",
        "linux-x64-musl",
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
