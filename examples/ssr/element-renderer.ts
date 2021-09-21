/* eslint-disable */
import { ElementRenderer, RenderInfo } from "@lit-labs/ssr";
import { FASTElement, ViewTemplate } from "@microsoft/fast-element";
import { test } from "./utilities";

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
        console.log(this.element.shadowRoot);
        const { template } = this.element.$fastController;
        if (template instanceof ViewTemplate) {
            // console.log(template.html);
        }
        yield this.element.shadowRoot!.innerHTML;
    }
    attributeChangedCallback(
        name: string,
        old: string | null,
        value: string | null
    ): void {
        console.log("attribute changed", name, old, value);
    }
}
