import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create an event attribute", async ({ page }) => {
        await page.goto("/event");

        const customElement = await page.locator("test-element");

        let msgCount = 0;
        await page.on("console", msg => msgCount++);

        await customElement.locator("button").click();

        expect(msgCount).toEqual(1);
    });
});
