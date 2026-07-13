import { expect, type Locator, test } from "@playwright/test";

test.describe("f-template", () => {
    let element: Locator;
    test.beforeEach(async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/slotted/");
        await hydrationCompleted;
        element = page.locator("test-element");
    });

    test("create a slotted directive", async () => {
        await expect(element).toHaveJSProperty("classList.length", 2);

        await element.evaluate(node => {
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

    test("a single slotted node is assigned when the single option is used", async () => {
        const result = await element.evaluate((node: any) => ({
            isArray: Array.isArray(node.slottedSingleNode),
            tagName: node.slottedSingleNode ? node.slottedSingleNode.tagName : null,
        }));

        expect(result.isArray).toBe(false);
        expect(result.tagName).toBe("BUTTON");
    });

    test("an empty slot assigns null and notifies when the single option is used", async () => {
        const result = await element.evaluate((node: any) => ({
            isNull: node.slottedEmptyNode === null,
            notified: (window as any).slottedEmptyNodeNotified === true,
        }));

        expect(result.isNull).toBe(true);
        expect(result.notified).toBe(true);
    });
});
