import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a slotted directive", async ({ page }) => {
        await page.goto("/slotted");

        const classCount1 = await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");

            return (customElement.item(0) as any)?.classList.length;
        });

        expect(classCount1).toEqual(2);

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");

            const newElement = document.createElement("button");
            customElement.item(0)?.append(newElement);
        });

        const classCount2 = await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");

            return (customElement.item(0) as any)?.classList.length;
        });

        expect(classCount2).toEqual(3);
    });
});
