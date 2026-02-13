import { defineConfig, devices } from "@playwright/test";

const useDist = process.env.BENCH_DIST === "true";

export default defineConfig({
    testDir: "src",
    testMatch: "bench.spec.ts",
    retries: 0,
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: useDist
        ? {
              command: "npm start",
              port: 5174,
              reuseExistingServer: true,
          }
        : {
              command: "npm run serve",
              port: 5173,
              reuseExistingServer: true,
          },
});
