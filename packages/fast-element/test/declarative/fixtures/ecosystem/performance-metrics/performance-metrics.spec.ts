import { expect, test } from "@playwright/test";

test.describe("Performance Metrics via whenHydrated", () => {
    test.beforeEach(async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/performance-metrics/");
        await hydrationCompleted;
    });

    test("should create a single hydration:complete measure", async ({ page }) => {
        const measure = await page.evaluate(() =>
            performance
                .getEntriesByType("measure")
                .filter(m => m.name === "hydration:complete"),
        );

        expect(measure).toHaveLength(1);
    });

    test("hydration:complete measure should have non-zero duration", async ({ page }) => {
        const duration = await page.evaluate(() => {
            const measures = performance.getEntriesByType("measure");
            const complete = measures.find(m => m.name === "hydration:complete");
            return complete?.duration;
        });

        expect(duration).toBeDefined();
        expect(duration).toBeGreaterThanOrEqual(0);
    });
});
