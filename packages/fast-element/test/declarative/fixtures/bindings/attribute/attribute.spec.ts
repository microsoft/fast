import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a non-binding attribute", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/attribute/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");
        const customElementInput = customElement.locator("input");
        await expect(customElementInput).toHaveAttribute("disabled");
    });
    test("create an attribute binding", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/attribute/");
        await hydrationCompleted;

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
    test("create a property to attribute binding", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/attribute/");
        await hydrationCompleted;

        const customElement = page.locator("test-element-property");

        await expect(customElement.locator("input[disabled]")).toHaveCount(1);

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element-property");
            (customElement.item(0) as any)!.isEnabled = true;
        });

        await expect(customElement.locator("input[disabled]")).toHaveCount(0);
    });
    test("create an attribute binding with an expression", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/attribute/");
        await hydrationCompleted;

        const customElement = await page.locator("test-element-expression");
        const customElementInput = await customElement.locator("input");

        await expect(customElementInput).toHaveAttribute("disabled");

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName(
                "test-element-expression",
            );
            customElement.item(0)?.setAttribute("active-group", "home");
        });

        await expect(customElementInput).not.toHaveAttribute("disabled");
    });
});
