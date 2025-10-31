import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: ".",
    testMatch: "**/*.spec.ts",
    retries: 3,
    webServer: {
        command: "npm run test-server",
        port: 5173,
        reuseExistingServer: true,
    },
});
