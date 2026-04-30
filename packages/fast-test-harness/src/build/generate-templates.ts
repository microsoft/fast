/**
 * F-template generation — converts compiled FAST Element ViewTemplate
 * JS modules into declarative `<f-template>` HTML files.
 *
 * This reverse-engineers FAST Element's internal binding marker format
 * back into human-readable f-template syntax (`f-ref`, `f-slotted`,
 * `@event`, `?bool`, `:prop`, `{{expr}}`).
 *
 * Usage as a module:
 * ```ts
 * import { generateFTemplates } from "@microsoft/fast-test-harness/build/generate-templates.js";
 *
 * await generateFTemplates({ cwd: process.cwd(), tagPrefix: "fluent" });
 * ```
 */

import { glob, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { styleText } from "node:util";
import {
    attributeDirectivePrefix,
    clientSideCloseExpression,
    clientSideOpenExpression,
    closeExpression,
    eventArgAccessor,
    openExpression,
} from "@microsoft/fast-html/syntax.js";
import { installDomShim } from "./dom-shim.js";

const stylesMarker = `${openExpression}styles${closeExpression}`;

function wrapClientExpression(expression: string): string {
    return `${clientSideOpenExpression}${expression}${clientSideCloseExpression}`;
}

function wrapDefaultExpression(expression: string): string {
    return `${openExpression}${expression}${closeExpression}`;
}

function attributeDirective(name: string, value: string): string {
    return `${attributeDirectivePrefix}${name}="${wrapClientExpression(value)}"`;
}

export interface GenerateFTemplatesOptions {
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
     * @default `**​/*.template.js`
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

export interface ViewTemplate {
    html: string | HTMLTemplateElement;
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
 * Extract the `filter elements(...)` suffix for a slotted or children
 * directive.
 */
function extractSlottedFilter(factory: Factory): string {
    const filter = factory.options?.filter;
    if (!filter) {
        return "";
    }

    if (filter.name === "selectElements") {
        return " filter elements()";
    }

    let selector: string | null = null;
    try {
        filter({
            nodeType: 1,
            matches(s: string) {
                selector = s;
                return true;
            },
        });
    } catch {
        // If extraction fails, fall back to no-arg elements().
    }

    if (selector) {
        return ` filter elements(${selector})`;
    }

    return " filter elements()";
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

/**
 * Convert a ViewTemplate's html string and factories into an
 * f-template HTML string.
 */
export function convertTemplate(
    viewTemplate: ViewTemplate,
    componentName: string,
): string | null {
    const { factories } = viewTemplate;
    const html =
        typeof viewTemplate.html === "string"
            ? viewTemplate.html
            : viewTemplate.html.innerHTML;

    const factoryEntries = Object.entries(factories);
    if (factoryEntries.length === 0) {
        // No factories — pure static template.
        const content = html.replace(/<\/?template[^>]*>/g, "").trim();
        return `<f-template name="${componentName}" shadowrootmode="open"><template>${stylesMarker}${content}</template></f-template>\n`;
    }

    // Derive the binding marker prefix from the first factory key.
    // Factory IDs follow the pattern `${marker}-${counter}` (e.g. "fast-a1b2c3-1"),
    // where `marker` is generated once per session in fast-element's markup.ts.
    const prefix = factoryEntries[0][0].replace(/-\d+$/, "");

    const factoryMap = new Map<string, Factory>();
    for (const [id, factory] of factoryEntries) {
        factoryMap.set(id, factory);
    }

    let fContent = html;

    // Attribute-position markers → f-ref / f-slotted / f-children
    const attrBindingRe = new RegExp(
        `${prefix}-\\d+="${prefix}\\{(${prefix}-\\d+)\\}${prefix}"`,
        "g",
    );
    fContent = fContent.replace(attrBindingRe, (match: string, factoryId: string) => {
        const factory = factoryMap.get(factoryId);
        if (!factory) {
            return match;
        }
        if (factory.constructor.name === "RefDirective") {
            const prop =
                typeof factory.options === "string"
                    ? factory.options
                    : factory.options?.property;
            return attributeDirective("ref", prop);
        }
        if (factory.constructor.name === "SlottedDirective") {
            const prop =
                typeof factory.options === "string"
                    ? factory.options
                    : factory.options?.property;
            const filterStr = extractSlottedFilter(factory);
            return attributeDirective("slotted", `${prop}${filterStr}`);
        }
        if (factory.constructor.name === "ChildrenDirective") {
            const prop =
                typeof factory.options === "string"
                    ? factory.options
                    : factory.options?.property;
            const filterStr = extractSlottedFilter(factory);
            return attributeDirective("children", `${prop}${filterStr}`);
        }
        return match;
    });

    // Event bindings → @event="{handler(e)}"
    const eventBindingRe = new RegExp(
        `(@[a-z]+)="${prefix}\\{(${prefix}-\\d+)\\}${prefix}"`,
        "g",
    );
    fContent = fContent.replace(
        eventBindingRe,
        (match: string, aspect: string, factoryId: string) => {
            const factory = factoryMap.get(factoryId);
            if (!factory) {
                return match;
            }
            const evalStr = extractBindingExpression(factory);
            return `${aspect}="${wrapClientExpression(evalStr)}"`;
        },
    );

    // Boolean/property bindings → ?attr="{{expr}}"
    const boolAttrBindingRe = new RegExp(
        `([?:][a-zA-Z-]+)="${prefix}\\{(${prefix}-\\d+)\\}${prefix}"`,
        "g",
    );
    fContent = fContent.replace(
        boolAttrBindingRe,
        (match: string, aspect: string, factoryId: string) => {
            const factory = factoryMap.get(factoryId);
            if (!factory) {
                return match;
            }
            const evalStr = extractBindingExpression(factory);
            return `${aspect}="${wrapDefaultExpression(evalStr)}"`;
        },
    );

    // Attribute-value and content bindings → attr="{{propName}}" or inline HTML
    const valBindingRe = new RegExp(`${prefix}\\{(${prefix}-\\d+)\\}${prefix}`, "g");
    fContent = fContent.replace(valBindingRe, (match: string, factoryId: string) => {
        const factory = factoryMap.get(factoryId);
        if (!factory) {
            return match;
        }

        const inlined = tryInlineStaticTemplate(factory);
        if (inlined !== null) {
            return inlined;
        }

        const evalStr = extractBindingExpression(factory);
        return wrapDefaultExpression(evalStr);
    });

    let fInner = fContent.trim();
    if (!/<template[^>]*>/.test(fInner)) {
        fInner = `<template>${fInner}</template>`;
    }
    // Inject the {{styles}} marker immediately after the opening <template> tag
    // so the test harness can substitute it with a <link rel="stylesheet"> at
    // render time. Harness fallback auto-injects if the marker is missing, but
    // emitting it explicitly keeps generated output consistent with hand-authored
    // f-templates (see MAI core components).
    fInner = fInner.replace(/(<template[^>]*>)/, `$1${stylesMarker}`);
    return `<f-template name="${componentName}" shadowrootmode="open">\n${fInner}\n</f-template>\n`;
}

export async function generateFTemplates(
    options: GenerateFTemplatesOptions = {},
): Promise<void> {
    installDomShim();

    const cwd = options.cwd ?? process.cwd();
    const distDir = path.resolve(cwd, options.distDir ?? "dist");
    const outDir = options.outDir ? path.resolve(cwd, options.outDir) : null;
    const pattern = options.pattern ?? "**/*.template.js";
    const tagPrefix = options.tagPrefix ?? "fast";

    for await (const jsFile of glob(pattern, { cwd: distDir })) {
        const jsFilePath = path.resolve(distDir, jsFile);
        const componentBaseName = path.basename(jsFile, ".template.js");
        const componentName = `${tagPrefix}-${componentBaseName}`;

        try {
            const mod = await import(pathToFileURL(jsFilePath).href);
            const template: ViewTemplate | undefined = mod.template ?? mod.default;

            if (!template?.html) {
                continue;
            }

            const fTemplateHtml = convertTemplate(template, componentName);
            if (!fTemplateHtml) {
                continue;
            }

            let html = fTemplateHtml;

            if (options.format) {
                try {
                    html = await options.format(html, jsFilePath);
                } catch (formatError: any) {
                    console.warn(
                        styleText(["yellow", "bold"], "⚠"),
                        `Format failed for ${componentName}:`,
                        formatError.message,
                    );
                }
            }

            const fTemplatePath = outDir
                ? path.resolve(outDir, `${componentBaseName}.template.html`)
                : path.resolve(
                      path.dirname(jsFilePath),
                      `${componentBaseName}.template.html`,
                  );

            await mkdir(path.dirname(fTemplatePath), { recursive: true });
            await writeFile(fTemplatePath, html, "utf8");

            console.log(
                styleText(["green", "bold"], "✔"),
                "f-template:",
                styleText("dim", path.relative(cwd, jsFilePath)),
                "→",
                styleText("bold", path.relative(cwd, fTemplatePath)),
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
