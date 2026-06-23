import { expect, test } from "@playwright/test";

test.describe("Declarative Template Without Hydration", () => {
    test("should render elements client-side when enableHydration is not called", async ({
        page,
    }) => {
        const allDefined = page.waitForFunction(
            () => (window as any).allDefined === true,
        );
        await page.goto("/fixtures/ecosystem/declarative-no-hydration/");
        await allDefined;

        const basicElement = page.locator("basic-element");
        await expect(basicElement).toHaveText("Hi World");

        const counterElement = page.locator("counter-element");
        await expect(counterElement).toHaveText("Count: 0");
    });

    test("should resolve whenRegistered without hydration", async ({ page }) => {
        const allDefined = page.waitForFunction(
            () => (window as any).allDefined === true,
        );
        await page.goto("/fixtures/ecosystem/declarative-no-hydration/");
        await allDefined;

        const events = await page.evaluate(() => (window as any).promiseEvents);

        const registeredNames = new Set(
            events
                .filter((e: any) => e.promise === "whenRegistered")
                .map((e: any) => e.name),
        );

        expect(registeredNames.has("basic-element")).toBe(true);
        expect(registeredNames.has("counter-element")).toBe(true);
    });

    test("should not resolve whenHydrated when enableHydration is not called", async ({
        page,
    }) => {
        const allDefined = page.waitForFunction(
            () => (window as any).allDefined === true,
        );
        await page.goto("/fixtures/ecosystem/declarative-no-hydration/");
        await allDefined;

        const hydrationCompleted = await page.evaluate(
            () => (window as any).hydrationCompleted === true,
        );

        expect(hydrationCompleted).toBe(false);
    });

    test("isPrerendered should resolve true with DSD, isHydrated should resolve false without enableHydration", async ({
        page,
    }) => {
        const allDefined = page.waitForFunction(
            () => (window as any).allDefined === true,
        );
        await page.goto("/fixtures/ecosystem/declarative-no-hydration/");
        await allDefined;

        const result = await page.evaluate(async () => {
            const el = document.querySelector("basic-element") as any;
            return {
                isPrerendered: await el.$fastController.isPrerendered,
                isHydrated: await el.$fastController.isHydrated,
            };
        });

        expect(result.isPrerendered).toBe(true);
        expect(result.isHydrated).toBe(false);
    });

    test("should support interactivity after client-side render", async ({ page }) => {
        const allDefined = page.waitForFunction(
            () => (window as any).allDefined === true,
        );
        await page.goto("/fixtures/ecosystem/declarative-no-hydration/");
        await allDefined;

        const counterElement = page.locator("counter-element");
        await expect(counterElement).toHaveText("Count: 0");

        await counterElement.evaluate((el: any) => el.increment());
        await expect(counterElement).toHaveText("Count: 1");
    });
});
