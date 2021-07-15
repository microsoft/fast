import type { Behavior } from "../observation/behavior";
import type { ComposableStyles } from "./element-styles";
/**
 * Directive for use in {@link css}.
 *
 * @public
 */
export declare class CSSDirective {
    /**
     * Creates a CSS fragment to interpolate into the CSS document.
     * @returns - the string to interpolate into CSS
     */
    createCSS(): ComposableStyles;
    /**
     * Creates a behavior to bind to the host element.
     * @returns - the behavior to bind to the host element, or undefined.
     */
    createBehavior(): Behavior | undefined;
}
