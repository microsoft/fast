import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defineConfig } from "vite";
import {
    BENCH_TREE_CONFIG,
    buildTree,
    renderTreeToHTMLWith,
} from "./src/scenarios/tree.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const benchmarksDir = resolve(__dirname, "src", "scenarios");
const buildId = process.env.BUILD_ID;
const base = buildId ? `/${buildId}/` : "/";

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
            d.isDirectory()
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
                // Render-function driven SSR: builds a deterministic
                // tree (~1 000 nodes) and calls the scenario's render()
                // function discovered next to the index.html being processed.
                // <!-- @bench-ssr-render -->
                const renderModulePath = resolve(dirname(filename), "render.ts");

                if (html.includes("<!-- f-template -->")) {
                    const templatePath = resolve(
                        dirname(filename),
                        "..",
                        "template.html"
                    );
                    if (existsSync(templatePath)) {
                        const template = readFileSync(templatePath, "utf-8");
                        html = html.replace("<!-- f-template -->", template);
                    }
                }

                if (html.includes("@bench-ssr-render") && existsSync(renderModulePath)) {
                    const { render } = (await import(
                        pathToFileURL(renderModulePath).href
                    )) as { render: (index: number) => string };

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
                        }
                    );
                }

                // Inject table of contents into the root index page
                html = html.replace(
                    "<!--TOC-->",
                    Object.keys(discoverBenchmarkInputs())
                        .filter(key => key !== "main")
                        .map(key => `<li><a href="${base}${key}/">${key}</a></li>`)
                        .join("\n")
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
