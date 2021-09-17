/* eslint-disable */
import { ElementRenderer, RenderInfo } from "@lit-labs/ssr";
import { FASTElement } from "@microsoft/fast-element";

export class FASTElementRenderer extends ElementRenderer {
    public element: HTMLElement & FASTElement;
    static matchesClass(ctor: typeof HTMLElement): boolean {
        return ctor.prototype instanceof FASTElement;
    }
    connectedCallback(): void {
        this.element.$fastController.onConnectedCallback();
    }

    constructor(tagName: string) {
        super(tagName);

        this.element = new (customElements.get(this.tagName!)!)() as HTMLElement &
            FASTElement;
    }

    *renderLight(renderInfo: RenderInfo): IterableIterator<string> {
        yield "LIGHT DOM";
    }
    *renderShadow(renderInfo: RenderInfo): IterableIterator<string> {
        yield "SHADOW DOM";
    }
    attributeChangedCallback(
        name: string,
        old: string | null,
        value: string | null
    ): void {
        console.log("attribute changed", name, old, value);
    }
}
