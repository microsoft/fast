import { NodeBehaviorOptions, NodeObservationBehavior } from "./node-observation";
import type { CaptureType } from "./template";
/**
 * The options used to configure child list observation.
 * @public
 */
export interface ChildListBehaviorOptions<T = any>
    extends NodeBehaviorOptions<T>,
        Omit<MutationObserverInit, "subtree" | "childList"> {}
/**
 * The options used to configure subtree observation.
 * @public
 */
export interface SubtreeBehaviorOptions<T = any>
    extends Omit<NodeBehaviorOptions<T>, "filter">,
        Omit<MutationObserverInit, "subtree" | "childList"> {
    /**
     * Indicates that child subtrees should be observed for changes.
     */
    subtree: boolean;
    /**
     * When subtrees are observed, a query selector is required to indicate
     * which of potentially many nodes should be assigned to the property.
     */
    selector: string;
}
/**
 * The options used to configure child/subtree node observation.
 * @public
 */
export declare type ChildrenBehaviorOptions<T = any> =
    | ChildListBehaviorOptions<T>
    | SubtreeBehaviorOptions<T>;
/**
 * The runtime behavior for child node observation.
 * @public
 */
export declare class ChildrenBehavior extends NodeObservationBehavior<
    ChildrenBehaviorOptions
> {
    private observer;
    /**
     * Creates an instance of ChildrenBehavior.
     * @param target - The element target to observe children on.
     * @param options - The options to use when observing the element children.
     */
    constructor(target: HTMLElement, options: ChildrenBehaviorOptions);
    /**
     * Begins observation of the nodes.
     */
    observe(): void;
    /**
     * Disconnects observation of the nodes.
     */
    disconnect(): void;
    /**
     * Retrieves the nodes that should be assigned to the target.
     */
    protected getNodes(): ChildNode[];
}
/**
 * A directive that observes the `childNodes` of an element and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure child node observation.
 * @public
 */
export declare function children<T = any>(
    propertyOrOptions: (keyof T & string) | ChildrenBehaviorOptions<keyof T & string>
): CaptureType<T>;
