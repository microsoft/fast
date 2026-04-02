#!/usr/bin/env node
// @ts-check
"use strict";

const fs = require("fs");
const path = require("path");

const WASM_MODULE = path.join(__dirname, "../wasm/microsoft_fast_build.js");

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
 * Parse all `<f-template>` elements from an HTML string.
 * Returns [{name, content}] for templates that have a `name` attribute.
 * Emits a warning to stderr for any `<f-template>` without a `name`.
 * @param {string} html
 * @param {string} filePath - used in warning messages
 * @returns {{ name: string, content: string }[]}
 */
function parseFTemplates(html, filePath) {
    const results = [];
    let pos = 0;
    while (pos < html.length) {
        const tagStart = html.indexOf("<f-template", pos);
        if (tagStart === -1) break;
        const afterTagName = tagStart + "<f-template".length;
        // Ensure the char after "<f-template" is not alphanumeric or '-'
        // to avoid matching tags like <f-templatex>.
        const nextCh = html[afterTagName];
        if (nextCh && /[a-zA-Z0-9\-]/.test(nextCh)) {
            pos = afterTagName;
            continue;
        }
        // Find the closing '>' of the opening <f-template ...> tag.
        const bracketClose = html.indexOf(">", afterTagName);
        if (bracketClose === -1) break;
        const attrs = html.slice(afterTagName, bracketClose);
        const name = extractAttrValue(attrs, "name");
        // Find the matching </f-template>.
        const innerStart = bracketClose + 1;
        const endTag = "</f-template>";
        const innerEnd = html.indexOf(endTag, innerStart);
        if (innerEnd === -1) break;
        const innerHtml = html.slice(innerStart, innerEnd);
        const content = extractTemplateContent(innerHtml);
        if (name === null) {
            process.stderr.write(
                `Warning: <f-template> without a 'name' attribute in '${filePath}': ${content.trim()}\n`
            );
        } else {
            results.push({ name, content });
        }
        pos = innerEnd + endTag.length;
    }
    return results;
}

/**
 * Extract the value of a named attribute from an attribute string.
 * Supports both double-quoted (name="value") and single-quoted (name='value') forms.
 * @param {string} attrs
 * @param {string} attrName
 * @returns {string | null}
 */
function extractAttrValue(attrs, attrName) {
    const dqStart = attrs.indexOf(`${attrName}="`);
    if (dqStart !== -1) {
        const valStart = dqStart + attrName.length + 2;
        const valEnd = attrs.indexOf('"', valStart);
        if (valEnd !== -1) return attrs.slice(valStart, valEnd);
    }
    const sqStart = attrs.indexOf(`${attrName}='`);
    if (sqStart !== -1) {
        const valStart = sqStart + attrName.length + 2;
        const valEnd = attrs.indexOf("'", valStart);
        if (valEnd !== -1) return attrs.slice(valStart, valEnd);
    }
    return null;
}

/**
 * Extract the trimmed inner content of the first `<template>` element in `html`.
 * Returns `html.trim()` if no `<template>` element is found.
 * @param {string} html
 * @returns {string}
 */
function extractTemplateContent(html) {
    const open = html.indexOf("<template");
    if (open === -1) return html.trim();
    const tagEnd = html.indexOf(">", open);
    if (tagEnd === -1) return html.trim();
    const contentStart = tagEnd + 1;
    const close = html.indexOf("</template>", contentStart);
    if (close === -1) return html.trim();
    return html.slice(contentStart, close).trim();
}

/**
 * Resolve all HTML files matching a glob pattern.
 * Parses `<f-template name="...">` elements from each matched file and
 * returns one entry per template. A single file may yield multiple entries.
 * Warns (but does not error) if the base directory does not exist.
 * @param {string} pattern
 * @returns {{ name: string, content: string }[]}
 */
function resolvePattern(pattern) {
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
            const templates = parseFTemplates(html, file);
            for (const { name, content } of templates) {
                results.push({ name, content });
            }
        }
    }
    return results;
}

async function runBuild(args) {
    const templatesArg = args["templates"];
    const output = args["output"] || "output.html";
    const entry = args["entry"] || "index.html";
    const stateFile = args["state"] || "state.json";

    // Resolve template files
    const templatesMap = {};
    if (!templatesArg) {
        process.stderr.write(
            "Warning: --templates was not provided. No custom element templates will be loaded.\n"
        );
    } else {
        const patterns = templatesArg.split(",").map((p) => p.trim());
        for (const pattern of patterns) {
            const matches = resolvePattern(pattern);
            if (matches.length === 0) {
                process.stderr.write(
                    `Warning: No template files found for pattern "${pattern}".\n`
                );
            }
            for (const { name, content } of matches) {
                if (name in templatesMap) {
                    process.stderr.write(
                        `Warning: Duplicate template name "${name}" — later file overwrites earlier.\n`
                    );
                }
                templatesMap[name] = content;
            }
        }
    }

    // Read entry file
    if (!fs.existsSync(entry)) {
        process.stderr.write(`Error: Entry file "${entry}" not found.\n`);
        process.exit(1);
    }
    const entryContent = fs.readFileSync(entry, "utf8");

    // Read state file
    if (!fs.existsSync(stateFile)) {
        process.stderr.write(`Error: State file "${stateFile}" not found.\n`);
        process.exit(1);
    }
    const stateContent = fs.readFileSync(stateFile, "utf8");

    // Load WASM module
    const wasm = require(WASM_MODULE);

    // Render
    let rendered;
    if (Object.keys(templatesMap).length > 0) {
        rendered = wasm.render_with_templates(entryContent, JSON.stringify(templatesMap), stateContent);
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
            '  --state="state.json"   State JSON file (default: state.json)\n'
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
