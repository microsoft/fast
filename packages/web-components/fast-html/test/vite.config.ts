import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: join(__dirname, "index.html"),
                attribute: join(__dirname, "attribute/index.html"),
                binding: join(__dirname, "binding/index.html"),
                children: join(__dirname, "children/index.html"),
                "dot-syntax": join(__dirname, "dot-syntax/index.html"),
                event: join(__dirname, "event/index.html"),
                "lifecycle-callbacks": join(__dirname, "lifecycle-callbacks/index.html"),
                "observer-map": join(__dirname, "observer-map/index.html"),
                ref: join(__dirname, "ref/index.html"),
                repeat: join(__dirname, "repeat/index.html"),
                slotted: join(__dirname, "slotted/index.html"),
                when: join(__dirname, "when/index.html"),
            },
        },
    },
});
