import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a non-binding attribute", async ({ page }) => {
        await page.goto("/fixtures/attribute/");

        const customElement = page.locator("test-element");
        const customElementInput = customElement.locator("input");
        await expect(customElementInput).toHaveAttribute("disabled");
    });
    test("create an attribute binding", async ({ page }) => {
        await page.goto("/fixtures/attribute/");

        const customElement = page.locator("test-element");

        await expect(customElement).toHaveAttribute("type", "checkbox");
        await expect(customElement.locator("input[type='checkbox']")).toHaveCount(1);

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");
            customElement.item(0)?.setAttribute("type", "radio");
        });

        await expect(customElement).toHaveAttribute("type", "radio");
        await expect(customElement.locator("input[type='radio']")).toHaveCount(1);
    });
});
