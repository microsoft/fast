import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defineConfig } from "vite";
import type { ServerModule, ServerState } from "@microsoft/fast-build/server.js";
import {
    BENCH_TREE_CONFIG,
    buildTree,
    renderTreeToHTMLWith,
} from "./src/scenarios/tree.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const benchmarksDir = resolve(__dirname, "src", "scenarios");
const buildId = process.env.BUILD_ID;
const base = buildId ? `/${buildId}/` : "/";

// Load the WASM module for SSR rendering at build time.
const require = createRequire(import.meta.url);
const wasm = require("@microsoft/fast-build/wasm/microsoft_fast_build.js");
const { compileServerModule } = require("@microsoft/fast-build/server.js");
const runtime = pathToFileURL(
    require.resolve("@microsoft/fast-build/server-runtime.mjs"),
).href;

/**
 * Parse `<f-template>` elements from an HTML string using the WASM module.
 */
function parseTemplates(html: string): Record<string, string> {
    const parsed: { name: string | null; content: string }[] = JSON.parse(
        wasm.parse_f_templates(html),
    );
    const map: Record<string, string> = {};
    for (const { name, content } of parsed) {
        if (name) map[name] = content;
    }
    return map;
}

interface ScenarioCache {
    state: ServerState;
    server: ServerModule;
    /** Pre-rendered HTML for scenarios with static state. */
    cachedHtml?: string;
}

const scenarioCaches: Record<string, ScenarioCache> = {};

async function loadScenario(name: string): Promise<ScenarioCache> {
    if (scenarioCaches[name]) return scenarioCaches[name];

    const scenarioDir = resolve(benchmarksDir, name);
    const entry = readFileSync(resolve(scenarioDir, "hydration/entry.html"), "utf8");
    const state = JSON.parse(
        readFileSync(resolve(scenarioDir, "hydration/state.json"), "utf8"),
    );
    const templateHtml = readFileSync(resolve(scenarioDir, "template.html"), "utf8");
    const templates = parseTemplates(templateHtml);

    const source = compileServerModule(entry, templates, runtime);
    const server = await import(
        `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
    );
    const cache: ScenarioCache = { state, server };
    scenarioCaches[name] = cache;
    return cache;
}

await Promise.all(
    [
        "attr-reflect",
        "basic",
        "bind-event",
        "dot-syntax",
        "ref-slotted",
        "repeat",
        "when",
    ].map(loadScenario),
);

function renderCached(name: string): string {
    const cache = scenarioCaches[name];
    if (!cache.cachedHtml) {
        cache.cachedHtml = cache.server.renderEntry(cache.state, {
            attributeNameStrategy: "none",
        });
    }
    return cache.cachedHtml;
}

// Build scenario render functions. Most scenarios use static state and
// cache a single rendered string. attr-reflect varies state per node.
const scenarioRenders: Record<string, (index: number) => string> = {
    "attr-reflect"(index: number): string {
        const cache = scenarioCaches["attr-reflect"];
        const count = `${index + 1}`;
        return cache.server.renderEntry(
            { label: `item-${count}`, count },
            { attributeNameStrategy: "none" },
        );
    },
    basic: () => renderCached("basic"),
    "bind-event": () => renderCached("bind-event"),
    "dot-syntax": () => renderCached("dot-syntax"),
    "ref-slotted": () => renderCached("ref-slotted"),
    repeat: () => renderCached("repeat"),
    when: () => renderCached("when"),
};

function allRender(index: number): string {
    return Object.values(scenarioRenders)
        .map(render => render(index))
        .join("");
}

function discoverBenchmarkInputs(): Record<string, string> {
    const inputs: Record<string, string> = {
        main: resolve(benchmarksDir, "index.html"),
    };

    for (const scenario of readdirSync(benchmarksDir, { withFileTypes: true })) {
        if (!scenario.isDirectory()) {
            continue;
        }

        const scenarioDir = resolve(benchmarksDir, scenario.name);
        const variants = readdirSync(scenarioDir, { withFileTypes: true }).filter(d =>
            d.isDirectory(),
        );

        for (const variant of variants) {
            const key = `${scenario.name}/${variant.name}`;
            inputs[key] = resolve(scenarioDir, variant.name, "index.html");
        }
    }

    return inputs;
}

export default defineConfig({
    root: benchmarksDir,
    base,
    server: {
        hmr: false,
        port: 5173,
    },
    plugins: [
        {
            name: "html-transform",
            enforce: "pre",
            async transformIndexHtml(html, { filename }) {
                if (html.includes("<!-- f-template-all -->")) {
                    const allTemplates: string[] = [];
                    for (const entry of readdirSync(benchmarksDir, {
                        withFileTypes: true,
                    })) {
                        if (!entry.isDirectory() || entry.name === "all") {
                            continue;
                        }
                        const tplPath = resolve(
                            benchmarksDir,
                            entry.name,
                            "template.html",
                        );
                        if (existsSync(tplPath)) {
                            allTemplates.push(readFileSync(tplPath, "utf-8"));
                        }
                    }
                    html = html.replace(
                        "<!-- f-template-all -->",
                        allTemplates.join("\n"),
                    );
                }

                if (html.includes("<!-- f-template -->")) {
                    const templatePath = resolve(
                        dirname(filename),
                        "..",
                        "template.html",
                    );
                    if (existsSync(templatePath)) {
                        const template = readFileSync(templatePath, "utf-8");
                        html = html.replace("<!-- f-template -->", template);
                    }
                }

                if (html.includes("@bench-ssr-render")) {
                    const scenarioName = resolve(dirname(filename), "..")
                        .split("/")
                        .pop()!;
                    const render = scenarioRenders[scenarioName] ?? allRender;

                    html = html.replace(
                        /<!--\s*@bench-ssr-render(?:\s+(\d+))?\s*-->/g,
                        (_match, sizeStr) => {
                            const config = sizeStr
                                ? {
                                      ...BENCH_TREE_CONFIG,
                                      targetSize: parseInt(sizeStr, 10),
                                  }
                                : BENCH_TREE_CONFIG;
                            const tree = buildTree(config);
                            return renderTreeToHTMLWith(tree, render);
                        },
                    );
                }

                // Inject table of contents into the root index page
                html = html.replace(
                    "<!--TOC-->",
                    Object.keys(discoverBenchmarkInputs())
                        .filter(key => key !== "main")
                        .map(key => `<li><a href="${base}${key}/">${key}</a></li>`)
                        .join("\n"),
                );

                return html;
            },
        },
    ],
    build: {
        outDir: resolve(__dirname, "server", "dist", buildId ?? ""),
        emptyOutDir: true,
        rollupOptions: {
            input: discoverBenchmarkInputs(),
        },
    },
});
