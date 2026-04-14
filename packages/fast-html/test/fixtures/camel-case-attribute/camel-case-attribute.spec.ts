import { expect, test } from "@playwright/test";

test.describe("camelCase attribute-name-strategy", async () => {
    test("renders dashed attribute as camelCase property", async ({ page }) => {
        await page.goto("/fixtures/camel-case-attribute/");

        const element = page.locator("test-camel-case");
        await expect(element).toHaveText("hello");
        await expect(element).toHaveAttribute("foo-bar", "hello");
    });

    test("updates camelCase property via attribute change", async ({ page }) => {
        await page.goto("/fixtures/camel-case-attribute/");

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
        await page.goto("/fixtures/camel-case-attribute/");

        const element = page.locator("test-camel-case-multi");
        await expect(element).toHaveText("world");
        await expect(element).toHaveAttribute("my-custom-prop", "world");
    });

    test("non-dashed attribute is unaffected", async ({ page }) => {
        await page.goto("/fixtures/camel-case-attribute/");

        const element = page.locator("test-camel-case-no-dash");
        await expect(element).toHaveText("simple");
        await expect(element).toHaveAttribute("label", "simple");
    });
});
