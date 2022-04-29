import "../dom-shim.js";
import { FASTElement, customElement, css, html } from "@microsoft/fast-element";
import { expect, test } from '@playwright/test';
import { FASTElementRenderer } from "./element-renderer.js";
import fastSSR from "../exports.js";
import { consolidate } from "../test-utils.js";
import { timeStamp } from "console";


@customElement({
    name: "styled-element",
    styles: css`:host { display: block; }${css`:host { color: red; }`}
    `
})
export class StyledElement extends FASTElement {}

@customElement({
    name: "host-binding-element",
    template: html`
        <template attr="attr" ?bool-attr="${() => true}"></template>
    `
})
export class HostBindingElement extends FASTElement {}
test.describe("FASTElementRenderer", () => {
    test.describe("should have a 'matchesClass' method", () => {
        test("that returns true when invoked with a class that extends FASTElement ",  () => {
            class MyElement extends FASTElement {}
            expect(FASTElementRenderer.matchesClass(MyElement)).toBe(true);
        });
        test("that returns false when invoked with a class that does not extend FASTElement ", () => {
            class MyElement extends HTMLElement {}
            expect(FASTElementRenderer.matchesClass(MyElement)).toBe(false);
        });
    });

    test.describe("rendering stylesheets", () => {
        test(`should render stylesheets as 'style' elements by default`, () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = consolidate(templateRenderer.render(html`<styled-element></styled-element>`, defaultRenderInfo));
            expect(result).toBe("<styled-element><template shadowroot=\"open\"><style>:host { display: block; }</style><style>:host { color: red; }</style></template></styled-element>");
        });
        test(`should render stylesheets as 'fast-style' elements when configured`, () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR({useFASTStyle: true});
            const result = consolidate(templateRenderer.render(html`<styled-element></styled-element>`, defaultRenderInfo));
            expect(result).toBe(`<styled-element><template shadowroot=\"open\"><fast-style style-id="fast-style-0" css=":host { display: block; }\"></fast-style><fast-style style-id=\"fast-style-1\" css=\":host { color: red; }"></fast-style></template></styled-element>`);
        });
    });

    test("should render attributes on the root of a template element to the host element", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = consolidate(templateRenderer.render(html`
            <host-binding-element></host-binding-element>
        `, defaultRenderInfo));
        expect(result).toBe(`
            <host-binding-element attr="attr" bool-attr><template shadowroot=\"open\"></template></host-binding-element>
        `);
    })
});
