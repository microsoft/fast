/**
 * An abstract behavior to react to media queries. Implementations should implement
 * the `constructListener` method to perform some action based on media query changes.
 *
 * @public
 */
export class MatchMediaBehavior {
    /**
     *
     * @param query - The media query to operate from.
     */
    constructor(query) {
        /**
         * The behavior needs to operate on element instances but elements might share a behavior instance.
         * To ensure proper attachment / detachment per instance, we construct a listener for
         * each bind invocation and cache the listeners by element reference.
         */
        this.listenerCache = new WeakMap();
        this.query = query;
    }
    /**
     * Binds the behavior to the element.
     * @param source - The element for which the behavior is bound.
     */
    bind(source) {
        const { query } = this;
        const listener = this.constructListener(source);
        // Invoke immediately to add if the query currently matches
        listener.bind(query)();
        query.addListener(listener);
        this.listenerCache.set(source, listener);
    }
    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     */
    unbind(source) {
        const listener = this.listenerCache.get(source);
        if (listener) {
            this.query.removeListener(listener);
            this.listenerCache.delete(source);
        }
    }
}
/**
 * A behavior to add or remove a stylesheet from an element based on a media query. The behavior ensures that
 * styles are applied while the a query matches the environment and that styles are not applied if the query does
 * not match the environment.
 *
 * @public
 */
export class MatchMediaStyleSheetBehavior extends MatchMediaBehavior {
    /**
     * Constructs a {@link MatchMediaStyleSheetBehavior} instance.
     * @param query - The media query to operate from.
     * @param styles - The styles to coordinate with the query.
     */
    constructor(query, styles) {
        super(query);
        this.styles = styles;
    }
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
    static with(query) {
        return styles => {
            return new MatchMediaStyleSheetBehavior(query, styles);
        };
    }
    /**
     * Constructs a match-media listener for a provided element.
     * @param source - the element for which to attach or detach styles.
     * @internal
     */
    constructListener(source) {
        let attached = false;
        const styles = this.styles;
        return function listener() {
            const { matches } = this;
            if (matches && !attached) {
                source.$fastController.addStyles(styles);
                attached = matches;
            } else if (!matches && attached) {
                source.$fastController.removeStyles(styles);
                attached = matches;
            }
        };
    }
    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     * @internal
     */
    unbind(source) {
        super.unbind(source);
        source.$fastController.removeStyles(this.styles);
    }
}
/**
 * This can be used to construct a behavior to apply a forced-colors only stylesheet.
 * @public
 */
export const forcedColorsStylesheetBehavior = MatchMediaStyleSheetBehavior.with(
    window.matchMedia("(forced-colors)")
);
/**
 * This can be used to construct a behavior to apply a prefers color scheme: dark only stylesheet.
 * @public
 */
export const darkModeStylesheetBehavior = MatchMediaStyleSheetBehavior.with(
    window.matchMedia("(prefers-color-scheme: dark)")
);
/**
 * This can be used to construct a behavior to apply a prefers color scheme: light only stylesheet.
 * @public
 */
export const lightModeStylesheetBehavior = MatchMediaStyleSheetBehavior.with(
    window.matchMedia("(prefers-color-scheme: light)")
);
