import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a non-binding attribute", async ({ page }) => {
        await page.goto("/attribute");

        const customElement = page.locator("test-element");
        const customElementInput = customElement.locator("input");
        await expect(customElementInput).toHaveAttribute("disabled");
    });
    test("create an attribute binding", async ({ page }) => {
        await page.goto("/attribute");

        const customElement = page.locator("test-element");

        await expect(customElement).toHaveAttribute("type", "checkbox");
        await expect(await (await customElement.locator("input[type='checkbox']")).count()).toEqual(1);

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");
            customElement.item(0)?.setAttribute("type", "radio");
        });

        await expect(await customElement.getAttribute("type")).toEqual("radio");
        await expect(await (await customElement.locator("input[type='radio']")).count()).toEqual(1);
    });
});
