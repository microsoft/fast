import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { build } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");

const exportEntries = [
    {
        name: "FASTElement",
        specifier: "@microsoft/fast-element",
        importName: "FASTElement",
    },
    {
        name: "Updates",
        specifier: "@microsoft/fast-element/updates.js",
        importName: "Updates",
    },
    {
        name: "Observable",
        specifier: "@microsoft/fast-element/observable.js",
        importName: "Observable",
    },
    {
        name: "observable",
        specifier: "@microsoft/fast-element/observable.js",
        importName: "observable",
    },
    { name: "attr", specifier: "@microsoft/fast-element/attr.js", importName: "attr" },
    {
        name: "children",
        specifier: "@microsoft/fast-element/children.js",
        importName: "children",
    },
    { name: "css", specifier: "@microsoft/fast-element/css.js", importName: "css" },
    { name: "ref", specifier: "@microsoft/fast-element/ref.js", importName: "ref" },
    {
        name: "slotted",
        specifier: "@microsoft/fast-element/slotted.js",
        importName: "slotted",
    },
    {
        name: "volatile",
        specifier: "@microsoft/fast-element/observable.js",
        importName: "volatile",
    },
    { name: "when", specifier: "@microsoft/fast-element/when.js", importName: "when" },
    {
        name: "html",
        specifier: "@microsoft/fast-element/template.js",
        importName: "html",
    },
    {
        name: "repeat",
        specifier: "@microsoft/fast-element/repeat.js",
        importName: "repeat",
    },
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

async function measureExport({ importName, specifier }) {
    const contents = `import { ${importName} } from "${specifier}";\nexport { ${importName} };\n`;

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
        exportEntries.map(async entry => {
            const sizes = await measureExport(entry);
            return { name: entry.name, ...sizes };
        }),
    );
    results.push(...exportResults);

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
