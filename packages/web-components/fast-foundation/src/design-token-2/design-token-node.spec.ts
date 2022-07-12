import { Observable, Subscriber } from "@microsoft/fast-element";
import { makeObservable } from "@microsoft/fast-element/utilities";
import chai, { expect } from "chai";
import spies from "chai-spies";
import { DesignTokenChangeRecordImpl as DesignTokenChangeRecord, DesignTokenMutationType, DesignTokenNode } from "./design-token-node.js";
import { DesignToken } from "./design-token.js";

chai.use(spies);

function createChangeHandler() {
    const handleChange = chai.spy(() => {})
    const subscriber: Subscriber = { handleChange }
    return { handleChange, subscriber }
}

function createNode(parent?: DesignTokenNode) {
    const node = new DesignTokenNode();

    if (parent) {
        parent.appendChild(node);
    }

    return node;
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
    describe("setting a token to a derived value", () => {
        it("should resolve a value for for the token being assigned from the parent node", () => {
            const token = new DesignToken<number>();
            const parent = createNode();
            const child = createNode(parent);

            parent.setTokenValue(token, 12);
            child.setTokenValue(token, (resolve) => {
                return resolve(token) * 2;
            });

            expect(child.getTokenValue(token)).to.equal(24);
        });
        it("should error if attempting to resolve the token being assigned and there is no parent node", () => {
            const token = new DesignToken<number>();
            const target = new DesignTokenNode();

            expect(() => {
                target.setTokenValue(token, (resolve) => {
                    return resolve(token) * 2;
                });
            }).to.throw()
        });
        it("should error if attempting to resolve the token being assigned and the token is not assigned for any ancestor", () => {
            const token = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);

            expect(() => {
                descendent.setTokenValue(token, (resolve) => {
                    return resolve(token) * 2;
                });
            }).to.throw()
        });
    })

    describe("getting a token value", () => {
        it("should throw if no token value has been set for the token in a node tree", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();

            expect(() => node.getTokenValue(token)).to.throw;
        });
        it("should return the assigned value when a node is assigned a static value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            node.setTokenValue(token, 12);

            expect(node.getTokenValue(token)).to.equal(12);
        });
        it("should return the resolved value when a node is assigned a derived value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            node.setTokenValue(token, () => 12);

            expect(node.getTokenValue(token)).to.equal(12);
        });
        it("should resolve a static value from an ancestor node assigned a static value when the descendent node does not have the token assigned a value", () => {
            const token = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);

            ancestor.setTokenValue(token, 12);

            expect(descendent.getTokenValue(token)).to.equal(12);
        });
        it("should resolve a static value from an ancestor node assigned a derived value when the descendent node does not have the token assigned a value", () => {
            const token = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);

            ancestor.setTokenValue(token, () => 12);

            expect(descendent.getTokenValue(token)).to.equal(12);
        });
    })

    describe("getAssignedTokensForNode", () => {
        it("should return an empty set if no tokens are set for a node", () => {
            const node = new DesignTokenNode();

            expect(DesignTokenNode.getAssignedTokensForNode(node).length).to.equal(0);
        });
        it("should return an array that contains the tokens set for the node", () => {
            const node = new DesignTokenNode();
            const token = new DesignToken<number>();
            node.setTokenValue(token, 12);
            const assigned = DesignTokenNode.getAssignedTokensForNode(node);

            expect(assigned.includes(token)).to.be.true;
            expect(assigned.length).to.equal(1);
        });
        it("should return an array that does not contain tokens set for ancestor nodes", () => {
            const parent = new DesignTokenNode();
            const node = new DesignTokenNode();
            parent.appendChild(node);
            const token = new DesignToken<number>();
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
            const token = new DesignToken<number>();
            node.setTokenValue(token, 12);
            const assigned = DesignTokenNode.composeAssignedTokensForNode(node);

            expect(assigned.includes(token)).to.be.true;
            expect(assigned.length).to.equal(1);
        });
        it("should return an array that does contains tokens set for ancestor nodes", () => {
            const parent = new DesignTokenNode();
            const node = new DesignTokenNode();
            parent.appendChild(node);
            const token = new DesignToken<number>();
            parent.setTokenValue(token, 12);
            const assigned = DesignTokenNode.composeAssignedTokensForNode(node);

            expect(assigned.includes(token)).to.be.true;
            expect(assigned.length).to.equal(1);
        });
    });

    describe("should notify", () => {
        it("the token with the node that has the token assigned a static value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            Observable.getNotifier(token).subscribe(subscriber);
            node.setTokenValue(token, 12);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token))
            expect(node.getTokenValue(token)).to.equal(12);
        });
        it("the token for the node assigned a static value when the value assigned is the same as the inherited static value", () => {
            const token = new DesignToken<number>();
            const parent = createNode();
            const child = createNode(parent);
            const { handleChange, subscriber } = createChangeHandler()

            parent.setTokenValue(token, 12);
            Observable.getNotifier(token).subscribe(subscriber);

            child.setTokenValue(token, 12);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.called.with(token, new DesignTokenChangeRecord(child, DesignTokenMutationType.add, token));
        });
        it("the token with the node that has the token assigned a derived value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            Observable.getNotifier(token).subscribe(subscriber);
            node.setTokenValue(token, () => 12);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token))
            expect(node.getTokenValue(token)).to.equal(12);
        });
        it("the token with the node that has the token reassigned a static value from a derived value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            Observable.getNotifier(token).subscribe(subscriber);
            node.setTokenValue(token, () => 12);
            node.setTokenValue(token, 14);

            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.change, token));
            expect(node.getTokenValue(token)).to.equal(14);
        });
        it("the token with the node that has the token reassigned a derived value from a static value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            Observable.getNotifier(token).subscribe(subscriber);
            node.setTokenValue(token, 12);
            node.setTokenValue(token, () => 14);

            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.change, token));
            expect(node.getTokenValue(token)).to.equal(14);
        });
        it("the token with the node that has the token assigned a static value which is then deleted", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            Observable.getNotifier(token).subscribe(subscriber);
            node.setTokenValue(token, 12);
            node.deleteTokenValue(token);

            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.delete, token));
            expect(() => node.getTokenValue(token)).to.throw();
        });
        it("the token with the node that has the token assigned a derived value which is then deleted", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            Observable.getNotifier(token).subscribe(subscriber);
            node.setTokenValue(token, () => 12);
            node.deleteTokenValue(token);

            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.delete, token));
            expect(() => node.getTokenValue(token)).to.throw();
        });
        it("the token with the node that has a token assigned a derived value and a dependency of the derived value changes for the node", () => {
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            node.setTokenValue(dependency, 6);
            node.setTokenValue(token, (resolve) => resolve(dependency) * 2);

            Observable.getNotifier(token).subscribe(subscriber);

            expect(node.getTokenValue(token)).to.equal(12);

            node.setTokenValue(dependency, 7);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.change, token));
            expect(node.getTokenValue(token)).to.equal(14);
        });
        it("the token with the descendent node that has a token assigned a static value that is a dependency of a value assigned for an ancestor", () => {
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);
            const { subscriber, handleChange } = createChangeHandler();

            ancestor.setTokenValue(dependency, 6);
            ancestor.setTokenValue(token, (resolve) => resolve(dependency) * 2);

            Observable.getNotifier(token).subscribe(subscriber);

            expect(descendent.getTokenValue(token)).to.equal(12);

            descendent.setTokenValue(dependency, 7);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token));
            expect(ancestor.getTokenValue(token)).to.equal(12);
            expect(parent.getTokenValue(token)).to.equal(12);
            expect(descendent.getTokenValue(token)).to.equal(14);
        });
        it("the token with the descendent node that has a token assigned a derived value that is a dependency of a value assigned for an ancestor", () => {
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);
            const { subscriber, handleChange } = createChangeHandler();

            ancestor.setTokenValue(dependency, 6);
            ancestor.setTokenValue(token, (resolve) => resolve(dependency) * 2);

            Observable.getNotifier(token).subscribe(subscriber);

            expect(descendent.getTokenValue(token)).to.equal(12);

            descendent.setTokenValue(dependency, () => 7);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token));
            expect(ancestor.getTokenValue(token)).to.equal(12);
            expect(parent.getTokenValue(token)).to.equal(12);
            expect(descendent.getTokenValue(token)).to.equal(14);
        });
        it("the token with the descendent node that has a token reassigned a static value that is a dependency of a value assigned for an ancestor", () => {
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);
            const { subscriber, handleChange } = createChangeHandler();

            ancestor.setTokenValue(dependency, 6);
            ancestor.setTokenValue(token, (resolve) => resolve(dependency) * 2);

            expect(descendent.getTokenValue(token)).to.equal(12);

            descendent.setTokenValue(dependency, 7);
            Observable.getNotifier(token).subscribe(subscriber);

            descendent.setTokenValue(dependency, 8)

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token));
            expect(ancestor.getTokenValue(token)).to.equal(12);
            expect(parent.getTokenValue(token)).to.equal(12);
            expect(descendent.getTokenValue(token)).to.equal(16);
        });
        it("the token with the descendent node that has a token reassigned a derived value that is a dependency of a value assigned for an ancestor", () => {
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);
            const { subscriber, handleChange } = createChangeHandler();

            ancestor.setTokenValue(dependency, 6);
            ancestor.setTokenValue(token, (resolve) => resolve(dependency) * 2);

            expect(descendent.getTokenValue(token)).to.equal(12);

            descendent.setTokenValue(dependency, () => 7);
            Observable.getNotifier(token).subscribe(subscriber);

            descendent.setTokenValue(dependency, () => 8)

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token));
            expect(ancestor.getTokenValue(token)).to.equal(12);
            expect(parent.getTokenValue(token)).to.equal(12);
            expect(descendent.getTokenValue(token)).to.equal(16);
            expect(2).to.equal(2)
        });
        it("the token with a descendent node when a ancestor and descendent both have a dependency assigned and the ancestor is reassigned a token to a derived value that resolves the dependency and results in a value change", () => {
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);
            const { subscriber, handleChange } = createChangeHandler();

            ancestor.setTokenValue(dependency, 5);
            ancestor.setTokenValue(token, 12);
            descendent.setTokenValue(dependency, 7);
            Observable.getNotifier(token).subscribe(subscriber);

            expect(descendent.getTokenValue(token)).to.equal(12);

            ancestor.setTokenValue(token, (resolve) => resolve(dependency) * 2);

            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(ancestor, DesignTokenMutationType.change, token));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.add, token));
            expect(ancestor.getTokenValue(token)).to.equal(10);
            expect(parent.getTokenValue(token)).to.equal(10);
            expect(descendent.getTokenValue(token)).to.equal(14);
        });
        it("the token with the descendent node that has a token assigned a static value deleted that is a dependency of a value assigned for an ancestor", () => {
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);
            const { subscriber, handleChange } = createChangeHandler();

            ancestor.setTokenValue(dependency, 6);
            ancestor.setTokenValue(token, (resolve) => resolve(dependency) * 2);
            descendent.setTokenValue(dependency, 7);
            Observable.getNotifier(token).subscribe(subscriber);
            expect(descendent.getTokenValue(token)).to.equal(14);

            descendent.deleteTokenValue(dependency);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token));
            expect(ancestor.getTokenValue(token)).to.equal(12);
            expect(parent.getTokenValue(token)).to.equal(12);
            expect(descendent.getTokenValue(token)).to.equal(12);
        });
        it("the token with the descendent node that has a token assigned a derived value deleted that is a dependency of a value assigned for an ancestor", () => {
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);
            const { subscriber, handleChange } = createChangeHandler();

            ancestor.setTokenValue(dependency, 6);
            ancestor.setTokenValue(token, (resolve) => resolve(dependency) * 2);
            descendent.setTokenValue(dependency, () => 7);
            Observable.getNotifier(token).subscribe(subscriber);
            expect(descendent.getTokenValue(token)).to.equal(14);

            descendent.deleteTokenValue(dependency);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token));
            expect(ancestor.getTokenValue(token)).to.equal(12);
            expect(parent.getTokenValue(token)).to.equal(12);
            expect(descendent.getTokenValue(token)).to.equal(12);
        });
        /**
         * Appending nodes
         */
        it("the token with the descendent node that has a dependency assigned when the node is appended to an ancestor with a derived value assigned that depends on the dependency", () => {
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode();
            const dependency = new DesignToken<number>();
            const token = new DesignToken<number>();
            const { subscriber, handleChange } = createChangeHandler();

            ancestor.setTokenValue(dependency, 6);
            ancestor.setTokenValue(token, (resolve) => resolve(dependency) * 2);
            descendent.setTokenValue(dependency, 7);

            Observable.getNotifier(token).subscribe(subscriber);

            parent.appendChild(descendent);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.add, token));
            expect(descendent.getTokenValue(token)).to.equal(14);
        });
        /**
         * Removing nodes
         */
        it("the token with the descendent node that has a dependency assigned when the node is appended to an ancestor with a derived value assigned that depends on the dependency and is then removed", () => {
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode();
            const dependency = new DesignToken<number>();
            const token = new DesignToken<number>();
            const { subscriber, handleChange } = createChangeHandler();

            ancestor.setTokenValue(dependency, 6);
            ancestor.setTokenValue(token, (resolve) => resolve(dependency) * 2);
            descendent.setTokenValue(dependency, 7);

            parent.appendChild(descendent);
            Observable.getNotifier(token).subscribe(subscriber);

            parent.removeChild(descendent)

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.delete, token));
            expect(() => descendent.getTokenValue(token)).to.throw;
            expect(2).to.equal(2)
        });
        /**
         * Moving node
         */
        it("the token with the descendent node that has a dependency assigned when the node is re-parented to an ancestor with a different derived value assigned that depends on the dependency", () => {
            const ancestorA = createNode();
            const ancestorB = createNode();
            const parentA = createNode(ancestorA);
            const parentB = createNode(ancestorB);
            const descendent = createNode(parentA);
            const dependency = new DesignToken<number>();
            const token = new DesignToken<number>();
            const { subscriber, handleChange } = createChangeHandler();

            ancestorA.setTokenValue(dependency, 6);
            ancestorA.setTokenValue(token, (resolve) => resolve(dependency) * 2);
            ancestorB.setTokenValue(dependency, 7);
            ancestorB.setTokenValue(token, resolve => resolve(dependency) * 3);
            descendent.setTokenValue(dependency, 7);

            Observable.getNotifier(token).subscribe(subscriber);

            parentB.appendChild(descendent);

            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.delete, token));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.add, token));
            expect(descendent.getTokenValue(token)).to.equal(21);
        });

        /**
         * Observable values
         */
        it("the token with the node assigned a derived value when an observable value used by the value is changed", () => {
            const node = createNode();
            const token = new DesignToken<number>();
            const dependencies: { value: number } = makeObservable({ value: 6});
            const { subscriber, handleChange} = createChangeHandler();

            node.setTokenValue(token, () => dependencies.value * 2);
            Observable.getNotifier(token).subscribe(subscriber)

            expect(node.getTokenValue(token)).to.equal(12);

            dependencies.value = 7;

            expect(node.getTokenValue(token)).to.equal(14);
            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.change, token));
        });
        it("the token with the ancestor and descendent node when the ancestor is assigned a derived value using an observable and a token, where both nodes contain a value set for the dependency", () => {
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const observableDependency: { value: number } = makeObservable({ value: 6});
            const { subscriber, handleChange} = createChangeHandler();

            ancestor.setTokenValue(dependency, 4);
            ancestor.setTokenValue(token, (resolve) => observableDependency.value * 2 + resolve(dependency));
            descendent.setTokenValue(dependency, 8);
            Observable.getNotifier(token).subscribe(subscriber)

            expect(ancestor.getTokenValue(token)).to.equal(16);
            expect(descendent.getTokenValue(token)).to.equal(20);

            observableDependency.value = 7;

            expect(ancestor.getTokenValue(token)).to.equal(18);
            expect(descendent.getTokenValue(token)).to.equal(22);
            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(ancestor, DesignTokenMutationType.change, token));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token));
        });
    });

    describe("should not notify", () => {
        it("the token when the static value assigned to a node is the same value as was previously assigned", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const handleChange = chai.spy(() => {})
            const subscriber: Subscriber = { handleChange }
            node.setTokenValue(token, 12);
            Observable.getNotifier(token).subscribe(subscriber);

            node.setTokenValue(token, 12);

            expect(handleChange).not.to.have.been.called();
        });
        it("the token when the derived value assigned to a node results in the same value as the previously assigned static value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const handleChange = chai.spy(() => {})
            const subscriber: Subscriber = { handleChange }
            node.setTokenValue(token, 12);
            Observable.getNotifier(token).subscribe(subscriber);

            node.setTokenValue(token, () => 12);

            expect(handleChange).not.to.have.been.called();
        });
        it("the token when the derived value assigned to a node results in the same value as the previously assigned derived value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const handleChange = chai.spy(() => {})
            const subscriber: Subscriber = { handleChange }
            function a() {
                return 12;
            }

            function b() {
                return 12;
            }

            node.setTokenValue(token, a);
            Observable.getNotifier(token).subscribe(subscriber);

            node.setTokenValue(token, b);

            expect(a).not.to.equal(b)
            expect(handleChange).not.to.have.been.called();
        });

        it("the token when a dependency of a derived token value is set for a descendent but there is an intermediary value set that is a static value", () => {
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const child = createNode(parent);
            const { subscriber, handleChange } = createChangeHandler();
            ancestor.setTokenValue(dependency, 12);
            ancestor.setTokenValue(token, (resolve) => resolve(dependency) * 2);
            parent.setTokenValue(token, 25);

            Observable.getNotifier(token).subscribe(subscriber)
            child.setTokenValue(dependency, 13);

            expect(handleChange).not.to.have.been.called;
            expect(child.getTokenValue(token)).to.equal(25);
        });
        it("the token when a dependency of a derived token value is set for a descendent but there is an intermediary value set that is a derived value that does not depend on the dependent token", () => {
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const child = createNode(parent);
            const { subscriber, handleChange } = createChangeHandler();
            ancestor.setTokenValue(dependency, 12);
            ancestor.setTokenValue(token, (resolve) => resolve(dependency) * 2);
            parent.setTokenValue(token, () => 25);

            Observable.getNotifier(token).subscribe(subscriber)
            child.setTokenValue(dependency, 13);

            expect(handleChange).not.to.have.been.called;
            expect(child.getTokenValue(token)).to.equal(25);
        });
        it("the token when a derived value using an observable value is deleted and then the observable value is changed", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const handleChange = chai.spy(() => {})
            const subscriber: Subscriber = { handleChange }
            node.setTokenValue(token, 12);
            const dependencies = makeObservable({value: 6});

            node.setTokenValue(token, () => dependencies.value * 2);
            node.deleteTokenValue(token);
            Observable.getNotifier(token).subscribe(subscriber);

            dependencies.value = 7;

            expect(handleChange).not.to.have.been.called();
        });
        it("the token when a derived value using an observable value is re-assigned and then the observable value is changed", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const handleChange = chai.spy(() => {})
            const subscriber: Subscriber = { handleChange }
            node.setTokenValue(token, 12);
            const dependencies = makeObservable({value: 6});

            node.setTokenValue(token, () => dependencies.value * 2);
            node.setTokenValue(token, () => 14);
            Observable.getNotifier(token).subscribe(subscriber);
            dependencies.value = 7;

            expect(handleChange).not.to.have.been.called();
        });
    });


    describe("Original tests", () => {
        describe("getting and setting a simple value", () => {
            it("should throw if the token value has never been set on the element or it's any ancestors", () => {
                const target = new DesignTokenNode();
                const token = new DesignToken<number>();

                expect(() => target.getTokenValue(token)).to.throw();
            });

            it("should return the value set for the element if one has been set", () => {
                const target = new DesignTokenNode();
                const token = new DesignToken<number>();
                target.setTokenValue(token, 12)

                expect(target.getTokenValue(token)).to.equal(12);
            });

            it("should return the value set for an ancestor if a value has not been set for the target", () => {
                const ancestor = new DesignTokenNode();
                const target = new DesignTokenNode();
                ancestor.appendChild(target);
                const token = new DesignToken<number>();
                ancestor.setTokenValue(token, 12)

                expect(target.getTokenValue(token)).to.equal(12);
            });

            it("sound return the nearest ancestor's value after an intermediary value is set where no value was set prior", () => {
                const grandparent = new DesignTokenNode();
                const parent = new DesignTokenNode();
                const target = new DesignTokenNode();

                grandparent.appendChild(parent);
                parent.appendChild(target);

                const token = new DesignToken<number>();

                grandparent.setTokenValue(token, 12);

                expect(target.getTokenValue(token)).to.equal(12);

                parent.setTokenValue(token, 14)

                expect(target.getTokenValue(token)).to.equal(14);
            });

            it("should return the new ancestor's value after being re-parented", () => {
                const parentA = new DesignTokenNode();
                const parentB = new DesignTokenNode();
                const target = new DesignTokenNode();
                parentA.appendChild(target)

                const token = new DesignToken<number>();

                parentA.setTokenValue(token, 12);
                parentB.setTokenValue(token, 14);

                expect(target.getTokenValue(token)).to.equal(12);
                parentB.appendChild(target);

                expect(target.getTokenValue(token)).to.equal(14);
            });

            it("should support getting and setting falsey values", () => {
                const target = new DesignTokenNode();
                [false, null, 0, "", NaN].forEach(value => {

                    const token = new DesignToken<typeof value>();
                    target.setTokenValue(token, value)

                    if (typeof value === "number" && isNaN(value)) {
                        expect(isNaN(target.getTokenValue(token) as number)).to.equal(true)
                    } else {
                        expect(target.getTokenValue(token)).to.equal(value);
                    }
                });
            });

            // describe("that is a CSSDesignToken", () => {
            //     it("should set the CSS custom property for the element", async () => {
            //         const target = addElement();
            //         const token = new DesignToken<number>("test");
            //         token.setValueFor(target, 12);
            //         await Updates.next();
            //         expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal('12');
            //         removeElement(target)
            //     });
            // });
            // describe("that is not a CSSDesignToken", () => {
            //     it("should not set a CSS custom property for the element", () => {
            //         const target = addElement();
            //         const token = new DesignToken<number>({ name: "test", cssCustomPropertyName: null });
            //         token.setValueFor(target, 12);
            //         expect(window.getComputedStyle(target).getPropertyValue(("--test"))).to.equal('');
            //         removeElement(target)
            //     });
            // });
        });
        describe("getting and setting derived values", () => {
            it("should get the return value of a derived value", () => {
                const target = new DesignTokenNode();
                const token = new DesignToken<number>();
                target.setTokenValue(token, () => 12)

                expect(target.getTokenValue(token)).to.equal(12);
            });
            it("should get an updated value when observable properties used in a derived property are changed", () => {
                const target = new DesignTokenNode();
                const token = new DesignToken<number>();
                const dependencies: { value: number } = makeObservable({ value: 6});

                target.setTokenValue(token, () => dependencies.value * 2);

                expect(target.getTokenValue(token)).to.equal(12);

                dependencies.value = 7;

                expect(target.getTokenValue(token)).to.equal(14);
            });
            it("should get an updated value when other design tokens used in a derived property are changed", () => {
                const target = new DesignTokenNode();
                const tokenA = new DesignToken<number>();
                const tokenB = new DesignToken<number>();

                target.setTokenValue(tokenA, 6);
                target.setTokenValue(tokenB, (resolve) => resolve(tokenA) * 2);

                expect(target.getTokenValue(tokenB)).to.equal(12);

                target.setTokenValue(tokenA, 7)

                expect(target.getTokenValue(tokenB)).to.equal(14);
            });
            it("should use the closest value of a dependent token when getting a token for a target", () => {
                const ancestor = new DesignTokenNode()
                const parent = new DesignTokenNode();
                const target = new DesignTokenNode();

                ancestor.appendChild(parent)
                parent.appendChild(target);
                const tokenA = new DesignToken<number>();
                const tokenB = new DesignToken<number>();

                ancestor.setTokenValue(tokenA, 7);
                parent.setTokenValue(tokenA, 6)
                ancestor.setTokenValue(tokenB, (resolve) => resolve(tokenA) * 2);

                expect(target.getTokenValue(tokenB)).to.equal(12);
            });

            it("should update value of a dependent token when getting a token for a target", () => {
                const ancestor = new DesignTokenNode();
                const parent = new DesignTokenNode();
                const target = new DesignTokenNode();
                ancestor.appendChild(parent);
                parent.appendChild(target);
                const tokenA = new DesignToken<number>();
                const tokenB = new DesignToken<number>();

                ancestor.setTokenValue(tokenA, 7);
                parent.setTokenValue(tokenA, 6)
                ancestor.setTokenValue(tokenB, (resolve) => resolve(tokenA) * 2)

                expect(target.getTokenValue(tokenB)).to.equal(12);

                parent.setTokenValue(tokenA, 7);

                expect(target.getTokenValue(tokenB)).to.equal(14);
            });

            it("should get an updated value when a used design token is set for a node closer to the target", () => {
                const ancestor = new DesignTokenNode()
                const parent = new DesignTokenNode();
                const target = new DesignTokenNode();
                ancestor.appendChild(parent);
                parent.appendChild(target);

                const tokenA = new DesignToken<number>();
                const tokenB = new DesignToken<number>();

                ancestor.setTokenValue(tokenA, 6)
                ancestor.setTokenValue(tokenB, (resolve) => resolve( tokenA ) * 2)

                expect(target.getTokenValue(tokenB)).to.equal(12);

                target.setTokenValue(tokenA, 7)

                expect(target.getTokenValue(tokenB)).to.equal(14);
            });

        //     describe("that is a CSSDesignToken", () => {
        //         it("should set a CSS custom property equal to the resolved value of a derived token value", async () => {
        //             const target = addElement();
        //             const token = new DesignToken<number>("test");

        //             token.setValueFor(target, (target) => 12);

        //             await Updates.next();
        //             expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal('12');

        //             removeElement(target);
        //         });
        //         it("should set a CSS custom property equal to the resolved value of a derived token value with a dependent token", async () => {
        //             const target = addElement();
        //             const tokenA = new DesignToken<number>();
        //             const tokenB = new DesignToken<number>();

        //             tokenA.setValueFor(target, 6);
        //             tokenB.setValueFor(target, (target) => tokenA.getValueFor(target) * 2);

        //             await Updates.next();

        //             expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('12');
        //             removeElement(target);
        //         });

        //         it("should update a CSS custom property to the resolved value of a derived token value with a dependent token when the dependent token changes", async () => {
        //             const target = addElement();
        //             const tokenA = new DesignToken<number>();
        //             const tokenB = new DesignToken<number>();

        //             tokenA.setValueFor(target, 6);
        //             tokenB.setValueFor(target, (target) => tokenA.getValueFor(target) * 2);

        //             await Updates.next();
        //             expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('12');

        //             tokenA.setValueFor(target, 7);
        //             await Updates.next();
        //             expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('14');

        //             removeElement(target);
        //         });

        //         it("should set a CSS custom property equal to the resolved value for an element of a derived token value with a dependent token", async () => {
        //             const parent = addElement();
        //             const target = addElement(parent);
        //             const tokenA = new DesignToken<number>();
        //             const tokenB = new DesignToken<number>();

        //             tokenA.setValueFor(parent, 6);
        //             tokenB.setValueFor(parent, (target) => tokenA.getValueFor(target) * 2);
        //             tokenA.setValueFor(target, 7);

        //             await Updates.next();

        //             expect(window.getComputedStyle(parent).getPropertyValue(tokenB.cssCustomProperty)).to.equal('12');
        //             expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('14');
        //             removeElement(parent);
        //         });

        //         it("should set a CSS custom property equal to the resolved value for an element in a shadow DOM of a derived token value with a dependent token", async () => {
        //             const parent = addElement();
        //             const child = addElement(parent);
        //             const target = document.createElement("div");
        //             child.shadowRoot!.appendChild(target);
        //             const tokenA = new DesignToken<number>();
        //             const tokenB = new DesignToken<number>();

        //             tokenA.setValueFor(parent, 6);
        //             tokenB.setValueFor(parent, (target) => tokenA.getValueFor(target) * 2);
        //             tokenA.setValueFor(target, 7);

        //             await Updates.next();

        //             expect(window.getComputedStyle(parent).getPropertyValue(tokenB.cssCustomProperty)).to.equal('12');
        //             expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('14');
        //             removeElement(parent);
        //         });

        //         it("should set a CSS custom property equal to the resolved value for both elements for which a dependent token is set when setting a derived token value", async () => {
        //             const parent = addElement();
        //             const target = addElement(parent);
        //             const tokenA = new DesignToken<number>();
        //             const tokenB = new DesignToken<number>();

        //             tokenA.setValueFor(parent, 6);
        //             tokenA.setValueFor(target, 7);
        //             tokenB.setValueFor(parent, (target) => tokenA.getValueFor(target) * 2);

        //             await Updates.next();

        //             expect(window.getComputedStyle(parent).getPropertyValue(tokenB.cssCustomProperty)).to.equal('12');
        //             expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('14');
        //             removeElement(parent);
        //         });

        //         it("should revert a CSS custom property back to a previous value when the Design Token value is reverted", async () => {
        //             const token = new DesignToken<number>("test");
        //             const target = addElement();

        //             token.setValueFor(target, 12);
        //             await Updates.next();
        //             expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal('12');

        //             token.setValueFor(target, 14);
        //             await Updates.next();
        //             expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal('14');

        //             token.setValueFor(target, 12);
        //             await Updates.next();
        //             expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal('12');
        //         })
        //     });

        //     describe("that is not a CSSDesignToken", () => {
        //         it("should not emit a CSS custom property", () => {
        //             const target = addElement();
        //             const token = new DesignToken<number>({name: "test", cssCustomPropertyName: null});

        //             token.setValueFor(target, (target) => 12);

        //             expect(window.getComputedStyle(target).getPropertyValue('--test')).to.equal('');

        //             removeElement(target);
        //         })
        //     })

             it("should support getting and setting falsey values", () => {
                 const target = new DesignTokenNode();
                 [false, null, 0, "", NaN].forEach(value => {

                     const token = new DesignToken<typeof value>();
                     target.setTokenValue(token, () => value as any);
                     //token.setValueFor(target, () => value as any);

                     if (typeof value === "number" && isNaN(value)) {
                         expect(isNaN(target.getTokenValue(token) as number)).to.equal(true)
                     } else {
                         expect(target.getTokenValue(token)).to.equal(value);
                     }
                 })
             });
        });

        // describe("getting and setting a token value", () => {
        //     it("should retrieve the value of the token it was set to", () => {
        //         const tokenA = new DesignToken<number>("token-a");
        //         const tokenB = new DesignToken<number>("token-b");
        //         const target = addElement();

        //         tokenA.setValueFor(target, 12);
        //         tokenB.setValueFor(target, tokenA);

        //         expect(tokenB.getValueFor(target)).to.equal(12);

        //         removeElement(target);
        //     });
        //     it("should update the value of the token it was set to when the token's value changes", () => {
        //         const tokenA = new DesignToken<number>("token-a");
        //         const tokenB = new DesignToken<number>("token-b");
        //         const target = addElement();

        //         tokenA.setValueFor(target, 12);
        //         tokenB.setValueFor(target, tokenA);

        //         expect(tokenB.getValueFor(target)).to.equal(12);

        //         tokenA.setValueFor(target, 14);

        //         expect(tokenB.getValueFor(target)).to.equal(14);

        //         removeElement(target);
        //     });
        //     it("should update the derived value of the token when a dependency of the derived value changes", () => {
        //         const tokenA = new DesignToken<number>("token-a");
        //         const tokenB = new DesignToken<number>("token-b");
        //         const tokenC = new DesignToken<number>("token-b");
        //         const target = addElement();

        //         tokenA.setValueFor(target, 6);
        //         tokenB.setValueFor(target, (target) => tokenA.getValueFor(target) * 2);
        //         tokenC.setValueFor(target, tokenB);

        //         expect(tokenC.getValueFor(target)).to.equal(12);

        //         tokenA.setValueFor(target, 7);

        //         expect(tokenC.getValueFor(target)).to.equal(14);

        //         removeElement(target);
        //     });

        //     describe("that is a CSSDesignToken", () => {
        //         it("should emit a CSS custom property", () => {
        //             const tokenA = new DesignToken<number>("token-a");
        //             const tokenB = new DesignToken<number>("token-b");
        //             const target = addElement();

        //             tokenA.setValueFor(target, 12);
        //             tokenB.setValueFor(target, tokenA);

        //             expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal("12");

        //             removeElement(target);
        //         });
        //         it("should update the emitted CSS custom property when the token's value changes", async () => {
        //             const tokenA = new DesignToken<number>("token-a");
        //             const tokenB = new DesignToken<number>("token-b");
        //             const target = addElement();

        //             tokenA.setValueFor(target, 12);
        //             tokenB.setValueFor(target, tokenA);

        //             await Updates.next();
        //             expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal("12");

        //             tokenA.setValueFor(target, 14);

        //             await Updates.next();
        //             expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal("14");

        //             removeElement(target);
        //         });
        //         it("should update the emitted CSS custom property of a token assigned a derived value when the token dependency changes", async () => {
        //             const tokenA = new DesignToken<number>("token-a");
        //             const tokenB = new DesignToken<number>("token-b");
        //             const tokenC = new DesignToken<number>("token-c");
        //             const target = addElement();

        //             tokenA.setValueFor(target, 6);
        //             tokenB.setValueFor(target, (target) => tokenA.getValueFor(target) * 2);
        //             tokenC.setValueFor(target, tokenB);

        //             await Updates.next();
        //             expect(window.getComputedStyle(target).getPropertyValue(tokenC.cssCustomProperty)).to.equal("12");

        //             tokenA.setValueFor(target, 7);

        //             await Updates.next();
        //             expect(window.getComputedStyle(target).getPropertyValue(tokenC.cssCustomProperty)).to.equal("14");

        //             removeElement(target);
        //         });

        //         it("should support accessing the token for being assigned from the derived value", () => {
        //             const tokenA = new DesignToken<number>("token-a");
        //             const parent = addElement();
        //             const child = addElement(parent);
        //             tokenA.withDefault(6);
        //             const recipe = (el: HTMLElement) => tokenA.getValueFor(el.parentElement!) * 2;
        //             tokenA.setValueFor(parent, recipe);
        //             tokenA.setValueFor(child, recipe);

        //             expect(tokenA.getValueFor(parent)).to.equal(12);
        //             expect(tokenA.getValueFor(child)).to.equal(24);
        //         })
        //     });
        //     it("should update the CSS custom property of a derived token with a dependency that is a derived token that depends on a third token", async () => {
        //             const tokenA = new DesignToken<number>("token-a");
        //             const tokenB = new DesignToken<number>("token-b");
        //             const tokenC = new DesignToken<number>("token-c");
        //             const grandparent = addElement()
        //             const parent = addElement(grandparent);
        //             const child = addElement(parent);

        //             tokenA.setValueFor(grandparent, 3);
        //             tokenB.setValueFor(grandparent, (el: HTMLElement) => tokenA.getValueFor(el) * 2);
        //             tokenC.setValueFor(grandparent, (el) => tokenB.getValueFor(el) * 2)

        //             await Updates.next();

        //             expect(tokenC.getValueFor(child)).to.equal(12);
        //             expect(window.getComputedStyle(child).getPropertyValue(tokenC.cssCustomProperty)).to.equal("12");

        //             tokenA.setValueFor(child, 4);

        //             await Updates.next();
        //             expect(tokenC.getValueFor(child)).to.equal(16);
        //             expect(window.getComputedStyle(child).getPropertyValue(tokenC.cssCustomProperty)).to.equal("16");
        //     });
        //     it("should update tokens when an element for which a token with static dependencies is set is appended to the DOM", async () => {


        //         const tokenA = new DesignToken<number>("token-a");
        //         const tokenB = new DesignToken<number>("token-b");

        //         tokenA.withDefault(6);
        //         tokenB.withDefault(el => tokenA.getValueFor(el) * 2);

        //         const element = document.createElement(`fast-${elementName}`);

        //         tokenA.setValueFor(element, 7);

        //         document.body.appendChild(element);

        //         await Updates.next();

        //         expect(window.getComputedStyle(element).getPropertyValue(tokenB.cssCustomProperty)).to.equal('14');
        //     });
        //     it("should update tokens and notify when an element for which a token with dynamic dependencies is set is appended to the DOM", async () => {
        //         const tokenA = new DesignToken<number>("token-a");
        //         const tokenB = new DesignToken<number>("token-b");

        //         tokenA.withDefault(() => 6);
        //         tokenB.withDefault(el => tokenA.getValueFor(el) * 2);

        //         const parent = document.createElement(`fast-${elementName}`);
        //         const child = document.createElement(`fast-${elementName}`);
        //         parent.appendChild(child);

        //         const handleChange = chia.spy(() => {});
        //         const subscriber = { handleChange };
        //         expect(tokenB.getValueFor(child)).to.equal(12);

        //         tokenB.subscribe(subscriber, child);

        //         document.body.appendChild(parent);

        //         await Updates.next();

        //         expect(handleChange).not.to.have.been.called();

        //         tokenA.setValueFor(parent, () => 7);
        //         expect(tokenB.getValueFor(child)).to.equal(14);
        //         await Updates.next();
        //         expect(handleChange).to.have.been.called.once;
        //     });
        //     it("should notify a subscriber for a token after being appended to a parent with a different token value than the previous context", async () => {
        //         const tokenA = new DesignToken<number>("token-a");
        //         const tokenB = new DesignToken<number>("token-b");

        //         tokenA.withDefault(() => 6);
        //         tokenB.withDefault(el => tokenA.getValueFor(el) * 2);

        //         const parent = document.createElement(`fast-${elementName}`);
        //         const child = document.createElement(`fast-${elementName}`);
        //         document.body.appendChild(parent);
        //         tokenA.setValueFor(parent, () => 7);

        //         const handleChange = chia.spy(() => {});
        //         const subscriber = { handleChange };

        //         expect(tokenB.getValueFor(child)).to.equal(12);
        //         tokenB.subscribe(subscriber, child);

        //         expect(handleChange).not.to.have.been.called()
        //         parent.appendChild(child);

        //         expect(tokenB.getValueFor(child)).to.equal(14);
        //         expect(handleChange).to.have.been.called.once
        //     });
        //     it("should notify a subscriber for a token after being appended to a parent with a different token value than the previous context", async () => {
        //         const tokenA = new DesignToken<number>("token-a");
        //         tokenA.withDefault(6);

        //         const parent = document.createElement(`fast-${elementName}`);
        //         const child = document.createElement(`fast-${elementName}`);
        //         document.body.appendChild(parent);
        //         tokenA.setValueFor(parent, 7);

        //         const handleChange = chia.spy(() => {});
        //         const subscriber = { handleChange };

        //         expect(tokenA.getValueFor(child)).to.equal(6);
        //         tokenA.subscribe(subscriber, child);
        //         expect(handleChange).not.to.have.been.called()
        //         parent.appendChild(child);

        //         expect(handleChange).to.have.been.called.once;
        //         expect(tokenA.getValueFor(child)).to.equal(7);
        //     });
        // })
        // describe("deleting simple values", () => {
        //     it("should throw when deleted and no parent token value is set", () => {
        //         const target = addElement();
        //         const token = new DesignToken<number>("test");

        //         token.setValueFor(target, 12);

        //         expect(token.getValueFor(target)).to.equal(12)

        //         token.deleteValueFor(target);

        //         expect(() => token.getValueFor(target)).to.throw();
        //         removeElement(target)
        //     });
        //     it("should allow getting a value that was set upstream", () => {
        //         const parent = addElement()
        //         const target = addElement(parent);
        //         const token = new DesignToken<number>("test");

        //         token.setValueFor(parent, 12);
        //         token.setValueFor(target, 14);

        //         expect(token.getValueFor(target)).to.equal(14)

        //         token.deleteValueFor(target);

        //         expect(token.getValueFor(target)).to.equal(12)
        //         removeElement(parent)
        //     });
        // });
        // describe("deleting derived values", () => {
        //     it("should throw when deleted and no parent token value is set", () => {
        //         const target = addElement();
        //         const token = new DesignToken<number>("test");

        //         token.setValueFor(target, () => 12);

        //         expect(token.getValueFor(target)).to.equal(12)

        //         token.deleteValueFor(target);

        //         expect(() => token.getValueFor(target)).to.throw();
        //         removeElement(target)
        //     });
        //     it("should allow getting a value that was set upstream", () => {
        //         const parent = addElement()
        //         const target = addElement(parent);
        //         const token = new DesignToken<number>("test");

        //         token.setValueFor(parent, () => 12);
        //         token.setValueFor(target, () => 14);

        //         expect(token.getValueFor(target)).to.equal(14)

        //         token.deleteValueFor(target);

        //         expect(token.getValueFor(target)).to.equal(12)
        //         removeElement(parent)
        //     });

        //     it("should cause dependent tokens to re-evaluate", () => {
        //         const tokenA = new DesignToken<number>();
        //         const tokenB = new DesignToken<number>();
        //         const parent = addElement();
        //         const target = addElement(parent);

        //         tokenA.setValueFor(parent, 7);
        //         tokenA.setValueFor(target, 6);
        //         tokenB.setValueFor(target, (element) => tokenA.getValueFor(element) * 2);

        //         expect(tokenB.getValueFor(target)).to.equal(12);

        //         tokenA.deleteValueFor(target);

        //         expect(tokenB.getValueFor(target)).to.equal(14);
        //         removeElement(parent)
        //     })
        // });

        // describe("when used as a CSSDirective", () => {
        //     it("should set a CSS custom property for the element when the token is set for the element", async () => {
        //         const target = addElement();
        //         const token = new DesignToken<number>("test");
        //         token.setValueFor(target, 12);
        //         const styles = css`:host{width: calc(${token} * 1px);}`
        //         target.$fastController.addStyles(styles);

        //         await Updates.next();
        //         expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");
        //         removeElement(target)
        //     });
        //     it("should set a CSS custom property for the element when the token is set for an ancestor element", async () => {
        //         const parent = addElement()
        //         const target = addElement(parent);
        //         const token = new DesignToken<number>("test");
        //         token.setValueFor(parent, 12);
        //         const styles = css`:host{width: calc(${token} * 1px);}`
        //         target.$fastController.addStyles(styles);

        //         await Updates.next();
        //         expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");
        //         removeElement(parent)
        //     })
        // });

        // describe("with a default value set", () => {
        //     it("should return the default value if no value is set for a target", () => {
        //         const target = addElement();
        //         const token = new DesignToken<number>("test");
        //         token.withDefault(2)

        //         expect(token.getValueFor(target)).to.equal(2);
        //         removeElement(target)
        //     });
        //     it("should return the default value for a descendent if no value is set for a target", () => {
        //         const parent = addElement()
        //         const target = addElement(parent);
        //         const token = new DesignToken<number>("test");
        //         token.withDefault(2)

        //         expect(token.getValueFor(target)).to.equal(2);
        //         removeElement(parent)
        //     });
        //     it("should return the value set and not the default if value is set", () => {
        //         const target = addElement();
        //         const token = new DesignToken<number>("test");
        //         token.withDefault(4)
        //         token.setValueFor(target, 2)

        //         expect(token.getValueFor(target)).to.equal(2);
        //         removeElement(target)
        //     });
        //     it("should get a new default value if a new default is provided", () => {
        //         const target = addElement();
        //         const token = new DesignToken<number>("test");
        //         token.withDefault(2);
        //         token.withDefault(4);

        //         expect(token.getValueFor(target)).to.equal(4);
        //         removeElement(target)
        //     });
        // });

        // describe("with subscribers", () => {
        //     it("should notify an un-targeted subscriber when the value changes for any element", () => {
        //         const ancestor = addElement();
        //         const parent = addElement(ancestor);
        //         const target = addElement(parent);
        //         const token = new DesignToken<number>("test");
        //         const spy = new Map<HTMLElement, boolean>([[ancestor, false], [parent, false], [ target, false ]]);

        //         const subscriber: DesignTokenSubscriber<typeof token>  = {
        //             handleChange(record: DesignTokenChangeRecord<typeof token>) {
        //                 spy.set(record.target, true)
        //             }
        //         }

        //         token.subscribe(subscriber);

        //         expect(spy.get(ancestor)).to.be.false;
        //         expect(spy.get(parent)).to.be.false;
        //         expect(spy.get(target)).to.be.false;

        //         token.setValueFor(ancestor, 12);
        //         expect(spy.get(ancestor)).to.be.true;
        //         expect(spy.get(parent)).to.be.false;
        //         expect(spy.get(target)).to.be.false;

        //         token.setValueFor(parent, 14);
        //         expect(spy.get(ancestor)).to.be.true;
        //         expect(spy.get(parent)).to.be.true;
        //         expect(spy.get(target)).to.be.false;

        //         token.setValueFor(target, 16);
        //         expect(spy.get(target)).to.be.true;
        //         expect(spy.get(parent)).to.be.true;
        //         expect(spy.get(target)).to.be.true;

        //         removeElement(ancestor);
        //     });
        //     it("should notify a target-subscriber if the value is changed for the provided target", () => {
        //             const parent = addElement();
        //             const target = addElement(parent);
        //             const token = new DesignToken<number>("test");

        //             const handleChange = chia.spy(() => {});
        //             const subscriber: DesignTokenSubscriber<typeof token>  = {
        //                 handleChange
        //             }

        //             token.subscribe(subscriber, target);

        //             token.setValueFor(parent, 12);
        //             expect(handleChange).to.have.been.called.once;

        //             token.setValueFor(target, 14);
        //             expect(handleChange).to.have.been.called.twice;

        //             removeElement(parent);
        //     });

        //     it("should not notify a subscriber after unsubscribing", () => {
        //         let invoked = false;
        //         const target = addElement();
        //         const token = new DesignToken<number>("test");

        //         const subscriber: DesignTokenSubscriber<typeof token>  = {
        //             handleChange(record: DesignTokenChangeRecord<typeof token>) {
        //                 invoked = true;
        //             }
        //         }

        //         token.subscribe(subscriber);
        //         token.unsubscribe(subscriber);

        //         token.setValueFor(target, 12);
        //         expect(invoked).to.be.false;

        //         removeElement(target);
        //     });

        //     it("should infer DesignToken and CSSDesignToken token types on subscription record", () => {
        //         type AssertCSSDesignToken<T> = T extends CSSDesignToken<any> ? T : never;
        //         new DesignToken<number>("css").subscribe({handleChange(record) {
        //             const test: AssertCSSDesignToken<typeof record.token> = record.token;
        //         }});

        //         type AssertDesignToken<T> = T extends CSSDesignToken<any> ? never : T;

        //         new DesignToken<number>({name: "no-css", cssCustomPropertyName: null}).subscribe({handleChange(record) {
        //             const test: AssertDesignToken<typeof record.token> = record.token;
        //         }})
        //     });

        //     it("should notify a subscriber when a dependency of a subscribed token changes", async () => {
        //         const tokenA = new DesignToken<number>();
        //         const tokenB = new DesignToken<number>();

        //         tokenA.withDefault(6);
        //         tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);

        //         const handleChange = chia.spy(() => {})
        //         const subscriber = {
        //             handleChange
        //         }


        //         tokenB.subscribe(subscriber);

        //         tokenA.withDefault(7);
        //         await Updates.next();
        //         expect(handleChange).to.have.been.called();
        //     });

        //     it("should notify a subscriber when a dependency of a dependency of a subscribed token changes", async () => {
        //         const tokenA = new DesignToken<number>();
        //         const tokenB = new DesignToken<number>();
        //         const tokenC = new DesignToken<number>("c");

        //         tokenA.withDefault(6);
        //         tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);
        //         tokenC.withDefault((el) => tokenB.getValueFor(el) * 2);

        //         const handleChange = chia.spy(() => {})
        //         const subscriber = {
        //             handleChange
        //         }


        //         tokenC.subscribe(subscriber);

        //         tokenA.withDefault(7);
        //         await Updates.next();
        //         expect(handleChange).to.have.been.called()
        //     });

        //     it("should notify a subscriber when a dependency changes for an element down the DOM tree", async () => {
        //         const tokenA = new DesignToken<number>();
        //         const tokenB = new DesignToken<number>();

        //         const target = addElement();

        //         tokenA.withDefault(6);
        //         tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);

        //         const handleChange = chia.spy(() => {})
        //         const subscriber = {
        //             handleChange
        //         }


        //         tokenB.subscribe(subscriber);

        //         tokenA.setValueFor(target, 7);
        //         await Updates.next();
        //         expect(handleChange).to.have.been.called();
        //     })
        //     it("should notify a subscriber when a static-value dependency of subscribed token changes for a parent of the subscription target", async () => {
        //         const tokenA = new DesignToken<number>();
        //         const tokenB = new DesignToken<number>();

        //         const parent = addElement();
        //         const target = addElement(parent)

        //         tokenA.withDefault(6);
        //         tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);

        //         const handleChange = chia.spy(() => {})
        //         const subscriber = {
        //             handleChange
        //         }


        //         tokenB.subscribe(subscriber, target);

        //         tokenA.setValueFor(parent, 7);
        //         await Updates.next();
        //         expect(handleChange).to.have.been.called();
        //         expect(tokenB.getValueFor(target)).to.equal(14)
        //     });
        //     it("should notify a subscriber when a derived-value dependency of subscribed token changes for a parent of the subscription target", async () => {
        //         const tokenA = new DesignToken<number>();
        //         const tokenB = new DesignToken<number>();

        //         const parent = addElement();
        //         const target = addElement(parent)

        //         tokenA.withDefault(() => 6);
        //         tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);

        //         const handleChange = chia.spy(() => {})
        //         const subscriber = {
        //             handleChange
        //         }


        //         tokenB.subscribe(subscriber, target);

        //         tokenA.setValueFor(parent, () => 7);
        //         await Updates.next();
        //         expect(handleChange).to.have.been.called();
        //         expect(tokenB.getValueFor(target)).to.equal(14)
        //     });
        //     it("should notify a subscriber when a dependency of subscribed token changes for a parent of the subscription target", async () => {
        //         const tokenA = new DesignToken<number>();
        //         const tokenB = new DesignToken<number>();

        //         const grandparent = addElement();
        //         const parent = addElement(grandparent)
        //         const child = addElement(parent)

        //         tokenA.withDefault(() => 6);
        //         tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);

        //         const handleChange = chia.spy(() => {})
        //         const subscriber = {
        //             handleChange
        //         }


        //         tokenB.subscribe(subscriber, child);

        //         tokenA.setValueFor(grandparent, () => 7);
        //         await Updates.next();
        //         expect(handleChange).to.have.been.called();
        //     });
        // });

        // describe("with root registration", () => {
        //     it("should not emit CSS custom properties for the default value", () => {
        //         DesignToken.unregisterRoot();
        //         const token = new DesignToken<number>('default-no-root').withDefault(12);
        //         const styles = window.getComputedStyle(document.body);

        //         expect(styles.getPropertyValue(token.cssCustomProperty)).to.equal("");
        //     });

        //     it("should emit CSS custom properties for the default value when a design token root is registered", async () => {
        //         const token = new DesignToken<number>('default-with-root').withDefault(12);
        //         const styles = window.getComputedStyle(document.body);

        //         DesignToken.registerRoot();

        //         await Updates.next();

        //         expect(styles.getPropertyValue(token.cssCustomProperty)).to.equal("12");
        //         DesignToken.unregisterRoot();
        //     });

        //     it("should remove emitted CSS custom properties for a root when the root is deregistered", async () => {
        //         const token = new DesignToken<number>('deregistered-root').withDefault(12);
        //         const styles = window.getComputedStyle(document.body);

        //         DesignToken.registerRoot();

        //         await Updates.next();

        //         expect(styles.getPropertyValue(token.cssCustomProperty)).to.equal("12");
        //         DesignToken.unregisterRoot();

        //         await Updates.next();

        //         expect(styles.getPropertyValue(token.cssCustomProperty)).to.equal("");
        //     });

        //     it("should emit CSS custom properties to an element when the element is provided as a root", async () => {
        //         const token = new DesignToken<number>('default-with-element-root').withDefault(12);
        //         const element = addElement();

        //         DesignToken.registerRoot(element);

        //         await Updates.next();
        //         const styles = window.getComputedStyle(element);

        //         expect(styles.getPropertyValue(token.cssCustomProperty)).to.equal("12");
        //         DesignToken.unregisterRoot(element);
        //     });
        //     it("should emit CSS custom properties to multiple roots", async () => {
        //         DesignToken.unregisterRoot();
        //         const token = new DesignToken<number>('default-with-multiple-roots').withDefault(12);
        //         const a = addElement();
        //         const b = addElement();

        //         DesignToken.registerRoot(a);
        //         await Updates.next();

        //         expect(window.getComputedStyle(a).getPropertyValue(token.cssCustomProperty)).to.equal("12");
        //         expect(window.getComputedStyle(b).getPropertyValue(token.cssCustomProperty)).to.equal("");
        //         expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("");

        //         DesignToken.registerRoot(b);
        //         await Updates.next();
        //         expect(window.getComputedStyle(a).getPropertyValue(token.cssCustomProperty)).to.equal("12");
        //         expect(window.getComputedStyle(b).getPropertyValue(token.cssCustomProperty)).to.equal("12");
        //         expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("");

        //         DesignToken.registerRoot();
        //         await Updates.next();
        //         expect(window.getComputedStyle(a).getPropertyValue(token.cssCustomProperty)).to.equal("12");
        //         expect(window.getComputedStyle(b).getPropertyValue(token.cssCustomProperty)).to.equal("12");
        //         expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("12");
        //     });
        // });
    })
});
