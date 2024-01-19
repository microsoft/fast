import { expect, test } from "@playwright/test";
import type { FASTSliderLabel } from "./slider-label.js";

// TODO: Need to add tests for positioning and slider configuration
test.describe("Slider label", () => {
    test("should NOT set the `aria-disabled` attribute when `disabled` is not defined", async ({
        page,
    }) => {
        const element = page.locator("fast-slider-label");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-slider-label></fast-slider-label>
            `;
        });

        await expect(element).not.hasAttribute("aria-disabled");
    });

    test("should set the `aria-disabled` attribute when the `disabled` property is true", async ({
        page,
    }) => {
        const element = page.locator("fast-slider-label");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
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
