import { expect } from "chai";
import { AdoptedStyleSheetsStyles, StyleTarget } from "../styles";

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
