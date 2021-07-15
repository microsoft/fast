import { NodeBehaviorOptions, NodeObservationBehavior } from "./node-observation";
import type { CaptureType } from "./template";
/**
 * The options used to configure slotted node observation.
 * @public
 */
export interface SlottedBehaviorOptions<T = any>
    extends NodeBehaviorOptions<T>,
        AssignedNodesOptions {}
/**
 * The runtime behavior for slotted node observation.
 * @public
 */
export declare class SlottedBehavior extends NodeObservationBehavior<
    SlottedBehaviorOptions
> {
    /**
     * Creates an instance of SlottedBehavior.
     * @param target - The slot element target to observe.
     * @param options - The options to use when observing the slot.
     */
    constructor(target: HTMLSlotElement, options: SlottedBehaviorOptions);
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
    protected getNodes(): Node[];
}
/**
 * A directive that observes the `assignedNodes()` of a slot and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure slotted node observation.
 * @public
 */
export declare function slotted<T = any>(
    propertyOrOptions: (keyof T & string) | SlottedBehaviorOptions<keyof T & string>
): CaptureType<T>;
