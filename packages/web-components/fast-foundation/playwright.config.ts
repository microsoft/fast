import type { Locator, PlaywrightTestConfig } from "@playwright/test";
import { devices, expect } from "@playwright/test";

const config: PlaywrightTestConfig = {
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                deviceScaleFactor: 1,
                launchOptions: { args: ["--force-device-scale-factor=1"] },
            },
        },
        {
            name: "firefox",
            use: devices["Desktop Firefox"],
        },
        {
            name: "webkit",
            use: devices["Desktop Safari"],
        },
    ],
    reporter: "list",
    testMatch: /.*\.pw\.spec\.ts$/,
    retries: process.env.CI ? 3 : 0,
    fullyParallel: process.env.CI ? false : true,
    timeout: process.env.CI ? 10000 : 30000,
    use: {
        baseURL: "http://localhost:6006/iframe.html",
        viewport: {
            height: 1280,
            width: 720,
        },
    },
    webServer: {
        // double-quotes are required for Windows
        command: `node -e "import('express').then(({ default: e }) => e().use(e.static('./storybook-static')).listen(6006))"`,
        port: 6006,
        reuseExistingServer: process.env.CI ? false : true,
    },
};

export default config;

expect.extend({
    async toHaveBooleanAttribute(recieved: Locator, name: string) {
        const options = {
            comment: "Object.is equality",
            isNot: this.isNot,
            promise: this.promise,
        };

        name = name.trim();

        await (await recieved.elementHandle())?.waitForElementState("stable");

        const [hasAttribute, attributeValue] = await recieved.evaluate((node, name) => {
            return [node.hasAttribute(name), node.getAttribute(name)];
        }, name);

        if (this.isNot) {
            return {
                pass: hasAttribute,
                message: () => `expected ${name} to not be present`,
            };
        }

        return {
            pass: hasAttribute && (attributeValue === "" || attributeValue === name),
            message: () => `${this.utils.matcherHint(
                "toHaveBooleanAttribute",
                undefined,
                undefined,
                options
            )}

expected ${recieved} to have boolean attribute \`${name}\``,
        };
    },
});
