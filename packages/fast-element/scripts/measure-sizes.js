import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { build } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const rootImportPath = "@microsoft/fast-element";

const namedExports = ["FASTElement"];

const measuredExports = [
    {
        name: "Updates",
        export: "Updates",
    },
    {
        name: "Observable",
        export: "Observable",
    },
    {
        name: "observable",
        export: "observable",
    },
    { name: "attr", export: "attr" },
    {
        name: "children",
        export: "children",
    },
    {
        name: "ref",
        export: "ref",
    },
    {
        name: "slotted",
        export: "slotted",
    },
    {
        name: "volatile",
        export: "volatile",
    },
    {
        name: "when",
        export: "when",
    },
    { name: "html", export: "html" },
    {
        name: "repeat",
        export: "repeat",
    },
    { name: "css", export: "css" },
    {
        name: "enableHydration",
        export: "enableHydration",
    },
    {
        name: "declarativeTemplate",
        export: "declarativeTemplate",
    },
    {
        name: "ArrayObserver",
        export: "ArrayObserver",
    },
    {
        name: "observerMap",
        export: "observerMap",
    },
    {
        name: "attributeMap",
        export: "attributeMap",
    },
];

function formatExportLabel(name, importPath) {
    return `${name} (${importPath})`;
}

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

async function measureExport(exportName, importPath = rootImportPath) {
    const contents = `import { ${exportName} } from "${importPath}";
export { ${exportName} };
`;

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
            return { name: formatExportLabel(name, rootImportPath), ...sizes };
        }),
    );
    results.push(...exportResults);

    // Measure each root export in parallel
    const measuredResults = await Promise.all(
        measuredExports.map(async ({ name, export: exportName }) => {
            const sizes = await measureExport(exportName);
            return { name: formatExportLabel(name, rootImportPath), ...sizes };
        }),
    );
    results.push(...measuredResults);

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
