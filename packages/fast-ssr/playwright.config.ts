import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./dist/esm",
    testMatch: "**/*.pw.spec.js",
    retries: 3,
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ],
    webServer: {
        command: "npm run test-server",
        port: 8080,
        timeout: 120 * 1000,
        reuseExistingServer: false,
    },
});
