/**
 * This file was ported from {@link https://github.com/lit/lit/tree/main/packages/labs/ssr}.
 * Please see {@link ../ACKNOWLEDGEMENTS.md}
 */
import { DOM, observable } from "@microsoft/fast-element";
import { RenderInfo } from "../render-info.js";
import { escapeHtml } from "../escape-html.js";
import { HTMLElement as ShimHTMLElement } from "../dom-shim.js";
import { shouldBubble } from "../event-utilities.js";
import { AttributesMap, ElementRenderer } from "./interfaces.js";

/**
 * @beta
 */
export abstract class DefaultElementRenderer
    implements Omit<ElementRenderer, "renderShadow" | "renderAttributes">
{
    private parent: ElementRenderer | null = null;
    private restoreElementDispatchEvent: (() => void) | null = null;
    @observable
    abstract element?: HTMLElement;
    elementChanged() {
        this.restoreElementDispatchEvent?.();
        if (this.element) {
            const element = this.element;
            const dispatch = element.dispatchEvent;
            Reflect.defineProperty(element, "dispatchEvent", {
                value: (event: Event) => {
                    let canceled = dispatch.call(element, event);

                    if (shouldBubble(event)) {
                        if (this.parent) {
                            canceled = this.parent.dispatchEvent(event);
                        } else if (element instanceof ShimHTMLElement) {
                            // Only emit on document if the the element is the DOM shim's element.
                            // Otherwise, the installed DOM should implement it's own behavior for bubbling
                            // an event from an element to the document and window.
                            canceled = document.dispatchEvent(event);
                        }
                    }

                    return canceled;
                },
            });
            this.restoreElementDispatchEvent = () => {
                Reflect.defineProperty(element, "dispatchEvent", {
                    value: dispatch,
                });
                this.restoreElementDispatchEvent = null;
            };
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

    constructor(public readonly tagName: string, renderInfo?: RenderInfo) {
        this.parent = renderInfo?.customElementInstanceStack.at(-1) || null;
    }

    connectedCallback() {}
    disconnectedCallback() {
        this.restoreElementDispatchEvent?.();
        this.parent = null;
        delete this.element;
    }
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
            if (value !== prev) {
                DOM.setAttribute(this.element, name, value);
                this.attributeChangedCallback(name, prev, value);
            }
        }
    }
}

export function renderAttribute(name: string, value: unknown, tagName?: string) {
    if (value === "" || value === undefined || value === null) {
        return ` ${name}`;
    } else if (typeof value === "string") {
        return ` ${name}="${escapeHtml(value)}"`;
    } else if (typeof value === "boolean" || typeof value === "number") {
        return ` ${name}="${value}"`;
    } else {
        throw new Error(`Cannot assign attribute '${name}' for element ${tagName}.`);
    }
}

/**
 * An ElementRenderer used as a fallback in the case where a custom element is
 * either unregistered or has no other matching renderer.
 */
export class FallbackRenderer extends DefaultElementRenderer implements ElementRenderer {
    public element?: HTMLElement | undefined;

    /**
     * When true, instructs the ElementRenderer to yield the `defer-hydration` attribute for
     * rendered elements.
     */
    public deferHydration = false;

    private readonly _attributes: { [name: string]: string } = {};

    public setAttribute(name: string, value: string) {
        if (value === undefined || value === null) {
            this.removeAttribute(name);
        } else {
            this._attributes[name] = value;
        }
    }

    public removeAttribute(name: string) {
        delete this._attributes[name];
    }

    public *renderAttributes(): IterableIterator<string> {
        if (this.deferHydration) {
            yield " defer-hydration";
        }
        for (const [name, value] of Object.entries(this._attributes)) {
            yield renderAttribute(name, value, this.element?.tagName);
        }
    }

    attributeChangedCallback() {}
    /* eslint-disable-next-line */
    *renderShadow() {}
}
