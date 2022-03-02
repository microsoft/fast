import { test, expect } from "@playwright/test";

test.describe("page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should contain fast-welcome", async ({ page }) => {
        const element = page.locator("fast-welcome");
        await expect(element).not.toBeNull();
    });

    test("should set fast-welcome theme attribute to dark", async ({ page }) => {
        const theme = await page.locator("fast-welcome").getAttribute("theme");
        expect(theme).toEqual("dark");
    });
});
