import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a ref directive", async ({ page }) => {
        await page.goto("/fixtures/ref/");
        await page.waitForFunction(() => (window as any).getHydrationCompleteStatus());

        const element = page.locator("test-element");

        await expect(element).toHaveJSProperty("video.nodeName", "VIDEO");
    });
});
