/**
 * This file was heavily inspired by {@link https://github.com/lit/lit/tree/main/packages/labs/ssr} with some adjustments made.
 * Please see {@link ../ACKNOWLEDGEMENTS.md}
 */

import { shouldBubble } from "./event-utilities.js";

/**
 * @beta
 */
export class Node extends EventTarget {}

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
export class Document extends Node {
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

    public dispatchEvent(event: Event): boolean {
        let canceled = super.dispatchEvent(event);

        if (shouldBubble(event)) {
            canceled = window.dispatchEvent(event);
        }

        return canceled;
    }
}

/**
 * @beta
 */
export class CustomEvent<T = any> extends Event {
    public detail: T | null = null;
    constructor(type: string, init?: CustomEventInit<T>) {
        super(type, init);

        if (init && "detail" in init) {
            this.detail = init.detail as T;
        }
    }
}

/**
 * @beta
 */
export class CSSStyleRule {
    public selectorText: string | undefined;
    public readonly style = new CSSStyleDeclaration();

    public get cssText(): string {
        if (typeof this.selectorText !== "string") {
            throw new Error(
                "Cannot format cssText for CSSStyleRule. No selectorText property is assigned."
            );
        }

        return `${this.selectorText} { ${this.style.cssText} }`;
    }
}

/**
 * @beta
 */
export class CSSStyleDeclaration {
    private rules = new Map<string, string>();
    public setProperty(name: string, value: string = "") {
        this.rules.set(name, value);
    }
    public removeProperty(name: string) {
        this.rules.delete(name);
    }

    public get cssText() {
        let text = "";

        for (const [key, value] of this.rules) {
            text += `${key}: ${value};`;
        }

        return text;
    }
}

/**
 * @beta
 */
export class CSSStyleSheet {
    replace() {}
    public readonly cssRules: CSSRule[] = [];
    insertRule(rule: string, index: number = 0) {
        const selectorText = rule.split("{")[0];
        const styleRule = new window.CSSStyleRule();
        styleRule.selectorText = selectorText;
        this.cssRules.splice(index, 0, styleRule);

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
    addEventListener() {}

    /** Always false */
    matches = false;
}

/**
 * @beta
 */
export class Window extends EventTarget {
    public Node = Node;
    public Element = Element;
    public HTMLElement = HTMLElement;
    public Document = Document;
    public CustomEvent = CustomEvent;
    public CSSStyleSheet = CSSStyleSheet;
    public CSSStyleDeclaration = CSSStyleDeclaration;
    public CSSStyleRule = CSSStyleRule;
    public ShadowRoot = ShadowRoot;
    public CustomElementRegistry = CustomElementRegistry;
    public MutationObserver = MutationObserver;
    public MediaQueryList = MediaQueryList;
    public matchMedia = () => new this.MediaQueryList();

    // Defined in constructor
    public window: unknown;
    public document: unknown;
    public customElements: unknown;
    public dispatchEvent: any;
    public addEventListener: any;
    public removeEventListener: any;

    constructor(props?: Record<string, any>) {
        super();

        /**
         * Methods of EventTarget must be assigned explicitly, otherwise they get omitted
         * when the window is merged into the `globalThis` in {@link installWindowOnGlobal}.
         */
        this.dispatchEvent = EventTarget.prototype.dispatchEvent.bind(this);
        this.addEventListener = EventTarget.prototype.addEventListener.bind(this);
        this.removeEventListener = EventTarget.prototype.removeEventListener.bind(this);

        Object.assign(this, props);
        this.window = this;
        this.document = new this.Document();
        this.customElements = new this.CustomElementRegistry();
    }
}

/**
 * Creates a window object.
 * @param props - Additional properties to expose on the window.
 *
 * @beta
 */
export function createWindow<T extends Record<string, any>>(props?: T): Window & T {
    return new Window(props) as Window & T;
}

/**
 * Installs a window object on the global, exposing properties directly on globalThis and globalthis.window
 * @param window - The Window object to install
 *
 * @beta
 */
export function installWindowOnGlobal(window: Record<string, any>) {
    if (globalThis.window === undefined) {
        Object.assign(globalThis, window);
        globalThis.window = globalThis as any;
    }
}
