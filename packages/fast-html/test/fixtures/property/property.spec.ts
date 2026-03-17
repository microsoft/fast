import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a property binding", async ({ page }) => {
        await page.goto("/fixtures/property/");

        const customElement = page.locator("test-element");
        const span = customElement.locator("span");

        // Verify initial property binding was applied
        const title = await span.evaluate((el: any) => el.title);
        expect(title).toBe("Hello world");

        // Verify initial content binding
        await expect(span).toHaveText("Hello world");

        // Update the message attribute on the custom element
        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");
            customElement.item(0)?.setAttribute("message", "Hello pluto");
        });

        // Verify property binding updated after hydration
        const updatedTitle = await span.evaluate((el: any) => el.title);
        expect(updatedTitle).toBe("Hello pluto");

        // Verify content binding also updated
        await expect(span).toHaveText("Hello pluto");
    });
});
