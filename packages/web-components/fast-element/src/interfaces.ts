/**
 * Represents a callable type such as a function or an object with a "call" method.
 * @public
 */
export type Callable = typeof Function.prototype.call | { call(): void };

/**
 * Allows for the creation of Constructable mixin classes.
 *
 * @public
 */
export type Constructable<T = {}> = {
    new (...args: any[]): T;
};

/**
 * Reverses all readonly members, making them mutable.
 * @internal
 */
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

/**
 * A policy for use with the standard trustedTypes platform API.
 * @public
 */
export type TrustedTypesPolicy = {
    /**
     * Creates trusted HTML.
     * @param html - The HTML to clear as trustworthy.
     */
    createHTML(html: string): string;
};

/**
 * Enables working with trusted types.
 * @public
 */
export type TrustedTypes = {
    /**
     * Creates a trusted types policy.
     * @param name - The policy name.
     * @param rules - The policy rules implementation.
     */
    createPolicy(name: string, rules: TrustedTypesPolicy): TrustedTypesPolicy;
};

/**
 * The FAST global.
 * @internal
 */
export interface FASTGlobal {
    /**
     * The list of loaded versions.
     */
    readonly versions: string[];

    /**
     * Gets a kernel value.
     * @param id - The id to get the value for.
     * @param initialize - Creates the initial value for the id if not already existing.
     */
    getById<T>(id: string | number): T | null;
    getById<T>(id: string | number, initialize: () => T): T;
}

/**
 * Core services shared across FAST instances.
 * @internal
 */
export const enum KernelServiceId {
    updateQueue = 1,
    observable = 2,
    contextEvent = 3,
    elementRegistry = 4,
    styleSheetStrategy = 5,
}

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

/**
 * @internal
 */
export const isFunction = (object: any): object is Function =>
    typeof object === "function";

/**
 * @internal
 */
export const isString = (object: any): object is string => typeof object === "string";
