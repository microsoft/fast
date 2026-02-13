import { readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const benchmarksDir = resolve(__dirname, "src");

function getPackageDir(packageName: string): string {
    return dirname(fileURLToPath(import.meta.resolve(`${packageName}/package.json`)));
}

function discoverBenchmarkInputs(): Record<string, string> {
    const inputs: Record<string, string> = {
        main: resolve(benchmarksDir, "index.html"),
    };

    for (const entry of readdirSync(benchmarksDir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            inputs[entry.name] = resolve(benchmarksDir, entry.name, "index.html");
        }
    }

    return inputs;
}

export default defineConfig({
    root: benchmarksDir,
    resolve: {
        alias: {
            "@microsoft/fast-element": resolve(
                getPackageDir("@microsoft/fast-element"),
                "src",
                "index.ts"
            ),
        },
    },
    server: {
        port: 5173,
    },
    plugins: [
        {
            name: "html-transform",
            enforce: "pre",
            transformIndexHtml(html) {
                return html.replace(
                    "<!--TOC-->",
                    Object.keys(discoverBenchmarkInputs())
                        .filter(key => key !== "main")
                        .map(key => `<li><a href="/${key}/">${key}</a></li>`)
                        .join("\n")
                );
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
