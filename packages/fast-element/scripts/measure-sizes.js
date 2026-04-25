import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { build } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");

const namedExports = [
    "FASTElement",
    "Updates",
    "Observable",
    "observable",
    "attr",
    "children",
    "ref",
    "slotted",
    "volatile",
    "when",
    "html",
    "repeat",
];

const subpathExports = [
    { name: "css", path: "@microsoft/fast-element/styles.js", export: "css" },
    { name: "ElementStyles", path: "@microsoft/fast-element/styles.js", export: "ElementStyles" },
    { name: "enableHydration", path: "@microsoft/fast-element/hydration.js", export: "enableHydration" },
    { name: "ArrayObserver", path: "@microsoft/fast-element/arrays.js", export: "ArrayObserver" },
];

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
}

function measureBuffer(buffer) {
    const gzip = gzipSync(buffer);
    const brotli = brotliCompressSync(buffer);
    return {
        minified: buffer.length,
        gzip: gzip.length,
        brotli: brotli.length,
    };
}

async function measureExport(exportName, importPath = "@microsoft/fast-element") {
    const contents = `import { ${exportName} } from "${importPath}";\nexport { ${exportName} };\n`;

    const result = await build({
        stdin: {
            contents,
            resolveDir: packageRoot,
            loader: "ts",
        },
        bundle: true,
        minify: true,
        format: "esm",
        write: false,
        treeShaking: true,
    });

    const code = Buffer.from(result.outputFiles[0].contents);
    return measureBuffer(code);
}

async function measureCore() {
    const coreBundle = path.resolve(packageRoot, "dist/fast-element.min.js");
    const buffer = readFileSync(coreBundle);
    return measureBuffer(buffer);
}

async function main() {
    const results = [];

    // Measure CDN rollup bundle
    const core = await measureCore();
    results.push({ name: "CDN Rollup Bundle", ...core });

    // Measure each named export in parallel
    const exportResults = await Promise.all(
        namedExports.map(async name => {
            const sizes = await measureExport(name);
            return { name, ...sizes };
        }),
    );
    results.push(...exportResults);

    // Measure subpath exports in parallel
    const subpathResults = await Promise.all(
        subpathExports.map(async ({ name, path: importPath, export: exportName }) => {
            const sizes = await measureExport(exportName, importPath);
            return { name, ...sizes };
        }),
    );
    results.push(...subpathResults);

    // Generate markdown table
    const lines = [
        "# Export Sizes",
        "",
        "Bundle sizes for `@microsoft/fast-element` exports.",
        "",
        "| Export | Minified | Gzip | Brotli |",
        "|--------|----------|------|--------|",
    ];

    for (const { name, minified, gzip, brotli } of results) {
        lines.push(
            `| ${name} | ${formatBytes(minified)} | ${formatBytes(gzip)} | ${formatBytes(brotli)} |`,
        );
    }

    lines.push("");

    const outputPath = path.resolve(packageRoot, "SIZES.md");
    writeFileSync(outputPath, lines.join("\n"));
    console.log(`Bundle sizes written to ${outputPath}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
