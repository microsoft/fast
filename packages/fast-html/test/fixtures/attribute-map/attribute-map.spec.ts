import { expect, test } from "@playwright/test";

test.describe("AttributeMap", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/fixtures/attribute-map/");
        await page.waitForSelector("attribute-map-test-element");
    });

    test("should define @attr accessors for leaf properties from the template", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        const accessors = await element.evaluate(node => {
            const proto = Object.getPrototypeOf(node);
            const isAccessor = (name: string) =>
                typeof Object.getOwnPropertyDescriptor(proto, name)?.get === "function";
            return { foo: isAccessor("foo"), fooBar: isAccessor("fooBar") };
        });

        expect(accessors.foo).toBeTruthy();
        expect(accessors.fooBar).toBeTruthy();
    });

    test("should use camelCase property name and kebab-case attribute name", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        // Setting foo-bar attribute should update the fooBar property (camelCase conversion)
        await element.evaluate(node => node.setAttribute("foo-bar", "dash-test"));
        const propValue = await element.evaluate(node => (node as any).fooBar);

        expect(propValue).toBe("dash-test");
    });

    test("should use the same name for non-camelCase property", async ({ page }) => {
        const element = page.locator("attribute-map-test-element");

        // Setting foo attribute should update the foo property
        await element.evaluate(node => node.setAttribute("foo", "same-name-test"));
        const propValue = await element.evaluate(node => (node as any).foo);

        expect(propValue).toBe("same-name-test");
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

    test("should not overwrite an existing @attr accessor", async ({ page }) => {
        await page.waitForSelector("attribute-map-existing-attr-test-element");
        const element = page.locator("attribute-map-existing-attr-test-element");

        // The @attr default value must survive AttributeMap processing
        const defaultValue = await element.evaluate(node => (node as any).foo);
        expect(defaultValue).toBe("original");

        // setAttribute must still work via the original @attr definition
        await element.evaluate(node => node.setAttribute("foo", "updated"));
        const updatedValue = await element.evaluate(node => (node as any).foo);
        expect(updatedValue).toBe("updated");
    });
});
