
import { css, customElement, FASTElement, html, Observable, Updates } from "@microsoft/fast-element";
import chai, { expect } from "chai";
import spies from "chai-spies";
import { uniqueElementName } from "@microsoft/fast-element/testing";
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
        it("should return the nearest parent element that has been bound", () => {
            const parent = addElement()
            const child = addElement(parent);

            DesignTokenEventResolutionStrategy.bind(parent);
            DesignTokenEventResolutionStrategy.bind(child);

            expect(DesignTokenEventResolutionStrategy.parent(child)).to.equal(parent);
        });
        it("should return null if no parent element exists", () => {
            const target = addElement();
            DesignTokenEventResolutionStrategy.bind(target);

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
