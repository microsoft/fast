import { defineConfig, devices } from "@playwright/test";

process.env.FAST_WEBUI_INTEGRATION = "true";

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
