/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
import path from "path";
import express from "express";
import { expect } from "chai";
const { chromium, firefox, webkit } = require("playwright");

const PLAYWRIGHT_BROWSER = process.env.PLAYWRIGHT_BROWSER || "chromium";
const PORT = process.env.PORT || 7001;

const app = express();
const browser = { chromium, firefox, webkit }[PLAYWRIGHT_BROWSER];
let server;

app.use("/dist", express.static(path.resolve(__dirname, "dist")));
app.use("/*", express.static(path.resolve(__dirname, "fixtures")));

export function mochaGlobalSetup() {
    server = app.listen(PORT, () => {
        console.log(`Test harness server listening on port ${PORT}`);
    });
}

export function mochaGlobalTeardown() {
    server.close(() => {
        console.log(`Test harness server on port ${PORT} closed`);
    });
}

export const mochaHooks = {
    async beforeAll() {
        this.browser = await browser.launch();
        console.log(`Launched ${PLAYWRIGHT_BROWSER} browser`);
    },

    async beforeEach() {
        this.page = await this.browser.newPage();
        // TODO: Add a way for tests to specify the fixture base
        await this.page.goto("http://localhost:7001/index.html");

        expect(await this.page.title()).to.equal("FAST Components Test Harness");
    },

    async afterEach() {
        await this.page.close();
    },

    async afterAll() {
        if (this.browser) {
            await this.browser.close();
        }
    },
};
