import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
    reporter: "list",
    testMatch: /.*\.pw\.spec\.ts$/,
    retries: 3,
    fullyParallel: process.env.CI ? false : true,
    timeout: process.env.CI ? 10000 : 30000,
    use: {
        baseURL: "http://localhost:6006/iframe.html",
        deviceScaleFactor: 1,
        launchOptions: { args: ["--force-device-scale-factor=1"] },
        viewport: {
            height: 1280,
            width: 720,
        },
    },
    webServer: {
        // double-quotes are required for Windows
        command: "yarn start",
        port: 6006,
        reuseExistingServer: process.env.CI ? false : true,
    },
};

export default config;
