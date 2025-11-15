import { isString } from "../interfaces.js";
import { HTMLDirective } from "./html-directive.js";
import { NodeBehaviorOptions, NodeObservationDirective } from "./node-observation.js";
import type { CaptureType } from "./template.js";

const slotEvent = "slotchange";

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
    observe(target: EventSource): void {
        target.addEventListener(slotEvent, this);
    }

    /**
     * Disconnects observation of the nodes.
     * @param target - The target to unobserve.
     */
    disconnect(target: EventSource): void {
        target.removeEventListener(slotEvent, this);
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
        this.updateTarget(this.getSource(target), this.computeNodes(target));
    }
}

HTMLDirective.define(SlottedDirective);

/**
 * A directive that observes the `assignedNodes()` of a slot and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure slotted node observation.
 * @public
 */
export function slotted<TSource = any, TParent = any>(
    propertyOrOptions:
        | (keyof TSource & string)
        | SlottedDirectiveOptions<keyof TSource & string>
): CaptureType<TSource, TParent> {
    if (isString(propertyOrOptions)) {
        propertyOrOptions = { property: propertyOrOptions };
    }

    return new SlottedDirective(
        propertyOrOptions as SlottedDirectiveOptions<keyof TSource & string>
    );
}
