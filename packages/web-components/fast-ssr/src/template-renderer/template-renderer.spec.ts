import "@lit-labs/ssr/lib/install-global-dom-shim.js";
import { test, expect } from "@playwright/test";
import { TemplateRenderer } from "./template-renderer.js";
import fastSSR from "../exports.js";
import { html, when, repeat } from "@microsoft/fast-element";
import { string } from "yargs";

function consolidate(strings: IterableIterator<string>): string {
    let str = "";
    let current = strings.next();

    while(!current.done) {
        str = str.concat(current.value)
        current = strings.next();
    }

    return str;
}

test.describe("TemplateRenderer", () => {
    test.describe("should have an initial configuration", () => {
        test("that emits to shadow DOM", () => {
            const instance = new TemplateRenderer();
            expect(instance.componentDOMEmissionMode).toBe("shadow")
        });
    });

    test.describe("should allow configuration", () => {
        test("that emits to light DOM", () => {
            const instance = new TemplateRenderer({componentDOMEmissionMode: "light"});
            expect(instance.componentDOMEmissionMode).toBe("light")
        });
    });

    test("should emit a single element template", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = templateRenderer.render(html`<p>Hello world</p>`, defaultRenderInfo)

        expect(consolidate(result)).toBe("<p>Hello world</p>")
    });

    /**
     * Bindings
     */
    test("should provide the source object to any bindings", () => {
        const source = {};
        let calledWith: any;
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        consolidate(templateRenderer.render(html`${(x) => {calledWith = x}}`, defaultRenderInfo, source));

        expect(source).toBe(calledWith);
    });

    test("should not emit string content from a binding that returns a null value", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = consolidate(templateRenderer.render(html`${(x) => null}`, defaultRenderInfo));

        expect(result).toBe("");
    });

    test("should not emit string content from a binding that returns an undefined value", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = consolidate(templateRenderer.render(html`${(x) => undefined}`, defaultRenderInfo));

        expect(result).toBe("");
    });

    /**
     * Directive tests
     */
    test("should render a 'when' directive's content when the binding evaluates true", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = templateRenderer.render(html`${when(x => true, html`<p>Hello world</p>`)}`, defaultRenderInfo)

        expect(consolidate(result)).toBe("<p>Hello world</p>")
    });
    test("should emit nothing when a 'when' directive's binding evaluates false ", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = templateRenderer.render(html`${when(x => false, html`<p>Hello world</p>`)}`, defaultRenderInfo)

        expect(consolidate(result)).toBe("");
    });
});
