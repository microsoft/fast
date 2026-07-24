import { defineConfig } from "@playwright/test";
import declarativeConfig from "./playwright.declarative.config.js";

export default defineConfig({
    ...declarativeConfig,
    webServer: {
        command: "npm run dev:declarative",
        port: 5174,
        reuseExistingServer: true,
    },
});
