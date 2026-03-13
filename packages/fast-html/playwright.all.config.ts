import { defineConfig, devices } from "@playwright/test";
import commonConfig from "./playwright.config.js";

export default defineConfig({
    ...commonConfig,
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
    ],
});
