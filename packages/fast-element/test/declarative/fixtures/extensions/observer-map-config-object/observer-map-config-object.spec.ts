import { expect, test } from "@playwright/test";

test.describe("Config object maps", () => {
    test.describe("observerMap with config object", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/fixtures/extensions/observer-map-config-object/");
            await page.waitForSelector("config-observer-map-test-element");
        });

        test("should define observable properties when using {} config", async ({
            page,
        }) => {
            const element = page.locator("config-observer-map-test-element");

            const hasDataAccessor = await element.evaluate(node => {
                const desc = Object.getOwnPropertyDescriptor(
                    Object.getPrototypeOf(node),
                    "data",
                );
                return typeof desc?.get === "function";
            });

            expect(hasDataAccessor).toBeTruthy();
        });

        test("should render initial values", async ({ page }) => {
            await expect(page.locator(".message")).toHaveText("hello");
            await expect(page.locator(".nested-value")).toHaveText("42");
        });

        test("should track deep mutations via proxy", async ({ page }) => {
            const element = page.locator("config-observer-map-test-element");

            await element.evaluate(node => (node as any).updateMessage());
            await expect(page.locator(".message")).toHaveText("updated");
        });

        test("should track nested property mutations via proxy", async ({ page }) => {
            const element = page.locator("config-observer-map-test-element");

            await element.evaluate(node => (node as any).updateNestedValue());
            await expect(page.locator(".nested-value")).toHaveText("99");
        });
    });

    test.describe("attributeMap with config object", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/fixtures/extensions/observer-map-config-object/");
            await page.waitForSelector("config-attribute-map-test-element");
        });

        test("should define @attr for leaf property when using {} config", async ({
            page,
        }) => {
            const element = page.locator("config-attribute-map-test-element");

            const hasLabelAccessor = await element.evaluate(node => {
                const desc = Object.getOwnPropertyDescriptor(
                    Object.getPrototypeOf(node),
                    "label",
                );
                return typeof desc?.get === "function";
            });

            expect(hasLabelAccessor).toBeTruthy();
        });

        test("should update template when attribute is set via setAttribute", async ({
            page,
        }) => {
            const element = page.locator("config-attribute-map-test-element");

            await element.evaluate(node => node.setAttribute("label", "attr-value"));

            await expect(page.locator(".label-value")).toHaveText("attr-value");
        });

        test("should reflect property value back to attribute", async ({ page }) => {
            const element = page.locator("config-attribute-map-test-element");

            await element.evaluate(node => {
                (node as any).label = "reflected";
            });

            await page.evaluate(() => new Promise(r => requestAnimationFrame(r)));

            const attrValue = await element.evaluate(node => node.getAttribute("label"));
            expect(attrValue).toBe("reflected");
        });
    });
});
