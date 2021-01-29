import { expect } from "chai";
import {
    AdoptedStyleSheetsStyles,
    StyleElementStyles,
    StyleTarget,
    ElementStyles,
} from "./styles";
import { DOM } from "./dom";

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
        console.log(document)
        expect(elementStyles.isAttachedTo(document)).to.equal(true)

        elementStyles.removeStylesFrom(document);
        expect(elementStyles.isAttachedTo(document)).to.equal(false)
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
