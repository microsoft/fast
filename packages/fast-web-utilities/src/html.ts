export interface ClientRectWithMargin {
    width: number;
    height: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
}

/**
 * Gets the client bounding rectangle including any margins of an element.
 */
export function getClientRectWithMargin(element: HTMLElement): ClientRectWithMargin {
    if (!element) {
        return;
    }

    const rect: ClientRect = element.getBoundingClientRect();
    const style: CSSStyleDeclaration = window.getComputedStyle(element, null);
    const clone: ClientRectWithMargin = {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
    };

    clone.width += convertStylePropertyPixelsToNumber(style, "margin-left");
    clone.width += convertStylePropertyPixelsToNumber(style, "margin-right");
    clone.height += convertStylePropertyPixelsToNumber(style, "margin-top");
    clone.height += convertStylePropertyPixelsToNumber(style, "margin-bottom");

    return clone;
}

export function convertStylePropertyPixelsToNumber(computedStyle: CSSStyleDeclaration, property: string): number {
    if (!computedStyle || !property) {
        return;
    }

    return parseInt(computedStyle.getPropertyValue(property).substring(0, computedStyle.getPropertyValue(property).length - 2), 10);
}
