import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a ref directive", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/ref/");
        await hydrationCompleted;

        const element = page.locator("test-element");

        await expect(element).toHaveJSProperty("video.nodeName", "VIDEO");
    });
});
