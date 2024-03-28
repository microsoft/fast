import { expect, test } from "@playwright/test";
import { findLastIndex } from "./array.js";

test.describe("findLastIndex", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { findLastIndex } from "/dist/array.js";
                globalThis.findLastIndex = findLastIndex;
            `,
        });

        await page.waitForFunction(() => "findLastIndex" in globalThis);
    });

    test("should return -1 when array is empty", async ({ page }) => {
        expect(
            await page.evaluate(() => {
                return findLastIndex([], () => true);
            })
        ).toBe(-1);
    });

    test("should return the last valid item that matches the predicate", async ({
        page,
    }) => {
        const array = [
            { value: true },
            { value: false },
            { value: true },
            { value: false },
        ];

        const result = await page.evaluate(array => {
            return findLastIndex(array, v => v.value);
        }, array);

        expect(result).toBe(2);
    });

    test("should return -1 when no items match the predicate", async ({ page }) => {
        const array = [
            { value: false },
            { value: false },
            { value: false },
            { value: false },
        ];

        const result = await page.evaluate(array => {
            return findLastIndex(array, v => v.value);
        }, array);

        expect(result).toBe(-1);
    });
});
