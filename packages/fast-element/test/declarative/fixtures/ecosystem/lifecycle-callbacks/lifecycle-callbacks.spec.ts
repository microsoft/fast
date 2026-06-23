import { expect, test } from "@playwright/test";

async function waitForPromiseAPIs(page: import("@playwright/test").Page): Promise<void> {
    const hydrationCompleted = page.waitForFunction(
        () => (window as any).hydrationCompleted === true,
    );

    await page.goto("/fixtures/ecosystem/lifecycle-callbacks/");
    await hydrationCompleted;
}

test.describe("Promise APIs", async () => {
    test("resolves whenHydrated after the active hydration batch", async ({ page }) => {
        await waitForPromiseAPIs(page);

        const events = await page.evaluate(() => (window as any).promiseEvents);
        const hydrationEvents = events.filter((e: any) => e.promise === "whenHydrated");

        expect(hydrationEvents).toHaveLength(1);
        expect(events.at(-1).promise).toBe("whenHydrated");
    });

    test("should handle complex element with observer map", async ({ page }) => {
        await waitForPromiseAPIs(page);

        const complexElement = await page.locator("complex-element");
        await expect(complexElement).toHaveText(/Complex/);
    });

    test("should handle nested elements correctly", async ({ page }) => {
        await waitForPromiseAPIs(page);

        const events = await page.evaluate(() => (window as any).promiseEvents);

        expect(events.some((e: any) => e.promise === "whenHydrated")).toBe(true);
    });

    test("should properly hydrate elements and maintain functionality", async ({
        page,
    }) => {
        await waitForPromiseAPIs(page);

        const simpleElement = await page.locator("simple-element");
        const complexElement = await page.locator("complex-element");

        await expect(simpleElement).toHaveText("Hello World");
        await expect(complexElement).toHaveText(/Complex/);

        const currentCount = await complexElement.evaluate((el: any) => el.count);
        expect(currentCount).toBe(0);

        await complexElement.evaluate((el: any) => el.increment());

        const newCount = await complexElement.evaluate((el: any) => el.count);
        expect(newCount).toBe(1);
    });
});
