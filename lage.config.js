/** @type {import("lage").ConfigOptions} */
module.exports = {
    pipeline: {
        build: {
            dependsOn: ["^build"],
            outputs: ["dist/**", "wasm/**"],
        },
        "@microsoft/fast-build#build": {
            dependsOn: ["^build"],
            // The source-built addon is host-specific and outside workspace outputs.
            cache: false,
            outputs: ["wasm/**"],
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
    ignore: ["change/**", "*.md", ".github/**"],
};
