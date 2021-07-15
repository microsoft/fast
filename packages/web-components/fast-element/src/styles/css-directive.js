/**
 * Directive for use in {@link css}.
 *
 * @public
 */
export class CSSDirective {
    /**
     * Creates a CSS fragment to interpolate into the CSS document.
     * @returns - the string to interpolate into CSS
     */
    createCSS() {
        return "";
    }
    /**
     * Creates a behavior to bind to the host element.
     * @returns - the behavior to bind to the host element, or undefined.
     */
    createBehavior() {
        return undefined;
    }
}
