import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { build } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const rootImportPath = "@microsoft/fast-element";
const fastElementImportPath = "@microsoft/fast-element/fast-element.js";
const updatesImportPath = "@microsoft/fast-element/updates.js";
const observableImportPath = "@microsoft/fast-element/observable.js";
const attrImportPath = "@microsoft/fast-element/attr.js";
const childrenImportPath = "@microsoft/fast-element/children.js";
const refImportPath = "@microsoft/fast-element/ref.js";
const slottedImportPath = "@microsoft/fast-element/slotted.js";
const volatileImportPath = "@microsoft/fast-element/volatile.js";
const whenImportPath = "@microsoft/fast-element/when.js";
const htmlImportPath = "@microsoft/fast-element/html.js";
const repeatImportPath = "@microsoft/fast-element/repeat.js";
const cssImportPath = "@microsoft/fast-element/css.js";
const declarativeImportPath = "@microsoft/fast-element/declarative.js";
const hydrationImportPath = "@microsoft/fast-element/hydration.js";
const arrayObserverImportPath = "@microsoft/fast-element/array-observer.js";
const observerMapImportPath = "@microsoft/fast-element/observer-map.js";
const attributeMapImportPath = "@microsoft/fast-element/attribute-map.js";

const namedExports = [{ name: "FASTElement", importPath: fastElementImportPath }];

const measuredExports = [
    {
        name: "Updates",
        export: "Updates",
        importPath: updatesImportPath,
    },
    {
        name: "Observable",
        export: "Observable",
        importPath: observableImportPath,
    },
    {
        name: "observable",
        export: "observable",
        importPath: observableImportPath,
    },
    {
        name: "attr",
        export: "attr",
        importPath: attrImportPath,
    },
    {
        name: "children",
        export: "children",
        importPath: childrenImportPath,
    },
    {
        name: "ref",
        export: "ref",
        importPath: refImportPath,
    },
    {
        name: "slotted",
        export: "slotted",
        importPath: slottedImportPath,
    },
    {
        name: "volatile",
        export: "volatile",
        importPath: volatileImportPath,
    },
    {
        name: "when",
        export: "when",
        importPath: whenImportPath,
    },
    {
        name: "html",
        export: "html",
        importPath: htmlImportPath,
    },
    {
        name: "repeat",
        export: "repeat",
        importPath: repeatImportPath,
    },
    {
        name: "css",
        export: "css",
        importPath: cssImportPath,
    },
    {
        name: "enableHydration",
        export: "enableHydration",
        importPath: hydrationImportPath,
    },
    {
        name: "declarativeTemplate",
        export: "declarativeTemplate",
        importPath: declarativeImportPath,
    },
    {
        name: "ArrayObserver",
        export: "ArrayObserver",
        importPath: arrayObserverImportPath,
    },
    {
        name: "observerMap",
        export: "observerMap",
        importPath: observerMapImportPath,
    },
    {
        name: "attributeMap",
        export: "attributeMap",
        importPath: attributeMapImportPath,
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
        namedExports.map(async ({ name, importPath }) => {
            const sizes = await measureExport(name, importPath);
            return { name: formatExportLabel(name, importPath), ...sizes };
        }),
    );
    results.push(...exportResults);

    // Measure each root export in parallel
    const measuredResults = await Promise.all(
        measuredExports.map(
            async ({ name, export: exportName, importPath = rootImportPath }) => {
                const sizes = await measureExport(exportName, importPath);
                return { name: formatExportLabel(name, importPath), ...sizes };
            },
        ),
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
