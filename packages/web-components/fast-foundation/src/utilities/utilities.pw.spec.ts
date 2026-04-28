import { Direction } from "@microsoft/fast-web-utilities";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { getDirection } from "./direction.js";
import { whitespaceFilter } from "./whitespace-filter.js";

test.describe("Utilities", () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
    });

    test.describe("getDirection", () => {
        const content = `
            const Direction = ${JSON.stringify(Direction)};
            const getDirection = ${getDirection.toString()};
        `;

        test.beforeEach(async () => {
            await page.addScriptTag({ content });
        });

        test('should return "ltr" for an element with no `dir` attribute', async () => {
            await page.setContent(/* html */ `
                <div></div>
            `);

            const element = page.locator("div");

            expect(
                await element.evaluate<string, HTMLElement>(node => getDirection(node))
            ).toBe(Direction.ltr);
        });

        test('should return "ltr" for an element with `dir` attribute of "ltr"', async () => {
            await page.setContent(/* html */ `
                <div dir="ltr"></div>
            `);

            const element = page.locator("div");

            expect(
                await element.evaluate<string, HTMLElement>(node => getDirection(node))
            ).toBe(Direction.ltr);
        });

        test('should return "rtl" for an element with a `dir` attribute of "rtl"', async () => {
            await page.setContent(/* html */ `
                <div dir="rtl"></div>
            `);

            const element = page.locator("div");

            expect(
                await element.evaluate<string, HTMLElement>(node => getDirection(node))
            ).toBe(Direction.rtl);
        });

        test('should return "ltr" for an element with a `dir` property of "ltr"', async () => {
            await page.setContent(/* html */ `
                <div></div>
            `);

            const element = page.locator("div");

            await element.evaluate<void, HTMLElement>(node => {
                node.dir = "ltr";
            });

            expect(
                await element.evaluate<string, HTMLElement>(node => getDirection(node))
            ).toBe(Direction.ltr);
        });

        test('should return "rtl" for an element with a `dir` property of "rtl"', async () => {
            await page.setContent(/* html */ `
                <div></div>
            `);

            const element = page.locator("div");

            await element.evaluate<void, HTMLElement>(node => {
                node.dir = "rtl";
            });

            expect(
                await element.evaluate<string, HTMLElement>(node => getDirection(node))
            ).toBe(Direction.rtl);
        });
    });

    test.describe("whitespaceFilter", () => {
        const content = `const whitespaceFilter = ${whitespaceFilter.toString()}`;

        test.beforeEach(async () => {
            await page.addScriptTag({ content });
        });

        test("should return true when given an element node", async () => {
            await page.setContent(/* html */ `
                <span>
                    span
                </span>
            `);

            const element = page.locator("span");

            expect(await element.evaluate(node => whitespaceFilter(node))).toBeTruthy();
        });

        test("should return true when given a text node", async () => {
            await page.setContent(/* html */ `
                <span>
                    text
                </span>
            `);

            const element = page.locator("span");

            expect(
                await element.evaluate(node => whitespaceFilter(node.childNodes[0]))
            ).toBeTruthy();
        });

        test("should return false when given a text node which only contains spaces", async () => {
            await page.setContent(/* html */ `
                <span>          </span>
            `);

            const element = page.locator("span");

            expect(
                await element.evaluate(node => whitespaceFilter(node.childNodes[0]))
            ).toBeFalsy();
        });
    });
});
