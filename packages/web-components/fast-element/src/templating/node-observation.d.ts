import type { Behavior } from "../observation/behavior";
/**
 * Options for configuring node observation behavior.
 * @public
 */
export interface NodeBehaviorOptions<T = any> {
    /**
     * The property to assign the observed nodes to.
     */
    property: T;
    /**
     * Filters nodes that are synced with the property.
     * Called one time for each element in the array.
     * @param value - The Node that is being inspected.
     * @param index - The index of the node within the array.
     * @param array - The Node array that is being filtered.
     */
    filter?: ElementsFilter;
}
/**
 * Elements filter function type.
 *
 * @public
 */
export declare type ElementsFilter = (
    value: Node,
    index: number,
    array: Node[]
) => boolean;
/**
 * Creates a function that can be used to filter a Node array, selecting only elements.
 * @param selector - An optional selector to restrict the filter to.
 * @public
 */
export declare function elements(selector?: string): ElementsFilter;
/**
 * A base class for node observation.
 * @internal
 */
export declare abstract class NodeObservationBehavior<T extends NodeBehaviorOptions>
    implements Behavior {
    protected target: HTMLElement;
    protected options: T;
    private source;
    private shouldUpdate;
    /**
     * Creates an instance of NodeObservationBehavior.
     * @param target - The target to assign the nodes property on.
     * @param options - The options to use in configuring node observation.
     */
    constructor(target: HTMLElement, options: T);
    /**
     * Begins observation of the nodes.
     */
    abstract observe(): void;
    /**
     * Disconnects observation of the nodes.
     */
    abstract disconnect(): void;
    /**
     * Retrieves the nodes that should be assigned to the target.
     */
    protected abstract getNodes(): Node[];
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source: any): void;
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    unbind(): void;
    /** @internal */
    handleEvent(): void;
    private computeNodes;
    private updateTarget;
}
