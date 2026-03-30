import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a non-binding attribute", async ({ page }) => {
        await page.goto("/fixtures/attribute/");

        const customElement = page.locator("test-element");
        const customElementInput = customElement.locator("input");
        await expect(customElementInput).toHaveAttribute("disabled");
    });
    test("create an attribute binding", async ({ page }) => {
        await page.goto("/fixtures/attribute/");

        const customElement = page.locator("test-element");

        await expect(customElement).toHaveAttribute("type", "checkbox");
        await expect(customElement.locator("input[type='checkbox']")).toHaveCount(1);

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");
            customElement.item(0)?.setAttribute("type", "radio");
        });

        await expect(customElement).toHaveAttribute("type", "radio");
        await expect(customElement.locator("input[type='radio']")).toHaveCount(1);
    });
    test("create a negated boolean attribute binding", async ({ page }) => {
        await page.goto("/fixtures/attribute/");

        const el = page.locator("bool-negate-element");
        const input = el.locator("input");

        // isEnabled defaults to true, so !isEnabled = false → disabled absent
        await expect(input).not.toHaveAttribute("disabled");

        // Set isEnabled to false → !isEnabled = true → disabled present
        await page.evaluate(() => {
            const el = document.querySelector("bool-negate-element") as any;
            el.isEnabled = false;
        });
        await expect(input).toHaveAttribute("disabled");

        // Set isEnabled back to true → !isEnabled = false → disabled removed
        await page.evaluate(() => {
            const el = document.querySelector("bool-negate-element") as any;
            el.isEnabled = true;
        });
        await expect(input).not.toHaveAttribute("disabled");
    });
    test("create an attribute binding with an expression", async ({ page }) => {
        await page.goto("/fixtures/attribute/");

        const customElement = await page.locator("test-element-expression");
        const customElementInput = await customElement.locator("input");

        await expect(customElementInput).toHaveAttribute("disabled");

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element-expression");
            customElement.item(0)?.setAttribute("active-group", "home");
        });

        await expect(customElementInput).not.toHaveAttribute("disabled");
    });
});
