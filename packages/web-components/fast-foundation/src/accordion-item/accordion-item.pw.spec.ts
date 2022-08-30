import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTAccordionItem } from "./accordion-item.js";

test.describe("Accordion item", () => {
    test.describe("States, Attributes, and Properties", () => {
        let page: Page;
        let element: Locator;
        let heading: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-accordion-item");

            heading = page.locator(`[role="heading"]`);

            await page.goto(fixtureURL("accordion-item--accordion-item"));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should set a default heading level of 2 when `headinglevel` is not provided", async () => {
            await expect(element).not.hasAttribute("headinglevel");

            await expect(element).toHaveJSProperty("headinglevel", 2);
        });

        test("should set the `aria-level` attribute on the internal heading element equal to the heading level", async () => {
            await expect(heading).toHaveAttribute("aria-level", "2");

            await element.evaluate<void, FASTAccordionItem>(node => {
                node.headinglevel = 3;
            });

            await expect(heading).toHaveAttribute("aria-level", "3");
        });

        test("should NOT have a class of `expanded` when the `expanded` property is false", async () => {
            await element.evaluate<void, FASTAccordionItem>(node => {
                node.expanded = false;
            });

            await expect(element).not.toHaveClass(/expanded/);
        });

        test("should have a class of `expanded` when the `expanded` property is true", async () => {
            await element.evaluate<void, FASTAccordionItem>(node => {
                node.expanded = true;
            });

            await expect(element).toHaveClass(/expanded/);
        });

        test("should set `aria-expanded` property on the internal control equal to the `expanded` property", async () => {
            const button = element.locator("button");

            await element.evaluate<void, FASTAccordionItem>(node => {
                node.expanded = true;
            });

            await expect(button).toHaveAttribute("aria-expanded", "true");

            await element.evaluate<void, FASTAccordionItem>(node => {
                node.expanded = false;
            });

            await expect(button).toHaveAttribute("aria-expanded", "false");
        });

        test("should set internal properties to match the id when provided", async () => {
            await element.evaluate<void, FASTAccordionItem>(node => {
                node.id = "testId";
            });

            const region = element.locator(`[role="region"]`);

            await expect(region).toHaveAttribute("aria-labelledby", "testId");

            const button = element.locator("button");

            await expect(button).toHaveId("testId");
        });
    });
});
