import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a ref directive", async ({ page }) => {
        await page.goto("/fixtures/ref/");

        const element = page.locator("test-element");

        await expect(element).toHaveJSProperty("video.nodeName", "VIDEO");
    });
});
