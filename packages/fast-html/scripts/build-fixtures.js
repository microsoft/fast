#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Builds test fixtures using @microsoft/fast-build. Add fixture names here
// incrementally as each one is verified to work with the fast-build CLI.
//
// Each entry can be a string (fixture name) or an object with `name` and
// additional CLI `args` to pass through to the fast-build CLI.
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
    { name: "camel-case-attribute", args: ["--attribute-name-strategy=camelCase"] },
];

// Pass-through CLI arguments (forwarded to every fast-build invocation).
const passthroughArgs = process.argv.slice(2);

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const fastBin = require.resolve("@microsoft/fast-build/bin/fast.js");

for (const fixture of fixtures) {
    const fixtureName = typeof fixture === "string" ? fixture : fixture.name;
    const fixtureArgs = typeof fixture === "string" ? [] : fixture.args || [];
    const fixtureDir = resolve(__dirname, "../test/fixtures", fixtureName);
    const templatesFile = join(fixtureDir, "templates.html");
    const entryFile = join(fixtureDir, "entry.html");
    const stateFile = join(fixtureDir, "state.json");
    const outputFile = join(fixtureDir, "index.html");

    // Step 1: render shadow DOM via fast-build CLI
    execFileSync(
        process.execPath,
        [
            fastBin,
            "build",
            `--templates=${templatesFile}`,
            `--entry=${entryFile}`,
            `--state=${stateFile}`,
            `--output=${outputFile}`,
            ...fixtureArgs,
            ...passthroughArgs,
        ],
        { stdio: "inherit" },
    );

    // Step 2: inject <f-template> declarations from templates.html before <script>
    const fTemplates = readFileSync(templatesFile, "utf8").trim();
    const rawHtml = readFileSync(outputFile, "utf8");

    if (!rawHtml.includes('<script type="module"')) {
        throw new Error(
            `Fixture "${fixtureName}": could not find '<script type="module"' in "${outputFile}". Template injection failed.`,
        );
    }

    const html = rawHtml.replace(
        /(\s*)<script type="module"/,
        `\n${fTemplates}\n$1<script type="module"`,
    );

    writeFileSync(outputFile, html);
    process.stdout.write(`Fixture "${fixtureName}" built successfully.\n`);
}
