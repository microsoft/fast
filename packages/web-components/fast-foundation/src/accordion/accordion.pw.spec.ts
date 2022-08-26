import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import { AccordionExpandMode } from "./accordion.options.js";

test.describe("Accordion", () => {
    test("should set an expand mode of `multi` when passed to the `expand-mode` attribute", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("accordion--accordion", {
                expandmode: AccordionExpandMode.multi,
            })
        );

        const element = page.locator("fast-accordion");

        await expect(element).toHaveAttribute("expand-mode", AccordionExpandMode.multi);
    });

    test("should set an expand mode of `single` when passed to the `expand-mode` attribute", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("accordion--accordion", {
                expandmode: AccordionExpandMode.single,
            })
        );

        const element = page.locator("fast-accordion");

        await expect(element).toHaveAttribute("expand-mode", AccordionExpandMode.single);
    });

    test("should set a default expand mode of `multi` when `expand-mode` attribute is not passed", async ({
        page,
    }) => {
        await page.goto(fixtureURL("accordion--accordion"));

        const element = page.locator("fast-accordion");

        await expect(element).toHaveJSProperty("expandmode", AccordionExpandMode.multi);

        await expect(element).toHaveAttribute("expand-mode", AccordionExpandMode.multi);
    });

    test("should expand/collapse items when clicked in multi mode", async ({ page }) => {
        await page.goto(
            fixtureURL("accordion--accordion", {
                expandmode: "multi",
            })
        );

        const element = page.locator("fast-accordion");

        const items = element.locator("fast-accordion-item");

        await items.nth(0).click();

        await items.nth(1).click();

        await expect(items.nth(0)).toHaveAttribute("expanded", "");

        await expect(items.nth(1)).toHaveAttribute("expanded", "");
    });

    test("should only have one expanded item in single mode", async ({ page }) => {
        await page.goto(
            fixtureURL("accordion--accordion", {
                expandmode: "single",
            })
        );

        const element = page.locator("fast-accordion");

        const items = element.locator("fast-accordion-item");

        const firstItem = items.nth(0);

        const secondItem = items.nth(1);

        await firstItem.locator(`[part="button"]`).click();

        expect(
            await firstItem.evaluate(node => node.hasAttribute("expanded"))
        ).toBeTruthy();

        expect(
            await secondItem.evaluate(node => node.hasAttribute("expanded"))
        ).toBeFalsy();

        const secondItemButton = secondItem.locator(`[part="button"]`);

        await secondItemButton.click();

        await expect(firstItem.locator("[expanded]")).toHaveCount(0);

        await expect(secondItem).toHaveAttribute("expanded", "");
    });

    test("should ignore `change` events from components other than accordion items", async ({
        page,
    }) => {
        await page.goto(fixtureURL("accordion--accordion"));

        const element = page.locator("fast-accordion");

        const item = element.locator("fast-accordion-item").nth(1);

        const button = item.locator(`button[part="button"]`);

        await button.click();

        await expect(item).toHaveAttribute("expanded", "");

        const checkbox = item.locator("fast-checkbox");

        await checkbox.click();

        await expect(item).toHaveAttribute("expanded", "");
    });
});
