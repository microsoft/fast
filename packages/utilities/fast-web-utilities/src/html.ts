export interface ClientRectWithMargin {
    width: number;
    height: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export function convertStylePropertyPixelsToNumber(
    computedStyle: CSSStyleDeclaration | null | undefined,
    property: string | null | undefined
): number | void {
    if (!computedStyle || !property) {
        return;
    }

    return parseInt(
        computedStyle
            .getPropertyValue(property)
            .substring(0, computedStyle.getPropertyValue(property).length - 2),
        10
    );
}

/**
 * Gets the client bounding rectangle including any margins of an element.
 */
export function getClientRectWithMargin(
    element: HTMLElement | null | undefined
): ClientRectWithMargin | undefined {
    if (!element) {
        return;
    }

    const rect: DOMRect = element.getBoundingClientRect();
    const style: CSSStyleDeclaration = window.getComputedStyle(element, null);
    const clone: ClientRectWithMargin = {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
    };

    clone.width += convertStylePropertyPixelsToNumber(style, "margin-left") as number;
    clone.width += convertStylePropertyPixelsToNumber(style, "margin-right") as number;
    clone.height += convertStylePropertyPixelsToNumber(style, "margin-top") as number;
    clone.height += convertStylePropertyPixelsToNumber(style, "margin-bottom") as number;

    return clone;
}
