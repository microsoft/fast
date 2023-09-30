import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
    coverage: true,
    nodeResolve: true,
    testsFinishTimeout: 200000,
    // in a monorepo you need to set set the root dir to resolve modules
    rootDir: "../../../",
    playwright: true,
    browsers: [
        playwrightLauncher({ product: "chromium" }),
    ],
    files: [
        "dist/esm/**/*.spec.js",
        "!**/node_modules/**"
    ],
};
