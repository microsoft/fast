import { expect } from "chai";
import { AdoptedStyleSheetsStyles, StyleElementStyles, StyleTarget } from "./styles";
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
});
