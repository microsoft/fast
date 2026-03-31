import { expect, test } from "@playwright/test";

test.describe("AttributeMap", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/fixtures/attribute-map/");
        await page.waitForSelector("attribute-map-test-element");
    });

    test("should define @attr accessors for leaf properties from the template", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        const accessors = await element.evaluate(node => {
            return (window as any).Observable.getAccessors(
                Object.getPrototypeOf(node),
            ).map((a: any) => ({ name: a.name, attribute: a.attribute }));
        });

        expect(accessors.some((a: any) => a.name === "foo")).toBeTruthy();
        expect(accessors.some((a: any) => a.name === "fooBar")).toBeTruthy();
    });

    test("should use dash-case attribute name for camelCase property", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        const fooBarAccessor = await element.evaluate(node => {
            return (window as any).Observable.getAccessors(
                Object.getPrototypeOf(node),
            ).find((a: any) => a.name === "fooBar");
        });

        expect(fooBarAccessor?.attribute).toBe("foo-bar");
    });

    test("should use the same name for non-camelCase property", async ({ page }) => {
        const element = page.locator("attribute-map-test-element");

        const fooAccessor = await element.evaluate(node => {
            return (window as any).Observable.getAccessors(
                Object.getPrototypeOf(node),
            ).find((a: any) => a.name === "foo");
        });

        expect(fooAccessor?.attribute).toBe("foo");
    });

    test("should update template when foo attribute is set via setAttribute", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        await element.evaluate(node => node.setAttribute("foo", "hello-via-attr"));

        await expect(page.locator(".foo-value")).toHaveText("hello-via-attr");
    });

    test("should update template when foo-bar attribute is set via setAttribute", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        await element.evaluate(node => node.setAttribute("foo-bar", "world-via-attr"));

        await expect(page.locator(".foo-bar-value")).toHaveText("world-via-attr");
    });

    test("should update both properties when set via setAttribute", async ({ page }) => {
        const element = page.locator("attribute-map-test-element");

        await element.evaluate(node => {
            node.setAttribute("foo", "multi-foo");
            node.setAttribute("foo-bar", "multi-bar");
        });

        await expect(page.locator(".foo-value")).toHaveText("multi-foo");
        await expect(page.locator(".foo-bar-value")).toHaveText("multi-bar");
    });

    test("should reflect foo property value back to foo attribute", async ({ page }) => {
        const element = page.locator("attribute-map-test-element");

        await element.evaluate(node => {
            (node as any).foo = "reflected-value";
        });

        // FAST reflects attributes asynchronously via Updates.enqueue
        await page.evaluate(() => new Promise(r => requestAnimationFrame(r)));

        const attrValue = await element.evaluate(node => node.getAttribute("foo"));
        expect(attrValue).toBe("reflected-value");
    });

    test("should reflect fooBar property value back to foo-bar attribute", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        await element.evaluate(node => {
            (node as any).fooBar = "bar-reflected";
        });

        await page.evaluate(() => new Promise(r => requestAnimationFrame(r)));

        const attrValue = await element.evaluate(node => node.getAttribute("foo-bar"));
        expect(attrValue).toBe("bar-reflected");
    });
});
