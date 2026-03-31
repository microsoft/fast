import { expect, test } from "@playwright/test";

test.describe("Nested Elements Hydration", () => {
    test("should hydrate parent elements before child elements", async ({ page }) => {
        await page.goto("/fixtures/nested-elements/");

        const messages = (await page.evaluate("window.messages")) as string[];

        const parentDefinitionIndex = messages.findIndex(message =>
            message.startsWith("Element did define: parent-element"),
        );
        const firstChildHydrationIndex = messages.findIndex(message =>
            message.startsWith("Element will hydrate: child-element"),
        );

        expect(parentDefinitionIndex).toBeGreaterThan(-1);
        expect(firstChildHydrationIndex).toBeGreaterThan(-1);
        expect(parentDefinitionIndex).toBeLessThan(firstChildHydrationIndex);

        const childHydrationStarts = messages.filter(message =>
            message.startsWith("Element will hydrate: child-element"),
        );
        const childHydrationCompletes = messages.filter(message =>
            message.startsWith("Element did hydrate: child-element"),
        );

        // Non-zero proves the fixture actually exercised nested hydration.
        expect(childHydrationStarts.length).toBeGreaterThan(0);

        // Equal counts mean every child that started hydration also finished.
        expect(childHydrationStarts.length).toBe(childHydrationCompletes.length);
    });
});

test.describe("when-repeat-element: f-when with f-repeat and nested f-when", () => {
    test("should render items when showOuter is true", async ({ page }) => {
        await page.goto("/fixtures/nested-elements/");

        const element = page.locator("when-repeat-element");

        await expect(element.locator(".item")).toHaveCount(2);
        await expect(element.locator(".outer-content")).toBeVisible();
        await expect(
            element.locator("span").filter({ hasText: "Outer when not rendered" }),
        ).toHaveCount(0);
    });

    test("should show 'Outer when not rendered' and hide items when showOuter is toggled off", async ({
        page,
    }) => {
        await page.goto("/fixtures/nested-elements/");

        const element = page.locator("when-repeat-element");

        await page.evaluate(() => {
            document.querySelector("when-repeat-element")?.removeAttribute("show-outer");
        });

        await expect(element.locator(".item")).toHaveCount(0);
        await expect(element.locator(".outer-content")).toHaveCount(0);
        await expect(
            element.locator("span").filter({ hasText: "Outer when not rendered" }),
        ).toBeVisible();
    });

    test("should restore items when showOuter is toggled back on", async ({ page }) => {
        await page.goto("/fixtures/nested-elements/");

        const element = page.locator("when-repeat-element");

        await page.evaluate(() => {
            document.querySelector("when-repeat-element")?.removeAttribute("show-outer");
        });

        await expect(element.locator(".item")).toHaveCount(0);

        await page.evaluate(() => {
            document.querySelector("when-repeat-element")?.setAttribute("show-outer", "");
        });

        await expect(element.locator(".item")).toHaveCount(2);
        await expect(
            element.locator("span").filter({ hasText: "Outer when not rendered" }),
        ).toHaveCount(0);
    });

    test("should show inner content for showInner true items and 'Inner when not rendered' for showInner false items", async ({
        page,
    }) => {
        await page.goto("/fixtures/nested-elements/");

        const element = page.locator("when-repeat-element");
        const items = element.locator(".item");

        // Item 1: showInner=true — inner content visible, else text absent
        await expect(items.nth(0).locator(".inner-content")).toBeVisible();
        await expect(
            items.nth(0).locator("span").filter({ hasText: "Inner when not rendered" }),
        ).toHaveCount(0);

        // Item 2: showInner=false — inner content absent, else text visible
        await expect(items.nth(1).locator(".inner-content")).toHaveCount(0);
        await expect(
            items.nth(1).locator("span").filter({ hasText: "Inner when not rendered" }),
        ).toBeVisible();
    });

    test("should update repeat items when items array is replaced", async ({ page }) => {
        await page.goto("/fixtures/nested-elements/");

        const element = page.locator("when-repeat-element");
        const items = element.locator(".item");

        await expect(items).toHaveCount(2);

        await element.evaluate((node: any) => {
            node.items = [
                { text: "New Item A", showInner: true, innerText: "Inner A" },
                { text: "New Item B", showInner: true, innerText: "Inner B" },
                { text: "New Item C", showInner: false, innerText: "Inner C" },
            ];
        });

        await expect(items).toHaveCount(3);
        await expect(items.nth(0).locator(".item-text")).toContainText("New Item A");
        await expect(items.nth(0).locator(".inner-content")).toContainText("Inner A");
        await expect(items.nth(1).locator(".item-text")).toContainText("New Item B");
        await expect(items.nth(1).locator(".inner-content")).toContainText("Inner B");
        await expect(items.nth(2).locator(".item-text")).toContainText("New Item C");
        await expect(
            items.nth(2).locator("span").filter({ hasText: "Inner when not rendered" }),
        ).toBeVisible();
    });

    test("should toggle inner when by replacing items with swapped showInner values", async ({
        page,
    }) => {
        await page.goto("/fixtures/nested-elements/");

        const element = page.locator("when-repeat-element");
        const items = element.locator(".item");

        // Initial state: item 1 showInner=true, item 2 showInner=false
        await expect(items.nth(0).locator(".inner-content")).toBeVisible();
        await expect(items.nth(1).locator(".inner-content")).toHaveCount(0);
        await expect(
            items.nth(1).locator("span").filter({ hasText: "Inner when not rendered" }),
        ).toBeVisible();

        // Swap showInner values
        await element.evaluate((node: any) => {
            node.items = [
                { text: "Item 1", showInner: false, innerText: "Inner 1" },
                { text: "Item 2", showInner: true, innerText: "Inner 2" },
            ];
        });

        // Item 1 now has showInner=false
        await expect(items.nth(0).locator(".inner-content")).toHaveCount(0);
        await expect(
            items.nth(0).locator("span").filter({ hasText: "Inner when not rendered" }),
        ).toBeVisible();

        // Item 2 now has showInner=true
        await expect(items.nth(1).locator(".inner-content")).toBeVisible();
        await expect(
            items.nth(1).locator("span").filter({ hasText: "Inner when not rendered" }),
        ).toHaveCount(0);
    });
});
