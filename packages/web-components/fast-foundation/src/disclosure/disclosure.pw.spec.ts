import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDisclosure } from "./disclosure.js";

test.describe("Disclosure", () => {
    test.describe("States, Attributes, and Properties", () => {
        let page: Page;
        let element: Locator;
        let summary: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-disclosure");

            summary = element.locator("summary");

            await page.goto(fixtureURL("disclosure--disclosure"));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should set the `aria-controls` attribute on the internal summary element", async () => {
            await expect(summary).toHaveAttribute("aria-controls", "content");
        });

        test("should toggle the `expanded` attribute based on the value of the `expanded` property", async () => {
            await expect(element).not.toHaveBooleanAttribute("expanded");

            await element.evaluate((node: FASTDisclosure) => {
                node.expanded = true;
            });

            await expect(element).toHaveBooleanAttribute("expanded");

            await element.evaluate((node: FASTDisclosure) => {
                node.expanded = false;
            });

            await expect(element).not.toHaveBooleanAttribute("expanded");
        });

        test("should set summary slot content to the value of the summary attribute", async () => {
            const summaryContent =
                "Should set the summary slot content to the value of the summary attribute";

            await element.evaluate((node: FASTDisclosure, summaryContent) => {
                node.summary = summaryContent;
            }, summaryContent);

            await expect(summary).toHaveText(summaryContent);
        });

        test("should toggle the content when the `toggle()` method is invoked", async () => {
            await element.evaluate((node: FASTDisclosure) => {
                node.toggle();
            });

            await expect(element).toHaveJSProperty("expanded", true);

            await element.evaluate((node: FASTDisclosure) => {
                node.toggle();
            });

            await expect(element).toHaveJSProperty("expanded", false);
        });

        test("should expand and collapse the content when the `show()` and `hide()` methods are invoked", async () => {
            await expect(element).toHaveJSProperty("expanded", false);

            await element.evaluate((node: FASTDisclosure) => {
                node.show();
            });

            await expect(element).toHaveJSProperty("expanded", true);

            await element.evaluate((node: FASTDisclosure) => {
                node.hide();
            });

            await expect(element).toHaveJSProperty("expanded", false);
        });

        test("should set the `aria-expanded` attribute on the internal summary element equal to the `expanded` property", async () => {
            await expect(summary).toHaveAttribute("aria-expanded", "false");

            await element.evaluate((node: FASTDisclosure) => {
                node.expanded = true;
            });

            await expect(summary).toHaveAttribute("aria-expanded", "true");

            await element.evaluate((node: FASTDisclosure) => {
                node.expanded = false;
            });

            await expect(summary).toHaveAttribute("aria-expanded", "false");
        });
    });
});
