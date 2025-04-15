import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a repeat directive", async ({ page }) => {
        await page.goto("/repeat");

        const customElement = await page.locator("test-element");
        let customElementListItems = await customElement.locator("li");

        expect(await customElementListItems.count()).toEqual(2);
        expect(await customElementListItems.nth(0).textContent()).toEqual("Foo - Bat");
        expect(await customElementListItems.nth(1).textContent()).toEqual("Bar - Bat");

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");

            (customElement.item(0) as any).list = [
                "A",
                "B",
                "C"
            ];
        });

        const timeout = new Promise(function(resolve) {
            setTimeout(resolve, 100);
        });

        await timeout;

        customElementListItems = await customElement.locator("li");
        expect(await customElementListItems.count()).toEqual(3);
        expect(await customElementListItems.nth(0).textContent()).toEqual("A - Bat");
        expect(await customElementListItems.nth(1).textContent()).toEqual("B - Bat");
        expect(await customElementListItems.nth(2).textContent()).toEqual("C - Bat");
    });
});
