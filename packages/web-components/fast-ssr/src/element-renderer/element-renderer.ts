import { ElementRenderer, RenderInfo } from "@lit-labs/ssr";
import { FASTElement } from "@microsoft/fast-element";
import { TemplateRenderer } from "../template-renderer/template-renderer.js";
import { SSRView } from "../view.js";

export abstract class FASTElementRenderer extends ElementRenderer {
    /**
     * The element instance represented by the {@link FASTElementRenderer}.
     */
    public readonly element!: FASTElement;

    /**
     * Tests a constructor to determine if it should be managed by a {@link FASTElementRenderer}.
     * @param ctor - The constructor to test.
     */
    public static matchesClass(ctor: typeof HTMLElement): boolean {
        return ctor.prototype instanceof FASTElement;
    }

    /**
     * Indicate to the {@link FASTElementRenderer} that the instance should execute DOM connection behavior.
     */
    public connectedCallback(): void {
        this.element.connectedCallback();
    }

    /**
     * The template renderer to use when rendering a component template
     */
    protected abstract templateRenderer: TemplateRenderer;

    /**
     * Constructs a new {@link FASTElementRenderer}.
     * @param tagName - the tag-name of the element to create.
     */
    constructor(tagName: string) {
        super(tagName);

        const ctor: typeof FASTElement | null = customElements.get(this.tagName);

        if (ctor) {
            this.element = new ctor();
        } else {
            throw new Error(
                `FASTElementRenderer was unable to find a constructor for a custom element with the tag name '${tagName}'.`
            );
        }
    }

    /**
     * Renders the component internals to light DOM instead of shadow DOM.
     * @param renderInfo - information about the current rendering context.
     */
    *renderLight(renderInfo: RenderInfo): IterableIterator<string> {
        // TODO - this will yield out the element's template using the template renderer, skipping any shadow-DOM specific emission.
        yield "";
    }

    /**
     * Render the component internals to shadow DOM.
     * @param renderInfo - information about the current rendering context.
     */
    *renderShadow(renderInfo: RenderInfo): IterableIterator<string> {
        const view = this.element.$fastController.view;

        if (view === null) {
            return;
        }

        yield* this.templateRenderer.renderOpCodes(
            ((view as unknown) as SSRView).codes,
            renderInfo,
            this.element
        );
    }

    /**
     * Indicate to the {@link FASTElementRenderer} that an attribute has been changed.
     * @param name - The name of the changed attribute
     * @param old - The old attribute value
     * @param value - The new attribute value
     */
    attributeChangedCallback(
        name: string,
        old: string | null,
        value: string | null
    ): void {
        this.element.attributeChangedCallback(name, old, value);
    }
}
