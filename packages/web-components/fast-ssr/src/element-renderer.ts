import { ElementRenderer, RenderInfo } from "@lit-labs/ssr";
import { FASTElement } from "@microsoft/fast-element";

export class FASTElementRenderer extends ElementRenderer {
    public readonly element!: FASTElement;
    static matchesClass(ctor: typeof HTMLElement): boolean {
        return ctor.prototype instanceof FASTElement;
    }

    connectedCallback(): void {
        this.element.connectedCallback();
    }

    constructor(tagName: string) {
        super(tagName);

        const ctor: typeof FASTElement | null = customElements.get(this.tagName);

        if (ctor) {
            this.element = new ctor();
        } else {
            throw new Error(
                `could not find a constructor for a custom element with a tag name '${tagName}'.`
            );
        }
    }

    /**
     * Renders the component to light DOM instead of shadow DOM.
     * @param renderInfo - information about the current rendering context
     */
    *renderLight(renderInfo: RenderInfo): IterableIterator<string> {
        // TODO - this will yield out the element's template using the template renderer, skipping any shadow-DOM specific emission.
        yield "";
    }

    *renderShadow(renderInfo: RenderInfo): IterableIterator<string> {
        // TODO - this will yield out the element's template using the template renderer
        yield "";
    }

    attributeChangedCallback(
        name: string,
        old: string | null,
        value: string | null
    ): void {
        this.element.attributeChangedCallback(name, old, value);
    }
}
