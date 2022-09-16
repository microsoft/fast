import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTreeItem } from "./tree-item.js";

test.describe("TreeItem", () => {
    let page: Page;
    let element: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-tree-item");

        await page.goto(fixtureURL("tree-view-tree-item--tree-item"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should include a role of `treeitem`", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>tree item</fast-tree-item>
        `);

        await expect(element).toHaveAttribute("role", "treeitem");
    });

    test("should set the `aria-expanded` attribute equal to the `expanded` value when the tree item has children", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>
                <fast-tree-item>tree item</fast-tree-item>
            </fast-tree-item>
        `);

        await element.first().evaluate<void, FASTTreeItem>(node => {
            node.expanded = true;
        });

        await expect(element.first()).toHaveAttribute("aria-expanded", "true");
    });

    test("should NOT set the `aria-expanded` attribute when the tree item has no children", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>tree item</fast-tree-item>
        `);

        await expect(element).not.hasAttribute("aria-expanded");
    });

    test("should NOT set the `aria-expanded` attribute when the `expanded` state is true and the tree item has no children", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item expanded></fast-tree-item>
        `);

        await expect(element).not.hasAttribute("aria-expanded");
    });

    test("should add a class of `expanded` when expanded is true", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item expanded></fast-tree-item>
        `);

        await expect(element).toHaveClass(/expanded/);
    });

    test("should NOT set the `aria-selected` attribute if `selected` value is not provided", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>tree item</fast-tree-item>
        `);

        await expect(element).not.hasAttribute("aria-selected");
    });

    test("should set the `aria-selected` attribute equal to the `selected` value", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>tree item</fast-tree-item>
        `);

        await element.evaluate<void, FASTTreeItem>(node => {
            node.selected = true;
        });

        await expect(element).toHaveAttribute("aria-selected", "true");

        await element.evaluate<void, FASTTreeItem>(node => {
            node.selected = false;
        });

        await expect(element).toHaveAttribute("aria-selected", "false");
    });

    test("should add a class of `selected` when selected is true", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item selected></fast-tree-item>
        `);

        await expect(element).toHaveClass(/selected/);
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` property", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>tree item</fast-tree-item>
        `);

        await expect(element).not.hasAttribute("aria-disabled");

        await element.evaluate<void, FASTTreeItem>(node => {
            node.disabled = true;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");

        await element.evaluate<void, FASTTreeItem>(node => {
            node.disabled = false;
        });

        await expect(element).toHaveAttribute("aria-disabled", "false");
    });

    test('should add a class of "disabled" when `disabled` is true', async () => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item", { disabled: true }));

        await expect(element).toHaveClass(/disabled/);
    });

    test('should add a slot attribute of "item" to nested tree items', async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>
                <fast-tree-item>tree item</fast-tree-item>
            </fast-tree-item>
        `);

        await expect(element.first().locator("fast-tree-item")).toHaveAttribute(
            "slot",
            "item"
        );
    });

    test('should add a class of "nested" when the `nested` property is true', async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>tree item</fast-tree-item>
        `);

        await element.evaluate((node: FASTTreeItem) => {
            node.nested = true;
        });

        await expect(element).toHaveClass(/nested/);
    });

    test("should have a default `tabindex` attribute of -1", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>tree item</fast-tree-item>
        `);

        await expect(element).toHaveAttribute("tabindex", "-1");
    });

    test("should have a tabindex of 0 when focused", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>tree item</fast-tree-item>
        `);

        await element.focus();

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should render an element with a class of `expand-collapse-button` when nested tree items exist", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>
                <fast-tree-item>tree item</fast-tree-item>
            </fast-tree-item>
        `);

        const expandCollapseButton = element.first().locator(".expand-collapse-button");

        await expect(expandCollapseButton).toBeVisible();

        await expect(expandCollapseButton).toHaveAttribute("aria-hidden", "true");
    });

    test("should render an element with a role of `group` when nested tree items exist and `expanded` is true", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item expanded>
                <fast-tree-item>tree item</fast-tree-item>
            </fast-tree-item>
        `);

        await expect(element.first().locator(".items")).toHaveAttribute("role", "group");
    });

    test("should NOT render an element with a role of `group` when nested tree items exist and `expanded` is false", async () => {
        await page.setContent(/* html */ `
            <fast-tree-item>
                <fast-tree-item>tree item</fast-tree-item>
            </fast-tree-item>
        `);

        await expect(element.first().locator(".items")).toHaveCount(0);
    });

    test.describe("events", () => {
        test('should emit a "change" event when the `expanded` property changes', async () => {
            await page.setContent(/* html */ `
                <fast-tree-item>
                    <fast-tree-item>tree item</fast-tree-item>
                    <fast-tree-item>tree item</fast-tree-item>
                </fast-tree-item>
            `);

            const expandCollapseButton = element
                .first()
                .locator(".expand-collapse-button");

            const [wasClicked] = await Promise.all([
                element.first().evaluate(node => {
                    return new Promise(resolve => {
                        node.addEventListener("expanded-change", () => {
                            resolve(true);
                        });
                    });
                }),
                expandCollapseButton.click(),
            ]);

            expect(wasClicked).toBe(true);
        });

        test("should toggle the expanded state when `expand-collapse-button` is clicked", async () => {
            test.slow();
            await page.setContent(/* html */ `
                <fast-tree-item>
                    <fast-tree-item>tree item</fast-tree-item>
                    <fast-tree-item>tree item</fast-tree-item>
                </fast-tree-item>
            `);

            const expandCollapseButton = element
                .first()
                .locator(".expand-collapse-button");

            await expandCollapseButton.click();

            await expect(element.first()).toHaveBooleanAttribute("expanded");

            await expect(element.first()).toHaveAttribute("aria-expanded", "true");

            await expandCollapseButton.click();

            // FIXME: the state is not updated immediately
            await page.evaluate(() => new Promise(requestAnimationFrame));

            await expect(element.first()).not.hasAttribute("expanded");

            await expect(element.first()).toHaveAttribute("aria-expanded", "false");
        });

        test("should fire a selected change event when the `selected` property changes", async () => {
            await page.setContent(/* html */ `
                <fast-tree-item>tree item</fast-tree-item>
            `);

            const [wasChanged] = await Promise.all([
                element.evaluate(node => {
                    return new Promise(resolve => {
                        node.addEventListener("selected-change", () => {
                            resolve(true);
                        });
                    });
                }),
                element.evaluate<void, FASTTreeItem>(node => {
                    node.selected = true;
                }),
            ]);

            expect(wasChanged).toBeTruthy();
        });

        test("should NOT set `selected` state when a disabled element is clicked", async () => {
            await page.setContent(/* html */ `
                <fast-tree-item disabled>tree item</fast-tree-item>
            `);

            await element.click({ force: true });

            await expect(element).not.toHaveBooleanAttribute("selected");

            expect(await element.getAttribute("aria-selected")).toBeNull();
        });

        test("should fire an event when expanded state changes via the `expanded` attribute", async () => {
            await page.setContent(/* html */ `
                <fast-tree-item>tree item</fast-tree-item>
            `);

            const [wasChanged] = await Promise.all([
                element.evaluate(node => {
                    return new Promise(resolve => {
                        node.addEventListener("expanded-change", () => {
                            resolve(true);
                        });
                    });
                }),
                element.evaluate(node => {
                    node.toggleAttribute("expanded", true);
                }),
            ]);

            expect(wasChanged).toBeTruthy();
        });

        test("should fire an event when selected state changes via the `selected` attribute", async () => {
            await page.setContent(/* html */ `
                <fast-tree-item>tree item</fast-tree-item>
            `);

            const [wasChanged] = await Promise.all([
                element.evaluate(node => {
                    return new Promise(resolve => {
                        node.addEventListener("selected-change", () => {
                            resolve(true);
                        });
                    });
                }),
                element.evaluate(node => {
                    node.toggleAttribute("selected", true);
                }),
            ]);

            expect(wasChanged).toBeTruthy();
        });
    });
});
