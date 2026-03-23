import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

function discoverFixtureInputs(): Record<string, string> {
    const inputs: Record<string, string> = {
        index: join(__dirname, "index.html"),
    };

    for (const entry of readdirSync(fixturesDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) {
            continue;
        }

        inputs[entry.name] = join(fixturesDir, entry.name, "index.html");
    }

    return inputs;
}

export default defineConfig({
    plugins: [
        {
            name: "html-toc",
            transformIndexHtml(html) {
                const inputs = discoverFixtureInputs();
                const toc = Object.keys(inputs)
                    .filter(key => key !== "index")
                    .sort()
                    .map(key => `<li><a href="/fixtures/${key}/">${key}</a></li>`)
                    .join("");

                return html.replace("<!--TOC-->", toc);
            },
        },
    ],
    build: {
        rollupOptions: {
            input: discoverFixtureInputs(),
        },
    },
});
