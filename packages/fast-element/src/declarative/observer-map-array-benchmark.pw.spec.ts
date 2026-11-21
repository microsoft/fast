import { expect, test } from "@playwright/test";

const noOpCases = ["same-reference", "same-elements", "deep-equal"] as const;

for (const depth of [0, 3]) {
    for (const kind of noOpCases) {
        test(`observerMap ${kind} preserves array identity and notifications at depth ${depth}`, async ({
            page,
        }) => {
            await page.goto("/");
            const result = await page.evaluate(
                async ({ depth, kind }) => {
                    // @ts-expect-error: Client module.
                    const { createObserverMapArrayWorkload } = await import("/main.js");
                    const workload = await createObserverMapArrayWorkload(100, depth);
                    try {
                        return await workload.run(kind, 3);
                    } finally {
                        workload.dispose();
                    }
                },
                { depth, kind },
            );
            expect(result.changes).toBe(0);
            expect(result.sameArray).toBe(true);
            expect(result.sameFirstItem).toBe(true);
            expect(result.ownerNotifications).toBe(0);
            expect(result.arrayNotifications).toBe(0);
            expect(result.length).toBe(100);
        });
    }

    test(`observerMap replacement remains observable at depth ${depth}`, async ({
        page,
    }) => {
        await page.goto("/");
        const result = await page.evaluate(async depth => {
            // @ts-expect-error: Client module.
            const { createObserverMapArrayWorkload } = await import("/main.js");
            const workload = await createObserverMapArrayWorkload(100, depth);
            try {
                return await workload.run("replacement", 3);
            } finally {
                workload.dispose();
            }
        }, depth);
        expect(result.changes).toBe(3);
        expect(result.sameArray).toBe(false);
        expect(result.sameFirstItem).toBe(false);
        expect(result.ownerNotifications).toBeGreaterThan(0);
        expect(result.arrayNotifications).toBe(0);
        expect(result.length).toBe(100);
    });
}

test("measures observerMap array no-op and replacement costs", async ({ page }) => {
    test.skip(
        !process.env.FAST_OBSERVER_MAP_BENCHMARK,
        "Opt-in same-machine CPU benchmark.",
    );
    test.setTimeout(180_000);
    for (const size of [100, 1000]) {
        for (const depth of [0, 1, 3]) {
            for (const kind of [...noOpCases, "replacement"] as const) {
                const iterations =
                    kind === "same-reference"
                        ? 10_000
                        : kind === "same-elements"
                          ? 100_000 / size
                          : kind === "deep-equal"
                            ? 10_000 / size
                            : 5_000 / size;
                const samples: number[] = [];
                for (let run = 0; run < 8; run++) {
                    await page.goto("/");
                    const result = await page.evaluate(
                        async ({ size, depth, kind, iterations }) => {
                            // @ts-expect-error: Client module.
                            const { createObserverMapArrayWorkload } = await import(
                                "/main.js"
                            );
                            const workload = await createObserverMapArrayWorkload(
                                size,
                                depth,
                            );
                            try {
                                return await workload.run(kind, iterations);
                            } finally {
                                workload.dispose();
                            }
                        },
                        { size, depth, kind, iterations },
                    );
                    expect(result.changes).toBe(kind === "replacement" ? iterations : 0);
                    expect(result.sameArray).toBe(kind !== "replacement");
                    expect(result.sameFirstItem).toBe(kind !== "replacement");
                    expect(result.arrayNotifications).toBe(0);
                    if (kind === "replacement") {
                        expect(result.ownerNotifications).toBeGreaterThan(0);
                    } else {
                        expect(result.ownerNotifications).toBe(0);
                    }
                    if (run > 0) samples.push(result.duration / iterations);
                }
                samples.sort((a, b) => a - b);
                console.log(
                    `observerMap deepMerge ms/merge: ${JSON.stringify({
                        size,
                        depth,
                        kind,
                        iterations,
                        median: samples[3],
                        min: samples[0],
                        max: samples[6],
                        samples,
                    })}`,
                );
            }
        }
    }
});
