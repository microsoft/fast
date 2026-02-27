import { expect, test } from "@playwright/test";

test.describe("The HydratableElementController", () => {
    test("A FASTElement's controller should be an instance of HydratableElementController after invoking install", async ({
        page,
    }) => {
        await page.goto("/");

        const isHydratableController = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                ElementController,
                HydratableElementController,
                uniqueElementName,
            } = await import("/main.js");

            HydratableElementController.install();

            const name = uniqueElementName();
            FASTElementDefinition.compose(
                class ControllerTest extends FASTElement {
                    static definition = { name };
                }
            ).define();

            const element = document.createElement(name) as any;
            element.setAttribute("needs-hydration", "");
            ElementController.forCustomElement(element);

            const result = element.$fastController instanceof HydratableElementController;

            ElementController.setStrategy(ElementController);
            return result;
        });

        expect(isHydratableController).toBe(true);
    });

    test("should remove the needs-hydration attribute after connection", async ({
        page,
    }) => {
        await page.goto("/");

        const { beforeConnect, afterConnect } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                ElementController,
                HydratableElementController,
                uniqueElementName,
            } = await import("/main.js");

            HydratableElementController.install();

            const name = uniqueElementName();
            FASTElementDefinition.compose(
                class ControllerTest extends FASTElement {
                    static definition = { name };
                }
            ).define();

            const element = document.createElement(name) as any;
            element.setAttribute("needs-hydration", "");
            const controller = ElementController.forCustomElement(element);

            const beforeConnect = element.hasAttribute("needs-hydration");
            controller.connect();
            const afterConnect = element.hasAttribute("needs-hydration");

            ElementController.setStrategy(ElementController);
            return { beforeConnect, afterConnect };
        });

        expect(beforeConnect).toBe(true);
        expect(afterConnect).toBe(false);
    });

    test.describe("without the `defer-hydration` attribute on connection", () => {
        test("should render the element's template", async ({ page }) => {
            await page.goto("/");

            const innerHTML = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    HydratableElementController,
                    html,
                    uniqueElementName,
                } = await import("/main.js");

                HydratableElementController.install();

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = {
                            name,
                            template: html`
                                <p>Hello world</p>
                            `,
                        };
                    }
                ).define();

                const element = document.createElement(name) as any;
                element.setAttribute("needs-hydration", "");
                ElementController.forCustomElement(element);

                document.body.appendChild(element);
                const innerHTML = element.shadowRoot?.innerHTML ?? "";
                document.body.removeChild(element);

                ElementController.setStrategy(ElementController);
                return innerHTML;
            });

            expect(innerHTML.trim()).toBe("<p>Hello world</p>");
        });

        test("should apply the element's main stylesheet", async ({ page }) => {
            await page.goto("/");

            const stylesAttached = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    HydratableElementController,
                    css,
                    uniqueElementName,
                } = await import("/main.js");

                HydratableElementController.install();

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = {
                            name,
                            styles: css`
                                :host {
                                    color: red;
                                }
                            `,
                        };
                    }
                ).define();

                const element = document.createElement(name) as any;
                element.setAttribute("needs-hydration", "");
                ElementController.forCustomElement(element);

                document.body.appendChild(element);
                const attached =
                    element.$fastController.mainStyles?.isAttachedTo(element) ?? false;
                document.body.removeChild(element);

                ElementController.setStrategy(ElementController);
                return attached;
            });

            expect(stylesAttached).toBe(true);
        });
    });

    test.describe("with the `defer-hydration` is set before connection", () => {
        test("should not render the element's template", async ({ page }) => {
            await page.goto("/");

            const innerHTML = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    HydratableElementController,
                    html,
                    uniqueElementName,
                } = await import("/main.js");

                HydratableElementController.install();

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = {
                            name,
                            template: html`
                                <p>Hello world</p>
                            `,
                        };
                    }
                ).define();

                const element = document.createElement(name) as any;
                element.setAttribute("needs-hydration", "");
                ElementController.forCustomElement(element);

                element.setAttribute("defer-hydration", "");
                document.body.appendChild(element);
                const innerHTML = element.shadowRoot?.innerHTML ?? "";
                document.body.removeChild(element);

                ElementController.setStrategy(ElementController);
                return innerHTML;
            });

            expect(innerHTML).toBe("");
        });

        test("should not attach the element's main stylesheet", async ({ page }) => {
            await page.goto("/");

            const stylesAttached = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    HydratableElementController,
                    css,
                    uniqueElementName,
                } = await import("/main.js");

                HydratableElementController.install();

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = {
                            name,
                            styles: css`
                                :host {
                                    color: red;
                                }
                            `,
                        };
                    }
                ).define();

                const element = document.createElement(name) as any;
                element.setAttribute("needs-hydration", "");
                ElementController.forCustomElement(element);

                element.setAttribute("defer-hydration", "");
                document.body.appendChild(element);
                const attached =
                    element.$fastController.mainStyles?.isAttachedTo(element) ?? false;
                document.body.removeChild(element);

                ElementController.setStrategy(ElementController);
                return attached;
            });

            expect(stylesAttached).toBe(false);
        });
    });

    test.describe("when the `defer-hydration` attribute removed after connection", () => {
        test("should render the element's template", async ({ page }) => {
            await page.goto("/");

            const { beforeRemove, afterRemove } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    HydratableElementController,
                    html,
                    Updates,
                    uniqueElementName,
                } = await import("/main.js");

                HydratableElementController.install();

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = {
                            name,
                            template: html`
                                <p>Hello world</p>
                            `,
                        };
                    }
                ).define();

                const element = document.createElement(name) as any;
                element.setAttribute("needs-hydration", "");
                ElementController.forCustomElement(element);

                element.setAttribute("defer-hydration", "");
                document.body.appendChild(element);
                const beforeRemove = element.shadowRoot?.innerHTML ?? "";

                element.removeAttribute("defer-hydration");

                const timeout = new Promise(function (resolve) {
                    setTimeout(resolve, 100);
                });

                await Promise.race([Updates.next(), timeout]);

                const afterRemove = element.shadowRoot?.innerHTML ?? "";
                document.body.removeChild(element);

                ElementController.setStrategy(ElementController);
                return { beforeRemove, afterRemove };
            });

            expect(beforeRemove).toBe("");
            expect(afterRemove.trim()).toBe("<p>Hello world</p>");
        });

        test("should attach the element's main stylesheet", async ({ page }) => {
            await page.goto("/");

            const { beforeRemove, afterRemove } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    FASTElement,
                    FASTElementDefinition,
                    ElementController,
                    HydratableElementController,
                    css,
                    Updates,
                    uniqueElementName,
                } = await import("/main.js");

                HydratableElementController.install();

                const name = uniqueElementName();
                FASTElementDefinition.compose(
                    class ControllerTest extends FASTElement {
                        static definition = {
                            name,
                            styles: css`
                                :host {
                                    color: red;
                                }
                            `,
                        };
                    }
                ).define();

                const element = document.createElement(name) as any;
                element.setAttribute("needs-hydration", "");
                ElementController.forCustomElement(element);

                element.setAttribute("defer-hydration", "");
                document.body.appendChild(element);
                const beforeRemove =
                    element.$fastController.mainStyles?.isAttachedTo(element) ?? false;

                element.removeAttribute("defer-hydration");

                const timeout = new Promise(function (resolve) {
                    setTimeout(resolve, 100);
                });

                await Promise.race([Updates.next(), timeout]);

                const afterRemove =
                    element.$fastController.mainStyles?.isAttachedTo(element) ?? false;
                document.body.removeChild(element);

                ElementController.setStrategy(ElementController);
                return { beforeRemove, afterRemove };
            });

            expect(beforeRemove).toBe(false);
            expect(afterRemove).toBe(true);
        });
    });
});

test.describe("HydrationMarkup", () => {
    test.describe("content bindings", () => {
        test("isContentBindingStartMarker should return true when provided the output of isBindingStartMarker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.isContentBindingStartMarker(
                    HydrationMarkup.contentBindingStartMarker(12, "foobar")
                );
            });

            expect(result).toBe(true);
        });

        test("isContentBindingStartMarker should return false when provided the output of isBindingEndMarker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.isContentBindingStartMarker(
                    HydrationMarkup.contentBindingEndMarker(12, "foobar")
                );
            });

            expect(result).toBe(false);
        });

        test("isContentBindingEndMarker should return true when provided the output of isBindingEndMarker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.isContentBindingEndMarker(
                    HydrationMarkup.contentBindingEndMarker(12, "foobar")
                );
            });

            expect(result).toBe(true);
        });

        test("parseContentBindingStartMarker should return null when not provided a start marker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.parseContentBindingStartMarker(
                    HydrationMarkup.contentBindingEndMarker(12, "foobar")
                );
            });

            expect(result).toBe(null);
        });

        test("parseContentBindingStartMarker should the index and id arguments to contentBindingStartMarker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.parseContentBindingStartMarker(
                    HydrationMarkup.contentBindingStartMarker(12, "foobar")
                );
            });

            expect(result).toEqual([12, "foobar"]);
        });

        test("parseContentBindingEndMarker should return null when not provided an end marker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.parseContentBindingEndMarker(
                    HydrationMarkup.contentBindingStartMarker(12, "foobar")
                );
            });

            expect(result).toBe(null);
        });

        test("parseContentBindingEndMarker should the index and id arguments to contentBindingEndMarker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.parseContentBindingEndMarker(
                    HydrationMarkup.contentBindingEndMarker(12, "foobar")
                );
            });

            expect(result).toEqual([12, "foobar"]);
        });
    });

    test.describe("attribute binding parser", () => {
        test("should return null when the element does not have an attribute marker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.parseAttributeBinding(
                    document.createElement("div")
                );
            });

            expect(result).toBe(null);
        });

        test("should return the binding ids as numbers when assigned a marker attribute", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                const el = document.createElement("div");
                el.setAttribute(HydrationMarkup.attributeMarkerName, "0 1 2");
                return HydrationMarkup.parseAttributeBinding(el);
            });

            expect(result).toEqual([0, 1, 2]);
        });

        test("should return the binding ids as numbers when assigned enumerated marker attributes", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                const el = document.createElement("div");
                el.setAttribute(`${HydrationMarkup.attributeMarkerName}-0`, "");
                el.setAttribute(`${HydrationMarkup.attributeMarkerName}-1`, "");
                el.setAttribute(`${HydrationMarkup.attributeMarkerName}-2`, "");
                return HydrationMarkup.parseEnumeratedAttributeBinding(el);
            });

            expect(result).toEqual([0, 1, 2]);
        });

        test("should return the binding ids as numbers when assigned enumerated marker attributes on multiple elements", async ({
            page,
        }) => {
            await page.goto("/");

            const { result1, result2, result3 } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                const el = document.createElement("div");
                const el2 = document.createElement("div");
                const el3 = document.createElement("div");
                el.setAttribute(`${HydrationMarkup.attributeMarkerName}-0`, "");
                el2.setAttribute(`${HydrationMarkup.attributeMarkerName}-1`, "");
                el3.setAttribute(`${HydrationMarkup.attributeMarkerName}-2`, "");

                return {
                    result1: HydrationMarkup.parseEnumeratedAttributeBinding(el),
                    result2: HydrationMarkup.parseEnumeratedAttributeBinding(el2),
                    result3: HydrationMarkup.parseEnumeratedAttributeBinding(el3),
                };
            });

            expect(result1).toEqual([0]);
            expect(result2).toEqual([1]);
            expect(result3).toEqual([2]);
        });
    });

    test.describe("compact attribute binding parser", () => {
        test("should return the binding ids as numbers when assigned compact marker attributes", async ({
            page,
        }) => {
            await page.goto("/");

            const { result1, result2 } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                const el = document.createElement("div");
                const el2 = document.createElement("div");
                el.setAttribute(`${HydrationMarkup.compactAttributeMarkerName}-5-3`, "");
                el2.setAttribute(`${HydrationMarkup.compactAttributeMarkerName}-2-1`, "");

                return {
                    result1: HydrationMarkup.parseCompactAttributeBinding(el),
                    result2: HydrationMarkup.parseCompactAttributeBinding(el2),
                };
            });

            expect(result1).toEqual([5, 6, 7]);
            expect(result2).toEqual([2]);
        });

        test("should throw when assigned invalid compact marker attributes", async ({
            page,
        }) => {
            await page.goto("/");

            const errorMessage = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                const el = document.createElement("div");
                el.setAttribute(`${HydrationMarkup.compactAttributeMarkerName}-5`, "");

                try {
                    HydrationMarkup.parseCompactAttributeBinding(el);
                    return null;
                } catch (error: any) {
                    return error.message;
                }
            });

            expect(errorMessage).toContain("Invalid compact attribute marker name");
        });

        test("should throw when assigned non-numeric compact marker attributes", async ({
            page,
        }) => {
            await page.goto("/");

            const errorMessage = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                const el2 = document.createElement("div");
                el2.toggleAttribute(
                    `${HydrationMarkup.compactAttributeMarkerName}-foo-bar`
                );

                try {
                    HydrationMarkup.parseCompactAttributeBinding(el2);
                    return null;
                } catch (error: any) {
                    return error.message;
                }
            });

            expect(errorMessage).toContain("Invalid compact attribute marker name");
        });
    });

    test.describe("repeat parser", () => {
        test("isRepeatViewStartMarker should return true when provided the output of repeatStartMarker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.isRepeatViewStartMarker(
                    HydrationMarkup.repeatStartMarker(12)
                );
            });

            expect(result).toBe(true);
        });

        test("isRepeatViewStartMarker should return false when provided the output of repeatEndMarker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.isRepeatViewStartMarker(
                    HydrationMarkup.repeatEndMarker(12)
                );
            });

            expect(result).toBe(false);
        });

        test("isRepeatViewEndMarker should return true when provided the output of repeatEndMarker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.isRepeatViewEndMarker(
                    HydrationMarkup.repeatEndMarker(12)
                );
            });

            expect(result).toBe(true);
        });

        test("isRepeatViewEndMarker should return false when provided the output of repeatStartMarker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.isRepeatViewEndMarker(
                    HydrationMarkup.repeatStartMarker(12)
                );
            });

            expect(result).toBe(false);
        });

        test("parseRepeatStartMarker should return null when not provided a start marker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.parseRepeatStartMarker(
                    HydrationMarkup.repeatEndMarker(12)
                );
            });

            expect(result).toBe(null);
        });

        test("parseRepeatStartMarker should the index and id arguments to repeatStartMarker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.parseRepeatStartMarker(
                    HydrationMarkup.repeatStartMarker(12)
                );
            });

            expect(result).toBe(12);
        });

        test("parseRepeatEndMarker should return null when not provided an end marker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.parseRepeatEndMarker(
                    HydrationMarkup.repeatStartMarker(12)
                );
            });

            expect(result).toBe(null);
        });

        test("parseRepeatEndMarker should the index and id arguments to repeatEndMarker", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HydrationMarkup } = await import("/main.js");

                return HydrationMarkup.parseRepeatEndMarker(
                    HydrationMarkup.repeatEndMarker(12)
                );
            });

            expect(result).toBe(12);
        });
    });
});
