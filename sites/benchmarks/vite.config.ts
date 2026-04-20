import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { render as attrReflectRender } from "./src/scenarios/attr-reflect/hydration/render.ts";
import { render as basicRender } from "./src/scenarios/basic/hydration/render.ts";
import { render as bindEventRender } from "./src/scenarios/bind-event/hydration/render.ts";
import { render as dotSyntaxRender } from "./src/scenarios/dot-syntax/hydration/render.ts";
import { render as refSlottedRender } from "./src/scenarios/ref-slotted/hydration/render.ts";
import { render as repeatRender } from "./src/scenarios/repeat/hydration/render.ts";
import {
    BENCH_TREE_CONFIG,
    buildTree,
    renderTreeToHTMLWith,
} from "./src/scenarios/tree.js";
import { render as whenRender } from "./src/scenarios/when/hydration/render.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const benchmarksDir = resolve(__dirname, "src", "scenarios");
const buildId = process.env.BUILD_ID;
const base = buildId ? `/${buildId}/` : "/";

const scenarioRenders: Record<string, (index: number) => string> = {
    "attr-reflect": attrReflectRender,
    basic: basicRender,
    "bind-event": bindEventRender,
    "dot-syntax": dotSyntaxRender,
    "ref-slotted": refSlottedRender,
    repeat: repeatRender,
    when: whenRender,
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
