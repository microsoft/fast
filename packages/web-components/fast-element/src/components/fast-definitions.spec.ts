import { expect } from "chai";
import { FASTElementDefinition } from "./fast-definitions.js";
import { ElementStyles } from "../styles/element-styles.js";
import { uniqueElementName } from "../testing/fixture.js";
import { FASTElement } from "./fast-element.js";

describe("FASTElementDefinition", () => {
    class MyElement extends HTMLElement {}

    context("styles", () => {
        it("can accept a string", () => {
            const styles = ".class { color: red; }";
            const options = {
                name: "test-element",
                styles,
            };

            const def = FASTElementDefinition.compose(MyElement, options);
            expect(def.styles!.styles).to.contain(styles);
        });

        it("can accept multiple strings", () => {
            const css1 = ".class { color: red; }";
            const css2 = ".class2 { color: red; }";
            const options = {
                name: "test-element",
                styles: [css1, css2],
            };
            const def = FASTElementDefinition.compose(MyElement, options);
            expect(def.styles!.styles).to.contain(css1);
            expect(def.styles!.styles.indexOf(css1)).to.equal(0);
            expect(def.styles!.styles).to.contain(css2);
        });

        it("can accept ElementStyles", () => {
            const css = ".class { color: red; }";
            const styles = new ElementStyles([css]);
            const options = {
                name: "test-element",
                styles,
            };
            const def = FASTElementDefinition.compose(MyElement, options);
            expect(def.styles).to.equal(styles);
        });

        it("can accept multiple ElementStyles", () => {
            const css1 = ".class { color: red; }";
            const css2 = ".class2 { color: red; }";
            const existingStyles1 = new ElementStyles([css1]);
            const existingStyles2 = new ElementStyles([css2]);
            const options = {
                name: "test-element",
                styles: [existingStyles1, existingStyles2],
            };
            const def = FASTElementDefinition.compose(MyElement, options);
            expect(def.styles!.styles).to.contain(existingStyles1);
            expect(def.styles!.styles.indexOf(existingStyles1)).to.equal(0);
            expect(def.styles!.styles).to.contain(existingStyles2);
        });

        it("can accept mixed strings and ElementStyles", () => {
            const css1 = ".class { color: red; }";
            const css2 = ".class2 { color: red; }";
            const existingStyles2 = new ElementStyles([css2]);
            const options = {
                name: "test-element",
                styles: [css1, existingStyles2],
            };
            const def = FASTElementDefinition.compose(MyElement, options);
            expect(def.styles!.styles).to.contain(css1);
            expect(def.styles!.styles.indexOf(css1)).to.equal(0);
            expect(def.styles!.styles).to.contain(existingStyles2);
        });

        if (ElementStyles.supportsAdoptedStyleSheets) {
            it("can accept a CSSStyleSheet", () => {
                const styles = new CSSStyleSheet();
                const options = {
                    name: "test-element",
                    styles,
                };
                const def = FASTElementDefinition.compose(MyElement, options);
                expect(def.styles!.styles).to.contain(styles);
            });

            it("can accept multiple CSSStyleSheets", () => {
                const styleSheet1 = new CSSStyleSheet();
                const styleSheet2 = new CSSStyleSheet();
                const options = {
                    name: "test-element",
                    styles: [styleSheet1, styleSheet2],
                };
                const def = FASTElementDefinition.compose(MyElement, options);
                expect(def.styles!.styles).to.contain(styleSheet1);
                expect(def.styles!.styles.indexOf(styleSheet1)).to.equal(0);
                expect(def.styles!.styles).to.contain(styleSheet2);
            });

            it("can accept mixed strings, ElementStyles, and CSSStyleSheets", () => {
                const css1 = ".class { color: red; }";
                const css2 = ".class2 { color: red; }";
                const existingStyles2 = new ElementStyles([css2]);
                const styleSheet3 = new CSSStyleSheet();
                const options = {
                    name: "test-element",
                    styles: [css1, existingStyles2, styleSheet3],
                };
                const def = FASTElementDefinition.compose(MyElement, options);
                expect(def.styles!.styles).to.contain(css1);
                expect(def.styles!.styles.indexOf(css1)).to.equal(0);
                expect(def.styles!.styles).to.contain(existingStyles2);
                expect(def.styles!.styles.indexOf(existingStyles2)).to.equal(1);
                expect(def.styles!.styles).to.contain(styleSheet3);
            });
        }
    });

    context("instance", () => {
        it("reports not defined until after define is called", () => {
            const def = FASTElementDefinition.compose(MyElement, uniqueElementName());

            expect(def.isDefined).to.be.false;

            def.define();

            expect(def.isDefined).to.be.true;
        });

        it("new definitions can be derived from an instance", () => {;
            const name = uniqueElementName();
            const def = FASTElementDefinition.compose(MyElement, `my-${name}`);
            const derivedDef = def.derive?.(`foo-${name}`);

            expect(derivedDef.isDefined).to.be.false;

            derivedDef.define();

            expect(derivedDef.isDefined).to.be.true;
        });

        it("an instance and a derived instance can both be defined", () => {
            const name = uniqueElementName();
            const def = FASTElementDefinition.compose(MyElement, `my-${name}`);

            expect(def.isDefined).to.be.false;

            def.define();

            expect(def.isDefined).to.be.true;

            const derivedDef = def.derive?.(`foo-${name}`);

            expect(derivedDef.isDefined).to.be.false;

            derivedDef.define();

            expect(derivedDef.isDefined).to.be.true;
        });

        it("a derived instance should replace properties passed through new definition configuration", () => {
            const name = uniqueElementName();
            const styles = new ElementStyles([".class { color: red; }"]);
            const overrideStyles = new ElementStyles([".class { color: blue }"]);
            const def = FASTElementDefinition.compose(MyElement, {
                name: `my-${name}`,
                styles: styles
            });

            const derivedDef = def.derive?.({
                name: `foo-${name}`,
                styles: overrideStyles
            });

            expect(def.styles).to.not.equal(derivedDef.styles);
        });

        it("a derived instance cannot be created from a frozen instance", () => {
            const name = uniqueElementName();
            const def = FASTElementDefinition.compose(MyElement, `my-${name}`).freeze();

            expect(def["derive"]).to.be.undefined;
            expect(def).to.not.be.extensible;
        });
    });

    context("compose", () => {
        it("prevents registering FASTElement", () => {
            const def1 = FASTElementDefinition.compose(
                FASTElement,
                uniqueElementName()
            );

            const def2 = FASTElementDefinition.compose(
                FASTElement,
                uniqueElementName()
            );

            expect(def1.type).not.equal(FASTElement);
            expect(def2.type).not.equal(FASTElement);
        });

        it("automatically inherits definitions made directly against FASTElement", () => {
            const def1 = FASTElementDefinition.compose(
                FASTElement,
                uniqueElementName()
            );

            const def2 = FASTElementDefinition.compose(
                FASTElement,
                uniqueElementName()
            );

            expect(Reflect.getPrototypeOf(def1.type)).equals(FASTElement);
            expect(Reflect.getPrototypeOf(def2.type)).equals(FASTElement);
        });
    });
});
