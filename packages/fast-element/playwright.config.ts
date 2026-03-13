import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: ".",
    testMatch: "**/*.pw.spec.ts",
    retries: 3,
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npm run test-server",
        port: 5173,
        reuseExistingServer: true,
    },
});
