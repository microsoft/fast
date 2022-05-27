import { expect } from "chai";
import { DesignTokenNode } from "./design-token.js";


describe.only("DesignTokenNode", () => {
    describe("appending a child", () => {
        it("should assign the `parent` property of the child to the caller", () => {
            const parent = new DesignTokenNode();
            const child = new DesignTokenNode();

            expect(child.parent).to.be.null;
            parent.appendChild(child);
            expect(child.parent).to.equal(parent);
        });

        it("should add the child to the `children` property of the caller", () => {
            const parent = new DesignTokenNode();
            const child = new DesignTokenNode();

            expect(parent.children.includes(child)).to.be.false;
            parent.appendChild(child);
            expect(parent.children.includes(child)).to.be.true;
        });

        it("should re-parent the child if the child is already a child of another node", () => {
            const parent = new DesignTokenNode();
            const child = new DesignTokenNode();
            const newParent = new DesignTokenNode();

            parent.appendChild(child);
            newParent.appendChild(child);

            expect(child.parent).to.equal(newParent);
            expect(parent.children.includes(child)).to.be.false;
            expect(newParent.children.includes(child)).to.be.true;
        });
    });
    describe("removing a child", () => {
        it("should assign the `parent` property of the child to null if the child is a child of the parent", () => {
            const parent = new DesignTokenNode();
            const child = new DesignTokenNode();

            parent.appendChild(child);
            expect(child.parent).to.equal(parent);
            parent.removeChild(child);
            expect(child.parent).to.be.null;
        });

        it("should remove the child from the `children` set if the item is a child of the parent", () => {
            const parent = new DesignTokenNode();
            const child = new DesignTokenNode();

            parent.appendChild(child);
            expect(parent.children.includes(child)).to.be.true;
            parent.removeChild(child);
            expect(child.parent).to.be.null;
        });
        it("should no-op when called with an item that is not a child of the parent", () => {
            const parent = new DesignTokenNode();
            const child = new DesignTokenNode();
            const tangent = new DesignTokenNode();

            parent.appendChild(child);
            expect(parent.children.includes(child)).to.be.true;
            expect(child.parent).to.equal(parent);

            tangent.removeChild(child);
            expect(parent.children.includes(child)).to.be.true;
            expect(child.parent).to.equal(parent);
        });
    })
})
