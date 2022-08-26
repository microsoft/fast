import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

// TODO: Need to add tests for keyboard handling & focus management
test.describe("TreeView", () => {
    test("should include a role of `tree`", async ({ page }) => {
        await page.goto(fixtureURL("tree-view--tree-view"));

        const element = page.locator("fast-tree-view");

        await expect(element).toHaveAttribute("role", "tree");
    });

    test("should set tree item `nested` properties to true if *any* tree item has nested items", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view--tree-view"));

        const element = page.locator("fast-tree-view");

        const treeItems = element.locator("> fast-tree-item");

        expect(
            await treeItems.evaluateAll(items =>
                items.every(item => item.classList.contains("nested"))
            )
        ).toBe(true);
    });

    test("should set the selected state on tree items when a tree item is clicked", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view--tree-view"));

        const element = page.locator("fast-tree-view");

        const treeItems = element.locator("> fast-tree-item");

        const firstTreeItem = treeItems.nth(0);

        await firstTreeItem.click();

        await expect(firstTreeItem).toHaveAttribute("aria-selected", "true");
    });

    test("should only allow one tree item to be selected at a time", async ({ page }) => {
        await page.goto(fixtureURL("tree-view--tree-view"));

        const element = page.locator("fast-tree-view");

        const treeItems = element.locator("> fast-tree-item");

        const selectedTreeItems = element.locator(`fast-tree-item[aria-selected="true"]`);

        const treeItemsCount = await treeItems.count();

        for (let i = 0; i < treeItemsCount; i++) {
            const treeItem = treeItems.nth(i);

            await treeItem.click();

            await expect(treeItem).toHaveAttribute("aria-selected", "true");

            await expect(selectedTreeItems).toHaveCount(1);
        }
    });
});
