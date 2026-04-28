/**
 * WebUI template generation — converts compiled FAST Element ViewTemplate
 * JS modules into declarative shadow DOM `<template>` HTML files suitable
 * for WebUI consumers.
 *
 * Unlike f-templates, webui templates:
 * - Use a bare `<template shadowrootmode="open">` (no `<f-template>` wrapper)
 * - Remove the `{{styles}}` placeholder (styles are linked externally)
 * - Strip client-side-only bindings (`@event`, `:prop`, `f-ref`, `f-slotted`,
 *   `f-children`) since WebUI doesn't hydrate with FAST HTML
 * - Propagate shadow options (e.g. `shadowrootdelegatesfocus`) from the
 *   companion `*.definition-async.js` module
 *
 * Usage as a module:
 * ```ts
 * import { generateWebuiTemplates } from "@microsoft/fast-test-harness/build/generate-webui-templates.js";
 *
 * await generateWebuiTemplates({ cwd: process.cwd(), tagPrefix: "mai" });
 * ```
 */

import { glob, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { styleText } from "node:util";
import {
    closeExpression,
    eventArgAccessor,
    openExpression,
} from "@microsoft/fast-html/syntax.js";
import { installDomShim } from "./dom-shim.js";

const stylesMarker = `${openExpression}styles${closeExpression}`;

export interface GenerateWebuiTemplatesOptions {
    /**
     * Root directory of the package. Defaults to `process.cwd()`.
     */
    cwd?: string;

    /**
     * Directory containing compiled JS template modules, relative to `cwd`.
     * @default "dist"
     */
    distDir?: string;

    /**
     * Glob pattern for template modules, relative to `distDir`.
     * @default "**\/*.template.js"
     */
    pattern?: string;

    /**
     * Output directory for generated HTML files, relative to `cwd`.
     * When set, output files are written here instead of next to the
     * source JS modules.
     * @default distDir
     */
    outDir?: string;

    /**
     * Tag name prefix for generated component names.
     * Combined with the component directory name: `${tagPrefix}-${componentName}`.
     * @default "fast"
     */
    tagPrefix?: string;

    /**
     * Optional formatter function applied to generated HTML before writing.
     */
    format?: (html: string, filePath: string) => string | Promise<string>;
}

interface ViewTemplate {
    html: string;
    factories: Record<string, Factory>;
}

interface Factory {
    constructor: { name: string };
    options?: any;
    dataBinding?: {
        evaluate: (...args: any[]) => any;
    };
}

/**
 * Extract a readable binding expression from a factory's evaluate function.
 */
function extractBindingExpression(factory: Factory): string {
    if (!factory?.dataBinding?.evaluate) {
        return "";
    }

    const fnStr = factory.dataBinding.evaluate.toString();
    const arrowMatch = fnStr.match(/=>\s*(.+)$/s);
    if (arrowMatch) {
        let expr = arrowMatch[1].trim();
        expr = expr.replace(/\bx\./g, "").replace(/c\.event\b/g, eventArgAccessor);
        return expr;
    }

    return fnStr;
}

/**
 * Check if a factory is a static sub-template interpolation. If so,
 * evaluate it and return the inlined HTML.
 */
function tryInlineStaticTemplate(factory: Factory): string | null {
    if (!factory?.dataBinding?.evaluate) {
        return null;
    }

    const fnStr = factory.dataBinding.evaluate.toString();

    if (/^\(\)\s*=>/.test(fnStr)) {
        try {
            const result = factory.dataBinding.evaluate({}, {});
            if (result && typeof result === "object" && typeof result.html === "string") {
                return result.html;
            }
            if (typeof result === "string") {
                return result;
            }
        } catch {
            // Fall through to normal binding handling.
        }
    }

    return null;
}

/** Client-side binding prefixes that are stripped from webui output. */
const CLIENT_SIDE_PREFIXES = ["@", ":"];
const CLIENT_SIDE_DIRECTIVES = ["f-ref", "f-slotted", "f-children"];

function wrapDefaultExpression(expression: string): string {
    return `${openExpression}${expression}${closeExpression}`;
}

/**
 * Try to load shadow options from a companion `*.definition-async.js`
 * module next to the template module. Returns an object with template
 * attribute strings to add (e.g. `shadowrootdelegatesfocus`).
 */
async function loadShadowAttributes(
    templateJsPath: string,
): Promise<Record<string, string>> {
    const dir = path.dirname(templateJsPath);
    const base = path.basename(templateJsPath, ".template.js");
    const defAsyncPath = path.resolve(dir, `${base}.definition-async.js`);

    const attrs: Record<string, string> = {};

    try {
        const mod = await import(pathToFileURL(defAsyncPath).href);
        const definition = mod.definition ?? mod.default;
        if (definition?.shadowOptions?.delegatesFocus) {
            attrs.shadowrootdelegatesfocus = "";
        }
    } catch {
        // No definition-async module or it failed to load — skip.
    }

    return attrs;
}

/**
 * Convert a ViewTemplate into a webui-compatible `<template>` HTML string.
 *
 * Strips `<f-template>` wrapping, removes `{{styles}}`, and strips
 * client-side-only bindings.
 */
function convertWebuiTemplate(
    viewTemplate: ViewTemplate,
    shadowAttrs: Record<string, string>,
): string | null {
    const { html, factories } = viewTemplate;

    const factoryEntries = Object.entries(factories);

    let content: string;

    if (factoryEntries.length === 0) {
        // No factories — pure static template.
        content = html.replace(/<\/?template[^>]*>/g, "").trim();
    } else {
        // Derive the binding marker prefix from the first factory key.
        const prefix = factoryEntries[0][0].replace(/-\d+$/, "");

        const factoryMap = new Map<string, Factory>();
        for (const [id, factory] of factoryEntries) {
            factoryMap.set(id, factory);
        }

        content = html;

        // Attribute-position markers for directives (f-ref, f-slotted, f-children).
        // These are client-side only — strip them entirely for webui.
        const attrBindingRe = new RegExp(
            `\\s*${prefix}-\\d+="${prefix}\\{(${prefix}-\\d+)\\}${prefix}"`,
            "g",
        );
        content = content.replace(attrBindingRe, (_match: string, factoryId: string) => {
            const factory = factoryMap.get(factoryId);
            if (!factory) {
                return _match;
            }
            const name = factory.constructor.name;
            if (
                name === "RefDirective" ||
                name === "SlottedDirective" ||
                name === "ChildrenDirective"
            ) {
                // Strip entirely — these are client-side directives.
                return "";
            }
            return _match;
        });

        // Event bindings (@click, @input, etc.) — strip for webui.
        const eventBindingRe = new RegExp(
            `\\s*@[a-z]+="${prefix}\\{(${prefix}-\\d+)\\}${prefix}"`,
            "g",
        );
        content = content.replace(eventBindingRe, "");

        // Property bindings (:prop) — strip for webui.
        const propBindingRe = new RegExp(
            `\\s*:[a-zA-Z-]+="${prefix}\\{(${prefix}-\\d+)\\}${prefix}"`,
            "g",
        );
        content = content.replace(propBindingRe, "");

        // Boolean attribute bindings (?attr) — keep as server-evaluated expressions.
        const boolAttrBindingRe = new RegExp(
            `(\\?[a-zA-Z-]+)="${prefix}\\{(${prefix}-\\d+)\\}${prefix}"`,
            "g",
        );
        content = content.replace(
            boolAttrBindingRe,
            (_match: string, aspect: string, factoryId: string) => {
                const factory = factoryMap.get(factoryId);
                if (!factory) {
                    return _match;
                }
                const evalStr = extractBindingExpression(factory);
                return `${aspect}="${wrapDefaultExpression(evalStr)}"`;
            },
        );

        // Attribute-value and content bindings — keep as expressions or inline statics.
        const valBindingRe = new RegExp(`${prefix}\\{(${prefix}-\\d+)\\}${prefix}`, "g");
        content = content.replace(valBindingRe, (_match: string, factoryId: string) => {
            const factory = factoryMap.get(factoryId);
            if (!factory) {
                return _match;
            }

            const inlined = tryInlineStaticTemplate(factory);
            if (inlined !== null) {
                return inlined;
            }

            const evalStr = extractBindingExpression(factory);
            return wrapDefaultExpression(evalStr);
        });

        // Strip the compiled <template> wrapper if present — we'll add our own.
        content = content.replace(/<\/?template[^>]*>/g, "").trim();
    }

    // Build the <template> tag with shadow attributes.
    const extraAttrs = Object.entries(shadowAttrs)
        .map(([k, v]) => (v ? ` ${k}="${v}"` : ` ${k}`))
        .join("");

    return `<template shadowrootmode="open"${extraAttrs}>\n${content}\n</template>\n`;
}

export async function generateWebuiTemplates(
    options: GenerateWebuiTemplatesOptions = {},
): Promise<void> {
    installDomShim();

    const cwd = options.cwd ?? process.cwd();
    const distDir = path.resolve(cwd, options.distDir ?? "dist");
    const outDir = options.outDir ? path.resolve(cwd, options.outDir) : null;
    const pattern = options.pattern ?? "**/*.template.js";
    const tagPrefix = options.tagPrefix ?? "fast";

    for await (const jsFile of glob(pattern, { cwd: distDir })) {
        const jsFilePath = path.resolve(distDir, jsFile);
        const componentDir = path.basename(jsFile, ".template.js");

        try {
            const mod = await import(pathToFileURL(jsFilePath).href);
            const template: ViewTemplate | undefined = mod.template ?? mod.default;

            if (!template?.html) {
                continue;
            }

            const shadowAttrs = await loadShadowAttributes(jsFilePath);
            const webuiHtml = convertWebuiTemplate(template, shadowAttrs);
            if (!webuiHtml) {
                continue;
            }

            // Remove {{styles}} — webui consumers link stylesheets externally.
            let html = webuiHtml.replace(
                new RegExp(stylesMarker.replace(/[{}]/g, "\\$&"), "g"),
                "",
            );

            if (options.format) {
                try {
                    html = await options.format(html, jsFilePath);
                } catch (formatError: any) {
                    console.warn(
                        styleText(["yellow", "bold"], "⚠"),
                        `Format failed for ${tagPrefix}-${componentDir}:`,
                        formatError.message,
                    );
                }
            }

            const webuiPath = outDir
                ? path.resolve(outDir, `${componentDir}.template-webui.html`)
                : path.resolve(
                      path.dirname(jsFilePath),
                      `${componentDir}.template-webui.html`,
                  );

            await mkdir(path.dirname(webuiPath), { recursive: true });
            await writeFile(webuiPath, html, "utf8");

            console.log(
                styleText(["green", "bold"], "✔"),
                "webui:",
                styleText("dim", path.relative(cwd, jsFilePath)),
                "→",
                styleText("bold", path.relative(cwd, webuiPath)),
            );
        } catch (error: any) {
            console.error(
                styleText(["red", "bold"], "✘"),
                `Failed: ${path.relative(cwd, jsFilePath)}`,
                error.message,
            );
        }
    }
}
