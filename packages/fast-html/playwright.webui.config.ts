import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./test/fixtures",
    testMatch: "**/*.spec.ts",
    retries: 3,
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npm run test-server:webui",
        port: 5174,
        reuseExistingServer: true,
    },
});
