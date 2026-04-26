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
        name: "AttributeConfiguration",
        importPath: "@microsoft/fast-element/attr.js",
        export: "AttributeConfiguration",
    },
    {
        name: "AttributeDefinition",
        importPath: "@microsoft/fast-element/attr.js",
        export: "AttributeDefinition",
    },
    {
        name: "booleanConverter",
        importPath: "@microsoft/fast-element/attr.js",
        export: "booleanConverter",
    },
    {
        name: "nullableBooleanConverter",
        importPath: "@microsoft/fast-element/attr.js",
        export: "nullableBooleanConverter",
    },
    {
        name: "nullableNumberConverter",
        importPath: "@microsoft/fast-element/attr.js",
        export: "nullableNumberConverter",
    },
    {
        name: "Binding",
        importPath: "@microsoft/fast-element/binding.js",
        export: "Binding",
    },
    {
        name: "normalizeBinding",
        importPath: "@microsoft/fast-element/binding.js",
        export: "normalizeBinding",
    },
    {
        name: "oneTime",
        importPath: "@microsoft/fast-element/binding.js",
        export: "oneTime",
    },
    {
        name: "oneWay",
        importPath: "@microsoft/fast-element/binding.js",
        export: "oneWay",
    },
    {
        name: "listener",
        importPath: "@microsoft/fast-element/binding.js",
        export: "listener",
    },
    {
        name: "children",
        importPath: "@microsoft/fast-element/directives/children.js",
        export: "children",
    },
    {
        name: "ChildrenDirective",
        importPath: "@microsoft/fast-element/directives/children.js",
        export: "ChildrenDirective",
    },
    {
        name: "elements",
        importPath: "@microsoft/fast-element/directives/node-observation.js",
        export: "elements",
    },
    {
        name: "NodeObservationDirective",
        importPath: "@microsoft/fast-element/directives/node-observation.js",
        export: "NodeObservationDirective",
    },
    {
        name: "ref",
        importPath: "@microsoft/fast-element/directives/ref.js",
        export: "ref",
    },
    {
        name: "RefDirective",
        importPath: "@microsoft/fast-element/directives/ref.js",
        export: "RefDirective",
    },
    {
        name: "slotted",
        importPath: "@microsoft/fast-element/directives/slotted.js",
        export: "slotted",
    },
    {
        name: "SlottedDirective",
        importPath: "@microsoft/fast-element/directives/slotted.js",
        export: "SlottedDirective",
    },
    {
        name: "volatile",
        importPath: "@microsoft/fast-element/volatile.js",
        export: "volatile",
    },
    {
        name: "when",
        importPath: "@microsoft/fast-element/directives/when.js",
        export: "when",
    },
    { name: "html", importPath: "@microsoft/fast-element/html.js", export: "html" },
    {
        name: "ViewTemplate",
        importPath: "@microsoft/fast-element/html.js",
        export: "ViewTemplate",
    },
    {
        name: "repeat",
        importPath: "@microsoft/fast-element/directives/repeat.js",
        export: "repeat",
    },
    {
        name: "RepeatBehavior",
        importPath: "@microsoft/fast-element/directives/repeat.js",
        export: "RepeatBehavior",
    },
    {
        name: "RepeatDirective",
        importPath: "@microsoft/fast-element/directives/repeat.js",
        export: "RepeatDirective",
    },
    { name: "css", importPath: "@microsoft/fast-element/css.js", export: "css" },
    {
        name: "ArrayObserver",
        importPath: "@microsoft/fast-element/array-observer.js",
        export: "ArrayObserver",
    },
    {
        name: "DOM",
        importPath: "@microsoft/fast-element/dom.js",
        export: "DOM",
    },
    {
        name: "DOMAspect",
        importPath: "@microsoft/fast-element/dom.js",
        export: "DOMAspect",
    },
    {
        name: "enableHydration",
        importPath: "@microsoft/fast-element/hydration.js",
        export: "enableHydration",
    },
    {
        name: "HydrationTracker",
        importPath: "@microsoft/fast-element/hydration.js",
        export: "HydrationTracker",
    },
    {
        name: "isHydratable",
        importPath: "@microsoft/fast-element/hydration.js",
        export: "isHydratable",
    },
    {
        name: "HydrationBindingError",
        importPath: "@microsoft/fast-element/hydration.js",
        export: "HydrationBindingError",
    },
    {
        name: "render",
        importPath: "@microsoft/fast-element/render.js",
        export: "render",
    },
    {
        name: "RenderBehavior",
        importPath: "@microsoft/fast-element/render.js",
        export: "RenderBehavior",
    },
    {
        name: "RenderDirective",
        importPath: "@microsoft/fast-element/render.js",
        export: "RenderDirective",
    },
    {
        name: "Schema",
        importPath: "@microsoft/fast-element/schema.js",
        export: "Schema",
    },
    {
        name: "schemaRegistry",
        importPath: "@microsoft/fast-element/schema.js",
        export: "schemaRegistry",
    },
    {
        name: "Compiler",
        importPath: "@microsoft/fast-element/templating.js",
        export: "Compiler",
    },
    {
        name: "HTMLBindingDirective",
        importPath: "@microsoft/fast-element/templating.js",
        export: "HTMLBindingDirective",
    },
    {
        name: "HTMLDirective",
        importPath: "@microsoft/fast-element/templating.js",
        export: "HTMLDirective",
    },
    {
        name: "htmlDirective",
        importPath: "@microsoft/fast-element/templating.js",
        export: "htmlDirective",
    },
    {
        name: "StatelessAttachedAttributeDirective",
        importPath: "@microsoft/fast-element/templating.js",
        export: "StatelessAttachedAttributeDirective",
    },
    {
        name: "Markup",
        importPath: "@microsoft/fast-element/templating.js",
        export: "Markup",
    },
    {
        name: "Parser",
        importPath: "@microsoft/fast-element/templating.js",
        export: "Parser",
    },
    {
        name: "InlineTemplateDirective",
        importPath: "@microsoft/fast-element/templating.js",
        export: "InlineTemplateDirective",
    },
    {
        name: "HTMLView",
        importPath: "@microsoft/fast-element/templating.js",
        export: "HTMLView",
    },
    {
        name: "declarativeTemplate",
        importPath: "@microsoft/fast-element/declarative.js",
        export: "declarativeTemplate",
    },
    {
        name: "observerMap",
        importPath: "@microsoft/fast-element/extensions/observer-map.js",
        export: "observerMap",
    },
    {
        name: "attributeMap",
        importPath: "@microsoft/fast-element/extensions/attribute-map.js",
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
