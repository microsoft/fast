/**
 * Gets the document's scrollY
 *
 * @public
 */
export function scrollY(): number {
    if (typeof window === "undefined") {
        return NaN;
    }

    return typeof window.scrollY !== "undefined" ? window.scrollY : window.pageYOffset;
}
