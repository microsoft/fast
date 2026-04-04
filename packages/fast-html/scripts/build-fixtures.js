#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Builds test fixtures using @microsoft/fast-build. Add fixture names here
// incrementally as each one is verified to work with the fast-build CLI.
const fixtures = ["attribute", "lifecycle-callbacks"];

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const fastBin = require.resolve("@microsoft/fast-build/bin/fast.js");

for (const fixtureName of fixtures) {
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
