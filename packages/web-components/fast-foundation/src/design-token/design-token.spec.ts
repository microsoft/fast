
import { css, DOM, FASTElement, Observable } from "@microsoft/fast-element";
import { expect } from "chai";
import { DesignSystem } from "../design-system";
import { FoundationElement } from "../foundation-element";
import { DesignToken } from "./design-token";

new DesignSystem().register(
    FoundationElement.compose({ type: class extends FoundationElement { }, baseName: "custom-element" })()
).applyTo(document.body)

function addElement(parent = document.body): FASTElement & HTMLElement {
    const el = document.createElement("fast-custom-element") as any;
    parent.appendChild(el);
    return el;
}

function removeElement(...els: HTMLElement[]) {
    els.forEach(el => {
        el.parentElement?.removeChild(el);
    })
}

describe("A DesignToken", () => {
    it("should have a createCSS() method that returns a string with the name property formatted as a CSS variable", () => {
        expect(DesignToken.create<number>("implicit").createCSS()).to.equal("var(--implicit)");
    });
    it("should have a readonly cssCustomProperty property that is the name formatted as a CSS custom property", () => {
        expect(DesignToken.create<number>("implicit").cssCustomProperty).to.equal("--implicit");
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

            await DOM.nextUpdate();

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
            })
        })
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
            await DOM.nextUpdate();

            expect(token.getValueFor(target)).to.equal(14);
            removeElement(target)
        });
        it("should get an updated value when other design tokens used in a derived property are changed", async () => {
            const target = addElement();
            const tokenA = DesignToken.create<number>("A");
            const tokenB = DesignToken.create<number>("B");

            tokenA.setValueFor(target, 6);
            tokenB.setValueFor(target, (target: HTMLElement & FASTElement) => tokenA.getValueFor(target) * 2);

            expect(tokenB.getValueFor(target)).to.equal(12);

            tokenA.setValueFor(target, 7);
            await DOM.nextUpdate();

            expect(tokenB.getValueFor(target)).to.equal(14);
            removeElement(target);
        });
        it("should use the closest value of a dependent token when getting a token for a target", async () => {
            const ancestor = addElement()
            const parent = addElement(ancestor);
            const target = addElement(parent);
            const tokenA = DesignToken.create<number>("A");
            const tokenB = DesignToken.create<number>("B");

            tokenA.setValueFor(ancestor, 7);
            tokenA.setValueFor(parent, 6);
            tokenB.setValueFor(ancestor, (target: HTMLElement & FASTElement) => tokenA.getValueFor(target) * 2);

            expect(tokenB.getValueFor(target)).to.equal(12);
            removeElement(ancestor);
        });

        it("should update value of a dependent token when getting a token for a target", async () => {
            const ancestor = addElement()
            const parent = addElement(ancestor);
            const target = addElement(parent);
            const tokenA = DesignToken.create<number>("A");
            const tokenB = DesignToken.create<number>("B");

            tokenA.setValueFor(ancestor, 7);
            tokenA.setValueFor(parent, 6);
            tokenB.setValueFor(ancestor, (target: HTMLElement & FASTElement) => tokenA.getValueFor(target) * 2);

            expect(tokenB.getValueFor(target)).to.equal(12);

            tokenA.setValueFor(parent, 7);
            await DOM.nextUpdate();

            expect(tokenB.getValueFor(target)).to.equal(14);
            removeElement(ancestor);
        });

        it("should get an updated value when a used design token is set for a node closer to the target", async () => {
            const ancestor = addElement()
            const parent = addElement(ancestor);
            const target = addElement(parent);
            const tokenA = DesignToken.create<number>("A");
            const tokenB = DesignToken.create<number>("B");

            tokenA.setValueFor(ancestor, 6);
            tokenB.setValueFor(ancestor, (target: HTMLElement & FASTElement) => tokenA.getValueFor(target) * 2);

            expect(tokenB.getValueFor(target)).to.equal(12);

            tokenA.setValueFor(target, 7);
            await DOM.nextUpdate();

            expect(tokenB.getValueFor(target)).to.equal(14);
            removeElement(ancestor);
        });
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
        })
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

        it("should cause dependent tokens to re-evaluate", async () => {
            const tokenA = DesignToken.create<number>("A");
            const tokenB = DesignToken.create<number>("B");
            const parent = addElement();
            const target = addElement(parent);

            tokenA.setValueFor(parent, 7);
            tokenA.setValueFor(target, 6);
            tokenB.setValueFor(target, (element) => tokenA.getValueFor(element) * 2);

            expect(tokenB.getValueFor(target)).to.equal(12);

            tokenA.deleteValueFor(target);

            await DOM.nextUpdate();
            expect(tokenB.getValueFor(target)).to.equal(14);
            removeElement(parent)
        })
    });

    describe("setting CSS Custom Properties", () => {
        describe("to static token values", () => {
            it("should emit the value set for an element when emitted to the same element", () => {
                const target = addElement();
                const token = DesignToken.create<number>("test");
                token.setValueFor(target, 12)

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");
                removeElement(target);
            });

            it("should emit the value set for an element ancestor", () => {
                const ancestor = addElement()
                const target = addElement(ancestor);
                const token = DesignToken.create<number>("test");
                token.setValueFor(ancestor, 12)

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");
                removeElement(ancestor);
            });

            it("should emit the value set for an nearest element ancestor", () => {
                const grandparent = addElement();
                const parent = addElement(grandparent);
                const target = addElement(parent);
                const token = DesignToken.create<number>("test");
                token.setValueFor(grandparent, 12)
                token.setValueFor(parent, 14)
                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("14");
                removeElement(grandparent);
            });

            it("should emit the value set for the element when a value is set for both the element and an ancestor", () => {
                const ancestor = addElement()
                const target = addElement(ancestor);
                const token = DesignToken.create<number>("test");
                token.setValueFor(ancestor, 12)
                token.setValueFor(target, 14)

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("14");
                removeElement(ancestor);
            });

            it("should update the CSS custom property value for an element when the value changes for that element", async () => {
                const target = addElement();
                const token = DesignToken.create<number>("test");
                token.setValueFor(target, 12)

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");

                token.setValueFor(target, 14);
                await DOM.nextUpdate()

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("14");
                removeElement(target);
            });

            it("should update the CSS custom property value for an element when the value changes for an ancestor node", () => {
                const parent = addElement()
                const target = addElement(parent);
                const token = DesignToken.create<number>("test");
                token.setValueFor(parent, 12)

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");

                token.setValueFor(parent, 14);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("14");
                removeElement(parent);
            });

        })

        describe("to dynamic token values", () => {
            it("should emit the value set for an element when emitted to the same element", () => {
                const target = addElement();
                const token = DesignToken.create<number>("test");
                token.setValueFor(target, () => 12)

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");
                removeElement(target);
            });

            it("should emit the value set for an element ancestor", () => {
                const ancestor = addElement()
                const target = addElement(ancestor);
                const token = DesignToken.create<number>("test");
                token.setValueFor(ancestor, () => 12)

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");
                removeElement(ancestor);
            });

            it("should emit the value set for an nearest element ancestor", () => {
                const grandparent = addElement();
                const parent = addElement(grandparent);
                const target = addElement(parent);
                const token = DesignToken.create<number>("test");
                token.setValueFor(grandparent, () => 12)
                token.setValueFor(parent, () => 14)
                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("14");
                removeElement(grandparent);
            });

            it("should emit the value set for the element when a value is set for both the element and an ancestor", () => {
                const ancestor = addElement()
                const target = addElement(ancestor);
                const token = DesignToken.create<number>("test");
                token.setValueFor(ancestor, () => 12)
                token.setValueFor(target, () => 14)

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("14");
                removeElement(ancestor);
            });

            it("should update the CSS custom property value for an element when the value changes for that element", async () => {
                const target = addElement();
                const token = DesignToken.create<number>("test");
                token.setValueFor(target, () => 12)

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");

                token.setValueFor(target, () => 14);
                await DOM.nextUpdate()

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("14");
                removeElement(target);
            });

            it("should update the CSS custom property value for an element when the value changes for an ancestor node", () => {
                const parent = addElement()
                const target = addElement(parent);
                const token = DesignToken.create<number>("test");
                token.setValueFor(parent, () => 12)

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");

                token.setValueFor(parent, () => 14);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("14");
                removeElement(parent);
            });

            it("should update the CSS custom property when a value's dependent design token", async () => {
                const target = addElement();
                const dep = DesignToken.create<number>("dependency");
                const token = DesignToken.create<number>("test");
                dep.setValueFor(target, 6)
                token.setValueFor(target, (element) => dep.getValueFor(element) * 2);

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");

                dep.setValueFor(target, 7);

                await DOM.nextUpdate();

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("14");
            });
        });

        describe("to DesignToken values", () => {
            it("should emit the CSS custom property with a value of the token's value", () => {
                const tokenA = DesignToken.create<number>("token-a");
                const tokenB = DesignToken.create<number>("token-b");
                const target = addElement()

                tokenA.setValueFor(target, 12);
                tokenB.setValueFor(target, tokenA);

                tokenB.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal("12");
                removeElement(target);
            });
            it("should update the CSS custom property when the value of the token changes", async () => {
                const tokenA = DesignToken.create<number>("token-a");
                const tokenB = DesignToken.create<number>("token-b");
                const target = addElement()

                tokenA.setValueFor(target, 12);
                tokenB.setValueFor(target, tokenA);

                tokenB.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal("12");

                tokenA.setValueFor(target, 14);
                await DOM.nextUpdate()

                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal("14");

                removeElement(target);
            });

            it("should update the CSS custom property of a downstream element when the token changes", async () => {
                const tokenA = DesignToken.create<number>("token-a");
                const tokenB = DesignToken.create<number>("token-b");
                const parent = addElement()
                const target = addElement(parent);

                tokenA.setValueFor(parent, 12);
                tokenB.setValueFor(parent, tokenA);

                tokenB.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal("12");

                tokenA.setValueFor(parent, 14);

                await DOM.nextUpdate();
                expect(window.getComputedStyle(target).getPropertyValue(tokenB.cssCustomProperty)).to.equal("14");

                removeElement(parent);
            })
        })
    });

    describe("removing CSS Custom Properties", () => {
        it("should remove the custom property from the element", async () => {
                const target = addElement();
                const token = DesignToken.create<number>("test");
                token.setValueFor(target, 12);

                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");

                token.removeCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("");

                removeElement(target);
        });

        it("should remove the custom property from the element on the first invocation if the property has been added multiple times", () => {
                const target = addElement();
                const token = DesignToken.create<number>("test");
                token.setValueFor(target, 12);

                token.addCustomPropertyFor(target);
                token.addCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");

                token.removeCustomPropertyFor(target);

                expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("");

                removeElement(target);
        });
    });

    describe("when used as a CSSDirective", () => {
        it("should throw if now value has been set for the token", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");
            const styles = css`:host{width: calc(${token} * 1px);}`


            expect(() => target.$fastController.addStyles(styles)).to.throw()

            removeElement(target)
        })
        it("should set a CSS custom property for the element when the token is set for the element", () => {
            const target = addElement();
            const token = DesignToken.create<number>("test");
            token.setValueFor(target, 12);
            const styles = css`:host{width: calc(${token} * 1px);}`
            target.$fastController.addStyles(styles);

            expect(window.getComputedStyle(target).getPropertyValue(token.cssCustomProperty)).to.equal("12");
            removeElement(target)
        });
        it("should set a CSS custom property for the element when the token is set for an ancestor element", () => {
            const parent = addElement()
            const target = addElement(parent);
            const token = DesignToken.create<number>("test");
            token.setValueFor(parent, 12);
            const styles = css`:host{width: calc(${token} * 1px);}`
            target.$fastController.addStyles(styles);

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
    }) 
});
