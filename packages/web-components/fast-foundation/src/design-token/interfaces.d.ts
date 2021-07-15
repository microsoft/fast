/**
 * A {@link (DesignToken:interface)} value that is derived. These values can depend on other {@link (DesignToken:interface)}s
 * or arbitrary observable properties.
 * @public
 */
export declare type DerivedDesignTokenValue<T> = T extends Function
    ? never
    : (target: HTMLElement) => T;
/**
 * A design token value with no observable dependencies
 * @public
 */
export declare type StaticDesignTokenValue<T> = T extends Function ? never : T;
/**
 * The type that a {@link (DesignToken:interface)} can be set to.
 * @public
 */
export declare type DesignTokenValue<T> =
    | StaticDesignTokenValue<T>
    | DerivedDesignTokenValue<T>;
/**
 * Describes a {@link (DesignToken:interface)} configuration
 * @public
 */
export interface DesignTokenConfiguration {
    /**
     * The name of the {@link (DesignToken:interface)}.
     */
    name: string;
    /**
     * The name of the CSS custom property to associate to the {@link (DesignToken:interface)}, or null
     * if not CSS custom property should be associated.
     */
    cssCustomPropertyName?: string | null;
}
