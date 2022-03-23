import { installWindowOnGlobal } from "@lit-labs/ssr/lib/dom-shim.js";

installWindowOnGlobal();

// Implement shadowRoot getter on HTMLElement.
// Can be removed if https://github.com/lit/lit/issues/2652
// is integrated.
class PatchedHTMLElement extends HTMLElement {
    #shadowRoot: ShadowRoot | null = null;
    get shadowRoot() {
        return this.#shadowRoot;
    }
    attachShadow(init: ShadowRootInit) {
        const root = super.attachShadow(init);

        if (init.mode === "open") {
            this.#shadowRoot = root;
        }

        return root;
    }
}

window.HTMLElement = PatchedHTMLElement;
