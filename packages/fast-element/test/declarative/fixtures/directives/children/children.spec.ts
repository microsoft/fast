import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a children directive", async ({ page }) => {
        test.slow();

        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/children/");
        await hydrationCompleted;

        const element = page.locator("test-element");
        const listItems = element.locator("[data-testid='list-items'] li");

        await expect(listItems).toHaveCount(2);

        await expect(listItems).toHaveText(["Foo", "Bar"]);

        const filteredNodeNames = await element.evaluate(
            (
                node: HTMLElement & {
                    allChildren: Node[];
                    filteredChildren: Node[];
                },
            ) => ({
                allChildren: node.allChildren.map(child => child.nodeName),
                filteredChildren: node.filteredChildren.map(child => child.nodeName),
            }),
        );

        expect(filteredNodeNames).toEqual({
            allChildren: ["LI", "LI"],
            filteredChildren: ["SPAN"],
        });

        await element.evaluate((node: HTMLElement & { list: Array<string> }) => {
            node.list = ["A", "B", "C"];
        });

        await expect(listItems).toHaveCount(3);

        await expect(listItems).toHaveText(["A", "B", "C"]);
        await expect(element).toHaveJSProperty("allChildren.length", 3);
    });
});
