import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create an event attribute without arguments", async ({ page }) => {
        await page.goto("/event");

        const customElement = await page.locator("test-element");

        let message;
        await page.on("console", msg => message = msg.text());

        await customElement.locator("button").nth(0).click();

        expect(message).toEqual("no args");
    });
    test("create an event attribute with an event argument", async ({ page }) => {
        await page.goto("/event");

        const customElement = await page.locator("test-element");

        let message;
        await page.on("console", msg => message = msg.text());

        await customElement.locator("button").nth(1).click();

        expect(message).toEqual("click");
    });
    test("create an event attribute with an attribute argument", async ({ page }) => {
        await page.goto("/event");

        const customElement = await page.locator("test-element");

        let message;
        await page.on("console", msg => message = msg.text());

        await customElement.locator("button").nth(2).click();

        expect(message).toEqual("bar");
    });
    test("should properly bind events with `this`", async ({ page }) => {
        await page.goto("/event");

        const customElement = await page.locator("test-element");

        await expect(customElement).toHaveJSProperty("foo", "bar");

        await customElement.locator("button").nth(3).click();

        await expect(customElement).toHaveJSProperty("foo", "modified-by-click");
    });
});
