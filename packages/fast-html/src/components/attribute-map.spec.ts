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

        // @click="{setFoo()}" etc. produce "event" type bindings — excluded from schema
        expect(accessorNames).not.toContain("setFoo");
        expect(accessorNames).not.toContain("setFooBar");
        expect(accessorNames).not.toContain("setMultiple");
    });

    test("should update template when attribute is set via setAttribute", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        await element.evaluate(node => node.setAttribute("foo", "attr-value"));

        await expect(page.locator(".foo-value")).toHaveText("attr-value");
    });

    test("should update template when dash-case attribute is set via setAttribute", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        await element.evaluate(node => node.setAttribute("foo-bar", "bar-attr-value"));

        await expect(page.locator(".foo-bar-value")).toHaveText("bar-attr-value");
    });

    test("should reflect property value back to attribute", async ({ page }) => {
        const element = page.locator("attribute-map-test-element");

        await element.evaluate(node => {
            (node as any).foo = "reflected";
        });

        // FAST reflects attributes asynchronously via Updates.enqueue
        await page.evaluate(() => new Promise(r => requestAnimationFrame(r)));

        const attrValue = await element.evaluate(node => node.getAttribute("foo"));
        expect(attrValue).toBe("reflected");
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
