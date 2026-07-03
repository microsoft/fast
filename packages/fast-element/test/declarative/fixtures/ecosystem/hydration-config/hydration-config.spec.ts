import { expect, test } from "@playwright/test";

test.describe("Hydration configuration", () => {
    test("hydrates declarative shadow DOM appended after completion", async ({
        page,
    }) => {
        test.skip(
            !!process.env.FAST_WEBUI_INTEGRATION,
            "WebUI-rendered late Declarative Shadow DOM does not preserve this hydration marker attribute",
        );

        await page.goto("/fixtures/ecosystem/hydration-config/");
        await page.waitForFunction(() => (window as any).hydrationCompleted === true);

        const supportsSetHTMLUnsafe = await page.evaluate(
            () => "setHTMLUnsafe" in Element.prototype,
        );
        test.skip(
            !supportsSetHTMLUnsafe,
            "Declarative Shadow DOM setHTMLUnsafe() is not supported.",
        );

        const result = await page.evaluate(async () => {
            const rawFixtureHtml = await fetch(location.href).then(response =>
                response.text(),
            );

            const lateTemplateMatch = rawFixtureHtml.match(
                /<template\s+id="late-hydration-markup"[^>]*>/i,
            );

            if (lateTemplateMatch === null || lateTemplateMatch.index === undefined) {
                throw new Error("Late hydration markup was not generated.");
            }

            const lateMarkupStart = lateTemplateMatch.index + lateTemplateMatch[0].length;
            const templateTag = /<\/?template\b[^>]*>/gi;
            templateTag.lastIndex = lateMarkupStart;

            let depth = 1;
            let closingTemplateIndex = -1;
            let templateMatch: RegExpExecArray | null;

            while ((templateMatch = templateTag.exec(rawFixtureHtml)) !== null) {
                depth += templateMatch[0].startsWith("</") ? -1 : 1;

                if (depth === 0) {
                    closingTemplateIndex = templateMatch.index;
                    break;
                }
            }

            if (closingTemplateIndex === -1) {
                throw new Error("Late hydration markup template was not closed.");
            }

            const lateMarkup = rawFixtureHtml
                .slice(lateMarkupStart, closingTemplateIndex)
                .trim();
            const container = document.createElement("div");
            document.body.appendChild(container);
            (container as any).setHTMLUnsafe(lateMarkup);

            const element = container.firstElementChild as any;
            customElements.upgrade(container);
            for (let i = 0; element.$fastController === void 0 && i < 10; i++) {
                await new Promise(resolve => requestAnimationFrame(resolve));
            }
            const isHydrated = await element.$fastController.isHydrated;
            const label = element.shadowRoot!.querySelector("#label")!;
            const serverNodeAttribute = label.getAttribute("data-server-node");

            element.label = "Updated";
            await new Promise(resolve => requestAnimationFrame(resolve));
            await new Promise(resolve => setTimeout(resolve, 0));

            return {
                isHydrated,
                serverNodeAttribute,
                text: label.textContent,
            };
        });

        expect(result.isHydrated).toBe(true);
        expect(result.serverNodeAttribute).toBe("late");
        expect(result.text).toBe("Updated");
    });
});
