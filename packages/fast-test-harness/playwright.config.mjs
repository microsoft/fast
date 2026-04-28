import { defineConfig, devices } from "@playwright/test";

const CI = process.env.CI === "true";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3278;

export default defineConfig({
    retries: CI ? 3 : 1,
    timeout: CI ? 10_000 : 5_000,
    fullyParallel: !CI,
    use: {
        baseURL: `http://localhost:${PORT}`,
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
        command: "fast-test-harness",
        port: PORT,
        env: {
            ...process.env,
            PORT: PORT.toString(),
        },
        reuseExistingServer: true,
    },
});
