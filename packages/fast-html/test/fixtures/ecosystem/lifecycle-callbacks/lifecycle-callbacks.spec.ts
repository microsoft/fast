import { expect, test } from "@playwright/test";

test.describe("Lifecycle Callbacks", async () => {
    test("should invoke all lifecycle callbacks in correct order for simple element", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/lifecycle-callbacks/");
        await hydrationCompleted;

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        // Verify callbacks for simple-element were called
        const simpleElementEvents = events.filter(
            (e: any) => e.name === "simple-element",
        );

        expect(simpleElementEvents.length).toBeGreaterThan(0);

        // Check that callbacks were called in the correct order
        const callbackOrder = simpleElementEvents.map((e: any) => e.callback);

        expect(callbackOrder).toContain("elementDidRegister");
        expect(callbackOrder).toContain("templateWillUpdate");
        expect(callbackOrder).toContain("templateDidUpdate");
        expect(callbackOrder).toContain("elementDidDefine");

        // Verify the order is correct
        const registerIndex = callbackOrder.indexOf("elementDidRegister");
        const willUpdateIndex = callbackOrder.indexOf("templateWillUpdate");
        const didUpdateIndex = callbackOrder.indexOf("templateDidUpdate");
        const defineIndex = callbackOrder.indexOf("elementDidDefine");

        expect(registerIndex).toBeLessThan(willUpdateIndex);
        expect(willUpdateIndex).toBeLessThan(didUpdateIndex);
        expect(didUpdateIndex).toBeLessThan(defineIndex);
    });

    test("should invoke callbacks for multiple elements", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/lifecycle-callbacks/");
        await hydrationCompleted;

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        // Check that callbacks were invoked for all elements
        const elementNames = new Set(events.map((e: any) => e.name));

        expect(elementNames.has("simple-element")).toBe(true);
        expect(elementNames.has("complex-element")).toBe(true);
        expect(elementNames.has("nested-element")).toBe(true);
    });

    test("should invoke hydrationComplete callback after all elements hydrate", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/lifecycle-callbacks/");
        const hydrationComplete = await hydrationCompleted;

        expect(hydrationComplete).toBeTruthy();

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        // Verify hydrationComplete callback was invoked
        const hydrationCompleteEvents = events.filter(
            (e: any) => e.callback === "hydrationComplete",
        );
        expect(hydrationCompleteEvents.length).toBe(1);

        // Verify hydrationComplete is the last callback
        const hydrationCompleteIndex = events.findIndex(
            (e: any) => e.callback === "hydrationComplete",
        );

        expect(hydrationCompleteIndex).toBe(events.length - 1);
    });

    test("should handle complex element with observer map", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/lifecycle-callbacks/");
        await hydrationCompleted;

        const complexElement = await page.locator("complex-element");

        // Verify the element has hydrated correctly
        await expect(complexElement).toHaveText(/Complex/);

        const events = await page.evaluate(() => (window as any).lifecycleEvents);
        const complexEvents = events.filter((e: any) => e.name === "complex-element");

        // Complex element should have all lifecycle callbacks
        expect(complexEvents.length).toBeGreaterThan(0);
        expect(complexEvents.some((e: any) => e.callback === "elementDidDefine")).toBe(
            true,
        );
    });

    test("should handle nested elements correctly", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/lifecycle-callbacks/");
        await hydrationCompleted;

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        // Both parent complex-element and nested nested-element should have callbacks
        const complexEvents = events.filter((e: any) => e.name === "complex-element");
        const nestedEvents = events.filter((e: any) => e.name === "nested-element");

        expect(complexEvents.length).toBeGreaterThan(0);
        expect(nestedEvents.length).toBeGreaterThan(0);

        // Both should have been defined
        expect(complexEvents.some((e: any) => e.callback === "elementDidDefine")).toBe(
            true,
        );
        expect(nestedEvents.some((e: any) => e.callback === "elementDidDefine")).toBe(
            true,
        );
    });

    test("should verify template callbacks are invoked for all elements", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/lifecycle-callbacks/");
        await hydrationCompleted;

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        // For each element, verify both template and hydration callbacks are invoked
        // Note: These callbacks can be interleaved as template processing is async
        const elementNames = ["simple-element", "complex-element", "nested-element"];

        elementNames.forEach(name => {
            const elementEvents = events.filter((e: any) => e.name === name);
            const callbacks = elementEvents.map((e: any) => e.callback);

            // Verify all expected callbacks were invoked
            expect(callbacks).toContain("elementDidRegister");
            expect(callbacks).toContain("templateWillUpdate");
            expect(callbacks).toContain("templateDidUpdate");
            expect(callbacks).toContain("elementDidDefine");

            // Verify template callbacks are in order
            const registerIndex = callbacks.indexOf("elementDidRegister");
            const willUpdateIndex = callbacks.indexOf("templateWillUpdate");
            const didUpdateIndex = callbacks.indexOf("templateDidUpdate");
            const defineIndex = callbacks.indexOf("elementDidDefine");

            expect(registerIndex).toBeLessThan(willUpdateIndex);
            expect(willUpdateIndex).toBeLessThan(didUpdateIndex);
            expect(didUpdateIndex).toBeLessThan(defineIndex);
        });
    });

    test("should properly hydrate elements and maintain functionality", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/lifecycle-callbacks/");
        await hydrationCompleted;

        const simpleElement = await page.locator("simple-element");
        const complexElement = await page.locator("complex-element");

        // Verify simple element displays correctly
        await expect(simpleElement).toHaveText("Hello World");

        // Verify complex element displays correctly
        await expect(complexElement).toHaveText(/Complex/);

        // Verify elements are interactive after hydration
        const currentCount = await complexElement.evaluate((el: any) => el.count);
        expect(currentCount).toBe(0);

        // Interact with the element
        await complexElement.evaluate((el: any) => el.increment());

        const newCount = await complexElement.evaluate((el: any) => el.count);
        expect(newCount).toBe(1);
    });
});
