/**
 * This file was ported from {@link https://github.com/lit/lit/tree/main/packages/labs/ssr}.
 * Please see {@link ../ACKNOWLEDGEMENTS.md}
 */
import { observable } from "@microsoft/fast-element";
import { RenderInfo } from "../render-info.js";
import { escapeHtml } from "../escape-html.js";
import { HTMLElement as ShimHTMLElement } from "../dom-shim.js";
import { shouldBubble } from "../event-utilities.js";
import { AttributesMap, ElementRenderer } from "./interfaces.js";

export const getElementRenderer = (
    renderInfo: RenderInfo,
    tagName: string,
    ceClass: typeof HTMLElement | undefined = customElements.get(tagName),
    attributes: AttributesMap = new Map()
): ElementRenderer => {
    if (ceClass === undefined) {
        console.warn(`Custom element ${tagName} was not registered.`);
    } else {
        for (const renderer of renderInfo.elementRenderers) {
            if (renderer.matchesClass(ceClass, tagName, attributes)) {
                return new renderer(tagName, renderInfo);
            }
        }
    }

    return new FallbackRenderer(tagName, renderInfo);
};

/**
 * @beta
 */
export abstract class DefaultElementRenderer
    implements Omit<ElementRenderer, "renderShadow" | "renderAttributes">
{
    private parent: ElementRenderer | null = null;
    @observable
    abstract readonly element?: HTMLElement;
    elementChanged() {
        if (this.element) {
            const dispatch = this.element.dispatchEvent;
            Reflect.defineProperty(this.element, "dispatchEvent", {
                value: (event: Event) => {
                    let canceled = dispatch.call(this.element, event);

                    if (shouldBubble(event)) {
                        if (this.parent) {
                            canceled = this.parent.dispatchEvent(event);
                        } else if (this.element instanceof ShimHTMLElement) {
                            // Only emit on document if the the element is the DOM shim's element.
                            // Otherwise, the installed DOM should implement it's own behavior for bubbling
                            // an event from an element to the document and window.
                            canceled = document.dispatchEvent(event);
                        }
                    }

                    return canceled;
                },
            });
        }
    }

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

    constructor(
        public readonly tagName: string,
        private readonly renderInfo?: RenderInfo
    ) {
        this.parent = renderInfo?.customElementInstanceStack.at(-1) || null;
    }

    abstract connectedCallback(): void;
    abstract attributeChangedCallback(
        name: string,
        prev: string | null,
        next: string | null
    ): void;

    public dispatchEvent(event: Event): boolean {
        return this.element?.dispatchEvent(event) || false;
    }

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
}

/**
 * An ElementRenderer used as a fallback in the case where a custom element is
 * either unregistered or has no other matching renderer.
 */
class FallbackRenderer extends DefaultElementRenderer implements ElementRenderer {
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
