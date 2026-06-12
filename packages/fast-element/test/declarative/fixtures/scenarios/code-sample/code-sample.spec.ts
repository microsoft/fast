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

    test("literal <f-when> tag inside <code> is preserved as text", async ({ page }) => {
        const codeBlock = page.locator("code-display #sample-directive code");
        await expect(codeBlock).toHaveText('<f-when value="{{flag}}">wrapped</f-when>');

        // The directive must not have been activated as a real element.
        const directive = codeBlock.locator("f-when");
        await expect(directive).toHaveCount(0);
    });

    test("uppercase <F-When> tag inside <code> is also escaped", async ({ page }) => {
        // Browsers normalise tag names to lowercase, so an unescaped
        // `<F-When>` would otherwise become a live `<f-when>` element
        // after DOM round-trip and re-activate the directive.
        const codeBlock = page.locator("code-display #sample-directive-uppercase code");
        await expect(codeBlock).toHaveText('<F-When value="{{flag}}">cased</F-When>');
        const directive = codeBlock.locator("f-when");
        await expect(directive).toHaveCount(0);
    });

    test("literal <f-repeat> tag inside <code> is preserved as text", async ({
        page,
    }) => {
        const codeBlock = page.locator("code-display #sample-directive-repeat code");
        await expect(codeBlock).toHaveText('<f-repeat value="{{items}}">i</f-repeat>');
        const directive = codeBlock.locator("f-repeat");
        await expect(directive).toHaveCount(0);
    });

    test("single-brace attribute-binding text inside <code> is preserved literally", async ({
        page,
    }) => {
        const codeBlock = page.locator("code-display #sample-client code");
        await expect(codeBlock).toHaveText('button @click="{handler()}" /button');
    });

    test("real <button> element inside <code> renders as a live DOM element", async ({
        page,
    }) => {
        const codeBlock = page.locator("code-display #sample-real-button code");
        // Surrounding text plus the button's text are both visible.
        await expect(codeBlock).toHaveText("Try: {{greeting}}");

        // The button is a real child element — not text — and its
        // binding-like attribute is preserved as literal characters
        // rather than being wired up as a FAST binding.
        const button = codeBlock.locator("button.demo-btn");
        await expect(button).toHaveCount(1);
        await expect(button).toHaveText("{{greeting}}");
        await expect(button).toHaveAttribute("data-x", "{{greeting}}");
    });

    test("real custom element inside <code> renders as a live DOM element", async ({
        page,
    }) => {
        const codeBlock = page.locator("code-display #sample-custom-element code");
        await expect(codeBlock).toHaveText("Use: label");

        const widget = codeBlock.locator("my-demo-widget");
        await expect(widget).toHaveCount(1);
        await expect(widget).toHaveText("label");
        await expect(widget).toHaveAttribute("data-x", "{{greeting}}");
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
