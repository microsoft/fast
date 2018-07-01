/**
 * Gets the client bounding rectangle including any margins of an element.
 */
export function getClientRectWithMargin(element: HTMLElement): ClientRect | DOMRect {
    if (!element) {
        return;
    }

    const clone: any = element.getBoundingClientRect();
    const style: CSSStyleDeclaration = window.getComputedStyle(element, null);

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
