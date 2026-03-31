import { expect, test } from "@playwright/test";

test.describe("AttributeMap", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/fixtures/attribute-map/");
        await page.waitForSelector("attribute-map-test-element");
    });

    test("should define @attr for a simple leaf property", async ({ page }) => {
        const element = page.locator("attribute-map-test-element");

        const hasFoo = await element.evaluate(node => {
            return (window as any).Observable.getAccessors(
                Object.getPrototypeOf(node),
            ).some((a: any) => a.name === "foo");
        });

        expect(hasFoo).toBeTruthy();
    });

    test("should define @attr for a camelCase property", async ({ page }) => {
        const element = page.locator("attribute-map-test-element");

        const hasFooBar = await element.evaluate(node => {
            return (window as any).Observable.getAccessors(
                Object.getPrototypeOf(node),
            ).some((a: any) => a.name === "fooBar");
        });

        expect(hasFooBar).toBeTruthy();
    });

    test("should convert camelCase property name to dash-case attribute name", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        const attribute = await element.evaluate(node => {
            return (window as any).Observable.getAccessors(
                Object.getPrototypeOf(node),
            ).find((a: any) => a.name === "fooBar")?.attribute;
        });

        expect(attribute).toBe("foo-bar");
    });

    test("should not define @attr for event handler methods", async ({ page }) => {
        const element = page.locator("attribute-map-test-element");

        const accessorNames = await element.evaluate(node => {
            return (window as any).Observable.getAccessors(
                Object.getPrototypeOf(node),
            ).map((a: any) => a.name);
        });

        // setFoo, setFooBar, setMultiple are methods (event handlers) - not in schema
        expect(accessorNames).not.toContain("setFoo");
        expect(accessorNames).not.toContain("setFooBar");
        expect(accessorNames).not.toContain("setMultiple");
    });

    test("should update definition attributeLookup for simple properties", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        const fooAttrLookup = await element.evaluate(node => {
            const { fastElementRegistry } = (window as any).__FAST__;
            const definition = fastElementRegistry.getForInstance(node);
            return definition?.attributeLookup["foo"]?.name ?? null;
        });

        expect(fooAttrLookup).toBe("foo");
    });

    test("should update definition attributeLookup with dash-case for camelCase properties", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        const fooBarAttrLookup = await element.evaluate(node => {
            const { fastElementRegistry } = (window as any).__FAST__;
            const definition = fastElementRegistry.getForInstance(node);
            return definition?.attributeLookup["foo-bar"]?.name ?? null;
        });

        expect(fooBarAttrLookup).toBe("fooBar");
    });
});
