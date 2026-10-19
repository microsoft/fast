import { expect, test } from "@playwright/test";
import type { FASTElement } from "@microsoft/fast-element";

test.describe("f-template", async () => {
    test("preserves comment binding syntax before client JavaScript runs", async ({
        browser,
        baseURL,
    }) => {
        const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
        try {
            const page = await context.newPage();
            await page.goto("/fixtures/bindings/content/");
            const element = page.locator("test-element");
            await expect(element).toHaveText("Hello world");
            const comments = await element.evaluate(node =>
                Array.from(node.shadowRoot?.childNodes ?? [])
                    .filter(child => child.nodeType === Node.COMMENT_NODE)
                    .map(child => child.nodeValue),
            );
            expect(comments).toContain(" {{ignored}} ");
        } finally {
            await context.close();
        }
    });
    test("hydrates a literal comment beside a live content binding", async ({ page }) => {
        await page.goto("/fixtures/bindings/content/");
        await page.waitForFunction(
            () =>
                (window as Window & { hydrationCompleted?: boolean }).hydrationCompleted,
        );
        const element = page.locator("test-element");
        expect(
            await element.evaluate(
                node => (node as FASTElement).$fastController.isHydrated,
            ),
        ).toBe(true);
        await expect(element).toHaveText("Hello world");
        const comments = () =>
            element.evaluate(node =>
                Array.from(node.shadowRoot?.childNodes ?? [])
                    .filter(child => child.nodeType === Node.COMMENT_NODE)
                    .map(child => child.nodeValue),
            );
        expect(await comments()).toContain(" {{ignored}} ");

        await element.evaluate(node => node.setAttribute("text", "Hello pluto"));

        await expect(element).toHaveText("Hello pluto");
        expect(await comments()).toContain(" {{ignored}} ");
    });
    test("create a binding", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/content/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");

        await expect(await customElement.getAttribute("text")).toEqual("Hello world");
        await expect(customElement).toHaveText("Hello world");

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");
            customElement.item(0)?.setAttribute("text", "Hello pluto");
        });

        await expect(await customElement.getAttribute("text")).toEqual("Hello pluto");
        await expect(customElement).toHaveText("Hello pluto");
    });
    test("create an unescaped binding", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/content/");
        await hydrationCompleted;

        const customElement = page.locator("test-element-unescaped");

        expect(await customElement.locator("p").count()).toEqual(1);
        await expect(customElement).toHaveText("Hello world");
    });
});
