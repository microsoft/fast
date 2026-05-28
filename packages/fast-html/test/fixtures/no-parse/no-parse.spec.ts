import { expect, test } from "@playwright/test";

test.describe("f-no-parse", () => {
    test.beforeEach(async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/no-parse/");
        await hydrationCompleted;
    });

    test("bindings outside f-no-parse still resolve", async ({ page }) => {
        const boundHeading = page.locator("code-display #bound");
        await expect(boundHeading).toHaveText("Hello");

        const afterParagraph = page.locator("code-display #after");
        await expect(afterParagraph).toHaveText("Hello world");
    });

    test("double-brace text inside f-no-parse is preserved literally", async ({
        page,
    }) => {
        const codeBlock = page.locator("code-display #sample code");
        await expect(codeBlock).toHaveText("span {{greeting}} /span");
    });

    test("template directives inside f-no-parse are preserved literally", async ({
        page,
    }) => {
        const codeBlock = page.locator("code-display #sample-directive code");
        await expect(codeBlock).toHaveText('<f-when value="{{flag}}">wrapped</f-when>');
    });

    test("client-side bindings inside f-no-parse are preserved literally", async ({
        page,
    }) => {
        const codeBlock = page.locator("code-display #sample-client code");
        await expect(codeBlock).toHaveText('button @click="{handler()}" /button');
    });

    test("f-no-parse attribute is stripped from rendered output", async ({ page }) => {
        const codeBlock = page.locator("code-display #sample code");
        await expect(codeBlock).not.toHaveAttribute("f-no-parse", /.*/);
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
