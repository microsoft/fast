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
    ignore: ["change/**", "*.md", ".github/**"],
};
