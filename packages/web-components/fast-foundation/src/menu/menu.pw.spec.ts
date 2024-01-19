import { expect, test } from "@playwright/test";

test.describe("Menu", () => {
    test("should have a role of `menu`", async ({ page }) => {
        const element = page.locator("fast-menu");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item>Menu item</fast-menu-item>
                </fast-menu>
            `;
        });

        await expect(element).toHaveAttribute("role", "menu");
    });

    test("should set `tabindex` of the first focusable menu item to 0", async ({
        page,
    }) => {
        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item>Menu item</fast-menu-item>
                    <fast-menu-item>Menu item</fast-menu-item>
                </fast-menu>
            `;
        });

        await expect(menuItems.first()).toHaveAttribute("tabindex", "0");
    });

    test("should NOT set any `tabindex` on non-menu-item elements", async ({ page }) => {
        const element = page.locator("fast-menu");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item>Menu item</fast-menu-item>
                    <div>Not a menu item</div>
                </fast-menu>
            `;
        });

        const divider = element.locator("div");

        expect(await divider.getAttribute("tabindex")).toBeNull();
    });

    test("should focus on first menu item when focus is called", async ({ page }) => {
        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item>Menu item</fast-menu-item>
                    <fast-menu-item>Menu item</fast-menu-item>
                </fast-menu>
            `;
        });

        await expect(menuItems.first()).toHaveAttribute("tabindex", "0");

        await element.evaluate(node => {
            node.focus();
        });

        await expect(menuItems.first()).toBeFocused();
    });

    test("should not throw when focus is called with no items", async ({ page }) => {
        const element = page.locator("fast-menu");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu></fast-menu>
            `;
        });

        await element.evaluate(node => {
            node.focus();
        });

        await expect(element).not.toBeFocused();

        // expect(await page.evaluate(() => document.activeElement?.id)).toBe("");
    });

    test("should not throw when focus is called before initialization is complete", async ({
        page,
    }) => {
        const element = page.locator("fast-menu");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = "";

            const menu = document.createElement("fast-menu");

            menu.focus();

            node.append(menu);
        });

        await expect(element).not.toBeFocused();
    });

    test("should focus disabled items", async ({ page }) => {
        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        const firstMenuItem = menuItems.first();

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item disabled>Menu item</fast-menu-item>
                    <fast-menu-item>Menu item</fast-menu-item>
                </fast-menu>
            `;
        });

        await expect(firstMenuItem).toBeDisabled();

        await expect(firstMenuItem).toHaveAttribute("tabindex", "0");

        await firstMenuItem.focus();

        await expect(firstMenuItem).toBeFocused();
    });

    ["menuitem", "menuitemcheckbox", "menuitemradio"].forEach(role => {
        test(`should accept elements as focusable child with "${role}" role`, async ({
            page,
        }) => {
            const element = page.locator("fast-menu");

            const compatibleElement = element.locator(`[role="${role}"]`);

            await page.goto("http://localhost:6006");

            await page.locator("#root").evaluate(
                (node, { role }) => {
                    node.innerHTML = /* html */ `
                        <fast-menu>
                            <div role="${role}">Menu item</div>
                        </fast-menu>
                    `;
                },
                { role }
            );

            await expect(compatibleElement).toHaveAttribute("tabindex", "0");
        });
    });

    test("should not navigate to hidden items when changed after connection", async ({
        page,
    }) => {
        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item>Menu item 1</fast-menu-item>
                    <fast-menu-item>Menu item 2</fast-menu-item>
                    <fast-menu-item>Menu item 3</fast-menu-item>
                    <fast-menu-item>Menu item 4</fast-menu-item>
                </fast-menu>
            `;
        });

        await expect.soft(menuItems).toHaveCount(4);

        await menuItems.nth(2).evaluate(node => node.toggleAttribute("hidden"));

        await element.evaluate(node => {
            node.focus();
        });

        await (await element.elementHandle())?.waitForElementState("stable");

        await expect(menuItems.nth(0)).toBeFocused();

        await element.press("ArrowDown");

        await expect(menuItems.nth(1)).toBeFocused();

        await element.press("ArrowDown");

        await expect(menuItems.nth(2)).not.toBeFocused();

        await expect(menuItems.nth(3)).toBeFocused();

        await element.press("ArrowUp");

        await expect(menuItems.nth(2)).not.toBeFocused();

        await expect(menuItems.nth(1)).toBeFocused();

        await element.press("ArrowUp");

        await expect(menuItems.nth(0)).toBeFocused();

        await menuItems.nth(2).evaluate(node => {
            node.removeAttribute("hidden");
        });

        await (await element.elementHandle())?.waitForElementState("stable");

        await element.press("ArrowDown");

        await expect(menuItems.nth(1)).toBeFocused();

        await element.press("ArrowDown");

        await expect(menuItems.nth(2)).toBeFocused();
    });

    test("should treat all checkbox menu items as individually selectable items", async ({
        page,
    }) => {
        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item role="menuitemcheckbox">Menu item 1</fast-menu-item>
                    <fast-menu-item role="menuitemcheckbox">Menu item 2</fast-menu-item>
                    <fast-menu-item role="menuitemcheckbox">Menu item 3</fast-menu-item>
                    <fast-menu-item role="menuitemcheckbox">Menu item 4</fast-menu-item>
                </fast-menu>
            `;
        });

        const menuItemsCount = await menuItems.count();

        for (let i = 0; i < menuItemsCount; i++) {
            const item = menuItems.nth(i);

            await expect(item).toHaveAttribute("aria-checked", "false");

            await item.click();

            await expect(item).toHaveAttribute("aria-checked", "true");

            await item.click();

            await expect(item).toHaveAttribute("aria-checked", "false");
        }
    });

    test(`should treat all radio menu items as a radiogroup and limit selection to one item within the group`, async ({
        page,
    }) => {
        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item role="menuitemradio">Menu item 1</fast-menu-item>
                    <fast-menu-item role="menuitemradio">Menu item 2</fast-menu-item>
                    <fast-menu-item role="menuitemradio">Menu item 3</fast-menu-item>
                </fast-menu>
            `;
        });

        await menuItems.first().click();

        await expect(menuItems.first()).toHaveAttribute("aria-checked", "true");

        await expect(menuItems.nth(1)).toHaveAttribute("aria-checked", "false");

        await expect(menuItems.nth(2)).toHaveAttribute("aria-checked", "false");

        await menuItems.nth(1).click();

        await expect(menuItems.first()).toHaveAttribute("aria-checked", "false");

        await expect(menuItems.nth(1)).toHaveAttribute("aria-checked", "true");

        await expect(menuItems.nth(2)).toHaveAttribute("aria-checked", "false");

        await menuItems.nth(2).click();

        await expect(menuItems.first()).toHaveAttribute("aria-checked", "false");

        await expect(menuItems.nth(1)).toHaveAttribute("aria-checked", "false");

        await expect(menuItems.nth(2)).toHaveAttribute("aria-checked", "true");
    });

    test('should use elements with `[role="separator"]` to divide radio menu items into different radio groups', async ({
        page,
    }) => {
        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item role="menuitemradio">Menu item 1</fast-menu-item>
                    <fast-menu-item role="menuitemradio">Menu item 2</fast-menu-item>
                    <fast-divider role="separator"></fast-divider>
                    <fast-menu-item role="menuitemradio">Menu item 3</fast-menu-item>
                    <fast-menu-item role="menuitemradio">Menu item 4</fast-menu-item>
                </fast-menu>
            `;
        });

        await menuItems.nth(0).click();

        await expect(menuItems.nth(0)).toHaveAttribute("aria-checked", "true");
        await expect(menuItems.nth(1)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(2)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(3)).toHaveAttribute("aria-checked", "false");

        await menuItems.nth(1).click();

        await expect(menuItems.nth(0)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(1)).toHaveAttribute("aria-checked", "true");
        await expect(menuItems.nth(2)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(3)).toHaveAttribute("aria-checked", "false");

        await menuItems.nth(2).click();

        await expect(menuItems.nth(0)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(1)).toHaveAttribute("aria-checked", "true");
        await expect(menuItems.nth(2)).toHaveAttribute("aria-checked", "true");
        await expect(menuItems.nth(3)).toHaveAttribute("aria-checked", "false");

        await menuItems.nth(3).click();

        await expect(menuItems.nth(0)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(1)).toHaveAttribute("aria-checked", "true");
        await expect(menuItems.nth(2)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(3)).toHaveAttribute("aria-checked", "true");
    });

    test("should navigate the menu on arrow up/down keys", async ({ page }) => {
        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item>Menu item 1</fast-menu-item>
                    <fast-menu-item>Menu item 2</fast-menu-item>
                    <fast-menu-item>Menu item 3</fast-menu-item>
                    <fast-menu-item>Menu item 4</fast-menu-item>
                </fast-menu>
            `;
        });

        await element.waitFor({ state: "attached" });

        await element.evaluate(node => {
            node.focus();
        });

        await expect(menuItems).toHaveCount(4);

        await expect(menuItems.first()).toBeFocused();

        await element.press("ArrowDown");

        await expect(menuItems.nth(1)).toBeFocused();

        await element.press("ArrowDown");

        await expect(menuItems.nth(2)).toBeFocused();

        await element.press("ArrowDown");

        await expect(menuItems.nth(3)).toBeFocused();
    });

    test("should close the menu when pressing the escape key", async ({ page }) => {
        test.slow();
        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item>Menu item 1
                        <fast-menu slot="submenu">
                            <fast-menu-item>Menu item 1.1</fast-menu-item>
                            <fast-menu-item>Menu item 1.2</fast-menu-item>
                            <fast-menu-item>Menu item 1.3</fast-menu-item>
                        </fast-menu>
                    </fast-menu-item>
                </fast-menu>
            `;
        });

        await element.first().evaluate(node => {
            node.focus();
        });

        await element.first().press("ArrowRight");

        await (await element.first().elementHandle())?.waitForElementState("stable");

        await expect(menuItems.nth(1)).toBeFocused();

        await element.first().press("Escape");

        await (await element.first().elementHandle())?.waitForElementState("stable");

        await expect(menuItems.first()).toBeFocused();
    });

    test("should not navigate to hidden items when set before connection", async ({
        page,
    }) => {
        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu>
                    <fast-menu-item>Menu item 1</fast-menu-item>
                    <fast-menu-item hidden="hidden">Menu item 2</fast-menu-item>
                    <fast-menu-item>Menu item 3</fast-menu-item>
                    <fast-menu-item>Menu item 4</fast-menu-item>
                </fast-menu>
            `;

            // reset the focus to the window to help with flakiness
            window.focus();
        });

        await (await element.elementHandle())?.waitForElementState("stable");

        await element.evaluate(node => {
            node.focus();
        });

        await expect(menuItems.nth(0)).toBeFocused({ timeout: 500 });

        await element.evaluate(node => {
            node.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowDown",
                })
            );
        });

        await expect(menuItems.nth(2)).toBeFocused();

        await element.evaluate(node => {
            node.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowDown",
                })
            );
        });

        await expect(menuItems.nth(3)).toBeFocused();

        await element.evaluate(node => {
            node.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowUp",
                })
            );
        });

        await expect(menuItems.nth(2)).toBeFocused();

        await element.evaluate(node => {
            node.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowUp",
                })
            );
        });

        await expect(menuItems.nth(0)).toBeFocused();
    });
});
