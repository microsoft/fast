
import { expect } from "chai";
import { DesignSystem } from "../design-system";
import { FoundationElement } from "../foundation-element";
import { DesignToken } from "./design-token";

new DesignSystem().register(
    FoundationElement.configuration({type: class extends FoundationElement {}, baseName: "custom-element"})()
).applyTo(document.body)

function addElement(parent = document.body): FoundationElement {
    const el = document.createElement("fast-custom-element") as FoundationElement;
    parent.appendChild(el);
    return el;
}

function removeElement(...els: HTMLElement[]) {
    els.forEach(el => {
        el.parentElement?.removeChild(el);
    })
}

describe("A DesignToken", () => {
    describe("with the writeCssProperty configuration", () => {
        it("should have a createCSS() method that returns a string with the name property formatted as a CSS variable", () => {
            expect(DesignToken.create("implicit").createCSS()).to.equal("var(--implicit)");
            expect(DesignToken.create("explicit", true).createCSS()).to.equal("var(--explicit)");
        });
        it("should have a readonly cssCustomProperty property that is the name formatted as a CSS custom property", () => {
            expect(DesignToken.create("implicit").cssCustomProperty).to.equal("--implicit");
            expect(DesignToken.create("explicit", true).cssCustomProperty).to.equal("--explicit");
        });
    });

    describe("without the writeCssProperty configuration", () => {
        it("should have a createCSS() method that returns an empty string", () => {
            expect(DesignToken.create("explicit", false).createCSS()).to.equal("");
        });
        it("should have a readonly cssCustomProperty property that is an empty string", () => {
            expect(DesignToken.create("explicit", false).cssCustomProperty).to.equal("");
        });
    });

    describe("getting a simple value", () => {
        it("should throw if the token value has never been set on the element or it's any ancestors", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");

            expect(() => token.getValueFor(target)).to.throw();
            removeElement(target);
        });

        it("should return the value set for the element if one has been set", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");
            token.setValueFor(target, 12);

            expect(token.getValueFor(target)).to.equal(12);
            removeElement(target);
        });

        it("should return the value set for an ancestor if a value has not been set for the target", () => {
            const ancestor = addElement();
            const target = addElement(ancestor);
            const token = DesignToken.create<number>("test");
            token.setValueFor(ancestor, 12);

            expect(token.getValueFor(target)).to.equal(12);
            removeElement(ancestor);
        });
    });

    describe("setting a simple value", () => {
        it("should emit the value to a CSS custom property for the element when configured", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test", true);
            token.setValueFor(target, 12);

            expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal((12).toString())

            removeElement(target);
        });
    })
});
