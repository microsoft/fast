import { expect, type Locator, test } from "@playwright/test";

test.describe("f-template", () => {
    let element: Locator;
    test.beforeEach(async ({ page }) => {
        await page.goto("/fixtures/slotted/");
        element = page.locator("test-element");
    });

    test("create a slotted directive", async () => {
        await expect(element).toHaveJSProperty("classList.length", 2);

        await element.evaluate((node) => {
            const newElement = document.createElement("button");
            newElement.slot = "foo";
            node.append(newElement);
        });

        await expect(element).toHaveJSProperty("classList.length", 3);
    });

    test("slotted nodes are filtered by elements()", async () => {
        await expect(element).toHaveJSProperty("slottedNodes.length", 1);
    });

    test("slotted nodes are filtered by elements() with query", async () => {
        await expect(element).toHaveJSProperty("slottedBarNodes.length", 1);
    });
});
