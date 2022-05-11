
import "@microsoft/fast-ssr/install-dom-shim";
import { FASTElement, customElement, css, html, attr, nullableNumberConverter } from "@microsoft/fast-element";
import { expect, test } from '@playwright/test';
import fastSSR from "./exports.js";
import { consolidate } from "./test-utils.js";
import { DesignToken, ConstructableDesignTokenStrategy, DesignTokenStrategy } from "@microsoft/fast-foundation";
import { boolean } from "yargs";

/**
 * TODO
 * ----
 *
 * Stylesheets applied for a token are not accurate, populated with `undefined`
 */
const numberToken = DesignToken.create<number>("number-token").withDefault(12);

class SSRDesignTokenStrategy implements DesignTokenStrategy {
    constructor() {}
    public findParent(target: HTMLElement): HTMLElement | null {
        // To accomplish this with events, we would need an entry-point to attach an event listener to the token target.
        // That listener would simply attach itself to the event detail and stop immediate propagation
        return ( target as any ).__eventTargetParent || null;
    }
    public contains(host: HTMLElement, target: HTMLElement): boolean {
        const name = "$$design-token-contains-resolver$$";
        const fn =  (e: CustomEvent<{contains: boolean}>) => {
            e.detail.contains = true;
            e.stopImmediatePropagation();
        };
        host.addEventListener(name as any, fn);

        const e = new CustomEvent<{contains: boolean}>(name, {
            bubbles: true,
            cancelable: true,
            detail: { contains: false }
        });

        target.dispatchEvent(e);
        host.removeEventListener(name as any, fn);

        console.log("contains", e.detail.contains);
        return e.detail.contains;
    }
}

DesignToken.setStrategy(SSRDesignTokenStrategy);

@customElement("number-token-emitter")
class NumberTokenEmitter extends FASTElement {
    @attr
    number: number = -1;
    connectedCallback(): void {
        super.connectedCallback();

        this.number = numberToken.getValueFor(this);
    }
}

@customElement("number-token-setter")
class NumberTokenSetter extends FASTElement {
    @attr({ mode: "fromView", converter: nullableNumberConverter})
    number!: number;
    numberChanged(prev: number | undefined, next: number) {
        if (typeof next === "number") {
            numberToken.setValueFor(this, next);
        }
    }
}

test.describe.only("Design Tokens", () => {
    test("should be able to retrieve the default value", () => {
        expect(numberToken.default).toBe(12)
    });

    test("should resolve a token value from the default when not set for the element hierarchy", () => {
        const { templateRenderer, defaultRenderInfo } = fastSSR();
        expect(consolidate(templateRenderer
            .render(html`<number-token-emitter></number-token-emitter>`, defaultRenderInfo)))
            .toBe(`<number-token-emitter number=\"12\"><template shadowroot=\"open\"><style>undefined</style></template></number-token-emitter>`);
    });

    test("should resolve a token value from an element for which it is set", () => {
        const { templateRenderer, defaultRenderInfo } = fastSSR();
        expect(consolidate(templateRenderer
            .render(html`<number-token-setter number="14"><number-token-emitter></number-token-emitter></number-token-setter>`, defaultRenderInfo)))
            .toBe(`<number-token-setter  number=\"14\"><template shadowroot=\"open\"><style>undefined</style></template><number-token-emitter number=\"14\"><template shadowroot=\"open\"></template></number-token-emitter></number-token-setter>`);
    });
    test("should resolve a token value from an element for which it is setblah", () => {
        const { templateRenderer, defaultRenderInfo } = fastSSR();
        expect(consolidate(templateRenderer
            .render(html`<number-token-setter number="14"><number-token-emitter><number-token-emitter></number-token-emitter></number-token-emitter></number-token-setter>`, defaultRenderInfo)))
            .toBe(`<number-token-setter  number=\"14\"><template shadowroot=\"open\"><style>undefined</style></template><number-token-emitter number=\"14\"><template shadowroot=\"open\"></template></number-token-emitter></number-token-setter>`);
    });
});
