/**
 * Check if an element is a descendent of another element.
 */
export function isDescendant(parent: (HTMLElement | Element), child: (HTMLElement | Element)): boolean {
    if (!parent || !child) {
        return false;
    }

    let node: Node = child.parentNode;

    while (!!node) {
        if (node === parent) {
            return true;
        }

        node = node.parentNode;
    }

    return false;
}

/**
 * Gets the numeric key code associated with a keyboard event. This method is for use with DOM level 3 events
 * that still use the deprecated keyCode property.
 */
export function getKeyCode(event: KeyboardEvent): number {
    return (event === null) ? null : event.which || event.keyCode || event.charCode;
}
