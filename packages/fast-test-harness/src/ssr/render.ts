/**
 * SSR rendering powered by `@microsoft/fast-build`'s WASM renderer.
 *
 * Provides a high-level `createSSRRenderer()` factory that scans for
 * component build artifacts (f-templates, stylesheets) and returns a
 * `render()` function compatible with the test harness server's
 * `entry-server.ts` contract.
 *
 * Supports two layout modes:
 *
 * **Multi-component package** (Fluent-style): one package contains all
 * components in subdirectories.
 * ```ts
 * const { render } = createSSRRenderer({
 *     packageName: "@fluentui/web-components",
 *     tagPrefix: "fluent",
 * });
 * ```
 *
 * **Per-component packages** (MAI-style): each component is a separate
 * npm package with flat exports.
 * ```ts
 * const { render } = createSSRRenderer({
 *     tagPrefix: "mai",
 *     components: [
 *         { name: "button", packageName: "@mai-ui/button" },
 *         { name: "checkbox", packageName: "@mai-ui/checkbox" },
 *     ],
 * });
 * ```
 */

import { globSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export interface ComponentRegistration {
    /**
     * Component name (e.g., "button"). Combined with `tagPrefix` to
     * form the tag name.
     */
    name: string;

    /**
     * The npm package name for this component
     * (e.g., "@mai-ui/button").
     */
    packageName: string;
}

export interface SSRRendererOptions {
    /**
     * Tag name prefix for custom elements (e.g., "fluent", "mai").
     */
    tagPrefix: string;

    /**
     * The npm package name used to resolve component build artifacts
     * when all components live in subdirectories of a single package
     * (Fluent-style). Mutually exclusive with `components`.
     */
    packageName?: string;

    /**
     * Explicit list of per-component packages (MAI-style). Each entry
     * maps a component name to its npm package. Mutually exclusive
     * with `packageName`.
     */
    components?: ComponentRegistration[];

    /**
     * Directory containing compiled build artifacts, relative to the
     * package root. Only used with `packageName`.
     * @default "dist/esm"
     */
    distDir?: string;

    /**
     * URL or package specifier for a global theme stylesheet to include
     * in every SSR fixture page.
     *
     * If the value starts with `/` or `http`, it is used as-is as a URL.
     * Otherwise it is resolved via `require.resolve` and converted to a
     * server-relative path.
     */
    themeStylesheet?: string;
}

export interface RenderResult {
    /** All f-template definitions concatenated, with styles injected. */
    template: string;
    /** The rendered fixture HTML with DSD injected. */
    fixture: string;
    /** Preload link tags (empty string when using fast-build). */
    preloadLinks: string;
}

/**
 * Try to load the `@microsoft/fast-build` WASM module. Returns `null`
 * if the package is not installed.
 */
function loadWasm(): any | null {
    try {
        // The WASM module is CJS and must be loaded synchronously.
        // Use a targeted createRequire anchored to this module so it
        // resolves from the harness's own dependencies.
        return createRequire(import.meta.url)(
            "@microsoft/fast-build/wasm/microsoft_fast_build.js",
        );
    } catch {
        return null;
    }
}

/**
 * Resolve a file from a package export. Returns the absolute path or null.
 */
function resolveSpecifier(specifier: string): string | null {
    try {
        return fileURLToPath(import.meta.resolve(specifier));
    } catch {
        return null;
    }
}

/**
 * Resolve a package root directory from its package.json export.
 */
function resolvePackageRoot(packageName: string): string {
    return dirname(fileURLToPath(import.meta.resolve(`${packageName}/package.json`)));
}

/**
 * Convert an absolute path to a server-relative URL.
 */
function toServerUrl(absolutePath: string, packageRoot: string): string {
    return `/${relative(packageRoot, absolutePath).replace(/\\/g, "/")}`;
}

interface ComponentArtifacts {
    componentName: string;
    fTemplate: string | null;
    stylesUrl: string;
}

/**
 * Load artifacts for a component from a monolithic package
 * (e.g., `@fluentui/web-components/button/template.html`).
 */
function loadMonolithicComponent(
    packageName: string,
    componentDir: string,
    packageRoot: string,
): ComponentArtifacts {
    const fTemplatePath = resolveSpecifier(
        `${packageName}/${componentDir}/template.html`,
    );
    const stylesPath = resolveSpecifier(`${packageName}/${componentDir}/styles.css`);

    return {
        componentName: componentDir,
        fTemplate: fTemplatePath ? readFileSync(fTemplatePath, "utf8") : null,
        stylesUrl: stylesPath ? toServerUrl(stylesPath, packageRoot) : "",
    };
}

/**
 * Load artifacts for a component from a per-component package
 * (e.g., `@mai-ui/button/template.html`).
 */
function loadPerPackageComponent(
    reg: ComponentRegistration,
    serverRoot: string,
): ComponentArtifacts {
    const fTemplatePath = resolveSpecifier(`${reg.packageName}/template.html`);
    const stylesPath = resolveSpecifier(`${reg.packageName}/styles.css`);

    return {
        componentName: reg.name,
        fTemplate: fTemplatePath ? readFileSync(fTemplatePath, "utf8") : null,
        stylesUrl: stylesPath ? toServerUrl(stylesPath, serverRoot) : "",
    };
}

/**
 * Replace the `{{styles}}` placeholder in an f-template with a
 * stylesheet `<link>` tag. Falls back to injecting after the opening
 * `<template>` tag if the placeholder is absent.
 */
function renderTemplate(rawTemplate: string, styles: string): string {
    const template = rawTemplate.replace(
        "{{styles}}",
        `<link rel="stylesheet" href="${styles}">`,
    );

    if (template === rawTemplate && styles) {
        return template.replace(
            /(<template[^>]*>)/i,
            match => `${match}<link rel="stylesheet" href="${styles}">`,
        );
    }

    return template;
}

/**
 * Build the entry HTML that the WASM renderer processes.
 * Constructs either a raw HTML fixture or a single custom element
 * from the query parameters.
 */
function buildEntryHtml(queryObj: Record<string, string>): string {
    if ("html" in queryObj) {
        return String(queryObj.html);
    }

    const tagName = String(queryObj.tagName ?? "");
    if (!tagName) {
        return "";
    }

    let attributes: Record<string, unknown> = {};
    if (queryObj.attributes) {
        try {
            attributes =
                typeof queryObj.attributes === "string"
                    ? JSON.parse(queryObj.attributes)
                    : queryObj.attributes;
        } catch {
            // Ignore invalid JSON.
        }
    }

    const innerHTML = queryObj.innerHTML ? String(queryObj.innerHTML) : "";

    const attrs = Object.entries(attributes)
        .map(([key, value]) =>
            value === true ? key : `${key}="${String(value).replace(/"/g, "")}"`,
        )
        .join(" ");

    return `<${tagName}${attrs ? ` ${attrs}` : ""}>${innerHTML}</${tagName}>`;
}

/**
 * Build the state JSON for the WASM renderer from the query
 * parameters. Includes attribute values and normalised (hyphen-
 * stripped) variants so bindings like `{{arialabel}}` resolve for
 * an `aria-label` HTML attribute.
 */
function buildState(queryObj: Record<string, string>): Record<string, unknown> {
    let attributes: Record<string, unknown> = {};
    if (queryObj.attributes) {
        try {
            attributes =
                typeof queryObj.attributes === "string"
                    ? JSON.parse(queryObj.attributes)
                    : queryObj.attributes;
        } catch {
            // Ignore invalid JSON.
        }
    }

    const state: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(attributes)) {
        state[key] = value;
        const stripped = key.replace(/-/g, "");
        if (stripped !== key) {
            state[stripped] = value;
        }
    }
    return state;
}

/**
 * Create an SSR renderer that uses `@microsoft/fast-build`'s WASM
 * module to render f-templates into declarative shadow DOM on each
 * request, with full expression evaluation and nested component
 * support.
 *
 * Supports two modes:
 * - **`packageName`**: Scans a monolithic package's dist directory for
 *   components in subdirectories (Fluent-style).
 * - **`components`**: Uses an explicit list of per-component packages
 *   with flat exports (MAI-style).
 */
export function createSSRRenderer(options: SSRRendererOptions): {
    render: (queryObj: Record<string, string>) => RenderResult;
} {
    const { tagPrefix } = options;
    const wasm = loadWasm();

    if (!wasm) {
        throw new Error(
            "@microsoft/fast-build is required for SSR rendering. " +
                "Install it as a dependency to enable WASM-based template rendering.",
        );
    }

    // Maps keyed by component name (e.g., "button").
    const fTemplatesByName = new Map<string, string>();
    const styleUrlsByName = new Map<string, string>();

    // Collect component artifacts from either mode.
    const artifacts: ComponentArtifacts[] = [];

    if (options.components) {
        // Per-component packages (MAI-style).
        const serverRoot = process.cwd();
        for (const reg of options.components) {
            artifacts.push(loadPerPackageComponent(reg, serverRoot));
        }
    } else if (options.packageName) {
        // Monolithic package (Fluent-style).
        const packageRoot = resolvePackageRoot(options.packageName);
        const distDir = join(packageRoot, options.distDir ?? "dist/esm");
        const pattern = "**/*.template.html";

        for (const templatePath of globSync(pattern, { cwd: distDir })) {
            if (
                templatePath.includes("template-dsd") ||
                templatePath.includes("template-webui")
            ) {
                continue;
            }
            const componentDir = dirname(templatePath);
            if (componentDir === ".") {
                continue;
            }
            artifacts.push(
                loadMonolithicComponent(options.packageName, componentDir, packageRoot),
            );
        }
    }

    // Populate maps.
    for (const art of artifacts) {
        if (art.fTemplate) {
            fTemplatesByName.set(art.componentName, art.fTemplate);
        }
        styleUrlsByName.set(art.componentName, art.stylesUrl);
    }

    // Inject styles into f-templates, then parse into the WASM
    // templates map (tag-name → inner template content).
    const templatesMap: Record<string, string> = {};
    for (const [name, fTemplate] of fTemplatesByName) {
        const styled = renderTemplate(fTemplate, styleUrlsByName.get(name) ?? "");
        fTemplatesByName.set(name, styled);

        const parsed: Array<{ name: string | null; content: string }> = JSON.parse(
            wasm.parse_f_templates(styled),
        );
        const entry = parsed.find((t: any) => t.name !== null);
        if (entry) {
            templatesMap[`${tagPrefix}-${name}`] = entry.content;
        }
    }
    const templatesJson = JSON.stringify(templatesMap);

    // Concatenate all f-templates (with styles) for client hydration.
    const allFTemplates = [...fTemplatesByName.values()].join("\n");

    // Resolve theme stylesheet if provided.
    let preloadLinks = "";
    if (options.themeStylesheet) {
        preloadLinks = `<link rel="stylesheet" href="${options.themeStylesheet}">`;
    }

    return {
        render(queryObj: Record<string, string> = {}): RenderResult {
            const entryHtml = buildEntryHtml(queryObj);
            const state = buildState(queryObj);

            let fixture = "";
            if (entryHtml) {
                try {
                    const rendered: string = wasm.render_entry_with_templates(
                        `<html><body>${entryHtml}</body></html>`,
                        templatesJson,
                        JSON.stringify(state),
                    );

                    // Extract body content from the rendered document.
                    const bodyMatch = rendered.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                    fixture = bodyMatch?.[1] ?? entryHtml;
                } catch {
                    // Fall back to the raw entry HTML if rendering fails.
                    fixture = entryHtml;
                }
            }

            return { template: allFTemplates, fixture, preloadLinks };
        },
    };
}
