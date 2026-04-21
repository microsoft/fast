import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Auto-discover fixture directories that contain the required build files
 * (entry.html, templates.html, state.json, and fast-build.config.json).
 *
 * Fixtures are organized in category subdirectories (e.g., bindings/attribute,
 * directives/repeat). The function scans two levels deep: category directories
 * at the top level, and fixture directories within each category.
 *
 * Each fixture directory must contain a `fast-build.config.json` that
 * configures the `@microsoft/fast-build` CLI. At minimum the config
 * should specify `entry`, `state`, `output`, and `templates`. Fixture-
 * specific options such as `attribute-name-strategy` can also be included.
 *
 * @param {string} fixturesDir - Absolute path to the fixtures directory.
 * @returns {string[]} Sorted array of fixture paths relative to fixturesDir
 *   (e.g., "bindings/attribute", "directives/repeat").
 */
export function discoverFixtures(fixturesDir) {
    const fixtures = [];

    for (const category of readdirSync(fixturesDir, { withFileTypes: true })) {
        if (!category.isDirectory()) continue;

        const categoryDir = join(fixturesDir, category.name);

        for (const fixture of readdirSync(categoryDir, { withFileTypes: true })) {
            if (!fixture.isDirectory()) continue;

            const dir = join(categoryDir, fixture.name);
            if (
                existsSync(join(dir, "entry.html")) &&
                existsSync(join(dir, "templates.html")) &&
                existsSync(join(dir, "state.json")) &&
                existsSync(join(dir, "fast-build.config.json"))
            ) {
                fixtures.push(`${category.name}/${fixture.name}`);
            }
        }
    }

    return fixtures.sort((a, b) => a.localeCompare(b));
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
