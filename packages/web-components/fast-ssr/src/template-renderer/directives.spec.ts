import { ExecutionContext, HTMLBindingDirective, oneWay } from "@microsoft/fast-element";
import { expect, test } from "@playwright/test";
import "../install-dom-shim.js";
import { consolidate } from "../test-utilities/consolidate.js";
import { HTMLBindingDirectiveRenderer } from "./directives.js";
import { DefaultTemplateRenderer } from "./template-renderer.js";


test.describe("HTMLBindingDirective Renderer", () => {
    test("should yield numbers returned from the binding as a string", () => {
        const binding = oneWay(() => 12);
        const directive = new HTMLBindingDirective(binding);
        const templateRenderer = new DefaultTemplateRenderer();

        const result = HTMLBindingDirectiveRenderer.render(
            directive,
            templateRenderer.createRenderInfo(),
            {},
            templateRenderer,
            ExecutionContext.default
        );

        expect(consolidate(result)).toBe("12")
    });
    test("should yield booleans returned from the binding as a string", () => {
        const binding = oneWay(() => true);
        const directive = new HTMLBindingDirective(binding);
        const templateRenderer = new DefaultTemplateRenderer();

        const result = HTMLBindingDirectiveRenderer.render(
            directive,
            templateRenderer.createRenderInfo(),
            {},
            templateRenderer,
            ExecutionContext.default
        );

        expect(consolidate(result)).toBe("true")
    });
});
