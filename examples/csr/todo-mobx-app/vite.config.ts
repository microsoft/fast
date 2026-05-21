import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "www",
        emptyOutDir: true,
        sourcemap: true,
    },
    server: {
        port: 9001,
        open: !process.env.CI,
    },
});
