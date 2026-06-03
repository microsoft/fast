import { expect, type Locator, type Page, test } from "@playwright/test";

async function gotoFixture(page: Page): Promise<Locator> {
    await page.goto("/fixtures/ecosystem/async-template-string/");
    await page.waitForFunction(() => (window as any).allDefined === true);

    return page.locator("async-template-card");
}

test.describe("Async Template String", () => {
    test("renders a dynamically imported template string", async ({ page }) => {
        const element = await gotoFixture(page);

        await expect(element.locator("h2")).toHaveText("Async string template");
        await expect(element.locator("#description")).toHaveText(
            "Loaded from an async template string.",
        );
        await expect(element.locator("#count")).toHaveText("Count: 0");
        await expect(element.locator("section")).toHaveAttribute(
            "data-message",
            "Async string template",
        );

        const callbackEvents = await page.evaluate(
            () => (window as any).templateCallbackEvents,
        );

        expect(callbackEvents).toEqual(["callback-start", "callback-resolved"]);
    });

    test("preserves lifecycle callbacks and interactivity", async ({ page }) => {
        const element = await gotoFixture(page);

        await element.locator("button").click();
        await expect(element.locator("#count")).toHaveText("Count: 1");

        const events = await page.evaluate(() => (window as any).lifecycleEvents);
        const callbacks = events
            .filter((event: any) => event.name === "async-template-card")
            .map((event: any) => event.callback);

        expect(callbacks).toContain("elementDidRegister");
        expect(callbacks).toContain("templateWillUpdate");
        expect(callbacks).toContain("templateDidUpdate");
        expect(callbacks).toContain("elementDidDefine");

        expect(callbacks.indexOf("elementDidRegister")).toBeLessThan(
            callbacks.indexOf("templateWillUpdate"),
        );
        expect(callbacks.indexOf("templateWillUpdate")).toBeLessThan(
            callbacks.indexOf("templateDidUpdate"),
        );
        expect(callbacks.indexOf("templateDidUpdate")).toBeLessThan(
            callbacks.indexOf("elementDidDefine"),
        );
    });
});
