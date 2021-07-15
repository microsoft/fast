/**
 * Caching mechanism for CSS custom properties
 */
declare class CustomPropertyManagerImpl {
    private static cache;
    private static appliedCache;
    /**
     * {@inheritdoc CustomPropertyManager.get}
     */
    private getElementStyles;
    private getOrCreateAppliedCache;
    /**
     * Creates an ElementStyles with the key/value CSS custom property
     * on the host
     */
    private createElementStyles;
    addTo(
        element: HTMLElement,
        token: {
            cssCustomProperty: string;
        },
        value: any
    ): void;
    removeFrom(
        element: HTMLElement,
        token: {
            cssCustomProperty: string;
        }
    ): void;
}
/**
 * @internal
 */
export declare const CustomPropertyManager: CustomPropertyManagerImpl;
export {};
