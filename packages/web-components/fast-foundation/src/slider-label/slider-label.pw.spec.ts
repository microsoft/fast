import { Orientation } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSliderLabel } from "./slider-label.js";

// TODO: Need to add tests for positioning and slider configuration
test.describe("Slider label", () => {
    test("should NOT set a default `aria-disabled` value when `disabled` is not defined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("slider-label--slider-label"));

        const element = page.locator("fast-slider-label");

        expect(await element.getAttribute("aria-disabled")).toBeNull();
    });

    test("should set the `aria-disabled` attribute when `disabled` value is true", async ({
        page,
    }) => {
        await page.goto(fixtureURL("slider-label--slider-label", { disabled: true }));

        const element = page.locator("fast-slider-label");

        await expect(element).toHaveAttribute("aria-disabled", "true");
    });

    test("should add a class equal to the `sliderOrientation` value", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("slider-label--slider-label", {
                sliderOrientation: Orientation.horizontal,
            })
        );

        const element = page.locator("fast-slider-label");

        await expect(element).toHaveClass(/horizontal/);

        await element.evaluate<void, typeof Orientation, FASTSliderLabel>(
            (node, Orientation) => {
                node.sliderOrientation = Orientation.vertical;
            },
            Orientation
        );

        await expect(element).toHaveClass(/vertical/);
    });

    test("should add an element with a class of `mark` by default", async ({ page }) => {
        await page.goto(fixtureURL("slider-label--slider-label"));

        const element = page.locator("fast-slider-label");

        const mark = element.locator(".mark");

        await expect(mark).toHaveCount(1);
    });

    test("should NOT add an element with a class of `mark` when `hideMark` is true", async ({
        page,
    }) => {
        await page.goto(fixtureURL("slider-label--slider-label", { hideMark: true }));

        const element = page.locator("fast-slider-label");

        const mark = element.locator(".mark");

        await expect(mark).toHaveCount(0);
    });
});
