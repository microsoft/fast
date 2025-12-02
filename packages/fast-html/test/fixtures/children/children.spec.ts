import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a children directive", async ({ page }) => {
        test.slow();

        await page.goto("/fixtures/children/");

        const element = page.locator("test-element");
        const listItems = element.locator("li");

        await expect(listItems).toHaveCount(2);

        await expect(listItems).toHaveText(["Foo", "Bar"]);

        await element.evaluate((node: HTMLElement & { list: Array<string> }) => {
            node.list = ["A", "B", "C"];
        });

        await expect(listItems).toHaveCount(3);

        await expect(listItems).toHaveText(["A", "B", "C"]);
    });
});
