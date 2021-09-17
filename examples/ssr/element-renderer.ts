/* eslint-disable */
import { ElementRenderer, RenderInfo } from "@lit-labs/ssr";
import { FASTElement, FASTElementDefinition } from "@microsoft/fast-element";

export class FASTElementRenderer extends ElementRenderer {
    public element: HTMLElement & FASTElement;
    private ctor: typeof HTMLElement & typeof FASTElement;
    static matchesClass(ctor: typeof HTMLElement): boolean {
        return ctor.prototype instanceof FASTElement;
    }
    connectedCallback(): void {}
    constructor(tagName: string) {
        super(tagName);

        this.ctor = customElements.get(this.tagName!) as typeof HTMLElement &
            typeof FASTElement;
        this.element = new this.ctor() as HTMLElement & FASTElement;
    }

    *renderLight(renderInfo: RenderInfo): IterableIterator<string> {
        yield "LIGHT DOM";
    }
    *renderShadow(renderInfo: RenderInfo): IterableIterator<string> {
        const definition = FASTElementDefinition.forType(this.ctor);

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
