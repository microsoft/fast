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
                `,
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
                    () => template,
                );
                const r = expression(scope, Fake.executionContext());
                return r === template;
            });

            expect(result).toBe(true);
        });
    });

    test.describe("with a short-circuited condition", () => {
        test("renders when an observable short-circuited by && changes", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    html,
                    observable,
                    uniqueElementName,
                    Updates,
                    when,
                } =
                    // @ts-expect-error: Client module.
                    await import("/main.js");

                class TestElement extends FASTElement {
                    ready = false;
                    show!: boolean;

                    get isReady() {
                        return this.ready;
                    }
                }

                observable(TestElement.prototype, "show");

                const name = uniqueElementName();
                await TestElement.define({
                    name,
                    template: html`
                        ${when(
                            (x: any) => x.isReady && x.show,
                            html`
                                <span>shown</span>
                            `,
                        )}
                    `,
                });

                const element = document.createElement(name) as any;
                element.show = false;
                document.body.appendChild(element);

                await Updates.next();

                const initialText = element.shadowRoot.textContent.trim();

                element.ready = true;
                element.show = true;
                await Updates.next();

                const textAfterShow = element.shadowRoot.textContent.trim();

                element.show = false;
                await Updates.next();

                const textAfterHide = element.shadowRoot.textContent.trim();

                element.remove();

                return { initialText, textAfterShow, textAfterHide };
            });

            expect(result.initialText).toBe("");
            expect(result.textAfterShow).toBe("shown");
            expect(result.textAfterHide).toBe("");
        });

        test("survives repeated connect and disconnect cycles", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    html,
                    observable,
                    uniqueElementName,
                    Updates,
                    when,
                } =
                    // @ts-expect-error: Client module.
                    await import("/main.js");

                class TestElement extends FASTElement {
                    ready = false;
                    show!: boolean;

                    get isReady() {
                        return this.ready;
                    }
                }

                observable(TestElement.prototype, "show");

                const name = uniqueElementName();
                await TestElement.define({
                    name,
                    template: html`
                        ${when(
                            (x: any) => x.isReady && x.show,
                            html`
                                <span>shown</span>
                            `,
                        )}
                    `,
                });

                const element = document.createElement(name) as any;
                element.show = false;
                document.body.appendChild(element);

                await Updates.next();

                const errors: string[] = [];
                const texts: string[] = [];

                for (let i = 0; i < 3; i++) {
                    try {
                        element.remove();
                        element.show = true;
                        await Updates.next();

                        document.body.appendChild(element);
                        await Updates.next();

                        element.show = false;
                        await Updates.next();

                        texts.push(element.shadowRoot.textContent.trim());
                    } catch (e: any) {
                        errors.push(e.message);
                    }
                }

                element.ready = true;
                element.show = true;
                await Updates.next();

                const finalText = element.shadowRoot.textContent.trim();

                element.remove();

                return { errors, texts, finalText };
            });

            expect(result.errors).toEqual([]);
            expect(result.texts).toEqual(["", "", ""]);
            expect(result.finalText).toBe("shown");
        });

        test("does not re-evaluate itself in a loop", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    html,
                    observable,
                    uniqueElementName,
                    Updates,
                    when,
                } =
                    // @ts-expect-error: Client module.
                    await import("/main.js");

                let evaluations = 0;

                class TestElement extends FASTElement {
                    ready = false;
                    show!: boolean;

                    get isReady() {
                        return this.ready;
                    }
                }

                observable(TestElement.prototype, "show");

                const condition = (x: any) => {
                    evaluations++;
                    return x.isReady && x.show;
                };

                const name = uniqueElementName();
                await TestElement.define({
                    name,
                    template: html`
                        ${when(
                            condition,
                            html`
                                <span>shown</span>
                            `,
                        )}
                    `,
                });

                const element = document.createElement(name) as any;
                element.show = false;
                document.body.appendChild(element);

                await Updates.next();
                await Updates.next();
                await Updates.next();

                const evaluationsAfterConnect = evaluations;

                await Updates.next();
                await Updates.next();
                await Updates.next();

                const evaluationsWhenIdle = evaluations;

                element.remove();

                return { evaluationsAfterConnect, evaluationsWhenIdle };
            });

            expect(result.evaluationsAfterConnect).toBeLessThanOrEqual(2);
            expect(result.evaluationsWhenIdle).toBe(result.evaluationsAfterConnect);
        });
    });
});
