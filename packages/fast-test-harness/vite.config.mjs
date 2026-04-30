import { defineConfig } from "vite";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3278;

export default defineConfig({
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
        exclude: ["@microsoft/fast-element", "@microsoft/fast-html"],
    },
    preview: {
        port: PORT,
    },
});
