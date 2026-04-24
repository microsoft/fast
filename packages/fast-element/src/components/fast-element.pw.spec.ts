import { expect, test } from "@playwright/test";

test.describe("FASTElement", () => {
    test("instanceof checks should provide TypeScript support for HTMLElement and FASTElement methods and properties", async ({
        page,
    }) => {
        await page.goto("/");

        const hasProperties = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement } = await import("/main.js");

            // This test is designed to test TypeScript support and runtime behavior.
            // A 'failure' will prevent the test from compiling or running correctly.
            const myElement: unknown = undefined;

            if (myElement instanceof FASTElement) {
                // These property accesses should be valid at compile time
                // and the properties should exist at runtime
                return "$fastController" in myElement && "querySelectorAll" in myElement;
            }

            return true; // Test passes if the element is not an instance
        });

        expect(hasProperties).toBe(true);
    });

    test.describe("define with extensions", () => {
        test("should call extensions with the definition when using method style", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const extensionCalls: string[] = [];

                class TestElement extends FASTElement {}

                const elName = uniqueElementName();
                const extension = (def: any) => {
                    extensionCalls.push(def.name);
                };

                await TestElement.define({ name: elName }, [extension]);

                return {
                    callCount: extensionCalls.length,
                    receivedName: extensionCalls[0],
                    expectedName: elName,
                };
            });

            expect(result.callCount).toBe(1);
            expect(result.receivedName).toBe(result.expectedName);
        });

        test("should call extensions with the definition when using static style", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const extensionCalls: string[] = [];

                class TestElement extends FASTElement {}

                const elName = uniqueElementName();
                const extension = (def: any) => {
                    extensionCalls.push(def.name);
                };

                await FASTElement.define(TestElement, { name: elName }, [extension]);

                return {
                    callCount: extensionCalls.length,
                    receivedName: extensionCalls[0],
                    expectedName: elName,
                };
            });

            expect(result.callCount).toBe(1);
            expect(result.receivedName).toBe(result.expectedName);
        });

        test("should call multiple extensions in order", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const calls: number[] = [];

                class TestElement extends FASTElement {}

                await TestElement.define({ name: uniqueElementName() }, [
                    () => calls.push(1),
                    () => calls.push(2),
                    () => calls.push(3),
                ]);

                return calls;
            });

            expect(result).toEqual([1, 2, 3]);
        });

        test("should call extensions before platform registration", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                let wasDefinedDuringExtension = false;

                class TestElement extends FASTElement {}

                const elName = uniqueElementName();

                await TestElement.define({ name: elName }, [
                    () => {
                        wasDefinedDuringExtension =
                            customElements.get(elName) !== undefined;
                    },
                ]);

                const isDefinedAfter = customElements.get(elName) !== undefined;

                return { wasDefinedDuringExtension, isDefinedAfter };
            });

            expect(result.wasDefinedDuringExtension).toBe(false);
            expect(result.isDefinedAfter).toBe(true);
        });

        test("should work with an empty extensions array", async ({ page }) => {
            await page.goto("/");

            const isDefined = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                class TestElement extends FASTElement {}

                const elName = uniqueElementName();
                await TestElement.define({ name: elName }, []);

                return customElements.get(elName) !== undefined;
            });

            expect(isDefined).toBe(true);
        });

        test("should pass a FASTElementDefinition to the extension", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, FASTElementDefinition, uniqueElementName } =
                    await import("/main.js");

                let receivedDef: any = null;

                class TestElement extends FASTElement {}

                const elName = uniqueElementName();
                await TestElement.define({ name: elName }, [
                    def => {
                        receivedDef = def;
                    },
                ]);

                return {
                    isDefinitionInstance: receivedDef instanceof FASTElementDefinition,
                    hasName: receivedDef?.name === elName,
                    hasType: typeof receivedDef?.type === "function",
                };
            });

            expect(result.isDefinitionInstance).toBe(true);
            expect(result.hasName).toBe(true);
            expect(result.hasType).toBe(true);
        });

        test("factory pattern should work with extensions", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, uniqueElementName } = await import("/main.js");

                const calls: string[] = [];

                function myPlugin() {
                    return (def: any) => {
                        calls.push(`plugin:${def.name}`);
                    };
                }

                class TestElement extends FASTElement {}

                const elName = uniqueElementName();
                await TestElement.define({ name: elName }, [myPlugin()]);

                return {
                    callCount: calls.length,
                    firstCall: calls[0],
                    expectedCall: `plugin:${elName}`,
                };
            });

            expect(result.callCount).toBe(1);
            expect(result.firstCall).toBe(result.expectedCall);
        });

        test("should resolve template resolvers after extensions and before registration", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, html, uniqueElementName } = await import("/main.js");

                const calls: string[] = [];
                let capturedDefinition: any = null;
                let resolveTemplate!: (value: any) => void;

                class TestElement extends FASTElement {}

                const elName = uniqueElementName();
                const template = html<TestElement>`<span>resolved</span>`;
                const templatePromise = new Promise<any>(resolve => {
                    resolveTemplate = resolve;
                });

                const definePromise = TestElement.define(
                    {
                        name: elName,
                        template: definition => {
                            capturedDefinition = definition;
                            calls.push(
                                `resolver-template:${definition.template === undefined}`,
                            );
                            calls.push(
                                `resolver-defined:${customElements.get(elName) !== undefined}`,
                            );

                            return templatePromise;
                        },
                    },
                    [
                        definition => {
                            capturedDefinition = definition;
                            calls.push(
                                `extension-template:${definition.template === undefined}`,
                            );
                            calls.push(
                                `extension-defined:${customElements.get(elName) !== undefined}`,
                            );
                        },
                    ],
                );

                await Promise.resolve();

                const definedWhilePending = customElements.get(elName) !== undefined;
                const templateBeforeResolve = capturedDefinition?.template === undefined;

                resolveTemplate(template);
                await definePromise;

                const element = document.createElement(elName) as any;
                document.body.appendChild(element);
                await new Promise(resolve => requestAnimationFrame(resolve));

                return {
                    calls,
                    definedWhilePending,
                    templateBeforeResolve,
                    isDefinedAfter: customElements.get(elName) !== undefined,
                    resolvedTemplateMatches: capturedDefinition?.template === template,
                    shadowText: element.shadowRoot?.textContent ?? "",
                };
            });

            expect(result.calls).toEqual([
                "extension-template:true",
                "extension-defined:false",
                "resolver-template:true",
                "resolver-defined:false",
            ]);
            expect(result.definedWhilePending).toBe(false);
            expect(result.templateBeforeResolve).toBe(true);
            expect(result.isDefinedAfter).toBe(true);
            expect(result.resolvedTemplateMatches).toBe(true);
            expect(result.shadowText).toContain("resolved");
        });

        test("should apply extensions before waiting for deferred templates", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, FASTElementDefinition, html, uniqueElementName } =
                    await import("/main.js");

                const calls: string[] = [];

                class TestElement extends FASTElement {}

                const elName = uniqueElementName();
                const definePromise = TestElement.define(
                    {
                        name: elName,
                        templateOptions: "defer-and-hydrate",
                    },
                    [
                        definition => {
                            calls.push(
                                `extension-template:${definition.template === undefined}`,
                            );
                            calls.push(
                                `extension-defined:${customElements.get(elName) !== undefined}`,
                            );
                        },
                    ],
                );

                const definition = FASTElementDefinition.getByType(TestElement) as any;

                await Promise.resolve();

                const isDefinedBeforeTemplate = customElements.get(elName) !== undefined;
                const templateBeforeAssign = definition?.template === undefined;

                definition.template = html<TestElement>`<span>deferred</span>`;
                await definePromise;

                const element = document.createElement(elName) as any;
                document.body.appendChild(element);
                await new Promise(resolve => requestAnimationFrame(resolve));

                return {
                    calls,
                    isDefinedBeforeTemplate,
                    templateBeforeAssign,
                    isDefinedAfter: customElements.get(elName) !== undefined,
                    shadowText: element.shadowRoot?.textContent ?? "",
                };
            });

            expect(result.calls).toEqual([
                "extension-template:true",
                "extension-defined:false",
            ]);
            expect(result.isDefinedBeforeTemplate).toBe(false);
            expect(result.templateBeforeAssign).toBe(true);
            expect(result.isDefinedAfter).toBe(true);
            expect(result.shadowText).toContain("deferred");
        });
    });
});
