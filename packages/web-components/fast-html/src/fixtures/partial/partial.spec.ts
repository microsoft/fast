import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a partial", async ({ page }) => {
        await page.goto("/partial");

        const customElement = await page.locator("#test");

        let customElementListItems = await customElement.locator("li");

        expect(await customElementListItems.count()).toEqual(2);
        expect(await customElementListItems.nth(0).textContent()).toEqual("Hello");
        expect(await customElementListItems.nth(1).textContent()).toEqual("World");
    });
});
