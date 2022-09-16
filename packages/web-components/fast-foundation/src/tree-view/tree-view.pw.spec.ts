import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

// TODO: Need to add tests for keyboard handling & focus management
test.describe("TreeView", () => {
    let page: Page;
    let element: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-tree-view");

        await page.goto(fixtureURL("tree-view--tree-view"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should include a role of `tree`", async () => {
        await page.setContent(/* html */ `
            <fast-tree-view></fast-tree-view>
        `);

        await expect(element).toHaveAttribute("role", "tree");
    });

    test("should set tree item `nested` properties to true if *any* tree item has nested items", async () => {
        await page.setContent(/* html */ `
            <fast-tree-view>
                <fast-tree-item>
                    Root item 1
                    <fast-tree-item>Nested item 1</fast-tree-item>
                    <fast-tree-item>Nested item 2</fast-tree-item>
                    <fast-tree-item>Nested item 3</fast-tree-item>
                </fast-tree-item>
                <fast-tree-item>
                    Root item 2
                    <fast-tree-item>Nested item 1</fast-tree-item>
                    <fast-tree-item>Nested item 2</fast-tree-item>
                    <fast-tree-item>Nested item 3</fast-tree-item>
                </fast-tree-item>
                <fast-tree-item>
                    Root item 3
                </fast-tree-item>
            </fast-tree-view>
        `);

        const treeItems = element.locator("> fast-tree-item");

        expect(
            await treeItems.evaluateAll(items =>
                items.every(item => item.classList.contains("nested"))
            )
        ).toBe(true);
    });

    test("should set the selected state on tree items when a tree item is clicked", async () => {
        await page.setContent(/* html */ `
            <fast-tree-view>
                <fast-tree-item>
                    Root item 1
                    <fast-tree-item>Nested item 1</fast-tree-item>
                    <fast-tree-item>Nested item 2</fast-tree-item>
                    <fast-tree-item>Nested item 3</fast-tree-item>
                </fast-tree-item>
                <fast-tree-item>
                    Root item 2
                    <fast-tree-item>Nested item 1</fast-tree-item>
                    <fast-tree-item>Nested item 2</fast-tree-item>
                    <fast-tree-item>Nested item 3</fast-tree-item>
                </fast-tree-item>
                <fast-tree-item>
                    Root item 3
                </fast-tree-item>
            </fast-tree-view>
        `);

        const treeItems = element.locator("> fast-tree-item");

        const firstTreeItem = treeItems.nth(0);

        await firstTreeItem.dispatchEvent("click");

        await expect(firstTreeItem).toHaveAttribute("aria-selected", "true");
    });

    test("should only allow one tree item to be selected at a time", async () => {
        await page.setContent(/* html */ `
            <fast-tree-view>
                <fast-tree-item>
                    Root item 1
                    <fast-tree-item>Nested item 1</fast-tree-item>
                    <fast-tree-item>Nested item 2</fast-tree-item>
                    <fast-tree-item>Nested item 3</fast-tree-item>
                </fast-tree-item>
                <fast-tree-item>
                    Root item 2
                    <fast-tree-item>Nested item 1</fast-tree-item>
                    <fast-tree-item>Nested item 2</fast-tree-item>
                    <fast-tree-item>Nested item 3</fast-tree-item>
                </fast-tree-item>
                <fast-tree-item>
                    Root item 3
                </fast-tree-item>
            </fast-tree-view>
        `);

        const treeItems = element.locator("> fast-tree-item");

        const selectedTreeItems = element.locator(`fast-tree-item[aria-selected="true"]`);

        const treeItemsCount = await treeItems.count();

        for (let i = 0; i < treeItemsCount; i++) {
            const treeItem = treeItems.nth(i);

            await treeItem.dispatchEvent("click");

            await expect(treeItem).toHaveAttribute("aria-selected", "true");

            await expect(selectedTreeItems).toHaveCount(1);
        }
    });
});
