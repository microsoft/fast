import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "www",
        emptyOutDir: true,
        sourcemap: true,
    },
    server: {
        port: 9000,
        open: !process.env.CI,
    },
});
