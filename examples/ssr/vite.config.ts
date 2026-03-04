import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "www",
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            input: "src/main.ts",
            output: {
                entryFileNames: "bundle.js",
            },
        },
    },
});
