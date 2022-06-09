import { Observable, Subscriber } from "@microsoft/fast-element";
import chai, { expect } from "chai";
import spies from "chai-spies";
import { DesignToken, DesignTokenNode } from "./design-token.js";

chai.use(spies);

function makeChangeHandler() {
    const handleChange = chai.spy(() => {})
    const subscriber: Subscriber = { handleChange }
    return { handleChange, subscriber }
}

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

    describe("setting a token value to a static value", () => {
        describe("should notify subscribers", () => {
            it("that the token has changed for the node", () => {
                const token = DesignToken.create<number>("");
                const node = new DesignTokenNode();
                const handleChange = chai.spy(() => {})
                const subscriber: Subscriber = { handleChange }
                Observable.getNotifier(token).subscribe(subscriber);

                node.setTokenValue(token, 12);

                expect(handleChange).to.have.been.called.once;
                expect(handleChange).to.have.been.called.with(token, node);
            });

            it("that the token has changed for the node even if the value assigned is the upstream value", () => {
                const token = DesignToken.create<number>("");
                const node = new DesignTokenNode();
                const parent = new DesignTokenNode();
                parent.appendChild(node);
                const handleChange = chai.spy(() => {});
                const subscriber: Subscriber = { handleChange };
                parent.setTokenValue(token, 12);
                Observable.getNotifier(token).subscribe(subscriber);

                node.setTokenValue(token, 12);

                expect(handleChange).to.have.been.called.once;
                expect(handleChange).to.have.been.called.with(token, node);
            });
        })

        describe("should not notify subscribers", () => {
            it("when the value assigned is the same value", () => {
                const token = DesignToken.create<number>("");
                const node = new DesignTokenNode();
                const handleChange = chai.spy(() => {})
                const subscriber: Subscriber = { handleChange }
                node.setTokenValue(token, 12);
                Observable.getNotifier(token).subscribe(subscriber);

                node.setTokenValue(token, 12);

                expect(handleChange).not.to.have.been.called();
            });
        });
    });

    describe("setting a token to a derived value", () => {
        describe("should notify subscribers", () => {
            it("that the token has changed for the node", () => {
                const token = DesignToken.create<number>("");
                const node = new DesignTokenNode();
                const handleChange = chai.spy(() => {})
                const subscriber: Subscriber = { handleChange }
                Observable.getNotifier(token).subscribe(subscriber);

                node.setTokenValue(token, (resolve) => 12);

                expect(handleChange).to.have.been.called.once;
                expect(handleChange).to.have.been.called.with(token, node);
            });
        });
    })

    describe("getting a token value", () => {
        it("should throw if no token value has been set for the token in a node tree", () => {
            const token = DesignToken.create<number>("token");
            const node = new DesignTokenNode();

            expect(() => node.getTokenValue(token)).to.throw;
        });
        it("should not throw if the node has the token set to a value", () => {
            const token = DesignToken.create<number>("token");
            const node = new DesignTokenNode();
            node.setTokenValue(token, 12);

            expect(() => node.getTokenValue(token)).not.to.throw;
        });
        it("should not throw if the parent node has the token set to a value", () => {
            const token = DesignToken.create<number>("token");
            const node = new DesignTokenNode();
            const parent = new DesignTokenNode();
            parent.appendChild(node)

            parent.setTokenValue(token, 12);

            expect(() => node.getTokenValue(token)).not.to.throw;
        });
        it("should not throw if an ancestor node has the token set to a value", () => {
            const token = DesignToken.create<number>("token");
            const node = new DesignTokenNode();
            const parent = new DesignTokenNode();
            const ancestor = new DesignTokenNode();
            parent.appendChild(node);
            ancestor.appendChild(parent);
            ancestor.setTokenValue(token, 12);

            expect(() => node.getTokenValue(token)).not.to.throw;
        });

        it("should return the value set for a token", () => {
            const token = DesignToken.create<number>("token");
            const node = new DesignTokenNode();
            node.setTokenValue(token, 12);

            expect(node.getTokenValue(token)).to.equal(12)
        });
        it("should return the derived value set for a token", () => {
            const token = DesignToken.create<number>("token");
            const node = new DesignTokenNode();
            node.setTokenValue(token, () => 12);

            expect(node.getTokenValue(token)).to.equal(12)
        });

        it("should return the value set for the parent node if the value is not set for the token", () => {
            const staticToken = DesignToken.create<number>("token");
            const derivedToken = DesignToken.create<number>("token");
            const node = new DesignTokenNode();
            const parent = new DesignTokenNode();
            parent.appendChild(node)

            parent.setTokenValue(staticToken, 12);
            parent.setTokenValue(derivedToken, () => 11);

            expect(node.getTokenValue(staticToken)).to.equal(12);
            expect(node.getTokenValue(derivedToken)).to.equal(11);
        });

        it("should return the value set for the ancestor node if the value is not set for the token on the node or it's parent", () => {
            const staticToken = DesignToken.create<number>("token");
            const derivedToken = DesignToken.create<number>("token");
            const node = new DesignTokenNode();
            const parent = new DesignTokenNode();
            const ancestor = new DesignTokenNode();
            parent.appendChild(node);
            ancestor.appendChild(parent);
            ancestor.setTokenValue(staticToken, 12);
            ancestor.setTokenValue(derivedToken, 11);

            expect(node.getTokenValue(staticToken)).to.equal(12);
            expect(node.getTokenValue(derivedToken)).to.equal(11);
        });
    })

    describe("getAssignedTokensForNode", () => {
        it("should return an empty set if no tokens are set for a node", () => {
            const node = new DesignTokenNode();

            expect(DesignTokenNode.getAssignedTokensForNode(node).length).to.equal(0);
        });
        it("should return an array that contains the tokens set for the node", () => {
            const node = new DesignTokenNode();
            const token = DesignToken.create<number>("token");
            node.setTokenValue(token, 12);
            const assigned = DesignTokenNode.getAssignedTokensForNode(node);

            expect(assigned.includes(token)).to.be.true;
            expect(assigned.length).to.equal(1);
        });
        it("should return an array that does not contain tokens set for ancestor nodes", () => {
            const parent = new DesignTokenNode();
            const node = new DesignTokenNode();
            parent.appendChild(node);
            const token = DesignToken.create<number>("token");
            parent.setTokenValue(token, 12);
            const assigned = DesignTokenNode.getAssignedTokensForNode(node);

            expect(assigned.includes(token)).to.be.false;
            expect(assigned.length).to.equal(0);
        });
    });
    describe("getAssignedTokensForNodeTree", () => {
        it("should return an empty set if no tokens are set for a node or it's ancestors", () => {
            const node = new DesignTokenNode();
            const parent = new DesignTokenNode();
            parent.appendChild(node);

            expect(DesignTokenNode.composeAssignedTokensForNode(node).length).to.equal(0);
        });
        it("should return an array that contains the tokens set for the node", () => {
            const node = new DesignTokenNode();
            const parent = new DesignTokenNode();
            parent.appendChild(node);
            const token = DesignToken.create<number>("token");
            node.setTokenValue(token, 12);
            const assigned = DesignTokenNode.composeAssignedTokensForNode(node);

            expect(assigned.includes(token)).to.be.true;
            expect(assigned.length).to.equal(1);
        });
        it("should return an array that does contains tokens set for ancestor nodes", () => {
            const parent = new DesignTokenNode();
            const node = new DesignTokenNode();
            parent.appendChild(node);
            const token = DesignToken.create<number>("token");
            parent.setTokenValue(token, 12);
            const assigned = DesignTokenNode.composeAssignedTokensForNode(node);

            expect(assigned.includes(token)).to.be.true;
            expect(assigned.length).to.equal(1);
        });
    });


    it("should notify for a derived token at the node when a dependent token is changed for the node", () => {
        const tokenA = DesignToken.create<number>("a");
        const tokenB = DesignToken.create<number>("b");
        const tokenC = DesignToken.create<number>("b");
        const node = new DesignTokenNode();
        const { subscriber, handleChange } = makeChangeHandler();
        node.setTokenValue(tokenA, 12);
        node.setTokenValue(tokenB, (resolve) => resolve(tokenA) * 2);
        node.setTokenValue(tokenC, (resolve) => resolve(tokenB) * 2);
        Observable.getNotifier(tokenB).subscribe(subscriber)
        Observable.getNotifier(tokenC).subscribe(subscriber)
        node.setTokenValue(tokenA, 13);

        expect(handleChange).to.have.been.called.twice;
        expect(handleChange).to.have.been.first.called.with(node, tokenB);
        expect(handleChange).to.have.been.second.called.with(node, tokenC);
        expect(node.getTokenValue(tokenB)).to.equal(26);
        expect(node.getTokenValue(tokenC)).to.equal(52      );
    });

    it("should notify for a derived token at a child when a dependent token is changed on the ancestor", () => {
        const tokenA = DesignToken.create<number>("a");
        const tokenB = DesignToken.create<number>("b");
        const ancestor = new DesignTokenNode();
        const parent = new DesignTokenNode();
        const child = new DesignTokenNode();
        ancestor.appendChild(parent);
        parent.appendChild(child);
        const { subscriber, handleChange } = makeChangeHandler();
        ancestor.setTokenValue(tokenB, 12);
        ancestor.setTokenValue(tokenA, (resolve) => resolve(tokenB) * 2);

        Observable.getNotifier(tokenA).subscribe(subscriber)
        child.setTokenValue(tokenB, 13);

        expect(handleChange).to.have.been.called.once;
        expect(handleChange).to.have.been.called.with(child);
        expect(child.getTokenValue(tokenA)).to.equal(26);
    });
    it("should notify for the node and a descendent node which has dependent tokens configured", () => {
        const tokenA = DesignToken.create<number>("a");
        const tokenB = DesignToken.create<number>("b");
        const ancestor = new DesignTokenNode();
        const parent = new DesignTokenNode();
        const child = new DesignTokenNode();
        ancestor.appendChild(parent);
        parent.appendChild(child);
        const { subscriber, handleChange } = makeChangeHandler();
        ancestor.setTokenValue(tokenB, 12);
        child.setTokenValue(tokenB, 14);
        Observable.getNotifier(tokenA).subscribe(subscriber)
        ancestor.setTokenValue(tokenA, (resolve) => resolve(tokenB) * 2);

        expect(handleChange).to.have.been.called.twice;
        expect(handleChange).to.have.been.first.called.with(ancestor);
        expect(handleChange).to.have.been.second.called.with(child);

    })
    it("should not notify for a derived token at a child when the token is set for an intermediary and the value does not have dependent tokens", () => {
        const tokenA = DesignToken.create<number>("a");
        const tokenB = DesignToken.create<number>("b");
        const ancestor = new DesignTokenNode();
        const parent = new DesignTokenNode();
        const child = new DesignTokenNode();
        ancestor.appendChild(parent);
        parent.appendChild(child);
        const { subscriber, handleChange } = makeChangeHandler();
        ancestor.setTokenValue(tokenB, 12);
        ancestor.setTokenValue(tokenA, (resolve) => resolve(tokenB) * 2);
        parent.setTokenValue(tokenA, 25);

        Observable.getNotifier(tokenA).subscribe(subscriber)
        child.setTokenValue(tokenB, 13);

        expect(handleChange).not.to.have.been.called;
        expect(child.getTokenValue(tokenA)).to.equal(25);
    });

});
