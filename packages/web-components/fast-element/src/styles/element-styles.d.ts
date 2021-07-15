import type { Behavior } from "../observation/behavior";
/**
 * A node that can be targeted by styles.
 * @public
 */
export interface StyleTarget {
    /**
     * Stylesheets to be adopted by the node.
     */
    adoptedStyleSheets?: CSSStyleSheet[];
    /**
     * Adds styles to the target.
     * @param styles - The styles element to add.
     */
    prepend(styles: HTMLStyleElement): void;
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
 * Represents styles that can be composed into the ShadowDOM of a custom element.
 * @public
 */
export declare type ComposableStyles = string | ElementStyles | CSSStyleSheet;
/**
 * Creates an ElementStyles instance for an array of ComposableStyles.
 * @public
 */
export declare type ElementStyleFactory = (
    styles: ReadonlyArray<ComposableStyles>
) => ElementStyles;
/**
 * Represents styles that can be applied to a custom element.
 * @public
 */
export declare abstract class ElementStyles {
    private targets;
    /** @internal */
    abstract readonly styles: ReadonlyArray<ComposableStyles>;
    /** @internal */
    abstract readonly behaviors: ReadonlyArray<Behavior> | null;
    /** @internal */
    addStylesTo(target: StyleTarget): void;
    /** @internal */
    removeStylesFrom(target: StyleTarget): void;
    /** @internal */
    isAttachedTo(target: StyleTarget): boolean;
    /**
     * Associates behaviors with this set of styles.
     * @param behaviors - The behaviors to associate.
     */
    withBehaviors(...behaviors: Behavior[]): this;
    /**
     * Create ElementStyles from ComposableStyles.
     */
    static readonly create: ElementStyleFactory;
}
/**
 * https://wicg.github.io/construct-stylesheets/
 * https://developers.google.com/web/updates/2019/02/constructable-stylesheets
 *
 * @internal
 */
export declare class AdoptedStyleSheetsStyles extends ElementStyles {
    styles: ComposableStyles[];
    private styleSheetCache;
    private _styleSheets;
    private get styleSheets();
    readonly behaviors: ReadonlyArray<Behavior> | null;
    constructor(styles: ComposableStyles[], styleSheetCache: Map<string, CSSStyleSheet>);
    addStylesTo(target: StyleTarget): void;
    removeStylesFrom(target: StyleTarget): void;
}
/**
 * @internal
 */
export declare class StyleElementStyles extends ElementStyles {
    styles: ComposableStyles[];
    private readonly styleSheets;
    private readonly styleClass;
    readonly behaviors: ReadonlyArray<Behavior> | null;
    constructor(styles: ComposableStyles[]);
    addStylesTo(target: StyleTarget): void;
    removeStylesFrom(target: StyleTarget): void;
    isAttachedTo(target: StyleTarget): boolean;
    private normalizeTarget;
}
