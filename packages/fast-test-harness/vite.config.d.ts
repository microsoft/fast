declare module "@microsoft/fast-test-harness/vite.config.mjs" {
    export interface SourceTemplateType {
        /** Element class or dotted type name used for template binding checks. */
        typeSource: string;
        /** Optional module specifier, relative to the generated module or a package. */
        typeSourceImport?: string;
    }

    export interface SourceOptions {
        /** HTML/CSS source directory, relative to the Vite config file. */
        root: string;
        /** Dedicated generated-output directory, relative to the Vite config file. */
        outDir: string;
        /** HTML glob(s) relative to root. Defaults to all HTML files. */
        templates?: string | string[] | false;
        /** CSS glob(s) relative to root. Defaults to all CSS files. */
        stylesheets?: string | string[] | false;
        /** Source types keyed by root-relative HTML paths using forward slashes. */
        templateTypes?: Record<string, SourceTemplateType>;
    }

    export type HarnessConfig = import("vite").UserConfig & {
        /** HTML/CSS source mappings. Omit or pass an empty array to disable generation. */
        sources?: SourceOptions[];
    };

    /** Preserve the harness defaults and optionally enable automatic source generation. */
    export function createHarnessConfig(
        options?: HarnessConfig,
    ): import("vite").UserConfig;

    const config: import("vite").UserConfig;
    export default config;
}
