import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a static accessor (non-reactive binding)", async ({ page }) => {
        await page.goto("/fixtures/static-accessor/");

        const customElement = page.locator("test-element");

        await expect(await customElement.getAttribute("text")).toEqual("Hello world");
        await expect(customElement).toHaveText("Hello world");

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");
            customElement.item(0)?.setAttribute("text", "Hello pluto");
        });

        await expect(await customElement.getAttribute("text")).toEqual("Hello pluto");
        // Content should NOT update since |binding:none creates a non-reactive accessor
        await expect(customElement).toHaveText("Hello world");
    });
});
