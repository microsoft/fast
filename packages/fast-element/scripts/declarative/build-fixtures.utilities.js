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
 * Returns an array of `{ name, content, source }` objects where `content`
 * is the inner HTML of the `<template>` child and `source` is the full
 * `<f-template>` element for conversion with `fast convert`.
 * @param {string} html - Raw HTML containing `<f-template>` elements.
 * @returns {{ name: string, content: string, source: string }[]}
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
        const source = match[0];

        if (attrs.length > 0) {
            results.push({
                name,
                content: `<template ${attrs}>${inner}</template>`,
                source,
            });
        } else {
            results.push({ name, content: inner, source });
        }
    }
    return results;
}
