import { defineConfig, mergeConfig } from "vite";
import { sourceGenerationPlugin } from "./source-generation.mjs";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3278;

const config = defineConfig({
    clearScreen: false,
    resolve: {
        conditions: ["test"],
    },
    server: {
        port: PORT,
        strictPort: true,
        debug: true,
    },
    esbuild: {
        tsconfigRaw: {
            compilerOptions: {
                // Needed for FAST's observable system
                useDefineForClassFields: false,
                experimentalDecorators: true,
            },
        },
    },
    build: {
        outDir: "./dist",
        minify: false,
        sourcemap: true,
    },
    optimizeDeps: {
        exclude: ["@microsoft/fast-element"],
    },
    preview: {
        port: PORT,
    },
});

/**
 * Extend the harness defaults, optionally generating TypeScript from HTML and CSS.
 */
export function createHarnessConfig(options = {}) {
    const { sources, ...viteOptions } = options;
    if (sources !== undefined && !Array.isArray(sources)) {
        throw new Error("sources must be an array of srcDir/outDir mappings.");
    }
    return mergeConfig(
        config,
        sources?.length
            ? mergeConfig(viteOptions, {
                  plugins: [sourceGenerationPlugin(sources)],
              })
            : viteOptions,
    );
}

export default config;
