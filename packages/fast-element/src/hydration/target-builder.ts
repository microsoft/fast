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
    return node.nodeType === Node.COMMENT_NODE;
}

function isText(node: Node): node is Text {
    return node.nodeType === Node.TEXT_NODE;
}

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
    range.setEnd(
        last,
        isComment(last) || isText(last) ? last.data.length : last.childNodes.length,
    );
    return range;
}

interface HydrationTraversal {
    nextNode(): Node | null;
    nextSibling(): Node | null;
    update(checkCurrent?: boolean): void;
    disconnect(): void;
}

function getTraversalRoot(firstNode: Node, lastNode: Node, range: Range): Node | null {
    if (
        firstNode === lastNode ||
        firstNode.contains(lastNode) ||
        lastNode.contains(firstNode)
    ) {
        return range.commonAncestorContainer;
    }

    const position = firstNode.compareDocumentPosition(lastNode);

    return (position & Node.DOCUMENT_POSITION_DISCONNECTED) === 0 &&
        (position & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
        ? range.commonAncestorContainer
        : null;
}

function getExclusiveTraversalStop(root: Node, lastNode: Node): Node | null {
    let current = lastNode;

    while (current !== root) {
        if (current.nextSibling !== null) {
            return current.nextSibling;
        }

        current = current.parentNode!;
    }

    return null;
}

function createHydrationTraversal(firstNode: Node, lastNode: Node): HydrationTraversal {
    const range = createRangeForNodes(firstNode, lastNode);
    const root = getTraversalRoot(firstNode, lastNode, range);
    const walker =
        root === null
            ? null
            : document.createTreeWalker(
                  root,
                  NodeFilter.SHOW_ELEMENT +
                      NodeFilter.SHOW_COMMENT +
                      NodeFilter.SHOW_TEXT,
              );
    const exclusiveStop =
        root === null ? null : getExclusiveTraversalStop(root, lastNode);
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    const endContainer = range.endContainer;
    const endOffset = range.endOffset;
    const exclusiveStopParent = exclusiveStop?.parentNode ?? null;
    const exclusiveStopPreviousSibling = exclusiveStop?.previousSibling ?? null;
    const exclusiveStopNextSibling = exclusiveStop?.nextSibling ?? null;
    let hasReachedLastNode = lastNode.contains(firstNode);
    let liveRangeWalker: TreeWalker | null = null;

    if (walker !== null) {
        walker.currentNode = firstNode;
    }

    function hasBoundaryAdjustment(): boolean {
        return (
            range.startContainer !== startContainer ||
            range.startOffset !== startOffset ||
            range.endContainer !== endContainer ||
            range.endOffset !== endOffset ||
            (exclusiveStop !== null &&
                (exclusiveStop.parentNode !== exclusiveStopParent ||
                    exclusiveStop.previousSibling !== exclusiveStopPreviousSibling ||
                    exclusiveStop.nextSibling !== exclusiveStopNextSibling))
        );
    }

    function isCurrentNodeInRange(): boolean {
        try {
            return range.comparePoint(walker!.currentNode, 0) === 0;
        } catch {
            return false;
        }
    }

    function switchToLiveRangeWalker(): void {
        liveRangeWalker = document.createTreeWalker(walker!.root, walker!.whatToShow, {
            acceptNode: node =>
                range.comparePoint(node, 0) === 0
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT,
        });
        liveRangeWalker.currentNode = walker!.currentNode;
    }

    function stopBeforeStaticBoundary(
        current: Node,
        candidate: Node | null,
    ): Node | null {
        if (
            candidate !== exclusiveStop &&
            (!hasReachedLastNode || candidate === null || lastNode.contains(candidate))
        ) {
            if (candidate === lastNode) {
                hasReachedLastNode = true;
            }

            return candidate;
        }

        walker!.currentNode = current;
        return null;
    }

    return {
        nextNode() {
            if (walker === null) {
                return null;
            }

            if (liveRangeWalker !== null) {
                return liveRangeWalker.nextNode();
            }

            const current = walker.currentNode;
            return stopBeforeStaticBoundary(current, walker.nextNode());
        },
        nextSibling() {
            if (walker === null) {
                return null;
            }

            if (liveRangeWalker !== null) {
                return liveRangeWalker.nextSibling();
            }

            const current = walker.currentNode;

            if (
                current.contains(lastNode) ||
                (exclusiveStop !== null && current.contains(exclusiveStop))
            ) {
                return null;
            }

            return stopBeforeStaticBoundary(current, walker.nextSibling());
        },
        update(checkCurrent = false) {
            if (
                walker !== null &&
                liveRangeWalker === null &&
                (hasBoundaryAdjustment() || (checkCurrent && !isCurrentNodeInRange()))
            ) {
                switchToLiveRangeWalker();
            }
        },
        disconnect() {
            range.detach();
        },
    };
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
    const traversal = createHydrationTraversal(firstNode, lastNode);

    const targets: ViewBehaviorTargets = {};
    const boundaries: ViewBehaviorBoundaries = {};

    // Sequential factory pointer — skip host bindings at the start
    const hydrationIndexOffset = getHydrationIndexOffset(factories);
    let factoryPointer = hydrationIndexOffset;

    let node: Node | null = firstNode;

    while (node !== null) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE: {
                const element = node as Element;
                const legacyIndices =
                    HydrationMarkup.parseLegacyAttributeBindingIndices(element);

                if (legacyIndices !== null) {
                    for (const index of legacyIndices) {
                        const factoryIndex = index + hydrationIndexOffset;
                        const factory = factories[factoryIndex];
                        if (!factory) {
                            const expected = formatNoMoreAttributeBindings(
                                factories.length,
                            );
                            const result = getHydrationDiagnostic().formatStructuralError(
                                node,
                                getHostName(node),
                                expected,
                            );
                            throw new HydrationTargetElementError(
                                result.message,
                                factories,
                                element,
                                result.expected,
                                result.received,
                            );
                        }

                        targetFactory(factory, node, targets);
                        factoryPointer = Math.max(factoryPointer, factoryIndex + 1);
                    }

                    HydrationMarkup.removeLegacyAttributeBindingMarkers(element);
                    traversal.update(true);
                    break;
                }

                const count = HydrationMarkup.parseAttributeBindingCount(element);
                if (count !== null) {
                    for (let i = 0; i < count; i++) {
                        const factory = factories[factoryPointer++];
                        if (!factory) {
                            const expected = formatNoMoreAttributeBindings(
                                factories.length,
                            );
                            const result = getHydrationDiagnostic().formatStructuralError(
                                node,
                                getHostName(node),
                                expected,
                            );
                            throw new HydrationTargetElementError(
                                result.message,
                                factories,
                                node as Element,
                                result.expected,
                                result.received,
                            );
                        }
                        targetFactory(factory, node, targets);
                    }
                    element.removeAttribute(HydrationMarkup.attributeMarkerName);
                    traversal.update(true);
                }
                break;
            }

            case Node.COMMENT_NODE: {
                const data = (node as Comment).data;
                if (HydrationMarkup.isElementBoundaryStartMarker(node)) {
                    // Element boundary — clear start marker and skip subtree
                    (node as Comment).data = "";
                    traversal.update();
                    skipToElementBoundaryEnd(traversal, factories, node);
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
                        const expected = formatNoMoreContentBindings(factories.length);
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
                    targetContentBinding(
                        node as Comment,
                        traversal,
                        factory,
                        factories,
                        targets,
                        boundaries,
                    );
                }
                break;
            }
        }

        node = traversal.nextNode();
    }

    traversal.disconnect();
    return { targets, boundaries };
}

function targetContentBinding(
    node: Comment,
    traversal: HydrationTraversal,
    factory: CompiledViewBehaviorFactory,
    factories: CompiledViewBehaviorFactory[],
    targets: ViewBehaviorTargets,
    boundaries: ViewBehaviorBoundaries,
) {
    const nodes: Node[] = [];
    let current: Node | null = traversal.nextSibling();
    node.data = "";
    traversal.update();

    if (current === null) {
        const expected = expectedContentAfterStartMarker;
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
        nodes.push(current);
        current = traversal.nextSibling();
    }

    if (current === null) {
        const expected = expectedContentEndMarker;
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

    (current as Comment).data = "";
    traversal.update();

    if (nodes.length === 1 && isText(nodes[0])) {
        targetFactory(factory, nodes[0], targets);
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
        const dummyTextNode = current.parentNode!.insertBefore(
            document.createTextNode(""),
            current,
        );
        traversal.update();
        targetFactory(factory, dummyTextNode, targets);
    }
}

/**
 * Skips past a nested custom element's shadow content using balanced
 * depth counting to handle nested element boundaries correctly.
 */
function skipToElementBoundaryEnd(
    traversal: HydrationTraversal,
    factories: CompiledViewBehaviorFactory[],
    startNode: Node,
) {
    let depth = 0;
    let current = traversal.nextSibling();
    while (current !== null) {
        if (isComment(current)) {
            if (HydrationMarkup.isElementBoundaryStartMarker(current)) {
                current.data = "";
                traversal.update();
                depth++;
            } else if (HydrationMarkup.isElementBoundaryEndMarker(current)) {
                if (depth === 0) {
                    current.data = "";
                    traversal.update();
                    return;
                }
                current.data = "";
                traversal.update();
                depth--;
            }
        }
        current = traversal.nextSibling();
    }

    const expected = expectedElementBoundaryEndMarker;
    const result = getHydrationDiagnostic().formatStructuralError(
        startNode,
        getHostName(startNode),
        expected,
    );
    throw new HydrationTargetElementError(
        result.message,
        factories,
        startNode,
        result.expected,
        result.received,
    );
}

/**
 * Counts how many factories at the start of the array are host bindings (targetNodeId='h').
 * Host bindings target the custom element itself and are not represented by SSR markers,
 * so the factory pointer must start past them.
 */
function getHydrationIndexOffset(factories: CompiledViewBehaviorFactory[]): number {
    let offset = 0;

    for (let i = 0, ii = factories.length; i < ii; ++i) {
        if (factories[i].targetNodeId === "h") {
            offset++;
        } else {
            break;
        }
    }

    return offset;
}

export function targetFactory(
    factory: ViewBehaviorFactory,
    node: Node,
    targets: ViewBehaviorTargets,
): void {
    if (factory.targetNodeId === undefined) {
        // Dev error, this shouldn't ever be thrown
        throw new Error("Factory could not be target to the node");
    }

    targets[factory.targetNodeId] = node;
}
