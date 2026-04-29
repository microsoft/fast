/**
 * WebUI template generation — converts compiled FAST Element ViewTemplate
 * JS modules into declarative shadow DOM `<template>` HTML files suitable
 * for WebUI consumers.
 *
 * Webui templates preserve all bindings from the f-template but use a
 * different wrapper:
 * - `<template shadowrootmode="open">` instead of `<f-template name="...">`
 * - No `{{styles}}` placeholder (styles are linked externally)
 * - Shadow options (e.g. `shadowrootdelegatesfocus`) propagated from the
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
import { closeExpression, openExpression } from "@microsoft/fast-html/syntax.js";
import { installDomShim } from "./dom-shim.js";
import { convertTemplate, type ViewTemplate } from "./generate-templates.js";

const stylesMarker = `${openExpression}styles${closeExpression}`;
const escapedStylesMarker = new RegExp(
    stylesMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "g",
);

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
 * Transform an f-template string into a webui template by replacing the
 * `<f-template>` wrapper with `<template shadowrootmode="open">` and
 * removing the `{{styles}}` placeholder.
 */
function fTemplateToWebui(
    fTemplateHtml: string,
    shadowAttrs: Record<string, string>,
): string {
    // Extract the inner <template>...</template> from within <f-template>.
    const innerMatch = fTemplateHtml.match(
        /<f-template[^>]*>\s*(<template[^>]*>[\s\S]*<\/template>)\s*<\/f-template>/,
    );

    if (!innerMatch) {
        return fTemplateHtml;
    }

    let inner = innerMatch[1];

    // Remove {{styles}} placeholder.
    inner = inner.replace(escapedStylesMarker, "");

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
        const componentDir = path.basename(jsFile, ".template.js");
        const componentName = `${tagPrefix}-${componentDir}`;

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

            const shadowAttrs = await loadShadowAttributes(jsFilePath);
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
