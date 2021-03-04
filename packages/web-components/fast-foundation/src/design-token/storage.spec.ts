import { assert, expect } from "chai";
import { DI } from "../di/di";
import { DesignTokenStorage, DesignTokenStorageImpl } from "./storage";
import { customElement, DOM} from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import { DesignSystem } from "../design-system";

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

describe("A DesignTokenStorage", () => {
    describe("after construction", () => {
        it("should have a null upstream", () => {
            expect(new DesignTokenStorageImpl(addElement()).parentNode).to.equal(null);
        });

        it("should register itself as a DI registration on the element's container", () => {
            const target = addElement();
            const storage = new DesignTokenStorageImpl(target);
            const container = DI.getOrCreateDOMContainer(target);
            const resolved = container.get(DesignTokenStorage);

            expect(resolved).to.be.equal(storage) && removeElement(target);
            
        });

        it("should have it's upstream set to a DesignTokenStorageImpl connected to it's nearest connected ancestor", () => {
            const a = addElement();
            const b = addElement(a);
            const c = addElement(b);

            const sA = new DesignTokenStorageImpl(a);
            const sB = new DesignTokenStorageImpl(b);
            const sC = new DesignTokenStorageImpl(c);

            expect(sA.parentNode).to.equal(null);
            expect(sB.parentNode).to.equal(sA);
            expect(sC.parentNode).to.equal(sB);

            removeElement(a, b, c);
        });

        it("should update it's upstream when after connected element is re-parented", () => {
            const oldParent = addElement();
            const newParent = addElement();

            const sOldParent = new DesignTokenStorageImpl(oldParent);
            const sNewParent = new DesignTokenStorageImpl(newParent);
            const target = addElement(oldParent);

            const storage = new DesignTokenStorageImpl(target);

            expect(storage.parentNode).to.equal(sOldParent);
            newParent.appendChild(target);

            expect(storage.parentNode).to.equal(sNewParent);
        });

        it("should throw if separate instances are connected to the same element", () => {
            const target = addElement();
            const a = new DesignTokenStorageImpl(target);

            expect(() => new DesignTokenStorageImpl(target)).to.throw();

            removeElement(target);
        });
    });

    describe("has a `for()` method that", () => {
        it("should return a new DesignTokenStorage when invoked with an element that hasn't been associated to another DesignTokenStorage" , () => {
            const target = addElement();
            expect(DesignTokenStorageImpl.for(target) instanceof DesignTokenStorageImpl).to.equal(true);

            removeElement(target);
        });

        it("should always return a single instance when invoked with the same element multiple times", () => {
            const target = addElement();

            const a = DesignTokenStorageImpl.for(target);
            const b = DesignTokenStorageImpl.for(target);

            expect(a).to.equal(b);
        })
    });
});
