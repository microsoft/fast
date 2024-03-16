import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTab } from "./tab.js";

test.describe("Tab", () => {
    test.describe("States, attributes, and properties", () => {
        let page: Page;
        let element: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            await page.goto(fixtureURL("tabs-tab--tab"));

            element = page.locator("fast-tab");
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should have a role of `tab`", async () => {
            await expect(element).toHaveAttribute("role", "tab");
        });

        test("should have a slot attribute of `tab`", async () => {
            await expect(element).toHaveAttribute("slot", "tab");
        });

        test("should set the `aria-disabled` attribute when `disabled` is true", async () => {
            await expect(element).not.toHaveAttribute("aria-disabled");

            await element.evaluate<void, FASTTab>(node => {
                node.disabled = true;
            });

            await expect(element).toHaveAttribute("aria-disabled", "true");

            await element.evaluate<void, FASTTab>(element => {
                element.disabled = false;
            });

            await expect(element).toHaveAttribute("aria-disabled", "false");
        });
    });
});
