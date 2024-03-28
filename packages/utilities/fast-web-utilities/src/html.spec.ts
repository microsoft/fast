import { expect, test } from "@playwright/test";
import type {
    convertStylePropertyPixelsToNumber as convertStylePropertyPixelsToNumberType,
    getClientRectWithMargin as getClientRectWithMarginType,
} from "./html.js";

declare const getClientRectWithMargin: typeof getClientRectWithMarginType;
test.describe("getClientRectWithMargin", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { getClientRectWithMargin } from "/dist/html.js";
                globalThis.getClientRectWithMargin = getClientRectWithMargin;
            `,
        });

        await page.waitForFunction(() => "getClientRectWithMargin" in globalThis);
    });

    test("should correctly manage undefined and null values", async ({ page }) => {
        await expect(
            page.evaluate(() => getClientRectWithMargin(null))
        ).resolves.not.toThrow();

        await expect(
            page.evaluate(() => getClientRectWithMargin(undefined))
        ).resolves.not.toThrow();
    });

    test("should correctly return computed client rect with margin values", async ({
        page,
    }) => {
        const mockRect = {
            width: 120,
            height: 120,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        };

        const expectedRect: Partial<DOMRect> = Object.assign({}, mockRect, {
            width: 160,
            height: 140,
        });

        await page.evaluate(
            ({ mockRect }) => {
                Element.prototype.getBoundingClientRect = (): any => {
                    return mockRect;
                };
            },
            { mockRect }
        );

        await page.setContent(/* html */ `
            <div id="element" style="margin: 10px 20px;"></div>
        `);

        const element = page.locator("#element");

        const clientRectWithMargin = await element.evaluate((node: HTMLElement) =>
            getClientRectWithMargin(node)
        );

        for (const key in expectedRect) {
            expect(clientRectWithMargin).toHaveProperty(key, (expectedRect as any)[key]);
        }
    });
});

declare const convertStylePropertyPixelsToNumber: typeof convertStylePropertyPixelsToNumberType;
test.describe("convertStylePropertyPixelsToNumber", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { convertStylePropertyPixelsToNumber } from "/dist/html.js";
                globalThis.convertStylePropertyPixelsToNumber = convertStylePropertyPixelsToNumber;
            `,
        });

        await page.waitForFunction(() =>
            "convertStylePropertyPixelsToNumber" in globalThis
        );
    });

    test("should correctly manage undefined and null values", async ({ page }) => {
        await expect(
            page.evaluate(() => {
                convertStylePropertyPixelsToNumber(null, null);
            })
        ).resolves.not.toThrow();

        await expect(
            page.evaluate(() => {
                convertStylePropertyPixelsToNumber(undefined, null);
            })
        ).resolves.not.toThrow();

        await expect(
            page.evaluate(() => {
                convertStylePropertyPixelsToNumber(undefined, undefined);
            })
        ).resolves.not.toThrow();
    });

    test("should correctly convert an element's computed style property pixel value and return a number", async ({
        page,
    }) => {
        await page.setContent(/* html */ `
            <div id="element" style="margin: 20px 5px 12px 8px;"></div>
        `);

        const element = page.locator("#element");

        expect(
            await element.evaluate((node: HTMLElement) =>
                convertStylePropertyPixelsToNumber(
                    window.getComputedStyle(node),
                    "margin-top"
                )
            )
        ).toBe(20);

        expect(
            await element.evaluate((node: HTMLElement) =>
                convertStylePropertyPixelsToNumber(
                    window.getComputedStyle(node),
                    "margin-bottom"
                )
            )
        ).toBe(12);

        expect(
            await element.evaluate((node: HTMLElement) =>
                convertStylePropertyPixelsToNumber(
                    window.getComputedStyle(node),
                    "margin-left"
                )
            )
        ).toBe(8);

        expect(
            await element.evaluate((node: HTMLElement) =>
                convertStylePropertyPixelsToNumber(
                    window.getComputedStyle(node),
                    "margin-right"
                )
            )
        ).toBe(5);
    });
});
