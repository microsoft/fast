export interface ClientRectWithMargin {
    width: number;
    height: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
}
export declare function convertStylePropertyPixelsToNumber(
    computedStyle: CSSStyleDeclaration,
    property: string
): number;
/**
 * Gets the client bounding rectangle including any margins of an element.
 */
export declare function getClientRectWithMargin(
    element: HTMLElement
): ClientRectWithMargin;
