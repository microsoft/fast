import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Auto-discover fixture directories that contain the required build files
 * (entry.html, templates.html, and state.json).
 * @param {string} fixturesDir - Absolute path to the fixtures directory.
 * @returns {string[]} Sorted array of fixture directory names.
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
        .map(entry => entry.name)
        .sort();
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
