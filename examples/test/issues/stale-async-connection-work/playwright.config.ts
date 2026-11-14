import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const fixtureRoot = dirname(fileURLToPath(import.meta.url));
const url = "http://127.0.0.1:5195";

export default defineConfig({
    testDir: fixtureRoot,
    testMatch: "*.pw.spec.ts",
    outputDir: "./test-results",
    workers: 1,
    retries: 0,
    forbidOnly: true,
    reporter: "list",
    use: { baseURL: url },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ],
    webServer: {
        command: `npx vite "${fixtureRoot}" --host 127.0.0.1 --port 5195 --strictPort`,
        cwd: fixtureRoot,
        url,
        reuseExistingServer: false,
    },
});
