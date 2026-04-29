#!/usr/bin/env node
// @ts-check
"use strict";

const fs = require("fs");
const path = require("path");

const WASM_MODULE = path.join(__dirname, "../wasm/microsoft_fast_build.js");
const DEFAULT_CONFIG_FILENAME = "fast-build.config.json";
const ALLOWED_CONFIG_KEYS = new Set([
    "entry",
    "state",
    "output",
    "templates",
    "attribute-name-strategy",
]);

/**
 * Parse CLI arguments of the form --key="value" or --key=value.
 * @param {string[]} argv
 * @returns {Record<string, string>}
 */
function parseArgs(argv) {
    const args = {};
    for (const arg of argv) {
        const match = arg.match(/^--([^=]+)=(.*)$/s);
        if (match) {
            args[match[1]] = match[2].replace(/^"|"$/g, "");
        }
    }
    return args;
}

/**
 * Load and validate a fast-build config file.
 *
 * - If `configPath` is provided, the file must exist (error if missing).
 * - If `configPath` is not provided, looks for `fast-build.config.json` in CWD.
 *   Returns an empty object if the default file does not exist.
 *
 * File paths in the returned config are resolved relative to the config
 * file's directory so that the caller can use them directly.
 *
 * @param {string | undefined} configPath - Explicit path from --config, if any.
 * @returns {{ config: Record<string, string>, configDir: string | null }}
 */
function loadConfig(configPath) {
    /** @type {string} */
    let resolvedPath;
    /** @type {boolean} */
    let isExplicit;

    if (configPath !== undefined) {
        resolvedPath = path.resolve(configPath);
        isExplicit = true;
    } else {
        resolvedPath = path.resolve(DEFAULT_CONFIG_FILENAME);
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
        if (!ALLOWED_CONFIG_KEYS.has(key)) {
            process.stderr.write(
                `Error: Unknown key "${key}" in config file "${resolvedPath}". Allowed keys: ${[...ALLOWED_CONFIG_KEYS].join(", ")}.\n`
            );
            process.exit(1);
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
 * @param {Record<string, string>} config - Parsed config file values.
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
        const isFilePath = key === "entry" || key === "state" || key === "output" || key === "templates";
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
 * @returns {{ name: string, content: string, shadowrootAttributes: { name: string, value: string | null }[] }[]}
 */
function parseFTemplates(html, filePath, wasm) {
    /** @type {{ name: string | null, content: string, shadowrootAttributes?: { name: string, value: string | null }[] }[]} */
    const parsed = JSON.parse(wasm.parse_f_templates(html));
    const results = [];
    for (const { name, content, shadowrootAttributes } of parsed) {
        if (name === null) {
            process.stderr.write(
                `Warning: <f-template> without a 'name' attribute in '${filePath}': ${content.trim()}\n`
            );
        } else {
            results.push({
                name,
                content,
                shadowrootAttributes: shadowrootAttributes || [],
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
 * @returns {{ name: string, content: string, shadowrootAttributes: { name: string, value: string | null }[] }[]}
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
            for (const { name, content, shadowrootAttributes } of templates) {
                results.push({ name, content, shadowrootAttributes });
            }
        }
    }
    return results;
}

async function runBuild(args) {
    const { config, configDir } = loadConfig(
        Object.prototype.hasOwnProperty.call(args, "config") ? args["config"] : undefined
    );

    const templatesArg = resolveOption(args, config, configDir, "templates");
    const output = resolveOption(args, config, configDir, "output", "output.html");
    const entry = resolveOption(args, config, configDir, "entry", "index.html");
    const stateFile = resolveOption(args, config, configDir, "state");
    const stateWasProvided =
        Object.prototype.hasOwnProperty.call(args, "state") ||
        Object.prototype.hasOwnProperty.call(config, "state");
    const attributeNameStrategy = resolveOption(args, config, configDir, "attribute-name-strategy");

    if (attributeNameStrategy && attributeNameStrategy !== "none" && attributeNameStrategy !== "camelCase") {
        process.stderr.write(
            `Error: Invalid --attribute-name-strategy "${attributeNameStrategy}". Expected "none" or "camelCase".\n`
        );
        process.exit(1);
    }

    // Load WASM module first — needed for both template parsing and rendering.
    const wasm = require(WASM_MODULE);

    // Resolve template files
    const templatesMap = {};
    if (!templatesArg) {
        process.stderr.write(
            "Warning: --templates was not provided. No custom element templates will be loaded.\n"
        );
    } else {
        const patterns = templatesArg.split(",").map((p) => p.trim());
        for (const pattern of patterns) {
            const matches = resolvePattern(pattern, wasm);
            if (matches.length === 0) {
                process.stderr.write(
                    `Warning: No template files found for pattern "${pattern}".\n`
                );
            }
            for (const { name, content, shadowrootAttributes } of matches) {
                if (name in templatesMap) {
                    process.stderr.write(
                        `Warning: Duplicate template name "${name}" — later file overwrites earlier.\n`
                    );
                }
                templatesMap[name] = { content, shadowrootAttributes };
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

async function main() {
    const argv = process.argv.slice(2);
    if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
        process.stdout.write(
            "Usage: fast build [options]\n\n" +
            "Options:\n" +
            '  --templates="<glob>"   Glob pattern(s) for custom element template HTML files.\n' +
            '                         Separate multiple patterns with commas.\n' +
            '  --output="output.html" Output file path (default: output.html)\n' +
            '  --entry="index.html"   Entry HTML template file (default: index.html)\n' +
            '  --state="state.json"   State JSON file. If omitted, rendering uses\n' +
            '                         an empty state object.\n' +
            '  --attribute-name-strategy="camelCase"\n' +
            '                         Strategy for mapping attribute names to property names.\n' +
            '                         "camelCase" (default) or "none".\n' +
            '  --config="<path>"      Path to a fast-build config JSON file.\n' +
            '                         Defaults to "fast-build.config.json" in the\n' +
            '                         current directory if it exists. File paths in\n' +
            '                         the config are resolved relative to the config\n' +
            '                         file\'s directory. CLI arguments take precedence\n' +
            '                         over config file values.\n'
        );
        return;
    }

    const subcommand = argv[0];
    if (subcommand !== "build") {
        process.stderr.write(`Unknown subcommand: "${subcommand}". Expected "build".\n`);
        process.exit(1);
    }

    const args = parseArgs(argv.slice(1));
    await runBuild(args);
}

main().catch((err) => {
    process.stderr.write(`Error: ${err.message || err}\n`);
    process.exit(1);
});
