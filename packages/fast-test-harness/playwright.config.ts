import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    retries: 3,
    fullyParallel: true,
    use: {
        contextOptions: {
            reducedMotion: "reduce",
        },
    },
    projects: [
        { name: "chromium", use: devices["Desktop Chrome"] },
        { name: "firefox", use: devices["Desktop Firefox"] },
        {
            name: "webkit",
            use: {
                ...devices["Desktop Safari"],
                deviceScaleFactor: 1,
            },
        },
    ],
    reporter: "list",
    testMatch: "src/**/*.pw.spec.ts",
    webServer: {
        command: "node start.mjs",
        port: 5273,
        reuseExistingServer: true,
        stdout: "pipe",
        stderr: "pipe",
    },
});
