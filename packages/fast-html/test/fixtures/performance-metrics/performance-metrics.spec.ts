import { expect, test } from "@playwright/test";

test.describe("Performance Metrics via Lifecycle Callbacks", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/fixtures/performance-metrics/");
        await page.waitForFunction(() => (window as any).getHydrationComplete());
    });

    test("should create a performance measure for each hydrated element", async ({
        page,
    }) => {
        const measures = await page.evaluate(() =>
            performance
                .getEntriesByType("measure")
                .filter(m => m.name === "hydration:fast-card")
        );

        const cards = page.locator("fast-card");
        await expect(cards).toHaveCount(2);

        expect(measures).toHaveLength(2);
    });

    test("should create a single hydration:complete measure", async ({ page }) => {
        const measure = await page.evaluate(() =>
            performance
                .getEntriesByType("measure")
                .filter(m => m.name === "hydration:complete")
        );

        expect(measure).toHaveLength(1);
    });

    test("the hydration:complete measure should have a duration greater than or equal to the longest hydration:fast-card measure", async ({ page }) => {
        const completeMeasure = await page.evaluate(() =>
            performance.getEntriesByType("measure").find(m => m.name === "hydration:complete")
        );

        const cardMeasures = await page.evaluate(() =>
            performance
                .getEntriesByType("measure")
                .filter(m => m.name === "hydration:fast-card")
        );

        expect(cardMeasures).toHaveLength(2);
        expect(completeMeasure!.duration).toBeGreaterThanOrEqual(
            Math.max(...cardMeasures.map(m => m.duration))
        );
    });
});
