import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a children directive", async ({ page }) => {
        await page.goto("/fixtures/children/");

        const listItemCount1 = await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");
            const listItems = (customElement.item(0) as any)?.listItems.filter((listItem: Node) => {
                return listItem instanceof HTMLLIElement;
            });
            return listItems?.length;
        });

        expect(listItemCount1).toEqual(2);

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");

            (customElement.item(0) as any).list = [
                "A",
                "B",
                "C"
            ];
        });

        await page.waitForTimeout(1000);

        const listItemCount2 = await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");
            const listItems = (customElement.item(0) as any)?.listItems.filter((listItem: Node) => {
                return listItem instanceof HTMLLIElement;
            });
            return listItems?.length;
        });

        expect(listItemCount2).toEqual(3);
    });
});
