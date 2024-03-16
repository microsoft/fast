import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTMenuItem } from "./menu-item.js";
import { MenuItemRole } from "./menu-item.options.js";

test.describe("Menu item", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-menu-item");

        root = page.locator("#root");

        await page.goto(fixtureURL("menu-item--menu-item"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should include a role of `menuitem` by default when no role is provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item>Menu item</fast-menu-item>
            `;
        });

        await expect(element).toHaveAttribute("role", MenuItemRole.menuitem);
    });

    test.describe("should include a matching role when the `role` property is provided", () => {
        let role: MenuItemRole;
        for (role in MenuItemRole) {
            test(role, async () => {
                await root.evaluate(node => {
                    node.innerHTML = /* html */ `
                            <fast-menu-item>Menu item</fast-menu-item>
                        `;
                });

                await element.evaluate(
                    (node: FASTMenuItem, role) => (node.role = role),
                    role
                );
                await expect(element).toHaveAttribute("role", role);
            });
        }
    });

    test("should set the `aria-disabled` attribute with the `disabled` value when provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item disabled>Menu item</fast-menu-item>
            `;
        });

        await expect(element).toHaveAttribute("aria-disabled", "true");
    });

    test("should set an `aria-expanded` attribute with the `expanded` value when provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item expanded>Menu item</fast-menu-item>
            `;
        });

        await expect(element).toHaveAttribute("aria-expanded", "true");
    });

    test("should set an `aria-checked` attribute with the `checked` value when provided to a menuitemcheckbox", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item role="menuitemcheckbox" checked>Menu item</fast-menu-item>
            `;
        });

        await expect(element).toHaveAttribute("aria-checked", "true");
    });

    test("should NOT set an `aria-checked` attribute when checked is provided to a menuitem", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-menu-item role="menuitem" checked>Menu item</fast-menu-item>
            `;
        });

        await expect(element).not.toHaveAttribute("aria-checked", "true");
    });

    test("should toggle the `aria-checked` attribute of checkbox item when clicked", async () => {
        await root.evaluate(node => {
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

    test("should set the `aria-checked` attribute of radio item to true when clicked", async () => {
        await root.evaluate(node => {
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
        test("should emit a `change` an event when clicked", async () => {
            await root.evaluate(node => {
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

            expect(wasClicked).toBe(true);
        });

        test("should emit a `keydown` event when space key is invoked", async () => {
            await root.evaluate(node => {
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
                        new Promise(resolve => setTimeout(() => resolve(false), 100)),
                    ])
                ),
                // FIXME: Playwright's keyboard API is not working as expected.
                element.evaluate(node =>
                    node.dispatchEvent(new KeyboardEvent("keydown", { key: " " }))
                ),
            ]);

            expect(wasChanged).toBe(true);
        });

        test("should emit a `keydown` event when `Enter` key is invoked", async () => {
            await root.evaluate(node => {
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
                        new Promise(resolve => setTimeout(() => resolve(false), 100)),
                    ])
                ),
                // FIXME: Playwright's keyboard API is not working as expected.
                element.evaluate(node =>
                    node.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
                ),
            ]);

            expect(wasChanged).toBe(true);
        });
    });
});
