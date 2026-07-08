/**
 * Retrieves the "composed parent" element of a node, ignoring DOM tree boundaries.
 * When the parent of a node is a shadow-root, it will return the host
 * element of the shadow root. Otherwise it will return the parent node or null if
 * no parent node exists.
 * @param element - The element for which to retrieve the composed parent
 *
 * @public
 */
export function composedParent<T extends HTMLElement>(element: T, asSlotted = false): HTMLElement | null {
    if (asSlotted && element.assignedSlot) {
        return element.assignedSlot;
    }

    return element.parentElement ?? shadowDomHost(element);
}

function shadowDomHost(element: HTMLElement): HTMLElement | null {
    const rootNode = element.getRootNode();

    if ((rootNode as ShadowRoot).host instanceof HTMLElement) {
        // this is shadow-root
        return (rootNode as ShadowRoot).host as HTMLElement;
    }

    return null;
}

export function closestAncestorDialog(element: HTMLElement): HTMLDialogElement | null {
    let node: HTMLElement | null = composedParent(element, true);
    while (node) {
        if (node instanceof HTMLDialogElement) {
            return node;
        }
        node = composedParent(node, true);
    }
    return null;
}
