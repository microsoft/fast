/**
 * Retrieves the "composed parent" element of a node, ignoring DOM tree boundaries.
 * When the parent of a node is a shadow-root, it will return the host
 * element of the shadow root. Otherwise it will return the parent node or null if
 * no parent node exists.
 * @param element - The element for which to retrieve the composed parent
 *
 * @public
 */
export function composedParent<T extends HTMLElement>(element: T): HTMLElement | null {
    const parentNode = element.parentElement;

    if (parentNode) {
        return parentNode;
    } else {
        const rootNode = element.getRootNode();

        if ((rootNode as ShadowRoot).host instanceof HTMLElement) {
            // this is shadow-root
            return (rootNode as ShadowRoot).host as HTMLElement;
        }
    }

    return null;
}

/**
 * Determines if the reference element contains the test element in a "composed" DOM tree that
 * ignores shadow DOM boundaries.
 *
 * Returns true of the test element is a descendent of the reference, or exist in
 * a shadow DOM that is a logical descendent of the reference. Otherwise returns false.
 * @param reference - The element to test for containment against.
 * @param test - The element being tested for containment.
 *
 * @public
 */
export function composedContains(reference: HTMLElement, test: HTMLElement): boolean {
    let current: HTMLElement | null = test;

    while (current !== null) {
        if (current === reference) {
            return true;
        }

        current = composedParent(current);
    }

    return false;
}

export class UnobservableMutationObserver extends MutationObserver {
    private observedNodes: Set<Node> = new Set();

    /**
     * An extension of MutationObserver that supports unobserving nodes.
     * @param callback - The callback to invoke when observed nodes are changed.
     */
    constructor(private readonly callback: MutationCallback) {
        function handler(mutations: MutationRecord[]) {
            this.callback.call(
                null,
                mutations.filter(record => this.observedNodes.has(record.target))
            );
        }

        super(handler);
    }

    public observe(target: Node, options?: MutationObserverInit | undefined): void {
        this.observedNodes.add(target);
        super.observe(target, options);
    }

    public unobserve(target: Node): void {
        this.observedNodes.delete(target);

        if (this.observedNodes.size < 1) {
            this.disconnect();
        }
    }
}
