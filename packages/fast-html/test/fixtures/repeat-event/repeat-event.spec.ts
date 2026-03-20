import { expect, test } from "@playwright/test";
import type { TestElementRepeatEvent } from "./main.js";

test.describe("f-repeat event binding", async () => {
    test("event handler inside f-repeat should have host element as this", async ({
        page,
    }) => {
        await page.goto("/fixtures/repeat-event/");

        const customElement = page.locator("test-element-repeat-event");
        const buttons = customElement.locator("button");

        // Verify initial empty state (matches other repeat tests)
        await expect(buttons).toHaveCount(0);

        // Dynamically populate items so the repeat renders buttons
        await customElement.evaluate((node: TestElementRepeatEvent) => {
            node.items = [{ name: "Alpha" }, { name: "Beta" }];
        });

        await expect(buttons).toHaveCount(2);

        // Click the first button — the handler sets this.clickedItemName
        // via e.currentTarget.textContent. If `this` were bound to the
        // repeat item instead of the host, this property would not be
        // set on the host element.
        await buttons.nth(0).click();

        await expect(customElement).toHaveJSProperty(
            "clickedItemName",
            "Alpha"
        );
    });
});
