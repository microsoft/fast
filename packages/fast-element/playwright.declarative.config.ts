import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./test/declarative/fixtures",
    testMatch: "**/*.spec.ts",
    retries: 3,
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
    ],
    webServer: {
        command: "npm run test-server:declarative",
        port: 5174,
        reuseExistingServer: true,
    },
});
