import "./install-dom-shim.js";
import fastSSR from "./exports.js";
import { test, expect } from "@playwright/test";


test.describe("fastSSR default export", () => {
    test("should return a TemplateRenderer configured to create a RenderInfo object using the returned ElementRenderer", () => {
        const  { templateRenderer, ElementRenderer } = fastSSR();
        expect(templateRenderer.createRenderInfo().elementRenderers.includes(ElementRenderer)).toBe(true)
    })
});
