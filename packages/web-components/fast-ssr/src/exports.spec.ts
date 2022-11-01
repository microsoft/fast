import "./install-dom-shim.js";
import fastSSR from "./exports.js";
import { test, expect } from "@playwright/test";
import { uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTElement } from "@microsoft/fast-element";
import { consolidate } from "./test-utilities/consolidate.js";


test.describe("fastSSR default export", () => {
    test("should return a TemplateRenderer configured to create a RenderInfo object using the returned ElementRenderer", () => {
        const  { templateRenderer, ElementRenderer } = fastSSR();
        expect(templateRenderer.createRenderInfo().elementRenderers.includes(ElementRenderer)).toBe(true)
    })

    test("should render FAST elements without the `defer-hydration` attribute by default", () => {
        const { templateRenderer } = fastSSR();
        const name = uniqueElementName();
        FASTElement.define(name);

        expect(consolidate(templateRenderer.render(`<${name}></${name}>`))).toBe(`<${name}><template shadowroot="open"></template></${name}>`)
    });
    test("should render FAST elements with the `defer-hydration` attribute when deferHydration is configured to be true", () => {
        const { templateRenderer } = fastSSR({deferHydration: true});
        const name = uniqueElementName();
        FASTElement.define(name);

        expect(consolidate(templateRenderer.render(`<${name}></${name}>`))).toBe(`<${name} defer-hydration><template shadowroot="open"></template></${name}>`)
    });
    test("should not render FAST elements with the `defer-hydration` attribute when deferHydration is configured to be false", () => {
        const { templateRenderer } = fastSSR({deferHydration: false});
        const name = uniqueElementName();
        FASTElement.define(name);

        expect(consolidate(templateRenderer.render(`<${name}></${name}>`))).toBe(`<${name}><template shadowroot="open"></template></${name}>`)
    });
});
