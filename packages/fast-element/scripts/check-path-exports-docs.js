import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(packageRoot, "..", "..");
const packageJsonPath = join(packageRoot, "package.json");
const docsPath = join(
    repoRoot,
    "sites",
    "website",
    "src",
    "docs",
    "3.x",
    "advanced",
    "path-exports.md",
);

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const packageName = packageJson.name;

const exportDescriptions = {
    ".": "Root implementation export for FAST Element APIs.",
    "./arrays.js":
        "ArrayObserver class for observing array mutations, and array observation APIs.",
    "./attr.js": "Attribute decorator and attribute definition APIs.",
    "./attribute-map.js": "Schema-driven attribute map extension.",
    "./binding.js": "Binding directives and binding helpers.",
    "./children.js": "children directive.",
    "./context.js": "Path-only context protocol APIs.",
    "./css.js": "CSS template tag APIs.",
    "./debug.js": "Debug message helpers.",
    "./declarative-utilities.js": "Declarative parser and observer-map utilities.",
    "./declarative.js": "Path-only declarative template APIs.",
    "./di.js": "Path-only dependency injection APIs.",
    "./dom-policy.js": "Trusted Types DOM policy helpers.",
    "./dom.js": "DOM abstraction and DOM aspect APIs.",
    "./fast-element.js": "FASTElement and the customElement decorator.",
    "./html.js": "HTML template tag APIs.",
    "./hydration.js": "Path-only opt-in hydration APIs.",
    "./notifier.js": "Notifier APIs.",
    "./observable.js": "Observable decorator and Observable APIs.",
    "./observer-map.js": "Schema-driven observer map extension.",
    "./package.json": "Package metadata.",
    "./ref.js": "ref directive.",
    "./registry.js": "FASTElement definition and registry APIs.",
    "./render.js": "Render directive APIs.",
    "./repeat.js": "repeat directive.",
    "./schema.js": "Schema and schema registry APIs.",
    "./signal.js": "Signal binding helper.",
    "./slotted.js": "slotted directive.",
    "./state.js": "State and watch helpers.",
    "./two-way.js": "Two-way binding helper.",
    "./updates.js": "DOM update queue APIs.",
    "./utilities.js": "DOM utility helpers.",
    "./volatile.js": "Volatile observable decorator.",
    "./when.js": "when directive.",
};

function normalizeExportTarget(value) {
    return value.replaceAll("\\", "/");
}

function toImportPath(exportPath) {
    return exportPath === "." ? packageName : `${packageName}/${exportPath.slice(2)}`;
}

function getRuntimeTarget(target) {
    return typeof target === "string" ? target : target.default;
}

function getTypesTarget(target) {
    return typeof target === "string" ? undefined : target.types;
}

function getExportEntries() {
    return Object.entries(packageJson.exports);
}

function validateDescriptions(entries) {
    const exportPaths = new Set(entries.map(([exportPath]) => exportPath));
    const missingDescriptions = entries
        .map(([exportPath]) => exportPath)
        .filter(exportPath => exportDescriptions[exportPath] === undefined);
    const staleDescriptions = Object.keys(exportDescriptions).filter(
        exportPath => !exportPaths.has(exportPath),
    );

    if (missingDescriptions.length > 0 || staleDescriptions.length > 0) {
        if (missingDescriptions.length > 0) {
            console.error(
                `Missing path export descriptions: ${missingDescriptions.join(", ")}`,
            );
        }

        if (staleDescriptions.length > 0) {
            console.error(
                `Stale path export descriptions: ${staleDescriptions.join(", ")}`,
            );
        }

        process.exitCode = 1;
        return false;
    }

    return true;
}

function createTable(entries, eol = "\n") {
    const lines = [
        "| Import path | Provides | Runtime target | Types |",
        "|---|---|---|---|",
    ];

    for (const [exportPath, target] of entries) {
        const runtimeTarget = getRuntimeTarget(target);
        const typesTarget = getTypesTarget(target);

        if (runtimeTarget === undefined) {
            console.error(`Missing runtime target for ${exportPath}`);
            process.exitCode = 1;
            continue;
        }

        const typesCell =
            typesTarget === undefined
                ? "n/a"
                : `\`${normalizeExportTarget(typesTarget)}\``;

        lines.push(
            `| \`${toImportPath(exportPath)}\` | ${exportDescriptions[exportPath]} | ` +
                `\`${normalizeExportTarget(runtimeTarget)}\` | ${typesCell} |`,
        );
    }

    return lines.join(eol);
}

function findTableBlock(markdown) {
    const tableStart = markdown.indexOf(
        "| Import path | Provides | Runtime target | Types |",
    );

    if (tableStart === -1) {
        throw new Error(`Could not find the path exports table in ${docsPath}`);
    }

    const match = markdown.slice(tableStart).match(/(\|[^\r\n]*\|(?:\r?\n|$))+/);

    if (match === null) {
        throw new Error(`Could not parse the path exports table in ${docsPath}`);
    }

    return {
        start: tableStart,
        end: tableStart + match[0].length,
        text: match[0].trimEnd(),
    };
}

function updateDocs(markdown, generatedTable, eol) {
    const table = findTableBlock(markdown);

    return `${markdown.slice(0, table.start)}${generatedTable}${eol}${markdown.slice(
        table.end,
    )}`;
}

function main() {
    if (!existsSync(docsPath)) {
        throw new Error(`Missing path exports docs at ${docsPath}`);
    }

    const entries = getExportEntries();

    if (!validateDescriptions(entries)) {
        return;
    }

    const markdown = readFileSync(docsPath, "utf8");
    const eol = markdown.includes("\r\n") ? "\r\n" : "\n";
    const generatedTable = createTable(entries, eol);
    const table = findTableBlock(markdown);
    const currentTable = table.text.replace(/\r\n/g, "\n");
    const normalizedGeneratedTable = generatedTable.replace(/\r\n/g, "\n");
    const shouldWrite = process.argv.includes("--write");

    if (shouldWrite) {
        const updatedMarkdown = updateDocs(markdown, generatedTable, eol);

        if (updatedMarkdown !== markdown) {
            writeFileSync(docsPath, updatedMarkdown);
            console.log(`Updated ${docsPath} with ${entries.length} path exports.`);
        } else {
            console.log(`${docsPath} already documents ${entries.length} path exports.`);
        }

        return;
    }

    if (currentTable !== normalizedGeneratedTable) {
        console.error(
            "Path exports documentation is out of sync. Run " +
                "`npm run doc:path-exports -w @microsoft/fast-element`.",
        );
        process.exitCode = 1;
        return;
    }

    console.log(
        `Path exports documentation matches package.json (${entries.length} exports).`,
    );
}

try {
    main();
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
}
