import { expect, test } from "@playwright/test";

test.describe("f-when with event binding", async () => {
    test("event binding inside f-when should fire after hydration", async ({ page }) => {
        await page.goto("/fixtures/when-event/");

        const customElement = page.locator("#when-event-show");

        // Button should be visible (SSR rendered, condition true)
        const button = customElement.locator("button");
        await expect(button).toHaveText("Click me");

        // Click the button - event binding should work
        await button.click();

        // Verify the click handler fired
        await expect(customElement).toHaveJSProperty("clickCount", 1);

        // Click again to confirm repeated clicks work
        await button.click();
        await expect(customElement).toHaveJSProperty("clickCount", 2);
    });

    test("f-when with false condition should not create content during hydration", async ({ page }) => {
        await page.goto("/fixtures/when-event/");

        const customElement = page.locator("#when-event-hide");

        // No button should exist (SSR condition was false)
        const button = customElement.locator("button");
        await expect(button).toHaveCount(0);

        // Element should hydrate without errors
        await expect(customElement).toHaveJSProperty("clickCount", 0);
    });

    test("should respect client-side false value even when server rendered content", async ({
        page,
    }) => {
        await page.goto("/fixtures/when-event/");

        const element = page.locator("#false-prop");

        // The property is explicitly false on the client element class
        await expect(element).toHaveJSProperty("someprop", false);

        // After hydration, content should NOT be visible because someprop is false.
        // The server rendered "anything, really" because it had someprop=true,
        // but the client value is false, so the content should be removed.
        await expect(element).not.toHaveText("anything, really");
    });
});
