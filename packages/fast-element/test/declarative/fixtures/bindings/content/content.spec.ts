import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("preserves server DOM through hydration and escapes reactive text", async ({
        page,
    }) => {
        const errors: string[] = [];
        page.on("pageerror", error => errors.push(error.message));
        let release!: () => void;
        const registration = new Promise<void>(resolve => {
            release = resolve;
        });
        await page.route("**/bindings/content/main.ts", async route => {
            await registration;
            await route.continue();
        });
        let serverNodes;
        try {
            await page.goto("/fixtures/bindings/content/", { waitUntil: "commit" });
            await page.waitForFunction(
                () =>
                    document.querySelector("test-element")?.shadowRoot &&
                    document.querySelector("test-element-unescaped")?.shadowRoot,
            );
            serverNodes = await page.evaluateHandle(() => {
                const host = document.querySelector("test-element")!;
                const root = host.shadowRoot!;
                const paragraph = document
                    .querySelector("test-element-unescaped")!
                    .shadowRoot!.querySelector("p")!;
                return {
                    host,
                    root,
                    text: Array.from(root.childNodes).find(
                        node => node.nodeType === Node.TEXT_NODE,
                    ),
                    paragraph,
                };
            });
            expect(
                await serverNodes.evaluate(({ host, root, paragraph }) => ({
                    attribute: host.getAttribute("text"),
                    text: root.textContent,
                    rawText: paragraph.textContent,
                    registered: customElements.get("test-element") !== undefined,
                })),
            ).toEqual({
                attribute: "Hello world",
                text: "Hello world",
                rawText: "Hello world",
                registered: false,
            });
        } finally {
            release();
        }
        await page.waitForFunction(() => (window as any).hydrationCompleted === true);
        expect(
            await serverNodes.evaluate(({ host, root, text, paragraph }) => ({
                root: host.shadowRoot === root,
                text: text?.parentNode === root && text.textContent === "Hello world",
                paragraph:
                    paragraph ===
                    document
                        .querySelector("test-element-unescaped")!
                        .shadowRoot!.querySelector("p"),
            })),
        ).toEqual({ root: true, text: true, paragraph: true });

        const text = "caf\u00e9 \u{1f600} &<>\"'\n  spaced";
        await page.locator("test-element").evaluate((element, value) => {
            element.setAttribute("text", value);
        }, text);
        await expect
            .poll(() =>
                page
                    .locator("test-element")
                    .evaluate(element => element.shadowRoot!.textContent),
            )
            .toBe(text);
        expect(await serverNodes.evaluate(({ root }) => root.children.length)).toBe(0);
        expect(errors).toEqual([]);
        await serverNodes.dispose();
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
        const errors: string[] = [];
        page.on("pageerror", error => errors.push(error.message));
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/content/");
        await hydrationCompleted;

        const customElement = page.locator("test-element-unescaped");

        expect(await customElement.locator("p").count()).toEqual(1);
        await expect(customElement).toHaveText("Hello world");

        await page.evaluate(() => {
            document.body.append(document.createElement("test-element-unescaped"));
        });
        const clientElement = page.locator("test-element-unescaped").nth(1);
        await expect(clientElement.locator("p")).toHaveCount(1);
        await expect(clientElement).toHaveText("Hello world");
        expect(errors).toEqual([]);
    });
});
