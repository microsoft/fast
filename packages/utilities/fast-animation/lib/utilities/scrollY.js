/**
 * Gets the document's scrollY
 */
export default function scrollY() {
    if (typeof window === "undefined") {
        return NaN;
    }
    return typeof window.scrollY !== "undefined" ? window.scrollY : window.pageYOffset;
}
