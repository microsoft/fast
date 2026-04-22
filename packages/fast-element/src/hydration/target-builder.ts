import { HydrationMarkup } from "../components/hydration.js";
import type {
    CompiledViewBehaviorFactory,
    ViewBehaviorFactory,
    ViewBehaviorTargets,
} from "../templating/html-directive.js";

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
        public readonly node: Element,
    ) {
        super(message);
    }
}

/**
 * Represents the DOM boundaries controlled by a view
 */
export interface ViewBoundaries {
    first: Node;
    last: Node;
}

/**
 * Stores relationships between a {@link ViewBehaviorFactory} and
 * the {@link ViewBoundaries} the factory created.
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

function isShadowRoot(node: Node): node is ShadowRoot {
    return node instanceof DocumentFragment && "mode" in node;
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
 * For comment nodes: `f:b` markers consume the next factory for content bindings,
 * using balanced depth counting for nested marker pairing. `f:e` markers cause
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
    const range = createRangeForNodes(firstNode, lastNode);
    const treeRoot = range.commonAncestorContainer;
    const walker = document.createTreeWalker(
        treeRoot,
        NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                return range.comparePoint(node, 0) === 0
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            },
        },
    );

    const targets: ViewBehaviorTargets = {};
    const boundaries: ViewBehaviorBoundaries = {};

    // Sequential factory pointer — skip host bindings at the start
    let factoryPointer = getHydrationIndexOffset(factories);

    let node: Node | null = (walker.currentNode = firstNode);

    while (node !== null) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE: {
                const count = HydrationMarkup.parseAttributeBindingCount(node as Element);
                if (count !== null) {
                    for (let i = 0; i < count; i++) {
                        const factory = factories[factoryPointer++];
                        if (!factory) {
                            throw new HydrationTargetElementError(
                                `HydrationView was unable to successfully target factory on ${
                                    node.nodeName
                                } inside ${
                                    (node.getRootNode() as ShadowRoot).host.nodeName
                                }. This likely indicates a template mismatch between SSR rendering and hydration.`,
                                factories,
                                node as Element,
                            );
                        }
                        targetFactory(factory, node, targets);
                    }
                    (node as Element).removeAttribute(
                        HydrationMarkup.attributeMarkerName,
                    );
                }
                break;
            }

            case Node.COMMENT_NODE: {
                const data = (node as Comment).data;
                if (data === "f:e") {
                    // Element boundary — skip subtree
                    skipToElementBoundaryEnd(walker);
                } else if (data === "f:b") {
                    // Content binding — consume next factory
                    const factory = factories[factoryPointer++];
                    targetContentBinding(
                        node as Comment,
                        walker,
                        factory,
                        targets,
                        boundaries,
                    );
                }
                break;
            }
        }

        node = walker.nextNode();
    }

    range.detach();
    return { targets, boundaries };
}

function targetContentBinding(
    node: Comment,
    walker: TreeWalker,
    factory: CompiledViewBehaviorFactory,
    targets: ViewBehaviorTargets,
    boundaries: ViewBehaviorBoundaries,
) {
    const nodes: Node[] = [];
    let current: Node | null = walker.nextSibling();
    node.data = "";
    const first = current!;

    // Balanced depth counting for nested content markers
    let depth = 0;
    while (current !== null) {
        if (isComment(current)) {
            if (current.data === "f:b") {
                depth++;
            } else if (current.data === "f:/b") {
                if (depth === 0) break;
                depth--;
            }
        }
        nodes.push(current);
        current = walker.nextSibling();
    }

    if (current === null) {
        const root = node.getRootNode();
        throw new Error(
            `Error hydrating Comment node inside "${
                isShadowRoot(root) ? root.host.nodeName : root.nodeName
            }".`,
        );
    }

    (current as Comment).data = "";

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
        targetFactory(factory, dummyTextNode, targets);
    }
}

/**
 * Skips past a nested custom element's shadow content using balanced
 * depth counting to handle nested element boundaries correctly.
 */
function skipToElementBoundaryEnd(walker: TreeWalker) {
    let depth = 0;
    let current = walker.nextSibling();
    while (current !== null) {
        if (isComment(current)) {
            if (current.data === "f:e") depth++;
            else if (current.data === "f:/e") {
                if (depth === 0) break;
                depth--;
            }
        }
        current = walker.nextSibling();
    }
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
