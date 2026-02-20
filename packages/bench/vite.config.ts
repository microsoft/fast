import { readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const benchmarksDir = resolve(__dirname, "src");

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
    server: {
        port: 5173,
    },
    plugins: [
        {
            name: "html-transform",
            enforce: "pre",
            transformIndexHtml(html) {
                // Transform SSR repeat blocks to fill out n number of items:
                // <!-- @bench-ssr count="N" -->...<!-- @/bench-ssr -->
                html = html.replace(
                    /<!--\s*@bench-ssr\s+count="(\d+)"\s*-->([\s\S]*?)<!--\s*@\/bench-ssr\s*-->/g,
                    (_, count, content) => content.repeat(parseInt(count, 10))
                );

                // Inject table of contents into the root index page
                html = html.replace(
                    "<!--TOC-->",
                    Object.keys(discoverBenchmarkInputs())
                        .filter(key => key !== "main")
                        .map(key => `<li><a href="/${key}/">${key}</a></li>`)
                        .join("\n")
                );

                return html;
            },
        },
    ],
    build: {
        outDir: resolve(__dirname, "server", "dist"),
        emptyOutDir: true,
        rollupOptions: {
            input: discoverBenchmarkInputs(),
        },
    },
});
