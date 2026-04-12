import { defineConfig } from "vite";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5273;

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
    build: {
        outDir: "./dist",
        minify: false,
        sourcemap: true,
    },
    preview: {
        port: PORT,
    },
});
