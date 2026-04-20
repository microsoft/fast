import { expect, test } from "@playwright/test";

test.describe("declarativeTemplate", async () => {
    test("defines f-template and resolves a ViewTemplate", async ({ page }) => {
        await page.goto("/fixtures/declarative-template/");

        const result = await page.evaluate(async () => {
            // Wait for the template promise to resolve
            await new Promise<void>(resolve => {
                const check = () => {
                    if ((window as any).resolvedTemplate) {
                        resolve();
                    } else {
                        setTimeout(check, 50);
                    }
                };
                check();
            });

            return {
                hasTemplate: !!(window as any).resolvedTemplate,
                templateType: (window as any).resolvedTemplate?.constructor?.name,
            };
        });

        expect(result.hasTemplate).toBe(true);
        expect(result.templateType).toBe("ViewTemplate");
    });

    test("renders the component with the resolved template", async ({ page }) => {
        await page.goto("/fixtures/declarative-template/");

        const element = page.locator("test-element");
        await expect(element).toHaveText("Hello");
    });

    test("responds to attribute changes after template resolution", async ({ page }) => {
        await page.goto("/fixtures/declarative-template/");

        const element = page.locator("test-element");
        await expect(element).toHaveText("Hello");

        await page.evaluate(() => {
            document.querySelector("test-element")!.setAttribute("greeting", "World");
        });

        await expect(element).toHaveText("World");
    });
});
