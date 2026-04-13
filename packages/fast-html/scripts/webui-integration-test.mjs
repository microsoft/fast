#!/usr/bin/env node

/**
 * WebUI Integration Test for FAST HTML Fixtures
 *
 * Validates that @microsoft/webui can build and render the same declarative
 * HTML fixtures used by @microsoft/fast-build. For each fixture directory,
 * this script:
 *   1. Extracts <f-template> components from templates.html into individual
 *      component files (webui uses filename-based component discovery).
 *   2. Builds the fixture with `webui build --plugin=fast`.
 *   3. Renders the compiled protocol with the fixture's state.json.
 *   4. Validates the rendered HTML for expected structure and content.
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build, render } from "@microsoft/webui";

const __dirname = dirname(fileURLToPath(import.meta.url));

const fixturesDir = resolve(__dirname, "../test/fixtures");

// Fixtures to test — mirrors the list in build-fixtures.js
const fixtures = [
    "attribute",
    "binding",
    "deep-merge",
    "event",
    "ref",
    "slotted",
    "when",
    "repeat",
    "repeat-event",
    "children",
    "host-bindings",
    "lifecycle-callbacks",
    "dot-syntax",
    "nested-elements",
    "performance-metrics",
    "observer-map",
];

/**
 * Extract <f-template name="X"> elements from an HTML string.
 * Returns an array of { name, content } objects where content
 * is the inner HTML of the <template> child. When the <template>
 * element carries host-binding attributes (e.g. @click, ?disabled),
 * those are preserved by wrapping the content in a <template> tag.
 */
function extractFTemplates(html) {
    const results = [];
    const regex =
        /<f-template\s+name="([^"]+)">\s*<template([^>]*)>([\s\S]*?)<\/template>\s*<\/f-template>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        const name = match[1];
        const attrs = match[2].trim();
        const inner = match[3].trim();

        // If the <template> has host-binding attributes, preserve them
        // by wrapping the content in a <template> element.
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
 * Prepare a temporary build directory for a fixture by extracting
 * component templates into individual HTML files and copying the entry.
 */
function prepareFixtureBuildDir(fixtureName, tmpBase) {
    const fixtureDir = join(fixturesDir, fixtureName);
    const buildDir = join(tmpBase, fixtureName);
    const outDir = join(buildDir, "out");

    mkdirSync(buildDir, { recursive: true });
    mkdirSync(outDir, { recursive: true });

    // Read templates.html and extract individual component files
    const templatesPath = join(fixtureDir, "templates.html");
    const templatesHtml = readFileSync(templatesPath, "utf8");
    const templates = extractFTemplates(templatesHtml);

    for (const { name, content } of templates) {
        writeFileSync(join(buildDir, `${name}.html`), content);
    }

    // Copy entry.html, removing script lines (not needed for SSR build).
    // Uses line filtering instead of regex replacement to avoid
    // incomplete multi-character sanitization issues.
    const entryHtml = readFileSync(join(fixtureDir, "entry.html"), "utf8");
    const cleanedEntry = entryHtml
        .split("\n")
        .filter(line => !line.includes("<script"))
        .join("\n");
    writeFileSync(join(buildDir, "entry.html"), cleanedEntry);

    // Read state.json
    const state = JSON.parse(readFileSync(join(fixtureDir, "state.json"), "utf8"));

    return { buildDir, outDir, state, componentCount: templates.length };
}

/**
 * Validate the rendered HTML output for basic structural correctness.
 * Returns an array of error messages (empty if valid).
 */
function validateOutput(html, fixtureName) {
    const errors = [];

    if (!html || html.length === 0) {
        errors.push("Rendered output is empty");
        return errors;
    }

    if (!html.includes("<html")) {
        errors.push("Missing <html> element");
    }

    if (!html.includes("<body")) {
        errors.push("Missing <body> element");
    }

    // Every fixture should produce at least one component with
    // declarative shadow DOM
    if (!html.includes('shadowrootmode="open"')) {
        errors.push("Missing declarative shadow DOM (shadowrootmode)");
    }

    // webui with --plugin=fast should inject <f-template> elements
    // for client-side hydration
    if (!html.includes("<f-template")) {
        errors.push("Missing <f-template> declarations for hydration");
    }

    // Check for webui state injection
    if (!html.includes("__webui_state")) {
        errors.push("Missing __webui_state script injection");
    }

    return errors;
}

async function runFixture(fixtureName, tmpBase) {
    const { buildDir, outDir, state, componentCount } = prepareFixtureBuildDir(
        fixtureName,
        tmpBase,
    );

    // Build with webui
    const buildResult = build({
        appDir: buildDir,
        entry: "entry.html",
        plugin: "fast",
        outDir,
    });

    if (!buildResult.protocol || buildResult.protocol.length === 0) {
        return {
            name: fixtureName,
            pass: false,
            errors: ["Build produced empty protocol"],
        };
    }

    // Render with state
    const html = render(buildResult.protocol, state, {
        plugin: "fast",
        entry: "entry.html",
    });

    // Validate
    const errors = validateOutput(html, fixtureName);

    return {
        name: fixtureName,
        pass: errors.length === 0,
        errors,
        stats: {
            components: componentCount,
            fragments: buildResult.stats.fragmentCount,
            protocolBytes: buildResult.stats.protocolSizeBytes,
            outputChars: html.length,
        },
    };
}

async function main() {
    const tmpBase = join(__dirname, "../.webui-integration-tmp");

    // Clean up any previous run
    if (existsSync(tmpBase)) {
        rmSync(tmpBase, { recursive: true });
    }

    console.log("WebUI Integration Tests for FAST HTML Fixtures");
    console.log("=".repeat(50));
    console.log();

    const results = [];
    let passed = 0;
    let failed = 0;

    for (const fixtureName of fixtures) {
        try {
            const result = await runFixture(fixtureName, tmpBase);
            results.push(result);

            if (result.pass) {
                passed++;
                console.log(
                    `  ✔ ${fixtureName} (${result.stats.components} components, ${result.stats.fragments} fragments)`,
                );
            } else {
                failed++;
                console.log(`  ✘ ${fixtureName}`);
                for (const err of result.errors) {
                    console.log(`    → ${err}`);
                }
            }
        } catch (err) {
            failed++;
            results.push({ name: fixtureName, pass: false, errors: [err.message] });
            console.log(`  ✘ ${fixtureName}`);
            console.log(`    → ${err.message}`);
        }
    }

    // Clean up temp directory
    if (existsSync(tmpBase)) {
        rmSync(tmpBase, { recursive: true });
    }

    console.log();
    console.log("-".repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed, ${results.length} total`);

    if (failed > 0) {
        process.exit(1);
    }
}

main().catch(err => {
    console.error(`Fatal error: ${err.message}`);
    process.exit(1);
});
