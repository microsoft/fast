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
            expect(new DesignTokenStorageImpl().upstream).to.equal(null);
        });
    });

    describe("after connection", () => {
        it("should have a null upstream after connecting to an element when no DesignTokenStorageImpl has connected to an ancestor of the element", () => {
            const target = addElement();
            const storage = new DesignTokenStorageImpl().connect(target);

            expect(storage.upstream).to.equal(null) && removeElement(target);
        });

        it("should register itself as a DI registration on the element's container", () => {
            const target = addElement();
            const storage = new DesignTokenStorageImpl().connect(target);
            const container = DI.getOrCreateDOMContainer(target);
            const resolved = container.get(DesignTokenStorage);

            expect(resolved).to.be.equal(storage) && removeElement(target);
            
        });

        it("should have it's upstream set to a DesignTokenStorageImpl connected to it's nearest connected ancestor", () => {
            const a = addElement();
            const b = addElement(a);
            const c = addElement(b);

            const sA = new DesignTokenStorageImpl().connect(a);
            const sB = new DesignTokenStorageImpl().connect(b);
            const sC = new DesignTokenStorageImpl().connect(c);

            expect(sA.upstream).to.equal(null);
            expect(sB.upstream).to.equal(sA);
            expect(sC.upstream).to.equal(sB);

            removeElement(a, b, c);
        });

        describe("to a FASTElement", () => {
            it("should update it's upstream when after connected element is re-parented", () => {
                const oldParent = addElement();
                const newParent = addElement();

                const sOldParent = new DesignTokenStorageImpl().connect(oldParent);
                const sNewParent = new DesignTokenStorageImpl().connect(newParent);
                const target = addElement(oldParent);

                const storage = new DesignTokenStorageImpl().connect(target);

                expect(storage.upstream).to.equal(sOldParent);
                newParent.appendChild(target);

                expect(storage.upstream).to.equal(sNewParent);
            });
        })
    });

    describe("during connection", () => {
        it("should throw if separate instances are connected to the same element", () => {
            const target = addElement();
            const a = new DesignTokenStorageImpl();
            const b = new DesignTokenStorageImpl();

            a.connect(target);

            expect(() => b.connect(target)).to.throw();

            removeElement(target);
        });
    })
});
