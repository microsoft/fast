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

                TestElement.define({ name: elName }, [extension]);

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

                FASTElement.define(TestElement, { name: elName }, [extension]);

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

                TestElement.define({ name: uniqueElementName() }, [
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

                TestElement.define({ name: elName }, [
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
                TestElement.define({ name: elName }, []);

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
                TestElement.define({ name: elName }, [
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
                TestElement.define({ name: elName }, [myPlugin()]);

                return {
                    callCount: calls.length,
                    firstCall: calls[0],
                    expectedCall: `plugin:${elName}`,
                };
            });

            expect(result.callCount).toBe(1);
            expect(result.firstCall).toBe(result.expectedCall);
        });
    });
});
