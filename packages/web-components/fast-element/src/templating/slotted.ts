import { NodeObservationDirective, NodeBehaviorOptions } from "./node-observation";
import type { CaptureType } from "./template";

/**
 * The options used to configure slotted node observation.
 * @public
 */
export interface SlottedDirectiveOptions<T = any>
    extends NodeBehaviorOptions<T>,
        AssignedNodesOptions {}

/**
 * The runtime behavior for slotted node observation.
 * @public
 */
export class SlottedDirective extends NodeObservationDirective<SlottedDirectiveOptions> {
    /**
     * Begins observation of the nodes.
     * @param target - The target to observe.
     */
    observe(target: EventSource) {
        target.addEventListener("slotchange", this);
    }

    /**
     * Disconnects observation of the nodes.
     * @param target - The target to unobserve.
     */
    disconnect(target: EventSource) {
        target.removeEventListener("slotchange", this);
    }

    /**
     * Retrieves the raw nodes that should be assigned to the source property.
     * @param target - The target to get the node to.
     */
    getNodes(target: HTMLSlotElement): Node[] {
        return target.assignedNodes(this.options);
    }

    /** @internal */
    handleEvent(event: Event): void {
        const target = event.currentTarget as any;
        const source = target.$fastSource;
        this.updateTarget(source, this.computeNodes(target));
    }
}

/**
 * A directive that observes the `assignedNodes()` of a slot and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure slotted node observation.
 * @public
 */
export function slotted<T = any>(
    propertyOrOptions: (keyof T & string) | SlottedDirectiveOptions<keyof T & string>
): CaptureType<T> {
    if (typeof propertyOrOptions === "string") {
        propertyOrOptions = { property: propertyOrOptions };
    }

    return new SlottedDirective(
        propertyOrOptions as SlottedDirectiveOptions<keyof T & string>
    );
}
