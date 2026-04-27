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

const subpathExports = [
    {
        name: "Updates",
        importPath: "@microsoft/fast-element/updates.js",
        export: "Updates",
    },
    {
        name: "Observable",
        importPath: "@microsoft/fast-element/observable.js",
        export: "Observable",
    },
    {
        name: "observable",
        importPath: "@microsoft/fast-element/observable.js",
        export: "observable",
    },
    { name: "attr", importPath: "@microsoft/fast-element/attr.js", export: "attr" },
    {
        name: "children",
        importPath: "@microsoft/fast-element/children.js",
        export: "children",
    },
    {
        name: "ref",
        importPath: "@microsoft/fast-element/ref.js",
        export: "ref",
    },
    {
        name: "slotted",
        importPath: "@microsoft/fast-element/slotted.js",
        export: "slotted",
    },
    {
        name: "volatile",
        importPath: "@microsoft/fast-element/volatile.js",
        export: "volatile",
    },
    {
        name: "when",
        importPath: "@microsoft/fast-element/when.js",
        export: "when",
    },
    { name: "html", importPath: "@microsoft/fast-element/html.js", export: "html" },
    {
        name: "repeat",
        importPath: "@microsoft/fast-element/repeat.js",
        export: "repeat",
    },
    { name: "css", importPath: "@microsoft/fast-element/css.js", export: "css" },
    {
        name: "enableHydration",
        importPath: "@microsoft/fast-element/hydration.js",
        export: "enableHydration",
    },
    {
        name: "declarativeTemplate",
        importPath: "@microsoft/fast-element/declarative.js",
        export: "declarativeTemplate",
    },
    {
        name: "ArrayObserver",
        importPath: "@microsoft/fast-element/array-observer.js",
        export: "ArrayObserver",
    },
    {
        name: "observerMap",
        importPath: "@microsoft/fast-element/observer-map.js",
        export: "observerMap",
    },
    {
        name: "attributeMap",
        importPath: "@microsoft/fast-element/attribute-map.js",
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

    // Measure subpath exports in parallel
    const subpathResults = await Promise.all(
        subpathExports.map(async ({ name, importPath, export: exportName }) => {
            const sizes = await measureExport(exportName, importPath);
            return { name: formatExportLabel(name, importPath), ...sizes };
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
