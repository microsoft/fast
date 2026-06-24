import { defineConfig } from "vite";

export default defineConfig({
    clearScreen: false,
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
