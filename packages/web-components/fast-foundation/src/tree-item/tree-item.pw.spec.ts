import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTreeItem } from "./tree-item.js";

// TODO: Need to add tests for keyboard handling & focus management
test.describe("TreeItem", () => {
    test("should include a role of `treeitem`", async ({ page }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

        const element = page.locator("fast-tree-item");

        await expect(element).toHaveAttribute("role", "treeitem");
    });

    test("should set the `aria-expanded` attribute equal to the `expanded` value when the tree item has children", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

        const element = page.locator("#root > fast-tree-item");

        await element.evaluate(node => {
            node.append(document.createElement("fast-tree-item"));
        });

        await element.evaluate<void, FASTTreeItem>(node => {
            node.expanded = true;
        });

        await expect(element).toHaveAttribute("aria-expanded", "true");
    });

    test("should NOT set the `aria-expanded` attribute if the tree item has no children", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

        const element = page.locator("fast-tree-item");

        await expect(element).not.hasAttribute("aria-expanded");
    });

    test("should NOT set the `aria-expanded` attribute if `expanded` value is true but the tree item has no children", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item", { expanded: true }));

        const element = page.locator("fast-tree-item");

        await expect(element).not.hasAttribute("aria-expanded");
    });

    test("should add a class of `expanded` when expanded is true", async ({ page }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item", { expanded: true }));

        const element = page.locator("fast-tree-item");

        await expect(element).toHaveClass(/expanded/);
    });

    test("should set the `aria-selected` attribute equal to the `selected` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

        const element = page.locator("fast-tree-item");

        await element.evaluate<void, FASTTreeItem>(node => {
            node.selected = true;
        });

        await expect(element).toHaveAttribute("aria-selected", "true");

        await element.evaluate<void, FASTTreeItem>(node => {
            node.selected = false;
        });

        await expect(element).toHaveAttribute("aria-selected", "false");
    });

    test("should NOT set the `aria-selected` attribute if `selected` value is not provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

        const element = page.locator("fast-tree-item");

        await expect(element).not.hasAttribute("aria-selected");
    });

    test("should add a class of `selected` when selected is true", async ({ page }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item", { selected: true }));

        const element = page.locator("fast-tree-item");

        await expect(element).toHaveClass(/selected/);
    });

    test("should set the `aria-disabled` attribute equal to the `disabled` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

        const element = page.locator("fast-tree-item");

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

    test("should add a class of `disabled` when disabled is true", async ({ page }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item", { disabled: true }));

        const element = page.locator("fast-tree-item");

        await expect(element).toHaveClass(/disabled/);
    });

    test("should add a slot attribute of `item` to nested tree items", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

        const element = page.locator("#root > fast-tree-item");

        const nestedElement = element.locator("fast-tree-item");

        element.evaluate(node => {
            const nestedItem = document.createElement("fast-tree-item");
            node.append(nestedItem);
        });

        await expect(nestedElement).toHaveAttribute("slot", "item");
    });

    test('should add a class of "nested" when the `nested` property is true', async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item", { nested: true }));

        const element = page.locator("fast-tree-item");

        await expect(element).toHaveClass(/nested/);
    });

    test("should set a tabindex of -1", async ({ page }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

        const element = page.locator("fast-tree-item");

        await expect(element).toHaveAttribute("tabindex", "-1");
    });

    test("should set a tabindex of 0 when focused", async ({ page }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

        const element = page.locator("fast-tree-item");

        await element.focus();

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should render an element with a class of `expand-collapse-button` when nested tree items exist", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

        const element = page.locator("#root > fast-tree-item");

        await element.evaluate(node => {
            const nestedItem = document.createElement("fast-tree-item");
            node.append(nestedItem);
        });

        const expandCollapseButton = element.locator(".expand-collapse-button");

        await expect(expandCollapseButton).toBeVisible();

        await expect(expandCollapseButton).toHaveAttribute("aria-hidden", "true");
    });

    test("should render an element with a role of `group` when nested tree items exist and `expanded` is true", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tree-view-tree-item--tree-item", { expanded: true }));

        const element = page.locator("fast-tree-item");

        const items = element.locator(".items");

        await element.evaluate(node => {
            const nestedItem = document.createElement("fast-tree-item");
            node.append(nestedItem);
        });

        await expect(items).toHaveAttribute("role", "group");
    });

    test("should NOT render an element with a role of `group` when nested tree items exist and `expanded` is false", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("tree-view-tree-item--tree-item", { expanded: false })
        );

        const element = page.locator("fast-tree-item");

        const items = element.locator(".items");

        await element.evaluate(node => {
            const nestedItem = document.createElement("fast-tree-item");
            node.append(nestedItem);
        });

        await expect(items).toHaveCount(0);
    });

    test.describe("events", () => {
        test("should fire a change event when expanded changes", async ({ page }) => {
            await page.goto(
                fixtureURL("tree-view-tree-item--tree-item-with-nested-items")
            );

            const element = page.locator("#root > fast-tree-item");

            const expandCollapseButton = element.locator(".expand-collapse-button");

            const [wasClicked] = await Promise.all([
                element.evaluate(node => {
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

        test("should toggle the expanded state when `expand-collapse-button` is clicked", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("tree-view-tree-item--tree-item-with-nested-items")
            );

            const element = page.locator("#root > fast-tree-item");

            const expandCollapseButton = element.locator(".expand-collapse-button");

            await expandCollapseButton.click();

            await expect(element).toHaveBooleanAttribute("expanded");

            await expect(element).toHaveAttribute("aria-expanded", "true");

            await expandCollapseButton.click();

            // FIXME: the state is not updated immediately
            await page.evaluate(() => new Promise(requestAnimationFrame));

            await expect(element).not.hasAttribute("expanded");

            await expect(element).toHaveAttribute("aria-expanded", "false");
        });

        test("should fire a selected change event when the `selected` property changes", async ({
            page,
        }) => {
            await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

            const element = page.locator("fast-tree-item");

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

        test("should NOT set `selected` state when a disabled element is clicked", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("tree-view-tree-item--tree-item", { disabled: true })
            );

            const element = page.locator("fast-tree-item");

            await element.click({ force: true });

            await expect(element).not.toHaveBooleanAttribute("selected");

            expect(await element.getAttribute("aria-selected")).toBeNull();
        });

        test("should fire an event when expanded state changes via the `expanded` attribute", async ({
            page,
        }) => {
            await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

            const element = page.locator("fast-tree-item");

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

        test("should fire an event when selected state changes via the `selected` attribute", async ({
            page,
        }) => {
            await page.goto(fixtureURL("tree-view-tree-item--tree-item"));

            const element = page.locator("fast-tree-item");

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
