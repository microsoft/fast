import "../install-dom-shim.js";
import { strictEqual } from "node:assert/strict";
import { describe, test, after, beforeEach } from "node:test";
import { html, ViewTemplate } from "@microsoft/fast-element";
import fastSSR, { templateCacheController } from "../exports.js";
import { consolidate } from "../test-utilities/consolidate.js";



test("should be enabled by default", () => {
    strictEqual(templateCacheController.disabled, false)
});
describe("TemplateCacheController", () => {
    let template: ViewTemplate;
    beforeEach(() => {
        templateCacheController.enable();
        template = html`<p></p>`;
    });
    after(() => {
        templateCacheController.enable();
    });

    test("should support being disabled and re-enabled", () => {
        templateCacheController.disable();
        strictEqual(templateCacheController.disabled, true);
        templateCacheController.enable();
        strictEqual(templateCacheController.disabled, false)
    });

    test("should cache template results after rendering a template", () => {
        const { templateRenderer } = fastSSR();
        strictEqual(templateCacheController.has(template), false);
        consolidate(templateRenderer.render(template));
        strictEqual(templateCacheController.has(template), true);
    });

    test("should not cache template when disabled", () => {
        templateCacheController.disable();
        const { templateRenderer } = fastSSR();
        consolidate(templateRenderer.render(template));

        strictEqual(templateCacheController.has(template), false);
    });
});
