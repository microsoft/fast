/**
 * Style extraction — converts compiled FAST ElementStyles JS modules
 * into plain CSS files.
 *
 * Usage as a module:
 * ```ts
 * import { generateStylesheets } from "@microsoft/fast-test-harness/build/styles.js";
 *
 * await generateStylesheets({ cwd: process.cwd() });
 * ```
 *
 * Usage as a Lage worker:
 * ```ts
 * import { generateStylesheets } from "@microsoft/fast-test-harness/build/styles.js";
 *
 * export default async function init({ target }) {
 *     await generateStylesheets({ cwd: target.cwd });
 * }
 * ```
 */

import { glob, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { styleText } from "node:util";
import { installDomShim } from "./dom-shim.js";

export interface GenerateStylesheetsOptions {
    /**
     * Root directory of the package. Defaults to `process.cwd()`.
     */
    cwd?: string;

    /**
     * Directory containing compiled JS style modules, relative to `cwd`.
     * @default "dist"
     */
    distDir?: string;

    /**
     * Glob pattern for style modules, relative to `distDir`.
     * @default "** /*.styles.js" (without space)
     */
    pattern?: string;

    /**
     * Output directory for generated CSS files, relative to `cwd`.
     * When set, output files are written here instead of next to the
     * source JS modules.
     * @default distDir
     */
    outDir?: string;

    /**
     * Optional formatter function applied to extracted CSS before writing.
     * Receives the CSS string and output file path, returns formatted CSS.
     *
     * Example with Prettier:
     * ```ts
     * import prettier from "prettier";
     *
     * await generateStylesheets({
     *     format: async (css, filePath) => {
     *         const options = await prettier.resolveConfig(filePath);
     *         return prettier.format(css, { ...options, filepath: filePath });
     *     },
     * });
     * ```
     */
    format?: (css: string, filePath: string) => string | Promise<string>;
}

interface StyleSheet {
    styles: Array<string | StyleSheet>;
    toString?: () => string;
}

function flattenStyles(style: string | StyleSheet): string[] {
    if (typeof style === "string") {
        return [style];
    }
    if (Array.isArray(style.styles)) {
        return style.styles.flatMap(flattenStyles);
    }
    return [style.toString?.() ?? ""];
}

export async function generateStylesheets(
    options: GenerateStylesheetsOptions = {},
): Promise<void> {
    installDomShim();

    const cwd = options.cwd ?? process.cwd();
    const distDir = path.resolve(cwd, options.distDir ?? "dist");
    const outDir = options.outDir ? path.resolve(cwd, options.outDir) : null;
    const pattern = options.pattern ?? "**/*.styles.js";

    for await (const jsFile of glob(pattern, { cwd: distDir })) {
        const jsFilePath = path.resolve(distDir, jsFile);
        const baseName = path.basename(jsFile, ".js") + ".css";
        const cssFilePath = outDir
            ? path.resolve(outDir, baseName)
            : path.resolve(path.dirname(jsFilePath), baseName);

        try {
            const mod = await import(pathToFileURL(jsFilePath).href);
            const stylesheet: StyleSheet | undefined = mod.styles ?? mod.default;

            if (!stylesheet?.styles) {
                continue;
            }

            let css = stylesheet.styles.flatMap(flattenStyles).join("\n");

            if (options.format) {
                try {
                    css = await options.format(css, cssFilePath);
                } catch (formatError: any) {
                    console.warn(
                        styleText(["yellow", "bold"], "⚠"),
                        `Format failed for ${path.relative(cwd, cssFilePath)}:`,
                        formatError.message,
                    );
                }
            }

            await mkdir(path.dirname(cssFilePath), { recursive: true });
            await writeFile(cssFilePath, css, "utf8");

            console.log(
                styleText(["green", "bold"], "✔"),
                "Style:",
                styleText("dim", path.relative(cwd, jsFilePath)),
                "→",
                styleText("bold", path.relative(cwd, cssFilePath)),
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
