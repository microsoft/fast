import { expect, test } from "@playwright/test";

test.describe("f-when with explicit false property during hydration", async () => {
    test("should respect client-side false value even when server rendered content", async ({
        page,
    }) => {
        await page.goto("/fixtures/when-false-explicit/");

        const element = page.locator("#false-prop");

        // The property is explicitly false on the client element class
        await expect(element).toHaveJSProperty("someprop", false);

        // After hydration, content should NOT be visible because someprop is false.
        // The server rendered "anything, really" because it had someprop=true,
        // but the client value is false, so the content should be removed.
        await expect(element).not.toHaveText("anything, really");
    });
});
