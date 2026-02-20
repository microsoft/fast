import { expect, test } from "@playwright/test";

test.describe("FASTElementDefinition", () => {
    test.describe("styles", () => {
        test("can accept a string", async ({ page }) => {
            await page.goto("/");

            const { containsStyles } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElementDefinition } = await import("/main.js");

                class MyElement extends HTMLElement {}
                const styles = ".class { color: red; }";
                const options = {
                    name: "test-element",
                    styles,
                };

                const def = FASTElementDefinition.compose(MyElement, options);

                return {
                    containsStyles: def.styles?.styles?.includes(styles) ?? false,
                };
            });

            expect(containsStyles).toBe(true);
        });

        test("can accept multiple strings", async ({ page }) => {
            await page.goto("/");

            const { containsCss1, css1Index, containsCss2 } = await page.evaluate(
                async () => {
                    // @ts-expect-error: Client module.
                    const { FASTElementDefinition } = await import("/main.js");

                    class MyElement extends HTMLElement {}
                    const css1 = ".class { color: red; }";
                    const css2 = ".class2 { color: red; }";
                    const options = {
                        name: "test-element",
                        styles: [css1, css2],
                    };
                    const def = FASTElementDefinition.compose(MyElement, options);

                    return {
                        containsCss1: def.styles?.styles?.includes(css1) ?? false,
                        css1Index: def.styles?.styles?.indexOf(css1) ?? -1,
                        containsCss2: def.styles?.styles?.includes(css2) ?? false,
                    };
                }
            );

            expect(containsCss1).toBe(true);
            expect(css1Index).toBe(0);
            expect(containsCss2).toBe(true);
        });

        test("can accept ElementStyles", async ({ page }) => {
            await page.goto("/");

            const stylesMatch = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElementDefinition, ElementStyles } = await import("/main.js");

                class MyElement extends HTMLElement {}
                const css = ".class { color: red; }";
                const styles = new ElementStyles([css]);
                const options = {
                    name: "test-element",
                    styles,
                };
                const def = FASTElementDefinition.compose(MyElement, options);

                return def.styles === styles;
            });

            expect(stylesMatch).toBe(true);
        });

        test("can accept multiple ElementStyles", async ({ page }) => {
            await page.goto("/");

            const { containsStyles1, styles1Index, containsStyles2 } =
                await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const { FASTElementDefinition, ElementStyles } = await import(
                        "/main.js"
                    );

                    class MyElement extends HTMLElement {}
                    const css1 = ".class { color: red; }";
                    const css2 = ".class2 { color: red; }";
                    const existingStyles1 = new ElementStyles([css1]);
                    const existingStyles2 = new ElementStyles([css2]);
                    const options = {
                        name: "test-element",
                        styles: [existingStyles1, existingStyles2],
                    };
                    const def = FASTElementDefinition.compose(MyElement, options);

                    return {
                        containsStyles1:
                            def.styles?.styles?.includes(existingStyles1) ?? false,
                        styles1Index: def.styles?.styles?.indexOf(existingStyles1) ?? -1,
                        containsStyles2:
                            def.styles?.styles?.includes(existingStyles2) ?? false,
                    };
                });

            expect(containsStyles1).toBe(true);
            expect(styles1Index).toBe(0);
            expect(containsStyles2).toBe(true);
        });

        test("can accept mixed strings and ElementStyles", async ({ page }) => {
            await page.goto("/");

            const { containsCss1, css1Index, containsStyles2 } = await page.evaluate(
                async () => {
                    // @ts-expect-error: Client module.
                    const { FASTElementDefinition, ElementStyles } = await import(
                        "/main.js"
                    );

                    class MyElement extends HTMLElement {}
                    const css1 = ".class { color: red; }";
                    const css2 = ".class2 { color: red; }";
                    const existingStyles2 = new ElementStyles([css2]);
                    const options = {
                        name: "test-element",
                        styles: [css1, existingStyles2],
                    };
                    const def = FASTElementDefinition.compose(MyElement, options);

                    return {
                        containsCss1: def.styles?.styles?.includes(css1) ?? false,
                        css1Index: def.styles?.styles?.indexOf(css1) ?? -1,
                        containsStyles2:
                            def.styles?.styles?.includes(existingStyles2) ?? false,
                    };
                }
            );

            expect(containsCss1).toBe(true);
            expect(css1Index).toBe(0);
            expect(containsStyles2).toBe(true);
        });

        test("can accept a CSSStyleSheet", async ({ page }) => {
            await page.goto("/");

            const { supportsAdoptedStyleSheets, containsStyleSheet } =
                await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const { FASTElementDefinition, ElementStyles } = await import(
                        "/main.js"
                    );

                    if (!ElementStyles.supportsAdoptedStyleSheets) {
                        return {
                            supportsAdoptedStyleSheets: false,
                            containsStyleSheet: false,
                        };
                    }

                    class MyElement extends HTMLElement {}
                    const styles = new CSSStyleSheet();
                    const options = {
                        name: "test-element",
                        styles,
                    };
                    const def = FASTElementDefinition.compose(MyElement, options);

                    return {
                        supportsAdoptedStyleSheets: true,
                        containsStyleSheet: def.styles?.styles?.includes(styles) ?? false,
                    };
                });

            if (supportsAdoptedStyleSheets) {
                expect(containsStyleSheet).toBe(true);
            }
        });

        test("can accept multiple CSSStyleSheets", async ({ page }) => {
            await page.goto("/");

            const {
                supportsAdoptedStyleSheets,
                containsSheet1,
                sheet1Index,
                containsSheet2,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElementDefinition, ElementStyles } = await import("/main.js");

                if (!ElementStyles.supportsAdoptedStyleSheets) {
                    return {
                        supportsAdoptedStyleSheets: false,
                        containsSheet1: false,
                        sheet1Index: -1,
                        containsSheet2: false,
                    };
                }

                class MyElement extends HTMLElement {}
                const styleSheet1 = new CSSStyleSheet();
                const styleSheet2 = new CSSStyleSheet();
                const options = {
                    name: "test-element",
                    styles: [styleSheet1, styleSheet2],
                };
                const def = FASTElementDefinition.compose(MyElement, options);

                return {
                    supportsAdoptedStyleSheets: true,
                    containsSheet1: def.styles?.styles?.includes(styleSheet1) ?? false,
                    sheet1Index: def.styles?.styles?.indexOf(styleSheet1) ?? -1,
                    containsSheet2: def.styles?.styles?.includes(styleSheet2) ?? false,
                };
            });

            if (supportsAdoptedStyleSheets) {
                expect(containsSheet1).toBe(true);
                expect(sheet1Index).toBe(0);
                expect(containsSheet2).toBe(true);
            }
        });

        test("can accept mixed strings, ElementStyles, and CSSStyleSheets", async ({
            page,
        }) => {
            await page.goto("/");

            const {
                supportsAdoptedStyleSheets,
                containsCss1,
                css1Index,
                containsStyles2,
                styles2Index,
                containsSheet3,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElementDefinition, ElementStyles } = await import("/main.js");

                if (!ElementStyles.supportsAdoptedStyleSheets) {
                    return {
                        supportsAdoptedStyleSheets: false,
                        containsCss1: false,
                        css1Index: -1,
                        containsStyles2: false,
                        styles2Index: -1,
                        containsSheet3: false,
                    };
                }

                class MyElement extends HTMLElement {}
                const css1 = ".class { color: red; }";
                const css2 = ".class2 { color: red; }";
                const existingStyles2 = new ElementStyles([css2]);
                const styleSheet3 = new CSSStyleSheet();
                const options = {
                    name: "test-element",
                    styles: [css1, existingStyles2, styleSheet3],
                };
                const def = FASTElementDefinition.compose(MyElement, options);

                return {
                    supportsAdoptedStyleSheets: true,
                    containsCss1: def.styles?.styles?.includes(css1) ?? false,
                    css1Index: def.styles?.styles?.indexOf(css1) ?? -1,
                    containsStyles2:
                        def.styles?.styles?.includes(existingStyles2) ?? false,
                    styles2Index: def.styles?.styles?.indexOf(existingStyles2) ?? -1,
                    containsSheet3: def.styles?.styles?.includes(styleSheet3) ?? false,
                };
            });

            if (supportsAdoptedStyleSheets) {
                expect(containsCss1).toBe(true);
                expect(css1Index).toBe(0);
                expect(containsStyles2).toBe(true);
                expect(styles2Index).toBe(1);
                expect(containsSheet3).toBe(true);
            }
        });
    });

    test.describe("instance", () => {
        test("reports not defined until after define is called", async ({ page }) => {
            await page.goto("/");

            const { beforeDefine, afterDefine } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElementDefinition, uniqueElementName } = await import(
                    "/main.js"
                );

                class MyElement extends HTMLElement {}
                const def = FASTElementDefinition.compose(MyElement, uniqueElementName());

                const beforeDefine = def.isDefined;
                def.define();
                const afterDefine = def.isDefined;

                return { beforeDefine, afterDefine };
            });

            expect(beforeDefine).toBe(false);
            expect(afterDefine).toBe(true);
        });
    });

    test.describe("compose", () => {
        test("prevents registering FASTElement", async ({ page }) => {
            await page.goto("/");

            const { def1NotFASTElement, def2NotFASTElement } = await page.evaluate(
                async () => {
                    // @ts-expect-error: Client module.
                    const { FASTElement, FASTElementDefinition, uniqueElementName } =
                        await import("/main.js");

                    const def1 = FASTElementDefinition.compose(
                        FASTElement,
                        uniqueElementName()
                    );

                    const def2 = FASTElementDefinition.compose(
                        FASTElement,
                        uniqueElementName()
                    );

                    return {
                        def1NotFASTElement: def1.type !== FASTElement,
                        def2NotFASTElement: def2.type !== FASTElement,
                    };
                }
            );

            expect(def1NotFASTElement).toBe(true);
            expect(def2NotFASTElement).toBe(true);
        });

        test("automatically inherits definitions made directly against FASTElement", async ({
            page,
        }) => {
            await page.goto("/");

            const { def1Extends, def2Extends } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, FASTElementDefinition, uniqueElementName } =
                    await import("/main.js");

                const def1 = FASTElementDefinition.compose(
                    FASTElement,
                    uniqueElementName()
                );

                const def2 = FASTElementDefinition.compose(
                    FASTElement,
                    uniqueElementName()
                );

                return {
                    def1Extends: Reflect.getPrototypeOf(def1.type) === FASTElement,
                    def2Extends: Reflect.getPrototypeOf(def2.type) === FASTElement,
                };
            });

            expect(def1Extends).toBe(true);
            expect(def2Extends).toBe(true);
        });
    });

    test.describe("register async", () => {
        test("registers a new element when a partial definition is added", async ({
            page,
        }) => {
            await page.goto("/");

            const extendsHTMLElement = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, FASTElementDefinition, uniqueElementName } =
                    await import("/main.js");

                const elName = uniqueElementName();

                await FASTElementDefinition.composeAsync(FASTElement, elName);

                const registeredEl = await FASTElementDefinition.registerAsync(elName);

                return Reflect.getPrototypeOf(registeredEl) === HTMLElement;
            });

            expect(extendsHTMLElement).toBe(true);
        });
    });

    test.describe("compose async", () => {
        test("composes a new element when a new template is defined and shadow options have been added", async ({
            page,
        }) => {
            await page.goto("/");

            const extendsFASTElement = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { FASTElement, FASTElementDefinition, uniqueElementName } =
                    await import("/main.js");

                const def1 = await FASTElementDefinition.composeAsync(
                    FASTElement,
                    uniqueElementName()
                );

                return Reflect.getPrototypeOf(def1.type) === FASTElement;
            });

            expect(extendsFASTElement).toBe(true);
        });
    });
});
