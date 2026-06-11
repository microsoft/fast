import { expect, test } from "@playwright/test";

test.describe("Hydration configuration", () => {
    test("hydrates declarative shadow DOM appended after completion", async ({
        page,
    }) => {
        await page.goto("/fixtures/ecosystem/hydration-config/");
        await page.waitForFunction(() => (window as any).hydrationCompletionCount >= 1);

        const supportsSetHTMLUnsafe = await page.evaluate(
            () => "setHTMLUnsafe" in Element.prototype,
        );
        test.skip(
            !supportsSetHTMLUnsafe,
            "Declarative Shadow DOM setHTMLUnsafe() is not supported.",
        );

        const result = await page.evaluate(async () => {
            const container = document.createElement("div");
            document.body.appendChild(container);
            (container as any).setHTMLUnsafe(`
                <hydration-config-element label="Late">
                    <template shadowrootmode="open">
                        <span id="label" data-server-node="late"><!--fe:b-->Late<!--fe:/b--></span>
                    </template>
                </hydration-config-element>
            `);

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
                completionCount: (window as any).hydrationCompletionCount,
                isHydrated,
                serverNodeAttribute,
                text: label.textContent,
            };
        });

        expect(result.isHydrated).toBe(true);
        expect(result.serverNodeAttribute).toBe("late");
        expect(result.text).toBe("Updated");
        expect(result.completionCount).toBeGreaterThanOrEqual(2);
    });
});
