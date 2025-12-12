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
        public readonly node: Element
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
        isComment(last) || isText(last) ? last.data.length : last.childNodes.length
    );
    return range;
}

function isShadowRoot(node: Node): node is ShadowRoot {
    return node instanceof DocumentFragment && "mode" in node;
}

/**
 * Maps {@link CompiledViewBehaviorFactory} ids to the corresponding node targets for the view.
 * @param firstNode - The first node of the view.
 * @param lastNode -  The last node of the view.
 * @param factories - The Compiled View Behavior Factories that belong to the view.
 * @returns - A {@link ViewBehaviorTargets } object for the factories in the view.
 */
export function buildViewBindingTargets(
    firstNode: Node,
    lastNode: Node,
    factories: CompiledViewBehaviorFactory[]
): { targets: ViewBehaviorTargets; boundaries: ViewBehaviorBoundaries } {
    const range = createRangeForNodes(firstNode, lastNode);
    const treeRoot = range.commonAncestorContainer;
    const hydrationIndexOffset = getHydrationIndexOffset(factories);
    const walker = document.createTreeWalker(
        treeRoot,
        NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                return range.comparePoint(node, 0) === 0
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            },
        }
    );
    const targets: ViewBehaviorTargets = {};
    const boundaries: ViewBehaviorBoundaries = {};

    let node: Node | null = (walker.currentNode = firstNode);

    while (node !== null) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE: {
                targetElement(node as Element, factories, targets, hydrationIndexOffset);
                break;
            }

            case Node.COMMENT_NODE: {
                targetComment(
                    node as Comment,
                    walker,
                    factories,
                    targets,
                    boundaries,
                    hydrationIndexOffset
                );
                break;
            }
        }

        node = walker.nextNode();
    }

    range.detach();
    return { targets, boundaries };
}

function targetElement(
    node: Element,
    factories: CompiledViewBehaviorFactory[],
    targets: ViewBehaviorTargets,
    hydrationIndexOffset: number
) {
    // Check for attributes and map any factories.
    const attrFactoryIds =
        HydrationMarkup.parseAttributeBinding(node) ??
        HydrationMarkup.parseEnumeratedAttributeBinding(node) ??
        HydrationMarkup.parseCompactAttributeBinding(node);

    if (attrFactoryIds !== null) {
        for (const id of attrFactoryIds) {
            const factory = factories[id + hydrationIndexOffset];
            if (!factory) {
                throw new HydrationTargetElementError(
                    `HydrationView was unable to successfully target factory on ${
                        node.nodeName
                    } inside ${
                        (node.getRootNode() as ShadowRoot).host.nodeName
                    }. This likely indicates a template mismatch between SSR rendering and hydration.`,
                    factories,
                    node
                );
            }
            targetFactory(factory, node, targets);
        }

        node.removeAttribute(HydrationMarkup.attributeMarkerName);
    }
}

function targetComment(
    node: Comment,
    walker: TreeWalker,
    factories: CompiledViewBehaviorFactory[],
    targets: ViewBehaviorTargets,
    boundaries: ViewBehaviorBoundaries,
    hydrationIndexOffset: number
) {
    if (HydrationMarkup.isElementBoundaryStartMarker(node)) {
        skipToElementBoundaryEndMarker(node, walker);
        return;
    }

    if (HydrationMarkup.isContentBindingStartMarker(node.data)) {
        const parsed = HydrationMarkup.parseContentBindingStartMarker(node.data);

        if (parsed === null) {
            return;
        }

        const [index, id] = parsed;

        const factory = factories[index + hydrationIndexOffset];
        const nodes: Node[] = [];
        let current: Node | null = walker.nextSibling();
        node.data = "";
        const first = current!;

        // Search for the binding end marker that closes the binding.
        while (current !== null) {
            if (isComment(current)) {
                const parsed = HydrationMarkup.parseContentBindingEndMarker(current.data);

                if (parsed && parsed[1] === id) {
                    break;
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
                }".`
            );
        }

        (current as Comment).data = "";
        if (nodes.length === 1 && isText(nodes[0])) {
            targetFactory(factory, nodes[0], targets);
        } else {
            // If current === first, it means there is no content in
            // the view. This happens when a `when` directive evaluates false,
            // or whenever a content binding returns null or undefined.
            // In that case, there will never be any content
            // to hydrate and Binding can simply create a HTMLView
            // whenever it needs to.
            if (current !== first && current.previousSibling !== null) {
                boundaries[factory.targetNodeId] = {
                    first,
                    last: current.previousSibling,
                };
            }
            // Binding evaluates to null / undefined or a template.
            // If binding revaluates to string, it will replace content in target
            // So we always insert a text node to ensure that
            // text content binding will be written to this text node instead of comment
            const dummyTextNode = current.parentNode!.insertBefore(
                document.createTextNode(""),
                current
            );
            targetFactory(factory, dummyTextNode, targets);
        }
    }
}

/**
 * Moves TreeWalker to element boundary end marker
 * @param node - element boundary start marker node
 * @param walker - tree walker
 */
function skipToElementBoundaryEndMarker(node: Comment, walker: TreeWalker) {
    const id = HydrationMarkup.parseElementBoundaryStartMarker(node.data);
    let current = walker.nextSibling();

    while (current !== null) {
        if (isComment(current)) {
            const parsed = HydrationMarkup.parseElementBoundaryEndMarker(current.data);
            if (parsed && parsed === id) {
                break;
            }
        }

        current = walker.nextSibling();
    }
}

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
    targets: ViewBehaviorTargets
): void {
    if (factory.targetNodeId === undefined) {
        // Dev error, this shouldn't ever be thrown
        throw new Error("Factory could not be target to the node");
    }

    targets[factory.targetNodeId] = node;
}
