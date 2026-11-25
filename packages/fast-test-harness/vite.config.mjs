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
    const { components, ...viteOptions } = options;
    if (Object.hasOwn(options, "sources")) {
        throw new Error("Configure components directly instead of sources.");
    }
    if (components !== undefined && !Array.isArray(components)) {
        throw new Error("components must be an array.");
    }
    return mergeConfig(
        config,
        components?.length
            ? mergeConfig(viteOptions, {
                  plugins: [sourceGenerationPlugin(components)],
              })
            : viteOptions,
    );
}

export default config;
