export function isComment(node: Node): node is Comment {
    return node.nodeType === 8;
}

export function isText(node: Node): node is Text {
    return node.nodeType === 3;
}

function getNodeLength(node: Node): number {
    return isComment(node) || isText(node) ? node.data.length : node.childNodes.length;
}

const hydrationNodeMask = 133;

/**
 * Returns a range object inclusive of all nodes including and between the
 * provided first and last node.
 * @param first - The first node
 * @param last - This last node
 * @returns
 */
export function createRangeForNodes(first: Node, last: Node): Range {
    const range = document.createRange();
    range.setStart(first, 0);

    // The lastIndex should be inclusive of the end of the lastChild. Obtain offset based
    // on usageNotes:  https://developer.mozilla.org/en-US/docs/Web/API/Range/setEnd#usage_notes
    range.setEnd(last, getNodeLength(last));
    return range;
}

export type HydrationMove = (sibling?: boolean) => Node | null;

type HydrationTraversal = [
    move: HydrationMove,
    update: () => void,
    prepareForMutation: () => void,
];

function createRangeHydrationTraversal(
    firstNode: Node,
    lastNode: Node,
    currentNode = firstNode,
): [HydrationMove, () => void] {
    const range = createRangeForNodes(firstNode, lastNode);
    let walker =
        range.startContainer === firstNode
            ? document.createTreeWalker(range.commonAncestorContainer, hydrationNodeMask)
            : null;
    let hasReachedLastNode = lastNode.contains(currentNode);
    let mutationMode = false;

    if (walker !== null) {
        walker.currentNode = currentNode;
    }

    function move(sibling?: boolean): Node | null {
        if (
            walker === null ||
            (!mutationMode && sibling && walker.currentNode.contains(lastNode))
        ) {
            return null;
        }

        const current = walker.currentNode;
        const candidate = sibling ? walker.nextSibling() : walker.nextNode();

        if (mutationMode || !hasReachedLastNode || lastNode.contains(candidate)) {
            if (candidate === lastNode) {
                hasReachedLastNode = true;
            }

            return candidate;
        }

        walker.currentNode = current;
        return null;
    }

    return [
        move,
        () => {
            // Unchanged live endpoints necessarily intersect their own boundary nodes.
            if (
                walker !== null &&
                !mutationMode &&
                (range.startContainer !== firstNode ||
                    range.endContainer !== lastNode ||
                    range.endOffset !== getNodeLength(lastNode) ||
                    (walker.currentNode !== firstNode &&
                        walker.currentNode !== lastNode &&
                        !range.intersectsNode(walker.currentNode)))
            ) {
                const current = walker.currentNode;
                walker = document.createTreeWalker(walker.root, walker.whatToShow, {
                    acceptNode: node =>
                        range.comparePoint(node, 0) === 0
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT,
                });
                walker.currentNode = current;
                mutationMode = true;
            }
        },
    ];
}

export function createHydrationTraversal(
    firstNode: Node,
    lastNode: Node,
): HydrationTraversal {
    const parent = firstNode.parentNode;
    if (
        parent === null ||
        parent !== lastNode.parentNode ||
        (firstNode !== lastNode &&
            !(
                firstNode.compareDocumentPosition(lastNode) &
                Node.DOCUMENT_POSITION_FOLLOWING
            ))
    ) {
        const [move, update] = createRangeHydrationTraversal(firstNode, lastNode);
        return [move, update, () => {}];
    }

    let current = firstNode;
    let rangeTraversal: ReturnType<typeof createRangeHydrationTraversal> | null = null;

    function move(sibling = false): Node | null {
        if (rangeTraversal !== null) {
            return rangeTraversal[0](sibling);
        }
        if (sibling && current === lastNode) {
            return null;
        }

        let candidate: Node | null = current;
        do {
            if (sibling) {
                if (candidate === lastNode) {
                    return null;
                }
                candidate = candidate.nextSibling;
            } else {
                let ancestor: Node | null = candidate;
                candidate = candidate.firstChild;
                while (candidate === null) {
                    if (ancestor === lastNode) {
                        return null;
                    }
                    candidate = ancestor.nextSibling;
                    ancestor = ancestor.parentNode;
                    if (ancestor === parent || ancestor === null) {
                        break;
                    }
                }
            }
        } while (
            candidate !== null &&
            !(hydrationNodeMask & (1 << (candidate.nodeType - 1)))
        );
        if (candidate !== null) {
            current = candidate;
        }
        return candidate;
    }

    return [
        move,
        () => rangeTraversal?.[1](),
        () => {
            // Capture live boundaries before user callbacks can move either endpoint.
            rangeTraversal ??= createRangeHydrationTraversal(
                firstNode,
                lastNode,
                current,
            );
        },
    ];
}
