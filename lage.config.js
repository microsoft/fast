/** @type {import("lage").ConfigOptions} */
module.exports = {
    pipeline: {
        build: {
            dependsOn: ["^build"],
            outputs: ["dist/**", "wasm/**"],
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
        "test:rules": {
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
