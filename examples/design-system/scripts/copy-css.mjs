import { copyFile, mkdir, readdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = fileURLToPath(new URL("..", import.meta.url));
const sourceDir = join(packageDir, "src");
const distDir = join(packageDir, "dist");

async function collectCssFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async entry => {
            const entryPath = join(directory, entry.name);

            if (entry.isDirectory()) {
                return collectCssFiles(entryPath);
            }

            return entry.isFile() && entry.name.endsWith(".css") ? [entryPath] : [];
        }),
    );

    return files.flat();
}

const cssFiles = await collectCssFiles(sourceDir);

await Promise.all(
    cssFiles.map(async filePath => {
        const relativePath = relative(sourceDir, filePath);
        const outputPath = join(distDir, relativePath);

        await mkdir(dirname(outputPath), { recursive: true });
        await copyFile(filePath, outputPath);
    }),
);
