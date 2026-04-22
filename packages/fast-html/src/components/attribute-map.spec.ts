import { expect, test } from "@playwright/test";

test.describe("AttributeMap", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/fixtures/attribute-map/");
        await page.waitForSelector("attribute-map-test-element");
    });

    test("should define @attr for a simple leaf property", async ({ page }) => {
        const element = page.locator("attribute-map-test-element");

        const hasFooAccessor = await element.evaluate(node => {
            const desc = Object.getOwnPropertyDescriptor(
                Object.getPrototypeOf(node),
                "foo",
            );
            return typeof desc?.get === "function";
        });

        expect(hasFooAccessor).toBeTruthy();
    });

    test("should define @attr for a camelCase property derived from binding key", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        const hasFooBarAccessor = await element.evaluate(node => {
            const desc = Object.getOwnPropertyDescriptor(
                Object.getPrototypeOf(node),
                "fooBar",
            );
            return typeof desc?.get === "function";
        });

        expect(hasFooBarAccessor).toBeTruthy();
    });

    test("should use camelCase property name with kebab-case attribute name", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        // Setting the foo-bar attribute should update the fooBar property (camelCase conversion)
        await element.evaluate(node => node.setAttribute("foo-bar", "dash-case-test"));
        const propValue = await element.evaluate(node => (node as any).fooBar);

        expect(propValue).toBe("dash-case-test");
    });

    test("should not define @attr for event handler methods", async ({ page }) => {
        const element = page.locator("attribute-map-test-element");

        // @click="{setFoo()}" etc. produce "event" type bindings — excluded from schema.
        // Regular methods have a value descriptor, not a getter/setter.
        const results = await element.evaluate(node => {
            const proto = Object.getPrototypeOf(node);
            const isAccessor = (name: string) => {
                const desc = Object.getOwnPropertyDescriptor(proto, name);
                return typeof desc?.get === "function";
            };
            return {
                setFoo: isAccessor("setFoo"),
                setFooBar: isAccessor("setFooBar"),
                setMultiple: isAccessor("setMultiple"),
            };
        });

        expect(results.setFoo).toBe(false);
        expect(results.setFooBar).toBe(false);
        expect(results.setMultiple).toBe(false);
    });

    test("should update template when attribute is set via setAttribute", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        await element.evaluate(node => node.setAttribute("foo", "attr-value"));

        await expect(page.locator(".foo-value")).toHaveText("attr-value");
    });

    test("should update template when foo-bar attribute is set via setAttribute", async ({
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

        // setAttribute triggers attributeChangedCallback via attributeLookup
        await element.evaluate(node => node.setAttribute("foo", "lookup-test"));
        const propValue = await element.evaluate(node => (node as any).foo);

        expect(propValue).toBe("lookup-test");
    });

    test("should update definition attributeLookup for camelCase properties", async ({
        page,
    }) => {
        const element = page.locator("attribute-map-test-element");

        // setAttribute with foo-bar triggers attributeChangedCallback for the fooBar property
        await element.evaluate(node => node.setAttribute("foo-bar", "lookup-bar-test"));
        const propValue = await element.evaluate(node => (node as any).fooBar);

        expect(propValue).toBe("lookup-bar-test");
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
