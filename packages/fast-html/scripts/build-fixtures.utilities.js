import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * @typedef {{ name: string, args?: string[] }} FixtureEntry
 */

/**
 * Convert a `fast-build.config.json` object into CLI arguments.
 * Each key-value pair becomes `--key=value`.
 * @param {Record<string, string>} config
 * @returns {string[]}
 */
function configToArgs(config) {
    return Object.entries(config).map(([key, value]) => `--${key}=${value}`);
}

/**
 * Auto-discover fixture directories that contain the required build files
 * (entry.html, templates.html, and state.json).
 *
 * If a fixture directory contains a `fast-build.config.json` file, its
 * key-value pairs are converted to CLI arguments for that fixture.
 * For example, `{ "attribute-name-strategy": "camelCase" }` becomes
 * `--attribute-name-strategy=camelCase`.
 *
 * @param {string} fixturesDir - Absolute path to the fixtures directory.
 * @returns {FixtureEntry[]} Sorted array of fixture entries.
 */
export function discoverFixtures(fixturesDir) {
    return readdirSync(fixturesDir, { withFileTypes: true })
        .filter(entry => {
            if (!entry.isDirectory()) return false;
            const dir = join(fixturesDir, entry.name);
            return (
                existsSync(join(dir, "entry.html")) &&
                existsSync(join(dir, "templates.html")) &&
                existsSync(join(dir, "state.json"))
            );
        })
        .map(entry => {
            const dir = join(fixturesDir, entry.name);
            const configPath = join(dir, "fast-build.config.json");
            if (existsSync(configPath)) {
                let config;
                try {
                    config = JSON.parse(readFileSync(configPath, "utf8"));
                } catch (error) {
                    const message =
                        error instanceof Error ? error.message : String(error);
                    throw new Error(
                        `Failed to parse fast-build.config.json for fixture "${entry.name}" at "${configPath}": ${message}`,
                    );
                }
                return { name: entry.name, args: configToArgs(config) };
            }
            return { name: entry.name };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Extract `<f-template name="X">` elements from an HTML string.
 * Returns an array of `{ name, content }` objects where `content`
 * is the inner HTML of the `<template>` child. When the `<template>`
 * element carries host-binding attributes (e.g. `@click`, `?disabled`),
 * those are preserved by wrapping the content in a `<template>` tag.
 * @param {string} html - Raw HTML containing `<f-template>` elements.
 * @returns {{ name: string, content: string }[]}
 */
export function extractFTemplates(html) {
    const results = [];
    const regex =
        /<f-template\s+name="([^"]+)">\s*<template([^>]*)>([\s\S]*?)<\/template>\s*<\/f-template>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        const name = match[1];
        const attrs = match[2].trim();
        const inner = match[3].trim();

        if (attrs.length > 0) {
            results.push({
                name,
                content: `<template ${attrs}>${inner}</template>`,
            });
        } else {
            results.push({ name, content: inner });
        }
    }
    return results;
}

/**
 * Convert FAST template directives to webui syntax.
 *
 * - `<f-when value="{{expr}}">` → `<if condition="expr">`
 * - `</f-when>` → `</if>`
 * - `<f-repeat value="{{item in list}}" ...>` → `<for each="item in list" ...>`
 * - `</f-repeat>` → `</for>`
 *
 * @param {string} html - Template HTML using FAST directive syntax.
 * @returns {string} Template HTML using webui directive syntax.
 */
export function convertToWebuiSyntax(html) {
    return html
        .replace(
            /<f-when\s+value="{{([\s\S]*?)}}"\s*>/g,
            (_, expr) => `<if condition="${expr.trim()}">`,
        )
        .replace(/<\/f-when>/g, "</if>")
        .replace(
            /<f-repeat\s+value="{{([\s\S]*?)}}"([^>]*)>/g,
            (_, expr, rest) => `<for each="${expr.trim()}"${rest}>`,
        )
        .replace(/<\/f-repeat>/g, "</for>");
}
