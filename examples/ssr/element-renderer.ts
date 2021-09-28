/* eslint-disable */
import { ElementRenderer, RenderInfo } from "@lit-labs/ssr";
import { FASTElement } from "@microsoft/fast-element";
import { render } from "@lit-labs/ssr/lib/render-lit-html";
import { html } from "lit";

export class FASTElementRenderer extends ElementRenderer {
    public readonly element!: HTMLElement & FASTElement;
    static matchesClass(ctor: typeof HTMLElement): boolean {
        return ctor.prototype instanceof FASTElement;
    }
    connectedCallback(): void {
        this.element.connectedCallback();
    }

    constructor(tagName: string) {
        super(tagName);

        this.element = new (customElements.get(this.tagName)! as typeof FASTElement &
            typeof HTMLElement)();
    }

    *renderLight(renderInfo: RenderInfo): IterableIterator<string> {
        yield "LIGHT DOM";
    }
    *renderShadow(renderInfo: RenderInfo): IterableIterator<string> {
        const { innerHTML } = this.element.shadowRoot!;
        // render() does not support templates with interpolated DOM - it expects all DOM to be
        // in the strings collection. This means the following will not create DOM
        // when provided to render():
        //
        // const template = html`${innerHTML}`;
        //
        // Instead, trick html - this is fragile and we should probably work
        // with lit to understand the limitation and find a better work-around
        const template = html(([innerHTML] as unknown) as TemplateStringsArray);

        yield* render(template, renderInfo);
    }

    attributeChangedCallback(
        name: string,
        old: string | null,
        value: string | null
    ): void {
        console.log("attribute changed", name, old, value);
    }
}
