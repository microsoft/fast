import { Orientation } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSliderLabel } from "./slider-label.js";

// TODO: Need to add tests for positioning and slider configuration
test.describe("Slider label", () => {
    let page: Page;
    let element: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        await page.goto(fixtureURL("slider-label--slider-label"));

        element = page.locator("fast-slider-label");
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should NOT set the `aria-disabled` attribute when `disabled` is not defined", async () => {
        await page.setContent(/* html */ `
            <fast-slider-label></fast-slider-label>
        `);

        await expect(element).not.hasAttribute("aria-disabled");
    });

    test('should add an element with a class of "mark" by default', async () => {
        await page.setContent(/* html */ `
            <fast-slider-label></fast-slider-label>
        `);

        await expect(element.locator(".mark")).toHaveCount(1);
    });

    test("should NOT add an element with a class of `mark` when the `hideMark` property is true", async () => {
        await page.setContent(/* html */ `
            <fast-slider-label hide-mark></fast-slider-label>
        `);

        await expect(element.locator(".mark")).toHaveCount(0);
    });

    test("should add a class equal to the `sliderOrientation` property", async () => {
        await page.setContent(/* html */ `
            <fast-slider-label slider-orientation="${Orientation.horizontal}"></fast-slider-label>
        `);

        await expect(element).toHaveClass(/horizontal/);

        await element.evaluate<void, typeof Orientation, FASTSliderLabel>(
            (node, Orientation) => {
                node.sliderOrientation = Orientation.vertical;
            },
            Orientation
        );

        await expect(element).toHaveClass(/vertical/);
    });

    test("should set the `aria-disabled` attribute when the `disabled` property is true", async () => {
        await page.setContent(/* html */ `
            <fast-slider-label disabled></fast-slider-label>
        `);

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate<void, FASTSliderLabel>(node => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });
});
