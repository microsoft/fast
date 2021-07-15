/**
 * A test that ensures that all arguments are HTML Elements
 */
export declare function isHTMLElement(...args: any[]): boolean;
/**
 * Returns all displayed elements inside of a root node that match a provided selector
 */
export declare function getDisplayedNodes(
    rootNode: HTMLElement,
    selector: string
): HTMLElement[] | void;
/**
 * Gets the numeric key code associated with a keyboard event. This method is for use with DOM level 3 events
 * that still use the deprecated keyCode property.
 */
export declare function getKeyCode(event: KeyboardEvent): number;
export declare function canUseFocusVisible(): boolean;
export declare function canUseCssGrid(): boolean;
export declare function canUseForcedColors(): boolean;
export declare function resetDocumentCache(): void;
/**
 * @deprecated Use 'canUseForcedColors' instead
 */
export declare const canUsedForcedColors: typeof canUseForcedColors;
