/**
 * The type of HTML aspect to target.
 * @public
 */
export const DOMAspect = Object.freeze({
    /**
     * Not aspected.
     */
    none: 0 as const,

    /**
     * An attribute.
     */
    attribute: 1 as const,

    /**
     * A boolean attribute.
     */
    booleanAttribute: 2 as const,

    /**
     * A property.
     */
    property: 3 as const,

    /**
     * Content
     */
    content: 4 as const,

    /**
     * A token list.
     */
    tokenList: 5 as const,

    /**
     * An event.
     */
    event: 6 as const,
} as const);

/**
 * The type of HTML aspect to target.
 * @public
 */
export type DOMAspect = (typeof DOMAspect)[Exclude<keyof typeof DOMAspect, "none">];
