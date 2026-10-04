import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./test",
    testMatch: "**/*.pw.spec.ts",
    retries: process.env.CI ? 3 : 0,
    use: { baseURL: "http://localhost:5175" },
    projects: [
        { name: "chromium", use: devices["Desktop Chrome"] },
        { name: "firefox", use: devices["Desktop Firefox"] },
        { name: "webkit", use: devices["Desktop Safari"] },
    ],
    webServer: {
        command: "npm run test-server",
        port: 5175,
        reuseExistingServer: false,
    },
});
