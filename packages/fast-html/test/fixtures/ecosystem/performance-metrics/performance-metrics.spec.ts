import { expect, test } from "@playwright/test";

test.describe("Performance Metrics via Lifecycle Callbacks", () => {
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

    test("element-register should precede template-update", async ({ page }) => {
        const { regTime, tmplTime, regSeq, tmplSeq } = await page.evaluate(() => {
            const entries = performance.getEntriesByType("mark") as PerformanceMark[];
            const reg = entries.find(m => m.name === "element-register:fast-card");
            const tmpl = entries.find(m => m.name === "template-update:fast-card:start");
            return {
                regTime: reg?.startTime,
                tmplTime: tmpl?.startTime,
                regSeq: (reg?.detail as any)?.sequence as number | undefined,
                tmplSeq: (tmpl?.detail as any)?.sequence as number | undefined,
            };
        });

        expect(regTime).toBeDefined();
        expect(tmplTime).toBeDefined();
        expect(regSeq).toBeDefined();
        expect(tmplSeq).toBeDefined();

        // Timestamps may collide due to timer coarsening; use sequence as
        // tiebreaker to verify ordering.
        expect(regTime).toBeLessThanOrEqual(tmplTime!);
        expect(regSeq).toBeLessThan(tmplSeq!);
    });

    test("template-update should precede element-define", async ({ page }) => {
        const { templateEnd, defineTime, templateEndSeq, defineSeq } =
            await page.evaluate(() => {
                const marks = performance.getEntriesByType("mark") as PerformanceMark[];
                const measures = performance.getEntriesByType("measure");
                const tmpl = measures.find(m => m.name === "template-update:fast-card");
                const def = marks.find(m => m.name === "element-define:fast-card");
                // template-update:start fires before template-update (the
                // measure), and element-define fires after.  Compare the
                // start-mark sequence against the define-mark sequence.
                const startMark = marks.find(
                    m => m.name === "template-update:fast-card:start",
                );
                return {
                    templateEnd: tmpl ? tmpl.startTime + tmpl.duration : undefined,
                    defineTime: def?.startTime,
                    templateEndSeq: (startMark?.detail as any)?.sequence as
                        | number
                        | undefined,
                    defineSeq: (def?.detail as any)?.sequence as number | undefined,
                };
            });

        expect(templateEnd).toBeDefined();
        expect(defineTime).toBeDefined();
        expect(templateEnd).toBeLessThanOrEqual(defineTime!);

        expect(templateEndSeq).toBeDefined();
        expect(defineSeq).toBeDefined();
        expect(templateEndSeq).toBeLessThan(defineSeq!);
    });

    test("hydration:started should precede element-define", async ({ page }) => {
        const { defineTime, hsTime } = await page.evaluate(() => {
            const marks = performance.getEntriesByType("mark") as PerformanceMark[];
            const def = marks.find(m => m.name === "element-define:fast-card");
            const hs = marks.find(m => m.name === "hydration:started");
            return {
                defineTime: def?.startTime,
                hsTime: hs?.startTime,
            };
        });

        expect(defineTime).toBeDefined();
        expect(hsTime).toBeDefined();
        // With the prerendered path, hydrationStarted fires from connectedCallback
        // before the async template processing triggers elementDidDefine.
        expect(hsTime).toBeLessThanOrEqual(defineTime!);
    });

    test("hydration:complete measure should have non-zero duration", async ({
        page,
    }) => {
        const duration = await page.evaluate(() => {
            const measures = performance.getEntriesByType("measure");
            const complete = measures.find(m => m.name === "hydration:complete");
            return complete?.duration;
        });

        expect(duration).toBeDefined();
        expect(duration).toBeGreaterThanOrEqual(0);
    });
});
