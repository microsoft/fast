import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

const directory = fileURLToPath(
    new URL(`.native-loader-${process.pid}/`, import.meta.url),
);
mkdirSync(directory);
after(() => rmSync(directory, { recursive: true, force: true }));
const loader = new URL("../native-host.mjs", import.meta.url).href;
const version = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url)),
).version;
let sequence = 0;

function probe(options = {}) {
    const config = {
        platform: "darwin",
        arch: "arm64",
        target: "darwin-arm64",
        ...options,
    };
    const root = join(directory, String(sequence++));
    mkdirSync(root);
    const name = `@microsoft/fast-build-${config.target}`;
    writeFileSync(
        join(root, "package.json"),
        JSON.stringify({
            name,
            version,
            fastBuild: { target: config.target, nodeApi: 8 },
            ...config.manifest,
        }),
    );
    writeFileSync(
        join(root, "native-build.json"),
        JSON.stringify({
            packageName: name,
            version,
            target: config.target,
            napi: 8,
            ...config.metadata,
        }),
    );
    const info = {
        version,
        napiVersion: 8,
        artifactFormat: "fast-server-native",
        artifactSchemas: [1, 2],
        ...config.info,
    };
    writeFileSync(
        join(root, "addon.cjs"),
        config.addon ??
            `
        module.exports = {
            NativeProgram: class NativeProgram {
                renderEntryJson() {}
                renderTemplateJson() {}
                renderHostJson() {}
                renderShadowJson() {}
            },
            nativeHostInfo: () => (${JSON.stringify(info)}),
        };
    `,
    );
    return JSON.parse(
        execFileSync(
            process.execPath,
            [
                "--input-type=module",
                "-e",
                `
        import fs from "node:fs";
        import { registerHooks, syncBuiltinESMExports } from "node:module";
        import { pathToFileURL } from "node:url";
        const config = ${JSON.stringify(config)};
        Object.defineProperty(process, "platform", { value: config.platform });
        Object.defineProperty(process, "arch", { value: config.arch });
        if (config.napi !== undefined) {
            Object.defineProperty(process.versions, "napi", { value: config.napi });
        }
        process.report.getReport = () => {
            if (config.reportError) throw new Error("disabled");
            return config.report ?? { header: {}, sharedObjects: [] };
        };
        const originalRead = fs.readFileSync;
        fs.readFileSync = (path, ...args) =>
            path === "/proc/self/maps" ? (config.maps ?? "") : originalRead(path, ...args);
        syncBuiltinESMExports();
        const requests = [];
        registerHooks({
            resolve(specifier, context, next) {
                if (!specifier.startsWith("@microsoft/fast-build-")) return next(specifier, context);
                requests.push(specifier);
                if (config.missing) {
                    throw Object.assign(new Error("Cannot find module " + specifier), { code: "MODULE_NOT_FOUND" });
                }
                const file = specifier.endsWith("/package.json") ? "package.json"
                    : specifier.endsWith("/native-build.json") ? "native-build.json" : "addon.cjs";
                return { url: pathToFileURL(${JSON.stringify(root)} + "/" + file).href, shortCircuit: true };
            },
        });
        try {
            const { loadNativeHost } = await import(${JSON.stringify(loader)});
            const Program = loadNativeHost(config.explicit ? ${JSON.stringify(join(root, "addon.cjs"))} : undefined);
            console.log(JSON.stringify({ ok: typeof Program === "function", requests }));
        } catch (error) {
            console.log(JSON.stringify({ code: error.code, message: error.message, cause: error.cause?.message, requests }));
        }
    `,
            ],
            { encoding: "utf8", cwd: resolve(directory), timeout: 10_000 },
        ),
    );
}

test("selects only the exact host OS/architecture/libc package", () => {
    for (const host of [
        { platform: "darwin", arch: "arm64", target: "darwin-arm64" },
        { platform: "darwin", arch: "x64", target: "darwin-x64" },
        { platform: "win32", arch: "x64", target: "win32-x64-msvc" },
        {
            platform: "linux",
            arch: "x64",
            target: "linux-x64-gnu",
            report: { header: { glibcVersionRuntime: "2.35" } },
        },
        {
            platform: "linux",
            arch: "x64",
            target: "linux-x64-musl",
            report: { sharedObjects: ["/lib/ld-musl-x86_64.so.1"] },
        },
        {
            platform: "linux",
            arch: "x64",
            target: "linux-x64-musl",
            reportError: true,
            maps: "/lib/ld-musl-x86_64.so.1\n",
        },
        {
            platform: "linux",
            arch: "x64",
            target: "linux-x64-gnu",
            reportError: true,
            maps: "/usr/lib/x86_64-linux-gnu/libc.so.6\n",
        },
    ]) {
        const result = probe(host);
        assert.equal(result.ok, true, JSON.stringify(result));
        assert.ok(result.requests.length >= 3);
        assert.ok(
            result.requests.every(
                name =>
                    name === `@microsoft/fast-build-${host.target}` ||
                    name.startsWith(`@microsoft/fast-build-${host.target}/`),
            ),
        );
    }
});

test("unsupported hosts and unknown libc fail without attempting package resolution", () => {
    for (const host of [
        { platform: "linux", arch: "arm64" },
        { platform: "freebsd" },
        { platform: "win32", arch: "arm64" },
        { platform: "linux", arch: "x64" },
    ]) {
        const result = probe(host);
        assert.equal(result.code, "unsupported-platform");
        assert.match(result.message, /source-built addon/);
        assert.deepEqual(result.requests, []);
    }
});

test("missing optional packages have actionable install and deployment guidance", () => {
    const result = probe({ missing: true });
    assert.equal(result.code, "native-package-missing");
    assert.match(
        result.message,
        new RegExp(`@microsoft/fast-build-darwin-arm64@${version}`),
    );
    assert.match(result.message, /optional dependencies enabled/);
    assert.match(result.message, /server deployment output/);
    assert.match(result.cause, /Cannot find module/);
});

test("rejects mismatched package, binary and API identity before returning a constructor", () => {
    for (const [options, code] of [
        [{ manifest: { version: "0.0.0" } }, "native-version-mismatch"],
        [{ metadata: { version: "0.0.0" } }, "native-version-mismatch"],
        [{ manifest: { name: "@other/native" } }, "native-incompatible"],
        [{ metadata: { target: "linux-x64-musl" } }, "native-incompatible"],
        [{ metadata: { napi: 9 } }, "native-api-mismatch"],
        [{ napi: "7" }, "native-api-mismatch"],
        [{ napi: "" }, "native-api-mismatch"],
        [{ info: { version: "0.0.0" } }, "native-version-mismatch"],
        [{ info: { artifactFormat: "other" } }, "native-api-mismatch"],
        [{ info: { artifactSchemas: [1] } }, "native-api-mismatch"],
        [{ info: { napiVersion: 9 } }, "native-api-mismatch"],
        [
            {
                addon: `module.exports = {
                    NativeProgram: class {},
                    nativeHostInfo: () => (${JSON.stringify({
                        version,
                        napiVersion: 8,
                        artifactFormat: "fast-server-native",
                        artifactSchemas: [2],
                    })}),
                };`,
            },
            "native-api-mismatch",
        ],
        [
            { addon: "module.exports = { NativeProgram: class {} };" },
            "native-api-mismatch",
        ],
        [
            {
                addon: `module.exports = { nativeHostInfo: () => (${JSON.stringify({ version, napiVersion: 8, artifactFormat: "fast-server-native", artifactSchemas: [2] })}) };`,
            },
            "native-incompatible",
        ],
    ]) {
        const result = probe(options);
        assert.equal(result.code, code, JSON.stringify(result));
    }
});

test("native loading failures retain their cause and never try another package", () => {
    const result = probe({
        addon: 'throw Object.assign(new Error("invalid ELF header"), {code:"ERR_DLOPEN_FAILED"});',
    });
    assert.equal(result.code, "native-load-failed");
    assert.equal(result.cause, "invalid ELF header");
    assert.match(result.message, /libc and shared libraries/);
    assert.equal(
        new Set(
            result.requests.map(name =>
                name.replace(/\/(?:package|native-build)\.json$/, ""),
            ),
        ).size,
        1,
    );
});

test("explicit paths bypass unsupported host detection and packaged identity requirements", () => {
    const result = probe({
        platform: "freebsd",
        explicit: true,
        missing: true,
        addon: "module.exports = { NativeProgram: class {} };",
    });
    assert.equal(result.ok, true);
    assert.deepEqual(result.requests, []);
});
