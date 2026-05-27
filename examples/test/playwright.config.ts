import { defineConfig } from "@playwright/test";

const isCI = !!process.env.CI;

/**
 * E2E test configuration for the three example todo apps. Each project sets a
 * unique baseURL and spawns the corresponding dev server. Tests live in
 * `tests/` (matched by the `*.pw.spec.ts` suffix to leave room for future
 * Node test files using the `*.spec.ts` suffix) and resolve the per-project
 * adapter via the fixture in `support/fixtures.ts`.
 *
 * Run serially (`workers: 1`) so the SSR app's shared `state.json` is not
 * contended between parallel workers.
 */
export default defineConfig({
    testDir: "./tests",
    testMatch: /.*\.pw\.spec\.ts$/,
    timeout: 30_000,
    expect: { timeout: 5_000 },
    fullyParallel: false,
    workers: 1,
    forbidOnly: isCI,
    retries: isCI ? 1 : 0,
    reporter: isCI ? [["github"], ["list"]] : "list",
    globalSetup: "./support/global-setup.ts",
    globalTeardown: "./support/global-teardown.ts",
    use: {
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "csr-todo",
            use: { baseURL: "http://localhost:9000" },
        },
        {
            name: "csr-todo-mobx",
            use: { baseURL: "http://localhost:9001" },
        },
        {
            name: "ssr-webui-todo",
            use: { baseURL: "http://localhost:8081" },
        },
    ],
    webServer: [
        {
            command: "npm start -w @microsoft/fast-todo-app-example",
            url: "http://localhost:9000",
            cwd: "../..",
            reuseExistingServer: !isCI,
            timeout: 60_000,
            stdout: "pipe",
            stderr: "pipe",
        },
        {
            command: "npm start -w @microsoft/fast-todo-mobx-app-example",
            url: "http://localhost:9001",
            cwd: "../..",
            reuseExistingServer: !isCI,
            timeout: 60_000,
            stdout: "pipe",
            stderr: "pipe",
        },
        {
            command: "npm run start:e2e -w @microsoft/fast-webui-todo-app-example",
            url: "http://localhost:8081",
            cwd: "../..",
            reuseExistingServer: !isCI,
            timeout: 180_000,
            stdout: "pipe",
            stderr: "pipe",
        },
    ],
});
