import { expect, test } from "@playwright/test";

test.describe("The 'when' template function", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("returns an expression", async ({ page }) => {
        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { when, html } = await import("/main.js");

            const expression = when(
                () => true,
                html`
                    test
                `
            );
            return typeof expression;
        });

        expect(result).toBe("function");
    });

    test.describe("expression", () => {
        test("returns a template when the condition binding is true", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { when, html, Fake } = await import("/main.js");

                const scope = {};
                const template = html`
                    template1
                `;
                const expression = when(() => true, template);
                const r = expression(scope, Fake.executionContext());
                return r === template;
            });

            expect(result).toBe(true);
        });

        test("returns a template when the condition is statically true", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { when, html, Fake } = await import("/main.js");

                const scope = {};
                const template = html`
                    template1
                `;
                const expression = when(true, template);
                const r = expression(scope, Fake.executionContext());
                return r === template;
            });

            expect(result).toBe(true);
        });

        test("returns null when the condition binding is false and no 'else' template is provided", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { when, html, Fake } = await import("/main.js");

                const scope = {};
                const template = html`
                    template1
                `;
                const expression = when(() => false, template);
                return expression(scope, Fake.executionContext());
            });

            expect(result).toBe(null);
        });

        test("returns null when the condition is statically false and no 'else' template is provided", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { when, html, Fake } = await import("/main.js");

                const scope = {};
                const template = html`
                    template1
                `;
                const expression = when(false, template);
                return expression(scope, Fake.executionContext());
            });

            expect(result).toBe(null);
        });

        test("returns the 'else' template when the condition binding is false and a 'else' template is provided", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { when, html, Fake } = await import("/main.js");

                const scope = {};
                const template = html`
                    template1
                `;
                const template2 = html`
                    template2
                `;
                const expression = when(() => false, template, template2);
                const r = expression(scope, Fake.executionContext());
                return r === template2;
            });

            expect(result).toBe(true);
        });

        test("returns the 'else' template when the condition is statically false and a 'else' template is provided", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { when, html, Fake } = await import("/main.js");

                const scope = {};
                const template = html`
                    template1
                `;
                const template2 = html`
                    template2
                `;
                const expression = when(false, template, template2);
                const r = expression(scope, Fake.executionContext());
                return r === template2;
            });

            expect(result).toBe(true);
        });

        test("evaluates a template expression to get the template, if provided", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { when, html, Fake } = await import("/main.js");

                const scope = {};
                const template = html`
                    template1
                `;
                const expression = when(
                    () => true,
                    () => template
                );
                const r = expression(scope, Fake.executionContext());
                return r === template;
            });

            expect(result).toBe(true);
        });
    });
});
