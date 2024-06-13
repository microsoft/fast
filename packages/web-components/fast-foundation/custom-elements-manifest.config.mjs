import { jsdocLinkFix } from "./custom-elements-manifest-plugins.mjs";

export default {
    /** Globs to analyze */
    globs: ["src/**/*.ts"],
    /** Globs to exclude */
    exclude: [
        "src/*.ts",
        "src/__test__/*",
        "src/di/*",
        "src/design-token/*",
        "src/**/*.md",
        "src/**/*.spec.ts",
        "src/**/index.ts",
        "src/**/stories/*",
    ],
    /** Directory to output CEM to */
    outdir: "dist",
    /** Run in dev mode, provides extra logging */
    dev: false,
    /** Enable special handling for fast */
    fast: true,
    plugins: [jsdocLinkFix()],
};
