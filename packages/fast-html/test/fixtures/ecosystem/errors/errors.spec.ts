import { expect, test } from "@playwright/test";

test.describe("f-template errors", () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            (window as any).__errors = [];
            window.addEventListener("unhandledrejection", event => {
                event.preventDefault();
                (window as any).__errors.push(
                    event.reason?.message ?? String(event.reason),
                );
            });
        });
    });

    test("throws an error when no template element is present", async ({ page }) => {
        test.skip(
            !!process.env.FAST_WEBUI_INTEGRATION,
            "WebUI does not render <f-template> without <template> child (see WEBUI_ISSUES.md #3)",
        );
        await page.goto("/fixtures/ecosystem/errors/");

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
        await page.goto("/fixtures/ecosystem/errors/");

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
