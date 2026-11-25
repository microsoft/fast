#!/usr/bin/env node
// @ts-check
"use strict";

const fs = require("fs");
const path = require("path");
const { randomUUID } = require("node:crypto");
const { resolveComponentSources } = require("../component-sources.js");

const BUILD_WASM_MODULE = path.join(__dirname, "../wasm/microsoft_fast_build.js");
const CONVERT_WASM_MODULE = path.join(
    __dirname,
    "../wasm/convert/microsoft_fast_convert.js",
);
const BUILD_DEFAULT_CONFIG_FILENAME = "fast-build.config.json";
const CONVERT_DEFAULT_CONFIG_FILENAME = "fast-convert.config.json";
const VALUELESS_CLI_FLAGS = new Set(["markers_v2", "overwrite", "typed"]);
const BUILD_ALLOWED_CONFIG_KEYS = new Set([
    "components",
    "entry",
    "state",
    "output",
    "server-artifact",
    "native-addon",
    "templates",
    "attribute-name-strategy",
    "markers_v2",
]);
const BUILD_BOOLEAN_CONFIG_KEYS = new Set(["markers_v2"]);
const CONVERT_ALLOWED_CONFIG_KEYS = new Set([
    "components",
    "typed",
    "syntax",
    "templates",
    "output",
    "overwrite",
    "type-source",
    "type-source-import",
]);
const CONVERT_BOOLEAN_CONFIG_KEYS = new Set(["overwrite", "typed"]);
const CONFIG_PATH_KEYS = new Set(["entry", "state", "output", "templates", "server-artifact", "native-addon"]);

/** @typedef {import("../component-sources.js").ComponentSource} ComponentSource */
/** @typedef {import("../component-sources.js").ResolvedComponentSource} ResolvedComponentSource */
/** @typedef {Record<string, string | boolean | ComponentSource[]>} FastConfig */
/** @typedef {import("../wasm/microsoft_fast_build.js").FTemplateMetadata} FTemplateMetadata */
/** @typedef {{ syntax: string, extension: string, suffix: string }} ConvertSyntaxMetadata */

/**
 * Parse CLI arguments of the form --key="value", --key=value, or supported
 * valueless flags like --markers_v2.
 * @param {string[]} argv
 * @returns {Record<string, string>}
 */
function parseArgs(argv) {
    const args = {};
    for (const arg of argv) {
        const match = arg.match(/^--([^=]+)=(.*)$/s);
        if (match) {
            args[match[1]] = match[2].replace(/^"|"$/g, "");
            continue;
        }

        const flag = arg.match(/^--([^=]+)$/s);
        if (flag) {
            args[flag[1]] = VALUELESS_CLI_FLAGS.has(flag[1]) ? "true" : "";
        }
    }
    return args;
}

/**
 * Resolve a boolean option, preferring CLI args over config values.
 * CLI values accept true, false, or an empty valueless flag.
 * @param {Record<string, string>} args - Parsed CLI arguments.
 * @param {FastConfig} config - Parsed config file values.
 * @param {string} key - The option key.
 * @returns {boolean}
 */
function resolveBooleanOption(args, config, key) {
    if (Object.prototype.hasOwnProperty.call(args, key)) {
        const value = args[key].trim().toLowerCase();
        if (value === "true" || value === "") {
            return true;
        }
        if (value === "false") {
            return false;
        }

        process.stderr.write(
            `Error: Invalid --${key} value "${args[key]}". Expected "true" or "false".\n`
        );
        process.exit(1);
    }

    if (Object.prototype.hasOwnProperty.call(config, key)) {
        return config[key] === true;
    }

    return false;
}

/**
 * Resolve a boolean option where CLI presence always means true.
 * @param {Record<string, string>} args - Parsed CLI arguments.
 * @param {FastConfig} config - Parsed config file values.
 * @param {string} key - The option key.
 * @returns {boolean}
 */
function resolvePresenceBooleanOption(args, config, key) {
    if (Object.prototype.hasOwnProperty.call(args, key)) {
        return true;
    }

    if (Object.prototype.hasOwnProperty.call(config, key)) {
        return config[key] === true;
    }

    return false;
}

/**
 * Load and validate a CLI config file.
 *
 * - If `configPath` is provided, the file must exist (error if missing).
 * - If `configPath` is not provided, looks for `defaultFilename` in CWD.
 *   Returns an empty object if the default file does not exist.
 *
 * File paths in the returned config are resolved relative to the config
 * file's directory so that the caller can use them directly.
 *
 * @param {string | undefined} configPath - Explicit path from --config, if any.
 * @param {string} defaultFilename - Default config file to look up in CWD.
 * @param {Set<string>} allowedKeys - Config keys accepted by the subcommand.
 * @param {Set<string>} booleanKeys - Config keys that must be booleans.
 * @returns {{ config: FastConfig, configDir: string | null }}
 */
function loadConfig(
    configPath,
    defaultFilename = BUILD_DEFAULT_CONFIG_FILENAME,
    allowedKeys = BUILD_ALLOWED_CONFIG_KEYS,
    booleanKeys = BUILD_BOOLEAN_CONFIG_KEYS,
) {
    /** @type {string} */
    let resolvedPath;
    /** @type {boolean} */
    let isExplicit;

    if (configPath !== undefined) {
        resolvedPath = path.resolve(configPath);
        isExplicit = true;
    } else {
        resolvedPath = path.resolve(defaultFilename);
        isExplicit = false;
    }

    if (!fs.existsSync(resolvedPath)) {
        if (isExplicit) {
            process.stderr.write(
                `Error: Config file "${configPath}" not found.\n`
            );
            process.exit(1);
        }
        return { config: {}, configDir: null };
    }

    let raw;
    try {
        raw = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
    } catch (e) {
        process.stderr.write(
            `Error: Failed to parse config file "${resolvedPath}": ${e.message}\n`
        );
        process.exit(1);
    }

    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
        process.stderr.write(
            `Error: Config file "${resolvedPath}" must contain a JSON object.\n`
        );
        process.exit(1);
    }

    for (const key of Object.keys(raw)) {
        if (!allowedKeys.has(key)) {
            process.stderr.write(
                `Error: Unknown key "${key}" in config file "${resolvedPath}". Allowed keys: ${[...allowedKeys].join(", ")}.\n`
            );
            process.exit(1);
        }
        if (key === "components") {
            if (!Array.isArray(raw[key])) {
                throw new Error(`Value for "components" in config file "${resolvedPath}" must be an array.`);
            }
            continue;
        }
        if (booleanKeys.has(key)) {
            if (typeof raw[key] !== "boolean") {
                process.stderr.write(
                    `Error: Value for "${key}" in config file "${resolvedPath}" must be a boolean.\n`
                );
                process.exit(1);
            }
            continue;
        }

        if (typeof raw[key] !== "string") {
            process.stderr.write(
                `Error: Value for "${key}" in config file "${resolvedPath}" must be a string.\n`
            );
            process.exit(1);
        }
    }

    const configDir = path.dirname(resolvedPath);
    return { config: raw, configDir };
}

/**
 * Resolve a file path value, preferring the CLI arg over the config value.
 * Config-derived paths are resolved relative to the config file's directory.
 * CLI-derived paths are resolved relative to CWD (the default behaviour).
 *
 * @param {Record<string, string>} args - Parsed CLI arguments.
 * @param {FastConfig} config - Parsed config file values.
 * @param {string | null} configDir - Directory of the config file, or null.
 * @param {string} key - The option key.
 * @param {string} [defaultValue] - Fallback when neither source provides a value.
 * @returns {string | undefined}
 */
function resolveOption(args, config, configDir, key, defaultValue) {
    if (Object.prototype.hasOwnProperty.call(args, key)) {
        return args[key];
    }
    if (Object.prototype.hasOwnProperty.call(config, key)) {
        const value = config[key];
        if (typeof value !== "string") {
            return defaultValue;
        }
        const isFilePath = CONFIG_PATH_KEYS.has(key);
        if (isFilePath && configDir !== null) {
            return path.resolve(configDir, value);
        }
        return value;
    }
    return defaultValue;
}

/**
 * Walk a directory recursively and collect all .html file paths.
 * @param {string} dir
 * @param {string[]} results
 */
function walkHtmlFiles(dir, results) {
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
        return;
    }
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkHtmlFiles(fullPath, results);
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
            results.push(fullPath);
        }
    }
}

/**
 * Match a normalized path against a glob pattern.
 * Supports * (within one segment), ** (across segments), ? (single char).
 * @param {string} pattern
 * @param {string} filePath
 * @returns {boolean}
 */
function globMatch(pattern, filePath) {
    const normalize = (p) => p.replace(/\\/g, "/").replace(/^\.\//, "");
    const pat = normalize(pattern).split("/");
    const file = normalize(filePath).split("/");
    return matchSegments(pat, file);
}

/** @param {string[]} pat @param {string[]} file @returns {boolean} */
function matchSegments(pat, file) {
    if (pat.length === 0) return file.length === 0;
    if (pat[0] === "**") {
        if (matchSegments(pat.slice(1), file)) return true;
        if (file.length > 0 && matchSegments(pat, file.slice(1))) return true;
        return false;
    }
    if (file.length === 0) return false;
    if (matchSegment(pat[0], file[0])) return matchSegments(pat.slice(1), file.slice(1));
    return false;
}

/** @param {string} pat @param {string} seg @returns {boolean} */
function matchSegment(pat, seg) {
    return matchChars([...pat], [...seg]);
}

/** @param {string[]} pat @param {string[]} seg @returns {boolean} */
function matchChars(pat, seg) {
    if (pat.length === 0) return seg.length === 0;
    if (pat[0] === "*") {
        for (let i = 0; i <= seg.length; i++) {
            if (matchChars(pat.slice(1), seg.slice(i))) return true;
        }
        return false;
    }
    if (seg.length === 0) return false;
    if (pat[0] === "?" || pat[0] === seg[0]) return matchChars(pat.slice(1), seg.slice(1));
    return false;
}

/**
 * Given a glob pattern, return the static directory prefix before the first wildcard.
 * @param {string} pattern
 * @returns {string}
 */
function staticPrefixDir(pattern) {
    const norm = pattern.replace(/\\/g, "/").replace(/^\.\//, "");
    const firstWild = norm.search(/[*?]/);
    if (firstWild === -1) {
        const lastSlash = norm.lastIndexOf("/");
        return lastSlash >= 0 ? norm.slice(0, lastSlash + 1) : ".";
    }
    const before = norm.slice(0, firstWild);
    const lastSlash = before.lastIndexOf("/");
    return lastSlash >= 0 ? before.slice(0, lastSlash + 1) : ".";
}

/**
 * Parse all `<f-template>` elements from an HTML string using the WASM module.
 * Returns template metadata for templates that have a `name` attribute.
 * Emits a warning to stderr for any `<f-template>` without a `name`.
 * @param {string} html
 * @param {string} filePath - used in warning messages
 * @param {object} wasm - the loaded WASM module
 * @returns {(FTemplateMetadata & { name: string })[]}
 */
function parseFTemplates(html, filePath, wasm) {
    /** @type {FTemplateMetadata[]} */
    const parsed = JSON.parse(wasm.parse_f_templates(html));
    const results = [];
    for (const template of parsed) {
        const { name, content, shadowrootAttributes, hostAttributes } = template;
        if (name === null) {
            process.stderr.write(
                `Warning: <f-template> without a 'name' attribute in '${filePath}': ${content.trim()}\n`
            );
        } else {
            results.push({
                ...template,
                name,
                shadowrootAttributes: shadowrootAttributes || [],
                hostAttributes: hostAttributes || [],
            });
        }
    }
    return results;
}

/**
 * Resolve all `.html` files matching a glob pattern without loading a parser.
 * @param {string} pattern
 * @returns {string[]}
 */
function resolveTemplateFiles(pattern) {
    const baseDir = staticPrefixDir(pattern);
    if (!fs.existsSync(baseDir)) {
        return [];
    }
    const allFiles = [];
    walkHtmlFiles(baseDir, allFiles);
    return allFiles.filter((file) => globMatch(pattern, file));
}

/**
 * Load the converter WASM module and validate its required exports.
 * @returns {object}
 */
function loadConvertWasm() {
    const wasm = require(CONVERT_WASM_MODULE);
    if (typeof wasm.convert_template !== "function") {
        process.stderr.write(
            "Error: Converter WASM module must export convert_template.\n",
        );
        process.exit(1);
    }
    if (typeof wasm.convert_template_with_options !== "function") {
        process.stderr.write(
            "Error: Converter WASM module must export convert_template_with_options.\n",
        );
        process.exit(1);
    }
    if (typeof wasm.convert_syntax_metadata !== "function") {
        process.stderr.write(
            "Error: Converter WASM module must export convert_syntax_metadata.\n",
        );
        process.exit(1);
    }
    return wasm;
}

/**
 * Load syntax metadata from the converter WASM module.
 * @param {object} wasm
 * @returns {Record<string, ConvertSyntaxMetadata>}
 */
function loadConvertSyntaxMetadata(wasm) {
    let parsed;
    try {
        parsed = JSON.parse(wasm.convert_syntax_metadata());
    } catch (e) {
        process.stderr.write(`Error: Failed to parse converter syntax metadata: ${e.message}\n`);
        process.exit(1);
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
        process.stderr.write(
            "Error: Converter syntax metadata must be a non-empty array.\n",
        );
        process.exit(1);
    }

    /** @type {Record<string, ConvertSyntaxMetadata>} */
    const metadata = {};
    for (const entry of parsed) {
        if (
            typeof entry !== "object" ||
            entry === null ||
            typeof entry.syntax !== "string" ||
            typeof entry.extension !== "string" ||
            typeof entry.suffix !== "string"
        ) {
            process.stderr.write(
                "Error: Converter syntax metadata entries must include string syntax, extension, and suffix values.\n",
            );
            process.exit(1);
        }
        metadata[entry.syntax] = Object.freeze({
            syntax: entry.syntax,
            extension: entry.extension,
            suffix: entry.suffix,
        });
    }
    return Object.freeze(metadata);
}

/**
 * @param {Record<string, ConvertSyntaxMetadata>} syntaxMetadata
 * @returns {string}
 */
function convertSyntaxList(syntaxMetadata) {
    return Object.keys(syntaxMetadata).join(", ");
}

/**
 * Build the converter output path from an optional pattern.
 * @param {string} template
 * @param {string} syntax
 * @param {string | undefined} outputPattern
 * @param {Record<string, ConvertSyntaxMetadata>} syntaxMetadata
 * @returns {string}
 */
function resolveConvertOutput(template, syntax, outputPattern, syntaxMetadata) {
    const syntaxOptions = syntaxMetadata[syntax];
    const basename = path.basename(template, path.extname(template));

    if (outputPattern === undefined) {
        return path.join(
            path.dirname(template),
            `${basename}${syntaxOptions.suffix}`,
        );
    }

    return outputPattern.split("*").join(basename);
}

/**
 * Validate the converter output path before writing, creating the output
 * parent directory (mkdir -p semantics) if it does not already exist.
 * @param {string} output
 * @param {string} syntax
 * @param {boolean} overwrite
 * @param {Record<string, ConvertSyntaxMetadata>} syntaxMetadata
 */
function validateConvertOutput(output, syntax, overwrite, syntaxMetadata) {
    const syntaxOptions = syntaxMetadata[syntax];

    if (fs.existsSync(output) && fs.statSync(output).isDirectory()) {
        process.stderr.write(`Error: Output path "${output}" is a directory.\n`);
        process.exit(1);
    }

    if (path.extname(output) !== syntaxOptions.extension) {
        process.stderr.write(
            `Error: Output file "${output}" must use the "${syntaxOptions.extension}" extension for syntax "${syntax}".\n`,
        );
        process.exit(1);
    }

    const outputParent = path.dirname(output) || ".";
    if (fs.existsSync(outputParent)) {
        if (!fs.statSync(outputParent).isDirectory()) {
            process.stderr.write(
                `Error: Output parent path "${outputParent}" is not a directory.\n`,
            );
            process.exit(1);
        }
    } else {
        fs.mkdirSync(outputParent, { recursive: true });
    }

    if (fs.existsSync(output) && !overwrite) {
        process.stderr.write(
            `Error: Output file "${output}" already exists. Use --overwrite to replace it.\n`,
        );
        process.exit(1);
    }
}

/**
 * Convert every `.html` file matching `templatesArg`'s glob pattern(s).
 * Loads the WASM converter module once for the whole batch rather than
 * re-instantiating it per file. Writes each output next to its source file,
 * or under `outputArg`'s directory with any "*" replaced with the source's
 * basename — mirroring the single-file `--output` behaviour.
 * @param {string} templatesArg
 * @param {string} syntax
 * @param {string | undefined} outputArg
 * @param {boolean} overwrite
 * @param {object} wasm
 * @param {Record<string, ConvertSyntaxMetadata>} syntaxMetadata
 * @param {string | undefined} typeSource
 * @param {string | undefined} typeSourceImport
 * @param {boolean} typed
 */
/** @deprecated Use explicit components and convertComponents. */
function runConvertBatch(
    templatesArg,
    syntax,
    outputArg,
    overwrite,
    wasm,
    syntaxMetadata,
    typeSource,
    typeSourceImport,
    typed,
) {
    const patterns = templatesArg.split(",").map((p) => p.trim());
    const seen = new Set();
    const files = [];
    for (const pattern of patterns) {
        const matches = resolveTemplateFiles(pattern);
        if (matches.length === 0) {
            process.stderr.write(
                `Warning: No template files found for pattern "${pattern}".\n`,
            );
        }
        for (const file of matches) {
            if (!seen.has(file)) {
                seen.add(file);
                files.push(file);
            }
        }
    }

    let convertedCount = 0;
    for (const file of files) {
        const output = resolveConvertOutput(file, syntax, outputArg, syntaxMetadata);
        validateConvertOutput(output, syntax, overwrite, syntaxMetadata);
        const result = wasm.convert_template_with_options(
            fs.readFileSync(file, "utf8"),
            syntax,
            typeSource,
            typeSourceImport,
            typed || undefined,
        );
        for (const warning of result.warnings) {
            process.stderr.write(`Warning: ${warning}\n`);
        }
        fs.writeFileSync(output, result.output, "utf8");
        process.stdout.write(`Converted: ${output}\n`);
        convertedCount++;
    }

    if (convertedCount === 0) {
        process.stderr.write("Warning: No template files were converted.\n");
        return;
    }

    process.stdout.write(`Converted ${convertedCount} template(s).\n`);
}

async function runConvert(args) {
    const { config, configDir } = loadConfig(
        Object.prototype.hasOwnProperty.call(args, "config") ? args["config"] : undefined,
        CONVERT_DEFAULT_CONFIG_FILENAME,
        CONVERT_ALLOWED_CONFIG_KEYS,
        CONVERT_BOOLEAN_CONFIG_KEYS,
    );

    const syntax = resolveOption(args, config, configDir, "syntax");
    const templatesArg = resolveOption(args, config, configDir, "templates");
    const outputArg = resolveOption(args, config, configDir, "output");
    const overwrite = resolvePresenceBooleanOption(args, config, "overwrite");
    const typeSource = resolveOption(args, config, configDir, "type-source");
    const typeSourceImport = resolveOption(args, config, configDir, "type-source-import");
    const typed = resolveBooleanOption(args, config, "typed");
    const components = componentConfig(args, config);
    if (components !== undefined && syntax === "server-native") {
        if (typed) {
            throw new Error("server-native emits artifact data; TypeScript conversion options do not apply.");
        }
        const resolved = await resolveComponentSources(components, {
            baseDir: configDir || process.cwd(), operation: "ssr",
        });
        if (resolved.components.length === 0) {
            throw new Error("server-native requires at least one configured component.");
        }
        const templates = Object.create(null);
        for (const component of resolved.components) {
            templates[component.tagName] = readComponentTemplate(component).definition;
        }
        const output = outputArg || "server.artifact.json";
        if (path.extname(output) !== ".json") {
            throw new Error("server-native output must use the .json extension.");
        }
        if (output.includes("*")) {
            throw new Error("server-native requires one output artifact for the complete template registry.");
        }
        protectComponentInputs([output, `${output}.lock`], resolved.inputFiles);
        const { writeServerArtifact } = require("../server.js");
        writeServerArtifact(output, { entry: "", templates }, { overwrite });
        process.stdout.write(`Converted server registry: ${output}\n`);
        return;
    }
    if (syntax === "server-native") {
        if (!templatesArg) {
            throw new Error("Missing required --templates.");
        }
        if (typed || typeSource || typeSourceImport) {
            throw new Error("server-native emits artifact data; TypeScript conversion options do not apply.");
        }
        const output = outputArg || "server.artifact.json";
        const metadata = { "server-native": { extension: ".json" } };
        if (output.includes("*")) {
            throw new Error("server-native requires one output artifact for the complete template registry.");
        }
        validateConvertOutput(output, syntax, overwrite, metadata);
        const sources = [];
        const filenames = [];
        for (const pattern of templatesArg.split(",").map(value => value.trim())) {
            for (const filename of resolveTemplateFiles(pattern)) {
                sources.push(fs.readFileSync(filename, "utf8"));
                filenames.push(filename);
            }
        }
        const { writeServerArtifact } = require("../server.js");
        try {
            writeServerArtifact(
                output,
                { entry: "", templateSources: sources },
                {
                    overwrite,
                    onWarning({ sourceIndex, content }) {
                        process.stderr.write(
                            `Warning: <f-template> without a 'name' attribute in '${filenames[sourceIndex]}': ${content.trim()}\n`,
                        );
                    },
                },
            );
        } catch (error) {
            if (error.code === "missing-template-sources") {
                throw new Error("server-native requires at least one named template.");
            }
            throw error;
        }
        process.stdout.write(`Converted server registry: ${output}\n`);
        return;
    }
    const wasm = loadConvertWasm();
    const syntaxMetadata = loadConvertSyntaxMetadata(wasm);
    const syntaxList = convertSyntaxList(syntaxMetadata);

    if (!syntax) {
        process.stderr.write(
            `Error: Missing required --syntax. Expected one of: ${syntaxList}.\n`,
        );
        process.exit(1);
    }

    if (!Object.prototype.hasOwnProperty.call(syntaxMetadata, syntax)) {
        process.stderr.write(
            `Error: Invalid --syntax "${syntax}". Expected one of: ${syntaxList}.\n`,
        );
        process.exit(1);
    }
    if (components !== undefined) {
        if (outputArg !== undefined) {
            throw new Error("Component conversion uses each component's generated directory, not output.");
        }
        await convertComponents(components, configDir || process.cwd(), syntax,
            overwrite, wasm, syntaxMetadata[syntax]);
        return;
    }

    if (!templatesArg) {
        process.stderr.write("Error: Missing required --templates.\n");
        process.exit(1);
    }

    runConvertBatch(
        templatesArg,
        syntax,
        outputArg,
        overwrite,
        wasm,
        syntaxMetadata,
        typeSource,
        typeSourceImport,
        typed,
    );
}

async function runBuild(args) {
    for (const name of Object.keys(args)) {
        if (name !== "config" && !BUILD_ALLOWED_CONFIG_KEYS.has(name)) {
            throw new Error(`Unknown build option --${name}.`);
        }
    }
    const { config, configDir } = loadConfig(
        Object.prototype.hasOwnProperty.call(args, "config") ? args["config"] : undefined,
        BUILD_DEFAULT_CONFIG_FILENAME,
        BUILD_ALLOWED_CONFIG_KEYS,
        BUILD_BOOLEAN_CONFIG_KEYS,
    );
    const components = componentConfig(args, config);

    const templatesArg = resolveOption(args, config, configDir, "templates");
    if (templatesArg !== undefined && templatesArg.trim() === "") {
        throw new Error("--templates requires at least one named template.");
    }
    const output = resolveOption(args, config, configDir, "output", "output.html") ?? "output.html";
    const serverArtifact = resolveOption(args, config, configDir, "server-artifact");
    if (serverArtifact !== undefined && serverArtifact === "") {
        throw new Error("--server-artifact requires a nonempty output path.");
    }
    const managedPaths = serverArtifact === undefined
        ? []
        : [serverArtifact, `${serverArtifact}.lock`]
            .map(filename => path.resolve(filename));
    if (serverArtifact !== undefined) {
        if (!managedPaths[0].endsWith(".json")) {
            throw new Error("--server-artifact requires a .json output path.");
        }
        if (managedPaths.includes(path.resolve(output))) {
            throw new Error("HTML output must not replace the persistent server artifact or its lock.");
        }
    }
    const entry = resolveOption(args, config, configDir, "entry", "index.html");
    const stateFile = resolveOption(args, config, configDir, "state");
    const stateWasProvided =
        Object.prototype.hasOwnProperty.call(args, "state") ||
        Object.prototype.hasOwnProperty.call(config, "state");
    const attributeNameStrategy = resolveOption(args, config, configDir, "attribute-name-strategy");
    const markersV2 = resolveBooleanOption(args, config, "markers_v2");

    if (attributeNameStrategy && attributeNameStrategy !== "none" && attributeNameStrategy !== "camelCase") {
        process.stderr.write(
            `Error: Invalid --attribute-name-strategy "${attributeNameStrategy}". Expected "none" or "camelCase".\n`
        );
        process.exit(1);
    }

    // Resolve template files
    const templatesMap = Object.create(null);
    let componentInputs = [];
    /** @type {string[]} */
    const sources = [];
    /** @type {string[]} */
    const filenames = [];
    if (components !== undefined) {
        const resolved = await resolveComponentSources(components, {
            baseDir: configDir || process.cwd(), operation: "ssr",
        });
        componentInputs = resolved.inputFiles;
        for (const component of resolved.components) {
            templatesMap[component.tagName] = readComponentTemplate(component).definition;
        }
    } else if (templatesArg === undefined) {
        process.stderr.write(
            "Warning: --templates was not provided. No custom element templates will be loaded.\n"
        );
    } else {
        const patterns = templatesArg.split(",").map((p) => p.trim()).filter(Boolean);
        for (const pattern of patterns) {
            const wasm = serverArtifact === undefined ? require(BUILD_WASM_MODULE) : null;
            const matches = resolveTemplateFiles(pattern);
            const definitions = [];
            for (const filename of matches) {
                const source = fs.readFileSync(filename, "utf8");
                if (serverArtifact !== undefined) {
                    sources.push(source);
                    filenames.push(filename);
                } else {
                    definitions.push(...parseFTemplates(source, filename, wasm));
                }
            }
            if ((serverArtifact === undefined ? definitions : matches).length === 0) {
                process.stderr.write(
                    `Warning: No template files found for pattern "${pattern}".\n`
                );
            }
            for (const { name, ...definition } of definitions) {
                if (Object.hasOwn(templatesMap, name)) {
                    throw new Error(`Duplicate template name "${name}".`);
                }
                templatesMap[name] = definition;
            }
        }
        if (
            templatesArg !== undefined &&
            (serverArtifact === undefined ? Object.keys(templatesMap).length : sources.length) === 0
        ) {
            throw new Error("--templates requires at least one named template.");
        }
    }

    // Read entry file
    if (!fs.existsSync(entry)) {
        process.stderr.write(`Error: Entry file "${entry}" not found.\n`);
        process.exit(1);
    }
    const entryContent = fs.readFileSync(entry, "utf8");

    // Keep the original bytes so native validation sees every supplied JSON value.
    let stateContent = Buffer.from("{}");
    if (stateWasProvided) {
        if (stateFile === undefined || stateFile === "" || !fs.existsSync(stateFile)) {
            const stateFileLabel =
                stateFile === undefined || stateFile === ""
                    ? "(no path provided)"
                    : `"${stateFile}"`;
            process.stderr.write(`Error: State file ${stateFileLabel} not found.\n`);
            process.exit(1);
        }
        stateContent = fs.readFileSync(stateFile);
    }
    if (serverArtifact !== undefined) {
        if ([entry, stateFile, ...filenames].some(
            filename => filename !== undefined && managedPaths.includes(path.resolve(filename)),
        )) {
            throw new Error("Persistent server artifact paths must not replace authored input files.");
        }
    }

    if (components !== undefined) {
        const authored = [...componentInputs, entry, stateFile].filter(Boolean)
            .flatMap(filename => [path.resolve(filename), fs.realpathSync(filename)]);
        protectComponentInputs([output, ...managedPaths], authored);
    }
    const addonPath = resolveOption(args, config, configDir, "native-addon") || process.env.FAST_NATIVE_ADDON;
    const { loadNativeHost } = require("../native-host.mjs");
    const Program = loadNativeHost(addonPath);
    const { compileServerArtifact, writeServerArtifact } = require("../server.js");
    let artifact;
    if (serverArtifact === undefined) {
        artifact = Buffer.from(compileServerArtifact(entryContent, templatesMap));
    } else {
        const result = writeServerArtifact(
            serverArtifact,
            components !== undefined || templatesArg === undefined
                ? { entry: entryContent, templates: templatesMap }
                : { entry: entryContent, templateSources: sources },
            {
                overwrite: true,
                includeBytes: true,
                onWarning({ sourceIndex, content }) {
                    process.stderr.write(
                        `Warning: <f-template> without a 'name' attribute in '${filenames[sourceIndex]}': ${content.trim()}\n`,
                    );
                },
            },
        );
        artifact = Buffer.from(/** @type {Uint8Array} */ (result.bytes));
    }
    const server = new Program(
        artifact,
        { attributeNameStrategy: attributeNameStrategy || undefined, markersV2 },
    );
    const rendered = server.renderEntryJson(stateContent);

    // Write output
    if (components !== undefined) {
        fs.mkdirSync(path.dirname(output), { recursive: true });
        writeComponentOutput(output, rendered);
    } else {
        fs.writeFileSync(output, rendered, "utf8");
    }
    process.stdout.write(`Built: ${output}\n`);
}

/** @returns {ComponentSource[] | undefined} */
function componentConfig(args, config) {
    if (Object.hasOwn(args, "components")) {
        throw new Error("Configure the components array in a JSON config file.");
    }
    const legacy = ["templates", "type-source", "type-source-import", "typed"]
        .filter(key => Object.hasOwn(args, key) || Object.hasOwn(config, key));
    if (config.components !== undefined) {
        if (legacy.length) {
            throw new Error("Do not combine components with deprecated template selectors or global type-source options.");
        }
        return /** @type {ComponentSource[]} */ (config.components);
    }
    if (legacy.length) {
        process.stderr.write(`Deprecated: ${legacy.join(", ")} source configuration; use a components array instead.\n`);
    }
    return undefined;
}

/** @param {ResolvedComponentSource} component */
function readComponentTemplate(component) {
    try {
        const source = fs.readFileSync(component.template, "utf8");
        const wasm = require(BUILD_WASM_MODULE);
        /** @type {FTemplateMetadata[]} */
        const definitions = JSON.parse(wasm.parse_f_templates(source));
        if (definitions.length !== 1 || definitions[0].name !== component.tagName) {
            throw new Error(`Component "${component.tagName}" template "${component.template}" must contain exactly one <f-template name="${component.tagName}"> definition.`);
        }
        const { name, ...definition } = definitions[0];
        return { source, definition };
    } catch (error) {
        throw new Error(`${component.template}: ${error.message}`, { cause: error });
    }
}

function protectComponentInputs(outputs, inputs) {
    const authored = new Set(inputs);
    for (const output of outputs) {
        if (authored.has(path.resolve(output)) ||
            (fs.existsSync(output) && authored.has(fs.realpathSync(output)))) {
            throw new Error(`Output paths must not replace authored component inputs: ${output}`);
        }
    }
}

function checkComponentOutput(output, overwrite) {
    const info = fs.lstatSync(output, { throwIfNoEntry: false });
    if (info && !info.isFile()) {
        throw new Error(`Refusing to overwrite non-regular generated output: ${output}`);
    }
    if (info && !overwrite) {
        throw new Error(`Output file "${output}" already exists. Use --overwrite to replace it.`);
    }
}

function writeComponentOutput(output, content) {
    const temporary = `${output}.${randomUUID()}.tmp`;
    try {
        fs.writeFileSync(temporary, content, { flag: "wx" });
        fs.renameSync(temporary, output);
    } finally {
        try {
            fs.unlinkSync(temporary);
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
        }
    }
}

async function convertComponents(components, baseDir, syntax, overwrite, wasm, metadata) {
    if (components.length === 0) {
        throw new Error("Conversion requires at least one configured component.");
    }
    const typescript = metadata.extension === ".ts";
    const options = {
        baseDir,
        operation: typescript ? "typescript" : "html",
        ...(typescript ? {} : { templateSuffix: metadata.suffix }),
    };
    let resolved = await resolveComponentSources(components, options);
    for (const component of resolved.components) {
        fs.mkdirSync(component.generated, { recursive: true });
    }
    resolved = await resolveComponentSources(components, options);
    const outputs = new Map();
    const warnings = [];
    for (const component of resolved.components) {
        const { source } = readComponentTemplate(component);
        try {
            const result = wasm.convert_template_with_options(
                source, syntax, typescript ? component.className : undefined,
                typescript ? component.typeSourceImport : undefined,
                typescript || undefined,
            );
            try {
                outputs.set(component.templateOutput, result.output);
                warnings.push(...result.warnings.map(warning => `${component.template}: ${warning}`));
            } finally {
                result.free();
            }
        } catch (error) {
            throw new Error(`${component.template}: ${error.message}`, { cause: error });
        }
        if (component.stylesheetOutput) {
            try {
                outputs.set(component.stylesheetOutput, wasm.convert_stylesheet(
                    fs.readFileSync(component.stylesheet, "utf8"), syntax, "styles", true,
                ));
            } catch (error) {
                throw new Error(`${component.stylesheet}: ${error.message}`, { cause: error });
            }
        }
    }
    for (const output of outputs.keys()) {
        checkComponentOutput(output, overwrite);
    }
    for (const warning of warnings) {
        process.stderr.write(`Warning: ${warning}\n`);
    }
    for (const [output, content] of outputs) {
        checkComponentOutput(output, overwrite);
        writeComponentOutput(output, content);
        process.stdout.write(`Converted: ${output}\n`);
    }
    process.stdout.write(`Converted ${resolved.components.length} component(s).\n`);
}

function writeGeneralUsage() {
    process.stdout.write(
        "Usage: fast <command> [options]\n\n" +
        "Commands:\n" +
        "  build     Render a FAST declarative HTML template.\n" +
        "  convert   Convert a FAST declarative HTML template.\n\n" +
        'Run "fast <command> --help" for command options.\n',
    );
}

function writeBuildUsage() {
    process.stdout.write(
        "Usage: fast build [options]\n\n" +
        "Component sources are configured as a components array in JSON:\n" +
        '  { "components": [{ "tagName": "my-card", "template": "./src/card.html" }] }\n\n' +
        "Options:\n" +
        '  --output="output.html" Output file path (default: output.html)\n' +
        '  --entry="index.html"   Entry HTML template file (default: index.html)\n' +
        '  --server-artifact="<path.json>"\n' +
        "                         Persist authored inputs and compiled plans together;\n" +
        "                         reuse compiled plans on later builds.\n" +
        '  --native-addon="<path.node>" Override the installed native host; alternatively set FAST_NATIVE_ADDON.\n' +
        '  --state="state.json"   State JSON file. If omitted, rendering uses\n' +
        "                         an empty state object.\n" +
        '  --attribute-name-strategy="camelCase"\n' +
        "                         Strategy for mapping attribute names to property names.\n" +
        '                         "camelCase" (default) or "none".\n' +
        "  --markers_v2[=true|false]\n" +
        "                         Emit FAST Element 2.x indexed hydration markers.\n" +
        '  --config="<path>"      Path to a fast-build config JSON file.\n' +
        '                         Defaults to "fast-build.config.json" in the\n' +
        "                         current directory if it exists. File paths in\n" +
        "                         the config are resolved relative to the config\n" +
        "                         file's directory. CLI arguments take precedence\n" +
        "                         over config file values.\n",
    );
}

function writeConvertUsage() {
    const serverTarget = JSON.parse(require(BUILD_WASM_MODULE).server_syntax_metadata());
    const syntaxMetadata = {
        ...loadConvertSyntaxMetadata(loadConvertWasm()),
        [serverTarget.syntax]: serverTarget,
    };
    const syntaxList = convertSyntaxList(syntaxMetadata);
    process.stdout.write(
        "Usage: fast convert [options]\n\n" +
        "Configure a components array in fast-convert.config.json:\n" +
        '  { "syntax": "fast-v3-ts", "components": [{ "tagName": "my-card",\n' +
        '    "template": "./src/card.html", "stylesheet": "./src/card.css",\n' +
        '    "clientModule": "./src/card.ts", "className": "MyCard",\n' +
        '    "generated": "./src/generated/" }] }\n\n' +
        "Options:\n" +
        `  --syntax="${syntaxList}"\n` +
        "                         Required target syntax.\n" +
        "                         server-native compiles the complete registry into\n" +
        "                         one server.artifact.json (or --output), without\n" +
        "                         importing browser classes at request time.\n" +
        '  --output="<path.json>" server-native artifact path (default: server.artifact.json).\n' +
        "  --overwrite           Replace an existing output file.\n" +
        '  --config="<path>"      Path to a fast-convert config JSON file.\n' +
        '                         Defaults to "fast-convert.config.json" in the\n' +
        "                         current directory if it exists. File paths in\n" +
        "                         the config are resolved relative to the config\n" +
        "                         file's directory. CLI arguments take precedence\n" +
        "                         over config file values.\n",
    );
}

async function main() {
    const argv = process.argv.slice(2);
    if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
        writeGeneralUsage();
        return;
    }

    const subcommand = argv[0];
    if (subcommand === "build") {
        if (argv[1] === "--help" || argv[1] === "-h") {
            writeBuildUsage();
            return;
        }
        const args = parseArgs(argv.slice(1));
        await runBuild(args);
        return;
    }

    if (subcommand === "convert") {
        if (argv[1] === "--help" || argv[1] === "-h") {
            writeConvertUsage();
            return;
        }
        const args = parseArgs(argv.slice(1));
        await runConvert(args);
        return;
    }

    process.stderr.write(
        `Unknown subcommand: "${subcommand}". Expected "build" or "convert".\n`,
    );
    process.exit(1);
}

main().catch((err) => {
    process.stderr.write(`Error: ${err.message || err}\n`);
    process.exit(1);
});
