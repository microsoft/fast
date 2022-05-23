/**
 * This file was heavily inspired by {@link https://github.com/lit/lit/tree/main/packages/labs/ssr} with some adjustments made.
 * Please see {@link ../ACKNOWLEDGEMENTS.md}
 */

/**
 * @beta
 */
export class Element {}

/**
 * @beta
 */
export abstract class HTMLElement extends Element {
    private static attributes: WeakMap<HTMLElement, Map<string, string>> = new WeakMap();
    private static getOrCreateAttributesForElement(element: HTMLElement) {
        let attrs = HTMLElement.attributes.get(element);
        if (!attrs) {
            HTMLElement.attributes.set(element, (attrs = new Map()));
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
    get adoptedStyleSheets() {
        return [];
    }
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
 * Creates a window object.
 * @param props - Additional properties to expose on the window.
 *
 * @beta
 */
export function createWindow(
    props: { [key: string]: unknown } = {}
): { [key: string]: unknown } {
    const window = {
        Element,
        HTMLElement,
        Document,
        CSSStyleSheet,
        ShadowRoot,
        CustomElementRegistry,
        MutationObserver,

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
 * Constructs a window object and installs it on the global, exposing properties directly on globalThis and globalthis.window
 * @param props - Additional properties to expose on the window.
 *
 * @beta
 */
export function installWindowOnGlobal(props: { [key: string]: unknown } = {}) {
    if (globalThis.window === undefined) {
        const window = createWindow(props);
        Object.assign(globalThis, window);
        globalThis.window = globalThis as typeof globalThis & Window;
    }
}
