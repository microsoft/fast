/**
 * Minimal DOM shim for running FAST Element's `css` and `html` tagged
 * templates in Node.js. Provides just enough of the DOM API to resolve
 * `ElementStyles.toString()` and compile `html` templates.
 *
 * This module is idempotent — if `globalThis.window` is already defined,
 * no shims are applied.
 */

class ShimNode extends EventTarget {}
class ShimElement extends ShimNode {}

class ShimHTMLElement extends ShimElement {
    static elementAttributes = new WeakMap<ShimHTMLElement, Map<string, string>>();
    _shadowRoot: object | null = null;

    get attributes(): Array<{ name: string; value: string }> {
        return Array.from(ShimHTMLElement.elementAttributes.get(this) ?? []).map(
            ([name, value]) => ({ name, value }),
        );
    }

    get shadowRoot() {
        return this._shadowRoot;
    }

    setAttribute(name: string, value: string) {
        let attrs = ShimHTMLElement.elementAttributes.get(this);
        if (!attrs) {
            attrs = new Map();
            ShimHTMLElement.elementAttributes.set(this, attrs);
        }
        attrs.set(name, value);
    }

    removeAttribute(name: string) {
        ShimHTMLElement.elementAttributes.get(this)?.delete(name);
    }

    hasAttribute(name: string) {
        return ShimHTMLElement.elementAttributes.get(this)?.has(name) ?? false;
    }

    getAttribute(name: string) {
        const v = ShimHTMLElement.elementAttributes.get(this)?.get(name);
        return v === undefined ? null : v;
    }

    attachShadow(init?: { mode?: string }) {
        const sr = { host: this };
        if (init?.mode === "open") {
            this._shadowRoot = sr;
        }
        return sr;
    }

    get classList() {
        return {
            add() {},
            remove() {},
            contains() {
                return false;
            },
            toggle() {},
        };
    }

    get part() {
        return this.classList;
    }
}

class ShimCSSStyleSheet {
    cssRules: Array<{ selectorText: string }> = [];

    replace() {}

    insertRule(rule: string, index = 0) {
        this.cssRules.splice(index, 0, { selectorText: rule.split("{")[0] });
        return index;
    }
}

class ShimCustomElementRegistry {
    __definitions = new Map<string, { ctor: any; observedAttributes: string[] }>();

    define(name: string, ctor: any) {
        this.__definitions.set(name, {
            ctor,
            observedAttributes: ctor.observedAttributes ?? [],
        });
    }

    get(name: string) {
        return this.__definitions.get(name)?.ctor;
    }

    whenDefined() {
        return Promise.resolve();
    }
}

class ShimDocument extends ShimNode {
    adoptedStyleSheets: any[] = [];

    createTreeWalker() {
        return {};
    }

    createTextNode() {
        return {};
    }

    createElement() {
        return new ShimHTMLElement();
    }
}

class ShimMutationObserver {
    observe() {}
    disconnect() {}
}

class ShimMediaQueryList {
    matches = false;
    addEventListener() {}
    removeEventListener() {}
}

export function installDomShim(): void {
    if ((globalThis as any).window !== undefined) {
        return;
    }

    (globalThis as any).Node = ShimNode;
    (globalThis as any).Element = ShimElement;
    (globalThis as any).HTMLElement = ShimHTMLElement;
    (globalThis as any).Document = ShimDocument;
    (globalThis as any).CustomEvent = class extends Event {
        detail: any;
        constructor(type: string, init?: CustomEventInit) {
            super(type, init);
            this.detail = init?.detail ?? null;
        }
    };
    (globalThis as any).CSSStyleSheet = ShimCSSStyleSheet;
    (globalThis as any).ShadowRoot = class {};
    (globalThis as any).CustomElementRegistry = ShimCustomElementRegistry;
    (globalThis as any).MutationObserver = ShimMutationObserver;
    (globalThis as any).MediaQueryList = ShimMediaQueryList;
    (globalThis as any).matchMedia = () => new ShimMediaQueryList();
    (globalThis as any).document = new ShimDocument();
    (globalThis as any).customElements = new ShimCustomElementRegistry();
    (globalThis as any).window = globalThis;

    (globalThis as any).CSS ??= { supports: () => true };
}
