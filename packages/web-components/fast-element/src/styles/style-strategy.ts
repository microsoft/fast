/**
 * A node that can be targeted by styles.
 * @public
 */
export interface StyleTarget extends Pick<Node, "getRootNode"> {
    /**
     * Stylesheets to be adopted by the node.
     */
    adoptedStyleSheets?: CSSStyleSheet[];

    /**
     * Adds styles to the target by appending the styles.
     * @param styles - The styles element to add.
     */
    append(styles: HTMLStyleElement): void;

    /**
     * Removes styles from the target.
     * @param styles - The styles element to remove.
     */
    removeChild(styles: HTMLStyleElement): void;

    /**
     * Returns all element descendants of node that match selectors.
     * @param selectors - The CSS selector to use for the query.
     */
    querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
}
/**
 * Implemented to provide specific behavior when adding/removing styles
 * for elements.
 * @public
 */
export interface StyleStrategy {
    /**
     * Adds styles to the target.
     * @param target - The target to add the styles to.
     */
    addStylesTo(target: StyleTarget): void;

    /**
     * Removes styles from the target.
     * @param target - The target to remove the styles from.
     */
    removeStylesFrom(target: StyleTarget): void;
}
