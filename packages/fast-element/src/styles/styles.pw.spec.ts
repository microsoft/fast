import { expect, test } from "@playwright/test";

test.describe("AdoptedStyleSheetsStrategy", () => {
    let supportsAdoptedStyleSheets = false;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto("/");

        supportsAdoptedStyleSheets = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ElementStyles } = await import("/main.js");
            return ElementStyles.supportsAdoptedStyleSheets;
        });

        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test.describe("when adding and removing styles", () => {
        test("should remove an associated stylesheet", async ({ page }) => {
            test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

            const { afterAdd, afterRemove } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { AdoptedStyleSheetsStrategy } = await import("/main.js");

                const strategy = new AdoptedStyleSheetsStrategy([``]);
                const target = {
                    adoptedStyleSheets: [] as CSSStyleSheet[],
                };

                strategy.addStylesTo(target);
                const afterAdd = target.adoptedStyleSheets.length;

                strategy.removeStylesFrom(target);
                const afterRemove = target.adoptedStyleSheets.length;

                return { afterAdd, afterRemove };
            });

            expect(afterAdd).toBe(1);
            expect(afterRemove).toBe(0);
        });

        test("should not remove unassociated styles", async ({ page }) => {
            test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

            const {
                afterAddLength,
                containsAfterAdd,
                afterRemoveLength,
                containsAfterRemove,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { AdoptedStyleSheetsStrategy } = await import("/main.js");

                const strategy = new AdoptedStyleSheetsStrategy(["test"]);
                const style = new CSSStyleSheet();
                const target = {
                    adoptedStyleSheets: [style],
                };
                strategy.addStylesTo(target);

                const afterAddLength = target.adoptedStyleSheets.length;
                const containsAfterAdd = target.adoptedStyleSheets.includes(
                    strategy.sheets[0],
                );

                strategy.removeStylesFrom(target);

                const afterRemoveLength = target.adoptedStyleSheets.length;
                const containsAfterRemove = target.adoptedStyleSheets.includes(
                    strategy.sheets[0],
                );

                return {
                    afterAddLength,
                    containsAfterAdd,
                    afterRemoveLength,
                    containsAfterRemove,
                };
            });

            expect(afterAddLength).toBe(2);
            expect(containsAfterAdd).toBe(true);
            expect(afterRemoveLength).toBe(1);
            expect(containsAfterRemove).toBe(false);
        });

        test("should track when added and removed from a target", async ({ page }) => {
            test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

            const { beforeAdd, afterAdd, afterRemove } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { ElementStyles } = await import("/main.js");

                const styles = ``;
                const elementStyles = new ElementStyles([styles]);
                const target = {
                    adoptedStyleSheets: [],
                };

                const beforeAdd = elementStyles.isAttachedTo(target);

                elementStyles.addStylesTo(target);
                const afterAdd = elementStyles.isAttachedTo(target);

                elementStyles.removeStylesFrom(target);
                const afterRemove = elementStyles.isAttachedTo(target);

                return { beforeAdd, afterAdd, afterRemove };
            });

            expect(beforeAdd).toBe(false);
            expect(afterAdd).toBe(true);
            expect(afterRemove).toBe(false);
        });

        test("should order HTMLStyleElement order by addStyleTo() call order", async ({
            page,
        }) => {
            test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

            const { firstIsRed, secondIsGreen } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { AdoptedStyleSheetsStrategy } = await import("/main.js");

                const red = new AdoptedStyleSheetsStrategy(["r"]);
                const green = new AdoptedStyleSheetsStrategy(["g"]);
                const target = {
                    adoptedStyleSheets: [] as CSSStyleSheet[],
                };

                red.addStylesTo(target);
                green.addStylesTo(target);

                const firstIsRed = target.adoptedStyleSheets[0] === red.sheets[0];
                const secondIsGreen = target.adoptedStyleSheets[1] === green.sheets[0];

                return { firstIsRed, secondIsGreen };
            });

            expect(firstIsRed).toBe(true);
            expect(secondIsGreen).toBe(true);
        });

        test("should order HTMLStyleElements in array order of provided sheets", async ({
            page,
        }) => {
            test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

            const { firstIsR, secondIsG } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { AdoptedStyleSheetsStrategy } = await import("/main.js");

                const red = new AdoptedStyleSheetsStrategy(["r", "g"]);
                const target = {
                    adoptedStyleSheets: [] as CSSStyleSheet[],
                };

                red.addStylesTo(target);

                const firstIsR = target.adoptedStyleSheets[0] === red.sheets[0];
                const secondIsG = target.adoptedStyleSheets[1] === red.sheets[1];

                return { firstIsR, secondIsG };
            });

            expect(firstIsR).toBe(true);
            expect(secondIsG).toBe(true);
        });

        test("should apply stylesheets to the shadowRoot of a provided element when the shadowRoot is publicly accessible", async ({
            page,
        }) => {
            test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

            const { afterAdd, afterRemove } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { AdoptedStyleSheetsStrategy } = await import("/main.js");

                const strategy = new AdoptedStyleSheetsStrategy([``]);
                const target = {
                    shadowRoot: {
                        adoptedStyleSheets: [] as CSSStyleSheet[],
                    },
                };

                strategy.addStylesTo(target as any);
                const afterAdd = target.shadowRoot.adoptedStyleSheets.length;

                strategy.removeStylesFrom(target as any);
                const afterRemove = target.shadowRoot.adoptedStyleSheets.length;

                return { afterAdd, afterRemove };
            });

            expect(afterAdd).toBe(1);
            expect(afterRemove).toBe(0);
        });

        test("should apply stylesheets to the shadowRoot of a provided FASTElement when defined with a closed shadowRoot", async ({
            page,
        }) => {
            test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

            const { afterAdd, afterRemove } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    AdoptedStyleSheetsStrategy,
                    FASTElement,
                    html,
                    ref,
                    uniqueElementName,
                } = await import("/main.js");

                const name = uniqueElementName();

                class MyElement extends FASTElement {
                    pChild!: HTMLParagraphElement;

                    get styleTarget() {
                        return this.pChild.getRootNode();
                    }
                }

                await MyElement.define({
                    name,
                    template: html`
                        <p ${ref("pChild")}></p>
                    `,
                    shadowOptions: {
                        mode: "closed",
                    },
                });

                const strategy = new AdoptedStyleSheetsStrategy([``]);
                const target = document.createElement(name) as any;
                document.body.appendChild(target);

                strategy.addStylesTo(target);
                const afterAdd = target.styleTarget.adoptedStyleSheets!.length;

                strategy.removeStylesFrom(target);
                const afterRemove = target.styleTarget.adoptedStyleSheets!.length;

                document.body.removeChild(target);

                return { afterAdd, afterRemove };
            });

            expect(afterAdd).toBe(1);
            expect(afterRemove).toBe(0);
        });

        test("should apply stylesheets to the parent document of the provided element when the shadowRoot of the element is inaccessible or doesn't exist and the element is in light DOM", async ({
            page,
        }) => {
            test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

            const { afterAdd, afterRemove } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { AdoptedStyleSheetsStrategy } = await import("/main.js");

                const target = document.createElement("div");
                target.attachShadow({ mode: "closed" });
                document.body.appendChild(target);

                const strategy = new AdoptedStyleSheetsStrategy([``]);

                strategy.addStylesTo(target);
                const afterAdd = (document as any).adoptedStyleSheets!.length;

                strategy.removeStylesFrom(target);
                const afterRemove = (document as any).adoptedStyleSheets!.length;

                document.body.removeChild(target);

                return { afterAdd, afterRemove };
            });

            expect(afterAdd).toBe(1);
            expect(afterRemove).toBe(0);
        });

        test("should apply stylesheets to the host's shadowRoot when the shadowRoot of the element is inaccessible or doesn't exist and the element is in a shadowRoot", async ({
            page,
        }) => {
            test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

            const { afterAdd, afterRemove } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { AdoptedStyleSheetsStrategy } = await import("/main.js");

                const strategy = new AdoptedStyleSheetsStrategy([``]);
                const host = document.createElement("div");
                const target = document.createElement("div");
                const hostShadow = host.attachShadow({ mode: "closed" });
                target.attachShadow({ mode: "closed" });
                hostShadow.appendChild(target);
                document.body.appendChild(host);

                strategy.addStylesTo(target);
                const afterAdd = (hostShadow as any).adoptedStyleSheets!.length;

                strategy.removeStylesFrom(target);
                const afterRemove = (hostShadow as any).adoptedStyleSheets!.length;

                document.body.removeChild(host);

                return { afterAdd, afterRemove };
            });

            expect(afterAdd).toBe(1);
            expect(afterRemove).toBe(0);
        });
    });
});

test.describe("StyleElementStrategy", () => {
    test("can add and remove from the document directly", async ({ page }) => {
        await page.goto("/");

        const { afterAddIsStyleElement, afterRemoveLength } = await page.evaluate(
            async () => {
                // @ts-expect-error: Client module.
                const { ElementStyles, StyleElementStrategy } = await import("/main.js");

                const styles = [``];
                const elementStyles = new ElementStyles(styles).withStrategy(
                    StyleElementStrategy,
                );
                document.body.innerHTML = "";

                elementStyles.addStylesTo(document);

                const afterAddIsStyleElement =
                    document.body.childNodes[0] instanceof HTMLStyleElement;

                elementStyles.removeStylesFrom(document);

                const afterRemoveLength = document.body.childNodes.length;

                return { afterAddIsStyleElement, afterRemoveLength };
            },
        );

        expect(afterAddIsStyleElement).toBe(true);
        expect(afterRemoveLength).toBe(0);
    });

    test("can add and remove from a ShadowRoot", async ({ page }) => {
        await page.goto("/");

        const { afterAddIsStyleElement, afterRemoveLength } = await page.evaluate(
            async () => {
                // @ts-expect-error: Client module.
                const { StyleElementStrategy } = await import("/main.js");

                const styles = ``;
                const strategy = new StyleElementStrategy([styles]);
                document.body.innerHTML = "";

                const element = document.createElement("div");
                const shadowRoot = element.attachShadow({ mode: "open" });

                strategy.addStylesTo(shadowRoot);

                const afterAddIsStyleElement =
                    shadowRoot.childNodes[0] instanceof HTMLStyleElement;

                strategy.removeStylesFrom(shadowRoot);

                const afterRemoveLength = shadowRoot.childNodes.length;

                return { afterAddIsStyleElement, afterRemoveLength };
            },
        );

        expect(afterAddIsStyleElement).toBe(true);
        expect(afterRemoveLength).toBe(0);
    });

    test("should track when added and removed from a target", async ({ page }) => {
        await page.goto("/");

        const { beforeAdd, afterAdd, afterRemove } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ElementStyles } = await import("/main.js");

            const styles = ``;
            const elementStyles = new ElementStyles([styles]);
            document.body.innerHTML = "";

            const beforeAdd = elementStyles.isAttachedTo(document);

            elementStyles.addStylesTo(document);
            const afterAdd = elementStyles.isAttachedTo(document);

            elementStyles.removeStylesFrom(document);
            const afterRemove = elementStyles.isAttachedTo(document);

            return { beforeAdd, afterAdd, afterRemove };
        });

        expect(beforeAdd).toBe(false);
        expect(afterAdd).toBe(true);
        expect(afterRemove).toBe(false);
    });

    test("should order HTMLStyleElement order by addStyleTo() call order", async ({
        page,
    }) => {
        await page.goto("/");

        const { firstInnerHTML, secondInnerHTML } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { StyleElementStrategy } = await import("/main.js");

            const red = new StyleElementStrategy([`body:{color:red;}`]);
            const green = new StyleElementStrategy([`body:{color:green;}`]);
            document.body.innerHTML = "";

            const element = document.createElement("div");
            const shadowRoot = element.attachShadow({ mode: "open" });
            red.addStylesTo(shadowRoot);
            green.addStylesTo(shadowRoot);

            const firstInnerHTML = (shadowRoot.childNodes[0] as HTMLStyleElement)
                .innerHTML;
            const secondInnerHTML = (shadowRoot.childNodes[1] as HTMLStyleElement)
                .innerHTML;

            return { firstInnerHTML, secondInnerHTML };
        });

        expect(firstInnerHTML).toBe("body:{color:red;}");
        expect(secondInnerHTML).toBe("body:{color:green;}");
    });

    test("should order the HTMLStyleElements in array order of provided sheets", async ({
        page,
    }) => {
        await page.goto("/");

        const { firstInnerHTML, secondInnerHTML } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { StyleElementStrategy } = await import("/main.js");

            const red = new StyleElementStrategy([
                `body:{color:red;}`,
                `body:{color:green;}`,
            ]);
            document.body.innerHTML = "";

            const element = document.createElement("div");
            const shadowRoot = element.attachShadow({ mode: "open" });
            red.addStylesTo(shadowRoot);

            const firstInnerHTML = (shadowRoot.childNodes[0] as HTMLStyleElement)
                .innerHTML;
            const secondInnerHTML = (shadowRoot.childNodes[1] as HTMLStyleElement)
                .innerHTML;

            return { firstInnerHTML, secondInnerHTML };
        });

        expect(firstInnerHTML).toBe("body:{color:red;}");
        expect(secondInnerHTML).toBe("body:{color:green;}");
    });

    test("should apply stylesheets to the shadowRoot of a provided element when the shadowRoot is publicly accessible", async ({
        page,
    }) => {
        await page.goto("/");

        const { afterAddInnerHTML, afterRemoveChild } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { StyleElementStrategy } = await import("/main.js");

            const cssText = ":host{color:red}";
            const strategy = new StyleElementStrategy([cssText]);
            const element = document.createElement("div");
            const shadowRoot = element.attachShadow({ mode: "open" });

            strategy.addStylesTo(shadowRoot);
            const afterAddInnerHTML = (shadowRoot.childNodes[0] as HTMLStyleElement)
                .innerHTML;

            strategy.removeStylesFrom(shadowRoot);
            const afterRemoveChild = shadowRoot.childNodes[0] === undefined;

            return { afterAddInnerHTML, afterRemoveChild };
        });

        expect(afterAddInnerHTML).toBe(":host{color:red}");
        expect(afterRemoveChild).toBe(true);
    });

    test("should apply stylesheets to the shadowRoot of a provided FASTElement when defined with a closed shadowRoot", async ({
        page,
    }) => {
        await page.goto("/");

        const { afterAdd, afterRemove } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, html, ref, uniqueElementName, StyleElementStrategy } =
                await import("/main.js");

            const css = ":host{color:red}";
            const name = uniqueElementName();

            class MyElement extends FASTElement {
                pChild!: HTMLParagraphElement;

                get styleTarget() {
                    return this.pChild.getRootNode() as ShadowRoot;
                }
            }

            await MyElement.define({
                name,
                template: html`
                    <p ${ref("pChild")}></p>
                `,
                shadowOptions: {
                    mode: "closed",
                },
            });

            const strategy = new StyleElementStrategy([css]);
            const target = document.createElement(name) as any;
            document.body.appendChild(target);

            strategy.addStylesTo(target);
            // const afterAdd = (target.styleTarget.childNodes[2] as HTMLStyleElement).innerHTML;
            const afterAdd = target.styleTarget.innerHTML;

            strategy.removeStylesFrom(target);
            const afterRemove = target.styleTarget.innerHTML;

            document.body.removeChild(target);

            return { afterAdd, afterRemove };
        });

        expect(afterAdd).toContain(":host{color:red}");
        expect(afterRemove).not.toContain(":host{color:red}");
    });

    test("should apply stylesheets to the parent document of the provided element when the shadowRoot of the element is inaccessible or doesn't exist and the element is in light DOM", async ({
        page,
    }) => {
        await page.goto("/");

        const { afterAddStyles, afterRemoveStyles } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { AdoptedStyleSheetsStrategy } = await import("/main.js");

            const target = document.createElement("div");
            target.attachShadow({ mode: "closed" });
            document.body.appendChild(target);

            const strategy = new AdoptedStyleSheetsStrategy([``]);

            strategy.addStylesTo(target);

            const afterAddStyles = document.adoptedStyleSheets!.length;

            strategy.removeStylesFrom(target);

            const afterRemoveStyles = document.adoptedStyleSheets!.length;

            document.body.removeChild(target);

            return { afterAddStyles, afterRemoveStyles };
        });

        expect(afterAddStyles).toEqual(1);
        expect(afterRemoveStyles).toEqual(0);
    });

    test("should apply stylesheets to the host's shadowRoot when the shadowRoot of the element is inaccessible or doesn't exist and the element is in a shadowRoot", async ({
        page,
    }) => {
        await page.goto("/");

        const { afterAddInnerHTML, afterRemoveAdoptedLength, afterRemoveChild } =
            await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { StyleElementStrategy } = await import("/main.js");

                const cssText = ":host{color:red}";
                const strategy = new StyleElementStrategy([cssText]);
                const host = document.createElement("div");
                const target = document.createElement("div");
                const hostShadow = host.attachShadow({ mode: "closed" });
                target.attachShadow({ mode: "closed" });
                hostShadow.appendChild(target);
                document.body.appendChild(host);

                strategy.addStylesTo(target);
                const afterAddInnerHTML = (hostShadow.childNodes[1] as HTMLStyleElement)
                    .innerHTML;

                strategy.removeStylesFrom(target);
                const afterRemoveAdoptedLength = (hostShadow as any).adoptedStyleSheets!
                    .length;
                const afterRemoveChild =
                    (hostShadow.childNodes[1] as HTMLStyleElement) === undefined;

                document.body.removeChild(host);

                return {
                    afterAddInnerHTML,
                    afterRemoveAdoptedLength,
                    afterRemoveChild,
                };
            });

        expect(afterAddInnerHTML).toBe(":host{color:red}");
        expect(afterRemoveAdoptedLength).toBe(0);
        expect(afterRemoveChild).toBe(true);
    });
});

test.describe("ElementStyles", () => {
    let supportsAdoptedStyleSheets = false;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto("/");

        supportsAdoptedStyleSheets = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ElementStyles } = await import("/main.js");
            return ElementStyles.supportsAdoptedStyleSheets;
        });

        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("can create from a string", async ({ page }) => {
        const containsCss = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ElementStyles } = await import("/main.js");

            const css = ".class { color: red; }";
            const styles = new ElementStyles([css]);
            return styles.styles.includes(css);
        });

        expect(containsCss).toBe(true);
    });

    test("can create from multiple strings", async ({ page }) => {
        const { containsCss1, css1Index, containsCss2 } = await page.evaluate(
            async () => {
                // @ts-expect-error: Client module.
                const { ElementStyles } = await import("/main.js");

                const css1 = ".class { color: red; }";
                const css2 = ".class2 { color: red; }";
                const styles = new ElementStyles([css1, css2]);

                return {
                    containsCss1: styles.styles.includes(css1),
                    css1Index: styles.styles.indexOf(css1),
                    containsCss2: styles.styles.includes(css2),
                };
            },
        );

        expect(containsCss1).toBe(true);
        expect(css1Index).toBe(0);
        expect(containsCss2).toBe(true);
    });

    test("can create from an ElementStyles", async ({ page }) => {
        const containsExisting = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ElementStyles } = await import("/main.js");

            const css = ".class { color: red; }";
            const existingStyles = new ElementStyles([css]);
            const styles = new ElementStyles([existingStyles]);
            return styles.styles.includes(existingStyles);
        });

        expect(containsExisting).toBe(true);
    });

    test("can create from multiple ElementStyles", async ({ page }) => {
        const { containsFirst, firstIndex, containsSecond } = await page.evaluate(
            async () => {
                // @ts-expect-error: Client module.
                const { ElementStyles } = await import("/main.js");

                const css1 = ".class { color: red; }";
                const css2 = ".class2 { color: red; }";
                const existingStyles1 = new ElementStyles([css1]);
                const existingStyles2 = new ElementStyles([css2]);
                const styles = new ElementStyles([existingStyles1, existingStyles2]);

                return {
                    containsFirst: styles.styles.includes(existingStyles1),
                    firstIndex: styles.styles.indexOf(existingStyles1),
                    containsSecond: styles.styles.includes(existingStyles2),
                };
            },
        );

        expect(containsFirst).toBe(true);
        expect(firstIndex).toBe(0);
        expect(containsSecond).toBe(true);
    });

    test("can create from mixed strings and ElementStyles", async ({ page }) => {
        const { containsCss1, css1Index, containsExisting } = await page.evaluate(
            async () => {
                // @ts-expect-error: Client module.
                const { ElementStyles } = await import("/main.js");

                const css1 = ".class { color: red; }";
                const css2 = ".class2 { color: red; }";
                const existingStyles2 = new ElementStyles([css2]);
                const styles = new ElementStyles([css1, existingStyles2]);

                return {
                    containsCss1: styles.styles.includes(css1),
                    css1Index: styles.styles.indexOf(css1),
                    containsExisting: styles.styles.includes(existingStyles2),
                };
            },
        );

        expect(containsCss1).toBe(true);
        expect(css1Index).toBe(0);
        expect(containsExisting).toBe(true);
    });

    test("can create from a CSSStyleSheet", async ({ page }) => {
        test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

        const containsSheet = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ElementStyles } = await import("/main.js");

            const styleSheet = new CSSStyleSheet();
            const styles = new ElementStyles([styleSheet]);
            return styles.styles.includes(styleSheet);
        });

        expect(containsSheet).toBe(true);
    });

    test("can create from multiple CSSStyleSheets", async ({ page }) => {
        test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

        const { containsFirst, firstIndex, containsSecond } = await page.evaluate(
            async () => {
                // @ts-expect-error: Client module.
                const { ElementStyles } = await import("/main.js");

                const styleSheet1 = new CSSStyleSheet();
                const styleSheet2 = new CSSStyleSheet();
                const styles = new ElementStyles([styleSheet1, styleSheet2]);

                return {
                    containsFirst: styles.styles.includes(styleSheet1),
                    firstIndex: styles.styles.indexOf(styleSheet1),
                    containsSecond: styles.styles.includes(styleSheet2),
                };
            },
        );

        expect(containsFirst).toBe(true);
        expect(firstIndex).toBe(0);
        expect(containsSecond).toBe(true);
    });

    test("can create from mixed strings, ElementStyles, and CSSStyleSheets", async ({
        page,
    }) => {
        test.skip(!supportsAdoptedStyleSheets, "Adopted stylesheets not supported");

        const {
            containsCss1,
            css1Index,
            containsExisting,
            existingIndex,
            containsSheet,
        } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ElementStyles } = await import("/main.js");

            const css1 = ".class { color: red; }";
            const css2 = ".class2 { color: red; }";
            const existingStyles2 = new ElementStyles([css2]);
            const styleSheet3 = new CSSStyleSheet();
            const styles = new ElementStyles([css1, existingStyles2, styleSheet3]);

            return {
                containsCss1: styles.styles.includes(css1),
                css1Index: styles.styles.indexOf(css1),
                containsExisting: styles.styles.includes(existingStyles2),
                existingIndex: styles.styles.indexOf(existingStyles2),
                containsSheet: styles.styles.includes(styleSheet3),
            };
        });

        expect(containsCss1).toBe(true);
        expect(css1Index).toBe(0);
        expect(containsExisting).toBe(true);
        expect(existingIndex).toBe(1);
        expect(containsSheet).toBe(true);
    });
});

test.describe("css", () => {
    let supportsAdoptedStyleSheets = false;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto("/");

        supportsAdoptedStyleSheets = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ElementStyles } = await import("/main.js");
            return ElementStyles.supportsAdoptedStyleSheets;
        });

        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test.describe("with a CSSDirective", () => {
        test.describe("should interpolate the product of CSSDirective.createCSS() into the resulting ElementStyles CSS", () => {
            test("when the result is a string", async ({ page }) => {
                const hasRedCss = await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const { css, cssDirective } = await import("/main.js");

                    class Directive {
                        createCSS() {
                            return "red";
                        }
                    }

                    cssDirective()(Directive);

                    const styles = css`
                        host: {
                            color: ${new Directive()};
                        }
                    `;
                    return (
                        styles.styles[0].includes("host:") &&
                        styles.styles[0].includes("color: red;")
                    );
                });

                expect(hasRedCss).toBe(true);
            });

            test("when the result is an ElementStyles", async ({ page }) => {
                const includesStyles = await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const { css, cssDirective } = await import("/main.js");

                    const _styles = css`
                        :host {
                            color: red;
                        }
                    `;

                    class Directive {
                        createCSS() {
                            return _styles;
                        }
                    }

                    cssDirective()(Directive);

                    const styles = css`
                        ${new Directive()}
                    `;
                    return styles.styles.includes(_styles);
                });

                expect(includesStyles).toBe(true);
            });

            test("when the result is a CSSStyleSheet", async ({ page }) => {
                test.skip(
                    !supportsAdoptedStyleSheets,
                    "Adopted stylesheets not supported",
                );

                const includesSheet = await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const { css, cssDirective } = await import("/main.js");

                    const _styles = new CSSStyleSheet();

                    class Directive {
                        createCSS() {
                            return _styles;
                        }
                    }

                    cssDirective()(Directive);

                    const styles = css`
                        ${new Directive()}
                    `;
                    return styles.styles.includes(_styles);
                });

                expect(includesSheet).toBe(true);
            });
        });

        test("should not expose removed behavior APIs on ElementStyles", async ({
            page,
        }) => {
            const { exposesBehaviors, exposesWithBehaviors } = await page.evaluate(
                async () => {
                    // @ts-expect-error: Client module.
                    const { css } = await import("/main.js");

                    const styles = css``;
                    const prototype = Object.getPrototypeOf(styles);

                    return {
                        exposesBehaviors:
                            "behaviors" in styles ||
                            Object.prototype.hasOwnProperty.call(prototype, "behaviors"),
                        exposesWithBehaviors:
                            "withBehaviors" in styles ||
                            Object.prototype.hasOwnProperty.call(
                                prototype,
                                "withBehaviors",
                            ),
                    };
                },
            );

            expect(exposesBehaviors).toBe(false);
            expect(exposesWithBehaviors).toBe(false);
        });
    });
});

test.describe("cssPartial", () => {
    test("should have a createCSS method that is the CSS string interpolated with the createCSS product of any CSSDirectives", async ({
        page,
    }) => {
        await page.goto("/");

        const createCSSResult = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { css, cssDirective } = await import("/main.js");

            class MyDirective {
                createCSS() {
                    return "red";
                }
            }

            cssDirective()(MyDirective);

            const partial = css.partial`color: ${new MyDirective()}`;
            return partial.createCSS();
        });

        expect(createCSSResult).toBe("color: red");
    });

    test("should return ElementStyles when the partial includes composable styles", async ({
        page,
    }) => {
        await page.goto("/");

        const { hasDisplayRule, includesStyles, isElementStyles } = await page.evaluate(
            async () => {
                // @ts-expect-error: Client module.
                const { css, ElementStyles } = await import("/main.js");

                const styles = css`
                    :host {
                        color: blue;
                    }
                `;
                const partial = css.partial`
                    :host {
                        display: block;
                    }
                    ${styles}
                `;
                const created = partial.createCSS();
                const cssText =
                    created instanceof ElementStyles
                        ? created.styles.find(x => typeof x === "string")
                        : "";

                return {
                    hasDisplayRule:
                        typeof cssText === "string" && cssText.includes("display: block"),
                    includesStyles:
                        created instanceof ElementStyles &&
                        created.styles.includes(styles),
                    isElementStyles: created instanceof ElementStyles,
                };
            },
        );

        expect(hasDisplayRule).toBe(true);
        expect(includesStyles).toBe(true);
        expect(isElementStyles).toBe(true);
    });
});
