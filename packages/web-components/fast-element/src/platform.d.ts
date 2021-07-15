/**
 * A policy for use with the standard trustedTypes platform API.
 * @public
 */
export declare type TrustedTypesPolicy = {
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
export declare type TrustedTypes = {
    /**
     * Creates a trusted types policy.
     * @param name - The policy name.
     * @param rules - The policy rules implementation.
     */
    createPolicy(name: string, rules: TrustedTypesPolicy): TrustedTypesPolicy;
};
/**
 * The platform global type.
 * @public
 */
export declare type Global = typeof globalThis & {
    /**
     * Enables working with trusted types.
     */
    trustedTypes: TrustedTypes;
};
/**
 * A reference to globalThis, with support
 * for browsers that don't yet support the spec.
 * @public
 */
export declare const $global: Global;
/**
 * A readonly, empty array.
 * @remarks
 * Typically returned by APIs that return arrays when there are
 * no actual items to return.
 * @internal
 */
export declare const emptyArray: readonly any[];
