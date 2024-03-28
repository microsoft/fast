import type { JSHandle } from "@playwright/test";
import { expect, test } from "@playwright/test";
import type {
    canUseCssGrid as canUseCssGridType,
    canUseFocusVisible as canUseFocusVisibleType,
    canUseForcedColors as canUseForcedColorsType,
    getDisplayedNodes as getDisplayedNodesType,
    isHTMLElement as isHTMLElementType,
} from "./dom.js";

declare const isHTMLElement: typeof isHTMLElementType;

test.describe("isHTMLElement", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { isHTMLElement } from "/dist/dom.js";
                globalThis.isHTMLElement = isHTMLElement;
            `,
        });

        await page.setContent(/* html */ `
            <div id="element">Child</div>
        `);

        await page.waitForFunction(() => "isHTMLElement" in globalThis);
    });

    test("should return true if all arguments are HTML elements", async ({ page }) => {
        const result = await page.locator("#element").evaluate(node => {
            return isHTMLElement(node);
        });

        expect(result).toBe(true);
    });

    test("should return false if argument is an empty NodeList", async ({ page }) => {
        expect(
            await page.locator("#element").evaluate(node => {
                return isHTMLElement(node.childNodes);
            })
        ).toBe(false);

        expect(
            await page.evaluate(() => {
                return isHTMLElement(document.querySelectorAll("foo"));
            })
        ).toBe(false);
    });

    test("should return false if all arguments are NOT HTML elements", async ({
        page,
    }) => {
        const values = [false, 1, "foo", {}, [], null];

        for (const value of values) {
            expect(await page.evaluate(v => isHTMLElement(v), value)).toBe(false);
        }
    });
});

declare const getDisplayedNodes: typeof getDisplayedNodesType;
test.describe("getDisplayedNodes", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { getDisplayedNodes } from "/dist/dom.js";
                globalThis.getDisplayedNodes = getDisplayedNodes;
            `,
        });

        await page.setContent(/* html */ `
            <div id="element">Child</div>
        `);

        await page.waitForFunction(() => "getDisplayedNodes" in globalThis);
    });

    test("should not throw if both arguments are null or undefined", async ({ page }) => {
        expect(
            page.evaluate(() => {
                getDisplayedNodes(null, null);
            })
        ).resolves.not.toThrow();

        await expect(
            page.evaluate(() => {
                getDisplayedNodes(undefined, undefined);
            })
        ).resolves.not.toThrow();
    });
});

declare const canUseFocusVisible: typeof canUseFocusVisibleType;
declare let callCount: number;
test.describe("canUseFocusVisible", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { canUseFocusVisible } from "/dist/dom.js";
                globalThis.canUseFocusVisible = canUseFocusVisible;
            `,
        });

        await page.setContent(/* html */ `
            <div id="element">Child</div>
        `);

        await page.waitForFunction(() => "canUseFocusVisible" in globalThis);
    });

    test("should not throw", async ({ page }) => {
        await expect(page.evaluate(() => canUseFocusVisible())).resolves.not.toThrow();
    });

    test("should return true if the environment supports focus-visible selectors", async ({
        page,
    }) => {
        expect(await page.evaluate(() => canUseFocusVisible())).toBe(true);
    });

    test("should use a nonce if once is present on the page", async ({ page }) => {
        const nonce: string = "foo-nonce";

        await page.waitForLoadState("domcontentloaded");

        const mutations: JSHandle<Record<string, any>> = await page.evaluateHandle(
            ({ nonce }) => {
                const metaEl = document.createElement("meta");
                metaEl.setAttribute("property", "csp-nonce");
                metaEl.setAttribute("content", nonce);
                document.head.append(metaEl);

                return new Promise(resolve => {
                    const mutationObserver = new MutationObserver(
                        (mutationsList: MutationRecord[]) => resolve(mutationsList)
                    );

                    mutationObserver.observe(document.head, {
                        childList: true,
                        subtree: true,
                    });

                    canUseFocusVisible();
                });
            },
            { nonce }
        );

        expect(await mutations.evaluate(m => m.length)).toBeGreaterThan(0);

        expect(await mutations.evaluate(m => m[0].addedNodes.length)).toBe(1);

        expect(await mutations.evaluate(m => m[0].addedNodes.item(0)?.nonce)).toBe(nonce);
    });

    test("should cache the result for subsequent calls", async ({ page }) => {
        await page.addScriptTag({
            type: "module",
            content: `
                const realAppendChild = document.head.appendChild;
                globalThis.callCount = 0;

                Object.defineProperty(document.head, "appendChild", {
                    value: (node) => {
                        callCount++;
                        realAppendChild.call(document.head, node);
                    },
                    configurable: true,
                });
            `,
        });

        await page.evaluate(() => canUseFocusVisible());

        expect(await page.evaluate(() => callCount)).toBe(1);

        await page.evaluate(() => canUseFocusVisible());

        expect(await page.evaluate(() => callCount)).toBe(1);

        await page.evaluate(() => canUseFocusVisible());

        expect(await page.evaluate(() => callCount)).toBe(1);

        await page.evaluate(() => canUseFocusVisible());

        expect(await page.evaluate(() => callCount)).toBe(1);
    });
});

declare const canUseCssGrid: typeof canUseCssGridType;
test.describe("canUseCssGrid", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { canUseCssGrid } from "/dist/dom.js";
                globalThis.canUseCssGrid = canUseCssGrid;
            `,
        });

        await page.waitForFunction(() => "canUseCssGrid" in globalThis);
    });

    test("should not throw", async ({ page }) => {
        await expect(
            page.evaluate(() => {
                canUseCssGrid();
            })
        ).resolves.not.toThrow();
    });
});

declare const canUseForcedColors: typeof canUseForcedColorsType;
test.describe("canUseForcedColors", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        await page.addScriptTag({
            type: "module",
            content: `
                import { canUseForcedColors } from "/dist/dom.js";
                globalThis.canUseForcedColors = canUseForcedColors;
            `,
        });

        await page.waitForFunction(() => "canUseForcedColors" in globalThis);
    });

    test("should return true if forced color is enabled", async ({ page }) => {
        // Force the matchMedia function to return true
        await page.addScriptTag({
            type: "module",
            content: `
                window.matchMedia = (query) => ({ matches: true, media: query });
            `,
        });

        expect(await page.evaluate(() => canUseForcedColors())).toBe(true);
    });

    test("should return false if forced color is not enabled", async ({ page }) => {
        // Force the matchMedia function to return false
        await page.addScriptTag({
            type: "module",
            content: `
                window.matchMedia = (query) => ({ matches: false, media: query });
            `,
        });

        expect(await page.evaluate(() => canUseForcedColors())).toBe(false);
    });
});
