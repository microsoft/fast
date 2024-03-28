import { expect, test } from "@playwright/test";
import type { parseQueryStringParams as parseQueryStringParamsType } from "./query.js";

declare const parseQueryStringParams: typeof parseQueryStringParamsType;
test.describe("parseQueryStringParams", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { parseQueryStringParams } from "/dist/query.js";
                globalThis.parseQueryStringParams = parseQueryStringParams;
            `,
        });

        await page.waitForFunction(() => "parseQueryStringParams" in globalThis);
    });

    test("basic query string", async ({ page }) => {
        const params = await page.evaluateHandle(() =>
            parseQueryStringParams("www.microsoft.com?a=12345&b=qwerty")
        );

        expect(await params.evaluate(p => p.size)).toBe(2);

        expect(await params.evaluate(p => p.get("a"))).toBe("12345");

        expect(await params.evaluate(p => p.get("b"))).toBe("qwerty");
    });

    test("query string not part of a full url", async ({ page }) => {
        const params = await page.evaluateHandle(() =>
            parseQueryStringParams("a=12345&b=qwerty")
        );

        expect(await params.evaluate(p => p.size)).toBe(2);

        expect(await params.evaluate(p => p.get("a"))).toBe("12345");

        expect(await params.evaluate(p => p.get("b"))).toBe("qwerty");
    });

    test("query string with encoding", async ({ page }) => {
        const params = await page.evaluateHandle(() =>
            parseQueryStringParams(
                "www.microsoft.com?a=12345&b=special%20characters%20like%20%26%20and%20%3D%20and%20%3F&c=and%20more%20foreign%20characters%20like%20%C3%A4%20and%20%C3%B6%20and%20%C3%BC"
            )
        );

        expect(await params.evaluate(p => p.size)).toBe(3);

        expect(await params.evaluate(p => p.get("a"))).toBe("12345");

        expect(await params.evaluate(p => p.get("b"))).toBe(
            "special characters like & and = and ?"
        );

        expect(await params.evaluate(p => p.get("c"))).toBe(
            "and more foreign characters like ä and ö and ü"
        );
    });

    test("undefined or empty input should return an empty Map", async ({ page }) => {
        const params1 = await page.evaluateHandle(() => parseQueryStringParams(""));

        expect(await params1.evaluate(p => p.size)).toBe(0);

        const params2 = await page.evaluateHandle(() =>
            parseQueryStringParams.call(null, undefined)
        );

        expect(await params2.evaluate(p => p.size)).toBe(0);
    });

    test("query string with no parameters should return an empty Map", async ({
        page,
    }) => {
        const params = await page.evaluateHandle(() =>
            parseQueryStringParams("qwertyuiopasdfghjklzxcvbnm")
        );

        expect(await params.evaluate(p => p.size)).toBe(0);
    });
});
