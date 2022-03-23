import "../dom-shim.js";
import { FASTElement, customElement, css, html } from "@microsoft/fast-element";
import { expect, test } from '@playwright/test';
import { FASTElementRenderer } from "./element-renderer.js";
import fastSSR from "../exports.js";
import { consolidate } from "../test-utils.js";


@customElement({
    name: "styled-element",
    styles: css`:host { display: block; }${css`:host { color: red; }`}
    `
})
class StyledElement extends FASTElement {}
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
    });
});
