import { expect, test } from "@playwright/test";

test.describe.skip("f-template dot-syntax bindings", async () => {
    test("create a object property reference using dot syntax in a binding", async ({ page }) => {
        await page.goto("/dot-syntax");

        const customElement = await page.locator("test-element");

        await expect(customElement.locator("span").nth(0)).toHaveText("bar");
    });

    test("should display initial property values correctly", async ({ page }) => {
        await page.goto("/dot-syntax");

        const customElement = await page.locator("test-element");

        // Check initial values
        await expect(customElement.locator("span").nth(0)).toHaveText("bar");
        await expect(customElement.locator("span").nth(1)).toHaveText("");
        await expect(customElement.locator("span").nth(2)).toHaveText("FOO");
    });

    test("should update object.b when 'Set b' button is clicked", async ({ page }) => {
        await page.goto("/dot-syntax");

        const customElement = await page.locator("test-element");
        const setBButton = customElement.locator("button").nth(0);
        const bSpan = customElement.locator("span").nth(0);

        // Verify initial state
        await expect(bSpan).toHaveText("bar");

        // Click the "Set b" button
        await setBButton.click();

        // Verify the value updated
        await expect(bSpan).toHaveText("Hello");
    });

    test("should update object.a.b1 when 'Set a.b1' button is clicked", async ({ page }) => {
        await page.goto("/dot-syntax");

        const customElement = await page.locator("test-element");
        const setAB1Button = customElement.locator("button").nth(1);
        const ab1Span = customElement.locator("span").nth(1);

        // Verify initial state (should be empty/undefined)
        await expect(ab1Span).toHaveText("");

        // Click the "Set a.b1" button
        await setAB1Button.click();

        // Verify the value updated
        await expect(ab1Span).toHaveText("World");
    });

    test("should update object.a.b2.c when 'Set a.b2.c' button is clicked", async ({ page }) => {
        await page.goto("/dot-syntax");

        const customElement = await page.locator("test-element");
        const setAB2CButton = customElement.locator("button").nth(2);
        const ab2cSpan = customElement.locator("span").nth(2);

        // Click the "Set a.b2.c" button
        await setAB2CButton.click();

        // Verify the value updated
        await expect(ab2cSpan).toHaveText("Pluto");
    });

    test("should handle multiple property updates independently", async ({ page }) => {
        await page.goto("/dot-syntax");

        const customElement = await page.locator("test-element");
        const setBButton = customElement.locator("button").nth(0);
        const setAB1Button = customElement.locator("button").nth(1);
        const setAB2CButton = customElement.locator("button").nth(2);

        const bSpan = customElement.locator("span").nth(0);
        const ab1Span = customElement.locator("span").nth(1);
        const ab2cSpan = customElement.locator("span").nth(2);

        // Update multiple properties
        await setBButton.click();
        await setAB1Button.click();
        await setAB2CButton.click();

        // Verify all values are updated correctly
        await expect(bSpan).toHaveText("Hello");
        await expect(ab1Span).toHaveText("World");
        await expect(ab2cSpan).toHaveText("Pluto");
    });

    test("should maintain property values after multiple clicks", async ({ page }) => {
        await page.goto("/dot-syntax");

        const customElement = await page.locator("test-element");
        const setBButton = customElement.locator("button").nth(0);
        const bSpan = customElement.locator("span").nth(0);

        // Click multiple times to ensure consistency
        await setBButton.click();
        await expect(bSpan).toHaveText("Hello");

        await setBButton.click();
        await expect(bSpan).toHaveText("Hello"); // Should remain the same

        await setBButton.click();
        await expect(bSpan).toHaveText("Hello"); // Should still be the same
    });

    test("should update nested properties correctly", async ({ page }) => {
        await page.goto("/dot-syntax");

        const customElement = await page.locator("test-element");
        const setAB1Button = customElement.locator("button").nth(1);
        const setAB2CButton = customElement.locator("button").nth(2);

        const ab1Span = customElement.locator("span").nth(1);
        const ab2cSpan = customElement.locator("span").nth(2);

        // Test nested property updates
        await setAB1Button.click();
        await expect(ab1Span).toHaveText("World");

        await setAB2CButton.click();
        await expect(ab2cSpan).toHaveText("Pluto");

        // Verify both nested properties coexist
        await expect(ab1Span).toHaveText("World");
        await expect(ab2cSpan).toHaveText("Pluto");
    });

    test("should have correct button labels", async ({ page }) => {
        await page.goto("/dot-syntax");

        const customElement = await page.locator("test-element");

        // Verify button labels
        await expect(customElement.locator("button").nth(0)).toHaveText("Set b");
        await expect(customElement.locator("button").nth(1)).toHaveText("Set a.b1");
        await expect(customElement.locator("button").nth(2)).toHaveText("Set a.b2.c");
    });

    test("should reflect property changes in DOM immediately", async ({ page }) => {
        await page.goto("/dot-syntax");

        const customElement = await page.locator("test-element");
        const setBButton = customElement.locator("button").nth(0);
        const bSpan = customElement.locator("span").nth(0);

        // Verify immediate DOM update without additional waiting
        await setBButton.click();

        // Should update immediately due to reactive system
        await expect(bSpan).toHaveText("Hello", { timeout: 1000 });
    });
});
