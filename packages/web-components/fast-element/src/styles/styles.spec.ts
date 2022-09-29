import { expect } from "chai";
import {
    AdoptedStyleSheetsStrategy, StyleElementStrategy
} from "../components/element-controller.js";
import type { StyleTarget } from "../interfaces.js";
import { AddBehavior, cssDirective, CSSDirective } from "./css-directive.js";
import { css } from "./css.js";
import {
    ComposableStyles,
    ElementStyles
} from "./element-styles.js";
import type { HostBehavior } from "./host.js";

if (ElementStyles.supportsAdoptedStyleSheets) {
    describe("AdoptedStyleSheetsStrategy", () => {
        context("when removing styles", () => {
            it("should remove an associated stylesheet", () => {
                const strategy = new AdoptedStyleSheetsStrategy([``]);
                const target: Pick<StyleTarget, "adoptedStyleSheets"> = {
                    adoptedStyleSheets: [],
                };

                strategy.addStylesTo(target as StyleTarget);
                expect(target.adoptedStyleSheets!.length).to.equal(1);

                strategy.removeStylesFrom(target as StyleTarget);
                expect(target.adoptedStyleSheets!.length).to.equal(0);
            });

            it("should not remove unassociated styles", () => {
                const strategy = new AdoptedStyleSheetsStrategy(["test"]);
                const style = new CSSStyleSheet();
                const target: Pick<StyleTarget, "adoptedStyleSheets"> = {
                    adoptedStyleSheets: [style],
                };
                strategy.addStylesTo(target as StyleTarget);

                expect(target.adoptedStyleSheets!.length).to.equal(2);
                expect(target.adoptedStyleSheets).to.contain(strategy.sheets[0]);

                strategy.removeStylesFrom(target as StyleTarget);

                expect(target.adoptedStyleSheets!.length).to.equal(1);
                expect(target.adoptedStyleSheets).not.to.contain(strategy.sheets[0]);
            });

            it("should track when added and removed from a target", () => {
                const styles = ``;
                const elementStyles = new ElementStyles([styles]);
                const target = {
                    adoptedStyleSheets: [],
                } as unknown as StyleTarget;

                expect(elementStyles.isAttachedTo(target as StyleTarget)).to.equal(false)

                elementStyles.addStylesTo(target);
                expect(elementStyles.isAttachedTo(target)).to.equal(true)

                elementStyles.removeStylesFrom(target);
                expect(elementStyles.isAttachedTo(target)).to.equal(false)
            });

            it("should order HTMLStyleElement order by addStyleTo() call order", () => {
                const red = new AdoptedStyleSheetsStrategy(['r']);
                const green = new AdoptedStyleSheetsStrategy(['g']);
                const target: Pick<StyleTarget, "adoptedStyleSheets"> = {
                    adoptedStyleSheets: [],
                };

                red.addStylesTo(target as StyleTarget);
                green.addStylesTo(target as StyleTarget);

                expect((target.adoptedStyleSheets![0])).to.equal(red.sheets[0]);
                expect((target.adoptedStyleSheets![1])).to.equal(green.sheets[0]);
            });
            it("should order HTMLStyleElements in array order of provided sheets", () => {
                const red = new AdoptedStyleSheetsStrategy(['r', 'g']);
                const target: Pick<StyleTarget, "adoptedStyleSheets"> = {
                    adoptedStyleSheets: [],
                };

                red.addStylesTo(target as StyleTarget);

                expect((target.adoptedStyleSheets![0])).to.equal(red.sheets[0]);
                expect((target.adoptedStyleSheets![1])).to.equal(red.sheets[1]);
            });
        });
    });
}

describe("StyleElementStrategy", () => {
    it("can add and remove from the document directly", () => {
        const styles = [``];
        const elementStyles = new ElementStyles(styles)
            .withStrategy(StyleElementStrategy);
        document.body.innerHTML = "";

        elementStyles.addStylesTo(document);

        expect(document.body.childNodes[0]).to.be.instanceof(HTMLStyleElement);

        elementStyles.removeStylesFrom(document);

        expect(document.body.childNodes.length).to.equal(0);
    });

    it("can add and remove from a ShadowRoot", () => {
        const styles = ``;
        const strategy = new StyleElementStrategy([styles]);
        document.body.innerHTML = "";

        const element = document.createElement("div");
        const shadowRoot = element.attachShadow({ mode: "open" });

        strategy.addStylesTo(shadowRoot);

        expect(shadowRoot.childNodes[0]).to.be.instanceof(HTMLStyleElement);

        strategy.removeStylesFrom(shadowRoot);

        expect(shadowRoot.childNodes.length).to.equal(0);
    });

    it("should track when added and removed from a target", () => {
        const styles = ``;
        const elementStyles = new ElementStyles([styles]);
        document.body.innerHTML = "";

        expect(elementStyles.isAttachedTo(document)).to.equal(false)

        elementStyles.addStylesTo(document);
        expect(elementStyles.isAttachedTo(document)).to.equal(true)

        elementStyles.removeStylesFrom(document);
        expect(elementStyles.isAttachedTo(document)).to.equal(false)
    });

    it("should order HTMLStyleElement order by addStyleTo() call order", () => {
        const red = new StyleElementStrategy([`body:{color:red;}`]);
        const green = new StyleElementStrategy([`body:{color:green;}`]);
        document.body.innerHTML = "";

        const element = document.createElement("div");
        const shadowRoot = element.attachShadow({mode: "open"});
        red.addStylesTo(shadowRoot);
        green.addStylesTo(shadowRoot);

        expect((shadowRoot.childNodes[0] as HTMLStyleElement).innerHTML).to.equal("body:{color:red;}");
        expect((shadowRoot.childNodes[1] as HTMLStyleElement).innerHTML).to.equal("body:{color:green;}");
    });

    it("should order the HTMLStyleElements in array order of provided sheets", () => {
        const red = new StyleElementStrategy([`body:{color:red;}`, `body:{color:green;}`]);
        document.body.innerHTML = "";

        const element = document.createElement("div");
        const shadowRoot = element.attachShadow({mode: "open"});
        red.addStylesTo(shadowRoot);

        expect((shadowRoot.childNodes[0] as HTMLStyleElement).innerHTML).to.equal("body:{color:red;}");
        expect((shadowRoot.childNodes[1] as HTMLStyleElement).innerHTML).to.equal("body:{color:green;}");
    });
});

describe("ElementStyles", () => {
    it("can create from a string", () => {
        const css = ".class { color: red; }";
        const styles = new ElementStyles([css]);
        expect(styles.styles).to.contain(css);
    });

    it("can create from multiple strings", () => {
        const css1 = ".class { color: red; }";
        const css2 = ".class2 { color: red; }";
        const styles = new ElementStyles([css1, css2]);
        expect(styles.styles).to.contain(css1);
        expect(styles.styles.indexOf(css1)).to.equal(0);
        expect(styles.styles).to.contain(css2);
    });

    it("can create from an ElementStyles", () => {
        const css = ".class { color: red; }";
        const existingStyles = new ElementStyles([css]);
        const styles = new ElementStyles([existingStyles]);
        expect(styles.styles).to.contain(existingStyles);
    });

    it("can create from multiple ElementStyles", () => {
        const css1 = ".class { color: red; }";
        const css2 = ".class2 { color: red; }";
        const existingStyles1 = new ElementStyles([css1]);
        const existingStyles2 = new ElementStyles([css2]);
        const styles = new ElementStyles([existingStyles1, existingStyles2]);
        expect(styles.styles).to.contain(existingStyles1);
        expect(styles.styles.indexOf(existingStyles1)).to.equal(0);
        expect(styles.styles).to.contain(existingStyles2);
    });

    it("can create from mixed strings and ElementStyles", () => {
        const css1 = ".class { color: red; }";
        const css2 = ".class2 { color: red; }";
        const existingStyles2 = new ElementStyles([css2]);
        const styles = new ElementStyles([css1, existingStyles2]);
        expect(styles.styles).to.contain(css1);
        expect(styles.styles.indexOf(css1)).to.equal(0);
        expect(styles.styles).to.contain(existingStyles2);
    });

    if (ElementStyles.supportsAdoptedStyleSheets) {
        it("can create from a CSSStyleSheet", () => {
            const styleSheet = new CSSStyleSheet();
            const styles = new ElementStyles([styleSheet]);
            expect(styles.styles).to.contain(styleSheet);
        });

        it("can create from multiple CSSStyleSheets", () => {
            const styleSheet1 = new CSSStyleSheet();
            const styleSheet2 = new CSSStyleSheet();
            const styles = new ElementStyles([styleSheet1, styleSheet2]);
            expect(styles.styles).to.contain(styleSheet1);
            expect(styles.styles.indexOf(styleSheet1)).to.equal(0);
            expect(styles.styles).to.contain(styleSheet2);
        });

        it("can create from mixed strings, ElementStyles, and CSSStyleSheets", () => {
            const css1 = ".class { color: red; }";
            const css2 = ".class2 { color: red; }";
            const existingStyles2 = new ElementStyles([css2]);
            const styleSheet3 = new CSSStyleSheet();
            const styles = new ElementStyles([css1, existingStyles2, styleSheet3]);
            expect(styles.styles).to.contain(css1);
            expect(styles.styles.indexOf(css1)).to.equal(0);
            expect(styles.styles).to.contain(existingStyles2);
            expect(styles.styles.indexOf(existingStyles2)).to.equal(1);
            expect(styles.styles).to.contain(styleSheet3);
        });
    }
});

describe("css", () => {
    describe("with a CSSDirective", () => {
        describe("should interpolate the product of CSSDirective.createCSS() into the resulting ElementStyles CSS", () => {
            it("when the result is a string", () => {
                @cssDirective()
                class Directive implements CSSDirective {
                    createCSS() {
                        return "red";
                    }
                }

                const styles = css`host: {color: ${new Directive()};}`;
                expect(styles.styles.some(x => x === "host: {color: red;}")).to.equal(true)
            });

            it("when the result is an ElementStyles", () => {
                const _styles = css`:host{color: red}`

                @cssDirective()
                class Directive implements CSSDirective {
                    createCSS() {
                        return _styles;
                    }
                }

                const styles = css`${new Directive()}`;
                expect(styles.styles.includes(_styles)).to.equal(true)
            });

            if (ElementStyles.supportsAdoptedStyleSheets) {
                it("when the result is a CSSStyleSheet", () => {
                    const _styles = new CSSStyleSheet();

                    @cssDirective()
                    class Directive implements CSSDirective {
                        createCSS() {
                            return _styles;
                        }
                    }

                    const styles = css`${new Directive()}`;
                    expect(styles.styles.includes(_styles)).to.equal(true)
                });
            }
        });


        it("should add the behavior returned from CSSDirective.getBehavior() to the resulting ElementStyles", () => {
            const behavior = {
                addedCallback(){},
            }

            @cssDirective()
            class Directive implements CSSDirective {
                createCSS(add: AddBehavior): ComposableStyles {
                    add(behavior);
                    return "";
                }
            }

            const styles = css`${new Directive()}`;

            expect(styles.behaviors?.includes(behavior)).to.equal(true)
        });
    })
});

describe("cssPartial", () => {
    it("should have a createCSS method that is the CSS string interpolated with the createCSS product of any CSSDirectives", () => {
        const add = () => void 0;

        @cssDirective()
        class myDirective implements CSSDirective {
            createCSS() { return "red" };
        }

        const partial = css.partial`color: ${new myDirective}`;
        expect (partial.createCSS(add)).to.equal("color: red");
    });

    it("Should add behaviors from interpolated CSS directives", () => {
        const behavior = {
            addedCallback() {},
        }

        const behavior2 = {...behavior};

        @cssDirective()
        class directive implements CSSDirective {
            createCSS(add: AddBehavior) {
                add(behavior);
                return ""
            };
        }

        @cssDirective()
        class directive2 implements CSSDirective {
            createCSS(add: AddBehavior) {
                add(behavior2);
                return ""
            };
        }

        const partial = css.partial`${new directive}${new directive2}`;
        const behaviors: HostBehavior<HTMLElement>[] = [];
        const add = (x: HostBehavior) => behaviors.push(x);

        partial.createCSS(add);

        expect(behaviors[0]).to.equal(behavior);
        expect(behaviors[1]).to.equal(behavior2);
    });

    it("should add any ElementStyles interpolated into the template function when bound to an element", () => {
        const styles = css`:host {color: blue; }`;
        const partial = css.partial`${styles}`;
        const capturedBehaviors: HostBehavior[] = [];
        let addStylesCalled = false;

        const controller = {
            mainStyles: null,
            isConnected: false,
            source: {},
            addStyles(style: ElementStyles) {
                expect(style.styles.includes(styles)).to.be.true;
                addStylesCalled = true;
            },
            removeStyles(styles) {},
            addBehavior() {},
            removeBehavior() {},
        };

        const add = (x: HostBehavior) => capturedBehaviors.push(x);
        partial.createCSS(add);

        expect(capturedBehaviors[0]).to.equal(partial);

        (partial as any as HostBehavior).addedCallback!(controller);

        expect(addStylesCalled).to.be.true;
    })
})
