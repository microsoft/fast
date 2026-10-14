import type {
    CompiledViewBehaviorFactory,
    ViewBehaviorFactory,
    ViewBehaviorTargets,
} from "../templating/html-directive.js";
import {
    getHostName,
    getHydrationDiagnostic,
    type HydrationMismatchActual,
    type HydrationMismatchExpectation,
} from "./diagnostics.js";
import {
    getHydrationMarkers,
    type HydrationMarkerStrategy,
    HydrationMarkup,
} from "./markers.js";
import {
    expectedContentAfterStartMarker,
    expectedContentEndMarker,
    expectedElementBoundaryEndMarker,
    formatNoMoreAttributeBindings,
    formatNoMoreContentBindings,
} from "./messages.js";

export class HydrationTargetElementError extends Error {
    /**
     * String representation of the HTML in the template that
     * threw the target element error.
     */
    public templateString?: string;

    constructor(
        /**
         * The error message
         */
        message: string | undefined,
        /**
         * The Compiled View Behavior Factories that belong to the view.
         */
        public readonly factories: CompiledViewBehaviorFactory[],
        /**
         * The node to target factory.
         */
        public readonly node: Node,
        /**
         * Structured description of the binding the hydration walk was
         * attempting to apply when the mismatch was detected. Free-form
         * string for structural errors that do not correspond to a single
         * binding factory.
         */
        public readonly expected?: HydrationMismatchExpectation | string,
        /**
         * Structured description of the server-rendered DOM that was
         * encountered at the mismatch point.
         */
        public readonly received?: HydrationMismatchActual,
    ) {
        super(message);
    }
}

/**
 * Represents the DOM boundaries controlled by a view
 * @public
 */
export interface ViewBoundaries {
    first: Node;
    last: Node;
}

/**
 * Stores relationships between a {@link ViewBehaviorFactory} and
 * the {@link ViewBoundaries} the factory created.
 * @public
 */
export interface ViewBehaviorBoundaries {
    [factoryId: string]: ViewBoundaries;
}

function isComment(node: Node): node is Comment {
    return node.nodeType === 8;
}

function isText(node: Node): node is Text {
    return node.nodeType === 3;
}

function getNodeLength(node: Node): number {
    return isComment(node) || isText(node) ? node.data.length : node.childNodes.length;
}

const hydrationNodeMask = 133;
const removeAttribute = Element.prototype.removeAttribute;
const getAttribute = Element.prototype.getAttribute;

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

type HydrationMove = (sibling?: boolean) => Node | null;

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

function createHydrationTraversal(
    firstNode: Node,
    lastNode: Node,
): [HydrationMove, () => void, () => void] {
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

function canMutateOnAttributeRemoval(element: Element): boolean {
    return (
        element.localName.includes("-") ||
        element.hasAttribute("is") ||
        "attributeChangedCallback" in element ||
        element.removeAttribute !== removeAttribute
    );
}

function throwHydrationError(
    node: Node,
    factories: CompiledViewBehaviorFactory[],
    expected: string,
): never {
    const result = getHydrationDiagnostic().formatStructuralError(
        node,
        getHostName(node),
        expected,
    );
    throw new HydrationTargetElementError(
        result.message,
        factories,
        node,
        result.expected,
        result.received,
    );
}

/**
 * Maps compiled ViewBehaviorFactory IDs to their corresponding DOM nodes in the
 * server-rendered shadow root. Scans the existing DOM between
 * firstNode and lastNode, processing data-free sequential hydration markers.
 *
 * A sequential factory pointer advances through the factories array in DFS order.
 * Since the template compiler and hydration walker both traverse the DOM in
 * identical depth-first order, no embedded indices are needed in markers.
 *
 * For element nodes: parses `data-fe="N"` to determine the count of attribute
 * binding factories, then consumes N factories sequentially.
 *
 * For comment nodes: `fe:b` markers consume the next factory for content bindings,
 * using balanced depth counting for nested marker pairing. `fe:e` markers cause
 * the walker to skip nested custom element subtrees.
 *
 * Host bindings (targetNodeId='h') appear at the start of the factories array but
 * have no SSR markers — getHydrationIndexOffset() computes the initial pointer value.
 *
 * @param firstNode - The first node of the view.
 * @param lastNode -  The last node of the view.
 * @param factories - The Compiled View Behavior Factories that belong to the view.
 * @returns - A {@link ViewBehaviorTargets } object for the factories in the view.
 */
export function buildViewBindingTargets(
    firstNode: Node,
    lastNode: Node,
    factories: CompiledViewBehaviorFactory[],
): { targets: ViewBehaviorTargets; boundaries: ViewBehaviorBoundaries } {
    const [move, update, prepareForMutation] = createHydrationTraversal(
        firstNode,
        lastNode,
    );

    const targets: ViewBehaviorTargets = {};
    const boundaries: ViewBehaviorBoundaries = {};
    const markers = getHydrationMarkers();
    const nativeMarkers = markers === HydrationMarkup;
    if (markers !== HydrationMarkup) {
        // Custom resolvers and cleanup callbacks may synchronously change the DOM.
        prepareForMutation();
    }

    // Sequential factory pointer — skip host bindings at the start
    const hydrationIndexOffset = getHydrationIndexOffset(factories);
    let factoryPointer = hydrationIndexOffset;

    let node: Node | null = firstNode;

    while (node !== null) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE: {
                const element = node as Element;
                if (element.getAttribute !== getAttribute) {
                    prepareForMutation();
                }
                if (nativeMarkers) {
                    const count = HydrationMarkup.parseAttributeBindingCount(element);
                    if (count !== null) {
                        if (count > 0xffffffff) {
                            // Preserve the existing resolver's invalid-array-length error.
                            HydrationMarkup.resolveAttributeBindings(
                                element,
                                factoryPointer,
                                hydrationIndexOffset,
                            );
                        }
                        for (let i = 0; i < count; i++) {
                            const factory = factories[factoryPointer++];
                            if (!factory) {
                                throwHydrationError(
                                    node,
                                    factories,
                                    formatNoMoreAttributeBindings(factories.length),
                                );
                            }
                            targetFactory(factory, node, targets);
                        }
                        if (canMutateOnAttributeRemoval(element)) {
                            prepareForMutation();
                        }
                        element.removeAttribute("data-fe");
                        update();
                    }
                    break;
                }
                const resolution = markers.resolveAttributeBindings(
                    element,
                    factoryPointer,
                    hydrationIndexOffset,
                );
                if (resolution !== null) {
                    factoryPointer = resolution.nextFactoryPointer;

                    for (const factoryIndex of resolution.factoryIndices) {
                        const factory = factories[factoryIndex];
                        if (!factory) {
                            throwHydrationError(
                                node,
                                factories,
                                formatNoMoreAttributeBindings(factories.length),
                            );
                        }
                        targetFactory(factory, node, targets);
                    }

                    if (canMutateOnAttributeRemoval(element)) {
                        prepareForMutation();
                    }
                    resolution.cleanup?.();
                    update();
                }
                break;
            }

            case 8: {
                const data = (node as Comment).data;
                if (
                    nativeMarkers
                        ? data === "fe:e"
                        : markers.isElementBoundaryStartMarker(node)
                ) {
                    // Element boundary — clear start marker and skip subtree
                    (node as Comment).data = "";
                    skipToElementBoundaryEnd(
                        move,
                        factories,
                        node,
                        markers,
                        nativeMarkers,
                    );
                } else {
                    let factoryIndex: number;
                    if (nativeMarkers) {
                        if (data !== "fe:b") {
                            break;
                        }
                        factoryIndex = factoryPointer++;
                    } else {
                        const resolution = markers.resolveContentBinding(
                            data,
                            factoryPointer,
                            hydrationIndexOffset,
                        );
                        if (resolution === null) {
                            break;
                        }
                        factoryPointer = resolution.nextFactoryPointer;
                        factoryIndex = resolution.factoryIndices[0];
                    }
                    const factory = factories[factoryIndex];
                    if (!factory) {
                        throwHydrationError(
                            node,
                            factories,
                            formatNoMoreContentBindings(factories.length),
                        );
                    }
                    targetContentBinding(
                        node as Comment,
                        move,
                        factory,
                        factories,
                        targets,
                        boundaries,
                        markers,
                        nativeMarkers,
                    );
                }
                break;
            }
        }

        node = move();
    }

    return { targets, boundaries };
}

function targetContentBinding(
    node: Comment,
    move: HydrationMove,
    factory: CompiledViewBehaviorFactory,
    factories: CompiledViewBehaviorFactory[],
    targets: ViewBehaviorTargets,
    boundaries: ViewBehaviorBoundaries,
    markers: HydrationMarkerStrategy,
    nativeMarkers: boolean,
) {
    let current: Node | null = move(true);
    node.data = "";

    if (current === null) {
        throwHydrationError(node, factories, expectedContentAfterStartMarker);
    }

    const first = current;

    // Balanced depth counting for nested content markers
    let depth = 0;
    while (current !== null) {
        if (isComment(current)) {
            if (
                nativeMarkers
                    ? current.data === "fe:b"
                    : markers.isContentBindingStartMarker(current.data)
            ) {
                depth++;
            } else if (
                nativeMarkers
                    ? current.data === "fe:/b"
                    : markers.isContentBindingEndMarker(current.data)
            ) {
                if (depth === 0) break;
                depth--;
            }
        }
        current = move(true);
    }

    if (current === null) {
        throwHydrationError(node, factories, expectedContentEndMarker);
    }

    (current as Comment).data = "";

    if (isText(first) && first.nextSibling === current) {
        targetFactory(factory, first, targets);
    } else {
        // If current === first, it means there is no content in
        // the view. This happens when a `when` directive evaluates false,
        // or whenever a content binding returns null or undefined.
        if (current !== first && current.previousSibling !== null) {
            boundaries[factory.targetNodeId] = {
                first,
                last: current.previousSibling,
            };
        }
        // Insert a text node so text content binding targets it
        targetFactory(
            factory,
            current.parentNode!.insertBefore(document.createTextNode(""), current),
            targets,
        );
    }
}

/**
 * Skips past a nested custom element's shadow content using balanced
 * depth counting to handle nested element boundaries correctly.
 */
function skipToElementBoundaryEnd(
    move: HydrationMove,
    factories: CompiledViewBehaviorFactory[],
    startNode: Node,
    markers: HydrationMarkerStrategy,
    nativeMarkers: boolean,
) {
    let depth = 0;
    let current = move(true);
    while (current !== null) {
        if (isComment(current)) {
            if (
                nativeMarkers
                    ? current.data === "fe:e"
                    : markers.isElementBoundaryStartMarker(current)
            ) {
                current.data = "";
                depth++;
            } else if (
                nativeMarkers
                    ? current.data === "fe:/e"
                    : markers.isElementBoundaryEndMarker(current)
            ) {
                current.data = "";
                if (depth-- === 0) {
                    return;
                }
            }
        }
        current = move(true);
    }

    throwHydrationError(startNode, factories, expectedElementBoundaryEndMarker);
}

/**
 * Counts how many factories at the start of the array are host bindings (targetNodeId='h').
 * Host bindings target the custom element itself and are not represented by SSR markers,
 * so the factory pointer must start past them.
 */
function getHydrationIndexOffset(factories: CompiledViewBehaviorFactory[]): number {
    let offset = 0;

    while (offset < factories.length && factories[offset].targetNodeId === "h") {
        offset++;
    }

    return offset;
}

export function targetFactory(
    factory: ViewBehaviorFactory,
    node: Node,
    targets: ViewBehaviorTargets,
): void {
    const id = factory.targetNodeId;
    if (id === undefined) {
        // Dev error, this shouldn't ever be thrown
        throw new Error("Factory could not be target to the node");
    }

    targets[id] = node;
}
