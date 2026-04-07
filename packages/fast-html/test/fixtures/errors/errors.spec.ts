import { expect, test } from "@playwright/test";

test.describe("f-template errors", () => {
    test("throws an error when no template element is present", async ({ page }) => {
        await page.addInitScript(() => {
            (window as any).__errors = [];
            window.addEventListener("unhandledrejection", event => {
                (window as any).__errors.push(
                    event.reason?.message ?? String(event.reason),
                );
            });
        });

        await page.goto("/fixtures/errors/");

        await expect
            .poll(async () => {
                const errors: string[] = await page.evaluate(
                    () => (window as any).__errors,
                );
                return errors.some(msg => msg.includes("must be a <template>"));
            })
            .toBe(true);
    });

    test("throws an error when multiple template elements are present", async ({
        page,
    }) => {
        await page.addInitScript(() => {
            (window as any).__errors = [];
            window.addEventListener("unhandledrejection", event => {
                (window as any).__errors.push(
                    event.reason?.message ?? String(event.reason),
                );
            });
        });

        await page.goto("/fixtures/errors/");

        await expect
            .poll(async () => {
                const errors: string[] = await page.evaluate(
                    () => (window as any).__errors,
                );
                return errors.some(msg => msg.includes("only be one <template>"));
            })
            .toBe(true);
    });
});
