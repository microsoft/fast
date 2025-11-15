import { expect, test } from "@playwright/test";

test.describe("Lifecycle Callbacks", async () => {
    test("should invoke all lifecycle callbacks in correct order for simple element", async ({
        page,
    }) => {
        await page.goto("/fixtures/lifecycle-callbacks/");

        // Wait for hydration to complete
        await page.waitForFunction(() => (window as any).getHydrationCompleteStatus());

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        // Verify callbacks for simple-element were called
        const simpleElementEvents = events.filter(
            (e: any) => e.name === "simple-element"
        );

        expect(simpleElementEvents.length).toBeGreaterThan(0);

        // Check that callbacks were called in the correct order
        const callbackOrder = simpleElementEvents.map((e: any) => e.callback);

        expect(callbackOrder).toContain("elementDidRegister");
        expect(callbackOrder).toContain("templateWillUpdate");
        expect(callbackOrder).toContain("templateDidUpdate");
        expect(callbackOrder).toContain("elementDidDefine");
        expect(callbackOrder).toContain("elementWillHydrate");
        expect(callbackOrder).toContain("elementDidHydrate");

        // Verify the order is correct
        const registerIndex = callbackOrder.indexOf("elementDidRegister");
        const willUpdateIndex = callbackOrder.indexOf("templateWillUpdate");
        const didUpdateIndex = callbackOrder.indexOf("templateDidUpdate");
        const defineIndex = callbackOrder.indexOf("elementDidDefine");
        const willHydrateIndex = callbackOrder.indexOf("elementWillHydrate");
        const didHydrateIndex = callbackOrder.indexOf("elementDidHydrate");

        expect(registerIndex).toBeLessThan(willUpdateIndex);
        expect(willUpdateIndex).toBeLessThan(didUpdateIndex);
        expect(didUpdateIndex).toBeLessThan(defineIndex);
        expect(willHydrateIndex).toBeGreaterThan(-1);
        expect(didHydrateIndex).toBeGreaterThan(willHydrateIndex);
    });

    test("should invoke callbacks for multiple elements", async ({ page }) => {
        await page.goto("/fixtures/lifecycle-callbacks/");

        await page.waitForFunction(() => (window as any).getHydrationCompleteStatus());

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        // Check that callbacks were invoked for all elements
        const elementNames = new Set(events.map((e: any) => e.name));

        expect(elementNames.has("simple-element")).toBe(true);
        expect(elementNames.has("complex-element")).toBe(true);
        expect(elementNames.has("nested-element")).toBe(true);
    });

    test("should invoke elementWillHydrate before hydration", async ({ page }) => {
        await page.goto("/fixtures/lifecycle-callbacks/");

        await page.waitForFunction(() => (window as any).getHydrationCompleteStatus());

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        const willHydrateEvents = events.filter(
            (e: any) => e.callback === "elementWillHydrate"
        );
        const didHydrateEvents = events.filter(
            (e: any) => e.callback === "elementDidHydrate"
        );

        // Every elementWillHydrate should be followed by elementDidHydrate for the same element
        willHydrateEvents.forEach((willEvent: any) => {
            const correspondingDidEvent = didHydrateEvents.find(
                (e: any) => e.name === willEvent.name
            );
            expect(correspondingDidEvent).toBeDefined();
        });
    });

    test("should invoke hydrationComplete callback after all elements hydrate", async ({
        page,
    }) => {
        await page.goto("/fixtures/lifecycle-callbacks/");

        const hydrationComplete = await page.waitForFunction(
            () => (window as any).getHydrationCompleteStatus(),
            { timeout: 5000 }
        );

        expect(hydrationComplete).toBeTruthy();

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        // Verify hydrationComplete callback was invoked
        const hydrationCompleteEvents = events.filter(
            (e: any) => e.callback === "hydrationComplete"
        );
        expect(hydrationCompleteEvents.length).toBe(1);

        // Verify all elements are hydrated
        const simpleElement = await page.locator("simple-element");
        const complexElement = await page.locator("complex-element");
        const nestedElement = await page.locator("nested-element");

        await expect(simpleElement).not.toHaveAttribute("needs-hydration");
        await expect(complexElement).not.toHaveAttribute("needs-hydration");
        await expect(nestedElement).not.toHaveAttribute("needs-hydration");

        // Verify hydrationComplete was called AFTER all individual element hydrations
        const lastElementDidHydrateIndex = events.reduce((maxIndex: number, e: any, index: number) => {
            return e.callback === "elementDidHydrate" ? index : maxIndex;
        }, -1);

        const hydrationCompleteIndex = events.findIndex(
            (e: any) => e.callback === "hydrationComplete"
        );

        expect(hydrationCompleteIndex).toBeGreaterThan(lastElementDidHydrateIndex);
    });

    test("should handle complex element with observer map", async ({ page }) => {
        await page.goto("/fixtures/lifecycle-callbacks/");

        await page.waitForFunction(() => (window as any).getHydrationCompleteStatus());

        const complexElement = await page.locator("complex-element");

        // Verify the element has hydrated correctly
        await expect(complexElement).toHaveText(/Complex/);
        await expect(complexElement).not.toHaveAttribute("needs-hydration");

        const events = await page.evaluate(() => (window as any).lifecycleEvents);
        const complexEvents = events.filter((e: any) => e.name === "complex-element");

        // Complex element should have all lifecycle callbacks
        expect(complexEvents.length).toBeGreaterThan(0);
        expect(complexEvents.some((e: any) => e.callback === "elementDidHydrate")).toBe(
            true
        );
    });

    test("should handle nested elements correctly", async ({ page }) => {
        await page.goto("/fixtures/lifecycle-callbacks/");

        await page.waitForFunction(() => (window as any).getHydrationCompleteStatus());

        const events = await page.evaluate(() => (window as any).lifecycleEvents);

        // Both parent complex-element and nested nested-element should have callbacks
        const complexEvents = events.filter((e: any) => e.name === "complex-element");
        const nestedEvents = events.filter((e: any) => e.name === "nested-element");

        expect(complexEvents.length).toBeGreaterThan(0);
        expect(nestedEvents.length).toBeGreaterThan(0);

        // Both should have hydrated
        expect(complexEvents.some((e: any) => e.callback === "elementDidHydrate")).toBe(
            true
        );
        expect(nestedEvents.some((e: any) => e.callback === "elementDidHydrate")).toBe(
            true
        );
    });

    test("should handle deferred hydration element", async ({ page }) => {
        await page.goto("/fixtures/lifecycle-callbacks/");

        // The deferred element has a prepare() method that delays hydration
        await page.waitForFunction(() => (window as any).getHydrationCompleteStatus(), {
            timeout: 5000,
        });

        const events = await page.evaluate(() => (window as any).lifecycleEvents);
        const deferredEvents = events.filter((e: any) => e.name === "deferred-element");

        // Should have hydration callbacks
        expect(deferredEvents.some((e: any) => e.callback === "elementWillHydrate")).toBe(
            true
        );
        expect(deferredEvents.some((e: any) => e.callback === "elementDidHydrate")).toBe(
            true
        );

        const deferredElement = await page.locator("deferred-element");
        await expect(deferredElement).not.toHaveAttribute("needs-hydration");
        await expect(deferredElement).not.toHaveAttribute("defer-hydration");
    });

    test("should verify template and hydration callbacks are invoked", async ({
        page,
    }) => {
        await page.goto("/fixtures/lifecycle-callbacks/");

        await page.waitForFunction(() => (window as any).getHydrationCompleteStatus());

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
            expect(callbacks).toContain("elementWillHydrate");
            expect(callbacks).toContain("elementDidHydrate");

            // Verify hydration callbacks are in order
            const willHydrateIndex = callbacks.indexOf("elementWillHydrate");
            const didHydrateIndex = callbacks.indexOf("elementDidHydrate");
            expect(willHydrateIndex).toBeLessThan(didHydrateIndex);

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
        await page.goto("/fixtures/lifecycle-callbacks/");

        await page.waitForFunction(() => (window as any).getHydrationCompleteStatus());

        const simpleElement = await page.locator("simple-element");
        const complexElement = await page.locator("complex-element");

        // Verify simple element displays correctly
        await expect(simpleElement).toHaveText("Hello World");

        // Verify complex element displays correctly
        await expect(complexElement).toHaveText(/Complex/);

        // Verify elements are interactive after hydration
        const currentCount = await complexElement.evaluate(
            (el: any) => el.count
        );
        expect(currentCount).toBe(0);

        // Interact with the element
        await complexElement.evaluate((el: any) => el.increment());

        const newCount = await complexElement.evaluate((el: any) => el.count);
        expect(newCount).toBe(1);
    });
});
