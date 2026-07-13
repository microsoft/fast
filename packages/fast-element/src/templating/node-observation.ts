import { emptyArray } from "../platform.js";
import {
    StatelessAttachedAttributeDirective,
    type ViewController,
} from "./html-directive.js";

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

    /**
     * Assigns a single node to the property instead of an array of nodes.
     * @remarks
     * The node assigned is the first match in document order after `filter` is
     * applied; `single` does not assert that only one node matches. When nothing
     * matches, `null` is assigned.
     *
     * Because node observation includes text nodes by default, pair this with
     * `filter: elements()` or the whitespace text node between tags is usually
     * what gets assigned.
     *
     * When combined with `flatten: true` on `slotted`, an empty slot resolves to
     * the slot's default content, so the first default content node is assigned
     * rather than `null`.
     *
     * Do not pre-initialize the target property to `null`. Observables only notify
     * on a change, so a property already holding `null` that binds against an empty
     * slot or an empty child list will not run its change callback.
     */
    single?: boolean;
}

/**
 * Elements filter function type.
 *
 * @public
 */
export type ElementsFilter = (value: Node, index?: number, array?: Node[]) => boolean;

const selectElements = (value: Node): boolean => value.nodeType === 1;

/**
 * Creates a function that can be used to filter a Node array, selecting only elements.
 * @param selector - An optional selector to restrict the filter to.
 * @public
 */
export const elements = (selector?: string): ElementsFilter =>
    selector
        ? value => value.nodeType === 1 && (value as HTMLElement).matches(selector)
        : selectElements;

/**
 * A base class for node observation.
 * @public
 * @remarks
 * Internally used by the SlottedDirective and the ChildrenDirective.
 */
export abstract class NodeObservationDirective<
    T extends NodeBehaviorOptions,
> extends StatelessAttachedAttributeDirective<T> {
    private _id: string;
    private _controllerProperty: string;

    /**
     * The unique id of the factory.
     */
    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
        this._controllerProperty = `${value}-c`;
    }

    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    public targetNodeId: string;

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(controller: ViewController): void {
        const target = controller.targets[this.targetNodeId] as any;
        target[this._controllerProperty] = controller;
        this.updateTarget(controller.source, this.computeNodes(target));
        this.observe(target);
        controller.onUnbind(this);
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(controller: ViewController): void {
        const target = controller.targets[this.targetNodeId] as any;
        this.updateTarget(controller.source, emptyArray);
        this.disconnect(target);
        target[this._controllerProperty] = null;
    }

    /**
     * Gets the data source for the target.
     * @param target - The target to get the source for.
     * @returns The source.
     */
    protected getSource(target: Node) {
        return target[this._controllerProperty].source;
    }

    /**
     * Updates the source property with the computed nodes.
     * @param source - The source object to assign the nodes property to.
     * @param value - The nodes to assign to the source object property.
     * @remarks
     * When the `single` option is set, the first node is assigned instead of the
     * array, or `null` when there is no first node.
     */
    protected updateTarget(source: any, value: ReadonlyArray<any>): void {
        source[this.options.property] = this.options.single ? (value[0] ?? null) : value;
    }

    /**
     * Computes the set of nodes that should be assigned to the source property.
     * @param target - The target to compute the nodes for.
     * @returns The computed nodes.
     * @remarks
     * Applies filters if provided.
     */
    protected computeNodes(target: any): Node[] {
        let nodes = this.getNodes(target);

        if ("filter" in this.options) {
            nodes = nodes.filter(this.options.filter!);
        }

        return nodes;
    }

    /**
     * Begins observation of the nodes.
     * @param target - The target to observe.
     */
    protected abstract observe(target: any): void;

    /**
     * Disconnects observation of the nodes.
     * @param target - The target to unobserve.
     */
    protected abstract disconnect(target: any): void;

    /**
     * Retrieves the raw nodes that should be assigned to the source property.
     * @param target - The target to get the node to.
     */
    protected abstract getNodes(target: any): Node[];
}
