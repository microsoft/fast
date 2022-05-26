/**
 * This file was heavily inspired by {@link https://github.com/lit/lit/tree/main/packages/labs/ssr} with some adjustments made.
 * Please see {@link ../ACKNOWLEDGEMENTS.md}
 */

/**
 * @beta
 */
export class Node {}

/**
 * @beta
 */
export class Element extends Node {}

/**
 * @beta
 */
export abstract class HTMLElement extends Element {
    private static elementAttributes: WeakMap<
        HTMLElement,
        Map<string, string>
    > = new WeakMap();
    private static getOrCreateAttributesForElement(element: HTMLElement) {
        let attrs = HTMLElement.elementAttributes.get(element);
        if (!attrs) {
            HTMLElement.elementAttributes.set(element, (attrs = new Map()));
        }
        return attrs;
    }
    get attributes() {
        return Array.from(HTMLElement.getOrCreateAttributesForElement(this)).map(
            ([name, value]) => ({
                name,
                value,
            })
        );
    }
    private _shadowRoot: null | ShadowRoot = null;
    get shadowRoot() {
        return this._shadowRoot;
    }
    abstract attributeChangedCallback?(
        name: string,
        old: string | null,
        value: string | null
    ): void;
    setAttribute(name: string, value: string) {
        HTMLElement.getOrCreateAttributesForElement(this).set(name, value);
    }
    removeAttribute(name: string) {
        HTMLElement.getOrCreateAttributesForElement(this).delete(name);
    }
    hasAttribute(name: string) {
        return HTMLElement.getOrCreateAttributesForElement(this).has(name);
    }
    attachShadow(init: ShadowRootInit): ShadowRoot {
        const shadowRoot = { host: this };
        if (init && init.mode === "open") {
            this._shadowRoot = shadowRoot;
        }
        return shadowRoot;
    }
    getAttribute(name: string) {
        const value = HTMLElement.getOrCreateAttributesForElement(this).get(name);
        return value === undefined ? null : value;
    }
}

/**
 * @beta
 */
export interface CustomHTMLElement {
    new (): HTMLElement;
    observedAttributes?: string[];
}

/**
 * @beta
 */
export class ShadowRoot {}

/**
 * @beta
 */
export class Document {
    public adoptedStyleSheets: ReadonlyArray<CSSStyleSheet> = [];
    createTreeWalker() {
        return {};
    }
    createTextNode() {
        return {};
    }
    createElement() {
        return {};
    }
}

/**
 * @beta
 */
export class CSSStyleSheet {
    replace() {}
    public readonly cssRules: CSSRule[] = [];
    insertRule(rule: CSSRule, index: number = 0) {
        this.cssRules.splice(index, 0, rule);

        return index;
    }
}

/**
 * @beta
 */
export type CustomElementRegistration = {
    ctor: { new (): HTMLElement };
    observedAttributes: string[];
};

/**
 * @beta
 */
export class CustomElementRegistry {
    private __definitions = new Map<string, CustomElementRegistration>();

    define(name: string, ctor: CustomHTMLElement) {
        this.__definitions.set(name, {
            ctor,
            observedAttributes: (ctor as CustomHTMLElement).observedAttributes ?? [],
        });
    }

    get(name: string) {
        const definition = this.__definitions.get(name);
        return definition && definition.ctor;
    }
}

/**
 * @beta
 */
export class MutationObserver {
    observe() {}
}

/**
 * Shim of MediaQueryList.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList} */
export class MediaQueryList {
    /** No-op */
    addListener() {}

    /** Always false */
    matches = false;
}

/**
 * Creates a window object.
 * @param props - Additional properties to expose on the window.
 *
 * @beta
 */
export function createWindow(
    props: { [key: string]: unknown } = {}
): { [key: string]: unknown } {
    const window = {
        Node,
        Element,
        HTMLElement,
        Document,
        CSSStyleSheet,
        ShadowRoot,
        CustomElementRegistry,
        MutationObserver,
        MediaQueryList,
        matchMedia: () => new MediaQueryList(),

        // Set below
        window: undefined as unknown,
        document: undefined as unknown,
        customElements: undefined as unknown,

        // User-provided globals
        ...props,
    };

    window.window = window;
    window.document = new window.Document();
    window.customElements = new window.CustomElementRegistry();
    return window;
}

/**
 * Installs a window object on the global, exposing properties directly on globalThis and globalthis.window
 * @param window - The Window object to install
 *
 * @beta
 */
export function installWindowOnGlobal(window: { [key: string]: unknown }) {
    if (globalThis.window === undefined) {
        Object.assign(globalThis, window);
        globalThis.window = globalThis as typeof globalThis & Window;
    }
}
