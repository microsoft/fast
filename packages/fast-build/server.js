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

/**
 * @param {any} inputs
 * @returns {import("./server.js").ServerAssetInputs}
 */
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
                    "includeBytes",
                    "onWarning",
                    ...(kind === "server-js" ? ["runtimeImport"] : []),
                ].includes(key),
        ) ||
        (options.overwrite !== undefined && typeof options.overwrite !== "boolean") ||
        (options.includeBytes !== undefined &&
            typeof options.includeBytes !== "boolean") ||
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
                return {
                    reused: true,
                    manifestPath,
                    ...(options.includeBytes ? { bytes: output } : {}),
                };
            }
        }
        if (previousOutput && !options.overwrite) {
            throw assetError(
                "server-asset-overwrite-required",
                "Server asset already exists; explicit overwrite is required.",
            );
        }
        // Strict mode sorts only the reuse key; diagnostics follow caller source order.
        /** @type {import("./server.js").ServerAssetInputs} */
        const compileInputs =
            canonical.templateSources !== undefined
                ? {
                      ...canonical,
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
        return {
            reused: false,
            manifestPath,
            ...(options.includeBytes ? { bytes: output } : {}),
        };
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

module.exports = {
    compileServerModule,
    compileServerArtifact,
    writeServerModule,
    writeServerArtifact,
};
