/**
 * This file was ported from {@link https://github.com/lit/lit/tree/main/packages/labs/ssr}.
 * Please see {@link ../ACKNOWLEDGEMENTS.md}
 */
import { RenderInfo } from "../render-info.js";
import { escapeHtml } from "../escape-html.js";

type AttributesMap = Map<string, string>;

/**
 * @beta
 */
export type ConstructableElementRenderer = (new (tagName: string) => ElementRenderer) &
    typeof ElementRenderer;

export const getElementRenderer = (
    { elementRenderers }: RenderInfo,
    tagName: string,
    ceClass: typeof HTMLElement | undefined = customElements.get(tagName),
    attributes: AttributesMap = new Map()
): ElementRenderer => {
    if (ceClass === undefined) {
        console.warn(`Custom element ${tagName} was not registered.`);
        return new FallbackRenderer(tagName);
    }
    for (const renderer of elementRenderers) {
        if (renderer.matchesClass(ceClass, tagName, attributes)) {
            return new renderer(tagName);
        }
    }
    return new FallbackRenderer(tagName);
};

/**
 * @beta
 */
export abstract class ElementRenderer {
    abstract readonly element?: HTMLElement;

    /**
     * Should return true when the renderer should handle rendering for a custom element ctor or tag name.
     * @param ctor - the custom element class
     * @param tagName - the custom element tag name
     * @param attributes - the attribute map
     * @returns
     */
    static matchesClass(
        ctor: typeof HTMLElement,
        tagName: string,
        attributes: AttributesMap
    ): boolean {
        return false;
    }

    constructor(public readonly tagName: string) {}

    abstract connectedCallback(): void;
    abstract attributeChangedCallback(
        name: string,
        prev: string | null,
        next: string | null
    ): void;

    /**
     * Sets a property for the element if it exists.
     */
    public setProperty(name: string, value: unknown) {
        if (this.element) {
            (this.element as any)[name] = value;
        }
    }

    /**
     * Sets an attribute for the element if it exists.
     */
    public setAttribute(name: string, value: string) {
        if (this.element) {
            const prev = this.element.getAttribute(name);
            this.element.setAttribute(name, value);
            this.attributeChangedCallback(name, prev, value);
        }
    }

    public abstract renderShadow(renderInfo: RenderInfo): IterableIterator<string>;

    /**
     * Render an element's attributes.
     *
     * Default implementation serializes all attributes on the element instance.
     */
    *renderAttributes(): IterableIterator<string> {
        if (this.element !== undefined) {
            const { attributes } = this.element;
            for (
                let i = 0, name, value;
                i < attributes.length && ({ name, value } = attributes[i]);
                i++
            ) {
                if (value === "" || value === undefined || value === null) {
                    yield ` ${name}`;
                } else {
                    yield ` ${name}="${escapeHtml(value)}"`;
                }
            }
        }
    }
}
/**
 * An ElementRenderer used as a fallback in the case where a custom element is
 * either unregistered or has no other matching renderer.
 */
class FallbackRenderer extends ElementRenderer {
    public element?: HTMLElement | undefined;
    private readonly _attributes: { [name: string]: string } = {};

    public setAttribute(name: string, value: string) {
        this._attributes[name] = value;
    }

    public *renderAttributes(): IterableIterator<string> {
        for (const [name, value] of Object.entries(this._attributes)) {
            if (value === "" || value === undefined || value === null) {
                yield ` ${name}`;
            } else {
                yield ` ${name}="${escapeHtml(value)}"`;
            }
        }
    }

    connectedCallback() {}
    attributeChangedCallback() {}
    /* eslint-disable-next-line */
    *renderShadow() {}
}
