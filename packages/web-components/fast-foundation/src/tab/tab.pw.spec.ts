import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTab } from "./tab.js";

test.describe("Tab", () => {
    test("should have a role of `tab`", async ({ page }) => {
        await page.goto(fixtureURL("tabs-tab--tab"));

        const element = page.locator("fast-tab");

        await expect(element).toHaveAttribute("role", "tab");
    });

    test("should have a slot attribute of `tab`", async ({ page }) => {
        await page.goto(fixtureURL("tabs-tab--tab"));

        const element = page.locator("fast-tab");

        await expect(element).toHaveAttribute("slot", "tab");
    });

    test("should set the `aria-disabled` attribute when `disabled` is true", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tabs-tab--tab", { disabled: true }));

        const element = page.locator("fast-tab");

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate<void, FASTTab>(element => {
            element.disabled = false;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });
});
