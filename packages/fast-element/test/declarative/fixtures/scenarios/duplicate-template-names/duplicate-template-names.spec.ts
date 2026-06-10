import { expect, test } from "@playwright/test";

test.describe("duplicate f-template names", () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            (window as any).__duplicateTemplateErrors = [];
            window.addEventListener("error", event => {
                (window as any).__duplicateTemplateErrors.push(event.message);
            });
            window.addEventListener("unhandledrejection", event => {
                event.preventDefault();
                (window as any).__duplicateTemplateErrors.push(
                    event.reason?.message ?? String(event.reason),
                );
            });
        });
    });

    test("keeps the first template assignment without errors", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/scenarios/duplicate-template-names/");
        await hydrationCompleted;

        const customElement = page.locator("duplicate-template-element");

        await expect(customElement).toHaveText("initial");

        await page.evaluate(() => {
            document
                .querySelector("duplicate-template-element")
                ?.setAttribute("label", "updated");
        });

        await expect(customElement).toHaveText("updated");

        const result = await page.evaluate(() => ({
            errors: (window as any).__duplicateTemplateErrors,
            status: (window as any).__duplicateTemplateStatus,
        }));

        expect(result.errors).toEqual([]);
        expect(result.status).toEqual({
            templateDidUpdateCount: 1,
            templateWillUpdateCount: 1,
        });
    });
});
