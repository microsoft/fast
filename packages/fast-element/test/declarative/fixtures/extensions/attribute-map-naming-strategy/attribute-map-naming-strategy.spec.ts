import { expect, test } from "@playwright/test";

test.describe("AttributeMap with attribute-name-strategy: camelCase", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/fixtures/extensions/attribute-map-naming-strategy/");
        await page.waitForSelector("naming-strategy-test");
    });

    test("should define @attr accessors with camelCase property names", async ({
        page,
    }) => {
        const element = page.locator("naming-strategy-test");

        const accessors = await element.evaluate(node => {
            const proto = Object.getPrototypeOf(node);
            const isAccessor = (name: string) =>
                typeof Object.getOwnPropertyDescriptor(proto, name)?.get === "function";
            return {
                fooBar: isAccessor("fooBar"),
                myCustomProp: isAccessor("myCustomProp"),
            };
        });

        expect(accessors.fooBar).toBeTruthy();
        expect(accessors.myCustomProp).toBeTruthy();
    });

    test("should map kebab-case attribute to camelCase property via setAttribute", async ({
        page,
    }) => {
        const element = page.locator("naming-strategy-test");

        await element.evaluate(node => node.setAttribute("foo-bar", "attr-test"));
        const propValue = await element.evaluate(node => (node as any).fooBar);

        expect(propValue).toBe("attr-test");
    });

    test("should update template when kebab-case attribute is set", async ({ page }) => {
        const element = page.locator("naming-strategy-test");

        await element.evaluate(node => node.setAttribute("foo-bar", "hello-via-attr"));

        await expect(page.locator(".foo-bar-value")).toHaveText("hello-via-attr");
    });

    test("should update template for multi-dashed attribute", async ({ page }) => {
        const element = page.locator("naming-strategy-test");

        await element.evaluate(node =>
            node.setAttribute("my-custom-prop", "multi-dash-test"),
        );

        await expect(page.locator(".my-custom-prop-value")).toHaveText("multi-dash-test");
    });

    test("should reflect camelCase property value back to kebab-case attribute", async ({
        page,
    }) => {
        const element = page.locator("naming-strategy-test");

        await element.evaluate(node => {
            (node as any).fooBar = "reflected-value";
        });

        await page.evaluate(() => new Promise(r => requestAnimationFrame(r)));

        const attrValue = await element.evaluate(node => node.getAttribute("foo-bar"));
        expect(attrValue).toBe("reflected-value");
    });

    test("should render initial attribute values from state defaults", async ({
        page,
    }) => {
        await expect(page.locator(".foo-bar-value")).toHaveText("default-foo");
        await expect(page.locator(".my-custom-prop-value")).toHaveText("default-prop");
    });

    test("should update template when camelCase property is set directly", async ({
        page,
    }) => {
        const element = page.locator("naming-strategy-test");

        await element.evaluate(node => {
            (node as any).fooBar = "property-set";
        });

        await expect(page.locator(".foo-bar-value")).toHaveText("property-set");
    });

    test("non-dashed attribute name is unaffected by camelCase strategy", async ({
        page,
    }) => {
        await page.waitForSelector("naming-strategy-no-dash-test");
        const element = page.locator("naming-strategy-no-dash-test");

        await element.evaluate(node => node.setAttribute("label", "no-dash-test"));
        const propValue = await element.evaluate(node => (node as any).label);

        expect(propValue).toBe("no-dash-test");
        await expect(page.locator(".label-value")).toHaveText("no-dash-test");
    });

    test("non-dashed attribute renders initial value from state defaults", async ({
        page,
    }) => {
        await page.waitForSelector("naming-strategy-no-dash-test");
        await expect(page.locator(".label-value")).toHaveText("default-label");
    });
});
