declare module "@microsoft/fast-test-harness/vite.config.mjs" {
    export interface SourceGenerationOptions {
        /** HTML/CSS source directory, relative to the Vite config file. */
        root: string;
        /** Dedicated generated-output directory, relative to the Vite config file. */
        outDir: string;
        /** HTML glob(s) relative to root. Defaults to all HTML files. */
        templates?: string | string[] | false;
        /** CSS glob(s) relative to root. Defaults to all CSS files. */
        stylesheets?: string | string[] | false;
    }

    export type HarnessConfig = import("vite").UserConfig & {
        sourceGeneration?: SourceGenerationOptions | false;
    };

    /** Preserve the harness defaults and optionally enable automatic source generation. */
    export function createHarnessConfig(
        options?: HarnessConfig,
    ): import("vite").UserConfig;

    const config: import("vite").UserConfig;
    export default config;
}
