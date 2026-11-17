// @ts-check

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
function readArtifact(bytes) {
    const invalid = () =>
        assetError(
            "invalid-server-artifact",
            "Invalid or unsupported consolidated server artifact.",
        );
    try {
        if (!Buffer.from(bytes.toString("utf8"), "utf8").equals(bytes)) throw invalid();
        const artifact = JSON.parse(bytes.toString("utf8"));
        if (
            !hasKeys(artifact, ["format", "version", "inputs", "program"]) ||
            artifact.format !== "fast-server-native" ||
            artifact.version !== 2 ||
            !hasKeys(artifact.program, ["entry", "templates", "components"]) ||
            !Array.isArray(artifact.program.entry) ||
            !isRecord(artifact.program.templates) ||
            !isRecord(artifact.program.components) ||
            !(
                hasKeys(artifact.inputs, ["entry", "templates"]) ||
                hasKeys(artifact.inputs, ["entry", "templateSources"])
            )
        ) {
            throw invalid();
        }
        return canonicalInputs(artifact.inputs);
    } catch {
        throw invalid();
    }
}

/**
 * Publish a fully flushed sibling through one atomic rename.
 * @param {string} filename
 * @param {Buffer} bytes
 * @param {AssetFile | null} previous
 */
function replaceArtifact(filename, bytes, previous) {
    const fs = require("node:fs");
    const { randomUUID } = require("node:crypto");
    const staging = `${filename}.${process.pid}.${randomUUID()}.stage`;
    const fd = fs.openSync(staging, "wx", previous?.mode ?? 0o666);
    try {
        try {
            fs.writeFileSync(fd, bytes);
            fs.fsyncSync(fd);
        } finally {
            fs.closeSync(fd);
        }
        fs.renameSync(staging, filename);
    } finally {
        fs.rmSync(staging, { force: true });
    }
}

/**
 * @param {string} outputPath
 * @param {import("./server.js").ServerAssetInputs} inputs
 * @param {import("./server.js").ServerAssetWriteOptions} [options]
 * @returns {import("./server.js").ServerAssetWriteResult}
 */
function writeServerArtifact(outputPath, inputs, options = {}) {
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
            key => !["overwrite", "includeBytes", "onWarning"].includes(key),
        ) ||
        (options.overwrite !== undefined && typeof options.overwrite !== "boolean") ||
        (options.includeBytes !== undefined &&
            typeof options.includeBytes !== "boolean") ||
        (options.onWarning !== undefined && typeof options.onWarning !== "function")
    ) {
        throw assetError(
            "invalid-server-asset-options",
            "Invalid server asset write options.",
            true,
        );
    }
    const canonical = canonicalInputs(inputs);
    const fs = require("node:fs");
    const path = require("node:path");
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
        const previousOutput = readAssetFile(outputPath, "invalid-server-artifact");
        if (previousOutput) {
            const previousInputs = readArtifact(previousOutput.bytes);
            if (JSON.stringify(previousInputs) === JSON.stringify(canonical)) {
                return {
                    reused: true,
                    ...(options.includeBytes ? { bytes: previousOutput.bytes } : {}),
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
        const artifact = JSON.parse(
            Buffer.from(compileServerArtifact(canonical.entry, templates)).toString(
                "utf8",
            ),
        );
        artifact.inputs = canonical;
        const output = Buffer.from(JSON.stringify(artifact), "utf8");
        replaceArtifact(outputPath, output, previousOutput);
        return {
            reused: false,
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

module.exports = {
    compileServerArtifact,
    writeServerArtifact,
};
