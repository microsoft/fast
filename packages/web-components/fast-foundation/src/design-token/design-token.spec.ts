import { css, FASTElement, html, Observable, Updates } from "@microsoft/fast-element";
import chia, { expect } from "chai";
import { uniqueElementName } from "@microsoft/fast-element/testing";
import { CSSDesignToken, DesignToken, DesignTokenChangeRecord, DesignTokenSubscriber } from "./design-token.js";
import spies from "chai-spies";

chia.use(spies);
const elementName = uniqueElementName("token-test");

FASTElement.define(class extends FASTElement { }, {
    name: elementName,
    template: html`<slot></slot>`
});

function addElement(parent = document.body): FASTElement & HTMLElement {
    const el = document.createElement(elementName) as any;
    parent.appendChild(el);
    return el;
}

function removeElement(...els: HTMLElement[]) {
    els.forEach(el => {
        el.parentElement?.removeChild(el);
    })
}

describe("A DesignToken", () => {
    beforeEach(async () => {
        DesignToken.registerRoot();
        await Updates.next();
    });

    after(async () => {
        DesignToken.unregisterRoot();
        await Updates.next();
    });
    it("should support declared types", () => {
        const number: DesignToken<number> = DesignToken.create<number>('number');
        const nil: DesignToken<null> = DesignToken.create<null>('number');
        const bool: DesignToken<boolean> = DesignToken.create<boolean>("bool");
        const arr: DesignToken<number[]> = DesignToken.create<number[]>("arr");
        const obj: DesignToken<{}> = DesignToken.create<{}>("obj");
        class Foo { }
        const _class: DesignToken<Foo> = DesignToken.create<Foo>("class");
        const sym: DesignToken<symbol> = DesignToken.create<symbol>("symbol")
    })

    describe("that is a CSSDesignToken", () => {
        it("should have a createCSS() method that returns a string with the name property formatted as a CSS variable", () => {
            const add = () => void 0;
            expect(DesignToken.create<number>("implicit").createCSS(add)).to.equal("var(--implicit)");
        });
        it("should have a readonly cssCustomProperty property that is the name formatted as a CSS custom property", () => {
            expect(DesignToken.create<number>("implicit").cssCustomProperty).to.equal("--implicit");
        });
        it("should have a cssCustomProperty property that aligns with a provided cssCustomPropertyName configuration", () => {
            expect(DesignToken.create<number>({name: "name", cssCustomPropertyName: "css-custom-property"}).cssCustomProperty).to.equal("--css-custom-property")
        });
    });

    describe("that is not a CSSDesignToken", () => {
        it("should not have a cssCustomProperty property", () => {
            expect("cssCustomProperty" in DesignToken.create<number>({name: "test", cssCustomPropertyName: null})).to.equal(false);
        });
        it("should not have a cssVar property", () => {
            expect("cssVar" in DesignToken.create<number>({name: "test", cssCustomPropertyName: null})).to.equal(false);
        });
    });

    describe("getting and setting a simple value", () => {
        it("should throw if the token value has never been set on the element or it's any ancestors", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");

            expect(() => token.getValueFor(target)).to.throw();
            removeElement(target);
        });

        it("should return the value set for the element if one has been set", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");
            token.setValueFor(target, 12);

            expect(token.getValueFor(target)).to.equal(12);
            removeElement(target);
        });

        it("should return the value set for an ancestor if a value has not been set for the target", () => {
            const ancestor = addElement();
            const target = addElement(ancestor);
            const token = DesignToken.create<number>("test");
            token.setValueFor(ancestor, 12);

            expect(token.getValueFor(target)).to.equal(12);
            removeElement(ancestor);
        });

        it("sound return the nearest ancestor's value after an intermediary value is set where no value was set prior", async () => {
            const grandparent = addElement();
            const parent = addElement(grandparent);
            const target = addElement(parent);

            const token = DesignToken.create<number>("test");

            token.setValueFor(grandparent, 12);

            expect(token.getValueFor(target)).to.equal(12);

            token.setValueFor(parent, 14);

            await Updates.next();

            expect(token.getValueFor(target)).to.equal(14);
            removeElement(grandparent);
        });

        it("should return the new ancestor's value after being re-parented", async () => {
            const parentA = addElement();
            const parentB = addElement();
            const target = addElement(parentA);
            const token = DesignToken.create<number>("test");

            token.setValueFor(parentA, 12);
            token.setValueFor(parentB, 14);

            expect(token.getValueFor(target)).to.equal(12);
            parentA.removeChild(target);
            parentB.appendChild(target);

            expect(token.getValueFor(target)).to.equal(14);

            removeElement(parentA, parentB);
        });

        it("should support getting and setting falsey values", () => {
            const target = addElement();
            [false, null, 0, "", NaN].forEach(value => {

                const token = DesignToken.create<typeof value>("test");
                token.setValueFor(target, value);

                if (typeof value === "number" && isNaN(value)) {
                    expect(isNaN(token.getValueFor(target) as number)).to.equal(true)
                } else {
                    expect(token.getValueFor(target)).to.equal(value);
                }
            });

            removeElement(target);
        });

        describe("that is a CSSDesignToken", () => {
            it("should set the CSS custom property for the element", async () => {
                const target = addElement();
                const token = DesignToken.create<number>("test");
                token.setValueFor(target, 12);
                await Updates.next();
                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal('12');
                removeElement(target)
            });
        });
        describe("that is not a CSSDesignToken", () => {
            it("should not set a CSS custom property for the element", () => {
                const target = addElement();
                const token = DesignToken.create<number>({ name: "test", cssCustomPropertyName: null });
                token.setValueFor(target, 12);
                expect(window.getComputedStyle(target).getPropertyValue(("--test"))).to.equal('');
                removeElement(target)
            });
        });
    });
    describe("getting and setting derived values", () => {
        it("should get the return value of a derived value", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");
            token.setValueFor(target, () => 12);

            expect(token.getValueFor(target)).to.equal(12);
            removeElement(target)
        });
        it("should get an updated value when observable properties used in a derived property are changed", async () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");
            const dependencies: { value: number } = {} as { value: number }
            Observable.defineProperty(dependencies, "value");
            dependencies.value = 6

            token.setValueFor(target, () => dependencies.value * 2);

            expect(token.getValueFor(target)).to.equal(12);

            dependencies.value = 7;
            await Updates.next();

            expect(token.getValueFor(target)).to.equal(14);
            removeElement(target)
        });
        it("should get an updated value when other design tokens used in a derived property are changed", async () => {
            const target = addElement();
            const tokenA = DesignToken.create<number>("A");
            const tokenB = DesignToken.create<number>("B");

            tokenA.setValueFor(target, 6);
            tokenB.setValueFor(target, (target) => tokenA.getValueFor(target) * 2);

            expect(tokenB.getValueFor(target)).to.equal(12);

            tokenA.setValueFor(target, 7);
            await Updates.next();

            expect(tokenB.getValueFor(target)).to.equal(14);
            removeElement(target);
        });
        it("should use the closest value of a dependent token when getting a token for a target", () => {
            const ancestor = addElement()
            const parent = addElement(ancestor);
            const target = addElement(parent);
            const tokenA = DesignToken.create<number>("A");
            const tokenB = DesignToken.create<number>("B");

            tokenA.setValueFor(ancestor, 7);
            tokenA.setValueFor(parent, 6);
            tokenB.setValueFor(ancestor, (target) => tokenA.getValueFor(target) * 2);

            const value = tokenB.getValueFor(target);
            expect(value).to.equal(12);
            removeElement(ancestor, parent, target);
        });

        it("should update value of a dependent token when getting a token for a target", async () => {
            const ancestor = addElement()
            const parent = addElement(ancestor);
            const target = addElement(parent);
            const tokenA = DesignToken.create<number>("A");
            const tokenB = DesignToken.create<number>("B");

            tokenA.setValueFor(ancestor, 7);
            tokenA.setValueFor(parent, 6);
            tokenB.setValueFor(ancestor, (target ) => tokenA.getValueFor(target) * 2);

            expect(tokenB.getValueFor(target)).to.equal(12);

            tokenA.setValueFor(parent, 7);
            await Updates.next();

            expect(tokenB.getValueFor(target)).to.equal(14);
            removeElement(ancestor);
        });

        it("should get an updated value when a used design token is set for a node closer to the target", () => {
            const ancestor = addElement()
            const parent = addElement(ancestor);
            const target = addElement(parent);
            const tokenA = DesignToken.create<number>("A");
            const tokenB = DesignToken.create<number>("B");

            tokenA.setValueFor(ancestor, 6);
            tokenB.setValueFor(ancestor, (target) => tokenA.getValueFor(target) * 2);

            expect(tokenB.getValueFor(target)).to.equal(12);

            tokenA.setValueFor(target, 7);

            expect(tokenB.getValueFor(target)).to.equal(14);
            removeElement(ancestor);
        });

        describe("that is a CSSDesignToken", () => {
            it("should set a CSS custom property equal to the resolved value of a derived token value", async () => {
                const target = addElement();
                const token = DesignToken.create<number>("test");

                token.setValueFor(target, (target) => 12);

                await Updates.next();
                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal('12');

                removeElement(target);
            });
            it("should set a CSS custom property equal to the resolved value of a derived token value with a dependent token", async () => {
                const target = addElement();
                const tokenA = DesignToken.create<number>("A");
                const tokenB = DesignToken.create<number>("B");

                tokenA.setValueFor(target, 6);
                tokenB.setValueFor(target, (target) => tokenA.getValueFor(target) * 2);

                await Updates.next();

                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('12');
                removeElement(target);
            });

            it("should update a CSS custom property to the resolved value of a derived token value with a dependent token when the dependent token changes", async () => {
                const target = addElement();
                const tokenA = DesignToken.create<number>("A");
                const tokenB = DesignToken.create<number>("B");

                tokenA.setValueFor(target, 6);
                tokenB.setValueFor(target, (target) => tokenA.getValueFor(target) * 2);

                await Updates.next();
                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('12');

                tokenA.setValueFor(target, 7);
                await Updates.next();
                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('14');

                removeElement(target);
            });

            it("should set a CSS custom property equal to the resolved value for an element of a derived token value with a dependent token", async () => {
                const parent = addElement();
                const target = addElement(parent);
                const tokenA = DesignToken.create<number>("A");
                const tokenB = DesignToken.create<number>("B");

                tokenA.setValueFor(parent, 6);
                tokenB.setValueFor(parent, (target) => tokenA.getValueFor(target) * 2);
                tokenA.setValueFor(target, 7);

                await Updates.next();

                expect(window.getComputedStyle(parent).getPropertyValue(tokenB.cssCustomProperty)).to.equal('12');
                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('14');
                removeElement(parent);
            });

            it("should set a CSS custom property equal to the resolved value for an element in a shadow DOM of a derived token value with a dependent token", async () => {
                const parent = addElement();
                const child = addElement(parent);
                const target = document.createElement("div");
                child.shadowRoot!.appendChild(target);
                const tokenA = DesignToken.create<number>("A");
                const tokenB = DesignToken.create<number>("B");

                tokenA.setValueFor(parent, 6);
                tokenB.setValueFor(parent, (target) => tokenA.getValueFor(target) * 2);
                tokenA.setValueFor(target, 7);

                await Updates.next();

                expect(window.getComputedStyle(parent).getPropertyValue(tokenB.cssCustomProperty)).to.equal('12');
                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('14');
                removeElement(parent);
            });

            it("should set a CSS custom property equal to the resolved value for both elements for which a dependent token is set when setting a derived token value", async () => {
                const parent = addElement();
                const target = addElement(parent);
                const tokenA = DesignToken.create<number>("A");
                const tokenB = DesignToken.create<number>("B");

                tokenA.setValueFor(parent, 6);
                tokenA.setValueFor(target, 7);
                tokenB.setValueFor(parent, (target) => tokenA.getValueFor(target) * 2);

                await Updates.next();

                expect(window.getComputedStyle(parent).getPropertyValue(tokenB.cssCustomProperty)).to.equal('12');
                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal('14');
                removeElement(parent);
            });

            it("should revert a CSS custom property back to a previous value when the Design Token value is reverted", async () => {
                const token = DesignToken.create<number>("test");
                const target = addElement();

                token.setValueFor(target, 12);
                await Updates.next();
                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal('12');

                token.setValueFor(target, 14);
                await Updates.next();
                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal('14');

                token.setValueFor(target, 12);
                await Updates.next();
                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal('12');
            })
        });

        describe("that is not a CSSDesignToken", () => {
            it("should not emit a CSS custom property", () => {
                const target = addElement();
                const token = DesignToken.create<number>({name: "test", cssCustomPropertyName: null});

                token.setValueFor(target, (target) => 12);

                expect(window.getComputedStyle(target).getPropertyValue('--test')).to.equal('');

                removeElement(target);
            })
        })

        it("should support getting and setting falsey values", () => {
            const target = addElement();
            [false, null, 0, "", NaN].forEach(value => {

                const token = DesignToken.create<typeof value>("test");
                token.setValueFor(target, () => value as any);

                if (typeof value === "number" && isNaN(value)) {
                    expect(isNaN(token.getValueFor(target) as number)).to.equal(true)
                } else {
                    expect(token.getValueFor(target)).to.equal(value);
                }
            })
            removeElement(target)
        });
    });

    describe("getting and setting a token value", () => {
        it("should retrieve the value of the token it was set to", () => {
            const tokenA = DesignToken.create<number>("token-a");
            const tokenB = DesignToken.create<number>("token-b");
            const target = addElement();

            tokenA.setValueFor(target, 12);
            tokenB.setValueFor(target, tokenA);

            expect(tokenB.getValueFor(target)).to.equal(12);

            removeElement(target);
        });
        it("should update the value of the token it was set to when the token's value changes", () => {
            const tokenA = DesignToken.create<number>("token-a");
            const tokenB = DesignToken.create<number>("token-b");
            const target = addElement();

            tokenA.setValueFor(target, 12);
            tokenB.setValueFor(target, tokenA);

            expect(tokenB.getValueFor(target)).to.equal(12);

            tokenA.setValueFor(target, 14);

            expect(tokenB.getValueFor(target)).to.equal(14);

            removeElement(target);
        });
        it("should update the derived value of the token when a dependency of the derived value changes", () => {
            const tokenA = DesignToken.create<number>("token-a");
            const tokenB = DesignToken.create<number>("token-b");
            const tokenC = DesignToken.create<number>("token-b");
            const target = addElement();

            tokenA.setValueFor(target, 6);
            tokenB.setValueFor(target, (target) => tokenA.getValueFor(target) * 2);
            tokenC.setValueFor(target, tokenB);

            expect(tokenC.getValueFor(target)).to.equal(12);

            tokenA.setValueFor(target, 7);

            expect(tokenC.getValueFor(target)).to.equal(14);

            removeElement(target);
        });

        describe("that is a CSSDesignToken", () => {
            it("should emit a CSS custom property", () => {
                const tokenA = DesignToken.create<number>("token-a");
                const tokenB = DesignToken.create<number>("token-b");
                const target = addElement();

                tokenA.setValueFor(target, 12);
                tokenB.setValueFor(target, tokenA);

                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal("12");

                removeElement(target);
            });
            it("should update the emitted CSS custom property when the token's value changes", async () => {
                const tokenA = DesignToken.create<number>("token-a");
                const tokenB = DesignToken.create<number>("token-b");
                const target = addElement();

                tokenA.setValueFor(target, 12);
                tokenB.setValueFor(target, tokenA);

                await Updates.next();
                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal("12");

                tokenA.setValueFor(target, 14);

                await Updates.next();
                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal("14");

                removeElement(target);
            });
            it("should update the emitted CSS custom property of a token assigned a derived value when the token dependency changes", async () => {
                const tokenA = DesignToken.create<number>("token-a");
                const tokenB = DesignToken.create<number>("token-b");
                const tokenC = DesignToken.create<number>("token-c");
                const target = addElement();

                tokenA.setValueFor(target, 6);
                tokenB.setValueFor(target, (target) => tokenA.getValueFor(target) * 2);
                tokenC.setValueFor(target, tokenB);

                await Updates.next();
                expect(window.getComputedStyle(target).getPropertyValue(tokenC.cssCustomProperty)).to.equal("12");

                tokenA.setValueFor(target, 7);

                await Updates.next();
                expect(window.getComputedStyle(target).getPropertyValue(tokenC.cssCustomProperty)).to.equal("14");

                removeElement(target);
            });

            it("should support accessing the token for being assigned from the derived value", () => {
                const tokenA = DesignToken.create<number>("token-a");
                const parent = addElement();
                const child = addElement(parent);
                tokenA.withDefault(6);
                const recipe = (el: HTMLElement) => tokenA.getValueFor(el.parentElement!) * 2;
                tokenA.setValueFor(parent, recipe);
                tokenA.setValueFor(child, recipe);

                expect(tokenA.getValueFor(parent)).to.equal(12);
                expect(tokenA.getValueFor(child)).to.equal(24);
            })
        });
        it("should update the CSS custom property of a derived token with a dependency that is a derived token that depends on a third token", async () => {
                const tokenA = DesignToken.create<number>("token-a");
                const tokenB = DesignToken.create<number>("token-b");
                const tokenC = DesignToken.create<number>("token-c");
                const grandparent = addElement()
                const parent = addElement(grandparent);
                const child = addElement(parent);

                tokenA.setValueFor(grandparent, 3);
                tokenB.setValueFor(grandparent, (el: HTMLElement) => tokenA.getValueFor(el) * 2);
                tokenC.setValueFor(grandparent, (el) => tokenB.getValueFor(el) * 2)

                await Updates.next();

                expect(tokenC.getValueFor(child)).to.equal(12);
                expect(window.getComputedStyle(child).getPropertyValue(tokenC.cssCustomProperty)).to.equal("12");

                tokenA.setValueFor(child, 4);

                await Updates.next();
                expect(tokenC.getValueFor(child)).to.equal(16);
                expect(window.getComputedStyle(child).getPropertyValue(tokenC.cssCustomProperty)).to.equal("16");
        });
        it("should update tokens when an element for which a token with static dependencies is set is appended to the DOM", async () => {


            const tokenA = DesignToken.create<number>("token-a");
            const tokenB = DesignToken.create<number>("token-b");

            tokenA.withDefault(6);
            tokenB.withDefault(el => tokenA.getValueFor(el) * 2);

            const element = document.createElement(elementName);

            tokenA.setValueFor(element, 7);

            document.body.appendChild(element);

            await Updates.next();

            expect(window.getComputedStyle(element).getPropertyValue(tokenB.cssCustomProperty)).to.equal('14');
        });
        it("should update tokens and notify when an element for which a token with dynamic dependencies is set is appended to the DOM", async () => {
            const tokenA = DesignToken.create<number>("token-a");
            const tokenB = DesignToken.create<number>("token-b");

            tokenA.withDefault(() => 6);
            tokenB.withDefault(el => tokenA.getValueFor(el) * 2);

            const parent = document.createElement(elementName);
            const child = document.createElement(elementName);
            parent.appendChild(child);

            const handleChange = chia.spy(() => {});
            const subscriber = { handleChange };
            expect(tokenB.getValueFor(child)).to.equal(12);

            tokenB.subscribe(subscriber, child);

            document.body.appendChild(parent);

            await Updates.next();

            expect(handleChange).not.to.have.been.called();

            tokenA.setValueFor(parent, () => 7);
            expect(tokenB.getValueFor(child)).to.equal(14);
            await Updates.next();
            expect(handleChange).to.have.been.called.once;
        });
        it("should notify a subscriber for a token after being appended to a parent with a different token value than the previous context", async () => {
            const tokenA = DesignToken.create<number>("token-a");
            const tokenB = DesignToken.create<number>("token-b");

            tokenA.withDefault(() => 6);
            tokenB.withDefault(el => tokenA.getValueFor(el) * 2);

            const parent = document.createElement(elementName);
            const child = document.createElement(elementName);
            document.body.appendChild(parent);
            tokenA.setValueFor(parent, () => 7);

            const handleChange = chia.spy(() => {});
            const subscriber = { handleChange };

            expect(tokenB.getValueFor(child)).to.equal(12);
            tokenB.subscribe(subscriber, child);

            expect(handleChange).not.to.have.been.called()
            parent.appendChild(child);

            expect(tokenB.getValueFor(child)).to.equal(14);
            expect(handleChange).to.have.been.called.once
        });
        it("should notify a subscriber for a token after being appended to a parent with a different token value than the previous context", async () => {
            const tokenA = DesignToken.create<number>("token-a");
            tokenA.withDefault(6);

            const parent = document.createElement(elementName);
            const child = document.createElement(elementName);
            document.body.appendChild(parent);
            tokenA.setValueFor(parent, 7);

            const handleChange = chia.spy(() => {});
            const subscriber = { handleChange };

            expect(tokenA.getValueFor(child)).to.equal(6);
            tokenA.subscribe(subscriber, child);
            expect(handleChange).not.to.have.been.called()
            parent.appendChild(child);

            expect(handleChange).to.have.been.called.once;
            expect(tokenA.getValueFor(child)).to.equal(7);
        });
    })
    describe("deleting simple values", () => {
        it("should throw when deleted and no parent token value is set", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");

            token.setValueFor(target, 12);

            expect(token.getValueFor(target)).to.equal(12)

            token.deleteValueFor(target);

            expect(() => token.getValueFor(target)).to.throw();
            removeElement(target)
        });
        it("should allow getting a value that was set upstream", () => {
            const parent = addElement()
            const target = addElement(parent);
            const token = DesignToken.create<number>("test");

            token.setValueFor(parent, 12);
            token.setValueFor(target, 14);

            expect(token.getValueFor(target)).to.equal(14)

            token.deleteValueFor(target);

            expect(token.getValueFor(target)).to.equal(12)
            removeElement(parent)
        });
    });
    describe("deleting derived values", () => {
        it("should throw when deleted and no parent token value is set", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");

            token.setValueFor(target, () => 12);

            expect(token.getValueFor(target)).to.equal(12)

            token.deleteValueFor(target);

            expect(() => token.getValueFor(target)).to.throw();
            removeElement(target)
        });
        it("should allow getting a value that was set upstream", () => {
            const parent = addElement()
            const target = addElement(parent);
            const token = DesignToken.create<number>("test");

            token.setValueFor(parent, () => 12);
            token.setValueFor(target, () => 14);

            expect(token.getValueFor(target)).to.equal(14)

            token.deleteValueFor(target);

            expect(token.getValueFor(target)).to.equal(12)
            removeElement(parent)
        });

        it("should cause dependent tokens to re-evaluate", () => {
            const tokenA = DesignToken.create<number>("A");
            const tokenB = DesignToken.create<number>("B");
            const parent = addElement();
            const target = addElement(parent);

            tokenA.setValueFor(parent, 7);
            tokenA.setValueFor(target, 6);
            tokenB.setValueFor(target, (element) => tokenA.getValueFor(element) * 2);

            expect(tokenB.getValueFor(target)).to.equal(12);

            tokenA.deleteValueFor(target);

            expect(tokenB.getValueFor(target)).to.equal(14);
            removeElement(parent)
        })
    });

    describe("when used as a CSSDirective", () => {
        it("should set a CSS custom property for the element when the token is set for the element", async () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");
            token.setValueFor(target, 12);
            const styles = css`:host{width: calc(${token} * 1px);}`
            target.$fastController.addStyles(styles);

            await Updates.next();
            expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");
            removeElement(target)
        });
        it("should set a CSS custom property for the element when the token is set for an ancestor element", async () => {
            const parent = addElement()
            const target = addElement(parent);
            const token = DesignToken.create<number>("test");
            token.setValueFor(parent, 12);
            const styles = css`:host{width: calc(${token} * 1px);}`
            target.$fastController.addStyles(styles);

            await Updates.next();
            expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");
            removeElement(parent)
        })
    });

    describe("with a default value set", () => {
        it("should return the default value if no value is set for a target", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");
            token.withDefault(2)

            expect(token.getValueFor(target)).to.equal(2);
            removeElement(target)
        });
        it("should return the default value for a descendent if no value is set for a target", () => {
            const parent = addElement()
            const target = addElement(parent);
            const token = DesignToken.create<number>("test");
            token.withDefault(2)

            expect(token.getValueFor(target)).to.equal(2);
            removeElement(parent)
        });
        it("should return the value set and not the default if value is set", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");
            token.withDefault(4)
            token.setValueFor(target, 2)

            expect(token.getValueFor(target)).to.equal(2);
            removeElement(target)
        });
        it("should get a new default value if a new default is provided", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");
            token.withDefault(2);
            token.withDefault(4);

            expect(token.getValueFor(target)).to.equal(4);
            removeElement(target)
        });
    });

    describe("with subscribers", () => {
        it("should notify an un-targeted subscriber when the value changes for any element", () => {
            const ancestor = addElement();
            const parent = addElement(ancestor);
            const target = addElement(parent);
            const token = DesignToken.create<number>("test");
            const spy = new Map<HTMLElement, boolean>([[ancestor, false], [parent, false], [ target, false ]]);

            const subscriber: DesignTokenSubscriber<typeof token>  = {
                handleChange(record: DesignTokenChangeRecord<typeof token>) {
                    spy.set(record.target, true)
                }
            }

            token.subscribe(subscriber);

            expect(spy.get(ancestor)).to.be.false;
            expect(spy.get(parent)).to.be.false;
            expect(spy.get(target)).to.be.false;

            token.setValueFor(ancestor, 12);
            expect(spy.get(ancestor)).to.be.true;
            expect(spy.get(parent)).to.be.false;
            expect(spy.get(target)).to.be.false;

            token.setValueFor(parent, 14);
            expect(spy.get(ancestor)).to.be.true;
            expect(spy.get(parent)).to.be.true;
            expect(spy.get(target)).to.be.false;

            token.setValueFor(target, 16);
            expect(spy.get(target)).to.be.true;
            expect(spy.get(parent)).to.be.true;
            expect(spy.get(target)).to.be.true;

            removeElement(ancestor);
        });
        it("should notify a target-subscriber if the value is changed for the provided target", () => {
                const parent = addElement();
                const target = addElement(parent);
                const token = DesignToken.create<number>("test");

                const handleChange = chia.spy(() => {});
                const subscriber: DesignTokenSubscriber<typeof token>  = {
                    handleChange
                }

                token.subscribe(subscriber, target);

                token.setValueFor(parent, 12);
                expect(handleChange).to.have.been.called.once;

                token.setValueFor(target, 14);
                expect(handleChange).to.have.been.called.twice;

                removeElement(parent);
        });

        it("should not notify a subscriber after unsubscribing", () => {
            let invoked = false;
            const target = addElement();
            const token = DesignToken.create<number>("test");

            const subscriber: DesignTokenSubscriber<typeof token>  = {
                handleChange(record: DesignTokenChangeRecord<typeof token>) {
                    invoked = true;
                }
            }

            token.subscribe(subscriber);
            token.unsubscribe(subscriber);

            token.setValueFor(target, 12);
            expect(invoked).to.be.false;

            removeElement(target);
        });

        it("should infer DesignToken and CSSDesignToken token types on subscription record", () => {
            type AssertCSSDesignToken<T> = T extends CSSDesignToken<any> ? T : never;
            DesignToken.create<number>("css").subscribe({handleChange(record) {
                const test: AssertCSSDesignToken<typeof record.token> = record.token;
            }});

            type AssertDesignToken<T> = T extends CSSDesignToken<any> ? never : T;

            DesignToken.create<number>({name: "no-css", cssCustomPropertyName: null}).subscribe({handleChange(record) {
                const test: AssertDesignToken<typeof record.token> = record.token;
            }})
        });

        it("should notify a subscriber when a dependency of a subscribed token changes", async () => {
            const tokenA = DesignToken.create<number>("a");
            const tokenB = DesignToken.create<number>("b");

            tokenA.withDefault(6);
            tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);

            const handleChange = chia.spy(() => {})
            const subscriber = {
                handleChange
            }


            tokenB.subscribe(subscriber);

            tokenA.withDefault(7);
            await Updates.next();
            expect(handleChange).to.have.been.called();
        });

        it("should notify a subscriber when a dependency of a dependency of a subscribed token changes", async () => {
            const tokenA = DesignToken.create<number>("a");
            const tokenB = DesignToken.create<number>("b");
            const tokenC = DesignToken.create<number>("c");

            tokenA.withDefault(6);
            tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);
            tokenC.withDefault((el) => tokenB.getValueFor(el) * 2);

            const handleChange = chia.spy(() => {})
            const subscriber = {
                handleChange
            }


            tokenC.subscribe(subscriber);

            tokenA.withDefault(7);
            await Updates.next();
            expect(handleChange).to.have.been.called()
        });

        it("should notify a subscriber when a dependency changes for an element down the DOM tree", async () => {
            const tokenA = DesignToken.create<number>("a");
            const tokenB = DesignToken.create<number>("b");

            const target = addElement();

            tokenA.withDefault(6);
            tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);

            const handleChange = chia.spy(() => {})
            const subscriber = {
                handleChange
            }


            tokenB.subscribe(subscriber);

            tokenA.setValueFor(target, 7);
            await Updates.next();
            expect(handleChange).to.have.been.called();
        })
        it("should notify a subscriber when a static-value dependency of subscribed token changes for a parent of the subscription target", async () => {
            const tokenA = DesignToken.create<number>("a");
            const tokenB = DesignToken.create<number>("b");

            const parent = addElement();
            const target = addElement(parent)

            tokenA.withDefault(6);
            tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);

            const handleChange = chia.spy(() => {})
            const subscriber = {
                handleChange
            }


            tokenB.subscribe(subscriber, target);

            tokenA.setValueFor(parent, 7);
            await Updates.next();
            expect(handleChange).to.have.been.called();
            expect(tokenB.getValueFor(target)).to.equal(14)
        });
        it("should notify a subscriber when a derived-value dependency of subscribed token changes for a parent of the subscription target", async () => {
            const tokenA = DesignToken.create<number>("a");
            const tokenB = DesignToken.create<number>("b");

            const parent = addElement();
            const target = addElement(parent)

            tokenA.withDefault(() => 6);
            tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);

            const handleChange = chia.spy(() => {})
            const subscriber = {
                handleChange
            }


            tokenB.subscribe(subscriber, target);

            tokenA.setValueFor(parent, () => 7);
            await Updates.next();
            expect(handleChange).to.have.been.called();
            expect(tokenB.getValueFor(target)).to.equal(14)
        });
        it("should notify a subscriber when a dependency of subscribed token changes for a parent of the subscription target", async () => {
            const tokenA = DesignToken.create<number>("a");
            const tokenB = DesignToken.create<number>("b");

            const grandparent = addElement();
            const parent = addElement(grandparent)
            const child = addElement(parent)

            tokenA.withDefault(() => 6);
            tokenB.withDefault((el) => tokenA.getValueFor(el) * 2);

            const handleChange = chia.spy(() => {})
            const subscriber = {
                handleChange
            }


            tokenB.subscribe(subscriber, child);

            tokenA.setValueFor(grandparent, () => 7);
            await Updates.next();
            expect(handleChange).to.have.been.called();
        });
    });

    describe("with root registration", () => {
        it("should not emit CSS custom properties for the default value", () => {
            DesignToken.unregisterRoot();
            const token = DesignToken.create<number>('default-no-root').withDefault(12);
            const styles = window.getComputedStyle(document.body);

            expect(styles.getPropertyValue(token.cssCustomProperty)).to.equal("");
        });

        it("should emit CSS custom properties for the default value when a design token root is registered", async () => {
            const token = DesignToken.create<number>('default-with-root').withDefault(12);
            const styles = window.getComputedStyle(document.body);

            DesignToken.registerRoot();

            await Updates.next();

            expect(styles.getPropertyValue(token.cssCustomProperty)).to.equal("12");
            DesignToken.unregisterRoot();
        });

        it("should remove emitted CSS custom properties for a root when the root is deregistered", async () => {
            const token = DesignToken.create<number>('deregistered-root').withDefault(12);
            const styles = window.getComputedStyle(document.body);

            DesignToken.registerRoot();

            await Updates.next();

            expect(styles.getPropertyValue(token.cssCustomProperty)).to.equal("12");
            DesignToken.unregisterRoot();

            await Updates.next();

            expect(styles.getPropertyValue(token.cssCustomProperty)).to.equal("");
        });

        it("should emit CSS custom properties to an element when the element is provided as a root", async () => {
            const token = DesignToken.create<number>('default-with-element-root').withDefault(12);
            const element = addElement();

            DesignToken.registerRoot(element);

            await Updates.next();
            const styles = window.getComputedStyle(element);

            expect(styles.getPropertyValue(token.cssCustomProperty)).to.equal("12");
            DesignToken.unregisterRoot(element);
        });
        it("should emit CSS custom properties to multiple roots", async () => {
            DesignToken.unregisterRoot();
            const token = DesignToken.create<number>('default-with-multiple-roots').withDefault(12);
            const a = addElement();
            const b = addElement();

            DesignToken.registerRoot(a);
            await Updates.next();

            expect(window.getComputedStyle(a).getPropertyValue(token.cssCustomProperty)).to.equal("12");
            expect(window.getComputedStyle(b).getPropertyValue(token.cssCustomProperty)).to.equal("");
            expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("");

            DesignToken.registerRoot(b);
            await Updates.next();
            expect(window.getComputedStyle(a).getPropertyValue(token.cssCustomProperty)).to.equal("12");
            expect(window.getComputedStyle(b).getPropertyValue(token.cssCustomProperty)).to.equal("12");
            expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("");

            DesignToken.registerRoot();
            await Updates.next();
            expect(window.getComputedStyle(a).getPropertyValue(token.cssCustomProperty)).to.equal("12");
            expect(window.getComputedStyle(b).getPropertyValue(token.cssCustomProperty)).to.equal("12");
            expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("12");
        });
    });
});
