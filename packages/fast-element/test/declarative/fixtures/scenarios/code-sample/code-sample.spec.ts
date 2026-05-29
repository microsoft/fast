import { expect, test } from "@playwright/test";

test.describe("code sample auto-escape", () => {
    test.beforeEach(async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/scenarios/code-sample/");
        await hydrationCompleted;
    });

    test("bindings outside <code> still resolve", async ({ page }) => {
        const boundHeading = page.locator("code-display #bound");
        await expect(boundHeading).toHaveText("Hello");

        const afterParagraph = page.locator("code-display #after");
        await expect(afterParagraph).toHaveText("Hello world");
    });

    test("double-brace text inside <code> is preserved literally", async ({ page }) => {
        const codeBlock = page.locator("code-display #sample code");
        await expect(codeBlock).toHaveText("span {{greeting}} /span");
    });

    test("directive-tag text inside <code> is preserved literally", async ({ page }) => {
        const codeBlock = page.locator("code-display #sample-directive code");
        await expect(codeBlock).toHaveText('<f-when value="{{flag}}">wrapped</f-when>');
    });

    test("client-side binding text inside <code> is preserved literally", async ({
        page,
    }) => {
        const codeBlock = page.locator("code-display #sample-client code");
        await expect(codeBlock).toHaveText('button @click="{handler()}" /button');
    });

    test("no hydration errors occur with literal binding-like text", async ({ page }) => {
        const errors: string[] = await page.evaluate(
            () => (window as any).__hydrationErrors || [],
        );
        const hydrationErrors = errors.filter(
            (msg: string) =>
                msg.includes("Hydration") ||
                msg.includes("hydration") ||
                msg.includes("Binding") ||
                msg.includes("binding"),
        );
        expect(hydrationErrors).toHaveLength(0);
    });
});
