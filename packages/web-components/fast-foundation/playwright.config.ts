import type { Locator, PlaywrightTestConfig } from "@playwright/test";
import { expect } from "@playwright/test";

const config: PlaywrightTestConfig = {
    projects: [{ name: "chromium" }, { name: "firefox" }, { name: "webkit" }],
    reporter: "list",
    testMatch: /.*\.pw\.spec\.ts$/,
    retries: 3,
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

    async hasAttribute(recieved: Locator, attribute: string) {
        if (await recieved.isVisible()) {
            await (await recieved.elementHandle())?.waitForElementState("stable");
        }

        const pass = await recieved.evaluate(
            (node, attribute) => node.hasAttribute(attribute),
            attribute
        );

        return {
            message: () => `expected ${recieved} to have attribute \`${attribute}\``,
            pass,
        };
    },
});
