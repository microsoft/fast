import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSliderLabel } from "./slider-label.js";

// TODO: Need to add tests for positioning and slider configuration
test.describe("Slider label", () => {
    test("should NOT set the `aria-disabled` attribute when `disabled` is not defined", async ({
        page,
    }) => {
        const element = page.locator("fast-slider-label");

        const root = page.locator("#root");

        await page.goto(fixtureURL("slider-label--slider-label"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-slider-label></fast-slider-label>
            `;
        });

        await expect(element).not.toHaveAttribute("aria-disabled");
    });

    test("should set the `aria-disabled` attribute when the `disabled` property is true", async ({
        page,
    }) => {
        const element = page.locator("fast-slider-label");

        const root = page.locator("#root");

        await page.goto(fixtureURL("slider-label--slider-label"));

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
