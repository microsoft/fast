import type { PlaywrightTestConfig } from "@playwright/test";

const PORT = process.env.PORT ?? 9002;

const config: PlaywrightTestConfig = {
    reporter: "list",
    testMatch: /.*\.spec\.ts$/,
    retries: 3,
    use: {
        baseURL: `http://localhost:${PORT}`,
    },
    webServer: {
        command: `node ./test/server.mjs --port=${PORT}`,
        reuseExistingServer: !process.env.CI,
        url: `http://localhost:${PORT}`,
    },
};

export default config;
