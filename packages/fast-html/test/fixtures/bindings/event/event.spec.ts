import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create an event attribute without arguments", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/event/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");

        let message;
        page.on("console", msg => (message = msg.text()));

        await customElement.locator("button").nth(0).click();

        expect(message).toEqual("no args");
    });
    test("create an event attribute with an event argument (deprecated e)", async ({
        page,
    }) => {
        const warnings: string[] = [];
        page.on("console", msg => {
            if (msg.type() === "warning") {
                warnings.push(msg.text());
            }
        });

        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/event/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");

        let message;
        page.on("console", msg => (message = msg.text()));

        await customElement.locator("button").nth(1).click();

        expect(message).toEqual("click");

        // The deprecation warning should include the component name
        const deprecationWarnings = warnings.filter(w => w.includes("deprecated"));
        expect(deprecationWarnings).toHaveLength(1);
        expect(deprecationWarnings[0]).toContain('"test-element"');
    });
    test("should properly bind events with `this`", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/event/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");

        await expect(customElement).toHaveJSProperty("foo", "bar");

        await customElement.locator("button").nth(2).click();

        await expect(customElement).toHaveJSProperty("foo", "modified-by-click");
    });
    test("create an event attribute with $e argument", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/event/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");

        let message;
        page.on("console", msg => (message = msg.text()));

        await customElement.locator("button").nth(3).click();

        expect(message).toEqual("click");
    });
    test("create an event attribute with $c (context) argument", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/event/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");

        let message;
        page.on("console", msg => (message = msg.text()));

        await customElement.locator("button").nth(4).click();

        expect(message).toEqual("click");
    });
    test("create an event attribute with multiple arguments ($e, $c)", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/event/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");

        let message;
        page.on("console", msg => (message = msg.text()));

        await customElement.locator("button").nth(5).click();

        expect(message).toEqual("click,click");
    });
    test("create an event attribute with $c.event argument", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/event/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");

        let message;
        page.on("console", msg => (message = msg.text()));

        await customElement.locator("button").nth(6).click();

        expect(message).toEqual("click");
    });
});
