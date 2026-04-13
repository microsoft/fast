import { expect, test } from "@playwright/test";
import type { ItemList } from "./main.js";

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

    test("should pass parent attribute to child elements", async ({ page }) => {
        await page.goto("/fixtures/nested-elements/");

        const parentElements = page.locator("parent-element");
        const firstParent = parentElements.nth(0);
        const childElements = firstParent.locator("child-element");

        const childCount = await childElements.count();
        expect(childCount).toBeGreaterThan(0);

        for (let i = 0; i < childCount; i++) {
            const categoryText = childElements.nth(i).locator(".category");
            await expect(categoryText).toHaveText("General");
        }

        await firstParent.evaluate((node: ItemList) => {
            node.category = "Updated";
        });

        for (let i = 0; i < childCount; i++) {
            const categoryText = childElements.nth(i).locator(".category");
            await expect(categoryText).toHaveText("Updated");
        }
    });
});
