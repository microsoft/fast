import { expect, test } from "@playwright/test";
import { inRange, limit, wrapInBounds } from "./numbers.js";

test.describe("wrapInBounds", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { wrapInBounds } from "/dist/numbers.js";
                globalThis.wrapInBounds = wrapInBounds;
            `,
        });

        await page.waitForFunction(() => "wrapInBounds" in globalThis);
    });

    test("should not throw if any parameters are null", async ({ page }) => {
        const values = [
            [null, null, null],
            [1, null, null],
            [1, 2, null],
            [1, null, 3],
            [1, 2, 3],
        ];

        for (const value of values) {
            await expect(
                page.evaluate(value => {
                    wrapInBounds.call(null, ...value);
                }, value)
            ).resolves.not.toThrow();
        }
    });

    test("should return `min` if `value` is greater than `max`", async ({ page }) => {
        const values = [
            [0, 10, 11],
            [-10, 0, 1],
            [-10, 10, 11],
            [10, 20, 30],
        ];

        for (const value of values) {
            expect(
                await page.evaluate(([min, max, v]) => {
                    return wrapInBounds(min, max, v);
                }, value)
            ).toBe(value[0]);
        }
    });

    test("should return `max` if `value` is less than `min`", async ({ page }) => {
        const values = [
            [0, 10, -10],
            [-10, 0, -11],
            [-20, -10, -30],
            [-10, 10, -11],
        ];

        for (const value of values) {
            expect(
                await page.evaluate(([min, max, v]) => {
                    return wrapInBounds(min, max, v);
                }, value)
            ).toBe(value[1]);
        }
    });

    test("should return the correct value if both min and max are the same", async ({
        page,
    }) => {
        expect(await page.evaluate(() => wrapInBounds(0, 0, -1))).toBe(0);

        expect(await page.evaluate(() => wrapInBounds(0, 0, 1))).toBe(0);
    });
});

test.describe("limit", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { limit } from "/dist/numbers.js";
                globalThis.limit = limit;
            `,
        });

        await page.waitForFunction(() => "limit" in globalThis);
    });

    test("should not throw if any parameters are null", async ({ page }) => {
        await expect(
            page.evaluate(() => {
                limit.call(null, null, null, null);
            })
        ).resolves.not.toThrow();

        await expect(
            page.evaluate(() => {
                limit.call(null, 0, null, null);
            })
        ).resolves.not.toThrow();

        await expect(
            page.evaluate(() => {
                limit.call(null, 0, null, 1);
            })
        ).resolves.not.toThrow();

        await expect(
            page.evaluate(() => {
                limit.call(null, 0, 10, null);
            })
        ).resolves.not.toThrow();
    });

    test("should return `min` if `value` is equal to `min`", async ({ page }) => {
        expect(await page.evaluate(() => limit(0, 10, 0))).toBe(0);
    });

    test("should return `min` if `value` is greater than `min`", async ({ page }) => {
        expect(await page.evaluate(() => limit(10, 15, -1))).toBe(10);
    });

    test("should return `max` if `value` is equal to `max`", async ({ page }) => {
        expect(await page.evaluate(() => limit(0, 10, 10))).toBe(10);
    });

    test("should return `max` if `value` is greater than `max`", async ({ page }) => {
        expect(await page.evaluate(() => limit(0, 10, 11))).toBe(10);
    });

    test("should return the value if `value` is not less min or greater than max", async ({
        page,
    }) => {
        expect(await page.evaluate(() => limit(0, 10, 5))).toBe(5);
    });
});

test.describe("inRange", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { inRange } from "/dist/numbers.js";
                globalThis.inRange = inRange;
            `,
        });

        await page.waitForFunction(() => "inRange" in globalThis);
    });

    test("should not throw if any parameters are null", async ({ page }) => {
        await expect(
            page.evaluate(() => {
                inRange.call(null, null, null, null);
            })
        ).resolves.not.toThrow();

        await expect(
            page.evaluate(() => {
                inRange.call(null, 0, null, null);
            })
        ).resolves.not.toThrow();

        await expect(
            page.evaluate(() => {
                inRange.call(null, 0, null, 1);
            })
        ).resolves.not.toThrow();

        await expect(
            page.evaluate(() => {
                inRange.call(null, 0, 10, null);
            })
        ).resolves.not.toThrow();
    });

    test("should return `true` if `value` is within range of `min` and `max`", async ({
        page,
    }) => {
        expect(await page.evaluate(() => inRange(10, 0, 20))).toBe(true);

        expect(await page.evaluate(() => inRange(10, 20))).toBe(true);
    });

    test("should return `false` when `value` is less than `min` and `max`", async ({
        page,
    }) => {
        expect(await page.evaluate(() => inRange(10, 20, 30))).toBe(false);
    });

    test("should return `false` when `value` is greater than `min` and `max`", async ({
        page,
    }) => {
        expect(await page.evaluate(() => inRange(10, 0, 5))).toBe(false);
    });

    test("should return `false` when `value` is equal to `max`", async ({ page }) => {
        expect(await page.evaluate(() => inRange(10, 0, 10))).toBe(false);
    });

    test("should return `true` when `value` is less than `min` and `max` is omitted", async ({
        page,
    }) => {
        expect(await page.evaluate(() => inRange(10, 20))).toBe(true);
    });

    test("should return `false` when `value` is less than 0 and `max` is omitted", async ({
        page,
    }) => {
        expect(await page.evaluate(() => inRange(-10, 20))).toBe(false);
    });
});
