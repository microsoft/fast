/* eslint-env node */
import { chromium, firefox, webkit } from "playwright";

const selectedBrowser = process.env.PW_BROWSER || "chromium";
const FixtureURL = process.env.FIXTUREURL;
const fixture = process.env.FIXTURE || "index.html";
const expressPort = process.env.PW_PORT || 7001;

export const mochaHooks = {
    async beforeAll() {
        const browser = { chromium, firefox, webkit }[selectedBrowser];
        this.browser = await browser.launch();
        console.log(`Launched ${selectedBrowser} browser`);
    },

    async beforeEach() {
        this.page = await this.browser.newPage();
        const fixtureUrl = FixtureURL || `http://localhost:${expressPort}/${fixture}`;
        await this.page.goto(fixtureUrl);
    },

    async afterEach() {
        if (this.page) {
            await this.page.close();
        }
    },

    async afterAll() {
        if (this.browser) {
            await this.browser.close();
        }
    },
};
