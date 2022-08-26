import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDisclosure } from "./disclosure.js";

test.describe("Disclosure", () => {
    test("should set the expanded attribute to false when no value is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("disclosure--disclosure"));

        const element = page.locator("fast-disclosure");

        await expect(element).toHaveJSProperty("expanded", false);
    });

    test("should set the expanded attribute to true when set to true", async ({
        page,
    }) => {
        await page.goto(fixtureURL("disclosure--disclosure"));

        const element = page.locator("fast-disclosure");

        await element.evaluate((node: FASTDisclosure) => {
            node.expanded = true;
        });

        await expect(element).toHaveJSProperty("expanded", true);
    });

    test("should set the expanded attribute to false when set to false", async ({
        page,
    }) => {
        await page.goto(fixtureURL("disclosure--disclosure"));

        const element = page.locator("fast-disclosure");

        await element.evaluate((node: FASTDisclosure) => {
            node.expanded = false;
        });

        await expect(element).toHaveJSProperty("expanded", false);
    });

    test("should set summary slot content to the value of the summary attribute", async ({
        page,
    }) => {
        await page.goto(fixtureURL("disclosure--disclosure"));

        const element = page.locator("fast-disclosure");

        const summary =
            "Should set the summary slot content to the value of the summary attribute";

        await element.evaluate((node: FASTDisclosure, summary) => {
            node.summary = summary;
        }, summary);

        const slottedSummary = element.locator(`slot[name="summary"]`);

        await expect(slottedSummary).toHaveText(summary);
    });

    test.describe("User interaction", () => {
        test("should toggle the content using `toggle()`", async ({ page }) => {
            await page.goto(fixtureURL("disclosure--disclosure"));

            const element = page.locator("fast-disclosure");

            await element.evaluate((node: FASTDisclosure) => {
                node.toggle();
            });

            await expect(element).toHaveJSProperty("expanded", true);

            await element.evaluate((node: FASTDisclosure) => {
                node.toggle();
            });

            await expect(element).toHaveJSProperty("expanded", false);
        });

        test("should expand and collapse the content using `show()` and `hide()`", async ({
            page,
        }) => {
            await page.goto(fixtureURL("disclosure--disclosure"));

            const element = page.locator("fast-disclosure");

            await element.evaluate((node: FASTDisclosure) => {
                node.show();
            });

            await expect(element).toHaveJSProperty("expanded", true);

            await element.evaluate((node: FASTDisclosure) => {
                node.hide();
            });

            await expect(element).toHaveJSProperty("expanded", false);
        });
    });

    test.describe("Accessibility", () => {
        test("should set the `aria-controls` attribute on the internal summary element", async ({
            page,
        }) => {
            await page.goto(fixtureURL("disclosure--disclosure"));

            const element = page.locator("fast-disclosure summary");

            await expect(element).toHaveAttribute("aria-controls", "disclosure-content");
        });

        test("should set the `aria-expanded` attribute on the internal summary element", async ({
            page,
        }) => {
            await page.goto(fixtureURL("disclosure--disclosure", { expanded: true }));

            const element = page.locator("fast-disclosure summary");

            await expect(element).toHaveAttribute("aria-expanded", "true");
        });
    });
});
