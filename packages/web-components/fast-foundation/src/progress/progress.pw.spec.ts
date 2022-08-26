import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTProgress } from "./progress.js";

test.describe("Progress ring", () => {
    test("should include a role of progressbar", async ({ page }) => {
        await page.goto(fixtureURL("progress--progress"));

        const element = page.locator("fast-progress");

        await expect(element).toHaveAttribute("role", "progressbar");
    });

    test("should set the `aria-valuenow` attribute with the `value` property when provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("progress--progress", { value: 50 }));

        const element = page.locator("fast-progress");

        await expect(element).toHaveAttribute("aria-valuenow", "50");
    });

    test("should set the `aria-valuemin` attribute with the `min` property when provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("progress--progress", { min: 0 }));

        const element = page.locator("fast-progress");

        await expect(element).toHaveAttribute("aria-valuemin", "0");
    });

    test("should set the `aria-valuemax` attribute with the `max` property when provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("progress--progress", { max: 75 }));

        const element = page.locator("fast-progress");

        await expect(element).toHaveAttribute("aria-valuemax", "75");
    });

    test("should add a `paused` class when `paused` is true", async ({ page }) => {
        await page.goto(fixtureURL("progress--progress", { paused: true }));

        const element = page.locator("fast-progress");

        await expect(element).toHaveClass(/paused/);
    });

    test("should render an element with a `determinate` slot when a value is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("progress--progress", { value: 50 }));

        const element = page.locator("fast-progress");

        const progress = element.locator(".progress");

        await expect(progress).toHaveAttribute("slot", "determinate");
    });

    test("should render an element with an `indeterminate` slot when no value is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("progress--progress", { value: "!undefined" }));

        const element = page.locator("fast-progress");

        const progress = element.locator(".progress");

        await expect(progress).toHaveAttribute("slot", "indeterminate");
    });

    test("should return the `percentComplete` property as a value between 0 and 100 when `min` and `max` are unset", async ({
        page,
    }) => {
        const value = 50;
        await page.goto(fixtureURL("progress--progress", { value }));

        const element = page.locator("fast-progress");

        await expect(element).toHaveJSProperty("percentComplete", value);
    });

    test("should set the `percentComplete` property to match the current `value` in the range of `min` and `max`", async ({
        page,
    }) => {
        await page.goto(fixtureURL("progress--progress", { value: 0 }));

        const element = page.locator("fast-progress");

        await expect(element).toHaveJSProperty("percentComplete", 0);

        await element.evaluate((node: FASTProgress) => {
            node.value = 50;
        });

        await expect(element).toHaveJSProperty("percentComplete", 50);

        await element.evaluate((node: FASTProgress) => {
            node.value = 100;
        });

        await expect(element).toHaveJSProperty("percentComplete", 100);

        await element.evaluate((node: FASTProgress) => {
            node.max = 200;
        });

        await expect(element).toHaveJSProperty("percentComplete", 50);

        await element.evaluate((node: FASTProgress) => {
            node.min = 100;
        });

        await expect(element).toHaveJSProperty("percentComplete", 0);
    });
});
