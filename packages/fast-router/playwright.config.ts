import { defineConfig, devices } from "@playwright/test";

const port = 5175;

export default defineConfig({
    testDir: ".",
    testMatch: "**/*.pw.spec.ts",
    retries: 3,
    use: { baseURL: `http://localhost:${port}` },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ],
    webServer: {
        command: `npm run test-server -- --port ${port}`,
        port,
        reuseExistingServer: true,
    },
});
