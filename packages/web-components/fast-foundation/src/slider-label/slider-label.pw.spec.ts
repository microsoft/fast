import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSliderLabel } from "./slider-label.js";

// TODO: Need to add tests for positioning and slider configuration
test.describe("Slider label", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-slider-label");

        root = page.locator("#root");

        await page.goto(fixtureURL("slider-label--slider-label"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should NOT set the `aria-disabled` attribute when `disabled` is not defined", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-slider-label></fast-slider-label>
            `;
        });

        await expect(element).not.toHaveAttribute("aria-disabled");
    });

    test("should set the `aria-disabled` attribute when the `disabled` property is true", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-slider-label disabled></fast-slider-label>
            `;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate<void, FASTSliderLabel>(node => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });
});
