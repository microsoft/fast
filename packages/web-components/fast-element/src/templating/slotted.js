import { AttachedBehaviorHTMLDirective } from "./html-directive";
import { NodeObservationBehavior } from "./node-observation";
/**
 * The runtime behavior for slotted node observation.
 * @public
 */
export class SlottedBehavior extends NodeObservationBehavior {
    /**
     * Creates an instance of SlottedBehavior.
     * @param target - The slot element target to observe.
     * @param options - The options to use when observing the slot.
     */
    constructor(target, options) {
        super(target, options);
    }
    /**
     * Begins observation of the nodes.
     */
    observe() {
        this.target.addEventListener("slotchange", this);
    }
    /**
     * Disconnects observation of the nodes.
     */
    disconnect() {
        this.target.removeEventListener("slotchange", this);
    }
    /**
     * Retrieves the nodes that should be assigned to the target.
     */
    getNodes() {
        return this.target.assignedNodes(this.options);
    }
}
/**
 * A directive that observes the `assignedNodes()` of a slot and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure slotted node observation.
 * @public
 */
export function slotted(propertyOrOptions) {
    if (typeof propertyOrOptions === "string") {
        propertyOrOptions = { property: propertyOrOptions };
    }
    return new AttachedBehaviorHTMLDirective(
        "fast-slotted",
        SlottedBehavior,
        propertyOrOptions
    );
}
