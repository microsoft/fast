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

    test("should render updated value when foo property is set", async ({ page }) => {
        const fooDiv = page.locator(".foo-value");

        await page.locator("button:text-is('Set Foo')").click();

        await expect(fooDiv).toHaveText("hello");
    });

    test("should render updated value when fooBar property is set", async ({ page }) => {
        const fooBarDiv = page.locator(".foo-bar-value");

        await page.locator("button:text-is('Set FooBar')").click();

        await expect(fooBarDiv).toHaveText("world");
    });

    test("should update both properties independently", async ({ page }) => {
        const fooDiv = page.locator(".foo-value");
        const fooBarDiv = page.locator(".foo-bar-value");

        await page.locator("button:text-is('Set Foo')").click();
        await expect(fooDiv).toHaveText("hello");

        await page.locator("button:text-is('Set FooBar')").click();
        await expect(fooBarDiv).toHaveText("world");
    });

    test("should update both properties when setting multiple", async ({ page }) => {
        const fooDiv = page.locator(".foo-value");
        const fooBarDiv = page.locator(".foo-bar-value");

        await page.locator("button:text-is('Set Multiple')").click();

        await expect(fooDiv).toHaveText("updated");
        await expect(fooBarDiv).toHaveText("also-updated");
    });
});
