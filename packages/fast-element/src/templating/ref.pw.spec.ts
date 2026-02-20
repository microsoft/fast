import { expect, test } from "@playwright/test";

test.describe("the ref directive", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should capture an element reference", async ({ page }) => {
        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ref, html } = await import("/main.js");

            class Model {
                reference: any;
            }

            const template = html`
                <div id="test" ${ref("reference")}></div>
            `;

            const view = template.create();
            const model = new Model();

            view.bind(model);

            return {
                isDiv: model.reference instanceof HTMLDivElement,
                id: model.reference.id,
            };
        });

        expect(result.isDiv).toBe(true);
        expect(result.id).toBe("test");
    });

    test("should not throw if DOM stringified", async ({ page }) => {
        const didNotThrow = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ref, html } = await import("/main.js");

            class Model {
                reference: any;
            }

            const template = html`
                <div id="test" ${ref("reference")}></div>
            `;

            const view = template.create();
            const model = new Model();

            view.bind(model);

            try {
                JSON.stringify(model.reference);
                return true;
            } catch {
                return false;
            }
        });

        expect(didNotThrow).toBe(true);
    });
});
