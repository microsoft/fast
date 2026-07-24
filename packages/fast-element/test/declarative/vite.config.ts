import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, normalizePath, type Plugin } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");
const packageName = "@microsoft/fast-element";
const packageRoot = join(__dirname, "../..");
const distRoot = `${normalizePath(join(packageRoot, "dist/esm"))}/`;
const sourceRoot = `${normalizePath(join(packageRoot, "src"))}/`;

function fastElementSource(): Plugin {
    return {
        name: "fast-element-source",
        enforce: "pre",
        async resolveId(id, importer) {
            if (id !== packageName && !id.startsWith(`${packageName}/`)) {
                return;
            }

            const resolved = await this.resolve(id, importer, { skipSelf: true });
            const resolvedPath = resolved && normalizePath(resolved.id);

            if (!resolvedPath?.startsWith(distRoot) || !resolvedPath.endsWith(".js")) {
                return;
            }

            const sourcePath = resolvedPath.slice(distRoot.length, -".js".length);
            return `${sourceRoot}${sourcePath}.ts`;
        },
    };
}

function discoverFixtureInputs(): Record<string, string> {
    const inputs: Record<string, string> = {
        index: join(__dirname, "index.html"),
    };

    for (const category of readdirSync(fixturesDir, { withFileTypes: true })) {
        if (!category.isDirectory()) {
            continue;
        }

        const categoryDir = join(fixturesDir, category.name);

        for (const fixture of readdirSync(categoryDir, { withFileTypes: true })) {
            if (!fixture.isDirectory()) {
                continue;
            }

            const key = `${category.name}/${fixture.name}`;
            inputs[key] = join(categoryDir, fixture.name, "index.html");
        }
    }

    return inputs;
}

export default defineConfig(({ mode }) => {
    return {
        plugins: [
            ...(mode === "source" ? [fastElementSource()] : []),
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
    };
});
