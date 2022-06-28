import { Observable, Subscriber, Updates } from "@microsoft/fast-element";
import chai, { expect } from "chai";
import spies from "chai-spies";
import { DesignTokenNode } from "./design-token-node.js";
import { DesignToken } from "./design-token.js";

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
                const token = new DesignToken<number>();
                const node = new DesignTokenNode();
                const handleChange = chai.spy(() => {})
                const subscriber: Subscriber = { handleChange }
                Observable.getNotifier(token).subscribe(subscriber);

                node.setTokenValue(token, 12);

                expect(handleChange).to.have.been.called.once;
                expect(handleChange).to.have.been.called.with(token, node);
            });

            it("that the token has changed for the node even if the value assigned is the upstream value", () => {
                const token = new DesignToken<number>();
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
                const token = new DesignToken<number>();
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
                const token = new DesignToken<number>();
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
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();

            expect(() => node.getTokenValue(token)).to.throw;
        });
        it("should not throw if the node has the token set to a value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            node.setTokenValue(token, 12);

            expect(() => node.getTokenValue(token)).not.to.throw;
        });
        it("should not throw if the parent node has the token set to a value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const parent = new DesignTokenNode();
            parent.appendChild(node)

            parent.setTokenValue(token, 12);

            expect(() => node.getTokenValue(token)).not.to.throw;
        });
        it("should not throw if an ancestor node has the token set to a value", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            const parent = new DesignTokenNode();
            const ancestor = new DesignTokenNode();
            parent.appendChild(node);
            ancestor.appendChild(parent);
            ancestor.setTokenValue(token, 12);

            expect(() => node.getTokenValue(token)).not.to.throw;
        });

        it("should return the value set for a token", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            node.setTokenValue(token, 12);

            expect(node.getTokenValue(token)).to.equal(12)
        });
        it("should return the derived value set for a token", () => {
            const token = new DesignToken<number>();
            const node = new DesignTokenNode();
            node.setTokenValue(token, () => 12);

            expect(node.getTokenValue(token)).to.equal(12)
        });

        it("should return the value set for the parent node if the value is not set for the token", () => {
            const staticToken = new DesignToken<number>();
            const derivedToken = new DesignToken<number>();
            const node = new DesignTokenNode();
            const parent = new DesignTokenNode();
            parent.appendChild(node)

            parent.setTokenValue(staticToken, 12);
            parent.setTokenValue(derivedToken, () => 11);

            expect(node.getTokenValue(staticToken)).to.equal(12);
            expect(node.getTokenValue(derivedToken)).to.equal(11);
        });

        it("should return the value set for the ancestor node if the value is not set for the token on the node or it's parent", () => {
            const staticToken = new DesignToken<number>();
            const derivedToken = new DesignToken<number>();
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

    it("should notify for a derived token at the node when a dependent token is changed for the node", () => {
        const tokenA = new DesignToken<number>();
        const tokenB = new DesignToken<number>();
        const tokenC = new DesignToken<number>();
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
        expect(node.getTokenValue(tokenC)).to.equal(52);
    });

    it("should notify for a derived token at a child when a dependent token is changed on the ancestor", () => {
        const tokenA = new DesignToken<number>();
        const tokenB = new DesignToken<number>();
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
        const tokenA = new DesignToken<number>();
        const tokenB = new DesignToken<number>();
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
        const tokenA = new DesignToken<number>();
        const tokenB = new DesignToken<number>();
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

    it("should resolve circular references from the parent node", () => {
        const token = new DesignToken<number>();
        const parent = new DesignTokenNode();
        const child = new DesignTokenNode();
        parent.appendChild(child);

        parent.setTokenValue(token, 12);
        child.setTokenValue(token, (resolve) => {
            return resolve(token) * 2;
        });

        expect(child.getTokenValue(token)).to.equal(24);
    });
    it("should error if attempting to resolve a circular reference and there is no parent to resolve from", () => {
        const token = new DesignToken<number>();
        const target = new DesignTokenNode();

        expect(() => {
            target.setTokenValue(token, (resolve) => {
                return resolve(token) * 2;
            });
        }).to.throw()
    });
    it("should error if attempting to resolve a circular reference and the parent node does not contain the value", () => {
        const token = new DesignToken<number>();
        const parent = new DesignTokenNode();
        const target = new DesignTokenNode();
        parent.appendChild(target);

        expect(() => {
            target.setTokenValue(token, (resolve) => {
                return resolve(token) * 2;
            });
        }).to.throw()
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
                const dependencies: { value: number } = {} as { value: number }
                Observable.defineProperty(dependencies, "value");
                dependencies.value = 6

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
