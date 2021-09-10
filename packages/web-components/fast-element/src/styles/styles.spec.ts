import { expect } from "chai";
import {
    AdoptedStyleSheetsStyles,
    StyleElementStyles,
    StyleTarget,
    ElementStyles,
} from "./element-styles";
import { DOM } from "../dom";
import { CSSDirective } from "./css-directive";
import { css, cssPartial } from "./css";
import type { Behavior } from "../observation/behavior";
import { defaultExecutionContext } from "../observation/observable";

if (DOM.supportsAdoptedStyleSheets) {
    describe("AdoptedStyleSheetsStyles", () => {
        context("when removing styles", () => {
            it("should remove an associated stylesheet", () => {
                const cache = new Map();
                const sheet = new AdoptedStyleSheetsStyles([``], cache);
                const target: Pick<StyleTarget, "adoptedStyleSheets"> = {
                    adoptedStyleSheets: [],
                };

                sheet.addStylesTo(target as StyleTarget);
                expect(target.adoptedStyleSheets!.length).to.equal(1);

                sheet.removeStylesFrom(target as StyleTarget);
                expect(target.adoptedStyleSheets!.length).to.equal(0);
            });

            it("should not remove unassociated styles", () => {
                const cache = new Map();
                const sheet = new AdoptedStyleSheetsStyles(["test"], cache);
                const style = new CSSStyleSheet();
                const target: Pick<StyleTarget, "adoptedStyleSheets"> = {
                    adoptedStyleSheets: [style],
                };
                sheet.addStylesTo(target as StyleTarget);

                expect(target.adoptedStyleSheets!.length).to.equal(2);
                expect(target.adoptedStyleSheets).to.contain(cache.get("test"));

                sheet.removeStylesFrom(target as StyleTarget);

                expect(target.adoptedStyleSheets!.length).to.equal(1);
                expect(target.adoptedStyleSheets).not.to.contain(cache.get("test"));
            });

            it("should track when added and removed from a target", () => {
                const cache = new Map();
                const styles = ``;
                const elementStyles = new AdoptedStyleSheetsStyles([styles], cache);
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
                const cache = new Map();
                const red = new AdoptedStyleSheetsStyles(['r'], cache);
                const green = new AdoptedStyleSheetsStyles(['g'], cache);
                const target: Pick<StyleTarget, "adoptedStyleSheets"> = {
                    adoptedStyleSheets: [],
                };

                red.addStylesTo(target as StyleTarget);
                green.addStylesTo(target as StyleTarget);

                expect((target.adoptedStyleSheets![0])).to.equal(cache.get('r'));
                expect((target.adoptedStyleSheets![1])).to.equal(cache.get('g'));
            });
            it("should order HTMLStyleElements in array order of provided sheets", () => {
                const cache = new Map();
                const red = new AdoptedStyleSheetsStyles(['r', 'g'], cache);
                const target: Pick<StyleTarget, "adoptedStyleSheets"> = {
                    adoptedStyleSheets: [],
                };

                red.addStylesTo(target as StyleTarget);

                expect((target.adoptedStyleSheets![0])).to.equal(cache.get('r'));
                expect((target.adoptedStyleSheets![1])).to.equal(cache.get('g'));
            });
        });
    });
}

describe("StyleSheetStyles", () => {
    it("can add and remove from the document directly", () => {
        const styles = ``;
        const elementStyles = new StyleElementStyles([styles]);
        document.body.innerHTML = "";

        elementStyles.addStylesTo(document);

        expect(document.body.childNodes[0]).to.be.instanceof(HTMLStyleElement);

        elementStyles.removeStylesFrom(document);

        expect(document.body.childNodes.length).to.equal(0);
    });

    it("can add and remove from a ShadowRoot", () => {
        const styles = ``;
        const elementStyles = new StyleElementStyles([styles]);
        document.body.innerHTML = "";

        const element = document.createElement("div");
        const shadowRoot = element.attachShadow({ mode: "open" });

        elementStyles.addStylesTo(shadowRoot);

        expect(shadowRoot.childNodes[0]).to.be.instanceof(HTMLStyleElement);

        elementStyles.removeStylesFrom(shadowRoot);

        expect(shadowRoot.childNodes.length).to.equal(0);
    });
    it("should track when added and removed from a target", () => {
        const styles = ``;
        const elementStyles = new StyleElementStyles([styles]);
        document.body.innerHTML = "";

        expect(elementStyles.isAttachedTo(document)).to.equal(false)

        elementStyles.addStylesTo(document);
        expect(elementStyles.isAttachedTo(document)).to.equal(true)

        elementStyles.removeStylesFrom(document);
        expect(elementStyles.isAttachedTo(document)).to.equal(false)
    });

    it("should order HTMLStyleElement order by addStyleTo() call order", () => {
        const red = new StyleElementStyles([`body:{color:red;}`]);
        const green = new StyleElementStyles([`body:{color:green;}`]);
        document.body.innerHTML = "";

        const element = document.createElement("div");
        const shadowRoot = element.attachShadow({mode: "open"});
        red.addStylesTo(shadowRoot);
        green.addStylesTo(shadowRoot);

        expect((shadowRoot.childNodes[0] as HTMLStyleElement).innerHTML).to.equal("body:{color:red;}");
        expect((shadowRoot.childNodes[1] as HTMLStyleElement).innerHTML).to.equal("body:{color:green;}");
    });
    it("should order the HTMLStyleElements in array order of provided sheets", () => {
        const red = new StyleElementStyles([`body:{color:red;}`, `body:{color:green;}`]);
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
        const styles = ElementStyles.create([css]);
        expect(styles.styles).to.contain(css);
    });

    it("can create from multiple strings", () => {
        const css1 = ".class { color: red; }";
        const css2 = ".class2 { color: red; }";
        const styles = ElementStyles.create([css1, css2]);
        expect(styles.styles).to.contain(css1);
        expect(styles.styles.indexOf(css1)).to.equal(0);
        expect(styles.styles).to.contain(css2);
    });

    it("can create from an ElementStyles", () => {
        const css = ".class { color: red; }";
        const existingStyles = ElementStyles.create([css]);
        const styles = ElementStyles.create([existingStyles]);
        expect(styles.styles).to.contain(existingStyles);
    });

    it("can create from multiple ElementStyles", () => {
        const css1 = ".class { color: red; }";
        const css2 = ".class2 { color: red; }";
        const existingStyles1 = ElementStyles.create([css1]);
        const existingStyles2 = ElementStyles.create([css2]);
        const styles = ElementStyles.create([existingStyles1, existingStyles2]);
        expect(styles.styles).to.contain(existingStyles1);
        expect(styles.styles.indexOf(existingStyles1)).to.equal(0);
        expect(styles.styles).to.contain(existingStyles2);
    });

    it("can create from mixed strings and ElementStyles", () => {
        const css1 = ".class { color: red; }";
        const css2 = ".class2 { color: red; }";
        const existingStyles2 = ElementStyles.create([css2]);
        const styles = ElementStyles.create([css1, existingStyles2]);
        expect(styles.styles).to.contain(css1);
        expect(styles.styles.indexOf(css1)).to.equal(0);
        expect(styles.styles).to.contain(existingStyles2);
    });

    if (DOM.supportsAdoptedStyleSheets) {
        it("can create from a CSSStyleSheet", () => {
            const styleSheet = new CSSStyleSheet();
            const styles = ElementStyles.create([styleSheet]);
            expect(styles.styles).to.contain(styleSheet);
        });

        it("can create from multiple CSSStyleSheets", () => {
            const styleSheet1 = new CSSStyleSheet();
            const styleSheet2 = new CSSStyleSheet();
            const styles = ElementStyles.create([styleSheet1, styleSheet2]);
            expect(styles.styles).to.contain(styleSheet1);
            expect(styles.styles.indexOf(styleSheet1)).to.equal(0);
            expect(styles.styles).to.contain(styleSheet2);
        });

        it("can create from mixed strings, ElementStyles, and CSSStyleSheets", () => {
            const css1 = ".class { color: red; }";
            const css2 = ".class2 { color: red; }";
            const existingStyles2 = ElementStyles.create([css2]);
            const styleSheet3 = new CSSStyleSheet();
            const styles = ElementStyles.create([css1, existingStyles2, styleSheet3]);
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
                class Directive extends CSSDirective {
                    createCSS() {
                        return "red";
                    }
                }

                const styles = css`host: {color: ${new Directive()};}`;
                expect(styles.styles.some(x => x === "host: {color: red;}")).to.equal(true)
            });

            it("when the result is an ElementStyles", () => {
                const _styles = css`:host{color: red}`
                class Directive extends CSSDirective {
                    createCSS() {
                        return _styles;
                    }
                }

                const styles = css`${new Directive()}`;
                expect(styles.styles.includes(_styles)).to.equal(true)
            });

            if (DOM.supportsAdoptedStyleSheets) {
                it("when the result is a CSSStyleSheet", () => {
                    const _styles = new CSSStyleSheet();
                    class Directive extends CSSDirective {
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
                bind(){},
                unbind(){}
            }

            class Directive extends CSSDirective {
                createBehavior() {
                    return behavior;
                }
            }

            const styles = css`${new Directive()}`;

            expect(styles.behaviors?.includes(behavior)).to.equal(true)
        });
    })
});

describe("cssPartial", () => {
    it("should have a createCSS method that is the CSS string interpolated with the createCSS product of any CSSDirectives", () => {
        class myDirective extends CSSDirective {
            createCSS() { return "red" };
            createBehavior() { return undefined; }
        }

        const partial = cssPartial`color: ${new myDirective}`;
        expect (partial.createCSS()).to.equal("color: red");
    });

    it("Should add behaviors from interpolated CSS directives when bound to an element", () => {
        const behavior = {
            bind() {},
            unbind() {},
        }

        const behavior2 = {...behavior};

        class directive extends CSSDirective {
            createCSS() { return "" };
            createBehavior() { return behavior; }
        }
        class directive2 extends CSSDirective {
            createCSS() { return "" };
            createBehavior() { return behavior2; }
        }

        const partial = cssPartial`${new directive}${new directive2}`;
        const el = {
            $fastController: {
                addBehaviors(behaviors: Behavior[]) {
                    expect(behaviors[0]).to.equal(behavior);
                    expect(behaviors[1]).to.equal(behavior2);
                }
            }
        }

        partial.createBehavior()?.bind(el, defaultExecutionContext)
    });

    it("should add any ElementStyles interpolated into the template function when bound to an element", () => {
        const styles = css`:host {color: blue; }`;
        const partial = cssPartial`${styles}`;
        let called = false;
        const el = {
            $fastController: {
                addStyles(style: ElementStyles) {
                    expect(style.styles.includes(styles)).to.be.true;
                    called = true;
                }
            }
        }

        partial.createBehavior()?.bind(el, defaultExecutionContext)

        expect(called).to.be.true;
    })
})
