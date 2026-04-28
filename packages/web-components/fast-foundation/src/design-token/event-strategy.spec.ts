
import { css, customElement, FASTElement, HostController, html, Observable, Updates } from "@microsoft/fast-element";
import chai, { expect } from "chai";
import spies from "chai-spies";
import { uniqueElementName } from "@microsoft/fast-element/testing.js";
import {DesignTokenEventResolutionStrategy} from "./event-strategy.js"

const elementName = uniqueElementName();


@customElement({
    name: `fast-${elementName}`,
    template: html`<slot></slot>`
})
export class MyElement extends FASTElement {}

function createElement(): FASTElement & HTMLElement {
    return document.createElement(`fast-${elementName}`) as any;
}
function addElement(parent = document.body): FASTElement & HTMLElement {
    const el = createElement();
    parent.appendChild(el);
    return el;
}

function removeElement(...els: HTMLElement[]) {
    els.forEach(el => {
        el.parentElement?.removeChild(el);
    })
}

describe("The DesignTokenEventResolutionStrategy's", () => {
    describe("parent method", () => {
        function createController(source: any): HostController {
            return {
                mainStyles: null,
                isConnected: false,
                source,
                addStyles() {},
                removeStyles(styles) {},
                addBehavior() {},
                removeBehavior() {},
            };
        }

        it("should return the nearest parent element that has been bound", () => {
            const parent = addElement()
            const child = addElement(parent);

            DesignTokenEventResolutionStrategy.addedCallback!(
                createController(parent)
            );

            DesignTokenEventResolutionStrategy.addedCallback!(
                createController(child)
            );

            expect(DesignTokenEventResolutionStrategy.parent(child)).to.equal(parent);
        });
        it("should return null if no parent element exists", () => {
            const target = addElement();
            DesignTokenEventResolutionStrategy.addedCallback!(
                createController(target)
            );

            expect(DesignTokenEventResolutionStrategy.parent(target)).to.equal(null);
        });
    });

    describe("contains method", () => {
        it("should return false if the target is not the child of the parent", () => {
            const parent = addElement()
            const child = addElement();

            expect(DesignTokenEventResolutionStrategy.contains(parent, child)).to.equal(false);
        });
        it("should return true if the target is a child of the parent", () => {
            const parent = addElement()
            const child = addElement(parent);

            expect(DesignTokenEventResolutionStrategy.contains(parent, child)).to.equal(true);
        });
        it("should return true if the target is a descendent of the parent", () => {
            const ancestor = addElement();
            const parent = addElement(ancestor);
            const child = addElement(parent);

            expect(DesignTokenEventResolutionStrategy.contains(ancestor, child)).to.equal(true);
        });
    });
});
