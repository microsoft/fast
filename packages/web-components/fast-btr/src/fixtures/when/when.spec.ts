import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a when directive", async ({ page }) => {
        await page.goto("/when");

        const customElementShow = await page.locator("#show");
        const customElementHide = await page.locator("#hide");

        await expect(customElementShow).toHaveText("Hello world");
        await expect(customElementHide).not.toHaveText("Hello world");

        await page.evaluate(() => {
            const customElementShow = document.getElementById("show");
            const customElementHide = document.getElementById("hide");
            customElementShow?.removeAttribute("show");
            customElementHide?.setAttribute("show", "");
        });

        await expect(customElementShow).not.toHaveText("Hello world");
        await expect(customElementHide).toHaveText("Hello world");
    });
});
