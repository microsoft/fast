import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
    cpSync,
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../", import.meta.url));
const npm = process.platform === "win32" ? process.execPath : "npm";
const npmPrefix =
    process.platform === "win32"
        ? [join(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js")]
        : [];
const root = resolve(source, "../..", `.native-package-${process.pid}`);
const artifact = {
    format: "fast-server-native",
    version: 2,
    inputs: { entry: "<p>{{message}}</p>", templates: {} },
    program: {
        components: {},
        templates: {},
        entry: [
            { html: "<p>", type: "literal" },
            { escape: true, path: ["message"], type: "binding" },
            { html: "</p>", type: "literal" },
        ],
    },
};

function command(executable, args, cwd, env = process.env) {
    return execFileSync(executable, args, {
        cwd,
        env,
        encoding: "utf8",
        timeout: 120_000,
        stdio: ["ignore", "pipe", "pipe"],
    });
}

function pack(directory, destination) {
    const result = command(
        npm,
        [
            ...npmPrefix,
            "pack",
            "--json",
            "--ignore-scripts",
            "--workspaces=false",
            "--pack-destination",
            destination,
        ],
        directory,
    );
    return join(destination, JSON.parse(result)[0].filename);
}

function unpack(tarball, directory) {
    mkdirSync(directory, { recursive: true });
    command("tar", ["-xzf", tarball, "--strip-components=1", "-C", directory], source);
}

function node(script, cwd, env, scope = cwd) {
    return command(
        process.execPath,
        [
            "--input-type=module",
            "-e",
            `
        import { registerHooks as isolateHooks } from "node:module";
        import { fileURLToPath as isolatePath } from "node:url";
        import { relative as isolateRelative, isAbsolute as isolateAbsolute } from "node:path";
        isolateHooks({ resolve(specifier, context, next) {
            const result = next(specifier, context);
            if (result.url.startsWith("file:")) {
                const path = isolateRelative(${JSON.stringify(scope)}, isolatePath(result.url));
                if (path.startsWith("..") || isolateAbsolute(path)) {
                    throw Object.assign(new Error("Cannot use packages outside installed consumer: " + specifier), {code:"MODULE_NOT_FOUND"});
                }
            }
            return result;
        } });
        ${script}
    `,
        ],
        cwd,
        env,
    ).trim();
}

test("packed compiler/native packages render and relocate with no source build or path configuration", t => {
    mkdirSync(root);
    try {
        const packages = join(root, "packages");
        const staging = join(root, "staging");
        const consumer = join(root, "consumer");
        for (const directory of [packages, staging, consumer]) mkdirSync(directory);
        const cleanEnv = { ...process.env };
        delete cleanEnv.FAST_NATIVE_ADDON;
        delete cleanEnv.FAST_NATIVE_FIXTURE;
        // All consumer child processes use the absolute Node executable, without Cargo.
        const runtimeEnv = { ...cleanEnv, PATH: "" };
        const compilerTarball = pack(source, packages);
        const stagedCompiler = join(staging, "compiler");
        unpack(compilerTarball, stagedCompiler);
        let nativeTarball = process.env.FAST_NATIVE_PACKAGE_TARBALL;
        let nativeManifest;
        if (nativeTarball) {
            nativeTarball = resolve(nativeTarball);
            const stagedNative = join(staging, "native");
            unpack(nativeTarball, stagedNative);
            nativeManifest = JSON.parse(readFileSync(join(stagedNative, "package.json")));
        } else {
            const addon = resolve(
                process.env.FAST_NATIVE_ADDON ??
                    join(
                        source,
                        "../../crates/microsoft-fast-build/target/node-host/fast-build.node",
                    ),
            );
            const info = createRequire(import.meta.url)(addon).nativeHostInfo();
            assert.equal(
                info.version,
                JSON.parse(readFileSync(join(source, "package.json"))).version,
            );
            let target = `${process.platform}-${process.arch}`;
            if (process.platform === "win32") target += "-msvc";
            if (process.platform === "linux") {
                target += process.report.getReport().header.glibcVersionRuntime
                    ? "-gnu"
                    : "-musl";
            }
            const nativeSource = join(source, "native", target);
            const stagedNative = join(staging, "native");
            mkdirSync(stagedNative);
            nativeManifest = JSON.parse(readFileSync(join(nativeSource, "package.json")));
            writeFileSync(
                join(stagedNative, "package.json"),
                JSON.stringify(nativeManifest),
            );
            cpSync(addon, join(stagedNative, "fast-build.node"));
            writeFileSync(
                join(stagedNative, "native-build.json"),
                JSON.stringify({
                    packageName: nativeManifest.name,
                    version: info.version,
                    target,
                    napi: info.napiVersion,
                    sourceRevision: "packed-local-test",
                }),
            );
            nativeTarball = pack(stagedNative, packages);
        }
        // Install both npm-produced archives entirely offline. Listing the selected binary
        // directly retains it while omitting optional packages for other platforms.
        writeFileSync(
            join(consumer, "package.json"),
            JSON.stringify({
                private: true,
                name: "fast-native-packed-consumer",
                version: "1.0.0",
                dependencies: {
                    "@microsoft/fast-build": `file:${compilerTarball}`,
                    [nativeManifest.name]: `file:${nativeTarball}`,
                },
            }),
        );
        command(
            npm,
            [
                ...npmPrefix,
                "install",
                "--offline",
                "--ignore-scripts",
                "--no-audit",
                "--no-fund",
                "--package-lock=false",
                "--omit=optional",
                "--workspaces=false",
            ],
            consumer,
            cleanEnv,
        );
        const compilerInstalled = join(consumer, "node_modules/@microsoft/fast-build");
        const nativeInstalled = join(consumer, "node_modules", nativeManifest.name);
        assert.ok(existsSync(join(nativeInstalled, "fast-build.node")));
        writeFileSync(join(consumer, "artifact.json"), JSON.stringify(artifact));
        const renderScript = `
            import assert from "node:assert/strict";
            import { readFileSync } from "node:fs";
            const { loadNativeHost } = await import("@microsoft/fast-build/native-host.mjs");
            const Program = loadNativeHost();
            const p = new Program(readFileSync("artifact.json"));
            assert.equal(p.renderEntryJson(Buffer.from('{"message":"<&"}')).toString(), "<p>&lt;&amp;</p>");
            assert.throws(() => new Program(Buffer.from(JSON.stringify({
                ...JSON.parse(readFileSync("artifact.json")), version: 99,
            }))), {code: "incompatible-artifact"});
            console.log("rendered");
        `;
        assert.equal(node(renderScript, consumer, runtimeEnv), "rendered");
        assert.equal(
            node(
                renderScript.replace(
                    "const Program = loadNativeHost();",
                    `Object.defineProperty(process, "platform", { value: "unsupported" });
                    const Program = loadNativeHost(${JSON.stringify(`./node_modules/${nativeManifest.name}/fast-build.node`)});`,
                ),
                consumer,
                runtimeEnv,
            ),
            "rendered",
        );
        const unrelated = join(consumer, "unrelated");
        const decoy = join(unrelated, "node_modules", nativeManifest.name);
        mkdirSync(decoy, { recursive: true });
        writeFileSync(
            join(decoy, "package.json"),
            JSON.stringify({
                name: nativeManifest.name,
                version: "0.0.0",
                main: "addon.cjs",
            }),
        );
        writeFileSync(join(decoy, "addon.cjs"), 'throw new Error("Resolved from CWD");');
        cpSync(join(consumer, "artifact.json"), join(unrelated, "artifact.json"));
        assert.equal(node(renderScript, unrelated, runtimeEnv, consumer), "rendered");
        const hasCompiler = [
            "microsoft_fast_build.js",
            "microsoft_fast_build_bg.wasm",
        ].every(file => existsSync(join(compilerInstalled, "wasm", file)));
        // Native execution must never load the compiler, even when it is available.
        const nativeOnly = `
            import { registerHooks } from "node:module";
            registerHooks({ resolve(specifier, context, next) {
                if (specifier.includes("/wasm/") || specifier.endsWith("/server.js"))
                    throw new Error("Native runtime loaded compiler");
                return next(specifier, context);
            } });
            ${renderScript}
        `;
        assert.equal(node(nativeOnly, consumer, runtimeEnv), "rendered");
        if (hasCompiler) {
            writeFileSync(join(consumer, "entry.html"), artifact.inputs.entry);
            writeFileSync(join(consumer, "state.json"), '{"message":"<&"}');
            command(
                process.execPath,
                [
                    join(compilerInstalled, "bin/fast.js"),
                    "build",
                    "--entry=entry.html",
                    "--state=state.json",
                    "--output=rendered.html",
                ],
                consumer,
                runtimeEnv,
            );
            assert.equal(
                readFileSync(join(consumer, "rendered.html"), "utf8"),
                "<p>&lt;&amp;</p>",
            );
        } else {
            t.diagnostic(
                "Compiler WASM absent in this native-only CI target; full CLI exercised in the compiler build job.",
            );
        }
        // Trace the real Node package-resolution graph, then deploy only those files.
        const traced = JSON.parse(
            node(
                `
            import { registerHooks } from "node:module";
            const files = new Set();
            registerHooks({ resolve(specifier, context, next) {
                const result = next(specifier, context);
                if (result.url.startsWith("file:")) files.add(result.url);
                return result;
            } });
            const { loadNativeHost } = await import("@microsoft/fast-build/native-host.mjs");
            loadNativeHost();
            console.log(JSON.stringify([...files]));
        `,
                consumer,
                runtimeEnv,
            ),
        );
        const deployment = join(root, "deployment");
        mkdirSync(deployment);
        for (const url of traced) {
            const file = fileURLToPath(url);
            const destination = join(deployment, relative(consumer, file));
            assert.ok(relative(consumer, file).startsWith("node_modules"), file);
            mkdirSync(dirname(destination), { recursive: true });
            cpSync(file, destination);
        }
        // Package scope/type metadata is part of every traced Node module deployment.
        for (const packageDir of [compilerInstalled, nativeInstalled]) {
            const destination = join(
                deployment,
                relative(consumer, packageDir),
                "package.json",
            );
            cpSync(join(packageDir, "package.json"), destination);
        }
        cpSync(join(consumer, "artifact.json"), join(deployment, "artifact.json"));
        assert.ok(traced.some(file => file.endsWith(".node")));
        assert.ok(traced.some(file => file.endsWith("/native-build.json")));
        assert.ok(!traced.some(file => file.includes("/wasm/")));
        assert.equal(node(renderScript, deployment, runtimeEnv), "rendered");
        // Compiler-only workflows must still work when no optional binary is installed.
        rmSync(nativeInstalled, { recursive: true });
        const compilerOnly = `
            import assert from "node:assert/strict";
            import { registerHooks } from "node:module";
            registerHooks({ resolve(specifier, context, next) {
                if (specifier.startsWith("@microsoft/fast-build-") || specifier.endsWith("/native-host.mjs"))
                    throw new Error("Compiler tried to load native host");
                return next(specifier, context);
            } });
            const { compileServerArtifact } = await import("@microsoft/fast-build/server.js");
            ${hasCompiler ? `assert.equal(JSON.parse(Buffer.from(compileServerArtifact("<p>{{message}}</p>")).toString()).format, "fast-server-native");` : "assert.equal(typeof compileServerArtifact, 'function');"}
            console.log("compiler-only");
        `;
        assert.equal(node(compilerOnly, consumer, runtimeEnv), "compiler-only");
        assert.throws(
            () => node(renderScript, consumer, runtimeEnv),
            error => error.stderr.toString().includes("native-package-missing"),
        );
        // The relocated deployment must not rely on the original installed packages.
        rmSync(join(consumer, "node_modules"), { recursive: true });
        assert.equal(node(renderScript, deployment, runtimeEnv), "rendered");
        assert.deepEqual(
            readdirSync(consumer).filter(name => name.endsWith(".config.json")),
            [],
        );
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
});
