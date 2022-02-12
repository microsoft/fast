import { DOM, StyleTarget } from "@microsoft/fast-element";

interface StyleCache {
    [key: string]: CSSStyleSheet | string;
}

/**
 * The FASTStyle web component that takes attributes:
 * - css - a string version of the CSS to be applied to the parent web component, this can be omitted if the data-style-id has been used in the DOM as the cached value will be fetched
 * - data-style-id - a dataset attribute used as an identifier for the CSS attr string
 */
export default class FASTStyle extends HTMLElement {
    static cache: StyleCache = {};
    static hashIdDataSetName: string = "data-style-id";

    constructor() {
        super();

        const hashId: string = this.getAttribute(FASTStyle.hashIdDataSetName) as string;
        const css: string = this.getAttribute("css") as string;
        this.registerStyles(hashId, css);
    }

    /**
     * Register styles if they are not part of the cache and attach them
     */
    registerStyles = (hashId: string, css: string): void => {
        if (DOM.supportsAdoptedStyleSheets) {
            if (!(hashId in FASTStyle.cache)) {
                this.memoizeAdoptedStylesheetStyles(hashId, css);
            }
            this.attachAdoptedStylesheetStyles(this.parentNode as StyleTarget, hashId);
        } else {
            if (!(hashId in FASTStyle.cache)) {
                this.memoizeStyleElementStyles(hashId, css);
            }
            this.attachStyleElementStyles(this.parentNode as StyleTarget, hashId);
        }
    };

    /**
     * Memoize CSSStyleSheets
     */
    memoizeAdoptedStylesheetStyles(hashId: string, css: string) {
        const sheet = new CSSStyleSheet();
        (sheet as any).replaceSync(css);
        FASTStyle.cache[hashId] = sheet;
    }

    /**
     * Attach CSSStyleSheets
     */
    attachAdoptedStylesheetStyles(shadowRoot: StyleTarget, hashId: string) {
        shadowRoot.adoptedStyleSheets = [
            ...shadowRoot.adoptedStyleSheets!,
            FASTStyle.cache[hashId] as CSSStyleSheet,
        ];
    }

    /**
     * Memoize css strings
     */
    memoizeStyleElementStyles(hashId: string, css: string) {
        FASTStyle.cache[hashId] = css;
    }

    /**
     * Attach style elements
     */
    attachStyleElementStyles(shadowRoot: StyleTarget, hashId: string) {
        const element = document.createElement("style");
        element.innerHTML = FASTStyle.cache[hashId] as string;
        shadowRoot.append(element);
    }
}

customElements.define("fast-style", FASTStyle);
