import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@playwright/test";

const fixtureRoot = dirname(fileURLToPath(import.meta.url));
const baseURL = "http://127.0.0.1:5193";

export default defineConfig({
    testDir: fixtureRoot,
    testMatch: "**/*.pw.spec.ts",
    workers: 1,
    retries: 0,
    forbidOnly: true,
    reporter: "list",
    use: { baseURL },
    projects: [
        { name: "chromium", use: { browserName: "chromium" } },
        { name: "firefox", use: { browserName: "firefox" } },
        { name: "webkit", use: { browserName: "webkit" } },
    ],
    webServer: {
        command: `npx vite "${fixtureRoot}" --host 127.0.0.1 --port 5193 --strictPort`,
        cwd: fixtureRoot,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 60_000,
    },
});
