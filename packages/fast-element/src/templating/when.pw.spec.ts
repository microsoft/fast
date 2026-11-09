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

    for (const templateIsBinding of [false, true]) {
        for (const elseTemplateIsBinding of [false, true]) {
            test(`evaluates only the selected branch with template binding ${templateIsBinding} and else binding ${elseTemplateIsBinding}`, async ({
                page,
            }) => {
                const result = await page.evaluate(
                    async ({ templateIsBinding, elseTemplateIsBinding }) => {
                        // @ts-expect-error: Client module.
                        const { when, html, Fake } = await import("/main.js");

                        const source = { condition: true };
                        const context = Fake.executionContext();
                        const template = html`template`;
                        const elseTemplate = html`else`;
                        const calls: string[] = [];
                        let correctArguments = true;
                        const recordCall = (
                            name: string,
                            actualSource: any,
                            actualContext: any,
                        ) => {
                            calls.push(name);
                            correctArguments &&=
                                actualSource === source && actualContext === context;
                        };
                        const expression = when(
                            (actualSource: any, actualContext: any) => {
                                recordCall("condition", actualSource, actualContext);
                                return actualSource.condition;
                            },
                            templateIsBinding
                                ? (actualSource: any, actualContext: any) => {
                                      recordCall("template", actualSource, actualContext);
                                      return template;
                                  }
                                : template,
                            elseTemplateIsBinding
                                ? (actualSource: any, actualContext: any) => {
                                      recordCall("else", actualSource, actualContext);
                                      return elseTemplate;
                                  }
                                : elseTemplate,
                        );
                        const callsAtCreation = calls.length;
                        const first = expression(source, context);
                        source.condition = false;
                        const second = expression(source, context);

                        return {
                            callsAtCreation,
                            correctArguments,
                            selectedTemplates:
                                first === template && second === elseTemplate,
                            calls,
                        };
                    },
                    { templateIsBinding, elseTemplateIsBinding },
                );

                const calls = ["condition"];
                if (templateIsBinding) {
                    calls.push("template");
                }
                calls.push("condition");
                if (elseTemplateIsBinding) {
                    calls.push("else");
                }

                expect(result).toEqual({
                    callsAtCreation: 0,
                    correctArguments: true,
                    selectedTemplates: true,
                    calls,
                });
            });
        }
    }

    test("refreshes conditional dependencies when the active branch changes", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { when, html, Observable, Updates } = await import("/main.js");

            const source: any = {};
            for (const propertyName of ["useFirst", "first", "second"]) {
                Observable.defineProperty(source, propertyName);
            }
            Object.assign(source, { useFirst: true, first: true, second: false });

            let evaluations = 0;
            const expression = when(
                (value: any) => {
                    evaluations++;
                    return value.useFirst ? value.first : value.second;
                },
                html`yes`,
                html`no`,
            );
            const host = document.createElement("div");
            document.body.append(host);
            const view = html`${expression}`.render(source, host);
            const snapshots = [host.textContent];
            const snapshot = async () => {
                await Updates.next();
                snapshots.push(host.textContent);
            };

            source.useFirst = false;
            await snapshot();
            source.second = true;
            await snapshot();
            source.first = false;
            await snapshot();
            source.useFirst = true;
            await snapshot();
            source.first = true;
            await snapshot();

            view.dispose();
            host.remove();
            return { snapshots, evaluations };
        });

        expect(result).toEqual({
            snapshots: ["yes", "no", "yes", "yes", "no", "yes"],
            evaluations: 5,
        });
    });
});
