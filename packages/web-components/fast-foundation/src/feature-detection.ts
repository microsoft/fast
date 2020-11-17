/**
 * True if adoptedStyleSheets and ConstructableStyleSheets are supported.
 */
const _supportsAdoptedStylesheets = "adoptedStyleSheets" in window.ShadowRoot.prototype;
export function supportsAdoptedStylesheets<
    T extends DocumentOrShadowRoot,
    K = { adoptedStyleSheets: CSSStyleSheet[] }
>(doc: T): doc is T & K {
    return _supportsAdoptedStylesheets;
}
