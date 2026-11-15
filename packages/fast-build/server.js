// @ts-check

/**
 * Compile trusted declarative HTML to synchronous server ESM.
 * The returned module imports only the server runtime, not this build-time API.
 * @param {string} entry
 * @param {Record<string, string | import("./server.js").ServerTemplateDefinition>} [templates]
 * @param {string} [runtimeImport]
 * @returns {string}
 */
function compileServerModule(
    entry,
    templates = {},
    runtimeImport = "@microsoft/fast-build/server-runtime.mjs",
) {
    const wasm = require("./wasm/microsoft_fast_build.js");
    return wasm.compile_server_module(entry, JSON.stringify(templates), runtimeImport);
}

/**
 * Compile the same flat plans as independent semantic-name modules.
 * @param {string} entry
 * @param {Record<string, string | import("./server.js").ServerTemplateDefinition>} [templates]
 * @param {string} [runtimeImport]
 * @returns {import("./server.js").ServerAssets}
 */
function compileServerAssets(
    entry,
    templates = {},
    runtimeImport = "@microsoft/fast-build/server-runtime.mjs",
) {
    const wasm = require("./wasm/microsoft_fast_build.js");
    return JSON.parse(
        wasm.compile_server_assets(entry, JSON.stringify(templates), runtimeImport),
    );
}

/**
 * Compile trusted declarative HTML to a native Rust executable artifact.
 * Deploy with a native Rust library supporting the emitted artifact schema.
 * @param {string} entry
 * @param {Record<string, string | import("./server.js").ServerTemplateDefinition>} [templates]
 * @returns {Uint8Array}
 */
function compileServerArtifact(entry, templates = {}) {
    const wasm = require("./wasm/microsoft_fast_build.js");
    return wasm.compile_server_artifact(entry, JSON.stringify(templates));
}

const defaultRuntimeImport = "@microsoft/fast-build/server-runtime.mjs";

/** @param {string} code @param {string} message @param {boolean} [typeError] */
function assetError(code, message, typeError = false) {
    return Object.assign(typeError ? new TypeError(message) : new Error(message), {
        code,
    });
}

/** @param {any} value */
function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** @param {any} value @param {string[]} keys */
function hasKeys(value, keys) {
    return (
        isRecord(value) &&
        Object.keys(value).length === keys.length &&
        keys.every(key => Object.hasOwn(value, key))
    );
}

/** @param {any} inputs */
function canonicalInputs(inputs) {
    const invalid = () => {
        throw assetError(
            "invalid-server-asset-inputs",
            "Expected an entry string and templates or raw templateSources.",
            true,
        );
    };
    if (!isRecord(inputs) || typeof inputs.entry !== "string") invalid();
    if (Object.hasOwn(inputs, "templateSources")) {
        if (
            Object.hasOwn(inputs, "templates") ||
            !Array.isArray(inputs.templateSources) ||
            inputs.templateSources.some(
                /** @param {any} source */ source => typeof source !== "string",
            )
        ) {
            invalid();
        }
        return {
            entry: inputs.entry,
            templateSources: [...inputs.templateSources].sort(),
        };
    }
    const definitions = inputs.templates === undefined ? {} : inputs.templates;
    if (!isRecord(definitions)) invalid();
    /** @type {Record<string, import("./server.js").ServerTemplateDefinition>} */
    const templates = Object.create(null);
    for (const name of Object.keys(definitions).sort()) {
        const definition =
            typeof definitions[name] === "string"
                ? { content: definitions[name] }
                : definitions[name];
        if (
            !isRecord(definition) ||
            typeof definition.content !== "string" ||
            (definition.formatVersion !== undefined && definition.formatVersion !== 1)
        ) {
            invalid();
        }
        /** @param {any} attributes */
        const attrs = attributes => {
            if (attributes === undefined || attributes === null) return [];
            if (!Array.isArray(attributes)) invalid();
            return attributes.map(
                /** @param {any} attribute */ attribute => {
                    if (
                        !isRecord(attribute) ||
                        typeof attribute.name !== "string" ||
                        (attribute.value !== undefined &&
                            attribute.value !== null &&
                            typeof attribute.value !== "string")
                    ) {
                        invalid();
                    }
                    return { name: attribute.name, value: attribute.value ?? null };
                },
            );
        };
        templates[name] = {
            content: definition.content,
            shadowrootAttributes: attrs(definition.shadowrootAttributes),
            hostAttributes: attrs(definition.hostAttributes),
            formatVersion: 1,
        };
    }
    return { entry: inputs.entry, templates };
}

/**
 * @param {import("./server.js").ServerAssetInputs} inputs
 * @param {import("./server.js").ServerAssetWriteOptions["onWarning"]} onWarning
 */
function templatesFromInputs(inputs, onWarning) {
    if (inputs.templateSources === undefined) return inputs.templates ?? {};
    const wasm = require("./wasm/microsoft_fast_build.js");
    /** @type {Record<string, import("./server.js").ServerTemplateDefinition>} */
    const templates = Object.create(null);
    for (const [sourceIndex, source] of inputs.templateSources.entries()) {
        for (const { name, ...definition } of JSON.parse(
            wasm.parse_f_templates(source),
        )) {
            if (name === null) {
                if (onWarning) {
                    onWarning({ sourceIndex, content: definition.content });
                } else {
                    process.stderr.write(
                        `Warning: <f-template> without a 'name' attribute: ${definition.content.trim()}\n`,
                    );
                }
                continue;
            }
            if (Object.hasOwn(templates, name)) {
                throw new Error(`Duplicate template name "${name}".`);
            }
            templates[name] = definition;
        }
    }
    if (Object.keys(templates).length === 0) {
        throw assetError(
            "missing-template-sources",
            "Raw templateSources require at least one named template.",
        );
    }
    return templates;
}

/**
 * @typedef {{bytes: Buffer, mode: number}} AssetFile
 * @param {string} filename
 * @param {string} code
 * @returns {AssetFile | null}
 */
function readAssetFile(filename, code) {
    const fs = require("node:fs");
    let stat;
    try {
        stat = fs.lstatSync(filename);
    } catch (error) {
        if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT") return null;
        throw error;
    }
    if (!stat.isFile() || stat.isSymbolicLink()) {
        throw assetError(code, `Server asset path is not a regular file: ${filename}`);
    }
    return { bytes: fs.readFileSync(filename), mode: stat.mode & 0o777 };
}

/** @param {Buffer} bytes */
function readManifest(bytes) {
    const invalid = () =>
        assetError(
            "invalid-server-asset-manifest",
            "Invalid or unsupported server asset input manifest.",
        );
    let manifest;
    try {
        if (!Buffer.from(bytes.toString("utf8"), "utf8").equals(bytes)) throw invalid();
        manifest = JSON.parse(bytes.toString("utf8"));
        if (
            !hasKeys(manifest, [
                "format",
                "version",
                "kind",
                "inputs",
                "deployment",
                "outputBase64",
            ]) ||
            manifest.format !== "fast-server-asset-inputs" ||
            manifest.version !== 1 ||
            !["server-js", "server-artifact"].includes(manifest.kind) ||
            !hasKeys(
                manifest.deployment,
                manifest.kind === "server-js" ? ["runtimeImport"] : [],
            ) ||
            (manifest.kind === "server-js" &&
                typeof manifest.deployment.runtimeImport !== "string") ||
            typeof manifest.outputBase64 !== "string"
        ) {
            throw invalid();
        }
        const inputs = canonicalInputs(manifest.inputs);
        if (JSON.stringify(inputs) !== JSON.stringify(manifest.inputs)) throw invalid();
        const output = Buffer.from(manifest.outputBase64, "base64");
        if (output.toString("base64") !== manifest.outputBase64) throw invalid();
        return { manifest, output };
    } catch {
        throw invalid();
    }
}

/**
 * Stage both new bytes and rollback snapshots before replacing either file.
 * The manifest is committed last; interrupted pairs cannot qualify for reuse.
 * @param {{filename: string, bytes: Buffer, previous: AssetFile | null}[]} files
 */
function replaceAssetFiles(files) {
    const fs = require("node:fs");
    const { randomUUID } = require("node:crypto");
    const staged = new Set();
    /** @param {string} filename @param {Buffer} bytes @param {number} mode */
    const stage = (filename, bytes, mode) => {
        const staging = `${filename}.${process.pid}.${randomUUID()}.stage`;
        const fd = fs.openSync(staging, "wx", mode);
        staged.add(staging);
        try {
            fs.writeFileSync(fd, bytes);
            fs.fsyncSync(fd);
        } finally {
            fs.closeSync(fd);
        }
        return staging;
    };
    let committing = false;
    /** @type {{filename: string, next: string, rollback: string | null}[]} */
    const replacements = [];
    try {
        for (const file of files) {
            replacements.push({
                filename: file.filename,
                next: stage(file.filename, file.bytes, file.previous?.mode ?? 0o666),
                rollback: file.previous
                    ? stage(file.filename, file.previous.bytes, file.previous.mode)
                    : null,
            });
        }
        committing = true;
        for (const replacement of replacements) {
            fs.renameSync(replacement.next, replacement.filename);
            staged.delete(replacement.next);
        }
    } catch (error) {
        /** @type {unknown[]} */
        const errors = [error];
        if (committing) {
            for (const replacement of [...replacements].reverse()) {
                try {
                    if (replacement.rollback) {
                        fs.renameSync(replacement.rollback, replacement.filename);
                        staged.delete(replacement.rollback);
                    } else {
                        fs.rmSync(replacement.filename, { force: true });
                    }
                } catch (rollbackError) {
                    errors.push(rollbackError);
                }
            }
        }
        if (errors.length > 1) {
            throw Object.assign(
                new AggregateError(errors, "Server asset write and rollback failed."),
                { code: "server-asset-write-failed" },
            );
        }
        throw error;
    } finally {
        for (const filename of staged) fs.rmSync(filename, { force: true });
    }
}

/**
 * @param {string} outputPath
 * @param {import("./server.js").ServerAssetInputs} inputs
 * @param {import("./server.js").ServerModuleWriteOptions} options
 * @param {"server-js" | "server-artifact"} kind
 * @returns {import("./server.js").ServerAssetWriteResult}
 */
function writeServerAsset(outputPath, inputs, options, kind) {
    if (typeof outputPath !== "string" || outputPath.length === 0) {
        throw assetError(
            "invalid-server-asset-inputs",
            "Expected a nonempty output path.",
            true,
        );
    }
    if (
        !isRecord(options) ||
        Object.keys(options).some(
            key =>
                ![
                    "overwrite",
                    "onWarning",
                    ...(kind === "server-js" ? ["runtimeImport"] : []),
                ].includes(key),
        ) ||
        (options.overwrite !== undefined && typeof options.overwrite !== "boolean") ||
        (options.onWarning !== undefined && typeof options.onWarning !== "function") ||
        (kind === "server-js"
            ? options.runtimeImport !== undefined &&
              typeof options.runtimeImport !== "string"
            : options.runtimeImport !== undefined)
    ) {
        throw assetError(
            "invalid-server-asset-options",
            "Invalid server asset write options.",
            true,
        );
    }
    const canonical = canonicalInputs(inputs);
    const deployment =
        kind === "server-js"
            ? { runtimeImport: options.runtimeImport ?? defaultRuntimeImport }
            : {};
    const fs = require("node:fs");
    const path = require("node:path");
    const manifestPath = `${outputPath}.inputs.json`;
    const lockPath = `${outputPath}.lock`;
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    let lock;
    try {
        lock = fs.openSync(lockPath, "wx", 0o600);
    } catch (error) {
        if (/** @type {NodeJS.ErrnoException} */ (error).code === "EEXIST") {
            throw assetError(
                "server-asset-locked",
                `Server asset is locked: ${outputPath}`,
            );
        }
        throw error;
    }
    const lockStat = fs.fstatSync(lock);
    try {
        fs.writeFileSync(lock, `${process.pid}\n`);
        const previousManifest = readAssetFile(
            manifestPath,
            "invalid-server-asset-manifest",
        );
        const previousOutput = readAssetFile(outputPath, "server-asset-output-mismatch");
        if (previousManifest) {
            const { manifest, output } = readManifest(previousManifest.bytes);
            if (
                manifest.kind !== kind ||
                JSON.stringify(manifest.deployment) !== JSON.stringify(deployment)
            ) {
                throw assetError(
                    "server-asset-configuration-mismatch",
                    "Server asset kind or runtime import changed; choose a new output path.",
                );
            }
            if (previousOutput && !previousOutput.bytes.equals(output)) {
                throw assetError(
                    "server-asset-output-mismatch",
                    "Server asset bytes differ from the recorded output snapshot.",
                );
            }
            if (JSON.stringify(manifest.inputs) === JSON.stringify(canonical)) {
                if (!previousOutput) {
                    replaceAssetFiles([
                        { filename: outputPath, bytes: output, previous: null },
                    ]);
                }
                return { reused: true, manifestPath };
            }
        }
        if (previousOutput && !options.overwrite) {
            throw assetError(
                "server-asset-overwrite-required",
                "Server asset already exists; explicit overwrite is required.",
            );
        }
        // Preserve caller source order for diagnostics; only the reuse key is sorted.
        const compileInputs =
            "templateSources" in canonical
                ? {
                      entry: canonical.entry,
                      templateSources: /** @type {readonly string[]} */ (
                          inputs.templateSources
                      ),
                  }
                : canonical;
        const templates = templatesFromInputs(compileInputs, options.onWarning);
        const output =
            kind === "server-js"
                ? Buffer.from(
                      compileServerModule(
                          canonical.entry,
                          templates,
                          deployment.runtimeImport,
                      ),
                      "utf8",
                  )
                : Buffer.from(compileServerArtifact(canonical.entry, templates));
        const manifest = {
            format: "fast-server-asset-inputs",
            version: 1,
            kind,
            inputs: canonical,
            deployment,
            outputBase64: output.toString("base64"),
        };
        const manifestBytes = Buffer.from(
            `${JSON.stringify(manifest, null, 4)}\n`,
            "utf8",
        );
        const replacements = [
            { filename: outputPath, bytes: output, previous: previousOutput },
        ];
        if (previousOutput?.bytes.equals(output)) replacements.length = 0;
        replacements.push({
            filename: manifestPath,
            bytes: manifestBytes,
            previous: previousManifest,
        });
        replaceAssetFiles(replacements);
        return { reused: false, manifestPath };
    } finally {
        fs.closeSync(lock);
        const current = fs.lstatSync(lockPath, { throwIfNoEntry: false });
        if (current?.ino === lockStat.ino && current.dev === lockStat.dev) {
            fs.unlinkSync(lockPath);
        }
    }
}

/**
 * Persist server ESM, reusing exact previous bytes for unchanged authored inputs.
 * @param {string} outputPath
 * @param {import("./server.js").ServerAssetInputs} inputs
 * @param {import("./server.js").ServerModuleWriteOptions} [options]
 * @returns {import("./server.js").ServerAssetWriteResult}
 */
function writeServerModule(outputPath, inputs, options = {}) {
    return writeServerAsset(outputPath, inputs, options, "server-js");
}

/**
 * Persist a native artifact, reusing exact previous bytes for unchanged inputs.
 * @param {string} outputPath
 * @param {import("./server.js").ServerAssetInputs} inputs
 * @param {import("./server.js").ServerAssetWriteOptions} [options]
 * @returns {import("./server.js").ServerAssetWriteResult}
 */
function writeServerArtifact(outputPath, inputs, options = {}) {
    return writeServerAsset(outputPath, inputs, options, "server-artifact");
}

/**
 * Publish a complete modular deployment by one directory rename.
 * Existing destinations are immutable: exact authored-input reuse needs no compiler.
 * @param {string} outputDirectory
 * @param {import("./server.js").ServerAssetInputs} inputs
 * @param {import("./server.js").ServerAssetsWriteOptions} [options]
 * @returns {import("./server.js").ServerAssetWriteResult}
 */
function writeServerAssets(outputDirectory, inputs, options = {}) {
    const fs = require("node:fs");
    const path = require("node:path");
    const { randomUUID } = require("node:crypto");
    if (typeof outputDirectory !== "string" || !outputDirectory) {
        throw assetError(
            "invalid-server-asset-inputs",
            "Expected a nonempty deployment directory.",
            true,
        );
    }
    if (
        !isRecord(options) ||
        Object.keys(options).some(key => !["runtimeImport", "onWarning"].includes(key)) ||
        (options.runtimeImport !== undefined &&
            typeof options.runtimeImport !== "string") ||
        (options.onWarning !== undefined && typeof options.onWarning !== "function")
    ) {
        throw assetError(
            "invalid-server-asset-options",
            "Modular assets require a new destination, not an overwrite option.",
            true,
        );
    }
    const canonical = canonicalInputs(inputs);
    const runtimeImport = options.runtimeImport ?? defaultRuntimeImport;
    const destination = path.resolve(outputDirectory);
    const manifestPath = path.join(destination, "server.inputs.json");
    const lockPath = `${destination}.lock`;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    let lock;
    try {
        lock = fs.openSync(lockPath, "wx");
    } catch (error) {
        if (/** @type {any} */ (error).code === "EEXIST") {
            throw assetError(
                "server-asset-locked",
                `Server asset is locked: ${destination}`,
            );
        }
        throw error;
    }
    const lockStat = fs.fstatSync(lock);
    let staging;
    try {
        const previous = fs.lstatSync(destination, { throwIfNoEntry: false });
        if (previous) {
            const invalid = () => {
                throw assetError(
                    "invalid-server-asset-manifest",
                    "Invalid or incomplete modular deployment.",
                );
            };
            if (!previous.isDirectory() || previous.isSymbolicLink()) invalid();
            const recorded = readAssetFile(manifestPath, "invalid-server-asset-manifest");
            if (!recorded) invalid();
            let manifest;
            try {
                manifest = JSON.parse(recorded.bytes.toString("utf8"));
            } catch {
                invalid();
            }
            if (
                !hasKeys(manifest, [
                    "format",
                    "version",
                    "inputs",
                    "runtimeImport",
                    "files",
                ]) ||
                manifest.format !== "fast-server-assets-inputs" ||
                manifest.version !== 1 ||
                typeof manifest.runtimeImport !== "string" ||
                !isRecord(manifest.files) ||
                !Object.hasOwn(manifest.files, "server.mjs") ||
                !Object.hasOwn(manifest.files, "entry.plan.mjs") ||
                !Object.hasOwn(manifest.files, "server.manifest.json")
            ) {
                invalid();
            }
            const recordedInputs = canonicalInputs(manifest.inputs);
            if (JSON.stringify(recordedInputs) !== JSON.stringify(manifest.inputs))
                invalid();
            const filenames = Object.keys(manifest.files);
            for (const filename of filenames) {
                if (
                    !/^(?:server\.mjs|entry\.plan\.mjs|server\.manifest\.json|component-[a-z0-9_~-]*\.plan\.mjs)$/.test(
                        filename,
                    ) ||
                    typeof manifest.files[filename] !== "string"
                ) {
                    invalid();
                }
                const expected = Buffer.from(manifest.files[filename], "base64");
                if (expected.toString("base64") !== manifest.files[filename]) invalid();
                const actual = readAssetFile(
                    path.join(destination, filename),
                    "server-asset-output-mismatch",
                );
                if (!actual || !actual.bytes.equals(expected)) {
                    throw assetError(
                        "server-asset-output-mismatch",
                        `Server asset differs from its snapshot: ${filename}`,
                    );
                }
            }
            if (
                JSON.stringify(fs.readdirSync(destination).sort()) !==
                JSON.stringify([...filenames, "server.inputs.json"].sort())
            ) {
                invalid();
            }
            if (manifest.runtimeImport !== runtimeImport) {
                throw assetError(
                    "server-asset-configuration-mismatch",
                    "Runtime import changed; choose a new deployment directory.",
                );
            }
            if (JSON.stringify(manifest.inputs) !== JSON.stringify(canonical)) {
                throw assetError(
                    "server-asset-new-destination-required",
                    "Authored inputs changed; choose a new deployment directory.",
                );
            }
            return { reused: true, manifestPath };
        }
        const compileInputs =
            "templateSources" in canonical
                ? { entry: canonical.entry, templateSources: inputs.templateSources }
                : canonical;
        const templates = templatesFromInputs(compileInputs, options.onWarning);
        const assets = compileServerAssets(canonical.entry, templates, runtimeImport);
        const snapshots = Object.fromEntries(
            Object.entries(assets.files).map(([filename, source]) => [
                filename,
                Buffer.from(source).toString("base64"),
            ]),
        );
        const manifest = {
            format: "fast-server-assets-inputs",
            version: 1,
            inputs: canonical,
            runtimeImport,
            files: snapshots,
        };
        staging = `${destination}.${process.pid}.${randomUUID()}.stage`;
        fs.mkdirSync(staging);
        const files = {
            ...assets.files,
            "server.inputs.json": `${JSON.stringify(manifest, null, 4)}\n`,
        };
        for (const [filename, source] of Object.entries(files)) {
            const fd = fs.openSync(path.join(staging, filename), "wx");
            try {
                fs.writeFileSync(fd, source);
                fs.fsyncSync(fd);
            } finally {
                fs.closeSync(fd);
            }
        }
        if (fs.lstatSync(destination, { throwIfNoEntry: false })) {
            throw assetError(
                "server-asset-locked",
                "Deployment destination appeared during write.",
            );
        }
        fs.renameSync(staging, destination);
        staging = undefined;
        return { reused: false, manifestPath };
    } finally {
        if (staging) fs.rmSync(staging, { recursive: true, force: true });
        fs.closeSync(lock);
        const current = fs.lstatSync(lockPath, { throwIfNoEntry: false });
        if (current?.ino === lockStat.ino && current.dev === lockStat.dev) {
            fs.unlinkSync(lockPath);
        }
    }
}

module.exports = {
    compileServerModule,
    compileServerAssets,
    compileServerArtifact,
    writeServerModule,
    writeServerAssets,
    writeServerArtifact,
};
