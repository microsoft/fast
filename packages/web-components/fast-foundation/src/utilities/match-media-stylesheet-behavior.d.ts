import type { Behavior, ElementStyles, FASTElement } from "@microsoft/fast-element";
/**
 * An event listener fired by a {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList | MediaQueryList }.
 * @public
 */
export declare type MediaQueryListListener = (
    this: MediaQueryList,
    ev?: MediaQueryListEvent
) => void;
/**
 * An abstract behavior to react to media queries. Implementations should implement
 * the `constructListener` method to perform some action based on media query changes.
 *
 * @public
 */
export declare abstract class MatchMediaBehavior implements Behavior {
    /**
     * The media query that the behavior operates on.
     */
    readonly query: MediaQueryList;
    /**
     *
     * @param query - The media query to operate from.
     */
    constructor(query: MediaQueryList);
    /**
     * Constructs a function that will be invoked with the MediaQueryList context
     * @param source - the element the behavior is acting on.
     */
    protected abstract constructListener(
        source: typeof FASTElement
    ): MediaQueryListListener;
    /**
     * Binds the behavior to the element.
     * @param source - The element for which the behavior is bound.
     */
    bind(source: typeof FASTElement & HTMLElement): void;
    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     */
    unbind(source: typeof FASTElement & HTMLElement): void;
    /**
     * The behavior needs to operate on element instances but elements might share a behavior instance.
     * To ensure proper attachment / detachment per instance, we construct a listener for
     * each bind invocation and cache the listeners by element reference.
     */
    private listenerCache;
}
/**
 * A behavior to add or remove a stylesheet from an element based on a media query. The behavior ensures that
 * styles are applied while the a query matches the environment and that styles are not applied if the query does
 * not match the environment.
 *
 * @public
 */
export declare class MatchMediaStyleSheetBehavior extends MatchMediaBehavior {
    /**
     * The media query that the behavior operates on.
     */
    readonly query: MediaQueryList;
    /**
     * The styles object to be managed by the behavior.
     */
    readonly styles: ElementStyles;
    /**
     * Constructs a {@link MatchMediaStyleSheetBehavior} instance.
     * @param query - The media query to operate from.
     * @param styles - The styles to coordinate with the query.
     */
    constructor(query: MediaQueryList, styles: ElementStyles);
    /**
     * Defines a function to construct {@link MatchMediaStyleSheetBehavior | MatchMediaStyleSheetBehaviors} for
     * a provided query.
     * @param query - The media query to operate from.
     *
     * @public
     * @example
     *
     * ```ts
     * import { css } from "@microsoft/fast-element";
     * import { MatchMediaStyleSheetBehavior } from "@microsoft/fast-foundation";
     *
     * const landscapeBehavior = MatchMediaStyleSheetBehavior.with(
     *   window.matchMedia("(orientation: landscape)")
     * );
     * const styles = css`
     *   :host {
     *     width: 200px;
     *     height: 400px;
     *   }
     * `
     * .withBehaviors(landscapeBehavior(css`
     *   :host {
     *     width: 400px;
     *     height: 200px;
     *   }
     * `))
     * ```
     */
    static with(
        query: MediaQueryList
    ): (styles: ElementStyles) => MatchMediaStyleSheetBehavior;
    /**
     * Constructs a match-media listener for a provided element.
     * @param source - the element for which to attach or detach styles.
     * @internal
     */
    protected constructListener(source: typeof FASTElement): MediaQueryListListener;
    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     * @internal
     */
    unbind(source: typeof FASTElement & HTMLElement): void;
}
/**
 * This can be used to construct a behavior to apply a forced-colors only stylesheet.
 * @public
 */
export declare const forcedColorsStylesheetBehavior: (
    styles: ElementStyles
) => MatchMediaStyleSheetBehavior;
/**
 * This can be used to construct a behavior to apply a prefers color scheme: dark only stylesheet.
 * @public
 */
export declare const darkModeStylesheetBehavior: (
    styles: ElementStyles
) => MatchMediaStyleSheetBehavior;
/**
 * This can be used to construct a behavior to apply a prefers color scheme: light only stylesheet.
 * @public
 */
export declare const lightModeStylesheetBehavior: (
    styles: ElementStyles
) => MatchMediaStyleSheetBehavior;
