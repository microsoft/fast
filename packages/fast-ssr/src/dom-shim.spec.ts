import "./install-dom-shim.js";
import { deepStrictEqual, doesNotThrow, ok, strictEqual } from "node:assert/strict";
import { describe, test } from "node:test";
import { FASTElement, html } from "@microsoft/fast-element";
import { createWindow } from "./dom-shim.js";
import fastSSR from "./exports.js";
import { uniqueElementName } from "@microsoft/fast-element/testing.js";

describe("createWindow", () => {
    test("should create a window with a document property that is an instance of the window's Document constructor", () => {
        const window = createWindow();

        strictEqual(window.document instanceof (window.Document as any), true);

        class MyDocument {}
        const windowOverride = createWindow({ Document: MyDocument });
        strictEqual(windowOverride.document instanceof MyDocument, true);
    });
    test("should create a window with a customElements property that is an instance of the window's CustomElementRegistry constructor", () => {
        const window = createWindow();

        strictEqual(
            window.customElements instanceof (window.CustomElementRegistry as any)
        , true);

        class MyRegistry {}
        const windowOverride = createWindow({ CustomElementRegistry: MyRegistry });
        strictEqual(windowOverride.customElements instanceof MyRegistry, true);
    });
});

describe("The DOM shim", () => {
    test(`should support construction and connection of a component and template during SSR rendering`, () => {
        class MyComponent extends FASTElement {}

        const name = "my-component";

        MyComponent.define({
            name,
            template: html``
        });

        const { templateRenderer } = fastSSR();
        const templateString = `<${name}></${name}>`;
        doesNotThrow(() => templateRenderer.render(templateString));
    });

    describe("has a CSSStyleSheet implementation", () => {
        test("that is constructable", () => {
            doesNotThrow(() => new CSSStyleSheet());
        });
        test("that supports adding :host{} and :root{} rules", () => {
            const sheet = new CSSStyleSheet();
            const hostIndex = sheet.insertRule(":host{}");
            strictEqual(sheet.cssRules[hostIndex].cssText, ":host {  }");
            const rootIndex = sheet.insertRule(":root{}");
            strictEqual(sheet.cssRules[rootIndex].cssText, ":root {  }");
        });

        describe("with rule implementations", () => {
            test("that support setting properties from the style declaration", () => {
                const sheet = new CSSStyleSheet();
                const index = sheet.insertRule(":host{}");
                const rule = sheet.cssRules[index] as CSSStyleRule;
                rule.style.setProperty("--test", "value");

                strictEqual(rule.cssText, ":host { --test: value; }");
            });
            test("that support removing properties from the style declaration", () => {
                const sheet = new CSSStyleSheet();
                const index = sheet.insertRule(":host{}");
                const rule = sheet.cssRules[index] as CSSStyleRule;
                rule.style.setProperty("--test", "value");
                rule.style.removeProperty("--test");

                strictEqual(rule.cssText, ":host {  }");
            });
        });
    });

    describe("has a matchMedia method", () => {
        test("that can returns the MediaQueryList supplied to createWindow", () => {
            class MyMediaQueryList {}

            const win: any = createWindow({ MediaQueryList: MyMediaQueryList });
            const list = win.matchMedia();

            ok(list instanceof MyMediaQueryList);
        });
    });

    describe("DOMTokenList", () => {
        class TestElement extends FASTElement {}
        TestElement.define({ name: uniqueElementName() });

        test("adds a token", () => {
            const element = new TestElement();
            const cList = element.classList;

            cList.toggle("c1");
            ok(cList.contains("c1"), "adds a token that is not present");

            deepStrictEqual(cList.toggle("c2"), 
                true
            , "returns true when token is added");
        });

        test("removes a token", () => {
            const element = new TestElement();
            const cList = element.classList;

            cList.add("c1");
            cList.toggle("c1");

            ok(!cList.contains("c1"), "removes a token that is present");

            cList.add("c2");
            deepStrictEqual(
                cList.toggle("c2"), false, "return false when token is removed"
            );
        });

        test("adds token with second argument", () => {
            const element = new TestElement();
            const cList = element.classList;

            cList.toggle("c1", true);
            ok(cList.contains("c1"), "adds a token");

            deepStrictEqual(
                cList.toggle("c2", true), true, "returns true when token is added"
            );

            cList.add("c3");
            cList.toggle("c3", true);

            ok(
                cList.contains("c3"), "does not remove a token that is already present"
            );

            cList.add("c4");

            deepStrictEqual(
                cList.toggle("c4", true), true, "returns true when token is already present"
            );
        });

        test("removes token with second argument", () => {
            const element = new TestElement();
            const cList = element.classList;

            cList.add("c1");
            cList.toggle("c1", false);

            ok(!cList.contains("c1"), "removes a token");

            deepStrictEqual(
                cList.toggle("c2", false), false, "returns false when token is removed"
            );

            cList.toggle("c3", false);

            ok(
                !cList.contains("c3"), "does not add a token that is not present"
            );

            deepStrictEqual(
                cList.toggle("c4", false), false, "returns false when token was not present"
            );
        });

        test("removes duplicated tokens", () => {
            const element = new TestElement();
            element.className = "ho ho ho";

            const cList = element.classList;
            cList.remove("ho");
            ok(
                !cList.contains("ho"), "should remove all instances of 'ho'"
            );
            deepStrictEqual(element.className, "");
        });
    });
});
