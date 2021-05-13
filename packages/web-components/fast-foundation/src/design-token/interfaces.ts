/**
 * A {@link (DesignToken:interface)} value that is derived. These values can depend on other {@link (DesignToken:interface)}s
 * or arbitrary observable properties.
 * @alpha
 */
export type DerivedDesignTokenValue<T> = T extends Function
    ? never
    : (target: HTMLElement) => T;

/**
 * A design token value with no observable dependencies
 * @alpha
 */
export type StaticDesignTokenValue<T> = T extends Function ? never : T;

/**
 * The type that a {@link (DesignToken:interface)} can be set to.
 * @alpha
 */
export type DesignTokenValue<T> = StaticDesignTokenValue<T> | DerivedDesignTokenValue<T>;

/**
 * Describes a {@link (DesignToken:interface)} configuration
 * @alpha
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
