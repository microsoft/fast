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
        /** Dedicated generated-output directory, relative to the Vite config file. */
        generated: string;
    }

    export type HarnessConfig = import("vite").UserConfig & {
        /** Explicit component inputs. Omit or pass an empty array to disable generation. */
        components?: SourceComponent[];
    };

    /** Preserve the harness defaults and optionally enable automatic source generation. */
    export function createHarnessConfig(
        options?: HarnessConfig,
    ): import("vite").UserConfig;

    const config: import("vite").UserConfig;
    export default config;
}
