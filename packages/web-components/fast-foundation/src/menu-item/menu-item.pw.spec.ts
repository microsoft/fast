import { expect, test } from "@playwright/test";
import type { FASTMenuItem } from "./menu-item.js";
import { MenuItemRole } from "./menu-item.options.js";

test.describe("Menu item", () => {
    test("should include a role of `menuitem` by default when no role is provided", async ({
        page,
    }) => {
        const element = page.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item>Menu item</fast-menu-item>
            `;
        });

        await expect(element).toHaveAttribute("role", MenuItemRole.menuitem);
    });

    test.describe("should include a matching role when the `role` property is provided", () => {
        let role: MenuItemRole;
        for (role in MenuItemRole) {
            test(role, async ({ page }) => {
                const element = page.locator("fast-menu-item");

                await page.goto("http://localhost:6006");

                await page.locator("#root").evaluate(node => {
                    node.innerHTML = /* html */ `
                            <fast-menu-item>Menu item</fast-menu-item>
                        `;
                });

                await element.evaluate((node: FASTMenuItem, role) => {
                    node.role = role;
                }, role);

                await expect(element).toHaveAttribute("role", role);
            });
        }
    });

    test("should set the `aria-disabled` attribute with the `disabled` value when provided", async ({
        page,
    }) => {
        const element = page.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item disabled>Menu item</fast-menu-item>
            `;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");
    });

    test("should set an `aria-expanded` attribute with the `expanded` value when provided", async ({
        page,
    }) => {
        const element = page.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item expanded>Menu item</fast-menu-item>
            `;
        });

        await expect(element).toHaveAttribute("aria-expanded", "true");
    });

    test("should set an `aria-checked` attribute with the `checked` value when provided to a menuitemcheckbox", async ({
        page,
    }) => {
        const element = page.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item role="menuitemcheckbox" checked>Menu item</fast-menu-item>
            `;
        });

        await expect(element).toHaveAttribute("aria-checked", "true");
    });

    test("should NOT set an `aria-checked` attribute when checked is provided to a menuitem", async ({
        page,
    }) => {
        const element = page.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item role="menuitem" checked>Menu item</fast-menu-item>
            `;
        });

        await expect(element).not.toHaveAttribute("aria-checked", "true");
    });

    test("should toggle the `aria-checked` attribute of checkbox item when clicked", async ({
        page,
    }) => {
        const element = page.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item role="menuitemcheckbox">Menu item</fast-menu-item>
            `;
        });

        await expect(element).toHaveAttribute("aria-checked", "false");

        await element.click();

        await expect(element).toHaveAttribute("aria-checked", "true");

        await element.click();

        await expect(element).toHaveAttribute("aria-checked", "false");
    });

    test("should set the `aria-checked` attribute of radio item when clicked", async ({
        page,
    }) => {
        const element = page.locator("fast-menu-item");

        await page.goto("http://localhost:6006");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item role="menuitemradio">Menu item</fast-menu-item>
            `;
        });

        await expect(element).toHaveAttribute("aria-checked", "false");

        await element.click();

        await expect(element).toHaveAttribute("aria-checked", "true");

        await element.click();

        await expect(element).toHaveAttribute("aria-checked", "true");
    });

    test.describe("events", () => {
        test("should emit a `change` event when clicked", async ({ page }) => {
            const element = page.locator("fast-menu-item");

            await page.goto("http://localhost:6006");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-menu-item>Menu item</fast-menu-item>
                `;
            });

            const [wasClicked] = await Promise.all([
                element.evaluate(
                    node =>
                        new Promise(resolve =>
                            node.addEventListener("change", () => resolve(true))
                        )
                ),
                element.click(),
            ]);

            expect.soft(wasClicked).toBe(true);
        });

        test("should emit a `keydown` event when space key is invoked", async ({
            page,
        }) => {
            const element = page.locator("fast-menu-item");

            await page.goto("http://localhost:6006");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-menu-item>Menu item</fast-menu-item>
                `;
            });

            const [wasChanged] = await Promise.all([
                element.evaluate(node =>
                    Promise.race<boolean>([
                        new Promise(resolve => {
                            node.addEventListener("keydown", () => resolve(true));
                        }),
                        new Promise(resolve =>
                            requestAnimationFrame(() =>
                                setTimeout(() => resolve(false), 100)
                            )
                        ),
                    ])
                ),
                // FIXME: Playwright's keyboard API is not working as expected.
                element.evaluate(node => {
                    node.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
                }),
            ]);

            expect.soft(wasChanged).toBe(true);
        });

        test("should emit a `keydown` event when `Enter` key is invoked", async ({
            page,
        }) => {
            const element = page.locator("fast-menu-item");

            await page.goto("http://localhost:6006");

            await page.locator("#root").evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-menu-item>Menu item</fast-menu-item>
                `;
            });

            const [wasChanged] = await Promise.all([
                element.evaluate(node =>
                    Promise.race<boolean>([
                        new Promise(resolve => {
                            node.addEventListener("keydown", () => resolve(true));
                        }),
                        new Promise(resolve =>
                            requestAnimationFrame(() =>
                                setTimeout(() => resolve(false), 100)
                            )
                        ),
                    ])
                ),
                // FIXME: Playwright's keyboard API is not working as expected.
                element.evaluate(node => {
                    node.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
                }),
            ]);

            expect.soft(wasChanged).toBe(true);
        });
    });
});
