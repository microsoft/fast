import { expect, test } from "@playwright/test";
import type {
    ItemList,
    TestElementRepeatEvent,
    TestWhenInRepeat,
} from "./main.js";

test.describe("Nested Elements Hydration", () => {
    test("should render nested elements correctly", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/scenarios/nested-elements/");
        await hydrationCompleted;

        const messages = (await page.evaluate("window.messages")) as string[];

        // Verify elements were defined
        const parentDefined = messages.some(message =>
            message.startsWith("Element did define: parent-element"),
        );
        const childDefined = messages.some(message =>
            message.startsWith("Element did define: child-element"),
        );

        expect(parentDefined).toBe(true);
        expect(childDefined).toBe(true);

        // Verify hydration completed
        const hydrationComplete = messages.some(message =>
            message.startsWith("Hydration complete"),
        );
        expect(hydrationComplete).toBe(true);
    });

    test("should pass parent attribute to child elements", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/scenarios/nested-elements/");
        await hydrationCompleted;

        const parentElements = page.locator("parent-element");
        const firstParent = parentElements.nth(0);
        const childElements = firstParent.locator("child-element");

        const childCount = await childElements.count();
        expect(childCount).toBeGreaterThan(0);

        // Each child receives the parent's category as an attribute
        for (let i = 0; i < childCount; i++) {
            await expect(childElements.nth(i)).toHaveAttribute("category", "General");
        }

        // Grand-child-element renders the category passed from parent → child → grand-child
        const grandChildren = firstParent.locator("grand-child-element");
        for (let i = 0; i < childCount; i++) {
            const categoryText = grandChildren.nth(i).locator(".category");
            await expect(categoryText).toHaveText("General");
        }

        await firstParent.evaluate((node: ItemList) => {
            node.category = "Updated";
        });

        // Child attributes propagate the updated value
        for (let i = 0; i < childCount; i++) {
            await expect(childElements.nth(i)).toHaveAttribute("category", "Updated");
        }

        // Grand-child-element renders the updated category
        for (let i = 0; i < childCount; i++) {
            const categoryText = grandChildren.nth(i).locator(".category");
            await expect(categoryText).toHaveText("Updated");
        }
    });
});

test.describe("f-repeat event binding", async () => {
    test("event handler inside f-repeat should have host element as this", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/scenarios/nested-elements/");
        await hydrationCompleted;

        const customElement = page.locator("test-element-repeat-event");
        const buttons = customElement.locator("button");

        // Verify initial empty state (matches other repeat tests)
        await expect(buttons).toHaveCount(0);

        // Dynamically populate items so the repeat renders buttons
        await customElement.evaluate((node: TestElementRepeatEvent) => {
            node.repeatEventItems = [{ name: "Alpha" }, { name: "Beta" }];
        });

        await expect(buttons).toHaveCount(2);

        // Click the first button — the handler sets this.clickedItemName
        // via e.currentTarget.textContent. If `this` were bound to the
        // repeat item instead of the host, this property would not be
        // set on the host element.
        await buttons.nth(0).click();

        await expect(customElement).toHaveJSProperty("clickedItemName", "Alpha");
    });

    test("f-when with c.parent condition inside f-repeat", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/scenarios/nested-elements/");
        await hydrationCompleted;

        const el = page.locator("test-when-in-repeat");
        const buttons = el.locator("button.name");

        // Items pre-rendered, showNames defaults to true
        await expect(buttons).toHaveCount(2);
        await expect(buttons.nth(0)).toHaveText("Alpha");
        await expect(buttons.nth(1)).toHaveText("Beta");

        // Click a button — handler should set clickedItemName on the host
        await buttons.nth(1).click();
        await expect(el).toHaveJSProperty("clickedItemName", "Beta");

        // Toggle showNames to false — buttons should disappear
        await el.evaluate((node: TestWhenInRepeat) => {
            node.showNames = false;
        });
        await expect(buttons).toHaveCount(0);

        // Toggle back — buttons should reappear and still work
        await el.evaluate((node: TestWhenInRepeat) => {
            node.showNames = true;
        });
        await expect(buttons).toHaveCount(2);
        await buttons.nth(0).click();
        await expect(el).toHaveJSProperty("clickedItemName", "Alpha");
    });
});
