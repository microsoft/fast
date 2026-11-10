import path from "node:path";
import { fixtureTextTransform, preparedPlugin } from "./prepared-plugin.mjs";

export const entries = {
    home: "home.html",
    account: "account.html",
};

export const templates = {
    "demo-card": {
        file: "card.html",
        hostAttributes: [{ name: "role", value: "article" }],
        shadowrootAttributes: [{ name: "shadowrootmode", value: "open" }],
    },
    "demo-badge": {
        file: "badge.html",
        hostAttributes: [{ name: "role", value: "status" }],
        shadowrootAttributes: [{ name: "shadowrootmode", value: "closed" }],
    },
};

export function siteConfig(root, options = {}) {
    const plugin = preparedPlugin({ root, entries, templates, ...options });
    return {
        plugin,
        config: {
            root,
            configFile: false,
            logLevel: "silent",
            plugins: [fixtureTextTransform(), plugin],
            // Generation and serving use the same installed compiler/WASM build.
            ssr: { external: ["@microsoft/fast-build/prepared.js"] },
            build: {
                ssr: path.join(root, "server.mjs"),
                outDir: path.join(root, "output"),
                emptyOutDir: false,
                rollupOptions: { output: { entryFileNames: "server.mjs" } },
            },
        },
    };
}
