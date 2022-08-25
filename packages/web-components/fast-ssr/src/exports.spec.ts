import "./install-dom-shim.js";
import fastSSR from "@microsoft/fast-ssr";
import { test, expect } from "@playwright/test";


test.describe("fastSSR default export", () => {
    test("should return a TemplateRenderer configured to create a RenderInfo object using the returned ElementRenderer", () => {
        const  { templateRenderer, elementRenderer } = fastSSR();
        expect(templateRenderer.createRenderInfo().elementRenderers.includes(elementRenderer)).toBe(true)
    })
});
