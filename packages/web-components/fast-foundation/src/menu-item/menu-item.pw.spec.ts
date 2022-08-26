import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTMenuItem } from "./menu-item.js";
import { MenuItemRole } from "./menu-item.options.js";

test.describe("Menu item", () => {
    test("should include a role of `menuitem` by default when no role is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("menu-item--menu-item"));

        const element = page.locator("fast-menu-item");

        await expect(element).toHaveAttribute("role", MenuItemRole.menuitem);
    });

    test.describe(
        "should include a matching role when the `role` property is provided",
        () => {
            let role: MenuItemRole;
            for (role in MenuItemRole) {
                test(role, async ({ page }) => {
                    await page.goto(fixtureURL("menu-item--menu-item"));

                    const element = page.locator("fast-menu-item");

                    await element.evaluate(
                        (node: FASTMenuItem, role) => (node.role = role),
                        role
                    );
                    await expect(element).toHaveAttribute("role", role);
                });
            }
        }
    );

    test("should set the `aria-disabled` attribute with the `disabled` value when provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("menu-item--menu-item", { disabled: true }));

        const element = page.locator("fast-menu-item");

        await expect(element).toHaveAttribute("aria-disabled", "true");
    });

    test("should set an `aria-expanded` attribute with the `expanded` value when provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("menu-item--menu-item", { expanded: true }));

        const element = page.locator("fast-menu-item");

        await expect(element).toHaveAttribute("aria-expanded", "true");
    });

    test("should set an `aria-checked` attribute with the `checked` value when provided to a menuitemcheckbox", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("menu-item--menu-item", {
                role: MenuItemRole.menuitemcheckbox,
                checked: true,
            })
        );

        const element = page.locator("fast-menu-item");

        await expect(element).toHaveAttribute("aria-checked", "true");
    });

    test("should NOT set an `aria-checked` attribute when checked is provided to a menuitem", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("menu-item--menu-item", {
                role: MenuItemRole.menuitem,
                checked: true,
            })
        );

        const element = page.locator("fast-menu-item");

        await expect(element).not.toHaveAttribute("aria-checked", "true");
    });

    test("should toggle the `aria-checked` attribute of checkbox item when clicked", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("menu-item--menu-item", {
                role: MenuItemRole.menuitemcheckbox,
            })
        );

        const element = page.locator("fast-menu-item");

        expect(await element.getAttribute("aria-checked")).toBe(null);

        await element.click();

        await expect(element).toHaveAttribute("aria-checked", "true");

        await element.click();

        await expect(element).toHaveAttribute("aria-checked", "false");
    });

    test("should aria-checked attribute of radio item to true when clicked", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("menu-item--menu-item", {
                role: MenuItemRole.menuitemradio,
            })
        );

        const element = page.locator("fast-menu-item");

        expect(await element.getAttribute("aria-checked")).toBe(null);

        await element.click();

        await expect(element).toHaveAttribute("aria-checked", "true");

        await element.click();

        await expect(element).toHaveAttribute("aria-checked", "true");
    });

    test.describe("events", () => {
        test("should emit a `change` an event when clicked", async ({ page }) => {
            await page.goto(fixtureURL("menu-item--menu-item"));

            const element = page.locator("fast-menu-item");

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

        test("should emit a `keydown` event when space key is invoked", async ({
            page,
        }) => {
            await page.goto(fixtureURL("menu-item--menu-item"));

            const element = page.locator("fast-menu-item");

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

        test("should emit a `keydown` event when `Enter` key is invoked", async ({
            page,
        }) => {
            await page.goto(fixtureURL("menu-item--menu-item"));

            const element = page.locator("fast-menu-item");

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
