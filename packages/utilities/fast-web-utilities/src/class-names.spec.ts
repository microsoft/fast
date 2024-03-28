import { expect, test } from "@playwright/test";
import type { classNames as classNamesType } from "./class-names.js";

declare const classNames: typeof classNamesType;
test.describe("classNames", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { classNames } from "/dist/class-names.js";
                globalThis.classNames = classNames;
            `,
        });

        await page.waitForFunction(() => "classNames" in globalThis);
    });

    test("should return a string when invalid values are provided", async ({ page }) => {
        const values = [undefined, null, NaN, Infinity, new Date(), 1];

        expect(await page.evaluate(() => classNames())).toBe("");

        for (const value of values) {
            expect(await page.evaluate(v => classNames.call(null, v), value)).toBe("");

            expect(
                await page.evaluate(v => classNames.call(null, [v, true]), value)
            ).toBe("");
        }
    });

    test("should return a single string argument unmodified", async ({ page }) => {
        expect(await page.evaluate(() => classNames("hello"))).toBe("hello");
    });

    test("should join multiple string arguments together", async ({ page }) => {
        expect(await page.evaluate(() => classNames("hello", "world"))).toBe(
            "hello world"
        );
    });

    test("should return the return value of a single function", async ({ page }) => {
        expect(await page.evaluate(() => classNames(() => "hello"))).toBe("hello");
    });

    test("should join the return value of a multiple functions", async ({ page }) => {
        expect(
            await page.evaluate(() =>
                classNames(
                    () => "hello",
                    () => "world"
                )
            )
        ).toBe("hello world");
    });

    test("should return a the first index of an array arg when the second index is truthy", async ({
        page,
    }) => {
        expect(await page.evaluate(() => classNames(["foo", true]))).toBe("foo");
    });

    test("should return a single function return value of an array arg when the second index is truthy", async ({
        page,
    }) => {
        expect(await page.evaluate(() => classNames([(): string => "foo", true]))).toBe(
            "foo"
        );
    });

    test("should join multiple array index when all second indexes are true", async ({
        page,
    }) => {
        expect(await page.evaluate(() => classNames(["foo", true], ["bar", true]))).toBe(
            "foo bar"
        );
    });

    test("should omit first indexes of an array argument when the second index is falsey", async ({
        page,
    }) => {
        expect(
            await page.evaluate(() =>
                classNames(["foo", true], ["bar", false], ["bat", true])
            )
        ).toBe("foo bat");
    });

    test("should join string, function, and object arguments", async ({ page }) => {
        expect(
            await page.evaluate(() =>
                classNames(
                    "hello",
                    ["foo", true],
                    ["bar", false],
                    [(): string => "bat", true],
                    "world",
                    () => "earth"
                )
            )
        ).toBe("hello foo bat world earth");
    });
});
