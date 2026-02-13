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
        await expect(cards).toHaveCount(14);

        expect(measures).toHaveLength(14);
    });

    test("should create a single hydration:complete measure", async ({ page }) => {
        const measure = await page.evaluate(() =>
            performance
                .getEntriesByType("measure")
                .filter(m => m.name === "hydration:complete")
        );

        expect(measure).toHaveLength(1);
    });

    test("element-register should precede template-update", async ({ page }) => {
        const { regTime, tmplTime, regSeq, tmplSeq } = await page.evaluate(() => {
            const entries = performance.getEntriesByType("mark") as PerformanceMark[];
            const reg = entries.find(m => m.name === "element-register:fast-card");
            const tmpl = entries.find(m =>
                m.name === "template-update:fast-card:start"
            );
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
                const marks =
                    performance.getEntriesByType("mark") as PerformanceMark[];
                const measures = performance.getEntriesByType("measure");
                const tmpl = measures.find(
                    m => m.name === "template-update:fast-card"
                );
                const def = marks.find(
                    m => m.name === "element-define:fast-card"
                );
                // template-update:start fires before template-update (the
                // measure), and element-define fires after.  Compare the
                // start-mark sequence against the define-mark sequence.
                const startMark = marks.find(
                    m => m.name === "template-update:fast-card:start"
                );
                return {
                    templateEnd: tmpl
                        ? tmpl.startTime + tmpl.duration
                        : undefined,
                    defineTime: def?.startTime,
                    templateEndSeq: (startMark?.detail as any)
                        ?.sequence as number | undefined,
                    defineSeq: (def?.detail as any)
                        ?.sequence as number | undefined,
                };
            });

        expect(templateEnd).toBeDefined();
        expect(defineTime).toBeDefined();
        expect(templateEnd).toBeLessThanOrEqual(defineTime!);

        expect(templateEndSeq).toBeDefined();
        expect(defineSeq).toBeDefined();
        expect(templateEndSeq).toBeLessThan(defineSeq!);
    });

    test("element-define should precede hydration:started", async ({ page }) => {
        const { defineTime, hsTime, defineSeq, hsSeq } = await page.evaluate(
            () => {
                const marks =
                    performance.getEntriesByType("mark") as PerformanceMark[];
                const def = marks.find(
                    m => m.name === "element-define:fast-card"
                );
                const hs = marks.find(m => m.name === "hydration:started");
                return {
                    defineTime: def?.startTime,
                    hsTime: hs?.startTime,
                    defineSeq: (def?.detail as any)
                        ?.sequence as number | undefined,
                    hsSeq: (hs?.detail as any)
                        ?.sequence as number | undefined,
                };
            }
        );

        expect(defineTime).toBeDefined();
        expect(hsTime).toBeDefined();
        expect(defineTime).toBeLessThanOrEqual(hsTime!);

        expect(defineSeq).toBeDefined();
        expect(hsSeq).toBeDefined();
        expect(defineSeq).toBeLessThan(hsSeq!);
    });

    test("hydration:started should precede all individual element hydration measures", async ({
        page,
    }) => {
        const { hydrationStarted, firstCardHydration } = await page.evaluate(() => {
            const marks = performance.getEntriesByType("mark");
            const measures = performance.getEntriesByType("measure");
            const hs = marks.find(m => m.name === "hydration:started");
            const cardMeasures = measures.filter(
                m => m.name === "hydration:fast-card"
            );
            const earliest = Math.min(...cardMeasures.map(m => m.startTime));
            return { hydrationStarted: hs?.startTime, firstCardHydration: earliest };
        });

        expect(hydrationStarted).toBeDefined();
        expect(hydrationStarted).toBeLessThanOrEqual(firstCardHydration);
    });

    test("all individual element hydrations should complete before hydration:complete ends", async ({
        page,
    }) => {
        const { lastCardEnd, completeEnd } = await page.evaluate(() => {
            const measures = performance.getEntriesByType("measure");
            const cardMeasures = measures.filter(
                m => m.name === "hydration:fast-card"
            );
            const complete = measures.find(m => m.name === "hydration:complete");
            return {
                lastCardEnd: Math.max(
                    ...cardMeasures.map(m => m.startTime + m.duration)
                ),
                completeEnd: complete
                    ? complete.startTime + complete.duration
                    : undefined,
            };
        });

        expect(completeEnd).toBeDefined();
        expect(completeEnd).toBeGreaterThanOrEqual(lastCardEnd);
    });

    test("should create an element-prepared measure for each element", async ({
        page,
    }) => {
        const count = await page.evaluate(() =>
            performance
                .getEntriesByType("measure")
                .filter(m => m.name.startsWith("element-prepared:fast-card:")).length
        );

        expect(count).toBe(14);
    });

    test("at least one element-prepared measure should complete before hydration:started", async ({
        page,
    }) => {
        const { earliestPreparedEnd, hydrationStarted } = await page.evaluate(() => {
            const marks = performance.getEntriesByType("mark");
            const measures = performance.getEntriesByType("measure");
            const prepared = measures.filter(m =>
                m.name.startsWith("element-prepared:fast-card:")
            );
            const hs = marks.find(m => m.name === "hydration:started");
            return {
                earliestPreparedEnd: Math.min(
                    ...prepared.map(m => m.startTime + m.duration)
                ),
                hydrationStarted: hs?.startTime,
            };
        });

        expect(hydrationStarted).toBeDefined();
        expect(earliestPreparedEnd).toBeLessThanOrEqual(hydrationStarted!);
    });

    test("elements with defer-delay should have longer prepare durations than those without", async ({
        page,
    }) => {
        const { zeroDurations, delayedDurations } = await page.evaluate(() => {
            const measures = performance.getEntriesByType(
                "measure"
            ) as PerformanceMeasure[];
            const prepared = measures.filter(m =>
                m.name.startsWith("element-prepared:fast-card:")
            );

            const zero: number[] = [];
            const delayed: number[] = [];

            for (const m of prepared) {
                const delay = (m.detail as any)?.delay ?? 0;
                if (delay === 0) {
                    zero.push(m.duration);
                } else {
                    delayed.push(m.duration);
                }
            }

            return { zeroDurations: zero, delayedDurations: delayed };
        });

        const maxZero = Math.max(...zeroDurations);
        const minDelayed = Math.min(...delayedDurations);

        // Zero-delay elements should be substantially faster than delayed ones.
        expect(maxZero).toBeLessThan(minDelayed);
    });

    test("every hydrated element should have willHydrate and didHydrate values set", async ({
        page,
    }) => {
        const cards = page.locator("fast-card");
        const count = await cards.count();

        expect(count).toBe(14);

        for (let i = 0; i < count; i++) {
            const card = cards.nth(i);
            const willHydrate = await card.evaluate(
                (el: any) => el.willHydrate
            );
            const didHydrate = await card.evaluate(
                (el: any) => el.didHydrate
            );

            expect(willHydrate, `card ${i} willHydrate`).toBeTruthy();
            expect(didHydrate, `card ${i} didHydrate`).toBeTruthy();
        }
    });
});
