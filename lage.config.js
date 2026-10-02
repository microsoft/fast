/** @type {import("lage").ConfigOptions} */
module.exports = {
    pipeline: {
        build: {
            dependsOn: ["^build"],
            outputs: ["dist/**", "wasm/**"],
        },
        "@microsoft/fast-site#build": {
            dependsOn: ["@microsoft/fast-build#build", "@microsoft/fast-element#build"],
            cache: false,
            outputs: ["build/**"],
        },
        "@microsoft/fast-site-1x#build": {
            dependsOn: [],
            cache: false,
            outputs: ["build/**"],
        },
        "@microsoft/fast-site-2x#build": {
            dependsOn: [],
            cache: false,
            outputs: ["build/**"],
        },
        "@microsoft/fast-site-3x#build": {
            dependsOn: ["@microsoft/fast-element#build"],
            cache: false,
            outputs: ["build/**"],
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
    // Ignore Markdown only at the repository root. Version package Markdown must
    // remain visible to Lage's Micromatch-based affected package detection.
    ignore: ["change/**", "[^/]*.md", ".github/**"],
};
