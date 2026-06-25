interface StyleCache {
    [key: string]: CSSStyleSheet | string;
}

/**
 * The FASTStyle web component that takes attributes:
 * - css - a string version of the CSS to be applied to the parent web component, this can be omitted if the style-id has been used in the DOM as the cached value will be fetched
 * - style-id - a dataset attribute used as an identifier for the CSS attr string
 */
export default class FASTStyle extends HTMLElement {
    private static cache: StyleCache = {};
    private static hashIdDataSetName: string = "style-id";
    private static supportsAdoptedStyleSheets: boolean =
        Array.isArray((document as any).adoptedStyleSheets) &&
        "replace" in CSSStyleSheet.prototype;

    /**
     * @internal
     */
    public connectedCallback(): void {
        const hashId: string = this.getAttribute(FASTStyle.hashIdDataSetName) as string;
        const css: string = this.getAttribute("css") as string;
        this.registerStyles(hashId, css);
    }

    /**
     * Register styles if they are not part of the cache and attach them
     */
    private registerStyles = (hashId: string, css: string): void => {
        if (FASTStyle.supportsAdoptedStyleSheets) {
            if (!(hashId in FASTStyle.cache)) {
                this.memoizeAdoptedStylesheetStyles(hashId, css);
            }
            this.attachAdoptedStylesheetStyles(this.parentNode as ShadowRoot, hashId);
        } else {
            if (!(hashId in FASTStyle.cache)) {
                this.memoizeStyleElementStyles(hashId, css);
            }
            this.attachStyleElementStyles(this.parentNode as ShadowRoot, hashId);
        }
    };

    /**
     * Memoize CSSStyleSheets
     */
    private memoizeAdoptedStylesheetStyles(hashId: string, css: string) {
        const sheet = new CSSStyleSheet();
        (sheet as any).replaceSync(css);
        FASTStyle.cache[hashId] = sheet;
    }

    /**
     * Attach CSSStyleSheets
     */
    private attachAdoptedStylesheetStyles(shadowRoot: ShadowRoot, hashId: string) {
        (shadowRoot as any).adoptedStyleSheets = [
            ...(shadowRoot as any).adoptedStyleSheets!,
            FASTStyle.cache[hashId] as CSSStyleSheet,
        ];
    }

    /**
     * Memoize css strings
     */
    private memoizeStyleElementStyles(hashId: string, css: string) {
        FASTStyle.cache[hashId] = css;
    }

    /**
     * Attach style elements
     */
    private attachStyleElementStyles(shadowRoot: ShadowRoot, hashId: string) {
        const element = document.createElement("style");
        element.innerHTML = FASTStyle.cache[hashId] as string;
        shadowRoot.append(element);
    }
}

export const fastStyleTagName = "fast-style";
customElements.define(fastStyleTagName, FASTStyle);
