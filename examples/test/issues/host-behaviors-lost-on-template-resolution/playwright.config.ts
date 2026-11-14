import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const fixtureRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    testDir: ".",
    testMatch: "*.pw.spec.ts",
    retries: 0,
    workers: 1,
    use: {
        baseURL: "http://127.0.0.1:5199",
    },
    projects: [
        { name: "chromium", use: devices["Desktop Chrome"] },
        { name: "firefox", use: devices["Desktop Firefox"] },
        { name: "webkit", use: devices["Desktop Safari"] },
    ],
    webServer: {
        command: `npx vite "${fixtureRoot}" --host 127.0.0.1 --port 5199 --strictPort`,
        cwd: fixtureRoot,
        url: "http://127.0.0.1:5199",
        reuseExistingServer: false,
    },
});
