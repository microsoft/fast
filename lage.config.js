/** @type {import("lage").ConfigOptions} */
module.exports = {
    pipeline: {
        build: {
            dependsOn: ["^build"],
            outputs: ["dist/**", "wasm/**"],
        },
        "@microsoft/fast-element#build": {
            dependsOn: ["@microsoft/fast-build#build"],
            outputs: ["dist/**"],
        },
        "test:node": {
            dependsOn: ["build"],
            outputs: [],
        },
        "test:playwright": {
            dependsOn: ["build"],
            outputs: [],
        },
        "test:chromium": {
            dependsOn: ["build"],
            outputs: [],
        },
    },
    cacheOptions: {
        outputGlob: ["dist/**", "wasm/**"],
        environmentGlob: ["package.json", "tsconfig.json", "lage.config.js"],
    },
    // Paths that belong to no package. Anything not listed here but outside every
    // workspace makes workspace-tools fall back to "changed everything", so LICENSE
    // is called out explicitly: no build script reads it. Kept in sync with
    // build/scripts/classify-changed-files.mjs, which CI uses to decide whether
    // `lage build --since` would do any work at all.
    ignore: ["change/**", "*.md", ".github/**", "LICENSE"],
};
