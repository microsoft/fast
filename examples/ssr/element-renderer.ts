import { ElementRenderer, RenderInfo } from "@lit-labs/ssr";
import { FASTElement } from "@microsoft/fast-element";

export class FASTElementRenderer extends ElementRenderer {
    static matchesClass(ctor: typeof HTMLElement): boolean {
        return ctor === FASTElement;
    }
    connectedCallback(): void {
        console.log("FASTElementRenderer connectedCallback()");
    }
    constructor(tagName: string) {
        super(tagName);
    }

    *renderLight(renderInfo: RenderInfo): IterableIterator<string> {
        console.log("FASTElementRenderer renderLight()");
        yield "";
    }
    *renderShadow(): IterableIterator<string> {
        console.log("FASTElementRenderer renderLight()");
        yield "";
    }
    attributeChangedCallback(
        name: string,
        old: string | null,
        value: string | null
    ): void {
        console.log("FASTElementRenderer attributeChangedCallback()");
    }
}
