import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a children directive", async ({ page }) => {
        await page.goto("/fixtures/children/");

        const element = page.locator("test-element");

        await expect(element).toHaveCount(1);

        const filteredItems = await element.evaluate((el: HTMLElement & { listItems: Node[] }) => {
            return el.listItems.filter(item => item.nodeType === Node.ELEMENT_NODE);
        });

        expect(filteredItems).toHaveLength(2);

        await expect(element).toHaveText("Foo Bar");

        await element.evaluate((node: HTMLElement & { list: Array<string> }) => {
            node.list = ["A", "B", "C"];
        });

        expect(await element.evaluate((node: HTMLElement & { listItems: Node[] }) => {
            const listItems = node.listItems.filter((listItem: Node) => {
                return listItem instanceof HTMLLIElement;
            });
            return listItems?.length;
        })).toEqual(3);

        await expect(element).toHaveText("A B C");
    });
});
