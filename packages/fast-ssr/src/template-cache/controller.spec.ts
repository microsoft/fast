import "../install-dom-shim.js";
import { html, ViewTemplate } from "@microsoft/fast-element";
import { expect, test } from "@playwright/test";
import fastSSR, { templateCacheController } from "../exports.js";
import { consolidate } from "../test-utilities/consolidate.js";



test("should be enabled by default", () => {
    expect(templateCacheController.disabled).toBe(false)
});
test.describe("TemplateCacheController", () => {
    let template: ViewTemplate;
    test.beforeEach(() => {
        templateCacheController.enable();
        template = html`<p></p>`;
    });
    test.afterAll(() => {
        templateCacheController.enable();
    });

    test("should support being disabled and re-enabled", () => {
        templateCacheController.disable();
        expect(templateCacheController.disabled).toBe(true);
        templateCacheController.enable();
        expect(templateCacheController.disabled).toBe(false)
    });

    test("should cache template results after rendering a template", () => {
        const { templateRenderer } = fastSSR();
        expect(templateCacheController.has(template)).toBe(false);
        consolidate(templateRenderer.render(template));
        expect(templateCacheController.has(template)).toBe(true);
    });

    test("should not cache template when disabled", () => {
        templateCacheController.disable();
        const { templateRenderer } = fastSSR();
        consolidate(templateRenderer.render(template));

        expect(templateCacheController.has(template)).toBe(false);
    });
});
