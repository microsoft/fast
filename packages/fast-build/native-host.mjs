import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { types } from "node:util";

const require = createRequire(import.meta.url);
const nodeApi = 8;
// Literal package references also let server deployment tracers retain native assets.
const packages = {
    "darwin-arm64": {
        manifest: () => require("@microsoft/fast-build-darwin-arm64/package.json"),
        metadata: () => require("@microsoft/fast-build-darwin-arm64/native-build.json"),
        load: () => require("@microsoft/fast-build-darwin-arm64"),
    },
    "darwin-x64": {
        manifest: () => require("@microsoft/fast-build-darwin-x64/package.json"),
        metadata: () => require("@microsoft/fast-build-darwin-x64/native-build.json"),
        load: () => require("@microsoft/fast-build-darwin-x64"),
    },
    "linux-arm64-gnu": {
        manifest: () => require("@microsoft/fast-build-linux-arm64-gnu/package.json"),
        metadata: () =>
            require("@microsoft/fast-build-linux-arm64-gnu/native-build.json"),
        load: () => require("@microsoft/fast-build-linux-arm64-gnu"),
    },
    "linux-x64-gnu": {
        manifest: () => require("@microsoft/fast-build-linux-x64-gnu/package.json"),
        metadata: () => require("@microsoft/fast-build-linux-x64-gnu/native-build.json"),
        load: () => require("@microsoft/fast-build-linux-x64-gnu"),
    },
    "win32-arm64-msvc": {
        manifest: () => require("@microsoft/fast-build-win32-arm64-msvc/package.json"),
        metadata: () =>
            require("@microsoft/fast-build-win32-arm64-msvc/native-build.json"),
        load: () => require("@microsoft/fast-build-win32-arm64-msvc"),
    },
    "win32-x64-msvc": {
        manifest: () => require("@microsoft/fast-build-win32-x64-msvc/package.json"),
        metadata: () => require("@microsoft/fast-build-win32-x64-msvc/native-build.json"),
        load: () => require("@microsoft/fast-build-win32-x64-msvc"),
    },
};

function failure(code, message, cause) {
    return Object.assign(new Error(message, { cause }), { code });
}

function unsupported(detail) {
    return failure(
        "unsupported-platform",
        `No prebuilt FAST Build native host for ${process.platform}/${process.arch}${detail}. Use a supported deployment target or explicitly provision a matching source-built addon and pass its path to loadNativeHost().`,
    );
}

function hostTarget() {
    const { platform, arch } = process;
    if (platform === "darwin" && (arch === "arm64" || arch === "x64")) {
        return `darwin-${arch}`;
    }
    if (platform === "win32" && (arch === "arm64" || arch === "x64")) {
        return `win32-${arch}-msvc`;
    }
    if (platform === "linux" && (arch === "arm64" || arch === "x64")) {
        let report;
        try {
            report = process.report.getReport();
        } catch {
            // Restricted hosts may disable diagnostic reports; inspect the running image.
        }
        if (report?.header?.glibcVersionRuntime) return `linux-${arch}-gnu`;
        if (report?.sharedObjects?.some(name => /(?:ld-musl-|libc\.musl-)/.test(name))) {
            throw unsupported(" (musl libc is unsupported)");
        }
        let mappings = "";
        try {
            mappings = readFileSync("/proc/self/maps", "utf8");
        } catch {
            // Do not guess a libc when neither source can identify the running process.
        }
        if (/(?:ld-musl-|libc\.musl-)/.test(mappings)) {
            throw unsupported(" (musl libc is unsupported)");
        }
        if (
            /\/(?:libc(?:-[\d.]+)?\.so\.6|ld-linux-x86-64\.so\.2|ld-linux-aarch64\.so\.1)(?:\s|$)/m.test(
                mappings,
            )
        ) {
            return `linux-${arch}-gnu`;
        }
        throw unsupported(" (unable to identify glibc)");
    }
    throw unsupported("");
}

function loadPackagedAddon() {
    const target = hostTarget();
    const selected = packages[target];
    const name = `@microsoft/fast-build-${target}`;
    const version = require("./package.json").version;
    const repair = `Reinstall @microsoft/fast-build@${version} with optional dependencies enabled for the deployment target; include ${name}@${version} in server deployment output.`;
    let manifest;
    try {
        manifest = selected.manifest();
    } catch (cause) {
        throw failure(
            cause.code === "MODULE_NOT_FOUND"
                ? "native-package-missing"
                : "native-incompatible",
            `Cannot resolve ${name}@${version}. ${repair}`,
            cause,
        );
    }
    let metadata;
    try {
        metadata = selected.metadata();
    } catch (cause) {
        throw failure(
            "native-incompatible",
            `Invalid ${name} build metadata. ${repair}`,
            cause,
        );
    }
    if (
        !manifest ||
        !metadata ||
        typeof manifest !== "object" ||
        typeof metadata !== "object"
    ) {
        throw failure(
            "native-incompatible",
            `Invalid ${name} package metadata. ${repair}`,
        );
    }
    if (manifest.version !== version || metadata.version !== version) {
        throw failure(
            "native-version-mismatch",
            `Expected ${name}@${version}, found package ${manifest.version} / binary metadata ${metadata.version}. ${repair}`,
        );
    }
    if (
        manifest.name !== name ||
        manifest.fastBuild?.target !== target ||
        metadata.packageName !== name ||
        metadata.target !== target
    ) {
        throw failure(
            "native-incompatible",
            `Incorrect native package identity for ${name}. ${repair}`,
        );
    }
    if (
        manifest.fastBuild?.nodeApi !== nodeApi ||
        metadata.napi !== nodeApi ||
        !(Number(process.versions.napi) >= nodeApi)
    ) {
        throw failure(
            "native-api-mismatch",
            `${name} requires Node-API ${nodeApi}; this Node provides ${process.versions.napi ?? "none"}. Use a supported Node version and matching native package. ${repair}`,
        );
    }
    let addon;
    try {
        addon = selected.load();
    } catch (cause) {
        throw failure(
            "native-load-failed",
            `Could not load ${name}. Check the deployment OS, architecture, libc and shared libraries. ${repair}`,
            cause,
        );
    }
    let info;
    try {
        info = addon.nativeHostInfo();
    } catch (cause) {
        throw failure(
            "native-api-mismatch",
            `Missing FAST native host identity in ${name}. ${repair}`,
            cause,
        );
    }
    if (info?.version !== version) {
        throw failure(
            "native-version-mismatch",
            `Expected native host ${version}, found ${info?.version}. ${repair}`,
        );
    }
    if (
        info.napiVersion !== nodeApi ||
        info.artifactFormat !== "fast-server-native" ||
        !Array.isArray(info.artifactSchemas) ||
        !info.artifactSchemas.includes(2) ||
        (typeof addon.NativeProgram === "function" &&
            [
                "renderEntryJson",
                "renderTemplateJson",
                "renderHostJson",
                "renderShadowJson",
            ].some(name => typeof addon.NativeProgram.prototype?.[name] !== "function"))
    ) {
        throw failure(
            "native-api-mismatch",
            `Incompatible FAST native host API in ${name}. ${repair}`,
        );
    }
    return addon;
}

const bufferBackingStore = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(Uint8Array.prototype),
    "buffer",
).get;

function inputBuffer(value, code) {
    if (
        types.isProxy(value) ||
        !Buffer.isBuffer(value) ||
        types.isSharedArrayBuffer(bufferBackingStore.call(value))
    ) {
        throw Object.assign(new TypeError("Expected an unshared Buffer."), { code });
    }
    return value;
}

function invalidOptions(message = "Expected a plain native render-options object.") {
    return Object.assign(new TypeError(message), { code: "invalid-options" });
}

function optionsJson(options = {}) {
    if (
        options === null ||
        typeof options !== "object" ||
        types.isProxy(options) ||
        ![null, Object.prototype].includes(Object.getPrototypeOf(options))
    ) {
        throw invalidOptions();
    }
    const descriptors = Object.getOwnPropertyDescriptors(options);
    const fields = [];
    for (const name of Reflect.ownKeys(descriptors)) {
        const descriptor = descriptors[name];
        if (!descriptor.enumerable || !Object.hasOwn(descriptor, "value")) {
            throw invalidOptions();
        }
        const value = descriptor.value;
        let encoded;
        switch (name) {
            case "markersV2":
                if (value !== undefined && typeof value !== "boolean") {
                    throw invalidOptions();
                }
                break;
            case "attributeNameStrategy":
                if (value !== undefined && value !== "camelCase" && value !== "none") {
                    throw invalidOptions();
                }
                break;
            case "maxOutputBytes":
            case "maxSteps":
                if (value !== undefined && (!Number.isSafeInteger(value) || value < 0)) {
                    throw invalidOptions();
                }
                break;
            case "dsd": {
                if (value === undefined) break;
                if (
                    types.isProxy(value) ||
                    !Array.isArray(value) ||
                    Object.getPrototypeOf(value) !== Array.prototype
                ) {
                    throw invalidOptions();
                }
                if (Reflect.ownKeys(value).length !== value.length + 1) {
                    throw invalidOptions();
                }
                const names = [];
                for (let index = 0; index < value.length; index++) {
                    const item = Object.getOwnPropertyDescriptor(value, index);
                    if (
                        !item?.enumerable ||
                        !Object.hasOwn(item, "value") ||
                        typeof item.value !== "string" ||
                        !item.value.isWellFormed()
                    ) {
                        throw invalidOptions();
                    }
                    names.push(JSON.stringify(item.value));
                }
                encoded = `[${names.join(",")}]`;
                break;
            }
            default:
                throw invalidOptions();
        }
        if (value !== undefined) {
            fields.push(`${JSON.stringify(name)}:${encoded ?? JSON.stringify(value)}`);
        }
    }
    return `{${fields.join(",")}}`;
}

/** Load the installed host package, or an explicit addon. Never download or build. */
export function loadNativeHost(addonPath) {
    if (
        addonPath !== undefined &&
        (typeof addonPath !== "string" || addonPath.length === 0)
    ) {
        throw new TypeError("Expected a nonempty native addon path, or no argument.");
    }
    let addon;
    if (addonPath === undefined) {
        addon = loadPackagedAddon();
    } else {
        try {
            addon = require(resolve(addonPath));
        } catch (cause) {
            throw failure(
                "native-load-failed",
                `Could not load FAST native addon at "${resolve(addonPath)}". Check that the addon exists and matches this Node host.`,
                cause,
            );
        }
    }
    if (typeof addon?.NativeProgram !== "function") {
        throw failure(
            "native-incompatible",
            "Expected a FAST node-host addon exporting NativeProgram. Reinstall the matching native package or provision a compatible source-built addon.",
        );
    }
    return class NativeProgram {
        #program;

        constructor(artifact, options) {
            this.#program = new addon.NativeProgram(
                inputBuffer(artifact, "invalid-artifact"),
                optionsJson(options),
            );
        }

        renderEntryJson(state, ...extra) {
            if (extra.length) throw invalidOptions("Configure options at construction.");
            return this.#program.renderEntryJson(inputBuffer(state, "invalid-state"));
        }

        renderTemplateJson(state, ...extra) {
            if (extra.length) throw invalidOptions("Configure options at construction.");
            return this.#program.renderTemplateJson(inputBuffer(state, "invalid-state"));
        }

        renderHostJson(name, state, ...extra) {
            if (extra.length) throw invalidOptions("Configure options at construction.");
            return this.#program.renderHostJson(
                name,
                inputBuffer(state, "invalid-state"),
            );
        }

        renderShadowJson(name, state, ...extra) {
            if (extra.length) throw invalidOptions("Configure options at construction.");
            return this.#program.renderShadowJson(
                name,
                inputBuffer(state, "invalid-state"),
            );
        }
    };
}
