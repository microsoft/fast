import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: ".",
    testMatch: "**/*.pw.spec.ts",
    retries: 3,
    // TODO: uncomment when further testing is added
    // see: https://github.com/microsoft/fast/pull/7276
    // projects: [
    //     {
    //         name: "chromium",
    //         use: { ...devices["Desktop Chrome"] },
    //     },
    //     {
    //         name: "firefox",
    //         use: { ...devices["Desktop Firefox"] },
    //     },
    //     {
    //         name: "webkit",
    //         use: { ...devices["Desktop Safari"] },
    //     },
    // ],
    // webServer: {
    //     command: "npm run test-server",
    //     port: 5173,
    //     reuseExistingServer: true,
    // },
});
