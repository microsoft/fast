import { Observable, Subscriber } from "@microsoft/fast-element";
import chai, { expect } from "chai";
import spies from "chai-spies";
import { DesignToken, DesignTokenNode } from "./design-token.js";

chai.use(spies);


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
    });

    describe("setting a value", () => {
        describe("should notify subscribers", () => {
            it("that the taken has changed for the node", () => {
                const token = DesignToken.create<number>("");
                const node = new DesignTokenNode();
                const handleChange = chai.spy(() => {})
                const subscriber: Subscriber = { handleChange }
                Observable.getNotifier(node).subscribe(subscriber);

                node.setTokenValue(token, 12);

                expect(handleChange).to.have.been.called.once;
                expect(handleChange).to.have.been.called.with(node, [token]);
            });

            it("of child nodes if the child node does not have the token set", () => {
                const token = DesignToken.create<number>("");
                const node = new DesignTokenNode();
                const child = new DesignTokenNode();
                node.appendChild(child);
                const handleChange = chai.spy(() => {})
                const subscriber: Subscriber = { handleChange }
                Observable.getNotifier(child).subscribe(subscriber);

                node.setTokenValue(token, 12);

                expect(handleChange).to.have.been.called.once;
                expect(handleChange).to.have.been.called.with(node, [token]);
            });
            it("of descendent nodes if the descendent node does not have the token set", () => {
                const token = DesignToken.create<number>("");
                const node = new DesignTokenNode();
                const child = new DesignTokenNode();
                const descendent = new DesignTokenNode();
                node.appendChild(child);
                child.appendChild(descendent);
                const handleChange = chai.spy(() => {})
                const subscriber: Subscriber = { handleChange }
                Observable.getNotifier(descendent).subscribe(subscriber);

                node.setTokenValue(token, 12);

                expect(handleChange).to.have.been.called.once;
                expect(handleChange).to.have.been.called.with(node, [token]);
            });
        })
    });

    describe("should not notify subscribers", () => {

        it("of child nodes if the child node does have the token set", () => {
            const token = DesignToken.create<number>("");
            const node = new DesignTokenNode();
            const child = new DesignTokenNode();
            node.appendChild(child);
            child.setTokenValue(token, 11)
            const handleChange = chai.spy(() => {})
            const subscriber: Subscriber = { handleChange }
            Observable.getNotifier(child).subscribe(subscriber);

            node.setTokenValue(token, 12);

            expect(handleChange).not.to.have.been.called;
        });
        it("of descendent nodes if the child node does have the token set", () => {
            const token = DesignToken.create<number>("");
            const node = new DesignTokenNode();
            const child = new DesignTokenNode();
            const descendent = new DesignTokenNode();
            node.appendChild(child);
            child.appendChild(descendent);
            child.setTokenValue(token, 11)
            const handleChange = chai.spy(() => {})
            const subscriber: Subscriber = { handleChange }
            Observable.getNotifier(descendent).subscribe(subscriber);

            node.setTokenValue(token, 12);

            expect(handleChange).not.to.have.been.called;
        });
        it("of descendent nodes if the descendent node does have the token set", () => {
            const token = DesignToken.create<number>("");
            const node = new DesignTokenNode();
            const child = new DesignTokenNode();
            const descendent = new DesignTokenNode();
            node.appendChild(child);
            child.appendChild(descendent);
            descendent.setTokenValue(token, 11)
            const handleChange = chai.spy(() => {})
            const subscriber: Subscriber = { handleChange }
            Observable.getNotifier(descendent).subscribe(subscriber);

            node.setTokenValue(token, 12);

            expect(handleChange).not.to.have.been.called;
        });
    });
});
