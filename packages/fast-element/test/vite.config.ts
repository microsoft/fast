import { defineConfig } from "vite";

export default defineConfig({
    clearScreen: false,
    resolve: {
        conditions: ["test"],
    },
    server: {
        strictPort: true,
    },
    build: {
        outDir: "./dist",
        minify: false,
        sourcemap: true,
    },
    preview: {
        port: 5173,
    },
});
