import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a partial", async ({ page }) => {
        await page.goto("/partial");

        const customElement = await page.locator("#test");

        let customElementListItems = await customElement.locator("li");

        expect(await customElementListItems.count()).toEqual(4);
        expect(await customElementListItems.nth(0).textContent()).toEqual("Hello");
        expect(await customElementListItems.nth(1).textContent()).toContain("Earth");
        expect(await customElementListItems.nth(2).textContent()).toContain("Pluto");
        expect(await customElementListItems.nth(3).textContent()).toContain("Mars");
    });
});
