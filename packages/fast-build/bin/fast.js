#!/usr/bin/env node
// @ts-check
"use strict";

const fs = require("fs");
const path = require("path");

const BUILD_WASM_MODULE = path.join(__dirname, "../wasm/microsoft_fast_build.js");
const CONVERT_WASM_MODULE = path.join(
    __dirname,
    "../wasm/convert/microsoft_fast_convert.js",
);
const BUILD_DEFAULT_CONFIG_FILENAME = "fast-build.config.json";
const CONVERT_DEFAULT_CONFIG_FILENAME = "fast-convert.config.json";
const VALUELESS_CLI_FLAGS = new Set(["stream", "overwrite"]);
const BUILD_ALLOWED_CONFIG_KEYS = new Set([
    "entry",
    "state",
    "output",
    "templates",
    "attribute-name-strategy",
    "stream",
]);
const BUILD_BOOLEAN_CONFIG_KEYS = new Set(["stream"]);
const CONVERT_ALLOWED_CONFIG_KEYS = new Set([
    "syntax",
    "template",
    "output",
    "overwrite",
]);
const CONVERT_BOOLEAN_CONFIG_KEYS = new Set(["overwrite"]);
const CONFIG_PATH_KEYS = new Set(["entry", "state", "output", "templates", "template"]);

/** @typedef {Record<string, string | boolean>} FastConfig */
/** @typedef {{ syntax: string, extension: string, suffix: string }} ConvertSyntaxMetadata */

/**
 * Parse CLI arguments of the form --key="value", --key=value, or supported
 * valueless flags like --stream.
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
        if (flag && VALUELESS_CLI_FLAGS.has(flag[1])) {
            args[flag[1]] = "true";
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
 * @returns {{ name: string, content: string, shadowrootAttributes: { name: string, value: string | null }[], hostAttributes: { name: string, value: string | null }[] }[]}
 */
function parseFTemplates(html, filePath, wasm) {
    /** @type {{ name: string | null, content: string, shadowrootAttributes?: { name: string, value: string | null }[], hostAttributes?: { name: string, value: string | null }[] }[]} */
    const parsed = JSON.parse(wasm.parse_f_templates(html));
    const results = [];
    for (const { name, content, shadowrootAttributes, hostAttributes } of parsed) {
        if (name === null) {
            process.stderr.write(
                `Warning: <f-template> without a 'name' attribute in '${filePath}': ${content.trim()}\n`
            );
        } else {
            results.push({
                name,
                content,
                shadowrootAttributes: shadowrootAttributes || [],
                hostAttributes: hostAttributes || [],
            });
        }
    }
    return results;
}

/**
 * Resolve all HTML files matching a glob pattern.
 * Parses `<f-template name="...">` elements from each matched file and
 * returns one entry per template. A single file may yield multiple entries.
 * Warns (but does not error) if the base directory does not exist.
 * @param {string} pattern
 * @param {object} wasm - the loaded WASM module
 * @returns {{ name: string, content: string, shadowrootAttributes: { name: string, value: string | null }[], hostAttributes: { name: string, value: string | null }[] }[]}
 */
function resolvePattern(pattern, wasm) {
    const baseDir = staticPrefixDir(pattern);
    if (!fs.existsSync(baseDir)) {
        return [];
    }
    const allFiles = [];
    walkHtmlFiles(baseDir, allFiles);
    const results = [];
    for (const file of allFiles) {
        if (globMatch(pattern, file)) {
            const html = fs.readFileSync(file, "utf8");
            const templates = parseFTemplates(html, file, wasm);
            for (const { name, content, shadowrootAttributes, hostAttributes } of templates) {
                results.push({ name, content, shadowrootAttributes, hostAttributes });
            }
        }
    }
    return results;
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
 * Validate the converter output path before writing.
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
    if (!fs.existsSync(outputParent)) {
        process.stderr.write(
            `Error: Output parent directory "${outputParent}" not found.\n`,
        );
        process.exit(1);
    }

    if (!fs.statSync(outputParent).isDirectory()) {
        process.stderr.write(
            `Error: Output parent path "${outputParent}" is not a directory.\n`,
        );
        process.exit(1);
    }

    if (fs.existsSync(output) && !overwrite) {
        process.stderr.write(
            `Error: Output file "${output}" already exists. Use --overwrite to replace it.\n`,
        );
        process.exit(1);
    }
}

async function runConvert(args) {
    const { config, configDir } = loadConfig(
        Object.prototype.hasOwnProperty.call(args, "config") ? args["config"] : undefined,
        CONVERT_DEFAULT_CONFIG_FILENAME,
        CONVERT_ALLOWED_CONFIG_KEYS,
        CONVERT_BOOLEAN_CONFIG_KEYS,
    );

    const syntax = resolveOption(args, config, configDir, "syntax");
    const template = resolveOption(args, config, configDir, "template");
    const outputArg = resolveOption(args, config, configDir, "output");
    const overwrite = resolvePresenceBooleanOption(args, config, "overwrite");
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

    if (!template) {
        process.stderr.write("Error: Missing required --template.\n");
        process.exit(1);
    }

    if (path.extname(template) !== ".html") {
        process.stderr.write(
            `Error: Template file "${template}" must use the ".html" extension.\n`,
        );
        process.exit(1);
    }

    if (!fs.existsSync(template)) {
        process.stderr.write(`Error: Template file "${template}" not found.\n`);
        process.exit(1);
    }

    if (!fs.statSync(template).isFile()) {
        process.stderr.write(`Error: Template path "${template}" is not a file.\n`);
        process.exit(1);
    }

    const output = resolveConvertOutput(template, syntax, outputArg, syntaxMetadata);
    validateConvertOutput(output, syntax, overwrite, syntaxMetadata);

    const converted = wasm.convert_template(fs.readFileSync(template, "utf8"), syntax);
    fs.writeFileSync(output, converted, "utf8");
    process.stdout.write(`Converted: ${output}\n`);
}

async function runBuild(args) {
    const { config, configDir } = loadConfig(
        Object.prototype.hasOwnProperty.call(args, "config") ? args["config"] : undefined,
        BUILD_DEFAULT_CONFIG_FILENAME,
        BUILD_ALLOWED_CONFIG_KEYS,
        BUILD_BOOLEAN_CONFIG_KEYS,
    );

    const templatesArg = resolveOption(args, config, configDir, "templates");
    const output = resolveOption(args, config, configDir, "output", "output.html");
    const entry = resolveOption(args, config, configDir, "entry", "index.html");
    const stateFile = resolveOption(args, config, configDir, "state");
    const stateWasProvided =
        Object.prototype.hasOwnProperty.call(args, "state") ||
        Object.prototype.hasOwnProperty.call(config, "state");
    const attributeNameStrategy = resolveOption(args, config, configDir, "attribute-name-strategy");
    const stream = resolveBooleanOption(args, config, "stream");

    if (attributeNameStrategy && attributeNameStrategy !== "none" && attributeNameStrategy !== "camelCase") {
        process.stderr.write(
            `Error: Invalid --attribute-name-strategy "${attributeNameStrategy}". Expected "none" or "camelCase".\n`
        );
        process.exit(1);
    }

    // Load WASM module first — needed for both template parsing and rendering.
    const wasm = require(BUILD_WASM_MODULE);

    // Resolve template files
    const templatesMap = {};
    if (!templatesArg) {
        if (!stream) {
            process.stderr.write(
                "Warning: --templates was not provided. No custom element templates will be loaded.\n"
            );
        }
    } else {
        const patterns = templatesArg.split(",").map((p) => p.trim());
        for (const pattern of patterns) {
            const matches = resolvePattern(pattern, wasm);
            if (matches.length === 0) {
                process.stderr.write(
                    `Warning: No template files found for pattern "${pattern}".\n`
                );
            }
            for (const { name, content, shadowrootAttributes, hostAttributes } of matches) {
                if (name in templatesMap) {
                    process.stderr.write(
                        `Warning: Duplicate template name "${name}" — later file overwrites earlier.\n`
                    );
                }
                templatesMap[name] = { content, shadowrootAttributes, hostAttributes };
            }
        }
    }

    // Read entry file
    if (!fs.existsSync(entry)) {
        process.stderr.write(`Error: Entry file "${entry}" not found.\n`);
        process.exit(1);
    }
    const entryContent = fs.readFileSync(entry, "utf8");

    // Read state only when explicitly provided; omitted state is handled by WASM as `{}`.
    let stateContent;
    if (stateWasProvided) {
        if (stateFile === undefined || stateFile === "" || !fs.existsSync(stateFile)) {
            const stateFileLabel =
                stateFile === undefined || stateFile === ""
                    ? "(no path provided)"
                    : `"${stateFile}"`;
            process.stderr.write(`Error: State file ${stateFileLabel} not found.\n`);
            process.exit(1);
        }
        stateContent = fs.readFileSync(stateFile, "utf8");
    }

    // Render
    if (stream) {
        if (typeof wasm.render_entry_with_templates !== "function") {
            process.stderr.write(
                "Error: Streaming requires render_entry_with_templates to be exported by the WASM module.\n"
            );
            process.exit(1);
        }

        const renderedChunks = wasm.render_entry_with_templates(
            entryContent,
            JSON.stringify(templatesMap),
            stateContent,
            attributeNameStrategy || "",
            true,
        );

        /** @type {unknown} */
        let chunks;
        try {
            chunks = JSON.parse(renderedChunks);
        } catch (e) {
            process.stderr.write(
                `Error: Streaming renderer returned invalid JSON: ${e.message}\n`
            );
            process.exit(1);
        }

        if (
            !Array.isArray(chunks) ||
            chunks.some((chunk) => typeof chunk !== "string")
        ) {
            process.stderr.write(
                "Error: Streaming renderer must return a JSON array of strings.\n"
            );
            process.exit(1);
        }

        for (const chunk of chunks) {
            process.stdout.write(chunk);
        }
        return;
    }

    let rendered;
    if (Object.keys(templatesMap).length > 0) {
        rendered = wasm.render_entry_with_templates(
            entryContent,
            JSON.stringify(templatesMap),
            stateContent,
            attributeNameStrategy || "",
        );
    } else {
        rendered = wasm.render(entryContent, stateContent);
    }

    // Write output
    fs.writeFileSync(output, rendered, "utf8");
    process.stdout.write(`Built: ${output}\n`);
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
        "Options:\n" +
        '  --templates="<glob>"   Glob pattern(s) for custom element template HTML files.\n' +
        "                         Separate multiple patterns with commas.\n" +
        '  --output="output.html" Output file path (default: output.html)\n' +
        '  --entry="index.html"   Entry HTML template file (default: index.html)\n' +
        '  --state="state.json"   State JSON file. If omitted, rendering uses\n' +
        "                         an empty state object.\n" +
        "  --stream[=true|false]  Write rendered HTML chunks to stdout instead\n" +
        "                         of writing an output file.\n" +
        '  --attribute-name-strategy="camelCase"\n' +
        "                         Strategy for mapping attribute names to property names.\n" +
        '                         "camelCase" (default) or "none".\n' +
        '  --config="<path>"      Path to a fast-build config JSON file.\n' +
        '                         Defaults to "fast-build.config.json" in the\n' +
        "                         current directory if it exists. File paths in\n" +
        "                         the config are resolved relative to the config\n" +
        "                         file's directory. CLI arguments take precedence\n" +
        "                         over config file values.\n",
    );
}

function writeConvertUsage() {
    const syntaxMetadata = loadConvertSyntaxMetadata(loadConvertWasm());
    const syntaxList = convertSyntaxList(syntaxMetadata);
    const defaultOutputs = Object.values(syntaxMetadata)
        .map(metadata => `"*${metadata.suffix}" for ${metadata.syntax}`)
        .join(" or\n                         ");

    process.stdout.write(
        "Usage: fast convert [options]\n\n" +
        "Options:\n" +
        `  --syntax="${syntaxList}"\n` +
        "                         Required target syntax.\n" +
        '  --template="<path>"    Required source FAST declarative .html file.\n' +
        '  --output="<path>"      Output file path. Defaults next to --template\n' +
        `                         as ${defaultOutputs}. Any "*" is\n` +
        "                         replaced by the template basename.\n" +
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
