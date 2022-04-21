import { installWindowOnGlobal } from "@lit-labs/ssr/lib/dom-shim.js";
import { CSSStyleDeclaration, CSSStyleSheet } from "happy-dom";

class DOMTokenList {
    #tokens = new Set<string>();

    public add(value: string) {
        this.#tokens.add(value);
    }

    public remove(value: string) {
        this.#tokens.delete(value);
    }

    public contains(value: string) {
        return this.#tokens.has(value);
    }

    public toggle(value: string, force?: boolean) {
        const add = force === undefined ? !this.contains(value) : force;

        if (add) {
            this.add(value);
            return true;
        } else {
            this.remove(value);
            return false;
        }
    }

    public toString() {
        return Array.from(this.#tokens).join(" ");
    }

    *[Symbol.iterator]() {
        yield* this.#tokens.values();
    }
}

class EventTarget {
    addEventListener() {}
    removeEventListener() {}
}
class Node extends EventTarget {
    appendChild() {}
    removeChild() {}
    getRootNode() {
        return document;
    }

    get parentElement() {
        return null;
    }
}

class Element extends Node {}

class HTMLElement extends Element {
    #attributes = new Map<string, string | DOMTokenList>();
    #shadowRoot: null | ShadowRoot = null;

    public tagName!: string;

    public readonly classList = new DOMTokenList();

    public style = new CSSStyleDeclaration();

    public get attributes(): { name: string; value: string }[] {
        return Array.from(this.#attributes)
            .filter(([name, value]) => value !== undefined && value !== null)
            .map(([name, value]) => {
                if (typeof value === "string") {
                    return { name, value };
                } else {
                    return { name, value: value.toString() };
                }
            });
    }

    public get shadowRoot() {
        return this.#shadowRoot;
    }

    public attributeChangedCallback?(
        name: string,
        old: string | null,
        value: string | null
    ): void;

    public setAttribute(name: string, value: string) {
        let _value: string | DOMTokenList = value;
        if (name === "class") {
            _value = new DOMTokenList();
            value.split(" ").forEach(className => {
                (_value as DOMTokenList).add(className);
            });
        }
        this.#attributes.set(name, _value);
    }

    public removeAttribute(name: string) {
        this.#attributes.delete(name);
    }

    public hasAttribute(name: string) {
        return this.#attributes.has(name);
    }

    public attachShadow(init: ShadowRootInit) {
        const shadowRoot = ({ host: this } as unknown) as ShadowRoot;
        if (init && init.mode === "open") {
            this.#shadowRoot = shadowRoot;
        }
        return shadowRoot;
    }

    public getAttribute(name: string) {
        const value = this.#attributes.get(name);
        return value === undefined
            ? null
            : value instanceof DOMTokenList
            ? value.toString()
            : value;
    }
}

class Document {
    head = new Node();
    body = this.createElement("body");
    adoptedStyleSheets = [];
    createTreeWalker() {
        return {};
    }
    createTextNode() {
        return {};
    }
    createElement(tagName: string) {
        const el = new HTMLElement();
        el.tagName = tagName;
        return el;
    }
    querySelector() {
        return undefined;
    }
    addEventListener() {}
}

class MediaQueryList {
    addListener() {}
    matches = false;
}
installWindowOnGlobal({
    matchMedia: () => new MediaQueryList(),
    HTMLElement,
    Document,
    document: new Document(),
    Node,
    CSSStyleSheet,
    CSSStyleDeclaration,
});
