export interface DesignTokenDefinition<T> {
    /**
     * The key for which the token can be accessed.
     */
    key: string;

    /**
     * The CSS custom property name
     */
    customProperty?: string;

    /**
     * The default value.
     */
    value?: T;
}
