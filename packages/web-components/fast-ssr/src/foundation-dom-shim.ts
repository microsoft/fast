import {
    createWindow as createMinimalWindow,
    CSSStyleSheet as MinimalCSSStyleSheet,
} from "./dom-shim.js";

/**
 * Shim of MediaQueryList.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList} */
export class MediaQueryList {
    /** No-op */
    addListener() {}

    /** Always false */
    matches = false;
}

export interface CSSRule {}
export class CSSStyleSheet extends MinimalCSSStyleSheet {
    public readonly cssRules: CSSRule[] = [];
    insertRule(rule: CSSRule, index: number = 0) {
        this.cssRules.splice(index, 0, rule);

        return index;
    }
}

export function createWindow(
    props: { [key: string]: unknown } = {}
): { [key: string]: unknown } {
    return createMinimalWindow({
        CSSStyleSheet,
        MediaQueryList,
        matchMedia: () => new MediaQueryList(),
        ...props,
    });
}
