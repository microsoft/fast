import { expect, test } from "@playwright/test";
import type { TestElementRepeatEvent, TestWhenInRepeat } from "./main.js";

test.describe("f-repeat event binding", async () => {
    test("event handler inside f-repeat should have host element as this", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/repeat-event/");
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
        await page.goto("/fixtures/repeat-event/");
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
