import { Observable, Subscriber } from "@microsoft/fast-element";
import { makeObservable } from "@microsoft/fast-element/utilities";
import chai, { expect } from "chai";
import spies from "chai-spies";
import { DesignTokenChangeRecordImpl as DesignTokenChangeRecord, DesignTokenMutationType, DesignTokenNode, DesignTokenResolver } from "./design-token-node.js";
import type { DesignToken as IDesignToken } from "./design-token.js"

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

class DesignToken<T> implements IDesignToken<T>  {
    $value: T | undefined = undefined;
}

describe("DesignTokenNode", () => {
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
    describe("setting a token to a static value", () => {
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
    })
    describe("setting a token to a derived value", () => {
         it("should support getting and setting falsey values", () => {
             const target = new DesignTokenNode();
             [false, null, 0, "", NaN].forEach(value => {

                 const token = new DesignToken<typeof value>();
                 target.setTokenValue(token, () => value as any);

                 if (typeof value === "number" && isNaN(value)) {
                     expect(isNaN(target.getTokenValue(token) as number)).to.equal(true)
                 } else {
                     expect(target.getTokenValue(token)).to.equal(value);
                 }
             })
         });

        it("should get the return value of a derived value", () => {
            const target = new DesignTokenNode();
            const token = new DesignToken<number>();
            target.setTokenValue(token, () => 12)

            expect(target.getTokenValue(token)).to.equal(12);
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
        it("should resolve a value for the token being assigned from the parent node", () => {
            const token = new DesignToken<number>();
            const parent = createNode();
            const child = createNode(parent);

            parent.setTokenValue(token, 12);
            child.setTokenValue(token, (resolve) => {
                return resolve<number>(token) * 2;
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
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token, 12))
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
            expect(handleChange).to.have.been.called.with(token, new DesignTokenChangeRecord(child, DesignTokenMutationType.add, token, 12));
        });
        it("the token with the node that has the token assigned a derived value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            Observable.getNotifier(token).subscribe(subscriber);
            const value = () => 12;
            node.setTokenValue(token, value);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token, value))
            expect(node.getTokenValue(token)).to.equal(12);
        });
        it("the token with the node that has the token reassigned a static value from a derived value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            Observable.getNotifier(token).subscribe(subscriber);
            const value = () => 12;
            node.setTokenValue(token, value);
            node.setTokenValue(token, 14);

            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token, value));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.change, token, 14));
            expect(node.getTokenValue(token)).to.equal(14);
        });
        it("the token with the node that has the token reassigned a derived value from a static value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            Observable.getNotifier(token).subscribe(subscriber);
            node.setTokenValue(token, 12);
            const value = () => 14;
            node.setTokenValue(token, value);
            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token, 12));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.change, token, value));
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
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token, 12));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.delete, token));
            expect(() => node.getTokenValue(token)).to.throw();
        });
        it("the token with the node that has the token assigned a derived value which is then deleted", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            Observable.getNotifier(token).subscribe(subscriber);
            const value = () => 12;
            node.setTokenValue(token, value);
            node.deleteTokenValue(token);

            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.add, token, value));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.delete, token));
            expect(() => node.getTokenValue(token)).to.throw();
        });
        it("the token with the node that has a token assigned a derived value and a dependency of the derived value changes for the node", () => {
            const token = new DesignToken<number>();
            const dependency = new DesignToken<number>();
            const node = new DesignTokenNode();
            const { subscriber, handleChange } = createChangeHandler();

            const value = (resolve: DesignTokenResolver) => resolve(dependency) * 2;
            node.setTokenValue(dependency, 6);
            node.setTokenValue(token, value);

            Observable.getNotifier(token).subscribe(subscriber);

            expect(node.getTokenValue(token)).to.equal(12);

            node.setTokenValue(dependency, 7);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.change, token, value));
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
            const value = (resolve: DesignTokenResolver) => resolve(dependency) * 2;
            ancestor.setTokenValue(token, value);

            Observable.getNotifier(token).subscribe(subscriber);

            expect(descendent.getTokenValue(token)).to.equal(12);

            descendent.setTokenValue(dependency, 7);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token, value));
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
            const value = (resolve: DesignTokenResolver) => resolve(dependency) * 2
            ancestor.setTokenValue(token, value);

            Observable.getNotifier(token).subscribe(subscriber);

            expect(descendent.getTokenValue(token)).to.equal(12);

            descendent.setTokenValue(dependency, () => 7);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token, value));
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

            const value = (resolve: DesignTokenResolver) => resolve(dependency) * 2;
            ancestor.setTokenValue(dependency, 6);
            ancestor.setTokenValue(token, value);

            expect(descendent.getTokenValue(token)).to.equal(12);

            descendent.setTokenValue(dependency, 7);
            Observable.getNotifier(token).subscribe(subscriber);

            descendent.setTokenValue(dependency, 8)

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token, value));
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
            const value = (resolve: DesignTokenResolver) => resolve(dependency) * 2;
            ancestor.setTokenValue(token, value);

            expect(descendent.getTokenValue(token)).to.equal(12);

            descendent.setTokenValue(dependency, () => 7);
            Observable.getNotifier(token).subscribe(subscriber);

            descendent.setTokenValue(dependency, () => 8)

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token, value));
            expect(ancestor.getTokenValue(token)).to.equal(12);
            expect(parent.getTokenValue(token)).to.equal(12);
            expect(descendent.getTokenValue(token)).to.equal(16);
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

            const value = (resolve: DesignTokenResolver) => resolve(dependency) * 2
            ancestor.setTokenValue(token, value);

            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(ancestor, DesignTokenMutationType.change, token, value));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.add, token, value));
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
            const value = (resolve: DesignTokenResolver) => resolve(dependency) * 2;
            ancestor.setTokenValue(token, value);
            descendent.setTokenValue(dependency, 7);
            Observable.getNotifier(token).subscribe(subscriber);
            expect(descendent.getTokenValue(token)).to.equal(14);

            descendent.deleteTokenValue(dependency);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token, value));
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
            const value = (resolve: DesignTokenResolver) => resolve(dependency) * 2;
            ancestor.setTokenValue(token, value);
            descendent.setTokenValue(dependency, () => 7);
            Observable.getNotifier(token).subscribe(subscriber);
            expect(descendent.getTokenValue(token)).to.equal(14);

            descendent.deleteTokenValue(dependency);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token, value));
            expect(ancestor.getTokenValue(token)).to.equal(12);
            expect(parent.getTokenValue(token)).to.equal(12);
            expect(descendent.getTokenValue(token)).to.equal(12);
        });
        it("should the token for ancestor, parent, and descendent nodes when parent and descendent are assigned a value that depends on the token and the ancestor's value is changed", () => {
            const token = new DesignToken<number>();
            const ancestor = createNode();
            const parent = createNode(ancestor);
            const descendent = createNode(parent);
            const { subscriber, handleChange } = createChangeHandler();

            ancestor.setTokenValue(token, 6);
            const parentValue = (resolve: DesignTokenResolver) => resolve(token) * 2;
            parent.setTokenValue(token, parentValue);
            const descendentValue = (resolve: DesignTokenResolver) => resolve(token) * 2;
            descendent.setTokenValue(token, descendentValue);
            Observable.getNotifier(token).subscribe(subscriber);

            expect(descendent.getTokenValue(token)).to.equal(6 * 2 *2);

            ancestor.setTokenValue(token, 7);
            expect(handleChange).to.have.been.called.exactly(3)
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(ancestor, DesignTokenMutationType.change, token, 7))
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(parent, DesignTokenMutationType.change, token, parentValue))
            expect(handleChange).to.have.been.nth(3).called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token, descendentValue))
            expect(ancestor.getTokenValue(token)).to.equal(7);
            expect(parent.getTokenValue(token)).to.equal(7 * 2);
            expect(descendent.getTokenValue(token)).to.equal(7 * 2 * 2);
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
            const value = (resolve: DesignTokenResolver) => resolve(dependency) * 2;
            ancestor.setTokenValue(token, value);
            descendent.setTokenValue(dependency, 7);

            Observable.getNotifier(token).subscribe(subscriber);

            parent.appendChild(descendent);

            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.add, token, value));
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
            const value = ( resolve: DesignTokenResolver ) => resolve(dependency) * 3;
            ancestorB.setTokenValue(token, value);
            descendent.setTokenValue(dependency, 7);

            Observable.getNotifier(token).subscribe(subscriber);

            parentB.appendChild(descendent);

            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.delete, token));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.add, token, value));
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

            const value = () => dependencies.value * 2;
            node.setTokenValue(token, value);
            Observable.getNotifier(token).subscribe(subscriber)

            expect(node.getTokenValue(token)).to.equal(12);

            dependencies.value = 7;

            expect(node.getTokenValue(token)).to.equal(14);
            expect(handleChange).to.have.been.called.once;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(node, DesignTokenMutationType.change, token, value));
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
            const value = (resolve: DesignTokenResolver) => observableDependency.value * 2 + resolve(dependency)
            ancestor.setTokenValue(token, value);
            descendent.setTokenValue(dependency, 8);
            Observable.getNotifier(token).subscribe(subscriber)

            expect(ancestor.getTokenValue(token)).to.equal(16);
            expect(descendent.getTokenValue(token)).to.equal(20);

            observableDependency.value = 7;

            expect(ancestor.getTokenValue(token)).to.equal(18);
            expect(descendent.getTokenValue(token)).to.equal(22);
            expect(handleChange).to.have.been.called.twice;
            expect(handleChange).to.have.been.first.called.with.exactly(token, new DesignTokenChangeRecord(ancestor, DesignTokenMutationType.change, token, value));
            expect(handleChange).to.have.been.second.called.with.exactly(token, new DesignTokenChangeRecord(descendent, DesignTokenMutationType.change, token, value));
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


        });
        describe("getting and setting derived values", () => {

        });
    })
});
