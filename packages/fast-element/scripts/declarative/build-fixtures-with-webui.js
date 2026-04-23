#!/usr/bin/env node

/**
 * Build FAST HTML fixtures with @microsoft/webui.
 *
 * For each fixture directory this script:
 *   1. Extracts <f-template> components from templates.html into individual
 *      component files (webui uses filename-based component discovery).
 *   2. Builds the fixture with `webui build --plugin=fast`.
 *   3. Renders the compiled protocol with the fixture's state.json.
 *   4. Writes the rendered index.html into temp/integrations/webui/fixtures/
 *      alongside a copy of main.ts and any extra assets so that Playwright
 *      tests can run against the webui-rendered output via Vite.
 */

import {
    copyFileSync,
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build, render } from "@microsoft/webui";
import {
    convertToWebuiSyntax,
    discoverFixtures,
    extractFTemplates,
} from "./build-fixtures.utilities.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(__dirname, "../../test/declarative/fixtures");
const fixtures = discoverFixtures(fixturesDir);
const outBase = resolve(__dirname, "../../temp/integrations/webui/fixtures");

// Files produced by the build or only needed for the build step.
const buildOnlyFiles = new Set([
    "entry.html",
    "fast-build.config.json",
    "templates.html",
    "state.json",
    "index.html",
]);

/**
 * Build a single fixture with webui and write the rendered output plus
 * supporting files into the output directory.
 */
function buildFixture(fixtureName) {
    const fixtureDir = join(fixturesDir, fixtureName);
    const buildDir = join(outBase, ".build", fixtureName);
    const buildOutDir = join(buildDir, "out");
    const fixtureOutDir = join(outBase, fixtureName);

    mkdirSync(buildDir, { recursive: true });
    mkdirSync(buildOutDir, { recursive: true });
    mkdirSync(fixtureOutDir, { recursive: true });

    // Extract individual component HTML files for webui discovery,
    // converting FAST directives to webui syntax.
    const templatesHtml = readFileSync(join(fixtureDir, "templates.html"), "utf8");
    const templates = extractFTemplates(templatesHtml);

    for (const { name, content } of templates) {
        writeFileSync(join(buildDir, `${name}.html`), convertToWebuiSyntax(content));
    }

    // Prepare entry.html without script tags for webui build
    const entryHtml = readFileSync(join(fixtureDir, "entry.html"), "utf8");
    const cleanedEntry = entryHtml
        .split("\n")
        .filter(line => !line.includes("<script"))
        .join("\n");
    writeFileSync(join(buildDir, "entry.html"), cleanedEntry);

    // Build protocol
    const buildResult = build({
        appDir: buildDir,
        entry: "entry.html",
        plugin: "fast",
        outDir: buildOutDir,
    });

    if (!buildResult.protocol || buildResult.protocol.length === 0) {
        throw new Error(`Build produced empty protocol for "${fixtureName}"`);
    }

    // Render with state
    const state = JSON.parse(readFileSync(join(fixtureDir, "state.json"), "utf8"));
    let html = render(buildResult.protocol, state, {
        plugin: "fast",
        entry: "entry.html",
    });

    // Inject <script type="module" src="./main.ts"> before </body>
    html = html.replace(
        "</body>",
        '<script type="module" src="./main.ts"></script>\n</body>',
    );

    writeFileSync(join(fixtureOutDir, "index.html"), html);

    // Copy main.ts and any extra assets (CSS, SVG, etc.) from the
    // original fixture directory so Vite can serve them.
    for (const entry of readdirSync(fixtureDir)) {
        if (buildOnlyFiles.has(entry) || entry.endsWith(".spec.ts")) {
            continue;
        }
        copyFileSync(join(fixtureDir, entry), join(fixtureOutDir, entry));
    }

    process.stdout.write(`Fixture "${fixtureName}" built successfully.\n`);
}

function main() {
    // Clean previous build output
    if (existsSync(outBase)) {
        rmSync(outBase, { recursive: true });
    }

    for (const fixtureName of fixtures) {
        buildFixture(fixtureName);
    }

    // Clean up intermediate build directory
    const buildTmp = join(outBase, ".build");
    if (existsSync(buildTmp)) {
        rmSync(buildTmp, { recursive: true });
    }
}

main();
