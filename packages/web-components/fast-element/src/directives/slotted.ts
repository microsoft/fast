import { CaptureType } from "../template";
import { AttachedBehaviorDirective } from "./directive";
import { NodeBehaviorBehaviorOptions, NodeObservationBehavior } from "./node-observation";

/**
 * The options used to configure slotted node observation.
 * @public
 */
export interface SlottedBehaviorOptions<T = any>
    extends NodeBehaviorBehaviorOptions<T>,
        AssignedNodesOptions {}

/**
 * The runtime behavior for slotted node observation.
 * @public
 */
export class SlottedBehavior extends NodeObservationBehavior<SlottedBehaviorOptions> {
    /**
     * Creates an instance of SlottedBehavior.
     * @param target - The slot element target to observe.
     * @param options - The options to use when observing the slot.
     */
    public constructor(target: HTMLSlotElement, options: SlottedBehaviorOptions) {
        super(target, options);
    }

    /**
     * Begins observation of the nodes.
     */
    public observe(): void {
        this.target.addEventListener("slotchange", this);
    }

    /**
     * Disconnects observation of the nodes.
     */
    public disconnect(): void {
        this.target.removeEventListener("slotchange", this);
    }

    /**
     * Retrieves the nodes that should be assigned to the target.
     */
    protected getNodes(): Node[] {
        return this.target.assignedNodes(this.options);
    }
}

/**
 * A directive that observes the `assignedNodes()` of a slot and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure slotted node observation.
 * @public
 */
export function slotted<T = any>(
    propertyOrOptions: (keyof T & string) | SlottedBehaviorOptions<keyof T & string>
): CaptureType<T> {
    if (typeof propertyOrOptions === "string") {
        propertyOrOptions = { property: propertyOrOptions };
    }

    return new AttachedBehaviorDirective(
        "fast-slotted",
        SlottedBehavior,
        propertyOrOptions as any
    );
}
