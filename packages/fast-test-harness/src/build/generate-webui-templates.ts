/**
 * WebUI template generation — converts compiled FAST Element ViewTemplate
 * JS modules into declarative shadow DOM `<template>` HTML files suitable
 * for WebUI consumers.
 *
 * Webui templates preserve all bindings from the f-template but use a
 * different wrapper:
 * - `<template shadowrootmode="open">` instead of `<f-template name="...">`
 * - No `{{styles}}` placeholder (styles are linked externally)
 * - `<f-when>` / `<f-repeat>` are converted to WebUI `<if>` / `<for>` blocks
 * - Shadow options (e.g. `shadowrootdelegatesfocus`) propagated from the
 *   companion `*.definition-async.js` module
 *
 * Usage as a module:
 * ```ts
 * import { generateWebuiTemplates } from "@microsoft/fast-test-harness/build/generate-webui-templates.js";
 *
 * await generateWebuiTemplates({ cwd: process.cwd(), tagPrefix: "contoso" });
 * ```
 */

import { glob, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { styleText } from "node:util";
import {
    closeExpression,
    openExpression,
} from "@microsoft/fast-element/declarative-utilities.js";
import { installDomShim } from "./dom-shim.js";
import {
    convertTemplate,
    definitionAsyncResolver,
    type ShadowOptionsResolver,
    shadowOptionsToAttributes,
    type ViewTemplate,
} from "./generate-templates.js";

const stylesMarker = `${openExpression}styles${closeExpression}`;
const escapedStylesMarker = new RegExp(
    stylesMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "g",
);

function isTagBoundary(char: string): boolean {
    return char === "" || /[\s>/]/.test(char);
}

function startsWithTag(html: string, index: number, tagName: string): boolean {
    return (
        html.startsWith(`<${tagName}`, index) &&
        isTagBoundary(html[index + tagName.length + 1] ?? "")
    );
}

function findTagEnd(html: string, start: number): number {
    let quote: string | null = null;

    for (let index = start; index < html.length; index++) {
        const char = html[index];
        if (quote) {
            if (char === quote) {
                quote = null;
            }
            continue;
        }

        if (char === '"' || char === "'") {
            quote = char;
            continue;
        }

        if (char === ">") {
            return index;
        }
    }

    return -1;
}

function extractQuotedAttribute(tag: string, name: string): string | null {
    let index = 1;

    while (index < tag.length) {
        while (index < tag.length && /\s/.test(tag[index])) {
            index++;
        }

        if (tag[index] === ">" || tag[index] === "/") {
            break;
        }

        const nameStart = index;
        while (index < tag.length && !/[\s=>/]/.test(tag[index])) {
            index++;
        }
        const attrName = tag.slice(nameStart, index);

        while (index < tag.length && /\s/.test(tag[index])) {
            index++;
        }

        if (tag[index] !== "=") {
            continue;
        }

        index++;
        while (index < tag.length && /\s/.test(tag[index])) {
            index++;
        }

        const quote = tag[index];
        if (quote !== '"' && quote !== "'") {
            continue;
        }

        const valueStart = index + 1;
        const valueEnd = tag.indexOf(quote, valueStart);
        if (valueEnd === -1) {
            return null;
        }

        if (attrName === name) {
            return tag.slice(valueStart, valueEnd);
        }

        index = valueEnd + 1;
    }

    return null;
}

function unwrapDefaultExpression(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed.startsWith(openExpression) || !trimmed.endsWith(closeExpression)) {
        return null;
    }

    return trimmed.slice(openExpression.length, -closeExpression.length).trim();
}

function convertFastDirectivesToWebui(html: string): string {
    let result = "";
    let index = 0;

    while (index < html.length) {
        if (html.startsWith("</f-when>", index)) {
            result += "</if>";
            index += "</f-when>".length;
            continue;
        }

        if (html.startsWith("</f-repeat>", index)) {
            result += "</for>";
            index += "</f-repeat>".length;
            continue;
        }

        if (startsWithTag(html, index, "f-when")) {
            const tagEnd = findTagEnd(html, index);
            if (tagEnd !== -1) {
                const tag = html.slice(index, tagEnd + 1);
                const value = extractQuotedAttribute(tag, "value");
                const expression = value ? unwrapDefaultExpression(value) : null;
                if (expression !== null) {
                    result += `<if condition="${expression}">`;
                    index = tagEnd + 1;
                    continue;
                }
            }
        }

        if (startsWithTag(html, index, "f-repeat")) {
            const tagEnd = findTagEnd(html, index);
            if (tagEnd !== -1) {
                const tag = html.slice(index, tagEnd + 1);
                const value = extractQuotedAttribute(tag, "value");
                const expression = value ? unwrapDefaultExpression(value) : null;
                if (expression !== null) {
                    result += `<for each="${expression}">`;
                    index = tagEnd + 1;
                    continue;
                }
            }
        }

        result += html[index];
        index++;
    }

    return result;
}

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

    /**
     * Resolves shadow DOM options for a given template module path.
     * Returns a `shadowOptions` object (e.g. `{ delegatesFocus: true }`) or
     * `undefined` if the component has no special shadow options.
     *
     * Defaults to {@link definitionAsyncResolver}, which loads a companion
     * `*.definition-async.js` module next to each template. Set to `null`
     * to disable shadow options resolution.
     *
     * @default definitionAsyncResolver
     */
    resolveShadowOptions?: ShadowOptionsResolver | null;
}

/**
 * Transform an f-template string into a webui template by replacing the
 * `<f-template>` wrapper with `<template shadowrootmode="open">` and
 * removing the `{{styles}}` placeholder.
 */
function fTemplateToWebui(
    fTemplateHtml: string,
    shadowAttrs: Record<string, string>,
): string {
    // Extract the inner <template>...</template> from within <f-template>
    // using string operations to avoid polynomial backtracking in regex.
    const fOpenStart = fTemplateHtml.indexOf("<f-template");
    const fCloseTag = "</f-template>";
    const fCloseStart = fTemplateHtml.lastIndexOf(fCloseTag);

    if (fOpenStart === -1 || fCloseStart === -1) {
        return fTemplateHtml;
    }

    const fOpenEnd = fTemplateHtml.indexOf(">", fOpenStart);
    if (fOpenEnd === -1) {
        return fTemplateHtml;
    }

    let inner = fTemplateHtml.slice(fOpenEnd + 1, fCloseStart).trim();

    // Remove {{styles}} placeholder.
    inner = inner.replace(escapedStylesMarker, "");

    // Convert FAST declarative template directives to WebUI template directives.
    inner = convertFastDirectivesToWebui(inner);

    // Replace the opening <template> tag with one that includes shadow attributes.
    const extraAttrs = Object.entries(shadowAttrs)
        .map(([k, v]) => (v ? ` ${k}="${v}"` : ` ${k}`))
        .join("");

    inner = inner.replace(
        /^<template[^>]*>/,
        `<template shadowrootmode="open"${extraAttrs}>`,
    );

    return inner;
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

            const resolver =
                options.resolveShadowOptions === null
                    ? undefined
                    : (options.resolveShadowOptions ?? definitionAsyncResolver);
            const shadowOpts = resolver ? await resolver(jsFilePath) : undefined;
            const shadowAttrs = shadowOptionsToAttributes(shadowOpts);
            let html = fTemplateToWebui(fTemplateHtml, shadowAttrs);

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

            const relativeDir = path.relative(distDir, path.dirname(jsFilePath));
            const webuiPath = outDir
                ? path.resolve(
                      outDir,
                      relativeDir,
                      `${componentBaseName}.template-webui.html`,
                  )
                : path.resolve(
                      path.dirname(jsFilePath),
                      `${componentBaseName}.template-webui.html`,
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
