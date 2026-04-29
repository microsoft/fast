#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";

const subcommands = new Set([
    "serve",
    "generate-templates",
    "generate-stylesheets",
    "generate-webui-templates",
]);
const firstArg = process.argv[2];
const subcommand = subcommands.has(firstArg) ? firstArg : null;
const looksLikeSubcommand = firstArg && !firstArg.startsWith("-");
const args = subcommand ? process.argv.slice(3) : process.argv.slice(2);

function showVersion() {
    const { version } = JSON.parse(
        readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
    );
    console.log(version);
    process.exit(0);
}

function showHelp() {
    console.log(`Usage: fast-test-harness [command] [options]

Commands:
  serve                    Start the test harness dev server (default)
  generate-templates       Generate <f-template> HTML files from compiled templates
  generate-stylesheets     Generate CSS files from compiled ElementStyles
  generate-webui-templates Generate WebUI-compatible DSD templates from compiled templates

Run fast-test-harness <command> --help for command-specific options.

Options:
  -v, --version            Show version number
  -h, --help               Show this help message
`);
    process.exit(0);
}

// ── serve (default) ─────────────────────────────────────────────────────
async function runServe() {
    const { values } = parseArgs({
        args,
        options: {
            port: { type: "string", short: "p" },
            base: { type: "string", short: "b" },
            root: { type: "string", short: "r" },
            config: { type: "string", short: "c" },
            debug: { type: "boolean", short: "d", default: false },
            help: { type: "boolean", short: "h", default: false },
            version: { type: "boolean", short: "v", default: false },
        },
    });

    if (values.version) showVersion();
    if (values.help) {
        console.log(`Usage: fast-test-harness [serve] [options]

Options:
  -p, --port <number>  Server port (env: PORT, default: 3278)
  -b, --base <path>    Base URL path (env: BASE, default: /)
  -r, --root <path>    Vite root directory (default: <cwd>/test)
  -c, --config <path>  Vite config file path (default: Vite auto-discovery)
  -d, --debug          Write SSR fixtures to temp/ for inspection
  -v, --version        Show version number
  -h, --help           Show this help message
`);
        process.exit(0);
    }

    const { startServer } = await import("./server.mjs");
    await startServer(process.cwd(), values.root, values.config, {
        ...(values.port && { port: Number(values.port) }),
        ...(values.base && { base: values.base }),
        ...(values.debug && { debug: true }),
    });
}

// ── generate-templates ──────────────────────────────────────────────────
async function runGenerateTemplates() {
    const { values } = parseArgs({
        args,
        options: {
            cwd: { type: "string" },
            "dist-dir": { type: "string" },
            "out-dir": { type: "string" },
            pattern: { type: "string" },
            "tag-prefix": { type: "string" },
            help: { type: "boolean", short: "h", default: false },
            version: { type: "boolean", short: "v", default: false },
        },
    });

    if (values.version) showVersion();
    if (values.help) {
        console.log(`Usage: fast-test-harness generate-templates [options]

Generate <f-template> HTML files from compiled FAST Element template modules.

Options:
  --cwd <path>             Package root directory (default: cwd)
  --dist-dir <path>        Compiled JS directory, relative to cwd (default: dist)
  --out-dir <path>         Output directory for HTML files (default: same as dist-dir)
  --pattern <glob>         Glob for template modules (default: **/*.template.js)
  --tag-prefix <prefix>    Tag name prefix (default: fast)
  -v, --version            Show version number
  -h, --help               Show this help message
`);
        process.exit(0);
    }

    const { generateFTemplates } = await import("./dist/esm/build/generate-templates.js");
    await generateFTemplates({
        ...(values.cwd && { cwd: values.cwd }),
        ...(values["dist-dir"] && { distDir: values["dist-dir"] }),
        ...(values["out-dir"] && { outDir: values["out-dir"] }),
        ...(values.pattern && { pattern: values.pattern }),
        ...(values["tag-prefix"] && { tagPrefix: values["tag-prefix"] }),
    });
}

// ── generate-stylesheets ────────────────────────────────────────────────
async function runGenerateStylesheets() {
    const { values } = parseArgs({
        args,
        options: {
            cwd: { type: "string" },
            "dist-dir": { type: "string" },
            "out-dir": { type: "string" },
            pattern: { type: "string" },
            help: { type: "boolean", short: "h", default: false },
            version: { type: "boolean", short: "v", default: false },
        },
    });

    if (values.version) showVersion();
    if (values.help) {
        console.log(`Usage: fast-test-harness generate-stylesheets [options]

Generate CSS files from compiled FAST Element style modules.

Options:
  --cwd <path>             Package root directory (default: cwd)
  --dist-dir <path>        Compiled JS directory, relative to cwd (default: dist)
  --out-dir <path>         Output directory for CSS files (default: same as dist-dir)
  --pattern <glob>         Glob for style modules (default: **/*.styles.js)
  -v, --version            Show version number
  -h, --help               Show this help message
`);
        process.exit(0);
    }

    const { generateStylesheets } = await import(
        "./dist/esm/build/generate-stylesheets.js"
    );
    await generateStylesheets({
        ...(values.cwd && { cwd: values.cwd }),
        ...(values["dist-dir"] && { distDir: values["dist-dir"] }),
        ...(values["out-dir"] && { outDir: values["out-dir"] }),
        ...(values.pattern && { pattern: values.pattern }),
    });
}

// ── generate-webui-templates ─────────────────────────────────────────────
async function runGenerateWebuiTemplates() {
    const { values } = parseArgs({
        args,
        options: {
            cwd: { type: "string" },
            "dist-dir": { type: "string" },
            "out-dir": { type: "string" },
            pattern: { type: "string" },
            "tag-prefix": { type: "string" },
            help: { type: "boolean", short: "h", default: false },
            version: { type: "boolean", short: "v", default: false },
        },
    });

    if (values.version) showVersion();
    if (values.help) {
        console.log(`Usage: fast-test-harness generate-webui-templates [options]

Generate WebUI-compatible DSD template files from compiled FAST Element template modules.
Strips client-side bindings and the f-template wrapper, outputs <template shadowrootmode="open">.

Options:
  --cwd <path>             Package root directory (default: cwd)
  --dist-dir <path>        Compiled JS directory, relative to cwd (default: dist)
  --out-dir <path>         Output directory for HTML files (default: same as dist-dir)
  --pattern <glob>         Glob for template modules (default: **/*.template.js)
  --tag-prefix <prefix>    Tag name prefix (default: fast)
  -v, --version            Show version number
  -h, --help               Show this help message
`);
        process.exit(0);
    }

    const { generateWebuiTemplates } = await import(
        "./dist/esm/build/generate-webui-templates.js"
    );
    await generateWebuiTemplates({
        ...(values.cwd && { cwd: values.cwd }),
        ...(values["dist-dir"] && { distDir: values["dist-dir"] }),
        ...(values["out-dir"] && { outDir: values["out-dir"] }),
        ...(values.pattern && { pattern: values.pattern }),
        ...(values["tag-prefix"] && { tagPrefix: values["tag-prefix"] }),
    });
}

// ── dispatch ────────────────────────────────────────────────────────────
// Top-level --version / --help before subcommand dispatch
if (args.includes("--version") && !subcommand) showVersion();
if (args.includes("--help") && !subcommand) showHelp();

if (looksLikeSubcommand && !subcommand) {
    console.error(
        `Unknown command: ${firstArg}\n\nAvailable commands: serve, generate-templates, generate-stylesheets, generate-webui-templates\nRun fast-test-harness --help for usage.\n`,
    );
    process.exit(1);
}

switch (subcommand) {
    case "generate-templates":
        await runGenerateTemplates();
        break;
    case "generate-stylesheets":
        await runGenerateStylesheets();
        break;
    case "generate-webui-templates":
        await runGenerateWebuiTemplates();
        break;
    default:
        await runServe();
        break;
}
