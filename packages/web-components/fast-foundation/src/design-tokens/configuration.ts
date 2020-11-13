export interface DesignTokenRegistration<T> {
    /**
     * The key for which the token can be accessed.
     */
    key: string;

    /**
     * The HTML attribute name
     */
    attribute?: string;

    /**
     * The CSS custom property name
     */
    customProperty?: string;

    /**
     * The default value.
     */
    value?: T;
}
