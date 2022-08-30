import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("Menu", () => {
    test.describe("default properties and attributes", () => {
        let page: Page;
        let element: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-menu");

            await page.goto(fixtureURL("menu--menu"));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should have a role of `menu`", async () => {
            await expect(element).toHaveAttribute("role", "menu");
        });

        test("should set `tabindex` of the first focusable menu item to 0", async () => {
            await expect(element.locator("fast-menu-item").first()).toHaveAttribute(
                "tabindex",
                "0"
            );
        });

        test("should set class on menu items to 0 columns", async () => {
            await expect(element.locator("fast-menu-item").first()).toHaveClass(
                /indent-0/
            );
        });

        test("should NOT set any `tabindex` on non-menu-item elements", async () => {
            await page.goto(fixtureURL("menu--menu-with-divider"));

            const element = page.locator("fast-menu");

            const divider = element.locator("fast-divider");

            expect(await divider.getAttribute("tabindex")).toBeNull();
        });
    });

    test("should focus on first menu item when focus is called", async ({ page }) => {
        await page.goto(fixtureURL("menu--menu"));

        const element = page.locator("fast-menu");

        await element.evaluate(node => node.focus());

        await expect(element.locator("fast-menu-item").first()).toBeFocused();
    });

    test("should not throw when focus is called with no items", async ({ page }) => {
        await page.goto(fixtureURL("debug--blank"));

        page.evaluate(() => {
            const menu = document.createElement("fast-menu");

            document.getElementById("root")?.append(menu);

            menu.focus();
        });

        expect(await page.evaluate(() => document.activeElement?.id)).toBe("");
    });

    test("should not throw when focus is called before initialization is complete", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        await page.evaluate(() => {
            const menu = document.createElement("fast-menu");

            menu.focus();

            document.body.append(menu);
        });

        expect(await page.evaluate(() => document.activeElement?.id)).toBe("");
    });

    test("should focus disabled items", async ({ page }) => {
        await page.goto(
            fixtureURL("menu--menu", {
                "storyItems[0].id": "menu-item-1",
                "storyItems[0].disabled": true,
            })
        );

        const element = page.locator("fast-menu");

        const firstMenuItem = element.locator("fast-menu-item:first-of-type");

        await expect(firstMenuItem).toBeDisabled();

        await expect(firstMenuItem).toHaveAttribute("tabindex", "0");

        await firstMenuItem.focus();

        await expect(firstMenuItem).toBeFocused();
    });

    test.describe("should accept elements as focusable child with role", () => {
        ["menuitem", "menuitemcheckbox", "menuitemradio"].forEach(role => {
            test(role, async ({ page }) => {
                await page.goto(
                    fixtureURL("menu--menu", {
                        "storyItems[0].tag": "div",
                        "storyItems[0].role": role,
                    })
                );

                await expect(
                    page.locator(`fast-menu [role="${role}"]`).first()
                ).toHaveAttribute("tabindex", "0");
            });
        });
    });

    test("should NOT set `indent` class on non-menu items", async ({ page }) => {
        await page.goto(fixtureURL("menu--menu-with-divider"));

        await expect(page.locator("fast-menu fast-divider")).not.toHaveClass("indent");
    });

    test("should set class on menu items to 0 columns when non fast-menu-item is present", async ({
        page,
    }) => {
        await page.goto(fixtureURL("menu--menu-with-divider"));

        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        expect(
            await menuItems.evaluateAll(items =>
                items.every(item => item.classList.contains("indent-0"))
            )
        ).toBeTruthy();
    });

    test("should set class on menu items to 1 column", async ({ page }) => {
        await page.goto(
            fixtureURL("menu--menu", { "storyItems[2].role": "menuitemradio" })
        );

        await expect(page.locator("fast-menu-item").first()).toHaveClass(/indent-1/);
    });

    test("should set class on menu items to 2 columns", async ({ page }) => {
        await page.goto(
            fixtureURL("menu--menu-with-items-with-icons", {
                "storyItems[0].role": "menuitemradio",
                "storyItems[0].start": true,
            })
        );

        await expect(page.locator("fast-menu fast-menu-item").first()).toHaveClass(
            /indent-2/
        );
    });

    test("should navigate the menu on arrow up/down keys", async ({ page }) => {
        await page.goto(
            fixtureURL("menu--menu", {
                "storyItems[0].id": "menu-item-1",
                "storyItems[1].id": "menu-item-2",
                "storyItems[2].id": "menu-item-3",
                "storyItems[3].id": "menu-item-4",
                "storyItems[3].storyContent": "Menu item 4",
            })
        );

        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        const menuItemsCount = await menuItems.count();

        await element.evaluate(node => node.focus());

        const activeElement = () => page.evaluate(() => document.activeElement?.id);

        expect(await activeElement()).toBe("menu-item-1");

        for (let i = 1; i < menuItemsCount; i++) {
            await element.press("ArrowDown");

            expect(await activeElement()).toBe(`menu-item-${i + 1}`);
        }

        for (let i = menuItemsCount; i > 1; i--) {
            await element.press("ArrowUp");

            expect(await activeElement()).toBe(`menu-item-${i - 1}`);
        }
    });

    test.describe("should not navigate to hidden items", () => {
        test("when changed after connection", async ({ page }) => {
            await page.goto(
                fixtureURL("menu--menu", {
                    "storyItems[3].storyContent": "Menu item 4",
                })
            );

            const element = page.locator("fast-menu");

            const menuItems = element.locator("fast-menu-item");

            await menuItems.nth(2).evaluate(node => node.setAttribute("hidden", ""));

            await element.evaluate(node => node.focus());

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

            await menuItems.nth(2).evaluate(node => node.removeAttribute("hidden"));

            await element.press("ArrowDown");

            await expect(menuItems.nth(1)).toBeFocused();

            await element.press("ArrowDown");

            await expect(menuItems.nth(2)).toBeFocused();
        });

        test("when set before connection", async ({ page }) => {
            await page.goto(fixtureURL("debug--blank"));

            const element = page.locator("fast-menu");

            await page.evaluate(() => {
                const menu = document.createElement("fast-menu");

                for (let i = 0; i < 4; i++) {
                    const menuItem = document.createElement("fast-menu-item");
                    menuItem.textContent = `Foo ${i}`;
                    menuItem.id = `menu-item-${i}`;

                    if (i === 2) {
                        menuItem.setAttribute("hidden", "");
                    }

                    menu.append(menuItem);
                }

                document.getElementById("root")?.append(menu);
            });

            await element.evaluate(node => node.focus());

            expect(await page.evaluate(() => document.activeElement?.id)).toBe(
                "menu-item-0"
            );

            await element.press("ArrowDown");

            expect(await page.evaluate(() => document.activeElement?.id)).toBe(
                "menu-item-1"
            );

            await element.press("ArrowDown");

            expect(await page.evaluate(() => document.activeElement?.id)).toBe(
                "menu-item-3"
            );

            await element.press("ArrowUp");

            expect(await page.evaluate(() => document.activeElement?.id)).toBe(
                "menu-item-1"
            );
        });
    });

    test("should treat all checkbox menu items as individually selectable items", async ({
        page,
    }) => {
        await page.goto(fixtureURL("menu--menu-with-checkboxes"));

        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        const menuItemsCount = await menuItems.count();

        for (let i = 0; i < menuItemsCount; i++) {
            const item = menuItems.nth(i);

            await expect(item).toHaveAttribute("aria-checked", "");

            await item.click();

            await expect(item).toHaveAttribute("aria-checked", "true");

            await item.click();

            await expect(item).toHaveAttribute("aria-checked", "false");
        }
    });

    test(`should treat all radio menu items as a radiogroup and limit selection to one item within the group`, async ({
        page,
    }) => {
        await page.goto(fixtureURL("menu--menu-with-radios"));

        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        const checkedMenuItems = element.locator(`fast-menu-item[aria-checked="true"]`);

        const menuItemsCount = await menuItems.count();

        for (let i = 0; i < menuItemsCount; i++) {
            const item = menuItems.nth(i);

            await item.click();

            await expect(item).toHaveAttribute("aria-checked", "true");

            await expect(checkedMenuItems).toHaveCount(1);
        }
    });

    test('should use elements with `[role="separator"]` to divide radio menu items into different radio groups', async ({
        page,
    }) => {
        await page.goto(fixtureURL("menu--menu-with-form-controls"));

        const element = page.locator("fast-menu");

        const menuItems = element.locator("fast-menu-item");

        await menuItems.nth(4).click();

        await expect(menuItems.nth(4)).toHaveAttribute("aria-checked", "true");
        await expect(menuItems.nth(5)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(6)).toHaveAttribute("aria-checked", "");
        await expect(menuItems.nth(7)).toHaveAttribute("aria-checked", "");

        await menuItems.nth(5).click();

        await expect(menuItems.nth(4)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(5)).toHaveAttribute("aria-checked", "true");
        await expect(menuItems.nth(6)).toHaveAttribute("aria-checked", "");
        await expect(menuItems.nth(7)).toHaveAttribute("aria-checked", "");

        await menuItems.nth(6).click();

        await expect(menuItems.nth(4)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(5)).toHaveAttribute("aria-checked", "true");
        await expect(menuItems.nth(6)).toHaveAttribute("aria-checked", "true");
        await expect(menuItems.nth(7)).toHaveAttribute("aria-checked", "false");

        await menuItems.nth(7).click();

        await expect(menuItems.nth(4)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(5)).toHaveAttribute("aria-checked", "true");
        await expect(menuItems.nth(6)).toHaveAttribute("aria-checked", "false");
        await expect(menuItems.nth(7)).toHaveAttribute("aria-checked", "true");
    });
});
