import { expect, test } from "@playwright/test";

const templateA = "a";
const templateB = "b";
const cssA = "class-a { color: red; }";
const cssB = "class-b { color: blue; }";

test.describe("The ElementController", () => {
    test.describe("during construction", () => {
        test("if no shadow options defined, uses open shadow dom", async ({ page }) => {
            await page.goto("/");

            const isShadowRoot = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    uniqueElementName,
                } = await import("/main.js");

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = { name };
                    }
                ).define();

                const element = document.createElement(name);
                ElementController.forCustomElement(element);

                return element.shadowRoot instanceof ShadowRoot;
            });

            expect(isShadowRoot).toBe(true);
        });

        test("if shadow options open, uses open shadow dom", async ({ page }) => {
            await page.goto("/");

            const isShadowRoot = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    uniqueElementName,
                } = await import("/main.js");

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = { name, shadowOptions: { mode: "open" } };
                    }
                ).define();

                const element = document.createElement(name);
                ElementController.forCustomElement(element);

                return element.shadowRoot instanceof ShadowRoot;
            });

            expect(isShadowRoot).toBe(true);
        });

        test("if shadow options nulled, does not create shadow root", async ({
            page,
        }) => {
            await page.goto("/");

            const hasShadowRoot = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    uniqueElementName,
                } = await import("/main.js");

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = { name, shadowOptions: null };
                    }
                ).define();

                const element = document.createElement(name);
                ElementController.forCustomElement(element);

                return element.shadowRoot !== null;
            });

            expect(hasShadowRoot).toBe(false);
        });

        test("if shadow options closed, does not expose shadow root", async ({
            page,
        }) => {
            await page.goto("/");

            const hasShadowRoot = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    uniqueElementName,
                } = await import("/main.js");

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = { name, shadowOptions: { mode: "closed" } };
                    }
                ).define();

                const element = document.createElement(name);
                ElementController.forCustomElement(element);

                return element.shadowRoot !== null;
            });

            expect(hasShadowRoot).toBe(false);
        });

        test("does not attach view to shadow root", async ({ page }) => {
            await page.goto("/");

            const childCount = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    uniqueElementName,
                } = await import("/main.js");

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = { name };
                    }
                ).define();

                const element = document.createElement(name);
                ElementController.forCustomElement(element);

                return element.shadowRoot?.childNodes.length ?? 0;
            });

            expect(childCount).toBe(0);
        });
    });

    test.describe("during connect", () => {
        test("renders nothing to shadow dom in shadow dom mode when there's no template", async ({
            page,
        }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    uniqueElementName,
                } = await import("/main.js");

                const toHTML = (node: Node): string => {
                    return Array.from(node.childNodes)
                        .map((x: any) => x.outerHTML || x.textContent)
                        .join("");
                };

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = { name };
                    }
                ).define();

                const element = document.createElement(name);
                const controller = ElementController.forCustomElement(element);

                const beforeConnect = toHTML(element.shadowRoot!);
                controller.connect();
                const afterConnect = toHTML(element.shadowRoot!);

                return { beforeConnect, afterConnect };
            });

            expect(beforeConnect).toBe("");
            expect(afterConnect).toBe("");
        });

        test("renders nothing to light dom in light dom mode when there's no template", async ({
            page,
        }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    uniqueElementName,
                } = await import("/main.js");

                const toHTML = (node: Node): string => {
                    return Array.from(node.childNodes)
                        .map((x: any) => x.outerHTML || x.textContent)
                        .join("");
                };

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = { name, shadowOptions: null };
                    }
                ).define();

                const element = document.createElement(name);
                const controller = ElementController.forCustomElement(element);

                const beforeConnect = toHTML(element);
                controller.connect();
                const afterConnect = toHTML(element);

                return { beforeConnect, afterConnect };
            });

            expect(beforeConnect).toBe("");
            expect(afterConnect).toBe("");
        });

        test("renders a template to shadow dom in shadow dom mode", async ({ page }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect } = await page.evaluate(
                async templateA => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        html,
                        uniqueElementName,
                    } = await import("/main.js");

                    const toHTML = (node: Node): string => {
                        return Array.from(node.childNodes)
                            .map((x: any) => x.outerHTML || x.textContent)
                            .join("");
                    };

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = {
                                name,
                                template: html`
                                    ${templateA}
                                `,
                            };
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);

                    const beforeConnect = toHTML(element.shadowRoot!);
                    controller.connect();
                    const afterConnect = toHTML(element.shadowRoot!);

                    return { beforeConnect, afterConnect };
                },
                templateA
            );

            expect(beforeConnect).toBe("");
            expect(afterConnect.trim()).toBe("a");
        });

        test("renders a template to light dom in light dom mode", async ({ page }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect } = await page.evaluate(
                async templateA => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        html,
                        uniqueElementName,
                    } = await import("/main.js");

                    const toHTML = (node: Node): string => {
                        return Array.from(node.childNodes)
                            .map((x: any) => x.outerHTML || x.textContent)
                            .join("");
                    };

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = {
                                name,
                                shadowOptions: null,
                                template: html`
                                    ${templateA}
                                `,
                            };
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);

                    const beforeConnect = toHTML(element);
                    controller.connect();
                    const afterConnect = toHTML(element);

                    return { beforeConnect, afterConnect };
                },
                templateA
            );

            expect(beforeConnect).toBe("");
            expect(afterConnect.trim()).toBe("a");
        });

        test("renders a template override to shadow dom when set", async ({ page }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect } = await page.evaluate(
                async ({ templateA, templateB }) => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        html,
                        uniqueElementName,
                    } = await import("/main.js");

                    const toHTML = (node: Node): string => {
                        return Array.from(node.childNodes)
                            .map((x: any) => x.outerHTML || x.textContent)
                            .join("");
                    };

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = {
                                name,
                                template: html`
                                    ${templateA}
                                `,
                            };
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);

                    const beforeConnect = toHTML(element.shadowRoot!);
                    controller.template = html`
                        ${templateB}
                    `;
                    controller.connect();
                    const afterConnect = toHTML(element.shadowRoot!);

                    return { beforeConnect, afterConnect };
                },
                { templateA, templateB }
            );

            expect(beforeConnect).toBe("");
            expect(afterConnect.trim()).toBe("b");
        });

        test("renders a template override to light dom when set", async ({ page }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect } = await page.evaluate(
                async ({ templateA, templateB }) => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        html,
                        uniqueElementName,
                    } = await import("/main.js");

                    const toHTML = (node: Node): string => {
                        return Array.from(node.childNodes)
                            .map((x: any) => x.outerHTML || x.textContent)
                            .join("");
                    };

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = {
                                name,
                                shadowOptions: null,
                                template: html`
                                    ${templateA}
                                `,
                            };
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);

                    const beforeConnect = toHTML(element);
                    controller.template = html`
                        ${templateB}
                    `;
                    controller.connect();
                    const afterConnect = toHTML(element);

                    return { beforeConnect, afterConnect };
                },
                { templateA, templateB }
            );

            expect(beforeConnect).toBe("");
            expect(afterConnect.trim()).toBe("b");
        });

        test("renders a resolved template to shadow dom in shadow dom mode", async ({
            page,
        }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect } = await page.evaluate(
                async templateA => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        html,
                        uniqueElementName,
                    } = await import("/main.js");

                    const toHTML = (node: Node): string => {
                        return Array.from(node.childNodes)
                            .map((x: any) => x.outerHTML || x.textContent)
                            .join("");
                    };

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = { name };
                            resolveTemplate() {
                                return html`
                                    ${templateA}
                                `;
                            }
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);

                    const beforeConnect = toHTML(element.shadowRoot!);
                    controller.connect();
                    const afterConnect = toHTML(element.shadowRoot!);

                    return { beforeConnect, afterConnect };
                },
                templateA
            );

            expect(beforeConnect).toBe("");
            expect(afterConnect.trim()).toBe("a");
        });

        test("renders a resolved template to light dom in light dom mode", async ({
            page,
        }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect } = await page.evaluate(
                async templateA => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        html,
                        uniqueElementName,
                    } = await import("/main.js");

                    const toHTML = (node: Node): string => {
                        return Array.from(node.childNodes)
                            .map((x: any) => x.outerHTML || x.textContent)
                            .join("");
                    };

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = { name, shadowOptions: null };
                            resolveTemplate() {
                                return html`
                                    ${templateA}
                                `;
                            }
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);

                    const beforeConnect = toHTML(element);
                    controller.connect();
                    const afterConnect = toHTML(element);

                    return { beforeConnect, afterConnect };
                },
                templateA
            );

            expect(beforeConnect).toBe("");
            expect(afterConnect.trim()).toBe("a");
        });

        test("renders a template override over a resolved template to shadow dom when set", async ({
            page,
        }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect } = await page.evaluate(
                async ({ templateA, templateB }) => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        html,
                        uniqueElementName,
                    } = await import("/main.js");

                    const toHTML = (node: Node): string => {
                        return Array.from(node.childNodes)
                            .map((x: any) => x.outerHTML || x.textContent)
                            .join("");
                    };

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = { name };
                            resolveTemplate() {
                                return html`
                                    ${templateA}
                                `;
                            }
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);

                    const beforeConnect = toHTML(element.shadowRoot!);
                    controller.template = html`
                        ${templateB}
                    `;
                    controller.connect();
                    const afterConnect = toHTML(element.shadowRoot!);

                    return { beforeConnect, afterConnect };
                },
                { templateA, templateB }
            );

            expect(beforeConnect).toBe("");
            expect(afterConnect.trim()).toBe("b");
        });

        test("renders a template override over a resolved template to light dom when set", async ({
            page,
        }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect } = await page.evaluate(
                async ({ templateA, templateB }) => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        html,
                        uniqueElementName,
                    } = await import("/main.js");

                    const toHTML = (node: Node): string => {
                        return Array.from(node.childNodes)
                            .map((x: any) => x.outerHTML || x.textContent)
                            .join("");
                    };

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = { name, shadowOptions: null };
                            resolveTemplate() {
                                return html`
                                    ${templateA}
                                `;
                            }
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);

                    const beforeConnect = toHTML(element);
                    controller.template = html`
                        ${templateB}
                    `;
                    controller.connect();
                    const afterConnect = toHTML(element);

                    return { beforeConnect, afterConnect };
                },
                { templateA, templateB }
            );

            expect(beforeConnect).toBe("");
            expect(afterConnect.trim()).toBe("b");
        });

        test("sets no styles when none are provided", async ({ page }) => {
            await page.goto("/");

            const { supportsAdoptedStyleSheets, beforeLength, afterLength } =
                await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        ElementStyles,
                        uniqueElementName,
                    } = await import("/main.js");

                    if (!ElementStyles.supportsAdoptedStyleSheets) {
                        return {
                            supportsAdoptedStyleSheets: false,
                            beforeLength: 0,
                            afterLength: 0,
                        };
                    }

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = { name };
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);
                    const shadowRoot = element.shadowRoot as ShadowRoot & {
                        adoptedStyleSheets: CSSStyleSheet[];
                    };

                    const beforeLength = shadowRoot.adoptedStyleSheets.length;
                    controller.connect();
                    const afterLength = shadowRoot.adoptedStyleSheets.length;

                    return {
                        supportsAdoptedStyleSheets: true,
                        beforeLength,
                        afterLength,
                    };
                });

            if (supportsAdoptedStyleSheets) {
                expect(beforeLength).toBe(0);
                expect(afterLength).toBe(0);
            }
        });

        test("sets styles when provided", async ({ page }) => {
            await page.goto("/");

            const { supportsAdoptedStyleSheets, beforeLength, cssText } =
                await page.evaluate(async cssA => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        ElementStyles,
                        css,
                        uniqueElementName,
                    } = await import("/main.js");

                    if (!ElementStyles.supportsAdoptedStyleSheets) {
                        return {
                            supportsAdoptedStyleSheets: false,
                            beforeLength: 0,
                            cssText: "",
                        };
                    }

                    const stylesA = css`
                        ${cssA}
                    `;

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = { name, styles: stylesA };
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);
                    const shadowRoot = element.shadowRoot as ShadowRoot & {
                        adoptedStyleSheets: CSSStyleSheet[];
                    };

                    const beforeLength = shadowRoot.adoptedStyleSheets.length;
                    controller.connect();
                    const cssText =
                        shadowRoot.adoptedStyleSheets[0]?.cssRules[0]?.cssText ?? "";

                    return { supportsAdoptedStyleSheets: true, beforeLength, cssText };
                }, cssA);

            if (supportsAdoptedStyleSheets) {
                expect(beforeLength).toBe(0);
                expect(cssText).toBe(cssA);
            }
        });

        test("renders style override when set", async ({ page }) => {
            await page.goto("/");

            const { supportsAdoptedStyleSheets, beforeLength, cssText } =
                await page.evaluate(
                    async ({ cssA, cssB }) => {
                        // @ts-expect-error: Client module.
                        const {
                            FASTElement,
                            FASTElementDefinition,
                            ElementController,
                            ElementStyles,
                            css,
                            uniqueElementName,
                        } = await import("/main.js");

                        if (!ElementStyles.supportsAdoptedStyleSheets) {
                            return {
                                supportsAdoptedStyleSheets: false,
                                beforeLength: 0,
                                cssText: "",
                            };
                        }

                        const stylesA = css`
                            ${cssA}
                        `;
                        const stylesB = css`
                            ${cssB}
                        `;

                        const name = uniqueElementName();
                        FASTElementDefinition.compose(
                            class ControllerTest extends FASTElement {
                                static definition = { name, styles: stylesA };
                            }
                        ).define();

                        const element = document.createElement(name);
                        const controller = ElementController.forCustomElement(element);
                        const shadowRoot = element.shadowRoot as ShadowRoot & {
                            adoptedStyleSheets: CSSStyleSheet[];
                        };

                        const beforeLength = shadowRoot.adoptedStyleSheets.length;
                        controller.mainStyles = stylesB;
                        controller.connect();
                        const cssText =
                            shadowRoot.adoptedStyleSheets[0]?.cssRules[0]?.cssText ?? "";

                        return {
                            supportsAdoptedStyleSheets: true,
                            beforeLength,
                            cssText,
                        };
                    },
                    { cssA, cssB }
                );

            if (supportsAdoptedStyleSheets) {
                expect(beforeLength).toBe(0);
                expect(cssText).toBe(cssB);
            }
        });

        test("renders resolved styles", async ({ page }) => {
            await page.goto("/");

            const { supportsAdoptedStyleSheets, beforeLength, cssText } =
                await page.evaluate(async cssA => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        ElementStyles,
                        css,
                        uniqueElementName,
                    } = await import("/main.js");

                    if (!ElementStyles.supportsAdoptedStyleSheets) {
                        return {
                            supportsAdoptedStyleSheets: false,
                            beforeLength: 0,
                            cssText: "",
                        };
                    }

                    const stylesA = css`
                        ${cssA}
                    `;

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = { name };
                            resolveStyles() {
                                return stylesA;
                            }
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);
                    const shadowRoot = element.shadowRoot as ShadowRoot & {
                        adoptedStyleSheets: CSSStyleSheet[];
                    };

                    const beforeLength = shadowRoot.adoptedStyleSheets.length;
                    controller.connect();
                    const cssText =
                        shadowRoot.adoptedStyleSheets[0]?.cssRules[0]?.cssText ?? "";

                    return { supportsAdoptedStyleSheets: true, beforeLength, cssText };
                }, cssA);

            if (supportsAdoptedStyleSheets) {
                expect(beforeLength).toBe(0);
                expect(cssText).toBe(cssA);
            }
        });

        test("renders a style override over a resolved style", async ({ page }) => {
            await page.goto("/");

            const { supportsAdoptedStyleSheets, beforeLength, cssText } =
                await page.evaluate(
                    async ({ cssA, cssB }) => {
                        // @ts-expect-error: Client module.
                        const {
                            FASTElement,
                            FASTElementDefinition,
                            ElementController,
                            ElementStyles,
                            css,
                            uniqueElementName,
                        } = await import("/main.js");

                        if (!ElementStyles.supportsAdoptedStyleSheets) {
                            return {
                                supportsAdoptedStyleSheets: false,
                                beforeLength: 0,
                                cssText: "",
                            };
                        }

                        const stylesA = css`
                            ${cssA}
                        `;
                        const stylesB = css`
                            ${cssB}
                        `;

                        const name = uniqueElementName();
                        FASTElementDefinition.compose(
                            class ControllerTest extends FASTElement {
                                static definition = { name };
                                resolveStyles() {
                                    return stylesA;
                                }
                            }
                        ).define();

                        const element = document.createElement(name);
                        const controller = ElementController.forCustomElement(element);
                        const shadowRoot = element.shadowRoot as ShadowRoot & {
                            adoptedStyleSheets: CSSStyleSheet[];
                        };

                        const beforeLength = shadowRoot.adoptedStyleSheets.length;
                        controller.mainStyles = stylesB;
                        controller.connect();
                        const cssText =
                            shadowRoot.adoptedStyleSheets[0]?.cssRules[0]?.cssText ?? "";

                        return {
                            supportsAdoptedStyleSheets: true,
                            beforeLength,
                            cssText,
                        };
                    },
                    { cssA, cssB }
                );

            if (supportsAdoptedStyleSheets) {
                expect(beforeLength).toBe(0);
                expect(cssText).toBe(cssB);
            }
        });
    });

    test.describe("after connect", () => {
        test("can dynamically change the template in shadow dom mode", async ({
            page,
        }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect, afterChange } = await page.evaluate(
                async ({ templateA, templateB }) => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        html,
                        uniqueElementName,
                    } = await import("/main.js");

                    const toHTML = (node: Node): string => {
                        return Array.from(node.childNodes)
                            .map((x: any) => x.outerHTML || x.textContent)
                            .join("");
                    };

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = {
                                name,
                                template: html`
                                    ${templateA}
                                `,
                            };
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);

                    const beforeConnect = toHTML(element.shadowRoot!);
                    controller.connect();
                    const afterConnect = toHTML(element.shadowRoot!);
                    controller.template = html`
                        ${templateB}
                    `;
                    const afterChange = toHTML(element.shadowRoot!);

                    return { beforeConnect, afterConnect, afterChange };
                },
                { templateA, templateB }
            );

            expect(beforeConnect).toBe("");
            expect(afterConnect.trim()).toBe("a");
            expect(afterChange.trim()).toBe("b");
        });

        test("can dynamically change the template in light dom mode", async ({
            page,
        }) => {
            await page.goto("/");

            const { beforeConnect, afterConnect, afterChange } = await page.evaluate(
                async ({ templateA, templateB }) => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        html,
                        uniqueElementName,
                    } = await import("/main.js");

                    const toHTML = (node: Node): string => {
                        return Array.from(node.childNodes)
                            .map((x: any) => x.outerHTML || x.textContent)
                            .join("");
                    };

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = {
                                name,
                                shadowOptions: null,
                                template: html`
                                    ${templateA}
                                `,
                            };
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);

                    const beforeConnect = toHTML(element);
                    controller.connect();
                    const afterConnect = toHTML(element);
                    controller.template = html`
                        ${templateB}
                    `;
                    const afterChange = toHTML(element);

                    return { beforeConnect, afterConnect, afterChange };
                },
                { templateA, templateB }
            );

            expect(beforeConnect).toBe("");
            expect(afterConnect.trim()).toBe("a");
            expect(afterChange.trim()).toBe("b");
        });

        test("can dynamically change the styles", async ({ page }) => {
            await page.goto("/");

            const {
                supportsAdoptedStyleSheets,
                beforeLength,
                cssTextAfterConnect,
                cssTextAfterChange,
                lengthAfterChange,
            } = await page.evaluate(
                async ({ cssA, cssB }) => {
                    // @ts-expect-error: Client module.
                    const {
                        FASTElement,
                        FASTElementDefinition,
                        ElementController,
                        ElementStyles,
                        css,
                        uniqueElementName,
                    } = await import("/main.js");

                    if (!ElementStyles.supportsAdoptedStyleSheets) {
                        return {
                            supportsAdoptedStyleSheets: false,
                            beforeLength: 0,
                            cssTextAfterConnect: "",
                            cssTextAfterChange: "",
                            lengthAfterChange: 0,
                        };
                    }

                    const stylesA = css`
                        ${cssA}
                    `;
                    const stylesB = css`
                        ${cssB}
                    `;

                    const name = uniqueElementName();
                    FASTElementDefinition.compose(
                        class ControllerTest extends FASTElement {
                            static definition = { name, styles: stylesA };
                        }
                    ).define();

                    const element = document.createElement(name);
                    const controller = ElementController.forCustomElement(element);
                    const shadowRoot = element.shadowRoot as ShadowRoot & {
                        adoptedStyleSheets: CSSStyleSheet[];
                    };

                    const beforeLength = shadowRoot.adoptedStyleSheets.length;
                    controller.connect();
                    const cssTextAfterConnect =
                        shadowRoot.adoptedStyleSheets[0]?.cssRules[0]?.cssText ?? "";
                    controller.mainStyles = stylesB;
                    const lengthAfterChange = shadowRoot.adoptedStyleSheets.length;
                    const cssTextAfterChange =
                        shadowRoot.adoptedStyleSheets[0]?.cssRules[0]?.cssText ?? "";

                    return {
                        supportsAdoptedStyleSheets: true,
                        beforeLength,
                        cssTextAfterConnect,
                        cssTextAfterChange,
                        lengthAfterChange,
                    };
                },
                { cssA, cssB }
            );

            if (supportsAdoptedStyleSheets) {
                expect(beforeLength).toBe(0);
                expect(cssTextAfterConnect).toBe(cssA);
                expect(lengthAfterChange).toBe(1);
                expect(cssTextAfterChange).toBe(cssB);
            }
        });
    });

    test("should use itself as the notifier", async ({ page }) => {
        await page.goto("/");

        const isNotifier = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                ElementController,
                Observable,
                uniqueElementName,
            } = await import("/main.js");

            const name = uniqueElementName();
            FASTElementDefinition.compose(
                class ControllerTest extends FASTElement {
                    static definition = { name };
                }
            ).define();

            const element = document.createElement(name);
            const controller = ElementController.forCustomElement(element);
            const notifier = Observable.getNotifier(controller);

            return notifier === controller;
        });

        expect(isNotifier).toBe(true);
    });

    test("should have an observable isConnected property", async ({ page }) => {
        await page.goto("/");

        const { initialAttached, afterAppend, afterRemove } = await page.evaluate(
            async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    Observable,
                    uniqueElementName,
                } = await import("/main.js");

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = { name };
                    }
                ).define();

                const element = document.createElement(name);
                const controller = ElementController.forCustomElement(element);

                let attached = controller.isConnected;
                const handler = {
                    handleChange: () => {
                        attached = controller.isConnected;
                    },
                };
                Observable.getNotifier(controller).subscribe(handler, "isConnected");

                const initialAttached = attached;
                document.body.appendChild(element);
                const afterAppend = attached;
                document.body.removeChild(element);
                const afterRemove = attached;

                return { initialAttached, afterAppend, afterRemove };
            }
        );

        expect(initialAttached).toBe(false);
        expect(afterAppend).toBe(true);
        expect(afterRemove).toBe(false);
    });

    test("should raise cancelable custom events by default", async ({ page }) => {
        await page.goto("/");

        const cancelable = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                ElementController,
                uniqueElementName,
            } = await import("/main.js");

            const name = uniqueElementName();
            FASTElementDefinition.compose(
                class ControllerTest extends FASTElement {
                    static definition = { name };
                }
            ).define();

            const element = document.createElement(name);
            const controller = ElementController.forCustomElement(element);

            let cancelable = false;
            controller.connect();
            element.addEventListener("my-event", (e: Event) => {
                cancelable = e.cancelable;
            });

            controller.emit("my-event");

            return cancelable;
        });

        expect(cancelable).toBe(true);
    });

    test("should raise bubble custom events by default", async ({ page }) => {
        await page.goto("/");

        const bubbles = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                ElementController,
                uniqueElementName,
            } = await import("/main.js");

            const name = uniqueElementName();
            FASTElementDefinition.compose(
                class ControllerTest extends FASTElement {
                    static definition = { name };
                }
            ).define();

            const element = document.createElement(name);
            const controller = ElementController.forCustomElement(element);

            let bubbles = false;
            controller.connect();
            element.addEventListener("my-event", (e: Event) => {
                bubbles = e.bubbles;
            });

            controller.emit("my-event");

            return bubbles;
        });

        expect(bubbles).toBe(true);
    });

    test("should raise composed custom events by default", async ({ page }) => {
        await page.goto("/");

        const composed = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                ElementController,
                uniqueElementName,
            } = await import("/main.js");

            const name = uniqueElementName();
            FASTElementDefinition.compose(
                class ControllerTest extends FASTElement {
                    static definition = { name };
                }
            ).define();

            const element = document.createElement(name);
            const controller = ElementController.forCustomElement(element);

            let composed = false;
            controller.connect();
            element.addEventListener("my-event", (e: Event) => {
                composed = e.composed;
            });

            controller.emit("my-event");

            return composed;
        });

        expect(composed).toBe(true);
    });

    test("should attach and detach the HTMLStyleElement supplied to styles.add() and styles.remove() to the shadowRoot", async ({
        page,
    }) => {
        await page.goto("/");

        const { beforeAdd, afterAdd, afterRemove } = await page.evaluate(
            async templateA => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    html,
                    uniqueElementName,
                } = await import("/main.js");

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = {
                            name,
                            shadowOptions: { mode: "open" },
                            template: html`
                                ${templateA}
                            `,
                        };
                    }
                ).define();

                const element = document.createElement(name);
                const controller = ElementController.forCustomElement(element);

                const style = document.createElement("style") as HTMLStyleElement;
                const beforeAdd = element.shadowRoot?.contains(style) ?? false;

                controller.addStyles(style);
                const afterAdd = element.shadowRoot?.contains(style) ?? false;

                controller.removeStyles(style);
                const afterRemove = element.shadowRoot?.contains(style) ?? false;

                return { beforeAdd, afterAdd, afterRemove };
            },
            templateA
        );

        expect(beforeAdd).toBe(false);
        expect(afterAdd).toBe(true);
        expect(afterRemove).toBe(false);
    });

    test("should not throw if DOM stringified", async ({ page }) => {
        await page.goto("/");

        const didThrow = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                ElementController,
                uniqueElementName,
            } = await import("/main.js");

            const name = uniqueElementName();
            FASTElementDefinition.compose(
                class ControllerTest extends FASTElement {
                    static definition = { name };
                }
            ).define();

            const element = document.createElement(name);
            ElementController.forCustomElement(element);

            try {
                JSON.stringify(element);
                return false;
            } catch {
                return true;
            }
        });

        expect(didThrow).toBe(false);
    });
});
