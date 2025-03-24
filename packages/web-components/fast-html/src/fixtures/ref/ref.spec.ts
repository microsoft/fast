import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a ref directive", async ({ page }) => {
        await page.goto("/ref");

        const isVideo = await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");

            return (customElement.item(0) as any)?.video instanceof HTMLVideoElement;
        });

        expect(isVideo).toEqual(true);
    });
});
