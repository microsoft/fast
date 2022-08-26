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
        name = name.trim();

        const [hasAttr, value] = await recieved.evaluate((node, name) => {
            if (!node.hasAttribute(name)) {
                return [false, null];
            }

            return [true, node.getAttribute(name)];
        }, name);

        if (!hasAttr) {
            return {
                message: () => `expected ${name} to exist on ${recieved.toString()}`,
                pass: false,
            };
        }

        if (!this.isNot && value !== "" && value !== name) {
            return {
                message: () =>
                    `expected attribute \`${name}\` to have a value of \`''\` or \`${name}\` on ${recieved}`,
                pass: false,
            };
        }

        return {
            message: () => `expected ${recieved} to have boolean attribute ${name}`,
            pass: true,
        };
    },

    async hasAttribute(recieved: Locator, attribute: string) {
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
