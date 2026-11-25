declare module "@microsoft/fast-test-harness/vite.config.mjs" {
    export interface SourceComponent {
        /** Custom-element name, also used to name the generated modules. */
        tagName: string;
        /** Exact HTML file path, relative to the Vite config file. */
        template: string;
        /** Optional exact CSS file path, relative to the Vite config file. */
        stylesheet?: string;
        /** Module exporting the element class, relative to the Vite config file. */
        clientModule: string;
        /** Named class export used for template binding checks. */
        className: string;
    }

    export interface SourceOptions {
        /** Dedicated generated-output directory, relative to the Vite config file. */
        outDir: string;
        /** Explicit component inputs. No files are discovered through glob patterns. */
        components: SourceComponent[];
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
