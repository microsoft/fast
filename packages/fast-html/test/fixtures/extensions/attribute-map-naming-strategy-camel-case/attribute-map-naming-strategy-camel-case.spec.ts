import { expect, test } from "@playwright/test";

test.describe("camelCase attribute-name-strategy", () => {
    test("renders dashed attribute as camelCase property", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/extensions/attribute-map-naming-strategy-camel-case/");
        await hydrationCompleted;

        const element = page.locator("test-camel-case");
        await expect(element).toHaveText("hello");
        await expect(element).toHaveAttribute("foo-bar", "hello");
    });

    test("updates camelCase property via attribute change", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/extensions/attribute-map-naming-strategy-camel-case/");
        await hydrationCompleted;

        const element = page.locator("test-camel-case");
        await expect(element).toHaveText("hello");

        await page.evaluate(() => {
            const el = document.querySelector("test-camel-case");
            el?.setAttribute("foo-bar", "updated");
        });

        await expect(element).toHaveText("updated");
        await expect(element).toHaveAttribute("foo-bar", "updated");
    });

    test("renders multi-dashed attribute as camelCase", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/extensions/attribute-map-naming-strategy-camel-case/");
        await hydrationCompleted;

        const element = page.locator("test-camel-case-multi");
        await expect(element).toHaveText("world");
        await expect(element).toHaveAttribute("my-custom-prop", "world");
    });

    test("non-dashed attribute is unaffected", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/extensions/attribute-map-naming-strategy-camel-case/");
        await hydrationCompleted;

        const element = page.locator("test-camel-case-no-dash");
        await expect(element).toHaveText("simple");
        await expect(element).toHaveAttribute("label", "simple");
    });
});
