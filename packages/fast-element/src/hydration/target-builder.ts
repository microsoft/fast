import { isAttributeUnobserved } from "../components/attribute-observation.js";
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
import {
    createHydrationTraversal,
    type HydrationMove,
    isComment,
    isText,
} from "./traversal.js";

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
const removeAttribute = Element.prototype.removeAttribute;
const getAttribute = Element.prototype.getAttribute;
const hasAttribute = Element.prototype.hasAttribute;

function hasNativeAttributeMethod(
    element: Element,
    name: "getAttribute" | "removeAttribute",
    method: typeof getAttribute | typeof removeAttribute,
): boolean {
    let current: object | null = element;
    while (current !== null) {
        const descriptor = Object.getOwnPropertyDescriptor(current, name);
        if (descriptor !== void 0) return descriptor.value === method;
        current = Object.getPrototypeOf(current);
    }
    return false;
}

function canMutateOnAttributeRemoval(element: Element, unobserved: boolean): boolean {
    if (unobserved) {
        return (
            hasAttribute.call(element, "is") ||
            !hasNativeAttributeMethod(element, "removeAttribute", removeAttribute)
        );
    }
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
                const unobserved =
                    nativeMarkers &&
                    element.localName.includes("-") &&
                    isAttributeUnobserved(element, "data-fe");
                if (
                    unobserved
                        ? !hasNativeAttributeMethod(element, "getAttribute", getAttribute)
                        : element.getAttribute !== getAttribute
                ) {
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
                        if (canMutateOnAttributeRemoval(element, unobserved)) {
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

                    if (canMutateOnAttributeRemoval(element, false)) {
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
