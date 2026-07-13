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
        const listItems = element.locator("li");

        await expect(listItems).toHaveCount(2);

        await expect(listItems).toHaveText(["Foo", "Bar"]);

        await element.evaluate((node: HTMLElement & { list: Array<string> }) => {
            node.list = ["A", "B", "C"];
        });

        await expect(listItems).toHaveCount(3);

        await expect(listItems).toHaveText(["A", "B", "C"]);
    });

    test("create a children directive with the single option", async ({ page }) => {
        test.slow();

        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/children/");
        await hydrationCompleted;

        const element = page.locator("test-element");

        const result = await element.evaluate((node: any) => ({
            // `{firstItem single filter elements(b)}` — the selector must be
            // applied before the first match is taken, skipping the leading <i>.
            firstIsArray: Array.isArray(node.firstItem),
            firstTagName: node.firstItem ? node.firstItem.tagName : null,
            // `{trailingSingle filter elements() single}` — `single` after the
            // filter clause must still be honored.
            trailingIsArray: Array.isArray(node.trailingSingle),
            trailingTagName: node.trailingSingle ? node.trailingSingle.tagName : null,
            // `{emptyItem single filter elements()}` — nothing matches.
            emptyIsNull: node.emptyItem === null,
            emptyNotified: (window as any).emptyItemNotified === true,
        }));

        expect(result.firstIsArray).toBe(false);
        expect(result.firstTagName).toBe("B");
        expect(result.trailingIsArray).toBe(false);
        expect(result.trailingTagName).toBe("SPAN");
        expect(result.emptyIsNull).toBe(true);
        expect(result.emptyNotified).toBe(true);
    });
});
