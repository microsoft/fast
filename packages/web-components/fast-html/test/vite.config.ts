import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: join(__dirname, "index.html"),
                attribute: join(__dirname, "fixtures", "attribute/index.html"),
                binding: join(__dirname, "fixtures", "binding/index.html"),
                children: join(__dirname, "fixtures", "children/index.html"),
                "dot-syntax": join(__dirname, "fixtures", "dot-syntax/index.html"),
                event: join(__dirname, "fixtures", "event/index.html"),
                "lifecycle-callbacks": join(
                    __dirname,
                    "fixtures",
                    "lifecycle-callbacks/index.html"
                ),
                "observer-map": join(__dirname, "fixtures", "observer-map/index.html"),
                ref: join(__dirname, "fixtures", "ref/index.html"),
                repeat: join(__dirname, "fixtures", "repeat/index.html"),
                slotted: join(__dirname, "fixtures", "slotted/index.html"),
                when: join(__dirname, "fixtures", "when/index.html"),
            },
        },
    },
});
