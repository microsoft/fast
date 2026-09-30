import { HydrationMarkup } from "../components/hydration.js";
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

function createHydrationTraversal(
    firstNode: Node,
    lastNode: Node,
): [HydrationMove, () => void] {
    const range = createRangeForNodes(firstNode, lastNode);
    let walker =
        range.startContainer === firstNode
            ? document.createTreeWalker(range.commonAncestorContainer, hydrationNodeMask)
            : null;
    let hasReachedLastNode = lastNode.contains(firstNode);
    let mutationMode = false;

    if (walker !== null) {
        walker.currentNode = firstNode;
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
            if (
                walker !== null &&
                !mutationMode &&
                (range.startContainer !== firstNode ||
                    range.endContainer !== lastNode ||
                    range.endOffset !== getNodeLength(lastNode) ||
                    !range.intersectsNode(walker.currentNode))
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
 * server-rendered shadow root. Uses a TreeWalker to scan the existing DOM between
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
    const [move, update] = createHydrationTraversal(firstNode, lastNode);

    const targets: ViewBehaviorTargets = {};
    const boundaries: ViewBehaviorBoundaries = {};

    // Sequential factory pointer — skip host bindings at the start
    const hydrationIndexOffset = getHydrationIndexOffset(factories);
    let factoryPointer = hydrationIndexOffset;

    let node: Node | null = firstNode;

    while (node !== null) {
        switch (node.nodeType) {
            case 1: {
                const element = node as Element;
                const legacyIndices =
                    HydrationMarkup.parseLegacyAttributeBindingIndices(element);

                if (legacyIndices !== null) {
                    for (const index of legacyIndices) {
                        const factoryIndex = index + hydrationIndexOffset;
                        const factory = factories[factoryIndex];
                        if (!factory) {
                            throwHydrationError(
                                node,
                                factories,
                                formatNoMoreAttributeBindings(factories.length),
                            );
                        }

                        targetFactory(factory, node, targets);
                        factoryPointer = Math.max(factoryPointer, factoryIndex + 1);
                    }

                    HydrationMarkup.removeLegacyAttributeBindingMarkers(element);
                    update();
                    break;
                }

                const count = HydrationMarkup.parseAttributeBindingCount(element);
                if (count !== null) {
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
                    element.removeAttribute(HydrationMarkup.attributeMarkerName);
                    update();
                }
                break;
            }

            case 8: {
                const data = (node as Comment).data;
                if (HydrationMarkup.isElementBoundaryStartMarker(node)) {
                    // Element boundary — clear start marker and skip subtree
                    (node as Comment).data = "";
                    skipToElementBoundaryEnd(move, factories, node);
                } else if (HydrationMarkup.isContentBindingStartMarker(data)) {
                    // Content binding — consume next factory
                    const legacyIndex =
                        HydrationMarkup.parseLegacyContentBindingStartIndex(data);
                    const factoryIndex =
                        legacyIndex === null
                            ? factoryPointer++
                            : legacyIndex + hydrationIndexOffset;
                    const factory = factories[factoryIndex];
                    factoryPointer = Math.max(factoryPointer, factoryIndex + 1);

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
            if (HydrationMarkup.isContentBindingStartMarker(current.data)) {
                depth++;
            } else if (HydrationMarkup.isContentBindingEndMarker(current.data)) {
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
) {
    let depth = 0;
    let current = move(true);
    while (current !== null) {
        if (isComment(current)) {
            if (HydrationMarkup.isElementBoundaryStartMarker(current)) {
                current.data = "";
                depth++;
            } else if (HydrationMarkup.isElementBoundaryEndMarker(current)) {
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
