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

    test("should fire template lifecycle callbacks without hydration", async ({
        page,
    }) => {
        const allDefined = page.waitForFunction(
            () => (window as any).allDefined === true,
        );
        await page.goto("/fixtures/ecosystem/declarative-no-hydration/");
        await allDefined;

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        const basicEvents = events.filter((e: any) => e.name === "basic-element");
        const counterEvents = events.filter((e: any) => e.name === "counter-element");

        // Both elements should have all template lifecycle callbacks
        for (const elementEvents of [basicEvents, counterEvents]) {
            const callbacks = elementEvents.map((e: any) => e.callback);

            expect(callbacks).toContain("elementDidRegister");
            expect(callbacks).toContain("templateWillUpdate");
            expect(callbacks).toContain("templateDidUpdate");
            expect(callbacks).toContain("elementDidDefine");

            // Verify ordering
            const registerIdx = callbacks.indexOf("elementDidRegister");
            const willUpdateIdx = callbacks.indexOf("templateWillUpdate");
            const didUpdateIdx = callbacks.indexOf("templateDidUpdate");
            const defineIdx = callbacks.indexOf("elementDidDefine");

            expect(registerIdx).toBeLessThan(willUpdateIdx);
            expect(willUpdateIdx).toBeLessThan(didUpdateIdx);
            expect(didUpdateIdx).toBeLessThan(defineIdx);
        }
    });

    test("should not fire hydration callbacks when enableHydration is not called", async ({
        page,
    }) => {
        const allDefined = page.waitForFunction(
            () => (window as any).allDefined === true,
        );
        await page.goto("/fixtures/ecosystem/declarative-no-hydration/");
        await allDefined;

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        // No hydration callbacks should exist
        const hydrationEvents = events.filter(
            (e: any) =>
                e.callback === "hydrationStarted" ||
                e.callback === "hydrationComplete" ||
                e.callback === "elementWillHydrate" ||
                e.callback === "elementDidHydrate",
        );

        expect(hydrationEvents).toHaveLength(0);
    });

    test("isPrerendered should resolve false without hydration", async ({ page }) => {
        const allDefined = page.waitForFunction(
            () => (window as any).allDefined === true,
        );
        await page.goto("/fixtures/ecosystem/declarative-no-hydration/");
        await allDefined;

        const isPrerendered = await page.evaluate(async () => {
            const el = document.querySelector("basic-element") as any;
            return el.$fastController.isPrerendered;
        });

        expect(isPrerendered).toBe(false);
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
