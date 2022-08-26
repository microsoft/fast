import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("Progress ring", () => {
    test("should include a role of progressbar", async ({ page }) => {
        await page.goto(fixtureURL("progress-progress-ring--progress-ring"));

        const element = page.locator("fast-progress-ring");

        await expect(element).toHaveAttribute("role", "progressbar");
    });

    test("should set the `aria-valuenow` attribute with the `value` property when provided", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("progress-progress-ring--progress-ring", { value: 50 })
        );

        const element = page.locator("fast-progress-ring");

        await expect(element).toHaveAttribute("aria-valuenow", "50");
    });

    test("should set the `aria-valuemin` attribute with the `min` property when provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("progress-progress-ring--progress-ring", { min: 0 }));

        const element = page.locator("fast-progress-ring");

        await expect(element).toHaveAttribute("aria-valuemin", "0");
    });

    test("should set the `aria-valuemax` attribute with the `max` property when provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("progress-progress-ring--progress-ring", { max: 75 }));

        const element = page.locator("fast-progress-ring");

        await expect(element).toHaveAttribute("aria-valuemax", "75");
    });

    test("should add a `paused` class when `paused` is true", async ({ page }) => {
        await page.goto(
            fixtureURL("progress-progress-ring--progress-ring", { paused: true })
        );

        const element = page.locator("fast-progress-ring");

        await expect(element).toHaveClass(/paused/);
    });

    test("should render an element with a `determinate` slot when a value is provided", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("progress-progress-ring--progress-ring", { value: 50 })
        );

        const element = page.locator("fast-progress-ring");

        const progress = element.locator(".progress");

        await expect(progress).toHaveAttribute("slot", "determinate");
    });
});
