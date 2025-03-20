import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a object property reference using dot syntax in a binding", async ({ page }) => {
        await page.goto("/dot-syntax");

        const customElement = await page.locator("test-element");

        await expect(customElement).toHaveText("bar");
    });
});
