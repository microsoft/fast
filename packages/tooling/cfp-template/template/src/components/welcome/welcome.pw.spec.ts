import { expect, test } from '@playwright/test';

test.describe("fast-welcome", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should add a dark class", async ({ page }) => {
        const element = await page.locator("fast-welcome .dark");

        expect(element).toBeTruthy();
    });
});
